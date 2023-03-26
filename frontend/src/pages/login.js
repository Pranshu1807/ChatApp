import React, { useContext, useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/appContext";
const Login = () => {
  //asbdiasdbia
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);
  async function handleLogin(e) {
    e.preventDefault();
    const user = { email, password };
    const res = await axios
      .post(`${process.env.REACT_APP_URL}users/login`, user)
      .catch((err) => {
        console.log(err);
      });
    if (res) {
      if (res.data.message === "Login Succesfull") {
        localStorage.setItem("profile", JSON.stringify(res.data.result));
        socket.emit("new-user");
        navigate("/chat");
      } else {
        setError(res.data.message);
        // alert(res.data.message);
      }
    }
  }
  return (
    <div className="loginContainer">
      <div className="login__bg"></div>
      <div className="loginContent">
        {error && <div className="loginError">{error}</div>}
        <form onSubmit={handleLogin} className="loginForm">
          <label>
            <div className="formText">Email Address</div>
            <input
              type="text"
              name="name"
              className="loginInput"
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
              className="loginInput"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="loginBtn">
            Login
          </button>
          <div className="signupForm">
            Don't have an account ? <Link to="/signup">Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
