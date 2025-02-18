/** Express Analytics
 * Copyright (c) 2025 Scherotter Enterprises
 */
/** Interface from Adobe Express addon SDK "@types/adobe__ccweb-add-on-sdk": "^1.3.0", */
export interface IAdobeExpressPlatform {
    deviceClass: string;
    inAppPurchaseAllowed: boolean;
    platform: string;
}
/** Interface from Adobe Express addon SDK "@types/adobe__ccweb-add-on-sdk": "^1.3.0", */
export interface IAdobeExpressAddOnSDKAPI {
    /** the API version */
    apiVersion: string;
    /** the app */
    app: {
        /** the current user */
        currentUser: {
            /** the User Id
             * @returns an async promise with a string
             */
            userId(): Promise<string>;
            /** is the user premium
             * @returns an async promise with a boolean value
             */
            isPremiumUser(): Promise<boolean>;
        };
        /** the developer flags */
        devFlags: {
            /** True to simulated a free user */
            simulateFreeUser: boolean;
        };
        /** Gets the current platform
         * @returns an async promise with the Adobe Express Platform
         */
        getCurrentPlatform(): Promise<IAdobeExpressPlatform>;
        /** The user interface */
        ui: {
            /** the format */
            format: string;
            /** the locale */
            locale: string;
            /** the theme name */
            theme: string;
        };
    };
    /** The add-on instance */
    instance: {
        /** The add-on manifest */
        manifest: Record<string, unknown>;
    };
}
/** Adobe Express Add-on Analytics */
export declare class ExpressAnalytics {
    private _addOnSDK;
    private _endpoint;
    private _devEndpoint;
    private _addOnName;
    private static _pulseStarted;
    /** The pulse interval in milliseconds (default is 15 seconds) */
    static PulseInterval: number;
    /** Create an analytics object
     * @param addOnSDK the Adobe Express add-on SDK
     * @param endpoint the https:// production endpoint
     * @param devEndpoint the https:// development endpoint, if not specified the
     * endpoint will be used when in development
     */
    constructor(addOnSDK: IAdobeExpressAddOnSDKAPI, endpoint: string, devEndpoint?: string);
    /** track a user
     * @para extra extra fields to add
     * @returns an async promise with a boolean value indicating whether the tracking POST succeeded
     */
    trackUserAsync(extra?: Record<string, string>): Promise<boolean>;
    /** track an event
     * @param eventName: the event name
     * @param extra: extra parameters to record
     */
    trackEventAsync(eventName: string, extra?: Record<string, string>): Promise<boolean>;
    private static get isDevelopment();
    private static addExtra;
    private static onPulseAsync;
    private getUrl;
}
