import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { accessories, devices, platform, plugin } from "./Accessories";

export abstract class Common {
    public readonly id: string;
    public readonly accessory: Homebridge.PlatformAccessory;

    protected readonly log: Homebridge.Logging;
    protected readonly homebridge: Homebridge.API;
    protected readonly device: Interfaces.Device;

    constructor(homebridge: Homebridge.API, device: Interfaces.Device, log: Homebridge.Logging) {
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
