/**
 * This is a plugin that exposes Lutron Caseta and Radio RA3 devices to Homebridge.
 *
 * @packageDocumentation
 */

import { API } from "homebridge";
import { Platform, platform, plugin } from "./Platform";

/**
 * Defines an entrypoint for Homebridge and registers a Platform object.
 *
 * @param homebridge - A reference to the Homebridge API.
 * @public
 */
export = (homebridge: API) => {
    homebridge.registerPlatform(plugin, platform, Platform);
};
