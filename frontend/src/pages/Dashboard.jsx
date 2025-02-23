import React from "react";
import Navbar from "../components/Navbar";
const Dashboard = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">filters</div>
          <div className="col-10">
            <nav className="navbar bg-body-tertiary">
              <div className="container-fluid">
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-success" type="submit">
                    Search
                  </button>
                  
                </form>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
