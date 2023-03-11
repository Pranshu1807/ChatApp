import React from "react";
import Sidebar from "../components/sidebar";
import MessageForm from "../components/messageForm";
import "./chat.css";
const Chat = () => {
  return (
    <div className="chatContainer">
      <div className="chatSidebar">
        <Sidebar></Sidebar>
      </div>
      <div className="chatMessage">
        <MessageForm></MessageForm>
      </div>
    </div>
  );
};
export default Chat;
