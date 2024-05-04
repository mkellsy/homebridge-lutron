import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "./Device";

export class Contact extends Common implements Device {
    private service: Homebridge.Service;

    constructor(homebridge: Homebridge.API, device: Interfaces.Switch, log: Homebridge.Logging) {
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

    public onUpdate(state: Interfaces.DeviceState): void {
        this.log.debug(`Contact: ${this.device.name} State: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "Closed");
    }

    private onGetState = (): Homebridge.CharacteristicValue => {
        this.log.debug(`Contact Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "Closed";
    };

    private onSetState = (value: Homebridge.CharacteristicValue): void => {
        this.log.debug(`Contact Set State: ${this.device.name} ${value}`);

        this.device.set({ state: value ? "Closed" : "Open" });
    };
}
