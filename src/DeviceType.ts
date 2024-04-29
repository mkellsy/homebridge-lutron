import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Contact } from "./Contact";
import { Dimmer } from "./Dimmer";
import { Keypad } from "./Keypad";
import { Occupancy } from "./Occupancy";
import { Remote } from "./Remote";
import { Shade } from "./Shade";
import { Strip } from "./Strip";
import { Switch } from "./Switch";
import { Unknown } from "./Unknown";

export function create(
    homebridge: Homebridge.API,
    id: string,
    device: Interfaces.Device,
    accessory: Homebridge.PlatformAccessory,
    cached: boolean
) {
    switch (device.type) {
        case Interfaces.DeviceType.Contact:
            return new Contact(id, device as Interfaces.Contact, accessory, homebridge, cached);

        case Interfaces.DeviceType.Dimmer:
            return new Dimmer(id, device as Interfaces.Dimmer, accessory, homebridge, cached);

        case Interfaces.DeviceType.Keypad:
            return new Keypad(id, device as Interfaces.Keypad, accessory, homebridge, cached);

        case Interfaces.DeviceType.Occupancy:
            return new Occupancy(id, device as Interfaces.Occupancy, accessory, homebridge, cached);

        case Interfaces.DeviceType.Remote:
            return new Remote(id, device as Interfaces.Remote, accessory, homebridge, cached);

        case Interfaces.DeviceType.Shade:
            return new Shade(id, device as Interfaces.Shade, accessory, homebridge, cached);

        case Interfaces.DeviceType.Strip:
            return new Strip(id, device as Interfaces.Strip, accessory, homebridge, cached);

        case Interfaces.DeviceType.Switch:
            return new Switch(id, device as Interfaces.Switch, accessory, homebridge, cached);

        default:
            return new Unknown(id, device as Interfaces.Unknown, accessory, homebridge, cached);
    }
}
