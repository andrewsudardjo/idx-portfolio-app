require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const stockRoutes = require("./routes/stockRoutes");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3001);
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", stockRoutes);
