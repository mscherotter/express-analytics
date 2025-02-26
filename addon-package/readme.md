# Adobe Express Add-on Analytics

Analytics for Adobe Express Add-ons

## Install

    npm install express-addon-analytics

## Usage

### Tracking a user (once per session)

    import { ExpressAnalytics} from "express-addon-analytics/ExpressAnalytics";

    // in App.firstUpdated() function 
    await this.addOnUISdk.ready;

    this.analytics = new ExpressAnalytics(this.addOnUISdk, "https://myendpointUrl.com");

    await analytics.trackUserAsync();

You can call this multiple times during session to add additional user metrics in the extra parameter.

### Tracking an event (multiple times per session)

    import { ExpressAnalytics} from "express-addon-analytics/ExpressAnalytics";
    ....

    // this.addOnUISdk has already been initialized

    // track a page deletion event passing the page width and height as parameters
    await this.analytics.trackEventAsync("delete_page", {
        width: pageWidth, 
        height: pageHeight});

### Tracking an error (multiple times per session)

    import { ExpressAnalytics} from "express-addon-analytics/ExpressAnalytics";
    ....

    // this.addOnUISdk has already been initialized

     try {
       ...
       // code that throws an exception
       ...
    } catch(error:any) {
        await this.analytics.trackErrorAsync(error as Error);
    }

### Stopping session tracking
    
A pulse event will be sent every 15 seconds. The interval can be changed before the ExpressAnalytics object is created with `ExpressAnalytics.PulseInterval = 20000;` to change it to 20 seconds, for example. This pulse helps determine session duration as there is no "closed" event for the add-on. You can always stop it with this code.

    this.analytis.dispose();
    