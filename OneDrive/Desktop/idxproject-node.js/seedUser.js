import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const MONGO_URI =
  "mongodb+srv://netninja:test123@nodejs.iqkf8al.mongodb.net/StockDB";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const hashedPassword = await bcrypt.hash("mypassword123", 10);

    await User.create({
      username: "andrew",
      password: hashedPassword,
    });

    console.log("✅ User created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
