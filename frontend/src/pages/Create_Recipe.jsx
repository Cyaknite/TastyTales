import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Create_Recipe = () => {
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState({
    title: "",
    description: "",
    ingredients: [{ name: "", quantity: "" }],
    instructions: [""],
    category: "",
    cookingTime: "",
    servings: "",
    difficulty: "",
    tags: [{ value: "" }],
  });

  const [image, setImage] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    setRecipeData({ ...recipeData, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients[index][field] = value;
    setRecipeData({ ...recipeData, ingredients: updatedIngredients });
  };

  // Add new ingredient field
  const addIngredient = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [...recipeData.ingredients, { name: "", quantity: "" }],
    });
  };

  // Remove an ingredient field
  const removeIngredient = (index) => {
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipeData({ ...recipeData, ingredients: updatedIngredients });
  };

  // Handle instructions changes
  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...recipeData.instructions];
    updatedInstructions[index] = value;
    setRecipeData({ ...recipeData, instructions: updatedInstructions });
  };

  // Add new instruction field
  const addInstruction = () => {
    setRecipeData({
      ...recipeData,
      instructions: [...recipeData.instructions, ""],
    });
  };

  // Remove an instruction field
  const removeInstruction = (index) => {
    const updatedInstructions = [...recipeData.instructions];
    updatedInstructions.splice(index, 1);
    setRecipeData({ ...recipeData, instructions: updatedInstructions });
  };

  // Handle file input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...recipeData.tags];
    updatedTags[index].value = value;
    setRecipeData({ ...recipeData, tags: updatedTags });
  };

  const addTag = () => {
    setRecipeData((prevState) => ({
      ...prevState,
      tags: [...prevState.tags, { value: "" }], // Add a new empty tag input field
    }));
  };

  const removeTag = (index) => {
    const updatedTags = [...recipeData.tags];
    updatedTags.splice(index, 1);
    setRecipeData({ ...recipeData, tags: updatedTags });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagValues = recipeData.tags.map((tag) => tag.value);
    // Create FormData object
    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("description", recipeData.description);
    formData.append("category", recipeData.category);
    formData.append("cookingTime", recipeData.cookingTime);
    formData.append("servings", recipeData.servings);
    formData.append("difficulty", recipeData.difficulty);
    formData.append("tags", JSON.stringify(tagValues));
    formData.append("ingredients", JSON.stringify(recipeData.ingredients));
    formData.append("instructions", JSON.stringify(recipeData.instructions));
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8080/Create-Recipe", {
        method: "POST",
        body: formData, // Use formData directly
        headers: {
          authorization: localStorage.getItem("Authorization"),
        },
      });

      const result = await response.json();

      if (response.status === 403) {
        alert("Login First");
        localStorage.clear();
        navigate("/Login");
        return;
      }
      if (response.status === 401) {
        alert("Token expired, try logging in again");
        localStorage.clear();
        navigate("/Login");
        return;
      }
      if (response.ok) {
        alert("Recipe added successfully!");
        setRecipeData({
          title: "",
          description: "",
          ingredients: [{ name: "", quantity: "" }],
          instructions: [""],
          category: "",
          cookingTime: "",
          servings: "",
          difficulty: "",
          tags: [{ value: "" }],
        });
        setImage(null);
        navigate("/Profile");
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
      alert("Failed to submit recipe.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center">Create a New Recipe</h2>
        <form onSubmit={handleSubmit} className="card p-4 shadow">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={recipeData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={recipeData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              name="category"
              value={recipeData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Snack">Snack</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Cooking Time (minutes)</label>
            <input
              type="number"
              className="form-control"
              name="cookingTime"
              value={recipeData.cookingTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Servings</label>
            <input
              type="number"
              className="form-control"
              name="servings"
              value={recipeData.servings}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Difficulty</label>
            <select
              className="form-control"
              name="difficulty"
              value={recipeData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Tags</label>
            {recipeData.tags.map((tag, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Add tag"
                  value={tag.value}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeTag(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={addTag}
            >
              Add Tag
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Ingredients</label>
            {recipeData.ingredients.map((ingredient, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Name"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeIngredient(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={addIngredient}
            >
              Add Ingredient
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Instructions</label>
            {recipeData.instructions.map((instruction, index) => (
              <div key={index} className="d-flex mb-2">
                <textarea
                  className="form-control me-2"
                  rows="2"
                  value={instruction}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  required
                ></textarea>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeInstruction(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={addInstruction}
            >
              Add Step
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Submit Recipe
          </button>
        </form>
      </div>
    </>
  );
};

export default Create_Recipe;
