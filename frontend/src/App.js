import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navigation from "./components/navigation";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Chat from "./pages/chat";
import { useState } from "react";
import axios from "axios";
import { AppContext, socket } from "./context/appContext";
function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [newMessages, setNewMessages] = useState({});
  const [privateMemberMsg, setprivateMemberMsg] = useState({});
  return (
    <AppContext.Provider
      value={{
        rooms,
        socket,
        setRooms,
        currentRoom,
        setCurrentRoom,
        messages,
        setMessages,
        members,
        setMembers,
        newMessages,
        setNewMessages,
        privateMemberMsg,
        setprivateMemberMsg,
      }}
    >
      <BrowserRouter>
        <Navigation></Navigation>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/chat" element={<Chat></Chat>}></Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
