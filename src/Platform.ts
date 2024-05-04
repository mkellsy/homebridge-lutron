import * as Homebridge from "homebridge";
import * as Leap from "@mkellsy/leap-client";
import * as Interfaces from "@mkellsy/hap-device";

import { Accessories } from "./Accessories";
import { Device } from "./Device";

import { defaults } from "./Config";

const accessories: Map<string, Homebridge.PlatformAccessory> = new Map();
const devices: Map<string, Device> = new Map();

const platform: string = "LutronRA3";
const plugin: string = "@mkellsy/homebridge-lutron-ra3";

export { accessories, devices, platform, plugin };

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
            const accessory = Accessories.create(this.homebridge, device, this.config, this.log);

            accessory?.register();

            if (accessory == null) {
                Accessories.remove(this.homebridge, device);
            }
        }
    };

    private onAction = (device: Interfaces.Device, button: Interfaces.Button, action: Interfaces.Action): void => {
        const accessory = Accessories.get(this.homebridge, device);

        if (accessory == null || accessory.onAction == null) {
            return;
        }

        accessory.onAction(button, action);
    };

    private onUpdate = (device: Interfaces.Device, state: Interfaces.DeviceState): void => {
        const accessory = Accessories.get(this.homebridge, device);

        if (accessory == null || accessory.onUpdate == null) {
            return;
        }

        accessory.onUpdate(state);
    };
}
