import * as Interfaces from "@mkellsy/hap-device";

export function parseAction(action: Interfaces.Action): number {
    switch (action) {
        case "Press":
            return 0;

        case "DoublePress":
            return 1;

        case "LongPress":
            return 2;

        default:
            return -1;
    }
}
