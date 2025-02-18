# About

This project has been created with _@adobe/create-ccweb-add-on_. As an example, this Add-on demonstrates how to get started with Add-on development using Spectrum Web Components and TypeScript with Document Sandbox Runtime.

## Tools

- HTML
- CSS
- Spectrum Web Components
- TypeScript
- [Adobe Express Add-on Analytics](https://www.npmjs.com/package/express-addon-analytics)
- [Adobe Express Add-on Analytics Azure Function](https://github.com/mscherotter/express-analytics/tree/main/azure-function)
- [Ngrok API Gateway](https://ngrok.com/)

## Setup

1. To install the dependencies, run `npm install`.
2. To update the packages, run `npm update`.
3. Update the endpoint and devEndpoint URLs in [App.ts](src/ui/components/App.ts) at the top of the file for your cloud function.
4. To build the application, run `npm run build`.
5. To start the application, run `npm run start`.

## Express add-on analytics

These are the modifications made to the generated sample:

1. Added the  `express-addon-analytics` packages with `npm install express-addon-analytics --save`
2. In [App.ts](src/ui/components/App.ts) added

    `import { ExpressAnalytics} from "express-addon-analytics/ExpressAnalytics";`
3. Added global variables endPoint and devEndpoint to [App.ts](src/ui/components/App.ts) at the top of the file.
4. In [App.ts](src/ui/components/App.ts) added code to **App.firstUpdated()** to initialize `this._analytics` with an analytics endpoint
5. in [App.ts](src/ui/components/App.ts) **App._handleClick()** added code to track the **create rectangle** event
