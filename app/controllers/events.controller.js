const albums = require("../models/albums.model.js");
const { createAggregateQuery, filterArr } = require("../helpers/helpers");
var express = require("express");
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');



var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();
var output = "";
var results = [];
var x = 0;
var arr = [];


// Create and Save a new albums
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "albums content can not be empty"
    });
  }

  // Create a albums
  const albums = new albums({
    title: req.body.title || "Untitled albums",
    content: req.body.content,
    ArtistId: req.body.ArtistId,
    Hotness: req.body.Hotness,
    Name: req.body.Name,
    Sid: req.body.Sid,
    City: req.body.City,
    Lat: req.body.Lat,
    Lng: req.body.Lng,
    spotify: req.body.spotify | {}
  });
}

// Retrieve and return all albums from the database.
exports.findAll = async (req, res) => {
  puppeteer.use(StealthPlugin())
    const city = req.params.city;
    const numOfEvents = req.query.num_of_events;
        const url = `http://www.google.com/search?q=concerts ${city}&ibp=htl;events&uule&hl=en#htivrt=events&fpstate=tldetail&htichips=date:month&htischips=&htidocid=L2F1dGhvcml0eS9ob3Jpem9uL2NsdXN0ZXJlZF9ldmVudC8yMDIzLTAxLTE0fDE0MzkwNTIwMDY5NjA3ODU0OTMz`
        browser = await puppeteer.launch({
          headless: false,
          args: ["--disabled-setuid-sandbox", "--no-sandbox"]//, `--proxy-server=${proxy.address}:${proxy.port}`],
        });
        console.log(browser.args)
        const [page] = await browser.pages();
        
        const selectRandom = () => {
        const userAgents =  [
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36", 
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36", 
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        ];
        var randomNumber = Math.floor(Math.random() * userAgents.length);     return userAgents[randomNumber];     
        }     
        let user_agent = selectRandom(); 
        page.setExtraHTTPHeaders({
          'user-agent': user_agent,
          'upgrade-insecure-requests': '1',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9,en;q=0.8'
      })
        await page.goto(url , {
            waitUntil: 'domcontentloaded',
        })

      await page.waitForTimeout(500)  
      let data =  await scrollPage(page,".UbEfxe",numOfEvents || 20)
      res.send(JSON.stringify(data));
      await browser.close();
    // });
}

const scrollPage = async (page, scrollContainer, itemTargetCount) => {
  let items = [];
  let previousHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);
  let tracker = 0
  while (itemTargetCount > items.length && tracker <= items.length) {
    items = await extractItems(page);
    if(items[0] && items[0] === 'undefined') {
      break;
    }
    await page.evaluate(`document.querySelector("${scrollContainer}").scrollTo(0, document.querySelector("${scrollContainer}").scrollHeight)`);
    await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight > ${previousHeight}`);
    tracker++
  }
  return items;
}


const extractItems = async (page) => {
  await page.waitForTimeout(500);
  
  let events_results = await page.evaluate(() => {
  
  if(!document.querySelector("li.PaEvOc")){
   return ['undefined'];
  } 
    return Array.from(document.querySelectorAll("li.PaEvOc")).map((el) => {
      return {
        title: el.querySelector(".YOGjf") && el.querySelector(".YOGjf").textContent ? el.querySelector(".YOGjf").textContent : undefined,
        time: el.querySelector(".cEZxRc") && el.querySelector(".cEZxRc").textContent ? el.querySelector(".cEZxRc").textContent.split(', ')[1] : undefined,
        date: el.querySelector(".wsnHcb") &&  el.querySelector(".wsnHcb").textContent && el.querySelector(".UIaQzd") && el.querySelector(".UIaQzd").textContent ? `${el.querySelector(".wsnHcb").textContent} ${el.querySelector(".UIaQzd").textContent}`  : undefined,
        address: Array.from(el.querySelectorAll(".zvDXNd")).map((el) => {
          return el.textContent ? el.textContent : undefined;
        }),
        // // link: el.querySelector(".zTH3xc") ? el.querySelector(".zTH3xc").getAttribute("href") : undefined,
        // // // thumbnail: el.querySelector('.wA1Bge').getAttribute("src"),
        // // location_link: el.querySelector(".ozQmAd") ? "https://www.google.com" + el.querySelector(".ozQmAd").getAttribute("data-url") : "",
        // // tickets: JSON.stringify(Array.from(el.querySelectorAll('.mi3HuEAU05x__visible-container div')).map((el) => {
        // //   return {
        // //     source: el.getAttribute("data-domain") ? el.getAttribute("data-domain") : undefined,
        // //     link: el.querySelector(".SKIyM") && el.querySelector(".SKIyM").getAttribute("href") ? el.querySelector(".SKIyM").getAttribute("href") : undefined,
        // //   }
        // // })),
        //venue_name: el.querySelector(".RVclrc") && el.querySelector(".RVclrc").textContent ? el.querySelector(".RVclrc").textContent : undefined,
        // venue_link: el.querySelector(".pzNwRe a") ? "" + el.querySelector(".pzNwRe a").getAttribute("href") : ""
      }
    })
  })
  for (let i = 0; i < events_results.length; i++) {
    Object.keys(events_results[i]).forEach(key => events_results[i][key] === undefined || events_results[i][key] === "" || events_results[i][key].length === 0 ? delete events_results[i][key] : {})
  }

  return events_results;
}
