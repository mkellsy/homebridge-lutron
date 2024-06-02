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
            "platform": "Lutron",
            "cco": false,
            "dimmers": false,
            "keypads": true,
            "sensors": true,
            "remotes": true,
            "shades": false,
            "strips": false,
            "switches": false
        }
    ]
}
```

## Support

I offer not support for this plugin, it is published only for personal use.
