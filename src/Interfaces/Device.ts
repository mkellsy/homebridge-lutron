import { PlatformAccessory } from "homebridge";
import { Action, Button, DeviceState } from "@mkellsy/hap-device";

export interface Device {
    id: string;
    accessory: PlatformAccessory;

    register(): void;

    onUpdate?(state: DeviceState): void;
    onAction?(button: Button, action: Action): void;
}
