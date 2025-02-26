/** Express Analytics
 * Copyright (c) 2025 Scherotter Enterprises
 */

/** Interface from Adobe Express addon SDK "@types/adobe__ccweb-add-on-sdk": "^1.3.0", */
export interface IAdobeExpressPlatform{
    deviceClass: string;
    inAppPurchaseAllowed: boolean;
    platform: string;
}
/** Interface from Adobe Express addon SDK "@types/adobe__ccweb-add-on-sdk": "^1.3.0", */
export interface IAdobeExpressAddOnSDKAPI{
    /** the API version */
    apiVersion:string,
    /** the app */
    app: {
        /** the current user */
        currentUser: {
            /** the User Id
             * @returns an async promise with a string
             */
            userId(): Promise<string>,
            /** is the user premium
             * @returns an async promise with a boolean value
             */
            isPremiumUser() : Promise<boolean>
        },
        /** the developer flags */
        devFlags : {
            /** True to simulated a free user */
            simulateFreeUser: boolean
        },
        /** Gets the current platform
         * @returns an async promise with the Adobe Express Platform
         */
        getCurrentPlatform() : Promise<IAdobeExpressPlatform>,
        /** The user interface */
        ui:{
            /** the format */
            format:string,
            /** the locale */
            locale:string,
            /** the theme name */
            theme: string
        }
    },
    /** The add-on instance */
    instance: {
        /** The add-on manifest */
        manifest: Record<string, unknown>
    }
}

/** Adobe Express Add-on Analytics */
export class ExpressAnalytics{
    private _addOnSDK: IAdobeExpressAddOnSDKAPI;
    private _endpoint: string;
    private _devEndpoint: string;
    private _addOnName: string;
    private _timeout?: NodeJS.Timeout;

    /** The pulse interval in milliseconds (default is 15 seconds) */
    static PulseInterval = 15000;

    /** Create an analytics object
     * @param addOnSDK the Adobe Express add-on SDK
     * @param endpoint the https:// production endpoint
     * @param devEndpoint the https:// development endpoint, if not specified the 
     * endpoint will be used when in development
     */
    constructor(addOnSDK: IAdobeExpressAddOnSDKAPI, endpoint: string, devEndpoint?: string){
        if (!addOnSDK) throw new Error("Express Analytics: addOnSDK is undefined.");
        if (!endpoint) throw new Error("Express Analytics: endpoint cannot be empty.");
        if (!endpoint.startsWith("https://")) throw new Error("Express Analytics: endpoint must start with https://");
        if (devEndpoint && !devEndpoint.startsWith("https://")) throw new Error("Express Analytics: devEndpoint must start with https://");

        this._addOnSDK = addOnSDK;
        this._addOnName = encodeURIComponent(addOnSDK.instance.manifest.name as string);
        this._endpoint = endpoint;
        this._devEndpoint = devEndpoint ? devEndpoint : endpoint;

        if (!this._timeout){
            this._timeout = setInterval(ExpressAnalytics.onPulseAsync, ExpressAnalytics.PulseInterval, this);
        }
    }

    /** stop the pulse interval */
    dispose(){
        if (this._timeout){
            
            clearInterval(this._timeout);

            this._timeout = undefined;
        }
    }

    /** track a user
     * @para extra extra fields to add
     * @returns an async promise with a boolean value indicating whether the tracking POST succeeded
     */
    async trackUserAsync(extra?: Record<string,string>): Promise<boolean>{
        try{
            const userId = await this._addOnSDK.app.currentUser.userId();
            const isPremiumUser = await this._addOnSDK.app.currentUser.isPremiumUser();

            const platform = await this._addOnSDK.app.getCurrentPlatform();

            const screen = window.screen; 
            
            const parameters = [
                `a=${this._addOnSDK.apiVersion}`,
                `c=${screen.colorDepth}`,
                `d=${platform.deviceClass}`,
                `e=_user`,
                `f=${this._addOnSDK.app.ui.format}`,
                `h=${screen.height}`,
                `i=${platform.inAppPurchaseAllowed}`,
                `l=${this._addOnSDK.app.ui.locale}`,
                `n=${this._addOnName}`,
                `p=${isPremiumUser}`,
                `pd=${screen.pixelDepth}`,
                `pl=${platform.platform}`,
                `t=${this._addOnSDK.app.ui.theme}`,
                `u=${userId}`,
                `v=${this._addOnSDK.instance.manifest.version}`,
                `w=${screen.width}`
            ];

            if (ExpressAnalytics.isDevelopment){
                parameters.push(`s=${this._addOnSDK.app.devFlags.simulateFreeUser}`);
            }

            if (extra){
                // add extra parameters
                Object.entries(extra).forEach(ExpressAnalytics.addExtra, parameters);
            }

            const url = this.getUrl(parameters);

            const response = await fetch(url, {
                method:"POST"
            });

            if (response.ok){
                //const textResponse = await response.text();
                //console.info(`Express Analytics user tracked: ${textResponse}`);
            } else {
                const textResponse = await response.text();
                console.error(`Express Analytics user tracking error: ${textResponse}`);
            } 

            return response.ok;
        } catch(error:any){
            console.error(`Express Analytics user tracking error: ${error.message}`);
            return false;
        }
    }

    /** track an event
     * @param eventName: the event name 
     * @param extra: extra parameters to record
     * @returns an async promise with a boolean value indicating whether the tracking
     *  was successful.
     */
    async trackEventAsync(eventName: string, extra?: Record<string,string>) : Promise<boolean>{
        try{
            if (!eventName) throw new Error("Express Analytics: eventName cannot be blank");

            const reservedNames = ["_user", "_error"];

            if (reservedNames.includes(eventName)) throw new Error(`Express Analytics: Cannot track a ${eventName} event using trackEventAsync(), use trackUserAsync() or trackErrorAsync() instead.`);
            
            const userId = await this._addOnSDK.app.currentUser.userId();
            
            const parameters = [
                `e=${encodeURIComponent(eventName)}`,
                `n=${encodeURIComponent(this._addOnName)}`,
                `u=${userId}`
            ];

            if (extra){
                // add extra parameters
                Object.entries(extra).forEach(ExpressAnalytics.addExtra, parameters);
            }

            const url = this.getUrl(parameters);

            const response = await fetch(url, { 
                method:"post"
            });

            if (!response.ok){
                const text = await response.text();
                console.error(`Express Analytics error tracking event ${eventName}: ${text}.`);
            }

            return response.ok;
        } catch (error: any){
            console.error(`Express Analytics event tracking event: ${error.message}`);
            return false;
        }
    }

    /** Track an error 
     * @param error an Error object
     * @param extra the extra parameters
     * @returns an ansyc promise with a boolean value indicating whether the tracking was successful
     * @example
     * try{
     * ...
     * // code that throws an exception
     * ...
     * } catch(error:any) {
     *     await this.analytics.trackErrorAsync(error as Error);
     * }
     */
    async trackErrorAsync(error: Error, extra?: Record<string,string>) : Promise<boolean>{
        try{
            const userId = await this._addOnSDK.app.currentUser.userId();
            
            const parameters = [
                `e=_error`,
                `en=${encodeURIComponent(error.name)}`,
                `m=${encodeURIComponent(error.message)}`,
                `n=${encodeURIComponent(this._addOnName)}`,
                `u=${userId}`
            ];

            if (error.cause && typeof error.cause === 'string'){
                parameters.push(`c=${encodeURIComponent(error.cause)}`)
            }

            if (extra){
                // add extra parameters
                Object.entries(extra).forEach(ExpressAnalytics.addExtra, parameters);
            }

            const url = this.getUrl(parameters);

            let response;

            if (error.stack){
                response = await fetch(url, { 
                    method:"post",
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: error.stack
                });
            } else {
                response = await fetch(url, { 
                    method:"post"
                });
            }
            
            if (!response.ok){
                const text = await response.text();
                console.error(`Express Analytics error tracking error: ${text}.`);
            }

            return response.ok;
        } catch (error: any){
            console.error(`Express Analytics event tracking error: ${error.message}`);
            return false;
        }
    }

    private static get isDevelopment() {
        return process.env.NODE_ENV == "development";
    }

    private static addExtra(this: string[], value: [string,string]){
        const entry = `ex-${encodeURIComponent(value[0])}=${encodeURIComponent(value[1])}`;

        this.push(entry);
    } 

    private static async onPulseAsync(analytics: ExpressAnalytics){
        await analytics.trackEventAsync("_pulse");
    }

    private getUrl(parameters: any) {
        let url = this._endpoint;

        if (ExpressAnalytics.isDevelopment){
            url = this._devEndpoint;
        }
        url;

        if (url.includes("?")){
            return `${url}&${parameters.join("&")}`;
        }

        return `${url}?${parameters.join("&")}`;
    }
}

