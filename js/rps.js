const VALID_CHOICES = ['rock', 'paper', 'scissors'];

function start_game() {
  let compChoice;
  let playerChoice;
  let winner;
  while (true) {
    playerChoice = getPlayerChoice();
    compChoice = getCompChoice();
    winner = getWinner(playerChoice, compChoice);
    declareWinner(winner);
  }
}

function getPlayerChoice() {
  let choice;
  const question = "Rock, paper or scissors?";
  while (!isValid(choice)) {
    choice = prompt(question);
    choice = parseChoice(choice);
  }
  console.log("You chose " + VALID_CHOICES[choice]);
  return choice;
}

function isValid(choice) {
  return choice >= 0 && VALID_CHOICES.length > choice;
}

function parseChoice(choice) {
  if (choice === null || choice === undefined || choice === "") {
    choice = -1;
  } else if (!isNaN(+choice)) {
    choice = +choice;
  } else {
    choice = choice.toLowerCase();
    choice = VALID_CHOICES.indexOf(choice);
  }
  return choice;
}

function getCompChoice() {
  let choice;
  choice = Math.floor(Math.random() * VALID_CHOICES.length);
  console.log("Computer chose " + VALID_CHOICES[choice]);
  return choice;
}

function getWinner(playerChoice, compChoice) {
  // Returns true if player wins, null on draw
  if (playerChoice === compChoice) {
    return null;
  } else if (playerChoice === 0 && compChoice === 2 || compChoice === 0 && playerChoice === 2) {
    return playerChoice < compChoice;
  } else {
    return playerChoice > compChoice;
  }
}

function declareWinner(winner) {
  if (winner === null) {
    console.log("Draw!");
  } else {
    winner = winner ? "Player" : "Computer";
    console.log(winner + " wins!");
  }
}
