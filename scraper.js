const chalk = require('chalk');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const validateYAML = require('yaml-lint');
const urlExists = require('url-exists');

class Scraper {
  
  constructor(structureBlueprint, uri) {

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

  static createFullUrl (uri) {

    const re = new RegExp(/^https?/, 'i');
    const addDotCom = uri.split('.').length <= 2;

    if (addDotCom) {

      uri = `${uri}.com`;

    }

    if (!re.test(uri)) {

      uri = `http://${uri}`;

    }

    return uri;

  }

  // Check that the path to the file and the file itself exist
  static pathIsValid (filePath) {

    return fs.existsSync(filePath);
    
  }

  // Check that the YAML file is valid
  static yamlIsValid (fileContent) {

    return validateYAML.lint(fileContent)
    .then(() => true )
    .catch( () => false );

  }

  static urlExists (url) {
    console.log(url);
    

    return new Promise((resolve, reject) => {
      
      urlExists(url, (err, exists) => {
        
        if (err) reject('Error');
        resolve(exists);
    
      });

    });


  }

  // Convert node's fs.readfile so that it returns a promise
  static readFile (fullpath) {

    return new Promise((resolve, reject) => {

      fs.readFile(fullpath, (err, data) => {

        if (err) reject('Error');
        resolve(data.toString('utf8'));

      });

    });

  }
  
  // Format the text to the console nicely as a string with spacing and colour
  static formatOutput (status, obj) {

    if (typeof obj !== 'string') {

      obj = JSON.stringify(obj, null, '\t');

    }

    return chalk[this.colors[status]](obj);

  }

  // Create a JSON representation of the information required from the 
  // webpage, according to the structure file given
  createJSONResponse (acc, [key, value]) {
    
    const $ = this.$;
    const elements = this.$(value);

    elements.each(function() {

      acc[key] = `${acc[key] || ''}${$(this).text()} `;

    });

    return acc;

  }

  async scrape () {

    let page;
    try {
            
      page = await axios.get(this.uri);
      
    } catch (e) {
      
      throw new Error('Failed to get page')

    }

    this.$ = cheerio.load(page.data);

    const keyValuePairs = Object.entries(this.scrapeBlueprint);

    return keyValuePairs.reduce(this.createJSONResponse, {});
    
  }

}

module.exports = Scraper;