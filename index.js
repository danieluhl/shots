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

const concurrentPageCount = 5;
const pagesIndex = -1;
const getNextPage = pages => pages[(pagesIndex + 1) % concurrentPageCount];


(async () => {
  try {
    const browser = await puppeteer.launch();
    const pages = [];

    // use a few concurrent pages to speed things up
    const page = await browser.newPage();
    const urls = baseUrls.flatMap(base => paths.map(path => `${base}${path}`));

    const promises = urls.reduce((promises, url) =>
      promises.then(() => execute(url, page)),
      Promise.resolve()
    );
    await promises;
    await browser.close();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  async function execute(url, page) {
    const timestamp = new Date().getTime();
    await page.goto(url);
    await page.waitFor(WAIT_TIME);
    await page.screenshot({path: `screenshots/${cleanURL(url)}-${timestamp}.png`, fullPage: true});
  }
})();
