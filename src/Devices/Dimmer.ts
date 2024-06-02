import { API, CharacteristicValue, Logging, Service } from "homebridge";
import { DeviceState, Dimmer as IDimmer } from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

export class Dimmer extends Common implements Device {
    private service: Service;

    constructor(homebridge: API, device: IDimmer, log: Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Lightbulb) ||
            this.accessory.addService(this.homebridge.hap.Service.Lightbulb, this.device.name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, this.device.name);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.On)
            .onGet(this.onGetState);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.Brightness)
            .onGet(this.onGetBrightness)
            .onSet(this.onSetBrightness);
    }

    public onUpdate(state: DeviceState): void {
        this.log.debug(`Dimmer: ${this.device.name} State: ${state.state}`);
        this.log.debug(`Dimmer: ${this.device.name} Brightness: ${state.level || 0}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.Brightness, state.level || 0);
    }

    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Dimmer Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    private onGetBrightness = (): CharacteristicValue => {
        this.log.debug(`Dimmer Get Brightness: ${this.device.name} ${this.device.status.level || 0}`);

        return this.device.status.level || 0;
    };

    private onSetBrightness = async (value: CharacteristicValue): Promise<void> => {
        const level = (value || 0) as number;
        const state = level > 0 ? "On" : "Off";

        this.log.debug(`Dimmer Set State: ${this.device.name} ${state}`);
        this.log.debug(`Dimmer Set Brightness: ${this.device.name} ${level}`);

        await this.device.set({ state, level });
    };
}
