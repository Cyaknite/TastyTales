import React from "react";
import { motion, useScroll, useSpring } from "motion/react";
import "./ScrollProgress.css"
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="loader"
      style={{
        scaleX:scrollYProgress,
      }}
    ></motion.div>
  );
};

export default ScrollProgress;
