import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "./Device";

/**
 * Creates a dimmer device.
 * @private
 */
export class Dimmer extends Common<Leap.Dimmer> implements Device {
    private service: Service;

    /**
     * Creates a dimmer device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
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

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current dimmer state.
     */
    public onUpdate(state: Leap.DimmerState): void {
        this.log.debug(`Dimmer: ${this.device.name} State: ${state.state}`);
        this.log.debug(`Dimmer: ${this.device.name} Brightness: ${state.level || 0}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.Brightness, state.level || 0);
    }

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Dimmer Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetState = (value: CharacteristicValue): void => {
        const state = value ? "On" : "Off";
        const level = value ? 100 : 0;

        if (this.device.status.state !== state || this.device.status.level !== level) {
            this.log.debug(`Dimmer Set State: ${this.device.name} ${state}`);
            this.log.debug(`Dimmer Set Brightness: ${this.device.name} ${level}`);

            this.device.set({ state, level }).catch((error) => this.log.error(error));
        }
    };

    /**
     * Fetches the current brightness when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetBrightness = (): CharacteristicValue => {
        this.log.debug(`Dimmer Get Brightness: ${this.device.name} ${this.device.status.level || 0}`);

        return this.device.status.level || 0;
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetBrightness = (value: CharacteristicValue): void => {
        const level = (value || 0) as number;
        const state = level > 0 ? "On" : "Off";

        this.log.debug(`Dimmer Set State: ${this.device.name} ${state}`);
        this.log.debug(`Dimmer Set Brightness: ${this.device.name} ${level}`);

        this.device.set({ state, level }).catch((error) => this.log.error(error));
    };
}
