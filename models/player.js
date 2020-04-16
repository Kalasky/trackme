const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    discordID: {
      type: String,
      trim: true
      //   required: true
    },
    battlenetID: {
      type: String,
      trim: true
      //   required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
