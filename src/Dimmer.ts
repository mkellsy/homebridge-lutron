import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "./Device";

export class Dimmer extends Common implements Device {
    private service: Homebridge.Service;

    constructor(homebridge: Homebridge.API, device: Interfaces.Dimmer, log: Homebridge.Logging) {
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
    }

    public onUpdate(state: Interfaces.DeviceState): void {
        this.log.debug(`Dimmer: ${this.device.name} State: ${state.state}`);
        this.log.debug(`Dimmer: ${this.device.name} Brightness: ${state.level}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.Brightness, state.level || 0);
    }

    private onGetState = (): Homebridge.CharacteristicValue => {
        this.log.debug(`Dimmer Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    private onSetState = (value: Homebridge.CharacteristicValue): void => {
        this.log.debug(`Dimmer Set State: ${this.device.name} ${value}`);

        this.device.set({ state: value ? "On" : "Off" });
    };

    private onGetBrightness = (): Homebridge.CharacteristicValue => {
        this.log.debug(`Dimmer Get Brightness: ${this.device.name} ${this.device.status.level}`);

        return this.device.status.level || 0;
    };

    private onSetBrightness = (value: Homebridge.CharacteristicValue): void => {
        this.log.debug(`Dimmer Set Brightness: ${this.device.name} ${value}`);

        this.device.set({ level: value as number });
    };
}
