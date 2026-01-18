const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo"
  }
});

module.exports = mongoose.model("Task", taskSchema);
