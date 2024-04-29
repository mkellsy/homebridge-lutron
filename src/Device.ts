import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

export interface Device {
    id: string;
    accessory: Homebridge.PlatformAccessory;

    onUpdate(state: Interfaces.DeviceState): void;
    onAction(button: Interfaces.Button, action: Interfaces.Action): void;
}
