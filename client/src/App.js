import React from 'react';
import './App.css';

var host = "http://localhost:6969"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {"symbols":[]}
  }

  // alphavantage's free api only allows 5 calls per minute so group symbols into groups of 5
  createTickers(symbols) {
    if(symbols) {
      var numGroups = Math.ceil(symbols.length / 5)
      return symbols.map((ticker, index) => {
        return(
          <Ticker symbol={ticker} groupId={index % numGroups} numGroups={numGroups} />
        )
      })
    } else {
      return []
    }

  }

  async componentDidMount() {
    var resp = await fetch(`${host}/getSymbols`)
    var data = await resp.json()
    this.setState({
      "symbols": data.symbols
    })
  }

  render() {
    return (
      <div className="App">
        {this.createTickers(this.state.symbols)}
      </div>
    );
  }
}

class Ticker extends React.Component{
  constructor(props) {
    super(props);
    this.state = {"price": 0.0, "dollarChange": 0.0, "percentChange": 0.0, "numApiAttempts": 0}
  }

  componentDidMount() {
    this.timerInterval = setInterval(this.fetchCurrentPrice, 60000)
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval)
  }

  async fetchCurrentPrice() {
    if(this.state.numApiAttempts % this.props.numGroups == this.props.groupId) {
      var resp = await fetch(`${host}/getPrice/${this.props.symbol}`)
      var data = await resp.json()
      var currentPrice = data.currentPrice
      var dollarChange = currentPrice - this.state.price
      var percentChange = this.state.price != 0 ? (dollarChange/this.state.price) * 100 : 0
      this.setState({
        "price": currentPrice,
        "dollarChange": dollarChange,
        "percentChange": percentChange
      })
    }

    this.setState({
      "numApiAttempts": this.state.numApiAttempts + 1
    })
  }

  render() {
    return (
      <h4>{this.props.symbol}: {this.state.price}, {this.state.dollarChange}, {this.state.percentChange}</h4>
    )
  }
}

export default App;
