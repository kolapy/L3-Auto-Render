const { render } = require('@nexrender/core');
const fs = require('fs');
const path = require('path');
const { parse } = require("csv-parse");
const csv = require('csv-parser');
const { promisify } = require('util');

// Create the output directory if it doesn't exist
const outputDirectory = './output';
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

//CSV parsing and checking function.
/*const nameParse = () => {
  return new Promise((resolve, reject) => {
    const csvFilePath = path.join(__dirname,'names.csv');
    const peopleArray = [];
    const errThresh = 10; // Defining the maximum character length per word

    const readStream = fs.createReadStream(csvFilePath);
    const parser = parse({ delimiter: ",", from_line: 2 });

    readStream
      .pipe(parser)
      .on("data", function (row) {
        peopleArray.push(row);
      })
      .on("end", function () {
        console.log("Names and titles:", peopleArray);
        console.log("finished");

        const peopleObject = {};

        // Convert peopleArray to object format
        for (let i = 0; i < peopleArray.length; i++) {
          const person = peopleArray[i];
          const personName = person[0];
          const personTitle = person[1];

          peopleObject[`Person ${i + 1}`] = {
            name: personName,
            title: personTitle,
          };
        }

        console.log("People object:", peopleObject);
        resolve(peopleObject);

        // Character count check
        for (const element of peopleArray) {
          for (const word of element) {
            const characterCount = word.length;
            console.log(`Word: ${word}, Character Count: ${characterCount}`);

            if (characterCount > errThresh) {
              console.log(`${word} is too long`);
            }
          }
        }
      })
      .on("error", function (error) {
        console.log(error.message);
        reject(error);
      });
  });
};*/

//Main Templating fucntion
const main = async () => {
  const jsonPath = path.join(__dirname,'job.json');
  const jobData = fs.readFileSync(jsonPath);
  const jobTemplate = JSON.parse(jobData);
  const outputDir = path.join(__dirname,'/output');

  /*const people = [
    { name: 'John Smith', title: 'Engineer' },
    { name: 'Jane Doe', title: 'Designer' },
    // Add more people with different names and titles
  ];*/
  const csvFilePath = path.join(__dirname,'names.csv');
  const people = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv({headers: true}))
    .on('data', (row) => {
      const name = row.name;
      const title = row.title;
      people.push({ name, title });
    })
    .on('end', async () => {
      console.log('CSV file has been processed.');
      console.log('People:', people);
      console.log(people);

      const jobs = people.map(person => {
        const personOutputDir = path.join(outputDir, person.name+'.mp4');
        console.log(personOutputDir);
        return {
          ...jobTemplate,
          assets: [
            { ...jobTemplate.assets[0], expression: `'${person.name}'` },
            { ...jobTemplate.assets[1], expression: `'${person.title}'` }
          ],
          actions:{
            postrender: [
                {
                    module: '@nexrender/action-encode',
                    preset: 'mp4',
                    output: 'encoded.mp4'
                },
                {
                    module: '@nexrender/action-copy',
                    input: 'encoded.mp4',
                    output: personOutputDir
                }
            ]
        }
        };
      });
      //Call to Nexrender
      for (const job of jobs) {
        try {
          const result = await render(job);
          console.log('Render completed:', result);
        } catch (error) {
          console.error('Render failed:', error);
        }
      }
    }
    )
    .on('error', (error) => {
      console.error('Error while processing CSV file:', error);
    });
}


//nameParse();
main();



