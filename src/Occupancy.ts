import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "./Device";

export class Occupancy extends Common implements Device {
    constructor(
        id: string,
        device: Interfaces.Occupancy,
        homebridge: Homebridge.API,
        accessory?: Homebridge.PlatformAccessory
    ) {
        super(id, device, homebridge, accessory);
    }

    public onUpdate(_state: Interfaces.DeviceState): void { /* no-op */ }

    public onAction(_button: Interfaces.Button, _action: Interfaces.Action): void { /* no-op */ }
}
