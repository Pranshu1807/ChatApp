const express = require("express");
const app = express();
const rooms = ["General", "Finance", "Tech", "Crypto"];
const cors = require("cors");
require("dotenv").config();
require("./connection");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const User = require("./models/userModel");
const Message = require("./models/messageModel");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/users", userRoutes);
app.get("/", (req, res) => {
  res.send("working fine");
});
const server = require("https").createServer(app);
// const server = require("http").createServer(app);
const PORT = 5000;
// const io = require("socket.io")(server, {
//   cors: {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": ["GET", "POST", "DELETE", "PUT"],
//     "Access-Control-Allow-Credentials": "true",
//     "Access-Control-Allow-Headers": ["Origin", "Content-Type", "Accept"],
//     origin: "http://localhost://3000",
//     methods: ["GET", "POST", "DELETE", "PUT"],
//   },
// });
// const io = require("socket.io")(server, {
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
//       "Access-Control-Allow-Credentials": true,
//       "Access-Control-Allow-Headers": ["Origin", "Content-Type", "Accept"],
//     };
//     res.writeHead(200, headers);
//     res.end();
//   },
// });
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    // "Access-Control-Allow-Origin": "*",
    methods: ["GET", "POST"],
  },
});

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "https://chat-app-new-pied.vercel.app/",
//     // "Access-Control-Allow-Origin": "*",
//     // methods: ["GET", "POST"],
//   },
// });
async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  app.post("/logout", async (req, res) => {
    // console.log("logout");
    try {
      // console.log(req.body);
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      // console.log(user);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });

  socket.on("join-room", async (room, previousRoom) => {
    socket.join(room);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await new Message({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    await newMessage.save();
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
