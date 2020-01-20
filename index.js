#!/usr/bin/env node

const puppeteer = require('puppeteer');
const WAIT_TIME = 1000;

const baseUrls = [
  'https://www.wayfair.com',
  'https://www.wayfair.co.uk',
  'https://www.wayfair.de',
  'https://www.wayfair.ca',
  'https://www.allmodern.com',
  'https://www.jossandmain.com',
  'https://www.birchlane.com',
  'https://www.perigold.com'
];

const paths = [
  '/'
];

// we'll save using the url so take out any funky file/folder stuff (todo: look up official way to clean for saving regex)
const cleanURL = url => url.replace('https://www.', '').replace('.com', '').replace(/[\/\.\?=]/g, '-');

(async () => {
  try {
    const promises = baseUrls.reduce((promises, base) =>
      paths.reduce((promises, path) =>
        promises.then(() =>
          execute(`${base}${path}`)),
        promises),
      Promise.resolve());
    await promises;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  async function execute(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const timestamp = new Date().getTime();
    await page.goto(url);
    await page.waitFor(WAIT_TIME);
    await page.screenshot({path: `screenshots/${cleanURL(url)}-${timestamp}.png`, fullPage: true});
    await page.emulateMedia('screen');
    await browser.close();
  }
})();
