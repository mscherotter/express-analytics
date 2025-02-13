import { AddOnSDKAPI} from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

export class ExpressAnalytics{
    private _addOnSDK: AddOnSDKAPI;
    private _endpoint: string;
    private _devEndpoint: string;
    private _addOnName: string;

    private get url() {
        let url = this._endpoint;

        if (process.env.NODE_ENV == "development"){
            url = this._devEndpoint;
        }
        return url;
    }

    /** Create an analytics object
     * @param addOnSDK the Adobe Express add-on SDK
     * @param addOnName the name of the Add-on - this should not change once
     * you start collecting data
     * @param endpoint the production endpoint
     * @param devEndpoint the development endpoint, if not specified the 
     * endpoint will be used when in development
     */
    constructor(addOnSDK: AddOnSDKAPI, addOnName: string,  endpoint: string, devEndpoint?: string){
        if (!addOnSDK) throw new Error("Express Analytics: addOnSDK is undefined.");

        this._addOnSDK = addOnSDK;
        this._addOnName = addOnName;
        this._endpoint = endpoint;
        this._devEndpoint = devEndpoint ? devEndpoint : endpoint;
    }

    /** track a user
     * @returns an async promise with a boolean value indicating whether the tracking POST succeeded
     */
    async trackUserAsync(){
        const userId = await this._addOnSDK.app.currentUser.userId();
        const isPremiumUser = await this._addOnSDK.app.currentUser.isPremiumUser();

        const platform = await this._addOnSDK.app.getCurrentPlatform();

        const width = window.screen.width;
        const height = window.screen.height;
        
        const parameters = [
            `a=${this._addOnSDK.apiVersion}`,
            `d=${platform.deviceClass}`,
            `e=user`,
            `f=${this._addOnSDK.app.ui.format}`,
            `h=${height}`,
            `i=${platform.inAppPurchaseAllowed}`,
            `l=${this._addOnSDK.app.ui.locale}`,
            `n=${this._addOnName}`,
            `p=${isPremiumUser}`,
            `pl=${platform.platform}`,
            `s=${this._addOnSDK.app.devFlags.simulateFreeUser}`,
            `t=${this._addOnSDK.app.ui.theme}`,
            `u=${userId}`,
            `v=${this._addOnSDK.instance.manifest.version}`,
            `w=${width}`
        ];

        const url = `${this.url}&${parameters.join("&")}`;

        const response = await fetch(url, { 
            method:"post"
        });

        if (!response.ok){
            console.error(`Error tracking user with Express Analytics: ${response.statusText}.`);
        }

        return response.ok;
    }

    /** track an event
     * @param eventName: the event name
     * @param extra: extra parameters to record
     */
    async trackEventAsync(eventName: string, extra?: Record<string,string>){
        if (eventName == "user") throw new Error("Express Analytics: Cannot track a user event using trackEventAsync(), use  trackUserAsync() instead.");
        
        const userId = await this._addOnSDK.app.currentUser.userId();
        
        const parameters = [
            `e=${eventName}`,
            `n=${this._addOnName}`,
            `u=${userId}`
        ];

        if (extra){
            // add extra parameters
            Object.entries(extra).forEach((value: [string, string])=>{
                const entry = `ex-${value[0]}=${value[1]}`;
                parameters.push(entry);
            })
        }

        const url = `${this.url}&${parameters.join("&")}`;

        const response = await fetch(url, { 
            method:"post"
        });

        if (!response.ok){
            console.error(`Error tracking event ${eventName} with Express Analytics: ${response.statusText}.`);
        }

        return response.ok;
    }
}