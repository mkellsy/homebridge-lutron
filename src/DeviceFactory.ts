import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Device } from "./Device";
import { Dimmer } from "./Dimmer";
import { Keypad } from "./Keypad";
import { Occupancy } from "./Occupancy";
import { Shade } from "./Shade";
import { Switch } from "./Switch";
import { Unknown } from "./Unknown";

export abstract class DeviceFactory {
    public static create(
        id: string,
        device: Interfaces.Device,
        homebridge: Homebridge.API,
        accessory?: Homebridge.PlatformAccessory
    ): Device {
        switch (device.type) {
            case Interfaces.DeviceType.Contact:
                return new Switch(id, device as Interfaces.Switch, homebridge, accessory);
    
            case Interfaces.DeviceType.Dimmer:
                return new Dimmer(id, device as Interfaces.Dimmer, homebridge, accessory);
    
            case Interfaces.DeviceType.Keypad:
                return new Keypad(id, device as Interfaces.Keypad, homebridge, accessory);
    
            case Interfaces.DeviceType.Occupancy:
                return new Occupancy(id, device as Interfaces.Occupancy, homebridge, accessory);
    
            case Interfaces.DeviceType.Remote:
                return new Keypad(id, device as Interfaces.Keypad, homebridge, accessory);
    
            case Interfaces.DeviceType.Shade:
                return new Shade(id, device as Interfaces.Shade, homebridge, accessory);
    
            case Interfaces.DeviceType.Strip:
                return new Dimmer(id, device as Interfaces.Dimmer, homebridge, accessory);
    
            case Interfaces.DeviceType.Switch:
                return new Switch(id, device as Interfaces.Switch, homebridge, accessory);
    
            default:
                return new Unknown(id, device as Interfaces.Unknown, homebridge, accessory);
        }
    }
}
