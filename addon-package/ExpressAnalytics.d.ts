/** Express Analytics
 * Copyright (c) 2025 Michael S. Scherotter
 */
/** Interface from Adobe Express addon SDK "@types/adobe__ccweb-add-on-sdk": "^1.3.0", */
export interface IAdobeExpressPlatform {
    deviceClass: string;
    inAppPurchaseAllowed: boolean;
    platform: string;
}
/** Interface from Adobe Express addon SDK "@types/adobe__ccweb-add-on-sdk": "^1.3.0", */
export interface IAdobeExpressAddOnSDKAPI {
    apiVersion: string;
    app: {
        currentUser: {
            userId(): Promise<string>;
            isPremiumUser(): Promise<boolean>;
        };
        devFlags: {
            simulateFreeUser: boolean;
        };
        getCurrentPlatform(): Promise<IAdobeExpressPlatform>;
        ui: {
            format: string;
            locale: string;
            theme: string;
        };
    };
    instance: {
        manifest: Record<string, unknown>;
    };
}
/** Adobe Express Add-on Analytics */
export declare class ExpressAnalytics {
    private _addOnSDK;
    private _endpoint;
    private _devEndpoint;
    private _addOnName;
    private getUrl;
    /** Create an analytics object
     * @param addOnSDK the Adobe Express add-on SDK
     * @param addOnName the name of the Add-on - this should not change once
     * you start collecting data
     * @param endpoint the production endpoint
     * @param devEndpoint the development endpoint, if not specified the
     * endpoint will be used when in development
     */
    constructor(addOnSDK: IAdobeExpressAddOnSDKAPI, addOnName: string, endpoint: string, devEndpoint?: string);
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
    private static addExtra;
}
