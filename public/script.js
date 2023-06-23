let socket = io();
let messages = document.querySelector('section ul');
let input = document.querySelector('input');
let userCount = document.querySelector('.user-count');
let previousColor = '';

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (input.value) {
    const color = getRandomWhiteSmokeColor();
    socket.emit('message', {
      content: input.value,
      color: color !== previousColor ? color : getRandomWhiteSmokeColor(),
    });
    input.value = '';
  }
});

socket.on('message', (message) => {
  addMessage(message);
});

socket.on('history', (history) => {
  history.forEach((message) => {
    addMessage(message);
  });
});

function addMessage(message) {
  const li = document.createElement('li');
  li.textContent = message.content;
  li.style.backgroundColor = message.color;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
  previousColor = message.color;
}

function getRandomWhiteSmokeColor() {
  const shadesOfWhiteSmoke = [
    '#D8FFF4',
    '#FFD0B5',
    '#E2D6FF',
    '#989BFF',
    // Add more shades here if needed
  ];

  // Shuffle the array
  for (let i = shadesOfWhiteSmoke.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shadesOfWhiteSmoke[i], shadesOfWhiteSmoke[j]] = [shadesOfWhiteSmoke[j], shadesOfWhiteSmoke[i]];
  }

  const currentIndex = shadesOfWhiteSmoke.indexOf(previousColor);
  const nextIndex = (currentIndex + 1) % shadesOfWhiteSmoke.length;
  return shadesOfWhiteSmoke[nextIndex];
}

// Update the online user count in the header
socket.on('userCount', (count) => {
  const userCountElement = document.querySelector('.user-count');
  const userLabelElement = document.querySelector('.user-label');

  userCountElement.textContent = count;
  userLabelElement.textContent = count === 1 ? 'user' : 'users';
});
