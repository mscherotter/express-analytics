/** Express Analytics
 * Copyright (c) 2025 Scherotter Enterprises
 */
import { AddOnSDKAPI } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
/** Adobe Express Add-on Analytics */
export declare class ExpressAnalytics {
    private _addOnSDK;
    private _endpoint;
    private _devEndpoint;
    private _addOnName;
    private _timeout?;
    /** whether to log errors to the browser console */
    static LogErrors: boolean;
    /** The pulse interval in milliseconds (default is 15 seconds) */
    static PulseInterval: number;
    /** Create an analytics object
     * @param addOnSDK the Adobe Express add-on SDK
     * @param endpoint the https:// production endpoint
     * @param devEndpoint the https:// development endpoint, if not specified the
     * endpoint will be used when in development
     */
    constructor(addOnSDK: AddOnSDKAPI, endpoint: string, devEndpoint?: string);
    /** stop the pulse interval */
    dispose(): void;
    /** track a user
     * @param extra extra fields to add
     * @returns an async promise with a boolean value indicating whether the tracking POST succeeded
     */
    trackUserAsync(extra?: Record<string, string>): Promise<boolean>;
    /** track an event
     * @param eventName: the event name
     * @param extra: extra parameters to record
     * @returns an async promise with a boolean value indicating whether the tracking
     *  was successful.
     */
    trackEventAsync(eventName: string, extra?: Record<string, string>): Promise<boolean>;
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
    trackErrorAsync(error: Error, extra?: Record<string, string>): Promise<boolean>;
    private static get isDevelopment();
    private static addExtra;
    private static onPulseAsync;
    private getUrl;
}
