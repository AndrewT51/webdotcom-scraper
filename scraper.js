const chalk = require('chalk');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const urlExists = require('url-exists');

class Scraper {
  
  constructor(structureFile, uri) {

    let structureBlueprint = fs.readFileSync(structureFile);
    
    this.scrapeBlueprint = yaml.safeLoad(structureBlueprint);

    this.uri = uri;

    this.createJSONResponse = this.createJSONResponse.bind(this);

  }

  static createFullPathToStructureFile (structureFile = '') {

    const re = new RegExp(/^ya?ml$/, 'i');

    const extension = structureFile.split('.').slice(-1);
  
    let fullPath = path.join(__dirname, `./structure-files/${structureFile}`);

    return re.test(extension) ? fullPath : `${fullPath}.yml`;

  }

  static pathIsValid (filePath) {

    return fs.existsSync(filePath);
    
  }

  createJSONResponse (acc, [key, value]) {

    acc[key] = this.$(value).text().replace(/\n+| +/g, ' ');

    return acc;

  }

  async scrape () {

    let page;
    try {
            
      page = await axios.get(`http://${this.uri}`);
      
    } catch (e) {
      
      throw new Error('Invalid shit')

    }

    this.$ = cheerio.load(page.data);

    const keyValuePairs = Object.entries(this.scrapeBlueprint);

    return keyValuePairs.reduce(this.createJSONResponse, {});
    
  }

}

module.exports = Scraper;