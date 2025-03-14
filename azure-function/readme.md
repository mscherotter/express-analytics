# Adobe Express Add-on Analytics Azure Function

A function to run on Microsoft Azure in the cloud to serve as an endpoint for
data collection from an Adobe Express Add-on using the
[Adobe Express Add-on Analytics](https://www.npmjs.com/package/express-addon-analytics) NPM Package. A single function app can support multiple Add-ons.

## Development Testing with Visual Studio Code

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the [Azurite](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite) Azure Storage Emulator Visual Studio Code Plug-in.
3. Install the [Azure Functions for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) Plug-in.
4. Clone this repo
5. Start the Azurite emulator [Azure Table Service] and [Azure Blob Service]
6. Add a .env file to the azure-function directory with the line
    `AZURE_STORAGE_CONNECTION=UseDevelopmentStorage=true`
7. In Visual Studio Code **Run and Debug** tab, start debugging with **Attach to Node Functions**.
8. start NGROK with the command line:
    `ngrok http http://localhost:7071 --host-header=localhost`

The function is now available for local development testing with an Adobe Express add-on running locally.

## Deployment to Azure

1. Create the Azure Data Table Storage resource.
2. Get the connection string for the storage resource and set it to the setting `AZURE_STORAGE_CONNECTION` in the Azure function.
3. Create the Azure funciton and deploy this project to it. A standard Azure Function app service plan should be sufficient.
4. In the Azure Function **API/CORS** section add the unique add-on URL from the Adobe Express Add on **Settings** tab.  It should be something like `https://<unique-id>.wxp.adobe-addons.com`. You can also add `https://localhost:5241` to the CORS list if you want to test local debugging with the Azure function production endpoint.

## Azure Data Table Storage

These are the tables that are created by the function. This can be used by multiple add-ons, each with a unique add-on name.

### expressAnalyticsUsers

A table of users of the add-ons. There is a single entry per user, so for a user that uses multiple devices to access a single Adobe Id, the row will contain the data from the last device used.

- partitionKey: the name of the add-on
- rowKey: the Adobe Express user ID
- see the `IAnalyticsUser` interface in [expressAnalytics.ts](src/functions/expressAnalytics.ts) for all other fields in the table.

### expressAnalticsEvents

A table of events of the add-ons

- **partitionKey** {the name of the add-on}|{the Adobe Express user Id}
- **rowKey**       {the name of the event}|{a unique Id}
- **timeStamp**    timestamp added by Azure on creation
- **name**         the name of the event
- **sessionId**    a GUID representing a session (events with less than 30 minutes delay between each one)
