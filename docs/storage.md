# Storage
This documents what files get wrote to your device and what each file does.

## Storage Directory
This plugin stores files to a `.leap` folder in the same directory as `.homebridge`. Why? This is because Lutron processors are paired per device not Homebridge instance.

## Files
Each file stores different information related to your Lutron system,

### Discovery
The `discovery` file stores information about Lutron devices found on your network. This is used to speed up startup and can attempt to connect to previously discovered devices, while mDNS is waiting for a broadcast.

If any network information changes on the device, this will be re-discovered and updated via mDNS.

### Pairing
The `pairing` file stores the certificates for paired processors. This sensitive information is encrypted at rest, and sould not be stored in the clear text config file that Homebrtidge uses.

### Cache
There will be a file for each processor you have paired. The file name is the processor ID. This is a flat cache file used to optimize the discovery process. This allows the processor to come online without needing to de-discover each device.

The flat cache is very useful for systems that have hundreds of devices.

## Homebridge Configuration
There also is a configuration section for this plugin in the Homebridge `config.json` file. This contains information related to the Homebridge instance.

This contains which device typess are exposed and the nesessary properties for Homebridge.
