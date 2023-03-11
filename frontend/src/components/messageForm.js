import React, { useContext, useRef, useEffect, useState } from "react";
import "./messageForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../context/appContext";
function MessageForm() {
  const [userStorage, setUserStorage] = useState(
    JSON.parse(localStorage.getItem("profile"))
  );
  const [message, setMessage] = useState("");
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);

  const messageEndRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return month + "/" + day + "/" + year;
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });

  function handleSubmitMsg(e) {
    e.preventDefault();
    if (!message) {
      return;
    }
    if (!JSON.parse(localStorage.getItem("profile"))) {
      return alert("Please login ");
    }
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit(
      "message-room",
      roomId,
      message,
      userStorage.user,
      time,
      todayDate
    );
    setMessage("");
  }
  return (
    <div className="messgaeFormContainer">
      {!userStorage && (
        <>
          <div className="notLoginMsg">Please Login </div>
          <div className="messageOutputNotLogin"></div>
        </>
      )}
      {userStorage && (
        <div className="messageOutput">
          {userStorage && !privateMemberMsg?._id && (
            <div className="roomInfo">You are in the {currentRoom} room</div>
          )}
          {userStorage && privateMemberMsg?._id && (
            <>
              <div className="pvtMsgInfo">
                <div>
                  Your conversation with {privateMemberMsg.name}{" "}
                  <img
                    src={privateMemberMsg.picture}
                    alt=""
                    className="conversation-profile-pic"
                  />
                </div>
              </div>
            </>
          )}
          {messages.map(({ _id, messagesByDate }, idx) => (
            <div key={idx}>
              <p className="MsgGroupByDate">{_id}</p>
              {messagesByDate.map(({ content, from, time, date }, msgIdx) => (
                <div
                  className={
                    from?.email === userStorage?.user.email
                      ? "outgoingMessage"
                      : "incomingMessage"
                  }
                  key={msgIdx}
                >
                  <div className="innerMsg">
                    <div className="msgSenderDetails">
                      <img src={from.picture} alt="" srcset="" />
                      {from.name === userStorage.user.name ? "You" : from.name}
                    </div>
                    <div className="msgContent">
                      <p>{content}</p>
                    </div>
                    <div className="time">
                      <p>{time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
      )}
      <form className="msgForm">
        <input
          type="text"
          placeholder="Your Message"
          disabled={!userStorage}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="msgFormbtn"
          disabled={!userStorage}
          onClick={handleSubmitMsg}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="paperPlaneMsg"
          ></FontAwesomeIcon>
        </button>
      </form>
    </div>
  );
}

export default MessageForm;
