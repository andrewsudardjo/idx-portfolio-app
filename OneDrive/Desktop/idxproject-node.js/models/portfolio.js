// models/Portfolio.js
import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
    },
    buyPrice: {
      type: Number,
      required: true,
    },
    avgPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    targetPrice: {
      type: Number,
      required: false,
    },
    buyDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
