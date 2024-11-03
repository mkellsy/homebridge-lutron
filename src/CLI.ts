import * as Leap from "@mkellsy/leap-client";

import Colors from "colors";

import { Logger } from "./Logger";
import { program } from "commander";

const log = Logger.log;

/*
 * Adds the debug option to the CLI.
 */
program.option("-d, --debug", "enable debug logging");

/*
 * Defines the pairing tool in the CLI.
 */
program.command("pair").action(() => {
    Logger.configure(program);

    console.log(Colors.green("Press the pairing button on the main processor or smart bridge"));

    Leap.pair()
        .then(() => log.info("Processor paired"))
        .catch((error) => log.error(Colors.red(error.message)))
        .finally(() => process.exit(0));
});

/**
 * Exports the CLI main entry point.
 *
 * @param args (optional) A reference to the command line arguments.
 * @public
 */
export = function main(args?: string[] | undefined): void {
    program.parse(args || process.argv);
};
