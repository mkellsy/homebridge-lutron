import * as Homebridge from "homebridge";
import { Platform } from "./Platform";

export = (homebridge: Homebridge.API) => {
    homebridge.registerPlatform("@mkellsy/homebridge-participle", Platform);
};
