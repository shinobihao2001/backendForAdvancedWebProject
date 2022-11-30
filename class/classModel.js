const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  classname: {
    type: String,
    required: true,
    unique: true,
  },
  classOwner: {
    type: String,
  },
  describle: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("classes", ClassSchema);
