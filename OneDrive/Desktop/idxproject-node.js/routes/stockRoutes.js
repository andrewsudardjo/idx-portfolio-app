import express from "express";
import {
  stock_index,
  stock_portfolio,
  portfolio_add_post,
  stock_add_post,
  stock_details,
  stock_delete,
  portfolio_stock_delete,
  portfolio_history,
  api_watchlist_prices,
  requireAuth,
} from "../controller/stockController.js";

const router = express.Router();

/* ========= WATCHLIST ========= */
router.get("/", stock_index); // Homepage (watchlist)
router.post("/watchlist", stock_add_post);
router.delete("/watchlist/:id", stock_delete);
router.get("/watchlist/:id", stock_details);

/* ========= PORTFOLIO ========= */
router.get("/portfolio", requireAuth, stock_portfolio);
router.get("/portfolio/History", requireAuth, portfolio_history);
router.post("/portfolio", portfolio_add_post);
router.delete("/portfolio/:id", portfolio_stock_delete);

router.get("/api/watchlist", api_watchlist_prices);

export default router;
