const express = require("express");
require("dotenv").config();
const { z } = require("zod");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    if (
      z
        .object({
          username: z.string(),
          email: z.string().email(),
          password: z.string(),
        })
        .safeParse(req.body.registerCred).success
    ) {
        
    } else {
      console.log("validation failed");
      res.status(422).send({
        msg:"field type incorrect"
      })
    }
  } catch (err) {
    console.log("An error occured!:", err);
    res.status(500).send({
      msg: "An error occured",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log("The server has started");
});
