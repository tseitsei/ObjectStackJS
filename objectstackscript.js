const tiles = [
  's 1', 'S 1', 's 2', 'S 2', 's 3', 'S 3',
  'c 1', 'C 1', 'c 2', 'C 2', 'c 3', 'C 3',
  't 1', 'T 1', 't 2', 'T 2', 't 3', 'T 3'
];

const translations = {
  en: {
    title: "Object Stack JS",
    subtitle: "Build the stack by choosing tiles and change conditions. Try to stack all tiles!",
    bestScore: "Best score:",
    status: "Status:",
    readyToStart: "Ready to start",
    currentStack: "Current stack",
    noTilesYet: "No tiles yet.",
    availableTiles: "Available tiles",
    nextChoice: "Next choice",
    pressStart: "Press Start Game to begin.",
    form: "Form",
    size: "Size",
    color: "Color",
    gameSummary: "Game summary",
    tilesStacked: "Tiles stacked:",
    unusedTiles: "Unused tiles:",
    elapsedTime: "Elapsed time:",
    score: "Score:",
    startNewGame: "Start New Game",
    gameOver: "Game Over",
    enterName: "Enter your name to save the score:",
    yourName: "Your name",
    saveScore: "Save Score",
    top10: "Top 10 Highscores",
    rank: "#",
    name: "Name",
    score: "Score",
    date: "Date",
    finished: "Finished",
    pickCondition: "Pick a change condition",
    chooseTile: "Choose a tile",
    selectNextCondition: "Select the next change condition (f / s / c).",
    noValidTiles: "No valid tiles remain for this condition. Game over.",
    currentTopTile: "Current top tile: {tile}. {desc}. Choose one of the highlighted tiles.",
    congratulations: "Congratulations!",
    stackedAll: "You stacked all tiles successfully.",
    noValidMove: "No valid stack move remains.",
    stackedInfo: "Stacked {count} tiles, {unused} left.",
    duration: "Duration: {time} seconds.",
    scoreValue: "Score: {score}.",
    noPoints: "No points awarded for games under 4 seconds.",
    newHighscore: "New local highscore! Enter your name and save it.",
    chooseFirstTile: "Choose the first tile from all available tiles.",
    hideHighscore: "Hide highscore",
    showHighscore: "Show highscore",
    scoreSaved: "Score saved for {name}.",
    scoreSavedNotHigher: "Score saved. Not higher than the current highscore.",
    nobody: "Nobody",
    small: "A small",
    large: "A large",
    square: "square",
    circle: "circle",
    triangle: "triangle",
    red: "red",
    green: "green",
    blue: "blue",
    language: "Language",
    english: "English",
    finnish: "Suomi"
  },
  fi: {
    title: "Object Stack JS",
    subtitle: "Rakenna pino valitsemalla laattoja ja muuttamalla ehtoja. Yritä pinota kaikki laatat!",
    bestScore: "Paras tulos:",
    status: "Tila:",
    readyToStart: "Valmis aloittamaan",
    currentStack: "Nykyinen pino",
    noTilesYet: "Ei laattoja vielä.",
    availableTiles: "Saatavilla olevat laatat",
    nextChoice: "Seuraava valinta",
    pressStart: "Paina Aloita peli aloittaaksesi.",
    form: "Muoto",
    size: "Koko",
    color: "Väri",
    gameSummary: "Pelin yhteenveto",
    tilesStacked: "Pinotut laatat:",
    unusedTiles: "Käyttämättömät laatat:",
    elapsedTime: "Kulunut aika:",
    score: "Pisteet:",
    startNewGame: "Aloita uusi peli",
    gameOver: "Peli päättyi",
    enterName: "Syötä nimesi tallentaaksesi tuloksen:",
    yourName: "Nimesi",
    saveScore: "Tallenna tulos",
    top10: "Top 10 parhaat tulokset",
    rank: "#",
    name: "Nimi",
    score: "Pisteet",
    date: "Päivämäärä",
    finished: "Valmis",
    pickCondition: "Valitse muutosehto",
    chooseTile: "Valitse laatta",
    selectNextCondition: "Valitse seuraava muutosehto (m / k / v).",
    noValidTiles: "Tälle ehdolle ei ole kelvollisia laattoja jäljellä. Peli päättyi.",
    currentTopTile: "Nykyinen ylin laatta: {tile}. {desc}. Valitse yksi korostetuista laatoista.",
    congratulations: "Onnittelut!",
    stackedAll: "Pinosit kaikki laatat onnistuneesti.",
    noValidMove: "Ei kelvollista pinosiirtoa jäljellä.",
    stackedInfo: "Pinottu {count} laattaa, {unused} jäljellä.",
    duration: "Kesto: {time} sekuntia.",
    scoreValue: "Pisteet: {score}.",
    noPoints: "Ei pisteitä alle 4 sekunnin peleistä.",
    newHighscore: "Uusi paikallinen ennätys! Syötä nimesi ja tallenna se.",
    chooseFirstTile: "Valitse ensimmäinen laatta kaikista saatavilla olevista laatoista.",
    hideHighscore: "Piilota ennätykset",
    showHighscore: "Näytä ennätykset",
    scoreSaved: "Tulos tallennettu nimellä {name}.",
    scoreSavedNotHigher: "Tulos tallennettu. Ei korkeampi kuin nykyinen ennätys.",
    nobody: "Ei kukaan",
    small: "Pieni",
    large: "Suuri",
    square: "neliö",
    circle: "ympyrä",
    triangle: "kolmio",
    red: "punainen",
    green: "vihreä",
    blue: "sininen",
    language: "Kieli",
    english: "English",
    finnish: "Suomi"
  }
};

let currentLang = localStorage.getItem('objectstack-lang') || 'en';

function getText(key, params = {}) {
  let text = translations[currentLang][key] || key;
  for (const [param, value] of Object.entries(params)) {
    text = text.replace(`{${param}}`, value);
  }
  return text;
}

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
const langSelect = document.getElementById('lang-select');

let available = [];
let stack = [];
let condition = '*';
let startTime = null;
let timerId = null;
let gameOver = false;
let selectedTile = null;
let finalElapsed = 0;
let finalScore = 0;
let lastGameWin = false;
let endDescriptionKey = null;
let endDescriptionParams = {};
let scoreSavedAlready = false;
let highscore = { score: 0, name: 'Nobody' };
let highscores = [];
function updateLanguageTexts() {
  document.documentElement.lang = currentLang;
  document.title = getText('title');

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = getText(el.dataset.i18n);
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = getText(el.dataset.i18nPlaceholder);
  });

  // Update condition buttons
  conditionButtons[0].textContent = getText('form');
  conditionButtons[1].textContent = getText('size');
  conditionButtons[2].textContent = getText('color');

  // Keep save button label in sync with its current mode after language changes
  if (saveScoreButton.dataset.mode === 'save') {
    saveScoreButton.textContent = getText('saveScore');
  } else if (saveScoreButton.dataset.mode === 'hide') {
    saveScoreButton.textContent = getText('hideHighscore');
  } else if (saveScoreButton.dataset.mode === 'show') {
    saveScoreButton.textContent = getText('showHighscore');
  }
}

function decodeTile(object) {
  const letter = object[0];
  const digit = object[2];
  const size = letter === letter.toLowerCase() ? getText('small') : getText('large');
  const shape = getText(shapeNames[letter.toLowerCase()] || 'unknown shape');
  const color = getText(colorNames[digit] || 'unknown color');
  return `${size} ${color} ${shape}`;
}

function formatTileLabel(object) {
  return object;
}

function loadHighscore() {
  const stored = window.localStorage.getItem('objectstack-highscores');
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
    highscore = { name: getText('nobody'), score: 0 };
  }
  highscoreName.textContent = highscore.name;
  highscoreValue.textContent = highscore.score;
}

function saveHighscore(entry) {
  highscores.push(entry);
  highscores.sort((a, b) => b.score - a.score || new Date(a.date) - new Date(b.date));
  highscores = highscores.slice(0, 10);
  window.localStorage.setItem('objectstack-highscores', JSON.stringify(highscores));

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

function getShapeClass(letter) {
  const shapeLetter = letter.toLowerCase();
  if (shapeLetter === 's') return 'square';
  if (shapeLetter === 'c') return 'circle';
  if (shapeLetter === 't') return 'triangle';
  return 'square';
}

function getShapeColor(colorCode) {
  const colorMap = {
    '1': '#ff6b6b',
    '2': '#51cf66',
    '3': '#74c0fc',
  };
  return colorMap[colorCode] || '#f8fafc';
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
    item.title = decodeTile(tile);

    // Create shape element
    const shapeContainer = document.createElement('div');
    shapeContainer.style.display = 'flex';
    shapeContainer.style.flexDirection = 'column';
    shapeContainer.style.alignItems = 'center';
    shapeContainer.style.gap = '6px';

    const shapeLetter = tile[0];
    const shapeClass = getShapeClass(shapeLetter);
    const isLarge = shapeLetter === shapeLetter.toUpperCase();
    const colorCode = tile[2];
    const shapeColor = getShapeColor(colorCode);

    const shapeElement = document.createElement('div');
    shapeElement.className = `tile-shape ${shapeClass}${isLarge ? ' large' : ''}`;
    shapeElement.style.color = shapeColor;

    shapeContainer.appendChild(shapeElement);
    item.appendChild(shapeContainer);

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
    stackDisplay.textContent = getText('noTilesYet');
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
    tileElement.title = decodeTile(tile);

    const shapeContainer = document.createElement('div');
    shapeContainer.style.display = 'flex';
    shapeContainer.style.flexDirection = 'column';
    shapeContainer.style.alignItems = 'center';
    shapeContainer.style.gap = '6px';

    const shapeLetter = tile[0];
    const shapeClass = getShapeClass(shapeLetter);
    const isLarge = shapeLetter === shapeLetter.toUpperCase();
    const colorCode = tile[2];
    const shapeColor = getShapeColor(colorCode);

    const shapeElement = document.createElement('div');
    shapeElement.className = `tile-shape ${shapeClass}${isLarge ? ' large' : ''}`;
    shapeElement.style.color = shapeColor;

    shapeContainer.appendChild(shapeElement);
    tileElement.appendChild(shapeContainer);

    const colorCode2 = tile[2];
    tileElement.style.backgroundColor = tileColorMap[colorCode2] || 'rgba(255, 255, 255, 0.08)';
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
  gameStatus.textContent = gameOver ? getText('finished') : (condition === '' ? getText('pickCondition') : getText('chooseTile'));
  nextChoiceTitle.textContent = gameOver ? getText('gameOver') : getText('nextChoice');
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
  nextMessage.textContent = getText('selectNextCondition');
  conditionButtons.forEach(btn => btn.disabled = false);
}

function chooseCondition(value) {
  if (gameOver) return;
  if (stack.length === 0) return;
  condition = value;
  const nextPossible = getPossibleNextObjects(condition, available);
  if (nextPossible.length === 0) {
    nextMessage.textContent = getText('noValidTiles');
    finishGame(false);
    return;
  }
  const topTile = stack[stack.length - 1];
  nextMessage.textContent = getText('currentTopTile', { tile: topTile, desc: decodeTile(topTile) });
  render();
}

function finishGame(win) {
  gameOver = true;
  lastGameWin = win;
  endDescriptionKey = win ? 'stackedAll' : 'noValidMove';
  endDescriptionParams = {};

  if (startTime) {
    finalElapsed = Math.round(((Date.now() - startTime) / 1000) * 100) / 100;
  } else {
    finalElapsed = 0;
  }
  finalScore = calculateScore(finalElapsed, stack.length);
  elapsedTime.textContent = finalElapsed.toFixed(2);
  endScreen.classList.remove('hidden');
  endTitle.textContent = win ? getText('congratulations') : getText('gameOver');
  endDescription.textContent = getText(endDescriptionKey, endDescriptionParams);
  evaluateFinalScore(win);
  render();
}

function evaluateFinalScore(win) {
  const duration = finalElapsed.toFixed(2);
  const objectsInStack = stack.length;
  const unusedObjects = available.length;
  const score = finalScore;
  const message = [];
  message.push(getText('stackedInfo', { count: objectsInStack, unused: unusedObjects }));
  message.push(getText('duration', { time: duration }));
  message.push(getText('scoreValue', { score: score }));
  if (finalElapsed < 4) {
    message.push(getText('noPoints'));
  }
  if (score > highscore.score) {
    message.push(getText('newHighscore'));
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
  saveScoreButton.dataset.mode = 'save';
  saveScoreButton.textContent = getText('saveScore');
  saveScoreButton.disabled = false;
  scoreSavedAlready = false;
  playerNameInput.value = '';
  elapsedTime.textContent = '0.00';
  nextMessage.textContent = getText('chooseFirstTile');
  render();
}

conditionButtons.forEach(button => {
  button.addEventListener('click', () => {
    chooseCondition(button.dataset.condition);
  });
});

newGameButton.addEventListener('click', startGame);

saveScoreButton.addEventListener('click', () => {
  const currentMode = saveScoreButton.dataset.mode || 'save';
  if (currentMode === 'save') {
    if (scoreSavedAlready) {
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
    saveScoreButton.dataset.mode = 'hide';
    saveScoreButton.textContent = getText('hideHighscore');
    saveScoreButton.disabled = false;
    scoreSavedAlready = true;

    if (saved) {
      endDescriptionKey = 'scoreSaved';
      endDescriptionParams = { name };
      endDescription.textContent = getText(endDescriptionKey, endDescriptionParams);
    } else {
      endDescriptionKey = 'scoreSavedNotHigher';
      endDescriptionParams = {};
      endDescription.textContent = getText(endDescriptionKey, endDescriptionParams);
    }
  } else if (currentMode === 'hide') {
    highscorePanel.classList.add('hidden');
    saveScoreButton.dataset.mode = 'show';
    saveScoreButton.textContent = getText('showHighscore');
  } else if (currentMode === 'show') {
    highscorePanel.classList.remove('hidden');
    saveScoreButton.dataset.mode = 'hide';
    saveScoreButton.textContent = getText('hideHighscore');
  }
});

langSelect.addEventListener('change', () => {
  currentLang = langSelect.value;
  localStorage.setItem('objectstack-lang', currentLang);
  updateLanguageTexts();
  // Update default highscore name if no highscores
  if (highscores.length === 0) {
    highscore.name = getText('nobody');
    highscoreName.textContent = highscore.name;
  }
  // Re-render to update dynamic texts
  render();
  if (gameOver) {
    endTitle.textContent = lastGameWin ? getText('congratulations') : getText('gameOver');
    if (endDescriptionKey) {
      endDescription.textContent = getText(endDescriptionKey, endDescriptionParams);
    }
    evaluateFinalScore(lastGameWin);
  }
});

loadHighscore();
langSelect.value = currentLang;
updateLanguageTexts();
// Show all tiles in ready state
available = [...tiles];
render();