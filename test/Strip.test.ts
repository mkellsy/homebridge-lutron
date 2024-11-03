import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "@mkellsy/hap-device";
import { Strip } from "../src/Strip";

chai.use(sinonChai);

describe("Strip", () => {
    let homebridgeStub: any;
    let serviceStub: any;
    let deviceStub: any;
    let hapStub: any;
    let logStub: any;

    let stateStub: any;
    let levelStub: any;
    let luminanceStub: any;
    let accessoryStub: any;

    let strip: Strip;

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
                On: "On",
                Model: "Model",
                Brightness: "Brightness",
                Manufacturer: "Manufacturer",
                SerialNumber: "SerialNumber",
                ColorTemperature: "ColorTemperature",
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

        levelStub = {
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

        luminanceStub = {
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
        accessoryStub.getCharacteristic.withArgs("Brightness").returns(levelStub);
        accessoryStub.getCharacteristic.withArgs("ColorTemperature").returns(luminanceStub);

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
            id: "ID_STRIP",
            name: "NAME",
            type: DeviceType.Strip,
            status: { state: "On", level: 50, luminance: 140 },
            update: sinon.stub(),
            set: sinon.stub(),
            capabilities: {},
        };
    });

    it("should bind listeners when device is created", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);

        strip = new Strip(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;

        expect(levelStub.callbacks["Get"]).to.not.be.undefined;
        expect(levelStub.callbacks["Set"]).to.not.be.undefined;

        expect(luminanceStub.callbacks["Get"]).to.not.be.undefined;
        expect(luminanceStub.callbacks["Set"]).to.not.be.undefined;
    });

    it("should bind listeners when device is created from cache", () => {
        serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
        serviceStub.withArgs("LightBulb").returns(accessoryStub);

        strip = new Strip(homebridgeStub, deviceStub, logStub);

        expect(stateStub.callbacks["Get"]).to.not.be.undefined;

        expect(levelStub.callbacks["Get"]).to.not.be.undefined;
        expect(levelStub.callbacks["Set"]).to.not.be.undefined;

        expect(luminanceStub.callbacks["Get"]).to.not.be.undefined;
        expect(luminanceStub.callbacks["Set"]).to.not.be.undefined;
    });

    describe("onUpdate()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("LightBulb").returns(accessoryStub);

            strip = new Strip(homebridgeStub, deviceStub, logStub);
        });

        it("should update the state to on", () => {
            strip.onUpdate({ state: "On", level: 100, luminance: 300 });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("On", true);
            expect(accessoryStub.updateCharacteristic).to.be.calledWith("Brightness", 100);
        });

        it("should update the state to off", () => {
            strip.onUpdate({ state: "Off", level: 0, luminance: 140 });

            expect(accessoryStub.updateCharacteristic).to.be.calledWith("On", false);
            expect(accessoryStub.updateCharacteristic).to.be.calledWith("Brightness", 0);
        });
    });

    describe("onGetState()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("LightBulb").returns(accessoryStub);

            strip = new Strip(homebridgeStub, deviceStub, logStub);
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
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("LightBulb").returns(accessoryStub);

            strip = new Strip(homebridgeStub, deviceStub, logStub);
        });

        it("should update the device state to off", () => {
            stateStub.callbacks["Set"](false);

            expect(logStub.debug).to.be.calledWith("Strip Set State: NAME Off");
            expect(logStub.debug).to.be.calledWith("Strip Set Brightness: NAME 0");
        });

        it("should update the device state to on", () => {
            deviceStub.status = { state: "Off" };
            stateStub.callbacks["Set"](true);

            expect(logStub.debug).to.be.calledWith("Strip Set State: NAME On");
            expect(logStub.debug).to.be.calledWith("Strip Set Brightness: NAME 100");
        });

        it("should not update the device if the values is the same", () => {
            deviceStub.status = { state: "On", level: 100 };
            stateStub.callbacks["Set"](true);

            expect(logStub.debug).to.not.be.calledWith("Switch Set State: NAME On");
        });
    });

    describe("onGetBrightness()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("LightBulb").returns(accessoryStub);

            strip = new Strip(homebridgeStub, deviceStub, logStub);
        });

        it("should return the current level of the device", () => {
            expect(levelStub.callbacks["Get"]()).to.equal(50);
        });

        it("should return the current state after an update", () => {
            deviceStub.status = { state: "Off", level: 0 };

            expect(levelStub.callbacks["Get"]()).to.equal(0);
        });
    });

    describe("onSetBrightness()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("LightBulb").returns(accessoryStub);

            strip = new Strip(homebridgeStub, deviceStub, logStub);
        });

        it("should update the device state to off", () => {
            levelStub.callbacks["Set"](0);

            expect(logStub.debug).to.be.calledWith("Strip Set Brightness: NAME 0");
        });

        it("should update the device state to on", () => {
            levelStub.callbacks["Set"](100);

            expect(logStub.debug).to.be.calledWith("Strip Set Brightness: NAME 100");
        });
    });

    describe("onGetTemperature()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("LightBulb").returns(accessoryStub);

            strip = new Strip(homebridgeStub, deviceStub, logStub);
        });

        it("should return the current level of the device", () => {
            expect(luminanceStub.callbacks["Get"]()).to.equal(500);
        });

        it("should return the current state after an update", () => {
            deviceStub.status = { state: "Off", level: 0, luminance: 2000 };

            expect(luminanceStub.callbacks["Get"]()).to.equal(440);
        });
    });

    describe("onSetTemperature()", () => {
        beforeEach(() => {
            serviceStub.withArgs("AccessoryInformation").returns(accessoryStub);
            serviceStub.withArgs("LightBulb").returns(accessoryStub);

            strip = new Strip(homebridgeStub, deviceStub, logStub);
        });

        it("should update the device luminance to 2466", () => {
            luminanceStub.callbacks["Set"](300);

            expect(logStub.debug).to.be.calledWith("Strip Set Luminance: NAME 2466");
        });

        it("should update the device luminance to 3000", () => {
            luminanceStub.callbacks["Set"](140);

            expect(logStub.debug).to.be.calledWith("Strip Set Luminance: NAME 3000");
        });
    });
});
