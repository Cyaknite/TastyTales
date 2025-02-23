import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/Login" element={<Login></Login>}></Route>
          <Route path="/Register" element={<Register></Register>}></Route>
          <Route path="/Dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/Logout" element={<Logout></Logout>}></Route>
          <Route path="/Admin" element={<Admin></Admin>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
