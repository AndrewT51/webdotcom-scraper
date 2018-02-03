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
let resultJson = {};

// Format the text to the console nicely as a string with spacing and colour
const formatOutput = (color, obj) => chalk[color](JSON.stringify(obj, null, '\t'))

try {
  const structureFileLocation = path.join(__dirname, `./structure-files/${structureFile}.yml`);
  const fileContent = fs.readFileSync(structureFileLocation);
  docElements = yaml.safeLoad(fileContent);

} catch (e) {
  console.log(e);
}

const scraper = async() => {

  const response = await axios.get(`http://${uri}`);
  const $ = cheerio.load(response.data);
  for (key in docElements){
    if (docElements.hasOwnProperty(key)){
      resultJson[key] = $(docElements[key]).text().replace(/\n+| +/g,' ');
    }
  }
  return resultJson
}

scraper()
.then( result => {
  console.log(formatOutput(colors.SUCCESS, result))
})
.catch( err => {
  console.error(formatOutput(colors.ERROR, err));
})
.then( () => {
  console.log('Exiting process!');
  process.exit()
})
