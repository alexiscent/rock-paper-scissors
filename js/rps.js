const CHOICES = ['rock', 'paper', 'scissors'];

CHOICES.forEach(initEvents);

function initEvents(name) {
  document.getElementById(name).addEventListener('click', playRound);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playRound(e) {
  let playerChoice = getPlayerChoice(e);
  let computerChoice = getComputerChoice();
  let winner = doesPlayerWin(playerChoice, computerChoice);
  changeScore(winner);
}

function getPlayerChoice(e) {
  return e.currentTarget.id;
}

function getComputerChoice() {
  let choice = Math.floor(Math.random() * CHOICES.length);
  choice = CHOICES[choice];
  return choice;
}

function doesPlayerWin(player, opponent) {
  // return null on draw
  if (player === opponent) {
    return null;
  }
  // win on positive odd or negative even
  let result = CHOICES.indexOf(player) - CHOICES.indexOf(opponent);
  if (result < 0) {
    result++;
  }
  result = Math.abs(result % 2) === 1;
  return result;
}

function changeScore(playerWin) {
  if (playerWin === null) {
    return;
  }
  let score = document.querySelector(`.${playerWin ? 'player' : 'opponent'} .score`);
  score.innerText = +score.innerText + 1;
}

