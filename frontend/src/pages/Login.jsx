import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
const Login = () => {
  let res;
  const navigate = useNavigate();
  const [loginCred, setLoginCred] = useState({ email: "", password: "" });
  async function handleSubmit(e) {
    e.preventDefault();
    if (loginCred.email == "" || loginCred.password == "") {
      alert("Please fill all fields");
      return;
    }

    res = await fetch("http://localhost:8080/Login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginCred),
    });
    let data = await res.json();
    if (res.status == 200) {
      localStorage.setItem("Authorization", data);
      localStorage.setItem("loginStatus", "true");
      setTimeout(() => {
        navigate("/Dashboard");
      }, 2000);
      return;
    } else {
      localStorage.clear();
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
              {res?.status == 200 ? (
                <>
                  <p>Login Successful redirecting shortly</p>
                </>
              ) : (
                <>{res?.msg}</>
              )}
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
