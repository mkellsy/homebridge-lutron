# Homebridge Lutron

This is a plugin that exposes Lutron Caseta and Radio RA3 devices to Homebridge.

## Getting Started

This plugin supports both the Homebridge UI and CLI. You can install and configure depending on your needs.
-   **[Getting Started](https://github.com/mkellsy/homebridge-lutron/blob/main/docs/ui.md)**
-   **[Getting Started (Manual)](https://github.com/mkellsy/homebridge-lutron/blob/main/docs/cli.md)**

## Devices

This pulgin supports most of the devices available in Caseda and RA3. By default, only devices that are not nativally supported are exposed to Homebridge. These devices this plugin supports.

-   Pico Remotes (All types are aupported, including 4 button scene remotes)
-   Sunnata Keypads (All types, including both hybrid & non-hybrid)
-   Sunnata, Caseta & Maestro Dimmers
-   Sunnata, Caseta & Maestro Switches
-   Sunnata, Caseta & Maestro Fan Controllers
-   CCO Modules (Including Vive)
-   Switch Modules (Including Vive)
-   0-10v Dimmer Modules (Including Vive)
-   Triathlon, Sivoia & Serena Window Coverings
-   Lumaris LED Light Strips (Tunable White Tape Only)
-   Occupancy Sensors
-   Motion Sensors
-   Timeclocks

## Timeclocks

Timeclocks are a feature of RA3. They are programmed via the Lutron Designer. These are exposed as switches in Homebridge, and allow you to intergrate Lutron Timeclocks into HomeKit Automations.

## Keypads

Sunnata keypads are a feature of RA3. They behave similar to Pico remotes, but since they do not emit a release event, HomeKit double presses and long presses are not supported. They do show up in HomeKit, but assigning actions to these will not work. Only single presses are supported.

## Storage
This plugin has its own storage folder. Each file is explained in the **[storage](https://github.com/mkellsy/homebridge-lutron/blob/main/docs/storage.md)** documentation.

## Support

I offer no support for this plugin, it is published only for personal use.
