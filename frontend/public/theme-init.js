(function () {
  var saved;
  try {
    saved = localStorage.getItem("cloudbyte-theme");
  } catch (_) {}
  var theme =
    saved === "light" || saved === "dark"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta)
    meta.setAttribute("content", theme === "dark" ? "#0b152b" : "#ffffff");
})();
