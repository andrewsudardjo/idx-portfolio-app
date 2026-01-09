import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login handler
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.redirect("/login");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect("/login");

  req.session.userId = user._id;
  res.redirect("/portfolio");
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
