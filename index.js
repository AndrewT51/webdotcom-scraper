const [ structureFile, uri ] = process.argv.slice(2);
const chalk = require('chalk');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const colors = {
  SUCCESS: 'green',
  ERROR: 'red'
};

let docElements;

// Format the text to the console nicely as a string with spacing and colour
const formatOutput = (color, obj) => chalk[color](JSON.stringify(obj, null, '\t'));
  
// Create JSON response
const creatJSONResponse = ($, acc, [key, value]) => {

  acc[key] = $(value).text().replace(/\n+| +/g, ' ');
  return acc;

};

try {

  const structureFileLocation = path.join(__dirname, `./structure-files/${structureFile}.yml`);
  const fileContent = fs.readFileSync(structureFileLocation);
  docElements = yaml.safeLoad(fileContent);
  
} catch (e) {

  console.log(e);

}

const scraper = async() => {

  try {
    
    const page = await axios.get(`http://${ur}`);
    const $ = cheerio.load(page.data);
    const keyValuePairs = Object.entries(docElements);
    return keyValuePairs.reduce(creatJSONResponse.bind(null, $), {});

  } catch (e) {

    throw e;

  }

};

scraper()
.then( result => {
  
  process.stdout.write(formatOutput(colors.SUCCESS, result));

})
.catch( err => {
  
  console.log('----------------', err);
  process.stderr.write(formatOutput(colors.ERROR, err));

})
.then( () => {

  process.stdout.clearLine();
  console.log('Exiting process!');
  process.exit();
  
});
