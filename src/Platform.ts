import * as Homebridge from "homebridge";
import * as Leap from "@mkellsy/leap-client";
import * as Interfaces from "@mkellsy/hap-device";

import { Device } from "./Device";
import { DeviceFactory } from "./DeviceFactory";

export class Platform implements Homebridge.DynamicPlatformPlugin {
    private readonly homebridge: Homebridge.API;
    private readonly accessories: Map<string, Homebridge.PlatformAccessory> = new Map();
    private readonly devices: Map<string, Device> = new Map();

    constructor(_log: Homebridge.Logging, _config: Homebridge.PlatformConfig, homebridge: Homebridge.API) {
        this.homebridge = homebridge;

        Leap.connect().on("Available", this.onAvailable).on("Action", this.onAction).on("Update", this.onUpdate);
    }

    public configureAccessory(accessory: Homebridge.PlatformAccessory): void {
        this.accessories.set(accessory.UUID, accessory);
    }

    private onAvailable = (devices: Interfaces.Device[]): void => {
        for (const device of devices) {
            const id = this.homebridge.hap.uuid.generate(device.id);
            const accessory = DeviceFactory.create(id, device, this.homebridge, this.accessories.get(id)).accessory;

            if (this.accessories.get(id) == null) {
                this.accessories.set(id, accessory);
            }
        }
    };

    private onAction = (device: Interfaces.Device, button: Interfaces.Button, action: Interfaces.Action): void => {
        this.devices.get(device.id)?.onAction(button, action);
    };

    private onUpdate = (device: Interfaces.Device, state: Interfaces.DeviceState): void => {
        this.devices.get(device.id)?.onUpdate(state);
    };
}
