const [structureFile, uri] = process.argv.slice(2);
const [SUCCESS, FAIL] = ['SUCCESS', 'FAIL'];
const Scraper = require('./scraper');
const fullPath = Scraper.createFullPathToStructureFile(structureFile);
const pathExists = Scraper.pathIsValid(fullPath);


const init = async () => {

  const scraper = new Scraper(fullPath, uri);

  try {
    
    const scrapeResult = await scraper.scrape();

    process.stdout.write(Scraper.formatOutput(SUCCESS,scrapeResult));

  } catch (e) {
    
    console.error(e);
    
  }

};



if (!pathExists) {

  console.error('The structure file could not be found');

} else {

  init();

}

