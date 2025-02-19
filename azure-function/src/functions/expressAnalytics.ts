/** Express Analytics
 * Copyright (c) 2025 Scherotter Enterprises.
 */
import { TableClient, TableInsertEntityHeaders, TableServiceClient } from "@azure/data-tables";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
const { v4: uuidv4 } = require('uuid');

const azureStorageConnectionString = <string>process.env.AZURE_STORAGE_CONNECTION;
const userTableName = "expressAnalyticsUsers";
const eventTableName = "expressAnalyticsEvents";
const pulseEvent = "_pulse";
const userEvent = "_user";

/** the number of minutes between events to trigger a new session*/
const sessionInactivityMinutes = 30;

/** Analytics user entry */
interface IAnalyticsUserEntry{
    /** the add-on name */
    partitionKey: string;
    /** the user Id */
    rowKey: string;

    /** screen width */
    width: number;

    /** screen height */
    height: number;

    /** locale string */
    locale: string;

    /** add-on version */
    version: string;

    /** in-app purchased allowed */
    inAppPurchaseAllowed: boolean;

    /** the browser platform */
    platform: string;

    /** is a free user being simulated? */
    simulateFreeUser?: boolean;

    /** the device class */
    deviceClass: string;

    /** is a premium user */
    premiumUser: boolean;

    /** the current theme */
    theme: string;

    /** the current locale format */
    format: string;

    /** the Adobe Express API version */
    apiVersion: string;

    /** the date of first usage of the add-on */
    firstUsage: Date;

    /** Screen Color depth */
    colorDepth: number;

    /** Screen Pixel depth */
    pixelDepth: number;
};

/** Event Record */
interface IEventRecord{
    /** the partiton key <Add-on name>|<User id> */
    partitionKey:   string;

    /** the row key <Event name>|<GUID>*/
    rowKey:         string;
    
    /** the timestamp */
    timeStamp:      Date;

    /** the event name */
    event:          string;

    /** the session Id */
    sessionId?:      string;
}

/** the Express Analytics endpoint processing */
export async function expressAnalytics(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http trigger for Express Analytics url "${request.url}"`);
   
    try{
        if (!azureStorageConnectionString) throw new Error("Missing AZURE_STORAGE_CONNECTION environment variable.");

        const event = request.query.get("e");

        if (event == userEvent){
            await upsertUserAsync(request.query, context);
        } else{
            await createEventAsync(request.query, context);
        }

        return { body: `Processed` };
    } catch (error:any){
        
        context.error(error);

        return { 
            status: 401,
            body: error.message
        };
    }
};

app.http('expressAnalytics', {
    methods: ['GET','POST'],
    authLevel: 'anonymous',
    handler: expressAnalytics
});


/** Create an event entity
 * @param query the HTTP query
 */
async function createEventAsync(query: URLSearchParams, context: InvocationContext){
    const name = decodeURIComponent(query.get("n") as string);
    const userId = query.get("u");
    const event = query.get("e");

    if (!event) throw new Error("No e event parameter.");
    if (!name) throw new Error("No n name parameter.");
    if (!userId) throw new Error("No u userId parameter.");

    return await addEventAsync(event, name, userId, query, context);
}

/** Add an event
 * @param event the event name
 * @param name the add-on name
 * @param userId the user Id
 * @param query the URL search parameters from the request
 * @param context the Azure funcitons context
 * @returns an async promise with the tabe insert entity header
 */
async function addEventAsync(event:string, name: string, userId: string, query:URLSearchParams, context:InvocationContext) : Promise<TableInsertEntityHeaders>{
    const tableServiceClient = TableServiceClient.fromConnectionString(azureStorageConnectionString);

    await tableServiceClient.createTable(eventTableName);

    let eventEntity:IEventRecord = {
        partitionKey: `${name}|${userId}`,
        rowKey: `${event}|${uuidv4()}`,
        event: event,
        sessionId: uuidv4()
    } as any;

    query.forEach(addExtraParameters, eventEntity);

    const tableClient = TableClient.fromConnectionString(azureStorageConnectionString, eventTableName);

    let sessionTime = new Date();
    sessionTime.setMinutes(sessionTime.getMinutes() - sessionInactivityMinutes);
    const sessionTimeString = sessionTime.toISOString();
    
    const filter = `PartitionKey eq '${eventEntity.partitionKey}' and Timestamp ge datetime'${sessionTimeString}'`;

    context.info(`Current time is ${new Date().toLocaleTimeString()}`);
    context.info(`Session time is ${sessionTime.toLocaleTimeString()}`);
    context.info(`Filter is ${filter}`);

    const eventRecords = tableClient.listEntities<IEventRecord>({
        queryOptions:{
            filter: filter
        }
    });

    //console.log(`Records`);

    for await (const eventRecord of eventRecords){
        //console.log(eventRecord);
        if (eventRecord.sessionId){
            //context.info(`Setting new record sessionId to ${eventRecord.sessionId}`);
            eventEntity.sessionId = eventRecord.sessionId;
        } else{
            //context.info(`${eventRecord.partitionKey} ${eventRecord.rowKey} does not have a sessionId`);            
        }
    }

    const newEntity = await tableClient.createEntity<IEventRecord>(eventEntity);

    return newEntity;
}

/** Add any extra parameteres that start with ex-
 * @param this the fields object to add to
 * @param value the value
 * @param name the key name
 */
function addExtraParameters(this: any, value:string, name:string) {
    if (name.startsWith("ex-")){
        const fieldName = decodeURIComponent(name.substring(3));
        const existingFields = ["partitionKey", "rowKey", "timestamp"];

        if (existingFields.includes(fieldName)) return;

        this[fieldName] = decodeURIComponent(value);
    }
}

/** Upsert a user entity
 * @param the HTTP query
 * @returns an async promise
 */
async function upsertUserAsync(query: URLSearchParams, context:InvocationContext){
    const apiVersion = query.get("a") as string;
    const colorDepth = query.get("c") as string;
    const deviceClass = query.get("d") as string;
    const event = query.get("e");
    const format = query.get("f") as string;
    const height = query.get("h") as string;
    const inAppPurchaseAllowed = query.get("i");
    const locale = query.get("l") as string;
    const name = decodeURIComponent(query.get("n") as string);
    const premiumUser = query.get("p");
    const pixelDepth = query.get("pd") as string;
    const platform = query.get("pl") as string;
    const simulateFreeUser = query.get("s");
    const theme = query.get("t") as string;
    const userId = query.get("u");
    const version = query.get("v") as string;
    const width= query.get("w") as string;

    if (!event) throw new Error("No e event parameter.");
    if (!name) throw new Error("No n name parameter.");
    if (!userId) throw new Error("No u userId parameter.");

    const entity:IAnalyticsUserEntry = {
        partitionKey: decodeURIComponent(name),
        rowKey: userId,
        width: parseInt(width),
        height: parseInt(height),
        locale: locale,
        version: version,
        inAppPurchaseAllowed: inAppPurchaseAllowed == "true",
        platform: platform,
        deviceClass: deviceClass,
        premiumUser: premiumUser == "true",
        theme: theme,
        format: format,
        apiVersion: apiVersion,
        firstUsage: new Date(),
        colorDepth: parseInt(colorDepth),
        pixelDepth: parseInt(pixelDepth)
    };

    if (simulateFreeUser){
        // this value will only be there during development if at all
        entity.simulateFreeUser = simulateFreeUser == "true";
    }

    query.forEach(addExtraParameters, entity);

    context.log("Entity: ", entity);

    const tableServiceClient = TableServiceClient.fromConnectionString(azureStorageConnectionString);

    await tableServiceClient.createTable(userTableName);

    try {
        await updateEntityAsync(entity);
    } catch (error:any){
        console.log(`User Entity ${entity.partitionKey} ${entity.rowKey} does not exist, creating it.`);

        const tableClient = TableClient.fromConnectionString(azureStorageConnectionString, userTableName);

        return await tableClient.createEntity<IAnalyticsUserEntry>(entity);
    }

    await addEventAsync(pulseEvent, name, userId, query, context);
}

/** Update a user entity fields except for the firstUsage field 
 * @param entity the new entity
*/
async function  updateEntityAsync(entity: IAnalyticsUserEntry) {
    const tableClient = TableClient.fromConnectionString(azureStorageConnectionString, userTableName);

    const existing = await tableClient.getEntity<IAnalyticsUserEntry>(entity.partitionKey, entity.rowKey);
    
    entity.firstUsage = existing.firstUsage;

    return await tableClient.updateEntity(entity);
}