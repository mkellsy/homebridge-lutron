(async () => {
    let config = {};

    try {
        config = (await homebridge.getPluginConfig())[0] || {};
    } catch (error) {
        console.error(error);

        config = {};
    }

    const queryForm = () => {
        const base = document.querySelector("#hb-lutron-form");

        return {
            base: document.querySelector("#hb-lutron"),
            name: base.querySelector("#name"),
        };
    };

    const queryActions = () => {
        const base = document.querySelector("#hb-lutron-actions");

        return {
            base,
            pair: base.querySelector("#pair-processor"),
            unpair: base.querySelector("#unpair-processors"),
            response: base.querySelector("#pair-response"),
        };
    };

    const queryOptions = () => {
        const base = document.querySelector("#hb-lutron-options");

        return {
            base,
            keypads: base.querySelector("#keypads"),
            controls: base.querySelector("#controls"),
            fans: base.querySelector("#fans"),
            strips: base.querySelector("#strips"),
            shades: base.querySelector("#shades"),
            sensors: base.querySelector("#sensors"),
            timeclocks: base.querySelector("#timeclocks"),
        };
    };

    const form = queryForm();
    const pairing = queryActions();
    const options = queryOptions();

    const populateForm = async () => {
        pairing.pair.style.display = "";
        options.base.style.display = "none";
        pairing.unpair.style.display = "none";

        let processors = [];

        try {
            processors = await homebridge.request("/processors");
        } catch (error) {
            console.error(error);

            processors = [];
        }

        if (processors.length > 0) {
            options.base.style.display = "";
            pairing.unpair.style.display = "";
        }

        pairing.response.innerHTML = "";

        form.name.value = config.name || "Lutron";

        options.controls.checked =
            config.cco != null
                ? config.cco
                : false && config.dimmers != null
                  ? config.dimmers
                  : false && config.switches != null
                    ? config.switches
                    : false;

        options.keypads.checked =
            config.remotes != null ? config.remotes : true && config.keypads != null ? config.keypads : true;

        options.fans.checked = config.fans != null ? config.fans : false;
        options.sensors.checked = config.sensors != null ? config.sensors : true;
        options.shades.checked = config.shades != null ? config.shades : false;
        options.strips.checked = config.strips != null ? config.strips : false;
        options.timeclocks.checked = config.timeclocks != null ? config.timeclocks : true;
    };

    const extractConfig = () => {
        return [
            {
                ...config,
                platform: "Lutron",
                name: form.name.value,
                cco: options.controls.checked,
                dimmers: options.controls.checked,
                fans: options.fans.checked,
                keypads: options.keypads.checked,
                sensors: options.sensors.checked,
                remotes: options.keypads.checked,
                shades: options.shades.checked,
                strips: options.strips.checked,
                switches: options.controls.checked,
                timeclocks: options.timeclocks.checked,
            },
        ];
    };

    const pairProcessor = async () => {
        pairing.pair.style.display = "none";
        pairing.unpair.style.display = "none";
        pairing.response.innerHTML = "Press the pairing button on the processor.";

        let tick = 1;

        const interval = setInterval(() => {
            pairing.response.innerHTML = `Press the pairing button on the processor${Array((tick % 3) + 2).join(".")}`;

            tick += 1;
        }, 1_000);

        const timeout = setTimeout(async () => {
            clearInterval(interval);

            pairing.response.innerHTML = "Pairing timeout, please try again.";

            setTimeout(async () => {
                await populateForm();
            }, 5_000);
        }, 30_000);

        let results = null;

        try {
            results = await homebridge.request("/pair");

            clearInterval(interval);
            clearTimeout(timeout);

            await populateForm();
        } catch (error) {
            console.error(error);
        }
    };

    const unpairProcessor = async () => {
        try {
            await homebridge.request("/unpair");
        } catch (error) {
            console.error(error);
        } finally {
            await populateForm();
        }
    };

    const updateConfig = async () => {
        try {
            await homebridge.updatePluginConfig(extractConfig());
        } catch (error) {
            console.error(error);
        }
    };

    await populateForm();

    form.base.addEventListener("change", updateConfig);
    pairing.pair.addEventListener("click", pairProcessor);
    pairing.unpair.addEventListener("click", unpairProcessor);
})();
