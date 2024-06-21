const { Client } = require('mt4-api');

// Replace with your MT4 platform URL
const MT4_URL = 'VantageInternational-Demo 2 - Vantage International Group Limited';

// Initialize the MT4 client
const client = new Client({
  url: MT4_URL,
  username: '891403696',
  password: '&wD0D0bY',
});

// Function to fetch the market prices for all symbols
async function fetchAllSymbolPrices() {
  try {
    // Fetch the list of symbols from the MT4 platform
    const symbols = await client.symbols();

    const prices = await Promise.all(symbols.map(async (symbol) => {
      const quote = await client.quote(symbol);
      return {
        symbol,
        price: quote ? quote['05. price'] : null,
      };
    }));

    return prices;
  } catch (error) {
    console.error('Error fetching all symbol prices:', error);
    return [];
  }
}

// Example usage
fetchAllSymbolPrices()
  .then((prices) => {
    console.log(prices);
  })
  .catch((error) => {
    console.error('Error:', error);
  });