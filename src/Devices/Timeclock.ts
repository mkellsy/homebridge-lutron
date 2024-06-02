import { API, CharacteristicValue, Logging, Service } from "homebridge";
import { DeviceState, Switch as ISwitch } from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

export class Timeclock extends Common implements Device {
    private service: Service;

    constructor(homebridge: API, device: ISwitch, log: Logging) {
        super(homebridge, device, log);

        const name = `${this.device.name} (Timeclock)`;

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Switch) ||
            this.accessory.addService(this.homebridge.hap.Service.Switch, name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, name);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.On)
            .onGet(this.onGetState)
            .onSet(this.onSetState);
    }

    public onUpdate(state: DeviceState): void {
        this.log.debug(`Timeclock: ${this.device.name} state: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
    }

    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Timeclock get state: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    private onSetState = async (value: CharacteristicValue): Promise<void> => {
        this.log.debug(`Timeclock set state: ${this.device.name} ${value ? "On" : "Off"}`);

        await this.device.set({ state: value ? "On" : "Off" });
    };
}
