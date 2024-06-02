import { API, CharacteristicValue, Logging, Service } from "homebridge";
import { DeviceState, Switch as ISwitch } from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

export class Switch extends Common implements Device {
    private service: Service;

    constructor(homebridge: API, device: ISwitch, log: Logging) {
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
        this.log.debug(`Switch: ${this.device.name} state: ${state.state}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.On, state.state === "On");
    }

    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Switch get state: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "On";
    };

    private onSetState = async (value: CharacteristicValue): Promise<void> => {
        this.log.debug(`Switch set state: ${this.device.name} ${value ? "On" : "Off"}`);

        await this.device.set({ state: value ? "On" : "Off" });
    };
}
