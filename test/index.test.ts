import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import main from "../src";
import { Platform, platform, plugin } from "../src/Platform";

chai.use(sinonChai);

describe("index", () => {
    let homebridgeStub: any;

    beforeEach(() => {
        homebridgeStub = { registerPlatform: sinon.stub() };
    });

    it("should call register platform with the proper values", () => {
        main(homebridgeStub);
        expect(homebridgeStub.registerPlatform).to.be.calledWith(plugin, platform, Platform);
    });
});
