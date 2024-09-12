// Get the favicon element and change its href attribute
export function changeFavicon(src) {
  const favicon = document.getElementById("favicon");
  if (favicon) {
    favicon.href = src;
  }
}
