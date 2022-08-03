const CLASSIC = ['rock', 'paper', 'scissors'];
const LIZARD_SPOCK = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
let choices;
let gLock = false;

initGame(CLASSIC);
document.getElementById('mode').addEventListener('click', changeMode);

function changeMode() {
  const modeElement = document.getElementById('mode');
  if (choices === CLASSIC) {
    initGame(LIZARD_SPOCK);
    modeElement.innerText = 'Classic?';
  } else {
    initGame(CLASSIC);
    modeElement.innerText = '...lizard, spock?';
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function initGame(mode) {
  fillArea(mode);
  addEvents(mode);
}

function fillArea(mode) {
  choices = mode;
  const playField = document.getElementById('choices');
  const cards = [];
  for (let i = 0; i < choices.length; i++) {
    cards.push(createCard(choices[i]));
  }
  playField.replaceChildren(...cards);
}

function createCard(cardName) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.id = cardName;
  const image = document.createElement('img');
  image.alt = cardName;
  image.src = `img/${cardName}.svg`;
  const name = document.createElement('div');
  name.classList.add('name');
  name.innerText = capitalise(cardName);
  card.replaceChildren(image, name);
  return card;
}

function capitalise(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function addEvents(mode) {
  for (let i = 0; i < mode.length; i++) {
    let card = document.getElementById(mode[i]);
    card.addEventListener('click', playRound);
    card.addEventListener('mousemove', () => setSelection(mode[i], true, gLock));
    card.addEventListener('mouseleave', () => unsetSelection(gLock));
  }
}

async function playRound(e) {
  if (gLock) return;
  gLock = true;
  let playerChoice = getPlayerChoice(e);
  let computerChoice = getComputerChoice();
  setChoice(playerChoice, true);
  setSelection(playerChoice, true);
  setSelection(computerChoice);
  setChoice(computerChoice);
  let winner = doesPlayerWin(playerChoice, computerChoice);
  changeScore(winner);
  await declareWinner();
  unsetSelection();
  unsetChoice();
  gLock = false;
}

function getPlayerChoice(e) {
  return e.currentTarget.id;
}

function getComputerChoice() {
  let choice = Math.floor(Math.random() * choices.length);
  choice = choices[choice];
  return choice;
}

function doesPlayerWin(playerChoice, opponentChoice) {
  // return null on draw
  if (playerChoice === opponentChoice) return null;
  // win on positive odd or negative even
  let result = choices.indexOf(playerChoice) - choices.indexOf(opponentChoice);
  if (result < 0) result++;
  result = Math.abs(result % 2) === 1;
  return result;
}

function changeScore(playerWin) {
  if (playerWin === null) return;
  let score = document.querySelector(`.${playerWin ? 'player' : 'opponent'} .score`);
  score.innerText = +score.innerText + 1;
}

function setSelection(cardName, isPlayer = false, lock = false) {
  if (lock) return;
  const card = document.getElementById(cardName);
  card.classList.remove('other');
  card.classList.add('selected');
  if (isPlayer) {
    for (let i = 0; i < choices.length; i++) {
      setOther(choices[i]);
      setRelation(choices[i], cardName);
    }
  }
}

function setOther(cardName) {
  const card = document.getElementById(cardName);
  if (!card.classList.contains('selected')) {
    card.classList.add('other');
  }
}

function setRelation(cardName, mainCardName) {
  const card = document.getElementById(cardName);
  let relation = doesPlayerWin(mainCardName, cardName);
  if (relation === null) {
    card.classList.add('tie');
  } else if (relation) {
    card.classList.add('win');
  } else {
    card.classList.add('lose');
  }
}

function unsetSelection(lock = false) {
  if (lock) return;
  const SELECTION_CLASSES = ['selected', 'other', 'tie', 'win', 'lose'];
  choices.forEach((name) => document.getElementById(name).classList.remove(...SELECTION_CLASSES));
}

function setChoice(cardName, isPlayer = false) {
  const card = document.getElementById(cardName);
  const wrapper = document.createElement('div');
  const name = document.createElement('div');
  if (isPlayer) {
    wrapper.classList.add('player');
    name.innerText = 'You';
  } else {
    wrapper.classList.add('opponent');
    name.innerText = 'Computer';
  }
  name.classList.add('name');
  wrapper.appendChild(name)
  card.appendChild(wrapper);
}

function unsetChoice() {
  const player = document.querySelector('.card .player');
  if (player) player.remove();
  const opponent = document.querySelector('.card .opponent');
  if (opponent) opponent.remove();
}

async function declareWinner(waitTime = 2000) {
  const playerScore = document.querySelector('.player .score');
  const opponentScore = document.querySelector('.opponent .score');
  const announcement = document.getElementById('announcement');
  if (playerScore.innerText >= 5 || opponentScore.innerText >= 5) {
    const isPlayer = playerScore.innerText >= opponentScore.innerText;
    const name = document.querySelector('#announcement .name');
    name.innerText = isPlayer ? 'Player' : 'Computer';
    announcement.classList.add(isPlayer ? 'player' : 'opponent');
    announcement.classList.remove('hide');
    playerScore.innerText = 0;
    opponentScore.innerText = 0;
    waitTime += 1000;
  }
  await sleep(waitTime);
  announcement.classList.add('hide');
}