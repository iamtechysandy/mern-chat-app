import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Added name state
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    try {
      // Check Room ID and Password
      await axios.post("http://localhost:5000/join-room", { roomId, password });
      // Pass name and navigate to chat room
      navigate(`/chat/${roomId}`, { state: { name } });
    } catch (error) {
      alert("Invalid Room ID or Password");
    }
  };

  return (
    <div data-aos="fade-up" className="p-8 text-center">
      <h2 className="text-2xl font-bold">Join Room</h2>
      <input
        className="border px-2 py-1 mt-2"
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        className="border px-2 py-1 mt-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="border px-2 py-1 mt-2"
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleJoinRoom}
      >
        Join Room
      </button>
    </div>
  );
}

export default JoinRoom;
