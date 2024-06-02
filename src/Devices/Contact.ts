import { API, CharacteristicValue, Logging, Service } from "homebridge";
import { DeviceState, Contact as IContact } from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

export class Contact extends Common implements Device {
    private service: Service;

    constructor(homebridge: API, device: IContact, log: Logging) {
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

    public onUpdate(state: DeviceState): void {
        this.log.debug(`Contact: ${this.device.name} State: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "Closed");
    }

    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Contact Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "Closed";
    };

    private onSetState = async (value: CharacteristicValue): Promise<void> => {
        this.log.debug(`Contact Set State: ${this.device.name} ${value ? "Closed" : "Open"}`);

        await this.device.set({ state: value ? "Closed" : "Open" });
    };
}
