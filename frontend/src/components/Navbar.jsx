import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import ScrollProgress from "./ScrollProgress";
const MotionLink = motion(Link);
const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid Navbar">
          <motion.a
            className="navbar-brand"
            whileHover={{
              scale: 1.1,
            }}
          >
            Tasty Tales
          </motion.a>
          <motion.button
            whileTap={{
              rotate: 45,
              scale: 0.8,
            }}
            className="navbar-toggler bg-orange"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </motion.button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <MotionLink
                  whileHover={{
                    scale: 1.1,
                    transformOrigin: "center",
                  }}
                  style={{
                    display: "inline-block",
                  }}
                  className="nav-link"
                  to="/"
                >
                  Home
                </MotionLink>
              </li>
              <li className="nav-item">
                <MotionLink
                  whileHover={{
                    scale: 1.1,
                    transformOrigin: "center",
                  }}
                  style={{
                    display: "inline-block",
                  }}
                  className="nav-link"
                  to="/Login"
                >
                  Login
                </MotionLink>
              </li>
              <li className="nav-item">
                <MotionLink
                  whileHover={{
                    scale: 1.1,
                    transformOrigin: "center",
                  }}
                  style={{
                    display: "inline-block",
                  }}
                  className="nav-link"
                  to="/Register"
                >
                  Register
                </MotionLink>
              </li>
              {localStorage.getItem("loginStatus")? (
                <>
                  <li className="nav-item">
                    <MotionLink
                      whileHover={{
                        scale: 1.1,
                        transformOrigin: "center",
                      }}
                      style={{
                        display: "inline-block",
                      }}
                      className="nav-link"
                      to="/Dashboard"
                    >
                      Dashboard
                    </MotionLink>
                  </li>
                </>
              ) : (
                <></>
              )}
              {localStorage.getItem("loginStatus")? (
                <>
                  <li className="nav-item">
                    <MotionLink
                      whileHover={{
                        scale: 1.1,
                        transformOrigin: "center",
                      }}
                      style={{
                        display: "inline-block",
                      }}
                      className="nav-link"
                      to="/Logout"
                    >
                      Logout
                    </MotionLink>
                  </li>
                </>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <ScrollProgress></ScrollProgress>
    </>
  );
};

export default Navbar;
