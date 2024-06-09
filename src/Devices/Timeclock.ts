import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";
import { DeviceState, Timeclock as ITimeclock } from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

export class Timeclock extends Common<Leap.Timeclock> implements Device {
    private service: Service;

    constructor(homebridge: API, device: Leap.Timeclock, log: Logging) {
        super(homebridge, device, log);

        const name = `${this.device.name} (Timeclock)`;

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Switch) ||
            this.accessory.addService(this.homebridge.hap.Service.Switch, name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, name);
        this.service.getCharacteristic(this.homebridge.hap.Characteristic.On).onGet(this.onGetState);
    }

    public onUpdate(state: Leap.TimeclockState): void {
        this.log.debug(`Timeclock: ${this.device.name} state: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
    }

    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Timeclock get state: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };
}
