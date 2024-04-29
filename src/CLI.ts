import * as Leap from "@mkellsy/leap-client";
import * as Interface from "@mkellsy/hap-device";

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

        Leap.connect(options.refresh).on("Available", onAvailable).on("Update", onUpdate).on("Action", onAction);
    });

program.command("pair").action(() => {
    Logger.configure(program);

    console.log(Colors.green("Press the pairing button on the main processor or smart bridge"));

    Leap.pair()
        .then(() => log.info("Processor paired"))
        .catch((error) => log.error(Colors.red(error.message)))
        .finally(() => process.exit(0));
});

const onAvailable = (devices: Interface.Device[]): void => {
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

        if ((device as any).buttons != null) {
            details.buttons = (device as any).buttons.map((button: any) => ({
                index: button.index,
                name: button.name,
            }));
        }

        if (Object.keys(device.capabilities).length > 0) {
            details.capabilities = device.capabilities;
        }

        log.debug(device.name, Logger.inspect(details));
    }
};

const onUpdate = (device: Interface.Device, state: Interface.DeviceState): void => {
    log.debug(device.name, Logger.inspect(state));
};

const onAction = (device: Interface.Device, button: Interface.Button, action: Interface.Action): void => {
    log.debug(device.name, Logger.inspect({ name: button.name, action }));
};

export = function main(args?: string[] | undefined): void {
    program.parse(args || process.argv);
};
