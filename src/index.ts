import * as Homebridge from "homebridge";

import { Platform } from "./Platform";

import { platform, plugin } from "./Accessories";

export = (homebridge: Homebridge.API) => {
    homebridge.registerPlatform(plugin, platform, Platform);
};
