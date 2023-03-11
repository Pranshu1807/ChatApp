import { io } from "socket.io-client";
import React from "react";
// const SOCKET_URL = "https://chat-app-new-pied.vercel.app";
const SOCKET_URL = "http://localhost:5000";
export const socket = io(SOCKET_URL);
export const AppContext = React.createContext();
