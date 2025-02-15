# Adobe Express Add-on Analytics

A package add to an Adobe Express add-on to collect basic user analytics and an Azure function to serve as an endpoint for the package.

## Parameters Tracked

- a Adobe Express API Version`,
- c Screen color depth,
- d Platform device class
- e Event (user or event name specified in trackEventAsync()
- f UI Format
- h Screen height
- i In-app purchases allowed
- l UI Locale
- n Add-on name
- p Is the user a premium user
- pd Screen pixel depth
- pl Device platform
- s Developer flag to simulate a free user
- t UI theme
- u The user Id
- v Add-on version from the manifest
- w Screen width
- ex-[name] Extra parameter (can have multiple)

## Add-on Package

Add this package to Adobe Express Add-ons to enable analytics reporting

- [NPM Package express-addon-analytics](https://www.npmjs.com/package/express-addon-analytics)
- [Package readme](addon-package/readme.md)
- [Package source code](addon-package/src/ExpressAnalytics.ts)

## Azure Function

An Azure function endpoint to work with the express-addon-analytics package

- [ReadMe with setup instructions](azure-function/readme.md)
- [Source Code folder](azure-function)
- [Function TypeScript source code](azure-function/src/functions/expressAnalytics.ts)

## Sample Adobe Express Add-on

A sample Adobe Express Add-on that demonstrates how to use the package:

- [Source Code folder](sample-add-on)
- [Example Typescript usage in App.ts](sample-add-on/src/ui/components/App.ts)

### Testing Add-on

1. Start the Azure function with these [setup instructions](azure-function/readme.md)
2. Modify the devEndpoint parameter in the [ExpressAnalytics constructor](sample-add-on/src/ui/components/App.ts) to have the NGrok URL from step 1.
3. Build and run the add-on:

#### Running the add-on

    cd sample-add-on
    npm install
    npm run start

## Telemetry Dashboard

The Azure function will put data in Azure Storage Data tables `expressAnalyticsUsers` and `expressAnalyticsEvents` and these tables can be visualized in a Microsoft Power BI dashboard with this [template](dashboard/Adobe%20Express%20Add-on%20Telemetry%20Dashboard.pbit) producing a dashboard that can be customized to look like this:

![Creative Coding Add-on Telemetry Dashboard](/dashboard/creative-coding-dashboard.png)

This dashboard is used to collect telemetry from the Adobe Express Add-on [Creative Coding](https://adobesparkpost.app.link/TR9Mb7TXFLb?addOnId=w2ji95k72).
