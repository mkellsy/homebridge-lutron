import * as Homebridge from "homebridge";
import * as Leap from "@mkellsy/leap-client";
import * as Interfaces from "@mkellsy/hap-device";
import * as DeviceType from "./DeviceType";

import { parseAction } from "./Actions";
import { services } from "./Services";

export class Platform implements Homebridge.DynamicPlatformPlugin {
    private readonly log: Homebridge.Logging;
    private readonly config: Homebridge.PlatformConfig;
    private readonly homebridge: Homebridge.API;

    private readonly accessories: Map<string, Homebridge.PlatformAccessory> = new Map();

    constructor(log: Homebridge.Logging, config: Homebridge.PlatformConfig, homebridge: Homebridge.API) {
        this.log = log;
        this.config = config;
        this.homebridge = homebridge;

        Leap.connect().on("Available", this.onAvailable).on("Action", this.onAction).on("Update", this.onUpdate);
    }

    public configureAccessory(accessory: Homebridge.PlatformAccessory): void {
        this.accessories.set(accessory.UUID, accessory);
    }

    private onAvailable = (devices: Interfaces.Device[]): void => {
        for (const device of devices) {
            const id = this.homebridge.hap.uuid.generate(device.id);
            const cached = this.accessories.get(id) != null;

            const accessory =
                this.accessories.get(id) || new this.homebridge.platformAccessory(`${device.room} ${device.name}`, id);

            DeviceType.create(this.homebridge, id, device, accessory, cached);
        }
    };

    private onAction = (_device: Interfaces.Device, button: Interfaces.Button, action: Interfaces.Action): void => {
        const service = services.get(button.id);
        const event = parseAction(action);

        if (service != null && event >= 0) {
            service
                .getCharacteristic(this.homebridge.hap.Characteristic.ProgrammableSwitchEvent)
                .updateValue(event);
        }
    };

    private onUpdate = (device: Interfaces.Device, state: Interfaces.DeviceState): void => {};
}
