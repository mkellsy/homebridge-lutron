import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

export class Accessory {
    protected readonly id: string;
    protected readonly cached: boolean;

    protected readonly homebridge: Homebridge.API;
    protected readonly device: Interfaces.Device;
    protected readonly accessory: Homebridge.PlatformAccessory;

    constructor(
        id: string,
        device: Interfaces.Device,
        accessory: Homebridge.PlatformAccessory,
        homebridge: Homebridge.API,
        cached: boolean
    ) {
        this.id = id;
        this.cached = cached;

        this.homebridge = homebridge;
        this.device = device;
        this.accessory = accessory;

        this.accessory
            .getService(this.homebridge.hap.Service.AccessoryInformation)!
            .setCharacteristic(this.homebridge.hap.Characteristic.Manufacturer, this.device.manufacturer)
            .setCharacteristic(this.homebridge.hap.Characteristic.Model, this.accessory.context.device.ModelNumber)
            .setCharacteristic(
                this.homebridge.hap.Characteristic.SerialNumber,
                this.accessory.context.device.SerialNumber.toString(),
            );
    }
}
