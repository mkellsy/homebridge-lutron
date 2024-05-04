import * as Homebridge from "homebridge";

import { Platform, platform, plugin } from "./Platform";

export = (homebridge: Homebridge.API) => {
    homebridge.registerPlatform(plugin, platform, Platform);
};
