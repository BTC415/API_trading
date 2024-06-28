const mql = require('mql-api');

// Set up the connection to MT4
const connection = mql.createConnection({
  server: 'VantageInternational-Demo 2 - Vantage International Group Limited',
  login: '891403696',
  password: '&wD0D0bY'
});
// Place a buy order
connection.placeOrder({
  symbol: 'EURUSD',
  type: mql.OrderType.BUY,
  lots: 0.1,
  slippage: 10,
  comment: 'My buy order'
})
.then(order => {
  console.log('Order placed:', order);
})
.catch(error => {
  console.error('Error placing order:', error);
});

// Retrieve account information
connection.getAccountInfo()
.then(accountInfo => {
  console.log('Account info:', accountInfo);
})
.catch(error => {
  console.error('Error getting account info:', error);
});
