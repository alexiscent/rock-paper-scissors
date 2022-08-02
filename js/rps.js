const CHOICES = ['rock', 'paper', 'scissors'];

CHOICES.forEach(initEvents);

function initEvents(name) {
  document.getElementById(name).addEventListener('click', playRound);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playRound(e) {
  let playerChoice = getPlayerChoice(e);
  let computerChoice = getComputerChoice();
  setChoice(playerChoice, true);
  setSelection(playerChoice, true);
  setSelection(computerChoice);
  setChoice(computerChoice);
  let winner = doesPlayerWin(playerChoice, computerChoice);
  changeScore(winner);
  await sleep(2000);
  unsetSelection();
  unsetChoice();
}

function getPlayerChoice(e) {
  return e.currentTarget.id;
}

function getComputerChoice() {
  let choice = Math.floor(Math.random() * CHOICES.length);
  choice = CHOICES[choice];
  return choice;
}

function doesPlayerWin(playerChoice, opponentChoice) {
  // return null on draw
  if (playerChoice === opponentChoice) return null;
  // win on positive odd or negative even
  let result = CHOICES.indexOf(playerChoice) - CHOICES.indexOf(opponentChoice);
  if (result < 0) result++;
  result = Math.abs(result % 2) === 1;
  return result;
}

function changeScore(playerWin) {
  if (playerWin === null) return;
  let score = document.querySelector(`.${playerWin ? 'player' : 'opponent'} .score`);
  score.innerText = +score.innerText + 1;
}

function setSelection(cardName, isPlayer = false) {
  const card = document.getElementById(cardName);
  card.classList.remove('other');
  card.classList.add('selected');
  if (isPlayer) {
    for (let i = 0; i < CHOICES.length; i++) {
      setOther(CHOICES[i]);
      setRelation(CHOICES[i], cardName);
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

function unsetSelection() {
  const SELECTION_CLASSES = ['selected', 'other', 'tie', 'win', 'lose'];
  CHOICES.forEach((name) => document.getElementById(name).classList.remove(...SELECTION_CLASSES));
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
