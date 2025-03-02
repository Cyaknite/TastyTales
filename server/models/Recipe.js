const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: String,
      quantity: String, 
    },
  ],
  instructions: {
    type: [String], 
    required: true,
  },
  category: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Drinks"],
  },
  image: {
    data: Buffer, 
    contentType: String, 
  },
  cookingTime: {
    type: Number, // Time in minutes
  },
  servings: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
  },
  tags: {
    type: [String], 
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;
