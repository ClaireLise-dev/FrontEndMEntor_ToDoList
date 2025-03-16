//Sélection éléments du DOM
const body = document.body;
const themeIcon = document.getElementById("themeIcon");
const newTask = document.getElementById("newTask");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("tasksList");

function toggleTheme() {
  body.classList.toggle("darkTheme");
  const isDarkTheme = body.classList.contains("darkTheme");
  localStorage.setItem("darkTheme", isDarkTheme);

  if (themeIcon) {
    themeIcon.src = isDarkTheme
      ? "./images/icon-sun.svg"
      : "./images/icon-moon.svg";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = JSON.parse(localStorage.getItem("darkTheme"));
  if (savedTheme) {
    document.body.classList.add("darkTheme");
    if (themeIcon) {
      themeIcon.src = "./images/icon-sun.svg";
    }
  } else {
    document.body.classList.remove("darkTheme"); // Assure que le mode clair est appliqué
    if (themeIcon) {
      themeIcon.src = "./images/icon-moon.svg";
    }
  }
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
loadTasks();

//Fonctions
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTaskToDom(task, prepend = true) {
  const addTask = document.createElement("li");
  addTask.classList.add("task");
  addTask.dataset.id = task.id;
  if (task.completed) {
    addTask.classList.add("taskCompleted");
  }
  addTask.innerHTML = `
    <span class="customCheckbox"></span>
    <span>${task.text}</span>
  `;
  if (prepend) {
    taskList.prepend(addTask);
  } else {
    taskList.appendChild(addTask);
  }
}

function loadTasks() {
  taskList.innerHTML = "";
  tasks.sort((a, b) => b.id - a.id);
  tasks.forEach((task) => {
    addTaskToDom(task, true);
  });
}

//Evenements
if (taskForm) {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTaskText = newTask.value.trim();
    if (newTaskText !== "") {
      const task = {
        id: Date.now(),
        text: newTaskText,
        completed: false,
      };
      tasks.unshift(task);
      loadTasks();
      newTask.value = "";
    }
  });
}

if (taskList) {
  taskList.addEventListener("click", (e) => {
    const taskItem = e.target.closest("li.task");
    if (!taskItem) return;

    const checkbox = taskItem.querySelector(".customCheckbox");
    const taskId = parseInt(taskItem.dataset.id, 10);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;

      if (tasks[taskIndex].completed) {
        taskItem.classList.add("taskCompleted");
      } else {
        taskItem.classList.remove("taskCompleted");
      }

      saveTasks();
    }
  });
}
