// WORDQUEST: TEMPERATURE CHALLENGE
// Basic version: Science category + 6-letter secret word

const secretWord = "energy";
const maxGuesses = 20;

let guessCount = 0;
let gameOver = false;

// Gets elements from the HTML page
const guessInput = document.getElementById("guess-input");
const submitButton = document.getElementById("submit-button");
const playAgainButton = document.getElementById("play-again-button");
const guessCountText = document.getElementById("guess-count");
const messageText = document.getElementById("message");
const temperatureText = document.getElementById("temperature-text");
const temperatureEmoji = document.getElementById("temperature-emoji");
const percentageText = document.getElementById("percentage-text");
const thermometerFill = document.getElementById("thermometer-fill");
const thermometerBulb = document.getElementById("thermometer-bulb");
const guessHistory = document.getElementById("guess-history");

// Removes extra spaces, changes the guess to lowercase,
// and allows only letters.
function cleanGuess(text) {
  return text.trim().toLowerCase().replace(/[^a-z]/g, "");
}

// Checks how close a guess is to the secret word.
// Correct letter in correct spot = 2 points
// Correct letter in wrong spot = 1 point
function getTemperature(guess, answer) {
  let points = 0;
  const usedAnswerLetters = new Array(answer.length).fill(false);

  // Checks letters in the correct position first
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      points += 2;
      usedAnswerLetters[i] = true;
    }
  }

  // Checks matching letters in a different position
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] !== answer[i]) {
      for (let j = 0; j < answer.length; j++) {
        if (guess[i] === answer[j] && !usedAnswerLetters[j]) {
          points += 1;
          usedAnswerLetters[j] = true;
          break;
        }
      }
    }
  }

  // Six letters x 2 points each = 12 maximum points
  return Math.round((points / 12) * 100);
}

// Decides the word and emoji for the temperature result
function getTemperatureLevel(percent) {
  if (percent <= 20) {
    return { name: "Cold", emoji: "❄️", color: "#2563eb" };
  }

  if (percent <= 40) {
    return { name: "Cool", emoji: "🧊", color: "#0ea5e9" };
  }

  if (percent <= 60) {
    return { name: "Warm", emoji: "🌤️", color: "#f59e0b" };
  }

  if (percent <= 80) {
    return { name: "Hot", emoji: "🔥", color: "#f97316" };
  }

  if (percent < 100) {
    return { name: "Very Hot", emoji: "🚨", color: "#dc2626" };
  }

  return { name: "Correct!", emoji: "✅", color: "#16a34a" };
}

// Updates the visual thermometer
function updateThermometer(percent) {
  const level = getTemperatureLevel(percent);

  thermometerFill.style.height = percent + "%";
  thermometerBulb.style.backgroundColor = level.color;
  temperatureEmoji.textContent = level.emoji;
  temperatureText.textContent = "Temperature: " + percent + "% — " + level.name;
  percentageText.textContent = percent + "% close";
}

// Adds a guess to the history section
function addToHistory(word, level) {
  const emptyHistory = document.querySelector(".empty-history");

  if (emptyHistory) {
    emptyHistory.remove();
  }

  const listItem = document.createElement("li");

  const wordSpan = document.createElement("span");
  wordSpan.classList.add("history-word");
  wordSpan.textContent = word.toUpperCase();

  const resultSpan = document.createElement("span");
  resultSpan.textContent = level.emoji + " " + level.name;
  resultSpan.style.color = level.color;

  listItem.appendChild(wordSpan);
  listItem.appendChild(resultSpan);

  guessHistory.prepend(listItem);
}

// Ends the game after a win or after 20 guesses
function endGame(message) {
  gameOver = true;
  messageText.textContent = message;
  submitButton.disabled = true;
  guessInput.disabled = true;
  playAgainButton.hidden = false;
}

// Runs when Submit Guess is clicked
function submitGuess() {
  if (gameOver) {
    return;
  }

  const originalGuess = guessInput.value.trim();
  const playerGuess = cleanGuess(originalGuess);

  // Validates empty input
  if (originalGuess === "") {
    messageText.textContent = "⚠️ Please type a word before submitting.";
    return;
  }

  // Validates letters only
  if (!/^[a-zA-Z]+$/.test(originalGuess)) {
    messageText.textContent = "⚠️ Use letters only — no numbers or symbols.";
    return;
  }

  // Validates the six-letter requirement
  if (playerGuess.length !== 6) {
    messageText.textContent = "⚠️ Your guess must have exactly 6 letters.";
    return;
  }

  // Counts a valid guess
  guessCount++;
  guessCountText.textContent = guessCount + " / " + maxGuesses;

  // Checks if the player guessed the word
  if (playerGuess === secretWord) {
    const correctLevel = getTemperatureLevel(100);

    updateThermometer(100);
    addToHistory(playerGuess, correctLevel);

    endGame(
      "🎉 Correct! You guessed ENERGY in " +
      guessCount +
      (guessCount === 1 ? " guess!" : " guesses!")
    );

    return;
  }

  // Calculates closeness for incorrect answers
  const temperature = getTemperature(playerGuess, secretWord);
  const level = getTemperatureLevel(temperature);

  updateThermometer(temperature);
  addToHistory(playerGuess, level);

  guessInput.value = "";

  // Answer is revealed only after 20 valid guesses
  if (guessCount >= maxGuesses) {
    endGame("🧪 You reached 20 guesses. The secret word was ENERGY.");
  } else {
    const guessesLeft = maxGuesses - guessCount;

    messageText.textContent =
      level.emoji +
      " " +
      level.name +
      "! You have " +
      guessesLeft +
      (guessesLeft === 1 ? " guess" : " guesses") +
      " left before the answer is revealed.";

    guessInput.focus();
  }
}

// Restarts the game
function restartGame() {
  guessCount = 0;
  gameOver = false;

  guessInput.value = "";
  guessInput.disabled = false;
  submitButton.disabled = false;
  playAgainButton.hidden = true;

  guessCountText.textContent = "0 / " + maxGuesses;
  messageText.textContent = "Type a 6-letter word to begin!";
  temperatureEmoji.textContent = "❄️";
  temperatureText.textContent = "Temperature: --";
  percentageText.textContent = "0% close";

  thermometerFill.style.height = "0%";
  thermometerBulb.style.backgroundColor = "#e2e8f0";

  guessHistory.innerHTML =
    '<li class="empty-history">Your guesses will appear here.</li>';

  guessInput.focus();
}

// Button clicks
submitButton.addEventListener("click", submitGuess);
playAgainButton.addEventListener("click", restartGame);

// Lets the player press Enter instead of clicking Submit Guess
guessInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    submitGuess();
  }
});

// Opens with the input ready
guessInput.focus();