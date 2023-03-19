import { io } from "socket.io-client";
import React from "react";
// const SOCKET_URL = "https://chat-app-ecru-theta.vercel.app";
const SOCKET_URL = "https://localhost:5000";
export const socket = io(SOCKET_URL);
export const AppContext = React.createContext();
