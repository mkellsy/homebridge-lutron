import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

export interface Device {
    id: string;
    accessory: Homebridge.PlatformAccessory;

    register(): void;

    onUpdate?(state: Interfaces.DeviceState): void;
    onAction?(button: Interfaces.Button, action: Interfaces.Action): void;
}
