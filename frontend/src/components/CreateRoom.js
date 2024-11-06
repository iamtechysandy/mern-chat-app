import React, { useState } from "react";
import axios from "axios";

function CreateRoom() {
  const [roomDetails, setRoomDetails] = useState(null);

  const handleCreateRoom = async () => {
    const response = await axios.post("http://localhost:5000/create-room");
    setRoomDetails(response.data);
  };

  return (
    <div data-aos="fade-up" className="p-8 text-center">
      <h2 className="text-2xl font-bold">Create Room</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleCreateRoom}
      >
        Create Room
      </button>
      {roomDetails && (
        <div className="mt-4">
          <p>Room ID: {roomDetails.roomId}</p>
          <p>Password: {roomDetails.password}</p>
        </div>
      )}
    </div>
  );
}

export default CreateRoom;
