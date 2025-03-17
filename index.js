// Sélection des éléments du DOM
const body = document.body;
const themeIcon = document.getElementById("themeIcon");
const newTask = document.getElementById("newTask");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("tasksList");
const allButtons = document.querySelectorAll(".buttonAll");
const activeButtons = document.querySelectorAll(".buttonActive");
const completedButtons = document.querySelectorAll(".buttonCompleted");
const clearCompletedButton = document.getElementById("clearButton");

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
    document.body.classList.remove("darkTheme");
    if (themeIcon) {
      themeIcon.src = "./images/icon-moon.svg";
    }
  }
  loadTasks("all");
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//Fonctions
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTaskToDom(task, prepend = true) {
  const addTask = document.createElement("li");
  addTask.classList.add("task");
  addTask.dataset.id = task.id;
  addTask.setAttribute("draggable", "true");
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

function loadTasks(filter = "all") {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.sort((a, b) => b.id - a.id);
  filteredTasks.forEach((task) => {
    addTaskToDom(task, true);
  });
  addDragAndDrop();
}

function addDragAndDrop() {
  const taskItems = document.querySelectorAll(".task");
  let draggedItem = null;

  taskItems.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      draggedItem = task;
      e.dataTransfer.effectAllowed = "move";
    });

    task.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    task.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedItem && draggedItem !== task) {
        taskList.insertBefore(draggedItem, task);
        updateTaskOrder();
      }
    });
  });
}

function updateTaskOrder() {
  tasks = Array.from(taskList.children).map((task, index) => {
    const taskId = parseInt(task.dataset.id, 10);
    return tasks.find((t) => t.id === taskId);
  });
  saveTasks();
}

//Evènements
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
      saveTasks();
      loadTasks("all");
      newTask.value = "";
    }
  });
}

if (taskList) {
  taskList.addEventListener("click", (e) => {
    const taskItem = e.target.closest("li.task");
    if (!taskItem) return;

    const taskId = parseInt(taskItem.dataset.id, 10);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      taskItem.classList.toggle("taskCompleted", tasks[taskIndex].completed);
      saveTasks();
    }
  });
}

allButtons.forEach((button) =>
  button.addEventListener("click", () => loadTasks("all"))
);
activeButtons.forEach((button) =>
  button.addEventListener("click", () => loadTasks("active"))
);
completedButtons.forEach((button) =>
  button.addEventListener("click", () => loadTasks("completed"))
);

if (clearCompletedButton) {
  clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    loadTasks("all");
  });
}
