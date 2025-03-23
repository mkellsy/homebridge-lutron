import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Accessories } from "../src/Accessories";
import { DeviceType } from "@mkellsy/hap-device";

chai.use(sinonChai);

describe("Accessories", () => {
    let homebridgeStub: any;
    let serviceStub: any;
    let deviceStub: any;
    let configStub: any;
    let hapStub: any;
    let logStub: any;

    let characteristicStub: any;
    let accessoryStub: any;

    beforeEach(() => {
        configStub = {
            platform: "Lutron",
            name: "Lutron",
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
            },
            Characteristic: {
                Model: "Model",
                Manufacturer: "Manufacturer",
                SerialNumber: "SerialNumber",
                ServiceLabelNamespace: {
                    ARABIC_NUMERALS: 1,
                },
            },
        };

        characteristicStub = {
            callbacks: {},
            onGet: sinon.stub(),
            onSet: sinon.stub(),
        };

        characteristicStub.onGet.returns(characteristicStub);
        characteristicStub.onSet.returns(characteristicStub);

        accessoryStub = {
            addCharacteristic: sinon.stub(),
            setCharacteristic: sinon.stub(),
            getCharacteristic: sinon.stub().returns(characteristicStub),
            updateCharacteristic: sinon.stub(),
        };

        accessoryStub.setCharacteristic.returns(accessoryStub);
        serviceStub = sinon.stub().returns(accessoryStub);

        homebridgeStub = {
            callbacks: {},

            hap: hapStub,
            on: sinon.stub(),
            registerPlatformAccessories: sinon.stub(),
            unregisterPlatformAccessories: sinon.stub(),

            platformAccessory: class {
                getService: any = serviceStub;
            },
        };

        deviceStub = {
            id: "ID_ACCESSORIES",
            status: { state: "On", level: 50 },
            update: sinon.stub(),
            set: sinon.stub(),
            capabilities: {},
            buttons: [],
        };
    });

    describe("create()", () => {
        const TEST_CASES = [
            DeviceType.Contact,
            DeviceType.Dimmer,
            DeviceType.Fan,
            DeviceType.Keypad,
            DeviceType.Occupancy,
            DeviceType.Remote,
            DeviceType.Shade,
            DeviceType.Strip,
            DeviceType.Switch,
            DeviceType.Timeclock,
        ];

        for (const TEST_CASE of TEST_CASES) {
            it(`should create a proper ${TEST_CASE} device`, () => {
                deviceStub.type = TEST_CASE;
                deviceStub.id = `UUID_ACCESSORIES_${TEST_CASE.toUpperCase()}`;
                hapStub.uuid.generate.returns(`UUID_ACCESSORIES_${TEST_CASE.toUpperCase()}`);

                const device = Accessories.create(homebridgeStub, deviceStub, configStub, logStub);

                expect(device).to.not.be.undefined;
                expect(typeof device).to.equal("object");
            });

            it(`should not create a ${TEST_CASE} device if config is marked false`, () => {
                deviceStub.type = TEST_CASE;
                deviceStub.id = `UUID_ACCESSORIES_${TEST_CASE.toUpperCase()}`;
                hapStub.uuid.generate.returns(`UUID_ACCESSORIES_${TEST_CASE.toUpperCase()}`);

                const device = Accessories.create(
                    homebridgeStub,
                    deviceStub,
                    {
                        platform: "Lutron",
                        name: "Lutron",
                        cco: false,
                        dimmers: false,
                        fans: false,
                        keypads: false,
                        sensors: false,
                        remotes: false,
                        shades: false,
                        strips: false,
                        switches: false,
                        timeclocks: false,
                    },
                    logStub,
                );

                expect(device).to.be.undefined;
            });
        }

        it("should not create a device for unknown types", () => {
            deviceStub.type = DeviceType.Unknown;
            deviceStub.id = "UUID_ACCESSORIES_UNKNOWN";
            hapStub.uuid.generate.returns("UUID_ACCESSORIES_UNKNOWN");

            const device = Accessories.create(homebridgeStub, deviceStub, configStub, logStub);

            expect(device).to.be.undefined;
        });
    });

    describe("get()", () => {
        const TEST_CASES = [
            DeviceType.Contact,
            DeviceType.Dimmer,
            DeviceType.Fan,
            DeviceType.Keypad,
            DeviceType.Occupancy,
            DeviceType.Remote,
            DeviceType.Shade,
            DeviceType.Strip,
            DeviceType.Switch,
            DeviceType.Timeclock,
        ];

        for (const TEST_CASE of TEST_CASES) {
            it(`should get the ${TEST_CASE} device`, () => {
                deviceStub.type = TEST_CASE;
                hapStub.uuid.generate.returns(`UUID_ACCESSORIES_${TEST_CASE.toUpperCase()}`);

                const device = Accessories.create(homebridgeStub, deviceStub, configStub, logStub);

                device?.register();
                expect(Accessories.get(homebridgeStub, deviceStub)).to.deep.equal(device);
            });
        }
    });

    describe("remove()", () => {
        const TEST_CASES = [
            DeviceType.Contact,
            DeviceType.Dimmer,
            DeviceType.Fan,
            DeviceType.Keypad,
            DeviceType.Occupancy,
            DeviceType.Remote,
            DeviceType.Shade,
            DeviceType.Strip,
            DeviceType.Switch,
            DeviceType.Timeclock,
        ];

        for (const TEST_CASE of TEST_CASES) {
            it(`should unregister the ${TEST_CASE} device`, () => {
                deviceStub.type = TEST_CASE;
                hapStub.uuid.generate.returns(`UUID_ACCESSORIES_${TEST_CASE.toUpperCase()}`);

                const device = Accessories.create(homebridgeStub, deviceStub, configStub, logStub);

                device?.register();
                Accessories.remove(homebridgeStub, deviceStub);

                expect(homebridgeStub.unregisterPlatformAccessories).to.be.calledWith(
                    "@mkellsy/homebridge-lutron",
                    "Lutron",
                    sinon.match.any,
                );
            });

            it(`should not unregister the ${TEST_CASE} device if it is not registered`, () => {
                deviceStub.type = TEST_CASE;
                hapStub.uuid.generate.returns(`UUID_ACCESSORIES_${TEST_CASE.toUpperCase()}_2`);

                Accessories.create(homebridgeStub, deviceStub, configStub, logStub);
                Accessories.remove(homebridgeStub, deviceStub);
                expect(homebridgeStub.unregisterPlatformAccessories).to.not.be.called;
            });
        }
    });
});
