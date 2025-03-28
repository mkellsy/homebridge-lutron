import * as HAP from "@mkellsy/hap-device";
import * as Leap from "@mkellsy/leap-client";

import { API, Logging, PlatformConfig } from "homebridge";

import { accessories, devices, platform, plugin } from "./Platform";

import { Contact } from "./Contact";
import { Dimmer } from "./Dimmer";
import { Fan } from "./Fan";
import { Keypad } from "./Keypad";
import { Occupancy } from "./Occupancy";
import { Shade } from "./Shade";
import { Strip } from "./Strip";
import { Switch } from "./Switch";
import { Timeclock } from "./Timeclock";

import { Device } from "./Device";

/**
 * Accessory factory.
 * @private
 */
export abstract class Accessories {
    /**
     * Creates respective devices from a common device discovery.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the common device object.
     * @param config A reference to the plugin configuration.
     * @param log A reference to the Homebridge logger.
     *
     * @returns A device or undefined if not configured.
     */
    public static create(
        homebridge: API,
        device: HAP.Device,
        config: PlatformConfig,
        log: Logging,
    ): Device | undefined {
        switch (device.type) {
            case HAP.DeviceType.Contact:
                if (config.cco === false) {
                    return undefined;
                }

                return new Contact(homebridge, device as Leap.Contact, log);

            case HAP.DeviceType.Dimmer:
                if (config.dimmers === false) {
                    return undefined;
                }

                return new Dimmer(homebridge, device as Leap.Dimmer, log);

            case HAP.DeviceType.Fan:
                if (config.fans === false) {
                    return undefined;
                }

                return new Fan(homebridge, device as Leap.Fan, log);

            case HAP.DeviceType.Keypad:
                if (config.keypads === false) {
                    return undefined;
                }

                return new Keypad(homebridge, device as Leap.Keypad, log);

            case HAP.DeviceType.Occupancy:
                if (config.sensors === false) {
                    return undefined;
                }

                return new Occupancy(homebridge, device as Leap.Occupancy, log);

            case HAP.DeviceType.Remote:
                if (config.remotes === false) {
                    return undefined;
                }

                return new Keypad(homebridge, device as Leap.Keypad, log);

            case HAP.DeviceType.Shade:
                if (config.shades === false) {
                    return undefined;
                }

                return new Shade(homebridge, device as Leap.Shade, log);

            case HAP.DeviceType.Strip:
                if (config.strips === false) {
                    return undefined;
                }

                return new Strip(homebridge, device as Leap.Strip, log);

            case HAP.DeviceType.Switch:
                if (config.switches === false) {
                    return undefined;
                }

                return new Switch(homebridge, device as Leap.Switch, log);

            case HAP.DeviceType.Timeclock:
                if (config.timeclocks === false) {
                    return undefined;
                }

                return new Timeclock(homebridge, device as Leap.Timeclock, log);
        }

        return undefined;
    }

    /**
     * Fetches an internally cached device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the common device object.
     *
     * @returns The cached device or undefined if not available.
     */
    public static get(homebridge: API, device: HAP.Device): Device | undefined {
        const id = homebridge.hap.uuid.generate(device.id);

        return devices.get(id);
    }

    /**
     * Removes an internally cached device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the common device object.
     */
    public static remove(homebridge: API, device: HAP.Device): void {
        const id = homebridge.hap.uuid.generate(device.id);
        const accessory = accessories.get(id);

        if (accessory != null) {
            homebridge.unregisterPlatformAccessories(plugin, platform, [accessory]);
        }
    }
}
