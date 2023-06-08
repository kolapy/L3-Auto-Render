const { render } = require('@nexrender/core')

const main = async () => {
    const result = await render("file:///Users/grjohns/Desktop/Nextrendertest/l3.aep", {
        workpath: '/Users/myname/.nexrender/',
        binary: '/Users/mynames/Applications/aerender',
        skipCleanup: true,
        addLicense: false,
        debug: true,
        actions: {
            "custom-action": (job, settings, {input, params}, type) => {
                // Custom action code
            }
        },
    })
}

main().catch(console.error);