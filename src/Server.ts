import os from "os";
import fs from "fs";
import path from "path";
import bson from "bson";

import { HomebridgePluginUiServer } from "@homebridge/plugin-ui-utils";
import { pair } from "@mkellsy/leap-client";

class UiServer extends HomebridgePluginUiServer {
    constructor() {
        super();

        this.onRequest("/processors", this.onProcessors);
        this.onRequest("/pair", this.onPair);
        this.onRequest("/unpair", this.onUnpair);

        this.ready();
    }

    public onProcessors = (): string[] => {
        const pairing = path.resolve(os.homedir(), ".leap/pairing");

        if (fs.existsSync(pairing)) {
            const bytes = fs.readFileSync(pairing);
            const context = bson.deserialize(bytes);

            return Object.keys(context);
        }

        return [];
    };

    public onPair = (): Promise<{ status: "success" | "fail"; error?: string }> => {
        return new Promise<{ status: "success" | "fail"; error?: string }>((resolve) => {
            pair()
                .then(() => {
                    resolve({ status: "success" });
                })
                .catch((error) => {
                    resolve({ status: "fail", error: error.message });
                });
        });
    };

    public onUnpair = (): string => {
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

            return "true";
        }

        return "false";
    };
}

(() => new UiServer())();
