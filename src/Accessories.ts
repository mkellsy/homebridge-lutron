import * as Leap from "@mkellsy/leap-client";

import { API, Logging, PlatformConfig } from "homebridge";
import { DeviceType, Device as IDevice } from "@mkellsy/hap-device";

import { accessories, devices, platform, plugin } from "./Platform";

import { Contact } from "./Devices/Contact";
import { Dimmer } from "./Devices/Dimmer";
import { Fan } from "./Devices/Fan";
import { Keypad } from "./Devices/Keypad";
import { Occupancy } from "./Devices/Occupancy";
import { Shade } from "./Devices/Shade";
import { Strip } from "./Devices/Strip";
import { Switch } from "./Devices/Switch";
import { Timeclock } from "./Devices/Timeclock";

import { Device } from "./Interfaces/Device";

export abstract class Accessories {
    public static create(homebridge: API, device: IDevice, config: PlatformConfig, log: Logging): Device | undefined {
        switch (device.type) {
            case DeviceType.Contact:
                if (config.cco === false) {
                    return undefined;
                }

                return new Contact(homebridge, device as Leap.Contact, log);

            case DeviceType.Dimmer:
                if (config.dimmers === false) {
                    return undefined;
                }

                return new Dimmer(homebridge, device as Leap.Dimmer, log);

            case DeviceType.Fan:
                if (config.fans === false) {
                    return undefined;
                }

                return new Fan(homebridge, device as Leap.Fan, log);

            case DeviceType.Keypad:
                if (config.keypads === false) {
                    return undefined;
                }

                return new Keypad(homebridge, device as Leap.Keypad, log);

            case DeviceType.Occupancy:
                if (config.sensors === false) {
                    return undefined;
                }

                return new Occupancy(homebridge, device as Leap.Occupancy, log);

            case DeviceType.Remote:
                if (config.remotes === false) {
                    return undefined;
                }

                return new Keypad(homebridge, device as Leap.Keypad, log);

            case DeviceType.Shade:
                if (config.shades === false) {
                    return undefined;
                }

                return new Shade(homebridge, device as Leap.Shade, log);

            case DeviceType.Strip:
                if (config.strips === false) {
                    return undefined;
                }

                return new Strip(homebridge, device as Leap.Strip, log);

            case DeviceType.Switch:
                if (config.switches === false) {
                    return undefined;
                }

                return new Switch(homebridge, device as Leap.Switch, log);

            case DeviceType.Timeclock:
                if (config.timeclocks === false) {
                    return undefined;
                }

                return new Timeclock(homebridge, device as Leap.Timeclock, log);
        }

        return undefined;
    }

    public static get(homebridge: API, device: IDevice): Device | undefined {
        const id = homebridge.hap.uuid.generate(device.id);

        return devices.get(id);
    }

    public static remove(homebridge: API, device: IDevice): void {
        const id = homebridge.hap.uuid.generate(device.id);
        const accessory = accessories.get(id);

        if (accessory != null) {
            homebridge.unregisterPlatformAccessories(plugin, platform, [accessory]);
        }
    }
}
