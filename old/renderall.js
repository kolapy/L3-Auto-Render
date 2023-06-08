const { render } = require('@nexrender/core');
const fs = require('fs');

// Function to render a job with modified "Name" and "Title" values
async function renderJob(name, title) {
  try {
    const job = JSON.parse(fs.readFileSync('./job.json', 'utf8'));

    // Modify "Name" and "Title" values
    job.assets.forEach(asset => {
      if (asset.layerName === 'Name') {
        asset.expression = JSON.stringify(name);
      } else if (asset.layerName === 'Title') {
        asset.expression = JSON.stringify(title);
      }
    });

    const result = await render(job);
    console.log(result);

    // Save the rendered video file
    const outputFilePath = `./output/${name}-${title}.mp4`;
    fs.writeFileSync(outputFilePath, result.data);

    console.log(`Job completed successfully for ${name}: ${title}`);
    console.log(`Output video saved to: ${outputFilePath}`);
  } catch (error) {
    console.error(`Error rendering job for ${name}: ${title}`);
    console.error(error);
  }
}

// Array of name and title combinations
const nameTitlePairs = [
  { name: 'John Doe', title: 'Software Engineer' },
  { name: 'Jane Smith', title: 'Graphic Designer' },
  // Add more name and title combinations as needed
];

// Render each job in the nameTitlePairs array
async function renderAllJobs() {
  for (const pair of nameTitlePairs) {
    await renderJob(pair.name, pair.title);
  }
}


// Create the output directory if it doesn't exist
const outputDirectory = './output';
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Call the renderAllJobs function to start rendering
renderAllJobs();