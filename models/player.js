const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    discordID: {
      type: String,
      trim: true,
      required: true,
      // unique: true,
    },
    platformID: {
      type: String,
      trim: true,
      required: true,
      // unique: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
