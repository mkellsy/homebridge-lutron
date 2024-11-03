import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "./Device";

/**
 * Creates a CCO device.
 * @private
 */
export class Contact extends Common<Leap.Contact> implements Device {
    private service: Service;

    /**
     * Creates a CCO device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
    constructor(homebridge: API, device: Leap.Contact, log: Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Switch) ||
            this.accessory.addService(this.homebridge.hap.Service.Switch, this.device.name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, this.device.name);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.On)
            .onGet(this.onGetState)
            .onSet(this.onSetState);
    }

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current dimmer state.
     */
    public onUpdate(state: Leap.ContactState): void {
        this.log.debug(`Contact: ${this.device.name} State: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "Closed");
    }

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Contact Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "Closed";
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetState = (value: CharacteristicValue): void => {
        this.log.debug(`Contact Set State: ${this.device.name} ${value ? "Closed" : "Open"}`);

        this.device.set({ state: value ? "Closed" : "Open" }).catch((error) => this.log.error(error));
    };
}
