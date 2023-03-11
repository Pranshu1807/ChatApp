import React from "react";
import "./home.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
const Home = () => {
  return (
    <div className="homeContainer">
      <div className="homeContent">
        <h1>Share the world with your friends</h1>
        <h3>Chat App lets you connect with the worlds</h3>
        <button className="homeBtn">
          <Link className="linkText" to="/chat">
            Get Started
            <FontAwesomeIcon
              icon={faComments}
              className="commentsHome"
            ></FontAwesomeIcon>
          </Link>
        </button>
      </div>
      <div className="homeBg"></div>
    </div>
  );
};
export default Home;
