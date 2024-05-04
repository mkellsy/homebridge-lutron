import * as Homebridge from "homebridge";

import { Device } from "./Device";

export const accessories: Map<string, Homebridge.PlatformAccessory> = new Map();
export const devices: Map<string, Device> = new Map();
export const platform: string = "LutronRA3";
export const plugin: string = "@mkellsy/homebridge-lutron-ra3";
