const body = document.body;
const themeIcon = document.getElementById("themeIcon");
const newTask = document.getElementById("newTask");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("tasksList");

function toggleTheme() {
  body.classList.toggle("darkTheme");
  const isDarkTheme = body.classList.contains("darkTheme");
  localStorage.setItem("darkTheme", isDarkTheme);

  // Correction du sélecteur pour trouver l'icône
  if (themeIcon) {
    themeIcon.src = isDarkTheme
      ? "./images/icon-sun.svg"
      : "./images/icon-moon.svg";
  }
}

// Applique le thème sauvegardé au chargement
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("darkTheme") === "true";
  if (savedTheme) {
    document.body.classList.add("darkTheme");
    if (themeIcon) {
      themeIcon.src = "./images/icon-sun.svg";
    }
  }
});

//Récupération des tâches
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Fonctions
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTaskToDom(task) {
  const addTask = document.createElement("li");
  addTask.classList.add("task");
  if (task.completed) {
    addTask.classList.add("taskCompleted");
  }
  addTask.innerHTML = `
    <span class="customCheckbox"></span>
          <span>${task.text}</span>
        `;
  taskList.prepend(addTask);
}

function loadTask() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    addTaskToDom(task);
  });
}

//Evènements
if (taskForm) {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTaskText = newTask.value.trim();
    if (newTaskText !== "") {
      const task = {
        text: newTaskText,
        completed: false,
      };

      tasks.unshift(task);
      saveTasks();
      addTaskToDom(task);

      newTask.value = "";
    }
  });
}
if (taskList) {
  loadTask();
}
