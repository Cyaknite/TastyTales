import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

import RecipeCardDashboard from "../components/RecipeCardDashboard";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]); // ✅ Initialize as an empty array

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let response = await fetch("http://localhost:8080/dashboard", {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("Authorization"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        let data = await response.json();
        setRecipes(data); // ✅ Update state
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    console.log("Updated Recipes:", recipes); // ✅ Log after state update
  }, [recipes]);

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row d-flex">
          <div className="col d-flex">
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <div key={index}>
                  <RecipeCardDashboard recipe={recipe}></RecipeCardDashboard>
                </div>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
