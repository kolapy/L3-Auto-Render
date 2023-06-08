const { render } = require('@nexrender/core');
const fs = require('fs');

const main = async () => {
    const jobData = fs.readFileSync('/Users/grjohns/Desktop/Nextrendertest/job.json');
    const job = JSON.parse(jobData);

    const result = await render(job);
    console.log('Render completed:', result);
}

main().catch(console.error);