import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
const Logout = () => {
  const navigate = useNavigate();
  function handleSubmit(e) {
    
    localStorage.clear();
    navigate("/")
  }
  return (
    <>
      <Navbar></Navbar>
      <div className="container-fluid Login d-flex justify-content-center align-items-center">
        <div className="row ">
          <div className="col">
            <form className="card Login">
              <h2 className="text-center">Logout ?</h2>
              {localStorage.getItem("loginStatus") != "true" ? (
                <>Logged Out Successfully , redirecting shortly</>
              ) : (
                <></>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Yes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
