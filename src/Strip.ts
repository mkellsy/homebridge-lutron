import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "./Device";

/**
 * Creates a light strip device.
 * @private
 */
export class Strip extends Common<Leap.Strip> implements Device {
    private service: Service;

    /**
     * Creates a light strip device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
    constructor(homebridge: API, device: Leap.Strip, log: Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Lightbulb) ||
            this.accessory.addService(this.homebridge.hap.Service.Lightbulb, this.device.name);

        this.service.addCharacteristic(this.homebridge.hap.Characteristic.ConfiguredName);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, this.device.name);
        this.service.setCharacteristic(this.homebridge.hap.Characteristic.ConfiguredName, this.device.name);

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

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current dimmer state.
     */
    public onUpdate(state: Leap.StripState): void {
        const temperature = this.transformRange(state.luminance, [1800, 3000], [140, 500]);

        this.log.debug(`Strip: ${this.device.name} State: ${state.state}`);
        this.log.debug(`Strip: ${this.device.name} Brightness: ${state.level}`);
        this.log.debug(`Strip: ${this.device.name} Luminance: ${state.luminance}`);
        this.log.debug(`Strip: ${this.device.name} Temperature: ${temperature}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.Brightness, state.level || 0);
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.ColorTemperature, temperature);
    }

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Strip Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetState = async (value: CharacteristicValue): Promise<void> => {
        const state = value ? "On" : "Off";
        const level = value ? 100 : 0;

        if (this.device.status.state !== state || this.device.status.level !== level) {
            this.log.debug(`Strip Set State: ${this.device.name} ${state}`);
            this.log.debug(`Strip Set Brightness: ${this.device.name} ${level}`);

            await this.device.set({ state, level, luminance: this.device.status.luminance });
        }
    };

    /**
     * Fetches the current brightness when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetBrightness = (): CharacteristicValue => {
        this.log.debug(`Strip Get Brightness: ${this.device.name} ${this.device.status.level || 0}`);

        return this.device.status.level || 0;
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetBrightness = async (value: CharacteristicValue): Promise<void> => {
        const level = (value || 0) as number;
        const state = level > 0 ? "On" : "Off";

        this.log.debug(`Strip Set Brightness: ${this.device.name} ${value}`);

        await this.device.set({ state, level, luminance: this.device.status.luminance });
    };

    /**
     * Fetches the current color temperature when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetTemperature = (): CharacteristicValue => {
        const temperature = this.transformRange(this.device.status.luminance, [1800, 3000], [140, 500]);

        this.log.debug(`Strip Get Luminance: ${this.device.name} ${this.device.status.luminance}`);
        this.log.debug(`Strip Get Temperature: ${this.device.name} ${temperature}`);

        return temperature;
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetTemperature = async (value: CharacteristicValue): Promise<void> => {
        const luminance = this.transformRange(value as number, [140, 500], [1800, 3000]);

        this.log.debug(`Strip Set Luminance: ${this.device.name} ${luminance}`);
        this.log.debug(`Strip Set Temperature: ${this.device.name} ${value}`);

        await this.device.set({
            state: this.device.status.state,
            level: this.device.status.level,
            luminance,
        });
    };

    /*
     * Transforms HomeKit color temprature to kelvin used by Lutron.
     */
    private transformRange(value: number, source: number[], destination: number[]) {
        const base = Math.min(Math.max(value, source[0]), source[1]) - source[0];
        const percentage = (base * 100) / (source[1] - source[0]);

        const delta = ((100 - percentage) * (destination[1] - destination[0])) / 100;
        const result = Math.floor(delta + destination[0]);

        return Math.min(Math.max(result, destination[0]), destination[1]);
    }
}
