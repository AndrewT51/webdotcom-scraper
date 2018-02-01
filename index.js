const [ structureFile, uri ] = process.argv.slice(2);
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path')

try {
  const structureFileLocation = path.join(__dirname, `./structure-files/${structureFile}.yml`);
  const fileContent = fs.readFileSync(structureFileLocation)
  const doc = yaml.safeLoad(fileContent)
  console.log(doc);
} catch (e) {
  console.log(e);
}