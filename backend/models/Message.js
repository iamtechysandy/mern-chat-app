const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  seenBy: [{ type: String }], // Users who have seen the message
});

module.exports = mongoose.model("Message", messageSchema);
