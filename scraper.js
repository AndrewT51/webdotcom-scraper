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

  // Use these constant colors for error or success logging
  static get colors () {

    return {
      SUCCESS: 'green',
      FAIL: 'red'
    };

  }

  // Create the full path to the structure file and append .yml if
  // no .yml or .yaml extension already given
  static createFullPathToStructureFile (structureFile = '') {

    const re = new RegExp(/^ya?ml$/, 'i');

    const extension = structureFile.split('.').slice(-1);
  
    let fullPath = path.join(__dirname, `./structure-files/${structureFile}`);

    return re.test(extension) ? fullPath : `${fullPath}.yml`;

  }

  // Check that the path to the file and the file itself exist
  static pathIsValid (filePath) {

    return fs.existsSync(filePath);
    
  }
  
  // Format the text to the console nicely as a string with spacing and colour
  static formatOutput (status, obj) {

    return chalk[this.colors[status]](JSON.stringify(obj, null, '\t'));

  }

  // Create a JSON representation of the information required from the 
  // webpage, according to the structure file given
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