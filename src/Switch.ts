import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "./Device";

export class Switch extends Common implements Device {
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
        this.log.debug(`Switch: ${this.device.name} state: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
    }

    private onGetState = (): Homebridge.CharacteristicValue => {
        this.log.debug(`Switch get state: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    private onSetState = (value: Homebridge.CharacteristicValue): void => {
        this.log.debug(`Switch set state: ${this.device.name} ${value}`);

        this.device.set({ state: value ? "On" : "Off" });
    };
}
