import React, { useState, useEffect } from "react";

const RecipeCard = ({ recipe, onDelete, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false); // Force re-render

  // Initialize user state from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, [forceUpdate]); // Re-run effect when forceUpdate changes

  const handleDelete = async (recipeId) => {
    try {
      const response = await fetch("http://localhost:8080/delete-recipe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization"),
          "Access-Control-Allow-Origin": "no-cors",
        },
        body: JSON.stringify({ recipeId }), // Send the recipe ID
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.msg); // Show success message
        onDelete(recipeId);

        // Update the local user state
        const updatedUser = { ...user };
        if (updatedUser.savedRecipes.includes(recipeId)) {
          // If the recipe is already saved, remove it
          updatedUser.savedRecipes = updatedUser.savedRecipes.filter(
            (id) => id !== recipeId
          );
        }

        // Update the user state and localStorage
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setForceUpdate((prev) => !prev); // Force re-render
      } else {
        alert("Failed to delete recipe.");
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
      alert("An error occurred while deleting the recipe.");
    }
  };

  const handleSave = async (recipeId) => {
    try {
      const response = await fetch("http://localhost:8080/save-unsave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization"),
          "Access-Control-Allow-Origin": "no-cors",
        },
        body: JSON.stringify({ recipeId }), // Send the recipe ID
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.msg); // Show success message

        // Update the local user state
        const updatedUser = { ...user };
        if (updatedUser.savedRecipes.includes(recipeId)) {
          // If the recipe is already saved, remove it
          updatedUser.savedRecipes = updatedUser.savedRecipes.filter(
            (id) => id !== recipeId
          );
        } else {
          // If the recipe is not saved, add it
          updatedUser.savedRecipes.push(recipeId);
        }

        // Update the user state and localStorage
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setForceUpdate((prev) => !prev); // Force re-render
        if (onSave) onSave(recipeId);
        window.location.reload();
      } else {
        alert("Failed to save/unsave recipe.");
      }
    } catch (error) {
      console.error("Error saving/unsaving recipe:", error);
      alert("An error occurred while saving/unsaving the recipe.");
    }
  };

  return (
    <div className="card shadow-sm p-3 mb-3">
      {/* Recipe Image */}
      {recipe.image ? (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; // Fallback image
          }}
        />
      ) : (
        <div
          className="card-img-top d-flex align-items-center justify-content-center"
          style={{ height: "200px", backgroundColor: "#f8f9fa" }}
        >
          <span className="text-muted">No Image Available</span>
        </div>
      )}

      <div className="card-body">
        {/* Title */}
        <h5 className="card-title">{recipe.title}</h5>

        {/* Toggle Button */}
        <button
          className="btn btn-primary mb-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-3">
            {/* Description */}
            {recipe.description && (
              <p>
                <strong>Description:</strong> {recipe.description}
              </p>
            )}

            {/* Category */}
            {recipe.category && (
              <p>
                <strong>Category:</strong> {recipe.category}
              </p>
            )}

            {/* Cooking Time */}
            {recipe.cookingTime && (
              <p>
                <strong>Cooking Time:</strong> {recipe.cookingTime} mins
              </p>
            )}

            {/* Servings */}
            {recipe.servings && (
              <p>
                <strong>Servings:</strong> {recipe.servings}
              </p>
            )}

            {/* Difficulty */}
            {recipe.difficulty && (
              <p>
                <strong>Difficulty:</strong> {recipe.difficulty}
              </p>
            )}

            {/* Ingredients List */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <>
                <h6>Ingredients:</h6>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.name} - {ingredient.quantity}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <>
                <h6>Instructions:</h6>
                <ol>
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <>
                <h6>Tags:</h6>
                <div>
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary me-1 mb-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Like, Save, Share, and Print Buttons */}
            <div className="mt-4 d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => handleSave(recipe._id)}
              >
                <i className="bi bi-bookmark"></i>{" "}
                {user &&
                user.savedRecipes &&
                user.savedRecipes.includes(recipe._id)
                  ? "Unsave"
                  : "Save"}
              </button>

              {user && user._id === recipe.author && (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(recipe._id)}
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
