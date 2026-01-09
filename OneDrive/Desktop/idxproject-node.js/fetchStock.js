import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export default async function fetchStock(symbol) {
  try {
    // For Indonesian stocks, append ".JK"
    const quote = await yahooFinance.quote(`${symbol}.JK`);

    return {
      marketPrice: quote.regularMarketPrice,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      prevDayClose: quote.previousClose,
    };
  } catch (err) {
    console.error(`Failed to fetch ${symbol}:`, err.message);
    return null;
  }
}
