# Homebridge Participle
This participle plugin is a plugin that exposes evented clients to Homebridge that all use the same interfaces and events.

## CLI
Pairing a processor or bridge

```
participle pair
```

This will autopmatically discover processors. You will need to press the pairing button on your processor or bridge.

If you have multiple systems Caseta and RA3, you can pair other processors or bridges by runnging the pair command again, and pressing the pairing button on the other device.

> Systems that have more than one processor, such as RA3, you will only need to pair the first bridge. Devices programed for other bridges are vended from all processors.

After you have a processor or bridge paired, you can start the publisher.

```
participle start
```
