import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const [registerCred, setRegisterCred] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [repass, setRepass] = useState("");
  const [reg, setReg] = useState("");

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    if (
      registerCred.username == "" ||
      registerCred.email == "" ||
      registerCred.password == "" ||
      repass == ""
    ) {
      alert("Please enter all fields");
      return;
    }
    if (registerCred.password != repass) {
      alert("Password and Retyped password should be same");
      return;
    }
    try {
      let res = await fetch("http://localhost:8080/Register", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerCred),
      });
      let data = await res.json();
      if (res.status == 201) {
        setReg(data.msg);
        setTimeout(() => {
          navigate("/Login");
        }, 3000);
        return;
      }
      alert(data.msg);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again");
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
              <h2 className="text-center">Register</h2>
              {reg != "" ? (
                <>
                  <p>{reg+" redirecting shortly"}</p>
                </>
              ) : (
                <></>
              )}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Enter Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  onChange={(e) => {
                    e.preventDefault();
                    setRegisterCred({
                      ...registerCred,
                      username: e.target.value,
                    });
                  }}
                />
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
                    setRegisterCred({ ...registerCred, email: e.target.value });
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
                    setRegisterCred({
                      ...registerCred,
                      password: e.target.value,
                    });
                  }}
                />
                <label htmlFor="exampleInputPassword2" className="form-label">
                  Re-type Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword2"
                  onChange={(e) => {
                    e.preventDefault();
                    setRepass(e.target.value);
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
                Already registered? try <Link to="/Login"> logging</Link> in
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
