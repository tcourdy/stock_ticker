const express = require('express')
const axios = require('axios')
const fs = require('fs')

const app = express()
const port = 6969

const ALPACA_API_KEY = "alpacaApiKey"
const ALPACA_SECRET_KEY = "alpacaSecretKey"
const SYMBOLS_KEY = "symbols"

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))

if(config[ALPACA_API_KEY] === undefined || config[SYMBOLS_KEY] === undefined || config[ALPACA_SECRET_KEY] === undefined) {
  console.err("You must provide an alpacaApiKey property with a string value, an alpacaSecretKey property with a string value, and a symbols property with a value of an array of strings")
  process.exit(1)
}

//alpaca
app.get('/getWatchList', async (req, res) => {
  let httpConfig = {
    "headers": {
      'APCA-API-KEY-ID': config[ALPACA_API_KEY],
      'APCA-API-SECRET-KEY':config[ALPACA_SECRET_KEY]
    }
  }
  let resp = await axios.get(`https://data.alpaca.markets/v2/stocks/snapshots?symbols=${config[SYMBOLS_KEY].join()}`, httpConfig);

  var watchList = {}
  Object.keys(resp.data).forEach(ticker => {
    var currentPrice = resp.data[ticker]["minuteBar"]["c"]
    var daysOpenPrice = resp.data[ticker]["prevDailyBar"]["c"]
    watchList[ticker] = {
      "currentPrice": currentPrice,
      "dollarChange": (currentPrice - daysOpenPrice).toFixed(2),
      "percentChange": (((currentPrice - daysOpenPrice) / daysOpenPrice) * 100).toFixed(2)
    }
  })

  res.status(200).json(watchList)
})

app.get('/getSymbols', (req, res) => {
  res.status(200).json({"symbols": config[SYMBOLS_KEY]})
})

app.listen(port, () => {
  console.log(`stock ticker server listening at http://localhost:${port}`)
})
