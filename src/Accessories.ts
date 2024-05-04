import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Contact } from "./Contact";
import { Device } from "./Device";
import { Dimmer } from "./Dimmer";
import { Keypad } from "./Keypad";
import { Occupancy } from "./Occupancy";
import { Shade } from "./Shade";
import { Strip } from "./Strip";
import { Switch } from "./Switch";

import { accessories, devices, platform, plugin } from "./Platform";

export abstract class Accessories {
    public static create(
        homebridge: Homebridge.API,
        device: Interfaces.Device,
        config: Homebridge.PlatformConfig,
        log: Homebridge.Logging
    ): Device | undefined {
        switch (device.type) {
            case Interfaces.DeviceType.Contact:
                if (config.cco === false) {
                    return undefined;
                }

                return new Contact(homebridge, device as Interfaces.Contact, log);

            case Interfaces.DeviceType.Dimmer:
                if (config.dimmers === false) {
                    return undefined;
                }

                return new Dimmer(homebridge, device as Interfaces.Dimmer, log);

            case Interfaces.DeviceType.Keypad:
                if (config.keypads === false) {
                    return undefined;
                }

                return new Keypad(homebridge, device as Interfaces.Keypad, log);

            case Interfaces.DeviceType.Occupancy:
                if (config.sensors === false) {
                    return undefined;
                }

                return new Occupancy(homebridge, device as Interfaces.Occupancy, log);

            case Interfaces.DeviceType.Remote:
                if (config.remotes === false) {
                    return undefined;
                }

                return new Keypad(homebridge, device as Interfaces.Keypad, log);

            case Interfaces.DeviceType.Shade:
                if (config.shades === false) {
                    return undefined;
                }

                return new Shade(homebridge, device as Interfaces.Shade, log);

            case Interfaces.DeviceType.Strip:
                if (config.strips === false) {
                    return undefined;
                }

                return new Strip(homebridge, device as Interfaces.Strip, log);

            case Interfaces.DeviceType.Switch:
                if (config.switches === false) {
                    return undefined;
                }

                return new Switch(homebridge, device as Interfaces.Switch, log);
        }

        return undefined;
    }

    public static get(homebridge: Homebridge.API, device: Interfaces.Device): Device | undefined {
        const id = homebridge.hap.uuid.generate(device.id);

        return devices.get(id);
    }

    public static remove(homebridge: Homebridge.API, device: Interfaces.Device): void {
        const id = homebridge.hap.uuid.generate(device.id);
        const accessory = accessories.get(id);

        if (accessory != null) {
            homebridge.unregisterPlatformAccessories(plugin, platform, [accessory]);
        }
    }
}
