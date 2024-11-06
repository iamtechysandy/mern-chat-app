import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import ChatRoom from "./components/ChatRoom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./index.css";

function App() {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <Router>
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Chat App</h1>
        <Link
          to="/create"
          className="bg-blue-500 text-white px-4 py-2 rounded m-2"
        >
          Create Room
        </Link>
        <Link
          to="/join"
          className="bg-green-500 text-white px-4 py-2 rounded m-2"
        >
          Join Room
        </Link>
      </div>
      <Routes>
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
