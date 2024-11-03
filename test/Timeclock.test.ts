import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "@mkellsy/hap-device";
import { Timeclock } from "../src/Timeclock";

chai.use(sinonChai);

describe("Timeclock", () => {
    let homebridgeStub: any;
    let serviceStub: any;
    let deviceStub: any;
    let hapStub: any;
    let logStub: any;

    let stateStub: any;
    let accessoryStub: any;

    let timeclock: Timeclock;

    const emit = (stub: any, event: string, ...payload: any[]) => {
        for (const callback of stub.callbacks[event] || []) {
            callback(...payload);
        }
    };

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
                Switch: "Switch",
            },
            Characteristic: {
                On: "On",
                Model: "Model",
                Manufacturer: "Manufacturer",
                SerialNumber: "SerialNumber",
            },
        };

        stateStub = {
            callbacks: {},

            onGet(callback: Function) {
                this.callbacks["Get"] = callback;

                return this;
            },

            onSet(callback: Function) {
                this.callbacks["Set"] = callback;

                return this;
            },
        };

        accessoryStub = {
            setCharacteristic: sinon.stub(),
            getCharacteristic: sinon.stub(),
            updateCharacteristic: sinon.stub(),
        };

        accessoryStub.setCharacteristic.returns(accessoryStub);
        accessoryStub.getCharacteristic.withArgs("On").returns(stateStub);
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
            id: "ID_SWITCH",
            name: "NAME",
            type: DeviceType.Timeclock,
            status: { state: "On" },
            update: sinon.stub(),
            set: sinon.stub(),
            capabilities: {},
        };
    });

    it("should bind listeners when device is created", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);

        timeclock = new Timeclock(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;
    });

    it("should bind listeners when device is created from cache", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        serviceStub.withArgs("Switch").returns(accessoryStub);

        timeclock = new Timeclock(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;
    });

    describe("onUpdate()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("Switch").returns(accessoryStub);

            timeclock = new Timeclock(homebridgeStub, deviceStub, logStub);
        });

        it("should update the state to on", () => {
            timeclock.onUpdate({ state: "On" });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("On", true);
        });

        it("should update the state to off", () => {
            timeclock.onUpdate({ state: "Off" });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("On", false);
        });
    });

    describe("onGetState()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("Switch").returns(accessoryStub);

            timeclock = new Timeclock(homebridgeStub, deviceStub, logStub);
        });

        it("should return the current level of the device", () => {
            expect(stateStub.callbacks["Get"]()).to.equal(true);
        });

        it("should return the current state after an update", () => {
            deviceStub.status = { state: "Off" };

            expect(stateStub.callbacks["Get"]()).to.equal(false);
        });
    });
});
