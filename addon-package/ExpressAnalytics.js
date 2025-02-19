/** Express Analytics
 * Copyright (c) 2025 Scherotter Enterprises
 */
/** Adobe Express Add-on Analytics */
export class ExpressAnalytics {
    static { this._pulseStarted = false; }
    /** The pulse interval in milliseconds (default is 15 seconds) */
    static { this.PulseInterval = 15000; }
    /** Create an analytics object
     * @param addOnSDK the Adobe Express add-on SDK
     * @param endpoint the https:// production endpoint
     * @param devEndpoint the https:// development endpoint, if not specified the
     * endpoint will be used when in development
     */
    constructor(addOnSDK, endpoint, devEndpoint) {
        if (!addOnSDK)
            throw new Error("Express Analytics: addOnSDK is undefined.");
        if (!endpoint)
            throw new Error("Express Analytics: endpoint cannot be empty.");
        if (!endpoint.startsWith("https://"))
            throw new Error("Express Analytics: endpoint must start with https://");
        if (devEndpoint && !devEndpoint.startsWith("https://"))
            throw new Error("Express Analytics: devEndpoint must start with https://");
        this._addOnSDK = addOnSDK;
        this._addOnName = encodeURIComponent(addOnSDK.instance.manifest.name);
        this._endpoint = endpoint;
        this._devEndpoint = devEndpoint ? devEndpoint : endpoint;
        if (!ExpressAnalytics._pulseStarted) {
            setInterval(ExpressAnalytics.onPulseAsync, ExpressAnalytics.PulseInterval, this);
            ExpressAnalytics._pulseStarted = true;
        }
    }
    /** track a user
     * @para extra extra fields to add
     * @returns an async promise with a boolean value indicating whether the tracking POST succeeded
     */
    async trackUserAsync(extra) {
        try {
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
            if (ExpressAnalytics.isDevelopment) {
                parameters.push(`s=${this._addOnSDK.app.devFlags.simulateFreeUser}`);
            }
            if (extra) {
                // add extra parameters
                Object.entries(extra).forEach(ExpressAnalytics.addExtra, parameters);
            }
            const url = this.getUrl(parameters);
            const response = await fetch(url, {
                method: "POST"
            });
            if (response.ok) {
                //const textResponse = await response.text();
                //console.info(`Express Analytics user tracked: ${textResponse}`);
            }
            else {
                const textResponse = await response.text();
                console.error(`Express Analytics user tracking error: ${textResponse}`);
            }
            return response.ok;
        }
        catch (error) {
            console.error(`Express Analytics user tracking error: ${error.message}`);
            return false;
        }
    }
    /** track an event
     * @param eventName: the event name
     * @param extra: extra parameters to record
     */
    async trackEventAsync(eventName, extra) {
        try {
            if (!eventName)
                throw new Error("Express Analytics: eventName cannot be blank");
            if (eventName == "_user")
                throw new Error("Express Analytics: Cannot track a user event using trackEventAsync(), use  trackUserAsync() instead.");
            const userId = await this._addOnSDK.app.currentUser.userId();
            const parameters = [
                `e=${encodeURIComponent(eventName)}`,
                `n=${encodeURIComponent(this._addOnName)}`,
                `u=${userId}`
            ];
            if (extra) {
                // add extra parameters
                Object.entries(extra).forEach(ExpressAnalytics.addExtra, parameters);
            }
            const url = this.getUrl(parameters);
            const response = await fetch(url, {
                method: "post"
            });
            if (!response.ok) {
                const text = await response.text();
                console.error(`Express Analytics error tracking event ${eventName}: ${text}.`);
            }
            return response.ok;
        }
        catch (error) {
            console.error(`Express Analytics event tracking tracking error: ${error.message}`);
            return false;
        }
    }
    static get isDevelopment() {
        return process.env.NODE_ENV == "development";
    }
    static addExtra(value) {
        const entry = `ex-${encodeURIComponent(value[0])}=${encodeURIComponent(value[1])}`;
        this.push(entry);
    }
    static async onPulseAsync(analytics) {
        await analytics.trackEventAsync("_pulse");
    }
    getUrl(parameters) {
        let url = this._endpoint;
        if (ExpressAnalytics.isDevelopment) {
            url = this._devEndpoint;
        }
        url;
        if (url.includes("?")) {
            return `${url}&${parameters.join("&")}`;
        }
        return `${url}?${parameters.join("&")}`;
    }
}
