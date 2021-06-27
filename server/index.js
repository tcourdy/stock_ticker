const express = require('express')
const axios = require('axios')
const fs = require('fs')

const app = express()
const port = 6969

const ALPHA_API_KEY = "alphaApiKey"
const SYMBOLS_KEY = "symbols"

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))

if(config[ALPHA_API_KEY] === undefined || config[SYMBOLS_KEY] === undefined) {
  console.err("You must provide an alphaApiKey property with a string value and a symbols property with a value of an array of strings")
  process.exit(1)
}

app.get('/getPrice/:symbol', async (req, res) => {
  let resp = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.params.symbol}&interval=1min&apikey=${config[ALPHA_API_KEY]}`);

  let mostRecentKey = resp.data["Meta Data"]["3. Last Refreshed"]
  let currentPrice = resp.data["Time Series (1min)"][mostRecentKey]["4. close"]

  res.status(200).json({"currentPrice": parseFloat(currentPrice)})
})

app.get('/getSymbols', (req, res) => {
  console.log(`getSymbols was called: ${Date.now()}`)
  res.status(200).json({"symbols": config[SYMBOLS_KEY]})
})

app.listen(port, () => {
  console.log(`stock ticker server listening at http://localhost:${port}`)
})
