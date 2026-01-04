// models/Portfolio.js
const mongoose = require("mongoose");

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

module.exports = mongoose.model("Portfolio", portfolioSchema);
