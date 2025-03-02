import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [showSaved, setShowSaved] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let response = await fetch("http://localhost:8080/Profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Authorization"),
          },
        });
        if (response.status == 403) {
          alert("Login First");
          localStorage.clear();
          navigate("/Login");
          return;
        }
        if (response.status == 401) {
          alert("Token expired , try logging in again");
          localStorage.clear();
          navigate("/Login");
          return;
        }
        if (!response.ok) {
          alert("Failed to fetch profile data");
          return;
        }
        let result = await response.json();
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
        console.log(result.data);
        console.log(result.createdRecipes);
        setCreatedRecipes(result.createdRecipes);
        setSavedRecipes(result.savedRecipes);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleDelete = (recipeId) => {
    setCreatedRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe._id !== recipeId)
    );
  };

  const handleUnsave = (recipeId) => {
    setSavedRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe._id !== recipeId)
    );
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-3 ">
            <motion.img
              src={user.profilePicture || "user.png"}
              alt="Profile Picture"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "2px solid black",
              }}
              whileHover={{
                scale: 1.2,
              }}
            ></motion.img>
            <p>{user.username}</p>
          </div>
          <div className="col">
            {user.createdRecipies ? <>{user.createdRecipies.length}</> : <>0</>}
            <p>Created Recipies</p>
          </div>
          <div className="col">
            {user.followers ? <>{user.followers.length}</> : <>0</>}
            <p>Followers</p>
          </div>
          <div className="col">
            {user.following ? <>{user.following.length}</> : <>0</>}
            <p>Following</p>
          </div>
        </div>
        <div className="row ">
          <div className="col">
            <h3>Bio</h3>
            <p>{user.bio ? <>{user.bio}</> : <>Edit bio</>}</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button className="btn btn-outline-primary ">Edit Profile</button>
            <button
              className="btn btn-outline-primary m-1"
              onClick={() => {
                setShowSaved(!showSaved);
              }}
            >
              {showSaved ? <>Show Created</> : <>Show Saved</>}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="mt-3 col d-flex">
            {showSaved ? (
              <div>
                <h3>Saved Recipes</h3>
                <ul className="list-group">
                  {savedRecipes?.map((recipe, index) => (
                    <RecipeCard recipe={recipe} key={index}></RecipeCard>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h3>Created Recipes</h3>
                <ul className="list-group">
                  {createdRecipes?.map((recipe, index) => (
                    <RecipeCard
                      recipe={recipe}
                      onDelete={handleDelete}
                      key={index}
                      onSave={handleUnsave}
                    ></RecipeCard>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
