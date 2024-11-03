import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "./Device";

/**
 * Creates a timeclock device.
 * @private
 */
export class Timeclock extends Common<Leap.Timeclock> implements Device {
    private service: Service;

    /**
     * Creates a timeclock device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
    constructor(homebridge: API, device: Leap.Timeclock, log: Logging) {
        super(homebridge, device, log);

        const name = `${this.device.name} (Timeclock)`;

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Switch) ||
            this.accessory.addService(this.homebridge.hap.Service.Switch, name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, name);
        this.service.getCharacteristic(this.homebridge.hap.Characteristic.On).onGet(this.onGetState);
    }

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current dimmer state.
     */
    public onUpdate(state: Leap.TimeclockState): void {
        this.log.debug(`Timeclock: ${this.device.name} state: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
    }

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Timeclock get state: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };
}
