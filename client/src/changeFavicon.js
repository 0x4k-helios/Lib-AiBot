// src/changeFavicon.js

export function changeFavicon(src) {
  const favicon = document.getElementById("favicon");
  if (favicon) {
    favicon.href = src;
  }
}
