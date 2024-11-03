import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "@mkellsy/hap-device";
import { Shade } from "../src/Shade";

chai.use(sinonChai);

describe("Shade", () => {
    let homebridgeStub: any;
    let serviceStub: any;
    let deviceStub: any;
    let hapStub: any;
    let logStub: any;

    let stateStub: any;
    let positionStub: any;
    let accessoryStub: any;

    let shade: Shade;

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
                Lightbulb: "Lightbulb",
            },
            Characteristic: {
                PositionState: "PositionState",
                Model: "Model",
                TargetPosition: "TargetPosition",
                CurrentPosition: "CurrentPosition",
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

        positionStub = {
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
        accessoryStub.getCharacteristic.withArgs("PositionState").returns(stateStub);
        accessoryStub.getCharacteristic.withArgs("CurrentPosition").returns(positionStub);
        accessoryStub.getCharacteristic.withArgs("TargetPosition").returns(positionStub);
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
            id: "ID_SHADE",
            name: "NAME",
            type: DeviceType.Shade,
            status: { state: "Open", level: 50 },
            update: sinon.stub(),
            set: sinon.stub(),
            capabilities: {},
        };
    });

    it("should bind listeners when device is created", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);

        shade = new Shade(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;

        expect(positionStub.callbacks["Get"]).to.not.be.undefined;
        expect(positionStub.callbacks["Set"]).to.not.be.undefined;
    });

    it("should bind listeners when device is created from cache", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        serviceStub.withArgs("WindowCovering").returns(accessoryStub);

        shade = new Shade(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;

        expect(positionStub.callbacks["Get"]).to.not.be.undefined;
        expect(positionStub.callbacks["Set"]).to.not.be.undefined;
    });

    describe("onUpdate()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("WindowCovering").returns(accessoryStub);

            shade = new Shade(homebridgeStub, deviceStub, logStub);
        });

        it("should update the state to open", () => {
            shade.onUpdate({ state: "Open", level: 100 });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("TargetPosition", 100);
        });

        it("should update the state to closed", () => {
            shade.onUpdate({ state: "Closed", level: 0 });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("TargetPosition", 0);
        });
    });

    describe("onGetState()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("WindowCovering").returns(accessoryStub);

            shade = new Shade(homebridgeStub, deviceStub, logStub);
        });

        it("should return the current state of the device", () => {
            expect(stateStub.callbacks["Get"]()).to.be.undefined;
        });

        it("should return the current state after an update", () => {
            deviceStub.status = { state: "Closed", level: 0 };

            expect(stateStub.callbacks["Get"]()).to.be.undefined;
        });
    });

    describe("onGetPosition()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("WindowCovering").returns(accessoryStub);

            shade = new Shade(homebridgeStub, deviceStub, logStub);
        });

        it("should return the current level of the device", () => {
            expect(positionStub.callbacks["Get"]()).to.equal(50);
        });

        it("should return the current state after an update", () => {
            deviceStub.status = { state: "Closed", level: 0 };

            expect(positionStub.callbacks["Get"]()).to.equal(0);
        });
    });

    describe("onSetPosition()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("WindowCovering").returns(accessoryStub);

            shade = new Shade(homebridgeStub, deviceStub, logStub);
        });

        it("should update the device state to closed", () => {
            positionStub.callbacks["Set"](0);

            expect(logStub.debug).to.be.calledWith("Shade Set Position: NAME 0");
        });

        it("should update the device state to open", () => {
            positionStub.callbacks["Set"](100);

            expect(logStub.debug).to.be.calledWith("Shade Set Position: NAME 100");
        });
    });
});
