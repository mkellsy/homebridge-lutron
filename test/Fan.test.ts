import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "@mkellsy/hap-device";
import { Fan } from "../src/Fan";

chai.use(sinonChai);

describe("Fan", () => {
    let homebridgeStub: any;
    let addServiceStub: any;
    let getServiceStub: any;
    let deviceStub: any;
    let hapStub: any;
    let logStub: any;

    let speedStub: any;
    let stateStub: any;

    let accessoryStub: any;

    let fan: Fan;

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
                Fan: "Fan",
            },
            Characteristic: {
                On: "On",
                Name: "Name",
                Model: "Model",
                Switch: "Switch",
                Manufacturer: "Manufacturer",
                SerialNumber: "SerialNumber",
                RotationSpeed: "RotationSpeed",
                ConfiguredName: "ConfiguredName",
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

        speedStub = {
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
        accessoryStub.getCharacteristic.withArgs("RotationSpeed").returns(speedStub);

        addServiceStub = sinon.stub();
        getServiceStub = sinon.stub();

        homebridgeStub = {
            callbacks: {},

            hap: hapStub,
            on: sinon.stub(),
            registerPlatformAccessories: sinon.stub(),
            unregisterPlatformAccessories: sinon.stub(),

            platformAccessory: class {
                getService: any = getServiceStub;
                addService: any = addServiceStub;
            },
        };

        deviceStub = {
            id: "ID_FAN",
            name: "NAME",
            type: DeviceType.Fan,
            status: { state: "On", speed: 3 },
            update: sinon.stub(),
            set: sinon.stub(),
            capabilities: {},
        };
    });

    it("should bind listeners when device is created", () => {
        getServiceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        addServiceStub.withArgs("Fan").returns(accessoryStub);

        fan = new Fan(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;

        expect(speedStub.callbacks["Get"]).to.not.be.undefined;
        expect(speedStub.callbacks["Set"]).to.not.be.undefined;
    });

    it("should bind listeners when device is created from cache", () => {
        getServiceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        getServiceStub.withArgs("Fan").returns(accessoryStub);

        fan = new Fan(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;

        expect(speedStub.callbacks["Get"]).to.not.be.undefined;
        expect(speedStub.callbacks["Set"]).to.not.be.undefined;
    });

    describe("onUpdate()", () => {
        beforeEach(() => {
            getServiceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            getServiceStub.withArgs("Fan").returns(accessoryStub);
        });

        it("should update the state to on", () => {
            fan = new Fan(homebridgeStub, deviceStub, logStub);
            fan.onUpdate({ state: "On", speed: 7 });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("On", true);
            expect(accessoryStub.updateCharacteristic).to.be.calledWith("RotationSpeed", 100);
        });

        it("should update the state to off", () => {
            fan = new Fan(homebridgeStub, deviceStub, logStub);
            fan.onUpdate({ state: "Off", speed: 0 });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("On", false);
            expect(accessoryStub.updateCharacteristic).to.be.calledWith("RotationSpeed", 0);
        });
    });

    describe("onGetState()", () => {
        beforeEach(() => {
            getServiceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            getServiceStub.withArgs("Fan").returns(accessoryStub);

            fan = new Fan(homebridgeStub, deviceStub, logStub);
        });

        it("should return the current state of the device", () => {
            expect(stateStub.callbacks["Get"]()).to.be.true;
        });

        it("should return the current state after an update", () => {
            deviceStub.status = { state: "Off", level: 0 };

            expect(stateStub.callbacks["Get"]()).to.be.false;
        });
    });

    describe("onSetState()", () => {
        beforeEach(() => {
            getServiceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            getServiceStub.withArgs("Fan").returns(accessoryStub);

            fan = new Fan(homebridgeStub, deviceStub, logStub);
        });

        it("should update the device state to off", () => {
            stateStub.callbacks["Set"](false);

            expect(logStub.debug).to.be.calledWith("Fan Set State: NAME Off");
            expect(logStub.debug).to.be.calledWith("Fan Set Speed: NAME 0");
        });

        it("should update the device state to on", () => {
            deviceStub.status = { state: "Off" };
            stateStub.callbacks["Set"](true);

            expect(logStub.debug).to.be.calledWith("Fan Set State: NAME On");
            expect(logStub.debug).to.be.calledWith("Fan Set Speed: NAME 7");
        });

        it("should not update the device if the values is the same", () => {
            deviceStub.status = { state: "On", speed: 7 };
            stateStub.callbacks["Set"](true);

            expect(logStub.debug).to.not.be.calledWith("Fan Set State: NAME On");
        });
    });

    describe("onGetSpeed()", () => {
        beforeEach(() => {
            getServiceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            getServiceStub.withArgs("Fan").returns(accessoryStub);

            fan = new Fan(homebridgeStub, deviceStub, logStub);
        });

        it("should return the current speed of the device", () => {
            expect(speedStub.callbacks["Get"]()).to.equal(43);
        });

        it("should return the current state after an update", () => {
            deviceStub.status = { state: "Off", speed: 0 };

            expect(speedStub.callbacks["Get"]()).to.equal(0);
        });
    });

    describe("onSetSpeed()", () => {
        beforeEach(() => {
            getServiceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            getServiceStub.withArgs("Fan").returns(accessoryStub);

            fan = new Fan(homebridgeStub, deviceStub, logStub);
        });

        it("should update the device state to off", () => {
            speedStub.callbacks["Set"](0);

            expect(logStub.debug).to.be.calledWith("Fan Set State: NAME Off");
            expect(logStub.debug).to.be.calledWith("Fan Set Speed: NAME 0");
        });

        it("should update the device state to on", () => {
            speedStub.callbacks["Set"](100);

            expect(logStub.debug).to.be.calledWith("Fan Set State: NAME On");
            expect(logStub.debug).to.be.calledWith("Fan Set Speed: NAME 7");
        });

        it("should not update the device if the values is the same", () => {
            speedStub.callbacks["Set"](43);

            expect(logStub.debug).to.not.be.calledWith("Fan Set Speed: NAME 3");
        });
    });
});
