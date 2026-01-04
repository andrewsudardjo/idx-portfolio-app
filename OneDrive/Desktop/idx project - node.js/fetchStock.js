async function fetchStock(symbol) {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.JK`
    );
    const data = await res.json();

    const result = data.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;

    return {
      marketPrice: meta.regularMarketPrice || null,
      high: meta.regularMarketDayHigh || null,
      low: meta.regularMarketDayLow || null,
      volume: meta.regularMarketVolume || null,
      prevDayClose: meta.previousClose || null,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = fetchStock;
