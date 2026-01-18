const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* =======================
   MongoDB Atlas Connect
======================= */
mongoose.connect(
  "mongodb+srv://jayaprakashkammari2005_db_user:4HszdqSPxHhXl3QB@taskprogress.mfesmlk.mongodb.net/"
)
.then(() => console.log("MongoDB Atlas Connected"))
.catch(err => console.error(err));

/* =======================
   Task Schema & Model
======================= */
const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo"
  }
});

const Task = mongoose.model("Task", taskSchema);

/* =======================
   Routes
======================= */

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create task
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Update task status
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(task);
});

/* =======================
   Start Server
======================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
