# Adobe Express Add-on Analytics

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

- [Source Code folder](azure-function)
- [Function TypeScript source code](azure-function/src/functions/expressAnalytics.ts)

## Sample Adobe Express Add-on

A sample Adobe Express Add-on that demonstrates how to use the package:

- [Source Code folder](sample-add-on)
- [Example Typescript usage in App.ts](sample-add-on/src/ui/components/App.ts)

### Testing Add-on

1. build and start Azure Function for testing locally at `http://localhost:7071` or similar endpoint.
2. Use the free [NGrok](https://ngrok.com/) to make a HTTPS gateway to the localhost endpoint: `ngrok http http://localhost:7071 --host-header=localhost`
3. Modify the devEndpoint parameter in the ExpressAnalytics constructor to have the NGrok URL
4. Build and run the add-on:

#### Running the add-on

    cd sample-add-on
    npm install
    npm run start
