# Getting Started (Manual)

This documents the installation and configuration process using the command line.

## Install

You can install this plugin from the command line using NPM.

```bash
sudo npm install -g --unsafe-perms @mkellsy/homebridge-lutron
```

Why `--unsafe-perms`? This plugin contains a script that needs to be linked in the `/usr/local/bin` folder. This flag allows this linking. Without the `--unsafe-perms` flag, you will need to run the `lutron` command from the plugin directory.

## Pairing

After you install the plugin, you will need to pair your processors or bridges. You can start the pairing process by running this command.

```bash
lutron pair
```

You will need to press the pairing button on your processor or bridge after running this command.

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
