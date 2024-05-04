import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "./Device";

export class Shade extends Common implements Device {
    private service: Homebridge.Service;

    constructor(homebridge: Homebridge.API, device: Interfaces.Shade, log: Homebridge.Logging) {
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

    public onUpdate(state: Interfaces.DeviceState): void {
        this.log.debug(`Shade: ${this.device.name} Position: ${state.level}`);

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.TargetPosition, state.level || 0);
    }

    private onGetState = (): Homebridge.CharacteristicValue => {
        return this.homebridge.hap.Characteristic.PositionState.STOPPED;
    }

    private onGetPosition = (): Homebridge.CharacteristicValue => {
        this.log.debug(`Shade Get Position: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.level || 0;
    };

    private onSetPosition = (value: Homebridge.CharacteristicValue): void => {
        this.log.debug(`Shade Set Position: ${this.device.name} ${value}`);

        this.device.set({ level: value as number });
    };
}
