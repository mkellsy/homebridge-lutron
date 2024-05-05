import * as Leap from "@mkellsy/leap-client";

import { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig } from "homebridge";
import { Action, Button, Device as IDevice, DeviceState } from "@mkellsy/hap-device";

import { Accessories } from "./Accessories";
import { Device } from "./Interfaces/Device";

import { defaults } from "./Interfaces/Config";

const accessories: Map<string, PlatformAccessory> = new Map();
const devices: Map<string, Device> = new Map();

const platform: string = "Lutron";
const plugin: string = "@mkellsy/homebridge-lutron";

export { accessories, devices, platform, plugin };

export class Platform implements DynamicPlatformPlugin {
    private readonly log: Logging;
    private readonly config: PlatformConfig;
    private readonly homebridge: API;

    constructor(log: Logging, config: PlatformConfig, homebridge: API) {
        this.log = log;
        this.config = { ...defaults, ...config };
        this.homebridge = homebridge;

        this.homebridge.on("didFinishLaunching", () => {
            Leap.connect().on("Available", this.onAvailable).on("Action", this.onAction).on("Update", this.onUpdate);
        });
    }

    public configureAccessory(accessory: PlatformAccessory): void {
        accessories.set(accessory.UUID, accessory);
    }

    private onAvailable = (devices: IDevice[]): void => {
        for (const device of devices) {
            const accessory = Accessories.create(this.homebridge, device, this.config, this.log);

            accessory?.register();

            if (accessory == null) {
                Accessories.remove(this.homebridge, device);
            }
        }
    };

    private onAction = (device: IDevice, button: Button, action: Action): void => {
        const accessory = Accessories.get(this.homebridge, device);

        if (accessory == null || accessory.onAction == null) {
            return;
        }

        accessory.onAction(button, action);
    };

    private onUpdate = (device: IDevice, state: DeviceState): void => {
        const accessory = Accessories.get(this.homebridge, device);

        if (accessory == null || accessory.onUpdate == null) {
            return;
        }

        accessory.onUpdate(state);
    };
}
