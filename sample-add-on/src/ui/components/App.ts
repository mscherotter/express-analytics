// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/theme/theme-light.js";

// To learn more about using "spectrum web components" visit:
// https://opensource.adobe.com/spectrum-web-components/
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/theme/sp-theme.js";

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DocumentSandboxApi } from "../../models/DocumentSandboxApi";
import { style } from "./App.css";

import { AddOnSDKAPI, RuntimeType } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { ExpressAnalytics} from "express-addon-analytics/ExpressAnalytics";

/** Analytics endpoint URL 
 * @todo Update with your cloud endpoint 
*/
const endpoint = "https://<your cloud function endpoint with any key in the url>"

/** Analytics developer endpoint URL 
 * @todo Update with your developer endpoint
 * @description the actual endpoint for local testing might be something like 
    http://localhost:7071 which is not accessible from Adobe
    Express so you use NGrok (https://ngrok.com/) as a proxy that will 
    give you an https endpoint for local testing.
*/
const devEndpoint = "https://.....ngrok-free.app/api/expressAnalytics?key=_test";

@customElement("add-on-app")
export class App extends LitElement {
    @property({ type: Object })
    addOnUISdk!: AddOnSDKAPI;

    @state()
    private _sandboxProxy!: DocumentSandboxApi;

    private _analytics!: ExpressAnalytics;

    static get styles() {
        return style;
    }

    async firstUpdated(): Promise<void> {
        // Get the UI runtime.
        const { runtime } = this.addOnUISdk.instance;

        if (!runtime.apiProxy) throw new Error("Unable to get Adobe Express Add-on runtime proxy.");

        // Get the proxy object, which is required
        // to call the APIs defined in the Document Sandbox runtime
        // i.e., in the `code.ts` file of this add-on.
        this._sandboxProxy = await runtime.apiProxy(RuntimeType.documentSandbox);

        this._analytics = new ExpressAnalytics(this.addOnUISdk, endpoint, devEndpoint);
                                                                                     
        await this._analytics.trackUserAsync();
    }

    private _handleClick() {
        this._sandboxProxy.createRectangle();
        
        // track an event
        this._analytics.trackEventAsync("create_rectangle", {
            param1: "_test"
        });
    }

    render() {
        // Please note that the below "<sp-theme>" component does not react to theme changes in Express.
        // You may use "this.addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
        return html` <sp-theme theme="express" color="light" scale="medium">
            <div class="container">
                <sp-button size="m" @click=${this._handleClick}>Create Rectangle</sp-button>
            </div>
        </sp-theme>`;
    }
}
