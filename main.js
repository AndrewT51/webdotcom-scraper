const [structureFile, uri] = process.argv.slice(2);
const [SUCCESS, FAIL] = ['SUCCESS', 'FAIL'];
const Scraper = require('./scraper');
const fullPath = Scraper.createFullPathToStructureFile(structureFile);
const pathExists = Scraper.pathIsValid(fullPath);

const init = async () => {

  // Check the path to the file is correct
  if (!pathExists) {

    throw new Error('The structure file could not be found');

  }

  // Read the yaml file asynchronously and check it is valid
  const structureBlueprint = await Scraper.readFile(fullPath);
  const yamlIsValid = await Scraper.yamlIsValid(structureBlueprint);

  if (!yamlIsValid) {

    throw new Error('YAML file is not valid');

  }

  try {

    // Scrape the data from the page according to the YAML structure-file
    const scraper = new Scraper(structureBlueprint, uri);
    const scrapeResult = await scraper.scrape();

    process.stdout.write(Scraper.formatOutput(SUCCESS, scrapeResult));

  } catch (e) {

    throw new Error(e);
    
  }

};

init().catch(e => {

  console.error(Scraper.formatOutput(FAIL, e.message));

});
