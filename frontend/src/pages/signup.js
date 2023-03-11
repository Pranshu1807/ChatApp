import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import botImg from "../images/profile_pic.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "uo084mwm");
    try {
      setUploadingImg(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dqlkom6bk/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!image) {
      return alert("Please upload profile picture");
    }
    if (password.length < 8) {
      return alert("Password should be atleast 8 characters");
    }
    const url = await uploadImage(image);
    const user = { name, email, password, picture: url };
    const res = await axios
      .post("http://localhost:5000/users/signup", user)
      .catch((err) => {
        if (err.response.data.code === 11000) {
          alert("User already exists");
        } else {
          console.log(err.response);
        }
      });
    // const res = await axios
    //   .post("https://chat-app-new-pied.vercel.app/users/signup", user)
    //   .catch((err) => {
    //     if (err.response.data.code === 11000) {
    //       alert("User already exists");
    //     } else {
    //       console.log(err.response);
    //     }
    //   });

    if (res) {
      if (res.data.message === "SignUp Succesfull") {
        localStorage.setItem("profile", JSON.stringify(res.data.result));
        navigate("/chat");
      }
    }
  }

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }
  return (
    <div className="signupContainer">
      <div className="signupContent">
        <div className="signupTop">
          <h1>Create Account</h1>
          <img src={imagePreview || botImg} alt=" " className="dp" />
          <label htmlFor="image-upload">
            <FontAwesomeIcon icon={faPlus} className="upload_sign" />
          </label>
          <input
            type="file"
            id="image-upload"
            hidden
            accept="image/png, image/jpeg"
            onChange={validateImg}
          />
        </div>
        <form onSubmit={handleSignup}>
          <label>
            <div className="formText">Name</div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            <div className="formText">Email Address</div>
            <input
              type="text"
              name="name"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="mutedText">
              We'll never share your email with anyone else.
            </div>
          </label>
          <label>
            <div className="formText">Password</div>
            <input
              type="password"
              name="name"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="signupbtn" type="submit">
            {uploadingImg ? "Signing you up..." : "Sign up"}
          </button>
          <div className="signupForm">
            Already have an account ? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
      <div className="signup__bg"></div>
    </div>
  );
};
export default Signup;
