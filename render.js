/* TODO
1. Package this up and distribute on GIThub --DONE
2. MAke s hell script for install --DONE
3. Make a shell script for running it.
4. Set it up so that the script renders mp4 previews as well as proper alpha files
-Puts the previews in a seperate previews folder


*/



const { render } = require('@nexrender/core');
const fs = require('fs');
const path = require('path');
const { parse } = require("csv-parse");

let charLimit = 10; //Define the max character limit for the template.

// Create the output directory if it doesn't exist
const outputDirectory = './output';
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}
const previewDirectory = './output/preview';
if (!fs.existsSync(previewDirectory)) {
  fs.mkdirSync(previewDirectory);
}

//CSV parsing and checking function.  UNUSED
const nameParse = () => {
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
};

//Main Templating fucntion
const main = async () => {
  const jsonPath = path.join(__dirname,'job.json');
  const jobData = fs.readFileSync(jsonPath);
  const jobTemplate = JSON.parse(jobData);
  const outputDir = path.join(__dirname,'/output');
  const previewDir = path.join(__dirname,'/output/preview');

  /*const people = [
    { name: 'John Smith', title: 'Engineer' },
    { name: 'Jane Doe', title: 'Designer' },
    // Add more people with different names and titles
  ];*/
  const csvFilePath = path.join(__dirname,'names.csv');
  const people = [];

  fs.createReadStream(csvFilePath)
  .pipe(parse({ delimiter: ";", from_line: 2 }))
  .on("data", function (row) {
    console.log(row);
    const name = row[0];
    const title = row[1];
    console.log('Name:', name); // Log the extracted name
    console.log('Title:', title); // Log the extracted title
    people.push({name, title});

    //Check to ensure the legth is not too long.
    for (const person of people) {
      // Check the length of the name
      const nameLength = person.name.trim().length;
      console.log(`Name: ${person.name}, Length: ${nameLength}`);
    
      // Check the length of the title
      const titleLength = person.title.trim().length;
      console.log(`Title: ${person.title}, Length: ${titleLength}`);

      //Check if the lengh is logner than our defined max lengh
      if(nameLength>charLimit || titleLength>charLimit) {
        console.log('This string is out of range | Needs to be less than '+ charLimit)
      }
    }
  })
    .on('end', async () => {
      console.log('CSV file has been processed.');
      console.log('People:', people);

      const jobs = people.map(person => {
        const personOutputDir = path.join(previewDir, person.name+'.mp4');
        const personOutputDirMOV = path.join(outputDir, person.name+'.mov')
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
                    module:"@nexrender/action-copy",
                    output: personOutputDirMOV
                },
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

main();



