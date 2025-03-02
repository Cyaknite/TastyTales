import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"; // Corrected import
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [showSaved, setShowSaved] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false); // State to control the edit form
  const [formData, setFormData] = useState({
    password: "",
    bio: user.bio || "",
    profilePicture: null,
  });

  // Fetch profile data
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
        if (!response.ok) {
          alert("Failed to fetch profile data");
          return;
        }
        let result = await response.json();
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
        setCreatedRecipes(result.createdRecipes);
        setSavedRecipes(result.savedRecipes);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle delete recipe
  const handleDelete = (recipeId) => {
    setCreatedRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe._id !== recipeId)
    );
  };

  // Handle unsave recipe
  const handleUnsave = (recipeId) => {
    setSavedRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe._id !== recipeId)
    );
  };

  // Handle input changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("password", formData.password);
      formDataToSend.append("bio", formData.bio);
      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }
      console.log(formData);
      const response = await fetch("http://localhost:8080/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization"),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.msg); // Show success message
        setShowEditForm(false); // Close the edit form
        // Refresh profile data
        const updatedResponse = await fetch("http://localhost:8080/Profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Authorization"),
          },
        });
        const updatedResult = await updatedResponse.json();
        setUser(updatedResult.data);
        localStorage.setItem("user", JSON.stringify(updatedResult.data));
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-3">
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
            />
            <p>{user.username}</p>
          </div>
          <div className="col">
            {user.createdRecipes ? <>{user.createdRecipes.length}</> : <>0</>}
            <p>Created Recipes</p>
          </div>
          {/* <div className="col">
            {user.followers ? <>{user.followers.length}</> : <>0</>}
            <p>Followers</p>
          </div>
          <div className="col">
            {user.following ? <>{user.following.length}</> : <>0</>}
            <p>Following</p>
          </div> */}
        </div>
        {/* <div className="row">
          <div className="col">
            <h3>Bio</h3>
            <p>{user.bio ? <>{user.bio}</> : <>Edit bio</>}</p>
          </div>
        </div> */}
        <div className="row">
          <div className="col">
           {/*  <button
              className="btn btn-outline-primary"
              onClick={() => setShowEditForm(true)} // Open the edit form
            >
              Edit Profile
            </button> */}
            <button
              className="btn btn-outline-primary m-1"
              onClick={() => setShowSaved(!showSaved)}
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
                    <RecipeCard recipe={recipe} key={index} />
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
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditForm(false)} // Close the modal
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} enctype="multipart/form-data">
                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Bio */}
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  {/* Profile Picture */}
                  <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
