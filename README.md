## NOTE:  USE THIS AT YOUR OWN RISK.  I am not a financial advisor, and any output of this app should not be construed as financial advice.  Do not make financial decisions based on the output of this app. Please do your own research.

React client and node server which uses the alpaca api to create a stock ticker table that updates in real time.

### Requirements
- npm
- node
- alpaca api keys

### How to run

- To run the server you will first need to setup a config.json file inside the server directory formatted like this:
```
{
  "alpacaApiKey": "<your_api_key_here>",
  "alpacaSecretKey": "<your_secret_key_here>",
  "symbols": [
      "AAPL",
      "MSFT"
  ]
}
```

Then from the server directory you can run:
```
npm install
node index.js
```
This will start a node server that is listening on localhost:6969

- To run the client go into the client directory and run:
```
npm install
npm start
```
You can then go to localhost:3000 from your browser

## You should note that if you use alpaca paper api keys that the ticker data will come from IEX and from what I've seen this data does not match up with NYSE ticker data and therefore you will most likely see discrepancies between what your broker website shows and what this app shows.  I assume its discrepeancies between IEX and NYSE.  Either that or alpca data is just plain wrong
