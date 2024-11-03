import * as Console from "js-logger";

import Colors from "colors";

import { Command } from "commander";
import { inspect } from "util";

/**
 * Defines a logger instance.
 * @private
 */
export type Log = Console.ILogger;

/**
 * Extends the js logger and configures its output.
 * @private
 */
export abstract class Logger {
    /**
     * Configures the logger based on CLI arguments.
     *
     * @param program Reference to the CLI command processor.
     */
    static configure(program: Command) {
        const formatter: Console.ILogHandler = (messages, context) => {
            if (context.name != null) {
                messages.unshift(Colors.cyan(context.name));
            }

            messages.unshift(Colors.dim(new Date().toLocaleTimeString()));
        };

        if (program.opts().debug) {
            Console.setDefaults({ defaultLevel: Console.default.DEBUG, formatter });
        } else {
            Console.setDefaults({ defaultLevel: Console.default.INFO, formatter });
        }
    }

    /**
     * A reference to the global logger instance.
     *
     * @returns Logger instance.
     */
    static get log(): Console.GlobalLogger {
        return Console.default;
    }

    /**
     * Creates or fetches a named logger instance.
     *
     * @param name The desired name for an instance.
     *
     * @returns Logger instance.
     */
    static get(name: string): Console.ILogger {
        return Console.get(name);
    }

    /**
     * Formats non-string objects for printing to the logger.
     *
     * @param value An object to print.
     *
     * @returns A string suitable for logging.
     */
    static inspect(value: object): string {
        return Colors.dim(
            inspect(value, {
                showHidden: false,
                depth: Infinity,
                colors: true,
                compact: true,
                breakLength: Infinity,
            }),
        );
    }
}
