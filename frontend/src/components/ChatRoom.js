import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function ChatRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState("");
  const name = location.state?.name || "Anonymous"; // User name from state

  useEffect(() => {
    // Join room and notify others
    socket.emit("joinRoom", roomId, name);

    // Fetch chat history
    const fetchChatHistory = async () => {
      const response = await axios.get(
        `http://localhost:5000/chat-history/${roomId}`
      );
      setMessages(response.data);
    };
    fetchChatHistory();

    // Listen for events
    socket.on("notification", (message) => {
      setMessages((prev) => [...prev, { sender: "System", message }]);
    });
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("userTyping", (typingMessage) => setIsTyping(typingMessage));
    socket.on("stopTyping", () => setIsTyping(""));
    socket.on("seenByUpdate", ({ messageId, username }) => {
      setMessages((msgs) =>
        msgs.map((msg) =>
          msg._id === messageId
            ? { ...msg, seenBy: [...msg.seenBy, username] }
            : msg
        )
      );
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("notification");
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("stopTyping");
      socket.off("seenByUpdate");
    };
  }, [roomId, name]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", roomId, name, message);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", roomId, name);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent newline in input field
      sendMessage();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat Room: {roomId}</h2>

      <div className="border p-4 h-64 overflow-y-scroll">
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.sender === "System" ? (
              <p className="text-gray-500 text-sm italic">{msg.message}</p>
            ) : (
              <div
                className={`my-2 ${
                  msg.sender === name ? "text-right" : "text-left"
                }`}
              >
                <span className="font-semibold">{msg.sender}</span>
                <p
                  className={`inline-block p-2 rounded ${
                    msg.sender === name
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </p>
                <span className="text-xs text-gray-500 ml-2">
                  {msg.seenBy?.includes(name) ? "✔✔" : "✔"}{" "}
                  {/* Double check for seen */}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isTyping && <p className="text-gray-500">{isTyping}</p>}

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress} // Trigger send on Enter
        onKeyUp={handleTyping} // Trigger typing indicator
        placeholder="Type a message..."
        className="border p-2 w-full mt-2"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Send
      </button>
    </div>
  );
}

export default ChatRoom;
