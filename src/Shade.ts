import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "./Device";

/**
 * Creates a shade device.
 * @private
 */
export class Shade extends Common<Leap.Shade> implements Device {
    private service: Service;

    /**
     * Creates a shade device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
    constructor(homebridge: API, device: Leap.Shade, log: Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.WindowCovering) ||
            this.accessory.addService(this.homebridge.hap.Service.WindowCovering, this.device.name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, this.device.name);
        this.service.getCharacteristic(this.homebridge.hap.Characteristic.CurrentPosition).onGet(this.onGetPosition);
        this.service.getCharacteristic(this.homebridge.hap.Characteristic.PositionState).onGet(this.onGetState);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.TargetPosition)
            .onGet(this.onGetPosition)
            .onSet(this.onSetPosition);
    }

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current dimmer state.
     */
    public onUpdate(state: Leap.ShadeState): void {
        this.log.debug(`Shade: ${this.device.name} Position: ${state.level}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.TargetPosition, state.level || 0);
    }

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetState = (): CharacteristicValue => {
        return this.homebridge.hap.Characteristic.PositionState.STOPPED;
    };

    /**
     * Fetches the current position when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetPosition = (): CharacteristicValue => {
        this.log.debug(`Shade Get Position: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.level || 0;
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetPosition = async (value: CharacteristicValue): Promise<void> => {
        const level = (value || 0) as number;
        const state = level > 0 ? "Open" : "Closed";

        this.log.debug(`Shade Set Position: ${this.device.name} ${level}`);

        await this.device.set({ state, level });
    };
}
