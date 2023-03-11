import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import axios from "axios";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
function Sidebar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  // const [notification, setnotification] = useState();
  const {
    rooms,
    socket,
    setRooms,
    currentRoom,
    setCurrentRoom,
    members,
    setMembers,
    privateMemberMsg,
    setprivateMemberMsg,
  } = useContext(AppContext);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert("Please login");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);
    if (isPublic) {
      setprivateMemberMsg(null);
    }
  }

  useEffect(() => {
    if (user) {
      setCurrentRoom("General");
      setprivateMemberMsg(null);
      getRooms();
      socket.emit("join-room", "General");
      socket.emit("new-user");
    }
  }, []);
  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }

  function handlePrivateMemberMsg(member) {
    setprivateMemberMsg(member);
    const roomId = orderIds(user.user._id, member._id);
    joinRoom(roomId, false);
  }

  async function getRooms() {
    const res = await axios.get("http://localhost:5000/rooms").catch((err) => {
      console.log(err.response);
    });
    setRooms(res.data);
  }
  // async function getRooms() {
  //   const res = await axios
  //     .get("https://chat-app-jet-two.vercel.app/rooms")
  //     .catch((err) => {
  //       console.log(err.response);
  //     });
  //   setRooms(res.data);
  // }
  if (!user) return <div className="sidebarContainer notloginSidebar"></div>;

  return (
    <div className="sidebarContainer">
      <h2>Availabe Rooms</h2>
      <div className="rooms">
        {rooms.map((room, idx) => (
          <div
            className={`list ${currentRoom === room ? "activeS " : ""} `}
            onClick={() => joinRoom(room)}
            key={idx}
          >
            {room}
          </div>
        ))}
      </div>
      <h2>Members</h2>
      <div className="members">
        {members.map((member, idx) => (
          <div
            onClick={() => handlePrivateMemberMsg(member)}
            className={`membersList ${
              member._id === user.user._id ? "disabled " : ""
            } ${privateMemberMsg?._id === member?._id ? "activeS" : ""} `}
            key={idx}
          >
            <div className="memberDP">
              {member.status === "online" ? (
                <FontAwesomeIcon
                  icon={faCircle}
                  className="sidebar-online-status"
                ></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon
                  icon={faCircle}
                  className="sidebar-offline-status"
                ></FontAwesomeIcon>
              )}
              <img src={member.picture} alt="" />
            </div>
            <div className="memberName">
              {member.name}
              {member._id === user?.user._id && "  (You)"}
              {member.status === "offline" && " (Offline)"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
