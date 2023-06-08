const { render } = require('@nexrender/core');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const main = async () => {
  const jobData = fs.readFileSync('/Users/grjohns/Desktop/Nextrendertest/job.json');
  const jobTemplate = JSON.parse(jobData);

  const csvFilePath = '/Users/grjohns/Desktop/Nextrendertest/names.csv';
  const outputBaseDir = '/Users/grjohns/Desktop/Nextrendertest/';

  const people = [];

  // Read the CSV file and parse its contents
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', data => {
      people.push({
        name: data.NAME,
        title: data.TITLE
      });
    })
    .on('end', async () => {
      const jobs = people.map(person => {
        const outputDir = path.join(outputBaseDir, person.name);
        const outputPath = path.join(outputDir, 'output.mp4');
        return {
          ...jobTemplate,
          assets: [
            { ...jobTemplate.assets[0], expression: `'${person.name}'` },
            { ...jobTemplate.assets[1], expression: `'${person.title}'` }
          ],
          output: {
            module: 'file',
            settings: {
              path: outputPath
            }
          }
        };
      });

      for (const job of jobs) {
        try {
          const result = await render(job);
          console.log('Render completed:', result);
        } catch (error) {
          console.error('Render failed:', error);
        }
      }
    });
}

main().catch(console.error);
