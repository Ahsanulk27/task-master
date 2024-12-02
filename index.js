import express from "express";
import bodyParser from "body-parser";
import fs from "fs"
import path from "path";

const app = express();
const PORT = 3000;

const __dirname = path.resolve();

const tasksFilePath = path.join(__dirname, 'tasks.json');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Load tasks from the tasks.json file
function loadTasks() {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data); // Return tasks array
  } catch (err) {
    return []; // Return an empty array if no tasks file exists
  }
}

// Save tasks to the tasks.json file
function saveTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
}


// Home page - Load tasks and render them
app.get('/', (req, res) => {
  const tasks = loadTasks(); // Load tasks from file
  res.render('index', { tasks: tasks }); // Render with tasks
});

// Route to handle adding a new task
app.post("/add", (req, res) => {
  const newTask = req.body.task;
  if (newTask.trim()) {
    const tasks = loadTasks(); // Load existing tasks
    tasks.push({ task: newTask, checked: false }); // Add new task with default checked state
    saveTasks(tasks); // Save the updated tasks
  }
  res.redirect("/"); // Redirect to home page to show updated tasks
});


app.post('/toggle/:index', (req, res) => {
  const tasks = loadTasks();
  const index = req.params.index;

  if (tasks[index]) {
    tasks[index].checked = !tasks[index].checked; // Toggle the checked state
    saveTasks(tasks); // Save updated tasks to tasks.json
  }

  res.redirect('/'); // Redirect back to the main page
});


// Route to handle deleting a task
app.post('/delete/:index', (req, res) => {
  const index = req.params.index;
  const tasks = loadTasks(); // Load existing tasks
  tasks.splice(index, 1); // Remove the task at the given index
  saveTasks(tasks); // Save the updated tasks array
  res.redirect('/'); // Redirect back to home page to show updated tasks
});


app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});


// FIX THE TASK NAMES