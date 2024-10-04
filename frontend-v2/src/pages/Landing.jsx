import React from "react";
import { motion } from "framer-motion";
import Login from "./Login";
import { useNavigate, Link } from "react-router-dom";
import "../css/Landing.css";
const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Left Panel */}
      <motion.div
        className="left-panel"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="logo-title">
          <h1 className="title">SnackTrack</h1>
          <p className="punchline">
            Say goodbye to snack expense chaos – SnackTrack simplifies the way
            you track and reimburse.
          </p>
        </div>
      </motion.div>

      {/* Right Panel (Login Form) */}
      <motion.div
        className="right-panel"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Login />
      </motion.div>
    </div>
  );
};

export default LandingPage;
