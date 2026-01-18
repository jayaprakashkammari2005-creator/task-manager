const API = "https://task-manager-backend-5ofn.onrender.com/tasks";

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

async function drop(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  
  // FIX 1: Find the nearest column even if dropped on another task
  const column = ev.target.closest(".column"); 
  if (!column) return;

  column.appendChild(document.getElementById(id));

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: column.id }) // Use column.id instead of ev.target.id
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value;
  if (!title) return;

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      title: title,
      status: "todo" // FIX 2: Always provide a default status
    })
  });

  const task = await res.json();
  renderTask(task);
  input.value = ""; // Clear input after adding
}

function renderTask(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.id = task._id;
  div.draggable = true;
  div.ondragstart = drag;
  div.innerText = task.title;

  // Safety check to prevent errors if status is missing
  const targetColumn = document.getElementById(task.status || "todo");
  if (targetColumn) {
    targetColumn.appendChild(div);
  }
}

async function loadTasks() {
  try {
    const res = await fetch(API);
    const tasks = await res.json();
    tasks.forEach(renderTask);
  } catch (err) {
    console.error("Failed to load tasks. Backend might be sleeping...", err);
  }
}

loadTasks();