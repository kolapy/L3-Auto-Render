const { render } = require('@nexrender/core');

const main = async () => {
  const job = {
    template: {
      src: 'file:///Users/grjohns/Desktop/Nextrendertest/l3.aep',
      composition: 'Main',
      outputModule: 'Lossless',
      outputExt: 'mov',
    },
    assets: [
      {
        type: 'data',
        layerName: 'Name',
        property: 'Source Text',
        expression: 'time',
      },
    ],
    output: {
      module: 'file',
      settings: {
        path: '/Users/grjohns/Desktop/Nextrendertest/',
      },
    },
  };


  try {
    const result = await render(job);
    console.log('Render completed:', result);
  } catch (error) {
    console.error('Render failed:', error);
  }
};

main();