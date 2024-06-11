import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

export class Contact extends Common<Leap.Contact> implements Device {
    private service: Service;

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

    public onUpdate(state: Leap.ContactState): void {
        this.log.debug(`Contact: ${this.device.name} State: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "Closed");
    }

    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Contact Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "Closed";
    };

    private onSetState = (value: CharacteristicValue): void => {
        this.log.debug(`Contact Set State: ${this.device.name} ${value ? "Closed" : "Open"}`);

        this.device.set({ state: value ? "Closed" : "Open" }).catch((error) => this.log.error(error));
    };
}
