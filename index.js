const [ structureFile, uri ] = process.argv.slice(2);
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

try {
  const structureFileLocation = path.join(__dirname, `./structure-files/${structureFile}.yml`);
  const fileContent = fs.readFileSync(structureFileLocation)
  const doc = yaml.safeLoad(fileContent)
  console.log(doc);
} catch (e) {
  console.log(e);
}

const scraper = async() => {
  const response = await axios.get(`http://${uri}`)
  const $ = cheerio.load(response.data)
  console.log($('title').text())
}

scraper()
