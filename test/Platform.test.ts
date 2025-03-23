import proxyquire from "proxyquire";

import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "@mkellsy/hap-device";
import { Platform } from "../src/Platform";

chai.use(sinonChai);

describe("Platform", () => {
    let homebridgeStub: any;
    let connectionStub: any;
    let configStub: any;
    let deviceStub: any;
    let buttonStub: any;
    let hapStub: any;
    let logStub: any;

    let characteristicStub: any;
    let accessoryStub: any;

    let platform: Platform;
    let platformType: typeof Platform;

    const emit = (stub: any, event: string, ...payload: any[]) => {
        for (const callback of stub.callbacks[event] || []) {
            callback(...payload);
        }
    };

    before(() => {
        platformType = proxyquire("../src/Platform", {
            "@mkellsy/leap-client": {
                connect() {
                    return {
                        on(event: string, callback: Function) {
                            if (connectionStub.callbacks[event] == null) {
                                connectionStub.callbacks[event] = [];
                            }

                            connectionStub.callbacks[event].push(callback);

                            return this;
                        },
                    };
                },
            },
        }).Platform;
    });

    beforeEach(() => {
        connectionStub = { callbacks: {} };

        logStub = {
            info: sinon.stub(),
            warn: sinon.stub(),
            error: sinon.stub(),
            debug: sinon.stub(),
        };

        hapStub = {
            uuid: {
                generate: sinon.stub().returns("UUID_PLATFORM"),
            },
            Service: {
                AccessoryInformation: "AccessoryInformation",
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
            addCharacteristic: sinon.stub(),
            setCharacteristic: sinon.stub().returns(accessoryStub),
            getCharacteristic: sinon.stub().returns(characteristicStub),
            updateCharacteristic: sinon.stub(),
            addLinkedService: sinon.stub(),
        };

        homebridgeStub = {
            callbacks: {},

            hap: hapStub,
            registerPlatformAccessories: sinon.stub(),
            unregisterPlatformAccessories: sinon.stub(),

            platformAccessory: class {
                getService: any = () => accessoryStub;
                getServiceById: any = () => accessoryStub;
            },

            on(event: string, callback: Function) {
                if (this.callbacks[event] == null) {
                    this.callbacks[event] = [];
                }

                this.callbacks[event].push(callback);

                return this;
            },
        };

        configStub = {
            name: "Lutron",
            platform: "Lutron",
            cco: true,
            dimmers: true,
            fans: true,
            keypads: true,
            sensors: true,
            remotes: true,
            shades: true,
            strips: true,
            switches: true,
            timeclocks: true,
        };

        deviceStub = {
            id: "ID",
            type: DeviceType.Dimmer,
            update: sinon.stub(),
            set: sinon.stub(),
        };

        buttonStub = {
            id: "ID",
            index: 1,
            name: "NAME",
        };

        platform = new platformType(logStub, configStub, homebridgeStub);
    });

    it("should define the finish launching event", () => {
        expect(homebridgeStub.callbacks["didFinishLaunching"]).to.not.be.undefined;
    });

    it("should bind events after launching", () => {
        emit(homebridgeStub, "didFinishLaunching");

        expect(connectionStub.callbacks["Available"]).to.not.be.undefined;
        expect(connectionStub.callbacks["Update"]).to.not.be.undefined;
    });

    describe("onAvailable()", () => {
        beforeEach(() => {
            emit(homebridgeStub, "didFinishLaunching");
        });

        it("should create a device and register to homebridge", () => {
            emit(connectionStub, "Available", [deviceStub]);

            expect(homebridgeStub.registerPlatformAccessories).to.be.calledWith(
                "@mkellsy/homebridge-lutron",
                "Lutron",
                sinon.match.any,
            );
        });

        it("should unregister an undefined device from homebridge", () => {
            deviceStub.type = DeviceType.Unknown;

            emit(connectionStub, "Available", [deviceStub]);

            expect(homebridgeStub.unregisterPlatformAccessories).to.be.calledWith(
                "@mkellsy/homebridge-lutron",
                "Lutron",
                sinon.match.any,
            );
        });

        it("should not register an undefined device", () => {
            deviceStub.type = DeviceType.Unknown;

            emit(connectionStub, "Available", [deviceStub]);
            expect(homebridgeStub.registerPlatformAccessories).to.not.be.called;
        });

        it("should not register a cached device", () => {
            platform.configureAccessory(new homebridgeStub.platformAccessory());

            emit(connectionStub, "Available", [deviceStub]);

            expect(homebridgeStub.registerPlatformAccessories).to.not.be.called;
            expect(homebridgeStub.unregisterPlatformAccessories).to.not.be.called;
        });
    });

    describe("onAction()", () => {
        beforeEach(() => {
            emit(homebridgeStub, "didFinishLaunching");

            deviceStub = {
                id: "ID",
                type: DeviceType.Remote,
                update: sinon.stub(),
                set: sinon.stub(),
                buttons: [buttonStub],
            };
        });

        it("should call update value characteristic when an action event is recieved", () => {
            emit(connectionStub, "Available", [deviceStub]);
            emit(connectionStub, "Action", deviceStub, buttonStub, "Press");

            expect(characteristicStub.updateValue).to.be.called;
        });

        it("should not call update value characteristic for unregistered devices", () => {
            hapStub.uuid.generate.returns("UUID_PLATFORM_2");

            emit(connectionStub, "Action", deviceStub, buttonStub, "Press");
            expect(characteristicStub.updateValue).to.not.be.called;
        });
    });

    describe("onUpdate()", () => {
        beforeEach(() => {
            emit(homebridgeStub, "didFinishLaunching");
        });

        it("should call update characteristic when an update event is recieved", () => {
            emit(connectionStub, "Available", [deviceStub]);
            emit(connectionStub, "Update", deviceStub, { state: "Off", level: 0 });

            expect(accessoryStub.updateCharacteristic).to.be.called;
        });

        it("should not call update characteristic for unregistered devices", () => {
            hapStub.uuid.generate.returns("UUID_PLATFORM_2");

            emit(connectionStub, "Update", deviceStub, { state: "Off", level: 0 });
            expect(accessoryStub.updateCharacteristic).to.not.be.called;
        });
    });
});
