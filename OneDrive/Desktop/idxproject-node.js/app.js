import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import stockRoutes from "./routes/stockRoutes.js";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("Server running on port", process.env.PORT || 3001);
    });
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "keysecret", // move to .env later
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  })
);
app.use(authRoutes);

app.use("/", stockRoutes);
