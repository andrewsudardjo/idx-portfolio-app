const express = require("express");
const app = express();
const mongoose = require("mongoose");
const stockRoutes = require("./routes/stockRoutes");

const dbURI =
  "mongodb+srv://netninja:test123@nodejs.iqkf8al.mongodb.net/StockDB";
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", stockRoutes);
