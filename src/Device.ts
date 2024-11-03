import { PlatformAccessory } from "homebridge";
import { Action, Button, DeviceState } from "@mkellsy/hap-device";

/**
 * Shared device interface for Homebridge accessories
 * @private
 */
export interface Device {
    /**
     * The UUID of the device.
     */
    id: string;

    /**
     * The associated HAP accessory.
     */
    accessory: PlatformAccessory;

    /**
     * Registers a device and if not cached, it will also inform Homebridge
     * about the device.
     */
    register(): void;

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current device state.
     */
    onUpdate?(state: DeviceState): void;

    /**
     * When an accessory needs to call an action in Homebridge. This is used to
     * map a remopte button to an action.
     *
     * @param button The button that was pressed.
     * @param action The action that happened (press, release).
     */
    onAction?(button: Button, action: Action): void;
}
