# Adobe Express Add-on Analytics

A package add to an [Adobe Express](https://new.express.adobe.com/) add-on to collect user analytics, an Azure function to serve as an endpoint for the package, and a Power BI dashboard to visualize the telemetry.

## Contents

1. [Features](#features)
2. [Telemetry parameters tracked](#telemetry-parameters-tracked)
3. [Add-on package](#add-on-package)
4. [Azure function](#azure-function)
5. [Sample Adobe Express add-on](#sample-adobe-express-add-on)
6. [Help is available](#help-is-available)

## Features

- Tracks user telemetry
- Tracks events added by developers
- Tracks session duration with a pulse every 15 seconds

## Telemetry parameters tracked

- a Adobe Express API Version
- c Screen color depth
- d Platform device class
- e Event (user or event name specified in `trackEventAsync()`)
- f UI Format
- h Screen height
- i In-app purchases allowed
- l UI Locale
- n Add-on name
- p Is the user a premium user
- pd Screen pixel depth
- pl Device platform
- s Developer flag to simulate a free user (only sent during local machine development)
- t UI theme
- u The user Id
- v Add-on version from the manifest
- w Screen width
- ex-[name] Extra parameter (can have multiple)

## Add-on Package

Add this package to an Adobe Express Add-on to enable analytics reporting

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

The sample is based on the Typescript/Spectrum Web Components project created with this commandline:

    `npx @adobe/create-ccweb-add-on sample-add-on`

See this [quickstart](https://developer.adobe.com/express/add-ons/docs/guides/getting_started/quickstart/) to create your own Adobe Express Add-on project. The [express-addon-analytics](https://www.npmjs.com/package/express-addon-analytics) package should work with all project types.

1. Start the Azure function with these [setup instructions](azure-function/readme.md)
2. Modify the devEndpoint parameter in the [ExpressAnalytics constructor](sample-add-on/src/ui/components/App.ts) to have the NGrok URL from step 1.
3. Build and run the add-on:

#### Running the add-on

    cd sample-add-on
    npm install
    npm run start

## Telemetry Dashboard

The Azure function will put data in Azure Storage Data tables `expressAnalyticsUsers` and `expressAnalyticsEvents` and these tables can be visualized in a [Microsoft Power BI](https://www.microsoft.com/en-us/power-platform/products/power-bi) dashboard with this [template](dashboard/Adobe%20Express%20Add-on%20Telemetry%20Dashboard.pbit) producing a dashboard that can be customized to look like this:

![Creative Coding Add-on Telemetry Dashboard](/dashboard/creative-coding-dashboard.png)

To use the template

1. Download the file at `dashboard/Adobe Express Add-on Telemetry Dashboard.pbit`
2. Open it in [Microsoft Power BI Desktop](https://www.microsoft.com/en-us/power-platform/products/power-bi)
3. Connect the Azure Data Tables  `expressAnalyticsUsers` and `expressAnalyticsEvents` created by your Azure function.

This dashboard is used to collect telemetry from the Adobe Express Add-on [Creative Coding](https://adobesparkpost.app.link/TR9Mb7TXFLb?addOnId=w2ji95k72).

## Help is available

[Galeryst.com Creative Software Development](https://blog.galeryst.com/galeryst-custom-creative-software-development/) is available to help organizations build out any part of this type of solution including:

- Adobe Express Add-on development
- Microsoft Azure Software Engineering
- Microsoft Power BI dashboard development

Please reach out today if you need help.
