## Webscraper

This scraper will read a YAML file that has been created for a specific webpage and use the structure of the YAML file to scrape the desired information from that page. The result will be printed to the STDOUT in a JSON style format. If an error occurs, a relevant message will be printed to the STDERR.

### Packages used
###### js-yaml  
This will parse a YAML file and return a JavaScript object. 
###### yaml-lint  
This package is used to validate the YAML file.  
###### cheerio  
This is a lean implementation of core jQuery, designed for the server. It is used in this scraper to traverse the DOM of the webpage efficiently and locate or grab text, attributes, classes, etc.
###### axios  
This is a promise based HTTP client that works from the browser or the server.  
###### chalk  
This package makes is easy to add a bit of colour to the output in the console.  
###### url-exists  
This package will send a head request to the page to efficiently discover if it exists.
### To use
Once pulled from the git repository, enter the project directory and run yarn install.  
Then in the command line, type:  

`yarn start <structure-file-name> <url>`  
  
  The result should be either a stringified JSON object of the resulting data, or an error message indicating what went wrong.  
  