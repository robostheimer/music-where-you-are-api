// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const cheerio = require("cheerio");


var usStates = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arkansas": "AR",
  "American Samoa": "AS",
  "Arizona": "AZ",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "District Of Columbia": "DC",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Guam": "GU",
  "Hawaii": "HI",
  "Iowa": "IA",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Massachusetts": "MA",
  "Maryland": "MD",
  "Maine": "ME",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Missouri": "MO",
  "Mississippi": "MS",
  "Montana": "MT",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Nebraska": "NE",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "Nevada": "NV",
  "New York": "NY",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Puerto Rico": "PR",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Virginia": "VA",
  "Virgin Islands": "VI",
  "Vermont": "VT",
  "Washington": "WA",
  "Wisconsin": "WI",
  "West Virginia": "WV",
  "Wyoming": "WY",
  "Bremuda": "BM"
};

exports.findAll = async (req, res) => {
  puppeteer.use(StealthPlugin())
  const city = req.params.city.includes('US') ? convertStateName(req.params.city) : req.params.city;
  console.log(city, req.params.city.includes('US'))
  const numOfEvents = req.query.num_of_events;
  const pagination = req.query.page || 1;
  const url = `https://www.songkick.com/en/search?query=${city}&type=events&type=cities`
    browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox","--disabled-setuid-sandbox"]//, `--proxy-server=${proxy.address}:${proxy.port}`],
  });

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

  try {
    await page.goto(url, { waitUntil: 'networkidle2' })
    let data =  await extractItems(page, pagination)
    res.send(JSON.stringify(data));
  } catch {
    res.send(JSON.stringify([]))
  } finally {
    await browser.close();
  }
}

const extractItems = async (page, pagination, retries = 3) => {
  await page.waitForSelector('li.small-city');
  let href = await page.evaluate(() => {
    if(!document.querySelector("li.small-city")){
      return ['undefined'];
    } 
    return document.querySelector("li.small-city a").getAttribute('href');
  })

  const today = new Date();
  const twoWeeksFromToday = new Date();
  twoWeeksFromToday.setDate(today.getDate() + 14);
  const minDate = formatDate(today)
  const maxDate = formatDate(twoWeeksFromToday);
  const queryParams = "?utf8=%E2%9C%93&filters[minDate]=" + encodeURIComponent(minDate) + "&filters[maxDate]=" + encodeURIComponent(maxDate);
  const h = `https://www.songkick.com${href}${queryParams}`;
  
  await page.goto(`${h}&page=${pagination}#metro-area-calendar`);
  await page.waitForSelector('.microformat');
  let events = await page.evaluate(() => {
    if(!document.querySelector(".microformat")){
      return ['undefined'];
    } 
    return Array.from(document.querySelectorAll('.microformat')).map(mf => JSON.parse(mf.textContent));
  })
  return flat(events);
}

function convertStateName(inputString) { 
  var parts = inputString.split(", "); 
  var city = parts[0]; 
  var stateFullName = parts[1]
  var country = parts[2]; 
  var stateAbbreviation = usStates[stateFullName]; 
  if (stateAbbreviation) { 
    return city + ", " + stateAbbreviation + ", " + country; 
  } else {
     return inputString; 
    } 
  }

function formatDate(date) { 
  var day = ("0" + date.getDate()).slice(-2); 
  var month = ("0" + (date.getMonth() + 1)).slice(-2); 
  var year = date.getFullYear(); 
  return month + "/" + day + "/" + year;
}

function flat(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}