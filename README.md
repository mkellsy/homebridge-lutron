# Homebridge Lutron

This is a plugin that exposes Lutron Caseta and Radio RA3 devices to Homebridge.

## CLI

Pairing a processor or bridge

```
lutron pair
```

This will automatically discover processors. You will need to press the pairing button on your processor or bridge.

If you have multiple systems Caseta and RA3, you can pair other processors or bridges by running the pair command again, and pressing the pairing button on the other device.

> Systems that have more than one processor, such as RA3, you will only need to pair the first bridge. Devices programed for other bridges are vended from all processors.

After you have a processor or bridge paired, you can start Homebridge.

## Devices

This pulgin supports most of the devices available in Caseda and RA3. By default, only devices that are not nativally supported are exposed to Homebridge. These devices are exposed to Homebridge by default.

* Pico Remotes (All types are aupported, including 4 button scene remotes)
* Sunnata Keypads (All types, including both hybrid and non-hybrid)
* Occupancy Sensors
* Timeclocks

You can enable the other types via the configuration.

## Timeclocks

Timeclocks are a feature of RA3. They are programmed via the Lutron Designer. These are exposed as switches in Homebridge, and allow you to intergrate Lutron Timeclocks into HomeKit Automations.

## Keypads

Sunnata keypads are a feature of RA3. They behave similar to Pico remotes, but since they do not emit a release event, HomeKit double presses and long presses are not supported. They do show up in HomeKit, but assigning actions to these will not work. Only single presses are supported.

## Configuration

This plugin doesn't require any configuration other than the platform to work. The default is to expose remotes, keypads and sensors.

```json
{
    "platforms": [
        {
            "platform": "Lutron"
        }
    ]
}
```

You can turn on other devices too. These devices are not turned on because they are already exposed by Lutron's HomeKit integration.

```json
{
    "platforms": [
        {
            "name": "Lutron",
            "platform": "Lutron",
            "cco": false,
            "dimmers": false,
            "keypads": true,
            "sensors": true,
            "remotes": true,
            "shades": false,
            "strips": false,
            "switches": false,
            "timeclocks": true
        }
    ]
}
```

## Support

I offer not support for this plugin, it is published only for personal use.
