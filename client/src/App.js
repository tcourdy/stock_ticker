import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

var host = "http://localhost:6969"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {"watchList":{}}
    this.fetchWatchList = this.fetchWatchList.bind(this)
    this.createTickerRows = this.createTickerRows.bind(this)
    this.sortedWatchListByPercent = this.sortedWatchListByPercent.bind(this)
  }

  componentDidMount() {
    this.fetchWatchList()
    this.timerInterval = setInterval(this.fetchWatchList, 60000)
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval)
  }

  async fetchWatchList() {
    var resp = await fetch(`${host}/getWatchList`)
    var watchList = await resp.json()
    console.log(watchList)
    this.setState({
      "watchList": watchList
    })
  }

  createTickerRows() {
    return this.sortedWatchListByPercent().map(ticker => {
      return (
        <TableRow key={ticker[0]}>
          <TableCell>{ticker[0]}</TableCell>
          <TableCell>{ticker[1].currentPrice}</TableCell>
          <TableCell>{ticker[1].dollarChange}</TableCell>
          <TableCell>{ticker[1].percentChange}%</TableCell>
        </TableRow>
      )
    })
  }

  sortedWatchListByPercent() {
    return Object.entries(this.state.watchList).sort((a, b) => {
      return b[1].percentChange  - a[1].percentChange
    })
  }

  render() {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Dollar Change</TableCell>
              <TableCell>Percent Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.createTickerRows()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default App;
