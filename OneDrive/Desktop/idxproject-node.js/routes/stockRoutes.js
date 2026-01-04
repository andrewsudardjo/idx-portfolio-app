const express = require("express");
const router = express.Router();
const stockController = require("../controller/stockController");

/* ========= WATCHLIST ========= */
router.get("/", stockController.stock_index); // Homepage (watchlist)
router.post("/watchlist", stockController.stock_add_post);
router.delete("/watchlist/:id", stockController.stock_delete);
router.get("/watchlist/:id", stockController.stock_details);

/* ========= PORTFOLIO ========= */
router.get("/portfolio", stockController.stock_portfolio);
router.get("/portfolio/History", stockController.portfolio_history);
router.post("/portfolio", stockController.portfolio_add_post);
router.delete("/portfolio/:id", stockController.portfolio_stock_delete);

router.get("/api/watchlist", stockController.api_watchlist_prices);

module.exports = router;
