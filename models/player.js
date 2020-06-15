const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    discordID: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    platformID: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    platform: {
      type: String,
      trim: true,
      required: true,
    },
    currentRole: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
