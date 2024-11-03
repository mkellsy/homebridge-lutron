import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "@mkellsy/hap-device";
import { Occupancy } from "../src/Occupancy";

chai.use(sinonChai);

describe("Occupancy", () => {
    let homebridgeStub: any;
    let serviceStub: any;
    let deviceStub: any;
    let hapStub: any;
    let logStub: any;

    let stateStub: any;
    let accessoryStub: any;

    let occupancy: Occupancy;

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
                OccupancySensor: "OccupancySensor",
            },
            Characteristic: {
                Model: "Model",
                Manufacturer: "Manufacturer",
                SerialNumber: "SerialNumber",
                OccupancyDetected: "OccupancyDetected",
            },
        };

        stateStub = {
            callbacks: {},

            onGet(callback: Function) {
                this.callbacks["Get"] = callback;

                return this;
            },
        };

        accessoryStub = {
            setCharacteristic: sinon.stub(),
            getCharacteristic: sinon.stub(),
            updateCharacteristic: sinon.stub(),
        };

        accessoryStub.setCharacteristic.returns(accessoryStub);
        accessoryStub.getCharacteristic.withArgs("OccupancyDetected").returns(stateStub);
        serviceStub = sinon.stub();

        homebridgeStub = {
            callbacks: {},

            hap: hapStub,
            on: sinon.stub(),
            registerPlatformAccessories: sinon.stub(),
            unregisterPlatformAccessories: sinon.stub(),

            platformAccessory: class {
                getService: any = serviceStub;
                addService: any = sinon.stub().returns(accessoryStub);
            },
        };

        deviceStub = {
            id: "ID_OCCUPANCY",
            name: "NAME",
            type: DeviceType.Occupancy,
            status: { state: "Occupied" },
            update: sinon.stub(),
            set: sinon.stub(),
            capabilities: {},
        };
    });

    it("should bind listeners when device is created", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        serviceStub.withArgs("OccupancySensor").returns(undefined);

        occupancy = new Occupancy(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;
    });

    it("should bind listeners when device is created from cache", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        serviceStub.withArgs("OccupancySensor").returns(accessoryStub);

        occupancy = new Occupancy(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;
    });

    describe("onUpdate()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("OccupancySensor").returns(accessoryStub);

            occupancy = new Occupancy(homebridgeStub, deviceStub, logStub);
        });

        it("should update the occupancy to true", () => {
            occupancy.onUpdate({ state: "Occupied" });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("OccupancyDetected", true);
        });

        it("should update the occupancy to false", () => {
            occupancy.onUpdate({ state: "Unoccupied" });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("OccupancyDetected", false);
        });
    });

    describe("onGetState()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("OccupancySensor").returns(accessoryStub);

            occupancy = new Occupancy(homebridgeStub, deviceStub, logStub);
        });

        it("should return the current occupancy of the device", () => {
            expect(stateStub.callbacks["Get"]()).to.equal(true);
        });

        it("should return the current occupancy after an update", () => {
            deviceStub.status = { state: "Unoccupied" };

            expect(stateStub.callbacks["Get"]()).to.equal(false);
        });
    });
});
