let currentTheme =
  localStorage.getItem("theme") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

if (currentTheme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.add("dark");
}

window.localStorage.setItem("theme", currentTheme);

const handleToggleClick = () => {
  const element = document.documentElement;
  element.classList.toggle("dark");

  const isDark = element.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

document
  .getElementById("themeToggle")
  ?.addEventListener("click", handleToggleClick);
