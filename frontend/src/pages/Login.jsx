import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
const Login = () => {

  const navigate=useNavigate();
  const [loginCred, setLoginCred] = useState({ email: "", password: "" });
  function handleSubmit(e) {
    
    if(loginCred.email==""||loginCred.password==""){
      alert("Please fill all fields")
    }else{
      
    }

  }
  return (
    <>
      <Navbar></Navbar>
      <div className="container-fluid Login d-flex justify-content-center align-items-center">
        <div className="row ">
          <div
            className="col-10"
            style={{
              width: "30 rem",
            }}
          >
            <form className="card Login">
              <h2 className="text-center">Login</h2>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={(e) => {
                    e.preventDefault();
                    setLoginCred({ ...loginCred, email: e.target.value });
                  }}
                />
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={(e) => {
                    e.preventDefault();
                    setLoginCred({ ...loginCred, password: e.target.value });
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <p>
                New user ? consider <Link to="/Register">registering</Link>{" "}
                first
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
