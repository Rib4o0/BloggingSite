const consoleText = document.querySelector('.console');

const location = window.location.href;
const paths = location.split('/').filter(path => path !== '');
const locationId = paths[paths.length - 1];
consoleText.textContent = 'locationId';