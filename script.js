const tiles = [
  's 1', 'S 1', 's 2', 'S 2', 's 3', 'S 3',
  'c 1', 'C 1', 'c 2', 'C 2', 'c 3', 'C 3',
  't 1', 'T 1', 't 2', 'T 2', 't 3', 'T 3'
];
const shapeNames = { s: 'square', c: 'circle', t: 'triangle' };
const colorNames = { '1': 'red', '2': 'green', '3': 'blue' };
const formChangeMap = {
  s: 'ct',
  S: 'CT',
  c: 'st',
  C: 'ST',
  t: 'sc',
  T: 'SC',
};
const sizeChangeMap = {
  s: 'S',
  S: 's',
  c: 'C',
  C: 'c',
  t: 'T',
  T: 't',
};

const stackDisplay = document.getElementById('stack-display');
const availableTiles = document.getElementById('available-tiles');
const nextMessage = document.getElementById('next-message');
const nextChoiceTitle = document.getElementById('next-choice-title');
const conditionButtons = document.querySelectorAll('#condition-buttons button');
const highscoreName = document.getElementById('highscore-name');
const highscoreValue = document.getElementById('highscore-value');
const stackCount = document.getElementById('stack-count');
const unusedCount = document.getElementById('unused-count');
const elapsedTime = document.getElementById('elapsed-time');
const scoreValue = document.getElementById('score-value');
const gameStatus = document.getElementById('game-status');
const newGameButton = document.getElementById('new-game-button');
const endScreen = document.getElementById('end-screen');
const endTitle = document.getElementById('end-title');
const endDescription = document.getElementById('end-description');
const playerNameInput = document.getElementById('player-name');
const saveScoreButton = document.getElementById('save-score-button');
const highscorePanel = document.getElementById('highscore-panel');
const highscoreTableBody = document.querySelector('#highscore-table tbody');

let available = [];
let stack = [];
let condition = '*';
let startTime = null;
let timerId = null;
let gameOver = false;
let selectedTile = null;
let finalElapsed = 0;
let finalScore = 0;
let highscore = { score: 0, name: 'Nobody' };
let highscores = [];
let lastSavedEntry = null;

function decodeTile(object) {
  const letter = object[0];
  const digit = object[2];
  const size = letter === letter.toLowerCase() ? 'A small' : 'A large';
  const shape = shapeNames[letter.toLowerCase()] || 'unknown shape';
  const color = colorNames[digit] || 'unknown color';
  return `${size} ${color} ${shape}`;
}

function formatTileLabel(object) {
  return object;
}

function loadHighscore() {
  const stored = window.localStorage.getItem('objectstackenglish-highscores');
  if (stored) {
    try {
      highscores = JSON.parse(stored);
    } catch (error) {
      highscores = [];
    }
  }
  if (!Array.isArray(highscores)) {
    highscores = [];
  }
  if (highscores.length > 0) {
    highscore = { name: highscores[0].name, score: highscores[0].score };
  } else {
    highscore = { name: 'Nobody', score: 0 };
  }
  highscoreName.textContent = highscore.name;
  highscoreValue.textContent = highscore.score;
}

function saveHighscore(entry) {
  highscores.push(entry);
  highscores.sort((a, b) => b.score - a.score || new Date(a.date) - new Date(b.date));
  highscores = highscores.slice(0, 10);
  window.localStorage.setItem('objectstackenglish-highscores', JSON.stringify(highscores));

  const isNewBest = entry.score > highscore.score;
  if (isNewBest) {
    highscore = { name: entry.name, score: entry.score };
    highscoreName.textContent = highscore.name;
    highscoreValue.textContent = highscore.score;
  }
  return isNewBest;
}

function renderHighscoreTable() {
  highscoreTableBody.innerHTML = '';
  highscores.forEach((entry, index) => {
    const row = document.createElement('tr');
    if (
      lastSavedEntry &&
      entry.name === lastSavedEntry.name &&
      entry.score === lastSavedEntry.score &&
      entry.date === lastSavedEntry.date
    ) {
      row.classList.add('highlighted');
    }
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
      <td>${new Date(entry.date).toISOString().slice(0, 10)}</td>
    `;
    highscoreTableBody.appendChild(row);
  });
}

function getPossibleNextObjects(changeCondition, availableObjects) {
  const shapes = 'sScCtT';
  const colors = '123';
  let possibleShapes = '';
  let possibleColors = '';

  if (changeCondition === '*') {
    possibleShapes = shapes;
    possibleColors = colors;
  } else {
    const top = stack[stack.length - 1] || '';
    if (!top) {
      return [];
    }
    if (changeCondition === 'f') {
      possibleShapes = formChangeMap[top[0]] || '';
      possibleColors = top[2];
    }
    if (changeCondition === 's') {
      possibleShapes = sizeChangeMap[top[0]] || '';
      possibleColors = top[2];
    }
    if (changeCondition === 'c') {
      possibleShapes = top[0];
      possibleColors = colors.split('').filter(color => color !== top[2]).join('');
    }
  }

  const combinations = [];
  for (const shape of possibleShapes) {
    for (const color of possibleColors) {
      combinations.push(`${shape} ${color}`);
    }
  }

  return combinations.filter(item => availableObjects.includes(item));
}

function updateTime() {
  if (startTime && !gameOver) {
    const elapsed = (Date.now() - startTime) / 1000;
    elapsedTime.textContent = elapsed.toFixed(2);
    requestAnimationFrame(updateTime);
  }
}

function hasPossibleNextMove(availableObjects) {
  return ['f', 's', 'c'].some(condition => getPossibleNextObjects(condition, availableObjects).length > 0);
}

function renderTiles() {
  availableTiles.innerHTML = '';
  const possible = condition === '*' ? available : getPossibleNextObjects(condition, available);
  const tileColorMap = {
    '1': '#7f1d1d',
    '2': '#14532d',
    '3': '#1e3a8a',
  };

  available.forEach(tile => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'tile-card';
    item.dataset.tile = tile;
    item.textContent = formatTileLabel(tile);
    item.title = decodeTile(tile);

    const colorCode = tile[2];
    const backgroundColor = tileColorMap[colorCode] || 'rgba(255, 255, 255, 0.08)';
    item.style.backgroundColor = backgroundColor;
    item.style.color = '#f8fafc';
    item.style.borderColor = 'rgba(255,255,255,0.12)';

    const isPossible = condition === '*' || possible.includes(tile);
    if (!isPossible || condition === '') {
      item.classList.add('disabled');
      item.disabled = true;
    }
    if (selectedTile === tile) {
      item.classList.add('selected');
    }
    if (isPossible && condition !== '') {
      item.classList.add('valid');
    }
    item.addEventListener('click', () => selectTile(tile));
    availableTiles.appendChild(item);
  });
}

function renderStack() {
  stackDisplay.innerHTML = '';
  if (stack.length === 0) {
    stackDisplay.textContent = 'No tiles yet.';
    return;
  }
  const tileColorMap = {
    '1': '#7f1d1d',
    '2': '#14532d',
    '3': '#1e3a8a',
  };

  stack.forEach(tile => {
    const tileElement = document.createElement('div');
    tileElement.className = 'tile-card selected';
    tileElement.textContent = tile;
    tileElement.title = decodeTile(tile);
    const colorCode = tile[2];
    tileElement.style.backgroundColor = tileColorMap[colorCode] || 'rgba(255, 255, 255, 0.08)';
    tileElement.style.color = '#f8fafc';
    tileElement.style.borderColor = 'rgba(255,255,255,0.12)';
    stackDisplay.appendChild(tileElement);
  });
}

function updateControls() {
  conditionButtons.forEach(btn => {
    btn.disabled = gameOver || condition !== '';
    btn.classList.toggle('selected', btn.dataset.condition === condition);
  });

  stackCount.textContent = stack.length;
  unusedCount.textContent = available.length;

  const score = computeScore();
  scoreValue.textContent = score;
  gameStatus.textContent = gameOver ? 'Finished' : (condition === '' ? 'Pick a change condition' : 'Choose a tile');
  nextChoiceTitle.textContent = gameOver ? 'Game Over' : 'Next choice';
}

function calculateScore(elapsedSeconds, objectsInStack) {
  if (elapsedSeconds < 4) {
    return 0;
  }
  const raw = (1.0 / elapsedSeconds) * Math.pow(objectsInStack, 4) * 200;
  return Math.round(raw);
}

function computeScore() {
  if (gameOver) {
    return finalScore;
  }
  const elapsed = startTime ? Math.max((Date.now() - startTime) / 1000, 0) : 0;
  return calculateScore(elapsed, stack.length);
}

function selectTile(tile) {
  if (gameOver) return;
  if (!available.includes(tile)) return;
  if (condition !== '*' && !getPossibleNextObjects(condition, available).includes(tile)) return;
  selectedTile = tile;
  addTile(tile);
}

function addTile(tile) {
  stack.push(tile);
  available = available.filter(item => item !== tile);
  selectedTile = null;
  if (!startTime) {
    startTime = Date.now();
    requestAnimationFrame(updateTime);
  }

  if (available.length === 0) {
    finishGame(true);
    return;
  }

  if (!hasPossibleNextMove(available)) {
    finishGame(false);
    return;
  }

  condition = '';
  render();
  nextMessage.textContent = 'Select the next change condition (f / s / c).';
  conditionButtons.forEach(btn => btn.disabled = false);
}

function chooseCondition(value) {
  if (gameOver) return;
  if (stack.length === 0) return;
  condition = value;
  const nextPossible = getPossibleNextObjects(condition, available);
  if (nextPossible.length === 0) {
    nextMessage.textContent = 'No valid tiles remain for this condition. Game over.';
    finishGame(false);
    return;
  }
  nextMessage.textContent = `Current top tile: ${stack[stack.length - 1]}. ${decodeTile(stack[stack.length - 1])}. Choose one of the highlighted tiles.`;
  render();
}

function finishGame(win) {
  gameOver = true;
  if (startTime) {
    finalElapsed = Math.round(((Date.now() - startTime) / 1000) * 100) / 100;
  } else {
    finalElapsed = 0;
  }
  finalScore = calculateScore(finalElapsed, stack.length);
  elapsedTime.textContent = finalElapsed.toFixed(2);
  endScreen.classList.remove('hidden');
  endTitle.textContent = win ? 'Congratulations!' : 'Game Over';
  endDescription.textContent = win
    ? 'You stacked all tiles successfully.'
    : 'No valid stack move remains.';
  evaluateFinalScore(win);
  render();
}

function evaluateFinalScore(win) {
  const duration = finalElapsed.toFixed(2);
  const objectsInStack = stack.length;
  const unusedObjects = available.length;
  const score = finalScore;
  const message = [];
  message.push(`Stacked ${objectsInStack} tiles, ${unusedObjects} left.`);
  message.push(`Duration: ${duration} seconds.`);
  message.push(`Score: ${score}.`);
  if (finalElapsed < 4) {
    message.push('No points awarded for games under 4 seconds.');
  }
  if (score > highscore.score) {
    message.push('New local highscore! Enter your name and save it.');
  }
  nextMessage.textContent = message.join(' ');
}

function render() {
  renderTiles();
  renderStack();
  updateControls();
}

function startGame() {
  available = [...tiles];
  stack = [];
  condition = '*';
  startTime = null;
  gameOver = false;
  selectedTile = null;
  finalElapsed = 0;
  finalScore = 0;
  endScreen.classList.add('hidden');
  highscorePanel.classList.add('hidden');
  saveScoreButton.textContent = 'Save Score';
  saveScoreButton.disabled = false;
  playerNameInput.value = '';
  elapsedTime.textContent = '0.00';
  nextMessage.textContent = 'Choose the first tile from all available tiles.';
  render();
}

conditionButtons.forEach(button => {
  button.addEventListener('click', () => {
    chooseCondition(button.dataset.condition);
  });
});

newGameButton.addEventListener('click', startGame);

saveScoreButton.addEventListener('click', () => {
  if (saveScoreButton.textContent === 'Show highscore') {
    renderHighscoreTable();
    highscorePanel.classList.toggle('hidden');
    return;
  }

  const name = playerNameInput.value.trim() || 'Anonymous';
  const score = computeScore();
  const entry = {
    name,
    score,
    date: new Date().toISOString(),
  };
  lastSavedEntry = entry;
  const saved = saveHighscore(entry);
  renderHighscoreTable();
  highscorePanel.classList.remove('hidden');
  saveScoreButton.textContent = 'Show highscore';
  saveScoreButton.disabled = true;

  if (saved) {
    endDescription.textContent = `Score saved for ${name}.`;
  } else {
    endDescription.textContent = 'Score saved. Not higher than the current highscore.';
  }
});

loadHighscore();
startGame();
