import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "./Device";

export class Strip extends Common implements Device {
    private service: Homebridge.Service;

    constructor(homebridge: Homebridge.API, device: Interfaces.Strip, log: Homebridge.Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Lightbulb) ||
            this.accessory.addService(this.homebridge.hap.Service.Lightbulb, this.device.name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, this.device.name);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.On)
            .onGet(this.onGetState)
            .onSet(this.onSetState);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.Brightness)
            .onGet(this.onGetBrightness)
            .onSet(this.onSetBrightness);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.ColorTemperature)
            .onGet(this.onGetTemperature)
            .onSet(this.onSetTemperature);
    }

    public onUpdate(state: Interfaces.DeviceState): void {
        const luminance = Math.max(state.luminance || 1800, 1800);
        const temperature = Math.floor(((luminance - 1800) / 1200) * 360 + 140);

        this.log.debug(`Strip: ${this.device.name} State: ${state.state}`);
        this.log.debug(`Strip: ${this.device.name} Brightness: ${state.level}`);
        this.log.debug(`Strip: ${this.device.name} Luminance: ${luminance}`);
        this.log.debug(`Strip: ${this.device.name} Temperature: ${temperature}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.Brightness, state.level || 0);
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.ColorTemperature, temperature);
    }

    private onGetState = (): Homebridge.CharacteristicValue => {
        this.log.debug(`Strip Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    private onSetState = (value: Homebridge.CharacteristicValue): void => {
        this.log.debug(`Strip Set State: ${this.device.name} ${value}`);

        this.device.set({ state: value ? "On" : "Off" });
    };

    private onGetBrightness = (): Homebridge.CharacteristicValue => {
        this.log.debug(`Strip Get Brightness: ${this.device.name} ${this.device.status.level}`);

        return this.device.status.level || 0;
    };

    private onSetBrightness = (value: Homebridge.CharacteristicValue): void => {
        this.log.debug(`Strip Set Brightness: ${this.device.name} ${value}`);

        this.device.set({ level: value as number });
    };

    private onGetTemperature = (): Homebridge.CharacteristicValue => {
        const luminance = Math.max(this.device.status.luminance || 1800, 1800);
        const temperature = Math.floor(((luminance - 1800) / 1200) * 360 + 140);

        this.log.debug(`Strip Get Luminance: ${this.device.name} ${luminance}`);
        this.log.debug(`Strip Get Temperature: ${this.device.name} ${temperature}`);

        return temperature;
    };

    private onSetTemperature = (value: Homebridge.CharacteristicValue): void => {
        const temperature = Math.max((value as number) || 140, 140);
        const luminance = Math.floor(((temperature - 140) / 360) * 1200 + 1800);

        this.log.debug(`Strip Set Luminance: ${this.device.name} ${luminance}`);
        this.log.debug(`Strip Set Temperature: ${this.device.name} ${temperature}`);

        this.device.set({ luminance });
    };
}
