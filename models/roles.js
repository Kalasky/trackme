const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const roleSchema = new mongoose.Schema(
  {
    roleID: {
      type: Number,
      trim: true,
      required: true,
    },
    roleName: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);