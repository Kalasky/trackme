const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    discordID: {
      type: String,
      trim: true,
      required: true,
    },
    gamertag: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    currentKDRole: {
      type: String,
      trim: true,
    },
    currentWinRole: {
      type: String,
      trim: true,
    },
    userAccountPlatforms: {
      type: Array,
      trim: true,
    },
    userAccountGamertags: {
      type: Array,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
