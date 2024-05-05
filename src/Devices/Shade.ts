import { API, CharacteristicValue, Logging, Service } from "homebridge";
import { DeviceState, Shade as IShade } from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

export class Shade extends Common implements Device {
    private service: Service;

    constructor(homebridge: API, device: IShade, log: Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.WindowCovering) ||
            this.accessory.addService(this.homebridge.hap.Service.WindowCovering, this.device.name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, this.device.name);
        this.service.getCharacteristic(this.homebridge.hap.Characteristic.CurrentPosition).onGet(this.onGetPosition);

        this.service.getCharacteristic(this.homebridge.hap.Characteristic.PositionState)
        .onGet(this.onGetState);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.TargetPosition)
            .onGet(this.onGetPosition)
            .onSet(this.onSetPosition);
    }

    public onUpdate(state: DeviceState): void {
        this.log.debug(`Shade: ${this.device.name} Position: ${state.level}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.TargetPosition, state.level || 0);
    }

    private onGetState = (): CharacteristicValue => {
        return this.homebridge.hap.Characteristic.PositionState.STOPPED;
    }

    private onGetPosition = (): CharacteristicValue => {
        this.log.debug(`Shade Get Position: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.level || 0;
    };

    private onSetPosition = (value: CharacteristicValue): void => {
        this.log.debug(`Shade Set Position: ${this.device.name} ${value}`);

        this.device.set({ level: value as number });
    };
}
