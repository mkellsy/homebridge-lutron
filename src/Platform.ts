import * as Homebridge from "homebridge";
import * as Leap from "@mkellsy/leap-client";
import * as Interfaces from "@mkellsy/hap-device";

import { DeviceFactory } from "./DeviceFactory";

import { accessories } from "./Accessories";
import { defaults } from "./Config";

export class Platform implements Homebridge.DynamicPlatformPlugin {
    private readonly log: Homebridge.Logging;
    private readonly config: Homebridge.PlatformConfig;
    private readonly homebridge: Homebridge.API;

    constructor(log: Homebridge.Logging, config: Homebridge.PlatformConfig, homebridge: Homebridge.API) {
        this.log = log;
        this.config = { ...defaults, ...config };
        this.homebridge = homebridge;

        this.homebridge.on("didFinishLaunching", () => {
            Leap.connect()
                .on("Available", this.onAvailable)
                .on("Action", this.onAction)
                .on("Update", this.onUpdate);

        });
    }

    public configureAccessory(accessory: Homebridge.PlatformAccessory): void {
        accessories.set(accessory.UUID, accessory);
    }

    private onAvailable = (devices: Interfaces.Device[]): void => {
        for (const device of devices) {
            const accessory = DeviceFactory.create(this.homebridge, device, this.config, this.log);

            accessory?.register();

            if (accessory == null) {
                DeviceFactory.remove(this.homebridge, device);
            }
        }
    };

    private onAction = (device: Interfaces.Device, button: Interfaces.Button, action: Interfaces.Action): void => {
        const accessory = DeviceFactory.get(this.homebridge, device);

        if (accessory == null || accessory.onAction == null) {
            return;
        }

        accessory.onAction(button, action);
    };

    private onUpdate = (device: Interfaces.Device, state: Interfaces.DeviceState): void => {
        const accessory = DeviceFactory.get(this.homebridge, device);

        if (accessory == null || accessory.onUpdate == null) {
            return;
        }

        accessory.onUpdate(state);
    };
}
