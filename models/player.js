const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    discordID: {
      type: String,
      trim: true,
      required: true,
      // unique: true,
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
    },
    currentKDRole: {
      type: String,
      trim: true,
    },
    currentWinRole: {
      type: String,
      trim: true,
    },
    loggedIn: {
      type: Boolean,
      trim: true,
      // required: true
    },
    userAccountPlatforms: {
      type: Array,
      trim: true,
      // required: true
    },
    userAccountGamertags: {
      type: Array,
      trim: true,
      // required: true
    },
    inPrompt: {
      type: Boolean,
      trim: true,
      // required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
