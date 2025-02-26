const express = require("express");
require("dotenv").config();
const { z } = require("zod");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User.js");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected To DB Successfully");
  })
  .catch((err) => {
    console.error("An error occured!:", err);
  });

app.post("/register", async (req, res) => {
  try {
    const validation = z
      .object({
        username: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
      .safeParse(req.body).success;
    if (!validation) {
      console.log("validation failed");
      res.status(422).json({
        msg: "field type incorrect",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 3);
    let registerCred = { ...req.body, password: hashedPassword };
    const user = await User.create(registerCred);
    const result = await user.save();
    console.log("User registered successfully");
    console.log(result);
    res.status(201).json({ msg: "Registeration successful" });
  } catch (err) {
    console.log("An error occured!:", err);
    res
      .status(409)
      .send(JSON.stringify({ msg: "either username or email already in use" }));
  }
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log("The server has started");
});
