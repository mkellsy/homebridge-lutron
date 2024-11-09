const os = require("os");
const fs = require("fs");
const path = require("path");
const bson = require("bson");

const { HomebridgePluginUiServer } = require("@homebridge/plugin-ui-utils");
const { pair } = require("@mkellsy/leap-client");

class UiServer extends HomebridgePluginUiServer {
    constructor() {
        super();

        this.onRequest("/processors", this.onProcessors);
        this.onRequest("/pair", this.onPair);
        this.onRequest("/unpair", this.onUnpair);

        this.ready();
    }

    onProcessors = () => {
        const pairing = path.resolve(os.homedir(), ".leap/pairing");

        if (fs.existsSync(pairing)) {
            const bytes = fs.readFileSync(pairing);
            const context = bson.deserialize(bytes);

            return Object.keys(context);
        }

        return [];
    };

    onPair = async () => {
        try {
            await pair();

            return {
                status: "success",
            };
        } catch (error) {
            return {
                status: "fail",
                error: error.message,
            };
        }
    };

    onUnpair = () => {
        const pairing = path.resolve(os.homedir(), ".leap/pairing");

        if (fs.existsSync(pairing)) {
            const bytes = fs.readFileSync(pairing);
            const context = bson.deserialize(bytes);

            Object.keys(context).forEach((id) => {
                const cache = path.resolve(os.homedir(), ".leap", id);

                if (fs.existsSync(cache)) {
                    fs.rmSync(cache);
                }
            });

            fs.rmSync(pairing);
        }

        return;
    };
}

(() => new UiServer())();
