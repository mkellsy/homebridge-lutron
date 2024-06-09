import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

/**
 * Creates a fan device.
 */
export class Fan extends Common<Leap.Fan> implements Device {
    private service: Service;

    /**
     * Creates a fan device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
    constructor(homebridge: API, device: Leap.Fan, log: Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Fan) ||
            this.accessory.addService(this.homebridge.hap.Service.Fan, this.device.name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, this.device.name);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.On)
            .onGet(this.onGetState)
            .onSet(this.onSetState);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.RotationSpeed)
            .onGet(this.onGetSpeed)
            .onSet(this.onSetSpeed);
    }

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current fan state.
     */
    public onUpdate(state: Leap.FanState): void {
        const speed = Math.round((state.speed / 7) * 100);

        this.log.debug(`Fan: ${this.device.name} State: ${state.state}`);
        this.log.debug(`Fan: ${this.device.name} Speed: ${state.speed}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.RotationSpeed, speed);
    }

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Fan Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     */
    private onSetState = async (value: CharacteristicValue): Promise<void> => {
        const state = value ? "On" : "Off";
        const speed = value ? 7 : 0;

        if (this.device.status.state !== state || this.device.status.speed !== speed) {
            this.log.debug(`Fan Set State: ${this.device.name} ${state}`);
            this.log.debug(`Fan Set Speed: ${this.device.name} ${speed}`);

            await this.device.set({ state, speed });
        }
    };

    /**
     * Fetches the current speed when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetSpeed = (): CharacteristicValue => {
        const speed = Math.round((this.device.status.speed / 7) * 100);

        this.log.debug(`Fan Get Speed: ${this.device.name} ${this.device.status.speed}`);

        return speed;
    };

    /**
     * Updates the device speed when a change comes in from Homebridge.
     */
    private onSetSpeed = async (value: CharacteristicValue): Promise<void> => {
        const speed = Math.round((((value as number) || 0) / 100) * 7);
        const state = speed > 0 ? "On" : "Off";

        if (this.device.status.state !== state || this.device.status.speed !== speed) {
            this.log.debug(`Fan Set State: ${this.device.name} ${state}`);
            this.log.debug(`Fan Set Speed: ${this.device.name} ${speed}`);

            await this.device.set({ state, speed });
        }
    };
}
