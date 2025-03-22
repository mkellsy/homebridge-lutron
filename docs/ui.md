# Getting Started
This documents the installation and configuration process.

## Install
You can install this plugin from the **Plugins** page in the Homebridge Interface. Search for ***lutron*** and install the **@mkellsy/homebridge-lutron** version.

More information about installing plugins can be found **[here](https://github.com/homebridge/homebridge-config-ui-x?tab=readme-ov-file#plugin-screen)**.

## Pairing
After you install the plugin, the plugin configuration dialog will show.

![](https://raw.githubusercontent.com/mkellsy/homebridge-lutron/refs/heads/main/docs/assets/Initial.png)

Click the **Pair Processor** button.

![](https://raw.githubusercontent.com/mkellsy/homebridge-lutron/refs/heads/main/docs/assets/Association.png)

The dialog will ask you to press the pairing button on your processor or bridge. Refer to you Lutron documentaion on the location of the pairing button. This will be different depending on which system you have.

If you have multiple systems Caseta and RA3, you can pair other processors or bridges by clicking the **Pair Processor** again, and pressing the pairing button on the other device.

> Systems that have more than one processor, such as RA3, you will only need to pair the first bridge. Devices programed for other bridges are vended from all processors.

After you have a processor or bridge paired, the full configuration dialog will show.

## Configuration
This plugin doesn't require any configuration other than the platform to work. The default is to expose remotes, keypads and sensors.

![](https://raw.githubusercontent.com/mkellsy/homebridge-lutron/refs/heads/main/docs/assets/Paired.png)

You can expose the devices you wish to add to Homebridge and then click **Save**. Homebridge will restart.

## Bridge Configuration
It is recommended to run your plugins in child bridges. This prevents plugins from affecting each other. For more information on child bridges click **[here](https://github.com/homebridge/homebridge/wiki/Child-Bridges)**