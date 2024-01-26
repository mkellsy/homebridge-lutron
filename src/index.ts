import * as Leap from "@mkellsy/leap-client";

import Colors from "colors";

import { Logger } from "./Logger";
import { program } from "commander";

const log = Logger.log;

program.option("-d, --debug", "enable debug logging");

program.command("start").action(() => {
    Logger.configure(program);

    const location = Leap.connect();

    location.on("Identify", (device): void => {
        device.log.debug(device.name, Colors.green(device.type));
    });

    location.on("Update", (device, state): void => {
        device.log.debug(device.name, Colors.dim(JSON.stringify(state)));
    });

    location.on("Action", (device, button, action): void => {
        device.log.debug(device.name, Colors.dim(JSON.stringify(button)), Colors.green(action));
    });
});

program.command("pair").action(() => {
    Logger.configure(program);

    console.log(Colors.green("Press the pairing button on the main processor or smart bridge"));

    Leap.pair()
        .then(() => log.info("Processor paired"))
        .catch((error) => log.error(Colors.red(error.message)))
        .finally(() => process.exit(0));
});

export = function main(args?: string[] | undefined): void {
    program.parse(args || process.argv);
};
