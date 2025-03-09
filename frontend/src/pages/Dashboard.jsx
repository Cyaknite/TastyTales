import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

import RecipeCardDashboard from "../components/RecipeCardDashboard";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]); // ✅ Initialize as an empty array
  const [query, setQuery] = useState(""); //set the query as an empty string
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
  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    console.log("Updated Recipes:", recipes); // ✅ Log after state update
  }, [recipes]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if(query.trim()==''){
        fetchRecipes();
        return
      }
      let response = await fetch(
        `http://localhost:8080/search?query=${query.trim()}`,
        {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("Authorization"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      let data = await response.json();
      
      setRecipes(data); // ✅ Update state
    } catch (err) {
      console.error("Error occured processing query:");
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row m-2">
          <div className="col-3"></div>
          <div className="col">
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleQueryChange}
              />
              <button className="btn btn-outline-success" onClick={handleSearch} >
                Search
              </button>
            </form>
          </div>
          <div className="col-3"></div>
        </div>
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
