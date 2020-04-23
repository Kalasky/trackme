const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    discordID: {
      type: String,
      trim: true,
      //   required: true
    },
    platformID: {
      type: String,
      trim: true,
      //   required: true
    },
    platform: {
      type: String,
      trim: true,
    },
    currentRole: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
