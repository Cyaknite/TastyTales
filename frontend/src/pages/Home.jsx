import React from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <Navbar></Navbar>
      <div className="container-fluid">
        <div className="row Home h1row">
          <div className="col d-flex justify-content-center align-items-center">
            <motion.h1
              whileHover={{
                scale: 1.1,
              }}
              className="text-light text-center Home"
            >
              Welcome to Tasty Tales
            </motion.h1>
          </div>
        </div>
        <div className="row m-5 justify-content-around">
          <div className="card col-4 rounded-3" style={{ width: "18rem" }}>
            <img
              src="burger.jpg"
              className="card-img-top m-1 rounded-4 mt-2 Home ms-4"
              alt="An image of a burger with some fries and a drink"
            />
            <div className="card-body">
              <p className="card-text">
                Juicy chicken, melted cheese, crisp lettuce, and a toasted
                bun,one bite and you'll be craving more!
              </p>
            </div>
          </div>
          <div className="card col-4" style={{ width: "18rem" }}>
            <img
              src="chicken.jpg"
              className="card-img-top m-1 rounded-4 mt-2 Home ms-4"
              alt=""
            />
            <div className="card-body">
              <p className="card-text">
                Crispy, fiery chicken, layered with zesty sauce and fresh
                toppings,one bite and the heat will keep you coming back for
                more!
              </p>
            </div>
          </div>
          <div className="card col-4" style={{ width: "18rem" }}>
            <img
              src="ice_cream.jpg"
              className="card-img-top m-1 rounded-4 mt-2 Home ms-4"
              alt=""
            />
            <div className="card-body">
              <p className="card-text">
                Smooth, creamy ice cream swirled with decadent flavors,one
                spoonful and you won't be able to stop!
              </p>
            </div>
          </div>
        </div>
        <div className="row Home welcome">
          <div className="col">
            <h2 className="text-center mt-5">
              Tasty Tales – Where Every Recipe Tells a Story! 🍽️✨
            </h2>
            <p className="text-center m-5 ">
              Tasty Tales is more than just a recipe-sharing website—it's a
              vibrant community of food lovers, home chefs, and culinary
              explorers who believe that every dish has a tale to tell. Whether
              you're looking for time-honored family recipes, creative new
              twists on classics, or global flavors to inspire your next meal,
              you'll find it all here. From mouthwatering burgers to decadent
              desserts, our platform offers a space to discover, share, and
              celebrate the love of cooking. <Link to="/Register">Join us today</Link>, share your own
              delicious creations, connect with fellow foodies, and be part of a
              community that turns every meal into a memorable experience!
              🍕🥗🍰
            </p>
            <p className="">
              For other query contact <br />
              email-tastytales@gmail.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
