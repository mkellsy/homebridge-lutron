import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "@mkellsy/hap-device";
import { Keypad } from "../src/Keypad";

chai.use(sinonChai);

describe("Keypad", () => {
    let homebridgeStub: any;
    let serviceStub: any;
    let deviceStub: any;
    let buttonStub: any;
    let hapStub: any;
    let logStub: any;

    let characteristicStub: any;
    let accessoryStub: any;
    let findService: any;

    let keypad: Keypad;

    beforeEach(() => {
        logStub = {
            info: sinon.stub(),
            warn: sinon.stub(),
            error: sinon.stub(),
            debug: sinon.stub(),
        };

        hapStub = {
            uuid: {
                generate: sinon.stub().returns("UUID_ACCESSORIES"),
            },
            Service: {
                AccessoryInformation: "AccessoryInformation",
                StatelessProgrammableSwitch: "StatelessProgrammableSwitch",
            },
            Characteristic: {
                Model: "Model",
                Manufacturer: "Manufacturer",
                SerialNumber: "SerialNumber",
                ServiceLabelNamespace: {
                    ARABIC_NUMERALS: 1,
                },
                ProgrammableSwitchEvent: {
                    SINGLE_PRESS: 0,
                    DOUBLE_PRESS: 1,
                    LONG_PRESS: 2,
                },
            },
        };

        characteristicStub = {
            callbacks: {},
            setProps: sinon.stub(),
            updateValue: sinon.stub(),

            onGet(callback: Function) {
                this.callbacks["Get"] = [callback];

                return this;
            },

            onSet(callback: Function) {
                this.callbacks["Set"] = [callback];

                return this;
            },
        };

        accessoryStub = {
            setCharacteristic: sinon.stub().returns(accessoryStub),
            getCharacteristic: sinon.stub().returns(characteristicStub),
            updateCharacteristic: sinon.stub(),
            addLinkedService: sinon.stub(),
        };

        accessoryStub.setCharacteristic.returns(accessoryStub);
        findService = sinon.stub().returns(accessoryStub);
        serviceStub = sinon.stub();

        homebridgeStub = {
            callbacks: {},

            hap: hapStub,
            on: sinon.stub(),
            registerPlatformAccessories: sinon.stub(),
            unregisterPlatformAccessories: sinon.stub(),

            platformAccessory: class {
                getService: any = serviceStub;
                getServiceById: any = () => findService();
                addService: any = sinon.stub().returns(accessoryStub);
            },
        };

        buttonStub = {
            id: "ID",
            index: 1,
            name: "NAME",
        };

        deviceStub = {
            id: "ID_KEYPAD",
            name: "NAME",
            type: DeviceType.Keypad,
            status: { state: "On" },
            update: sinon.stub(),
            set: sinon.stub(),
            capabilities: {},
            buttons: [buttonStub],
        };
    });

    it("should bind listeners when device is created", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);

        keypad = new Keypad(homebridgeStub, deviceStub, logStub);

        expect(accessoryStub.addLinkedService).to.be.called;
    });

    it("should bind listeners when device is created from cache", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        serviceStub.withArgs("StatelessProgrammableSwitch").returns(accessoryStub);

        keypad = new Keypad(homebridgeStub, deviceStub, logStub);

        expect(accessoryStub.addLinkedService).to.be.called;
    });

    it("should bind listeners when device id is not available", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        findService.returns(undefined);

        keypad = new Keypad(homebridgeStub, deviceStub, logStub);

        expect(accessoryStub.addLinkedService).to.be.called;
    });

    describe("onAction()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);

            keypad = new Keypad(homebridgeStub, deviceStub, logStub);
        });

        it("should call update value characteristic when button is pressed", () => {
            keypad.onAction(buttonStub, "Press");

            expect(characteristicStub.updateValue).to.be.called;
        });

        it("should call update value characteristic when button is double pressed", () => {
            keypad.onAction(buttonStub, "DoublePress");

            expect(characteristicStub.updateValue).to.be.called;
        });

        it("should call update value characteristic when button is long pressed", () => {
            keypad.onAction(buttonStub, "LongPress");

            expect(characteristicStub.updateValue).to.be.called;
        });

        it("should not call update value characteristic when button is released", () => {
            keypad.onAction(buttonStub, "Release");

            expect(characteristicStub.updateValue).to.not.be.called;
        });

        it("should not call update value characteristic for an unknown button", () => {
            keypad.onAction(
                {
                    id: "UNKNOWN_ID",
                    index: 2,
                    name: "NAME",
                },
                "Press",
            );

            expect(characteristicStub.updateValue).to.not.be.called;
        });
    });
});
