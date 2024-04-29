import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

export abstract class Common {
    public readonly id: string;
    public readonly accessory: Homebridge.PlatformAccessory;

    protected readonly homebridge: Homebridge.API;
    protected readonly device: Interfaces.Device;

    constructor(
        id: string,
        device: Interfaces.Device,
        homebridge: Homebridge.API,
        accessory?: Homebridge.PlatformAccessory
    ) {
        this.id = id;

        this.homebridge = homebridge;
        this.device = device;

        this.accessory = accessory || new this.homebridge.platformAccessory(`${device.room} ${device.name}`, id);

        this.accessory
            .getService(this.homebridge.hap.Service.AccessoryInformation)!
            .setCharacteristic(this.homebridge.hap.Characteristic.Manufacturer, this.device.manufacturer)
            .setCharacteristic(this.homebridge.hap.Characteristic.Model, this.accessory.context.device.ModelNumber)
            .setCharacteristic(
                this.homebridge.hap.Characteristic.SerialNumber,
                this.accessory.context.device.SerialNumber.toString()
            );
    }
}
