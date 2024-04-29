import * as Homebridge from "homebridge";
import * as Interfaces from "@mkellsy/hap-device";

import { Accessory } from "./Accessory";
import { services } from "./Services";

export class Keypad extends Accessory {
    constructor(
        id: string,
        device: Interfaces.Keypad,
        accessory: Homebridge.PlatformAccessory,
        homebridge: Homebridge.API,
        cached: boolean
    ) {
        super(id, device, accessory, homebridge, cached);

        const labelService =
            this.accessory.getService(this.homebridge.hap.Service.ServiceLabel) ||
            this.accessory.addService(this.homebridge.hap.Service.ServiceLabel);

        labelService.setCharacteristic(
            this.homebridge.hap.Characteristic.ServiceLabelNamespace,
            this.homebridge.hap.Characteristic.ServiceLabelNamespace.ARABIC_NUMERALS
        );

        for (const button of device.buttons) {
            const service =
                this.accessory.getServiceById(this.homebridge.hap.Service.StatelessProgrammableSwitch, button.name) ||
                this.accessory.addService(
                    this.homebridge.hap.Service.StatelessProgrammableSwitch,
                    button.name,
                    button.name
                );

            service.addLinkedService(labelService);

            service.setCharacteristic(this.homebridge.hap.Characteristic.Name, button.name);
            service.setCharacteristic(this.homebridge.hap.Characteristic.ServiceLabelIndex, button.index);

            service
                .getCharacteristic(this.homebridge.hap.Characteristic.ProgrammableSwitchEvent)
                .setProps({ maxValue: 2 });

            services.set(button.id, service);
        }
    }
}
