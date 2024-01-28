import * as Leap from "@mkellsy/leap-client";

import Colors from "colors";

import { Logger } from "./Logger";
import { program } from "commander";

const log = Logger.log;

program.option("-d, --debug", "enable debug logging");

program
    .command("start")
    .option("-r, --refresh", "refresh processor cache")
    .action((options) => {
        Logger.configure(program);

        const location = Leap.connect(options.refresh);

        location.on("Available", (processor): void => {
            const devices = [...processor.devices.values()];

            log.debug("Processor", Logger.inspect({
                id: processor.id,
                devices: [...processor.devices.values()].length,
            }));

            devices.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }

                if (a.name > b.name) {
                    return 1;
                }

                return 0;
            });

            for (const device of devices) {
                const details: { [key: string]: any } = {
                    name: device.name,
                    room: device.room,
                    type: device.type,
                };

                if (Object.keys(device.capabilities).length > 0) {
                    details.capabilities = device.capabilities;
                }

                log.debug(device.name, Logger.inspect(details));
            }
        });

        location.on("Update", (device, state): void => {
            log.debug(device.name, Logger.inspect(state));
        });

        location.on("Action", (device, button, action): void => {
            log.debug(device.name, Logger.inspect({ name: button.name, action }));
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
