import * as Leap from "@mkellsy/leap-client";

import { API, Logging, Service } from "homebridge";
import { Action, Button } from "@mkellsy/hap-device";

import { Common } from "./Common";
import { Device } from "./Device";

/**
 * Creates a keypad device.
 * @private
 */
export class Keypad extends Common<Leap.Keypad> implements Device {
    private services: Map<string, Service> = new Map();

    /**
     * Creates a keypad device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
    constructor(homebridge: API, device: Leap.Keypad, log: Logging) {
        super(homebridge, device, log);

        const labelService =
            this.accessory.getService(this.homebridge.hap.Service.ServiceLabel) ||
            this.accessory.addService(this.homebridge.hap.Service.ServiceLabel);

        labelService.setCharacteristic(
            this.homebridge.hap.Characteristic.ServiceLabelNamespace,
            this.homebridge.hap.Characteristic.ServiceLabelNamespace.ARABIC_NUMERALS,
        );

        for (const button of device.buttons) {
            const service =
                this.accessory.getServiceById(this.homebridge.hap.Service.StatelessProgrammableSwitch, button.name) ||
                this.accessory.addService(
                    this.homebridge.hap.Service.StatelessProgrammableSwitch,
                    button.name,
                    button.name,
                );

            service.addLinkedService(labelService);

            service.setCharacteristic(this.homebridge.hap.Characteristic.Name, button.name);
            service.setCharacteristic(this.homebridge.hap.Characteristic.ServiceLabelIndex, button.index);

            service
                .getCharacteristic(this.homebridge.hap.Characteristic.ProgrammableSwitchEvent)
                .setProps({ maxValue: 2 });

            this.services.set(button.id, service);
        }
    }

    /**
     * Invokes an action when a button is pressed.
     *
     * @param button The current button where the action was invoked.
     * @param action The action invoked (press, release, ...).
     */
    public onAction(button: Button, action: Action): void {
        const service = this.services.get(button.id);
        const characteristic = service?.getCharacteristic(this.homebridge.hap.Characteristic.ProgrammableSwitchEvent);

        if (service != null && characteristic != null) {
            switch (action) {
                case "Press":
                    this.log.debug(`Keypad: ${this.device.name} ${button.name} Pressed`);

                    characteristic.updateValue(this.homebridge.hap.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
                    break;

                case "DoublePress":
                    this.log.debug(`Keypad: ${this.device.name} ${button.name} Double Pressed`);

                    characteristic.updateValue(this.homebridge.hap.Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS);
                    break;

                case "LongPress":
                    this.log.debug(`Keypad: ${this.device.name} ${button.name} Long Pressed`);

                    characteristic.updateValue(this.homebridge.hap.Characteristic.ProgrammableSwitchEvent.LONG_PRESS);
                    break;
            }
        }
    }
}
