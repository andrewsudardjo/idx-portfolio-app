// controller/stockController.js
import Stock from "../models/stock.js";
import Portfolio from "../models/portfolio.js";
import Order from "../models/order.js";
import fetchStock from "../fetchStock.js";

export const stock_index = async (req, res) => {
  try {
    const watchlist = await Stock.find();

    const liveData = await Promise.all(
      watchlist.map((stock) => fetchStock(stock.symbol))
    );

    const watchlistWithData = watchlist.map((stock, index) => ({
      _id: stock._id,
      symbol: stock.symbol,
      price: liveData[index]?.marketPrice || 0,
      high: liveData[index]?.high || 0,
      low: liveData[index]?.low || 0,
      volume: liveData[index]?.volume || 0,
      prevDayClose: liveData[index]?.prevDayClose || 0,
      priceChange: liveData[index]
        ? ((liveData[index].marketPrice - liveData[index].prevDayClose) /
            liveData[index].prevDayClose) *
          100
        : 0,
    }));

    res.render("homepage", {
      title: "IDX Screener",
      watchlist: watchlistWithData,
    });
  } catch (err) {
    console.error(err);
    res.render("homepage", {
      title: "IDX Screener",
      watchlist: [],
    });
  }
};

// Portfolio
export const stock_portfolio = async (req, res) => {
  try {
    const stocks = await Portfolio.find();

    const liveData = await Promise.all(stocks.map((s) => fetchStock(s.symbol)));

    let totalInvested = 0;
    let totalMarketValue = 0;

    const portfolioWithData = stocks.map((stock, i) => {
      const marketPrice = liveData[i]?.marketPrice || 0;
      const invested = stock.quantity * stock.avgPrice * 100;
      const marketValue = stock.quantity * marketPrice * 100;
      const pnl = marketValue - invested;
      const pnlPercent = invested ? (pnl / invested) * 100 : 0;

      totalInvested += invested;
      totalMarketValue += marketValue;

      return {
        ...stock.toObject(),
        marketPrice,
        invested,
        marketValue,
        pnl,
        pnlPercent,
      };
    });

    const totalPnL = totalMarketValue - totalInvested;
    const totalPnLPercent = totalInvested
      ? (totalPnL / totalInvested) * 100
      : 0;

    res.render("portfolio", {
      title: "StockPro Portfolio",
      portfolioStocks: portfolioWithData,
      totalInvested,
      totalMarketValue,
      totalPnL,
      totalPnLPercent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load portfolio");
  }
};

// Order history
export const portfolio_history = async (req, res) => {
  const stocks = await Order.find().sort({ date: -1 });
  res.render("portfolioHistory", {
    title: "Order History",
    order: stocks,
  });
};

// API: watchlist prices
export const api_watchlist_prices = async (req, res) => {
  try {
    const watchlist = await Stock.find();

    const liveData = await Promise.all(
      watchlist.map((stock) => fetchStock(stock.symbol))
    );

    const result = watchlist.map((stock, index) => ({
      id: stock._id,
      symbol: stock.symbol,
      price: liveData[index]?.marketPrice || 0,
      prevDayClose: liveData[index]?.prevDayClose || 0,
      priceChange: liveData[index]
        ? ((liveData[index].marketPrice - liveData[index].prevDayClose) /
            liveData[index].prevDayClose) *
          100
        : 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prices" });
  }
};

// Add watchlist stock
export const stock_add_post = async (req, res) => {
  try {
    const symbol = req.body.symbol.toUpperCase();
    await Stock.create({ symbol });
    res.redirect("/");
  } catch (err) {
    res.status(400).send("Stock already exists");
  }
};

// Add/sell portfolio stock
export const portfolio_add_post = async (req, res) => {
  try {
    const symbol = req.body.symbol.toUpperCase();
    const lot = Number(req.body.lot);
    const price = Number(req.body.price);
    const targetPrice = Number(req.body.targetPrice);

    let stock = await Portfolio.findOne({ symbol });

    // BUY
    if (lot > 0) {
      if (!stock) {
        await Portfolio.create({
          symbol,
          quantity: lot,
          buyPrice: price,
          avgPrice: price,
          targetPrice,
          buyDate: req.body.date || new Date(),
        });
        await Order.create({ symbol, side: "BUY", price, quantity: lot });
      } else {
        const totalCost = stock.quantity * stock.avgPrice + lot * price;
        const newQty = stock.quantity + lot;
        stock.avgPrice = totalCost / newQty;
        stock.quantity = newQty;
        await Order.create({ symbol, side: "BUY", price, quantity: lot });
        await stock.save();
      }
    }

    // SELL
    if (lot < 0) {
      if (!stock) return res.status(400).send("Stock not owned");

      const sellQty = Math.abs(lot);

      if (sellQty > stock.quantity)
        return res.status(400).send("Not enough lots to sell");

      stock.quantity -= sellQty;
      await Order.create({ symbol, side: "SELL", price, quantity: lot });

      if (stock.quantity === 0) {
        await Portfolio.findByIdAndDelete(stock._id);
      } else {
        await stock.save();
      }
    }

    res.redirect("/portfolio");
  } catch (err) {
    console.error(err);
    res.status(500).send("Portfolio update failed");
  }
};

// Stock details
export const stock_details = async (req, res) => {
  try {
    const id = req.params.id;
    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).send("Stock not found");

    const liveData = await fetchStock(stock.symbol);

    const stockDetails = {
      _id: stock._id,
      symbol: stock.symbol,
      price: liveData?.marketPrice || 0,
      high: liveData?.high || 0,
      low: liveData?.low || 0,
      volume: liveData?.volume || 0,
      prevDayClose: liveData?.prevDayClose || 0,
      priceChange: liveData
        ? ((liveData.marketPrice - liveData.prevDayClose) /
            liveData.prevDayClose) *
          100
        : 0,
    };

    res.render("details", { stock: stockDetails, title: "Stock Details" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching stock details");
  }
};

// Delete
export const stock_delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Stock.findByIdAndDelete(id);
    res.json({ redirect: "/" });
  } catch (err) {
    console.error(err);
  }
};

export const portfolio_stock_delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Portfolio.findByIdAndDelete(id);
    res.json({ redirect: "/portfolio" });
  } catch (err) {
    console.error(err);
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    // Render login directly
    return res.render("login", {
      title: "Login Page",
    });
  }
  next();
};
