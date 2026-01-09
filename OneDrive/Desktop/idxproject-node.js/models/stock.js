import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
