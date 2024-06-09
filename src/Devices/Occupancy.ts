import * as Leap from "@mkellsy/leap-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "../Interfaces/Device";

/**
 * Creates an occupancy sensor device.
 */
export class Occupancy extends Common<Leap.Occupancy> implements Device {
    private service: Service;

    /**
     * Creates an occupancy sensor device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
    constructor(homebridge: API, device: Leap.Occupancy, log: Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.OccupancySensor) ||
            this.accessory.addService(this.homebridge.hap.Service.OccupancySensor, this.device.name);

        this.service.setCharacteristic(this.homebridge.hap.Characteristic.Name, this.device.name);
        this.service.getCharacteristic(this.homebridge.hap.Characteristic.OccupancyDetected).onGet(this.onGetState);
    }

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current occupancy sensor state.
     */
    public onUpdate(state: Leap.OccupancyState): void {
        this.log.debug(
            `Occupancy: ${this.device.name} State: ${state.state === "Occupied" ? "Detected" : "Not Detected"}`,
        );

        this.service.updateCharacteristic(
            this.homebridge.hap.Characteristic.OccupancyDetected,
            state.state === "Occupied",
        );
    }

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetState = (): CharacteristicValue => {
        this.log.debug(`Occupancy Get State: ${this.device.name} ${this.device.status.state}`);

        return this.device.status.state === "Occupied";
    };
}
