const inquirer = require("inquirer");
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const open = require('open');
const fs = require("fs");


// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {

  if (!fs.existsSync('images')){
    fs.mkdirSync('images');
  }

  const getUrl = await inquirer.prompt({
    type: 'input',
    name: 'url',
    message: "Which url to scrape ?",
  });

  let url = getUrl.url;
  let hostname = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];

  try {
    // open the headless browser
    var browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--window-size=1920,1080',
      ],
    });

    // open a new page
    var page = await browser.newPage();

    // enter url in page
    await page.goto(url);

    await page._client.send('Emulation.clearDeviceMetricsOverride');

    // get screenshot
    await page.screenshot({
      path: `images/${hostname}.png`,
      fullPage: true,
    });

    // close browser
    await browser.close();
    console.log(success("Browser Closed"));

    // Opens the url in the default browser
    let path = process.cwd();
    await open(`file://${path}/images/${hostname}.png`);

  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();