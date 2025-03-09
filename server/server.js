const express = require("express");
require("dotenv").config();
const { z } = require("zod");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token_verify = require("./middlewares/token_verify.js");
const multer = require("multer");
const Recipe = require("./models/Recipe.js");

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_PASS = process.env.JWT_PASS;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected To DB Successfully");
  })
  .catch((err) => {
    console.error("An error occured!:", err);
  });

app.options("*", cors());

app.post("/Register", async (req, res) => {
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
    res.status(201).json({ msg: "Registeration successful" });
  } catch (err) {
    console.log("An error occured!:", err);
    res
      .status(409)
      .send(JSON.stringify({ msg: "either username or email already in use" }));
  }
});

app.post("/Login", async (req, res) => {
  try {
    let validation = z
      .object({
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
    const data = await User.findOne({ email: { $eq: req.body.email } });

    if (!data) {
      console.log("email not found");
      res.status(401).json({
        msg: "user not found",
      });
    }
    if (!(await bcrypt.compare(req.body.password, data.password))) {
      console.log("email or password incorrect");
      res.status(401).json({
        msg: "either email or password incorrect",
      });
    }

    let token = jwt.sign(
      { username: data.username, email: data.email, role: data.role },
      JWT_PASS,
      { expiresIn: "2d" }
    );
    res.status(200).json(token);
  } catch (err) {
    console.error("An error occured!:", err);
    res.status(500).json({
      msg: "An error occured!",
    });
  }
});

app.post("/Profile", token_verify, async (req, res) => {
  try {
    let data = await User.findOne({
      username: { $eq: req.user.username },
    }).lean();

    if (!data) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    let savedRecipes = [];
    for (i of data.savedRecipes) {
      const savedRecipe = await Recipe.findById(i);
      if (savedRecipe) {
        savedRecipes.push({
          ...savedRecipe._doc,
          image: savedRecipe.image
            ? `data:${
                savedRecipe.image.contentType
              };base64,${savedRecipe.image.data.toString("base64")}`
            : null,
        });
      }
    }
    let createdRecipes = [];
    for (i of data.createdRecipes) {
      const createdRecipe = await Recipe.findById(i);
      if (createdRecipe) {
        createdRecipes.push({
          ...createdRecipe._doc,
          image: createdRecipe.image
            ? `data:${
                createdRecipe.image.contentType
              };base64,${createdRecipe.image.data.toString("base64")}`
            : null,
        });
      }
    }

    // Convert profilePicture to base64 if it exists
    if (data.profilePicture && data.profilePicture.data) {
      data.profilePicture = `data:${
        data.profilePicture.contentType
      };base64,${data.profilePicture.data.toString("base64")}`;
    } else {
      data.profilePicture = null; // Set to null if no profile picture exists
    }

    data.password = null;
    res.status(200).json({ data, savedRecipes, createdRecipes });
  } catch (err) {
    console.error("An error occured!:", err);
    res.status(500).json({
      msg: "An error occured!",
    });
  }
});

app.delete("/delete-recipe", token_verify, async (req, res) => {
  try {
    //extracting the recipe from the body
    const recipeId = req.body.recipeId;

    //deleting the recipe from the database
    const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deleteRecipe) {
      return res.status(404).json({
        msg: "Recipe not found",
      });
    }

    await User.updateMany(
      { savedRecipes: recipeId }, // Find users who have saved this recipe
      { $pull: { savedRecipes: recipeId } } // Remove the recipe ID from their savedRecipes array
    );
    res.status(200).json({
      msg: "Recipe deleted successfully",
    });
  } catch (err) {
    console.error("An error occured!", err);
    res.status(500).json({
      msg: "Internal Server error",
    });
  }
});

app.post("/save-unsave", token_verify, async (req, res) => {
  try {
    //find user
    let userData = await User.findOne({ username: { $eq: req.user.username } });
    if (!userData) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    //check if the recipe Id is already saved
    const recipeId = req.body.recipeId;
    const isSaved = userData.savedRecipes.includes(recipeId);
    if (isSaved) {
      //if recipe is saved , then remove it

      //filtering savedRecipes so that only the remaining id is left
      userData.savedRecipes = userData.savedRecipes.filter((id) => {
        return id != recipeId;
      });

      //saving the final userData to db
      await userData.save();
      //returning response indicating the success of unsaving
      res.status(200).json({
        msg: "Successfully unsaved!",
      });
    } else {
      //if recipe is unsaved , save it

      //adding recipeId to the savedRecipe array
      userData.savedRecipes.push(recipeId);

      //saving the final userData to db
      await userData.save();

      //sending response indicating the success of saving
      res.status(200).json({
        msg: "Successfully saved!",
      });
    }
  } catch (err) {
    console.error("An error occured!", err);
    res.status(500).json({ msg: "Internal Server error" });
  }
});

app.post(
  "/Create-Recipe",
  token_verify,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        cookingTime,
        servings,
        difficulty,
        tags,
        ingredients,
        instructions,
      } = req.body;

      const user = await User.findOne({ username: { $eq: req.user.username } });
      const userId = user._id;
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const newRecipe = new Recipe({
        title,
        description,
        category,
        cookingTime,
        servings,
        difficulty,
        tags: await JSON.parse(tags),
        ingredients: await JSON.parse(ingredients),
        instructions: await JSON.parse(instructions),
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
        author: userId,
      });

      const savedRecipe = await newRecipe.save();

      user.createdRecipes.push(savedRecipe._id);
      await user.save();
      res.json({ msg: "Recipe added successfully!", recipe: savedRecipe });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

app.patch(
  "/update-profile",
  token_verify,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { password, bio } = req.body;
      let user = await User.findOne({ username: { $eq: req.user.username } });
      if (!user) {
        return res.status(404).json({
          msg: "User not found",
        });
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 3);
        user.password = hashedPassword;
      }

      if (bio) {
        user.bio = bio;
      }

      if (req.file) {
        user.profilePicture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
      await user.save();
      res.status(200).json({
        msg: "Profile updated Successfully",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({
        msg: "Server error",
      });
    }
  }
);

app.get("/dashboard", token_verify, async (req, res) => {
  try {
    let data = await Recipe.find();

    // Modify each recipe to include the Base64 image URL
    const formattedData = data.map((recipe) => {
      if (recipe.image && recipe.image.data) {
        const base64Image = recipe.image.data.toString("base64");
        const imageUrl = `data:${recipe.image.contentType};base64,${base64Image}`;
        return {
          ...recipe._doc, // Spread the rest of the recipe data
          image: imageUrl, // Replace the image object with the Base64 URL
        };
      }
      return recipe; // If no image data is present, return the recipe as-is
    });

    res.status(200).json(formattedData); // Send the formatted data
  } catch (err) {
    console.error("An error occurred!", err);
    res.status(500).json({
      msg: "Internal Server error",
    });
  }
});

app.get("/search", token_verify, async (req, res) => {
  try {
    let query = req.query.query.trim();
    let data = await Recipe.find({ title: { $eq: query } });

    const formattedData = data.map((recipe) => {
      if (recipe.image && recipe.image.data) {
        const base64Image = recipe.image.data.toString("base64");
        const imageUrl = `data:${recipe.image.contentType};base64,${base64Image}`;
        return {
          ...recipe._doc, // Spread the rest of the recipe data
          image: imageUrl, // Replace the image object with the Base64 URL
        };
      }
      return recipe; // If no image data is present, return the recipe as-is
    });
    res.status(200).json(formattedData); // Send the formatted data
  } catch (err) {
    console.error("An error occured!:", err.message);
    res.status(500).json({
      msg: "Internal Server error",
    });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({
    msg: "Resource not available",
  });
});
app.listen(PORT, () => {
  console.log("The server has started");
});
