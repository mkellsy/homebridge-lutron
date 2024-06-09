import { API, Logging, PlatformAccessory } from "homebridge";
import { Device } from "@mkellsy/hap-device";

import { accessories, devices, platform, plugin } from "../Platform";

export abstract class Common<DEVICE extends Device> {
    public readonly id: string;
    public readonly accessory: PlatformAccessory;

    protected readonly log: Logging;
    protected readonly homebridge: API;
    protected readonly device: DEVICE;

    constructor(homebridge: API, device: DEVICE, log: Logging) {
        this.log = log;
        this.homebridge = homebridge;
        this.device = device;

        this.id = this.homebridge.hap.uuid.generate(this.device.id);
        this.accessory = accessories.get(this.id) || new this.homebridge.platformAccessory(device.name, this.id);

        this.accessory
            .getService(this.homebridge.hap.Service.AccessoryInformation)!
            .setCharacteristic(this.homebridge.hap.Characteristic.Manufacturer, this.device.manufacturer)
            .setCharacteristic(this.homebridge.hap.Characteristic.Model, this.device.type)
            .setCharacteristic(this.homebridge.hap.Characteristic.SerialNumber, this.device.id);
    }

    public register(): void {
        devices.set(this.id, this);

        if (accessories.has(this.id)) {
            return;
        }

        this.log.debug(`Register accessory: ${this.device.name}`);

        accessories.set(this.id, this.accessory);

        this.homebridge.registerPlatformAccessories(plugin, platform, [this.accessory]);
    }
}
