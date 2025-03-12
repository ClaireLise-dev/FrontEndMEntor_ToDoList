const body = document.body;
const themeIcon = document.getElementById("themeIcon");

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
    const themeIcon = document.getElementById("themeIcon");
    if (themeIcon) {
      themeIcon.src = "./images/icon-sun.svg";
    }
  }
});
