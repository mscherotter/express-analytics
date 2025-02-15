# Adobe Express Add-on Analytics

Analytics for Adobe Express Add-ons

## Install

    npm install express-addon-analytics

## Usage

### Tracking a user (once per session)

    import { ExpressAnalytics} from "express-addon-analytics/ExpressAnalytics";

    // in App.firstUpdated() function 
    await this.addOnUISdk.ready;

    const analytics = new ExpressAnalytics(this.addOnUISdk, "AddOnName, "https://myendpointUrl.com");

    await analytics.trackUserAsync();

### Tracking an event (multiple times per session)

    import { ExpressAnalytics} from "express-addon-analytics/ExpressAnalytics";
    ....

    // this.addOnUISdk has already been initialized

    const analytics = new ExpressAnalytics(this.addOnUISdk, "AddOnName, "https://myendpointUrl.com");

    // track a page deletion event passing the page width and height as parameters
    await analytics.trackEventAsync("delete_page", {
        width: pageWidth, 
        height: pageHeight});

    