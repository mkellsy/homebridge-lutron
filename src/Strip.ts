import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Accessory } from "./Accessory";

export class Strip extends Accessory {
    constructor(
        id: string,
        device: Interfaces.Strip,
        accessory: Homebridge.PlatformAccessory,
        homebridge: Homebridge.API,
        cached: boolean
    ) {
        super(id, device, accessory, homebridge, cached);
    }
}
