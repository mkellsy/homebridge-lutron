import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

export class Dimmer extends Common<Leap.Dimmer> implements Device {
    private service: Service;

    constructor(homebridge: API, device: Leap.Dimmer, log: Logging) {
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

    public onUpdate(state: Leap.DimmerState): void {
        this.log.debug(`Dimmer: ${this.device.name} State: ${state.state}`);
        this.log.debug(`Dimmer: ${this.device.name} Brightness: ${state.level || 0}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.Brightness, state.level || 0);
    }

    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Dimmer Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    private onSetState = async (value: CharacteristicValue): Promise<void> => {
        const state = value ? "On" : "Off";
        const level = value ? 100 : 0;

        if (this.device.status.state !== state || this.device.status.level !== level) {
            this.log.debug(`Dimmer Set State: ${this.device.name} ${state}`);
            this.log.debug(`Dimmer Set Brightness: ${this.device.name} ${level}`);

            await this.device.set({ state, level });
        }
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
