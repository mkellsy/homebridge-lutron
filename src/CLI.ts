import * as Leap from "@mkellsy/leap-client";

import Colors from "colors";

import { Logger } from "./Logger";
import { program } from "commander";

const log = Logger.log;

program.option("-d, --debug", "enable debug logging");

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
