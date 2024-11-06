const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  users: [{ type: String }],
});

module.exports = mongoose.model("Room", roomSchema);
