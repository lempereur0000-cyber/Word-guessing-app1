const secretWord = "energy";
const maxGuesses = 20;

let guessCount = 0;
let gameOver = false;

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

function getTemperatureLevel(percent) {
  if (percent <= 20) {
    return {
      name: "Cold",
      emoji: "❄️",
      color: "#2563eb"
    };
  } else if (percent <= 40) {
    return {
      name: "Cool",
      emoji: "🧊",
      color: "#0ea5e9"
    };
  } else if (percent <= 60) {
    return {
      name: "Warm",
      emoji: "🌤️",
      color: "#f59e0b"
    };
  } else if (percent <= 80) {
    return {
      name: "Hot",
      emoji: "🔥",
      color: "#f97316"
    };
  } else {
    return {
      name: "Very Hot",
      emoji: "🚨",
      color: "#dc2626"
    };
  }
}

function getTemperature(guess, answer) {
  let points = 0;

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      points = points + 2;
    } else if (answer.includes(guess[i])) {
      points = points + 1;
    }
  }

  return Math.round((points / 12) * 100);
}

function updateThermometer(percent) {
  const level = getTemperatureLevel(percent);

  thermometerFill.style.height = percent + "%";
  thermometerBulb.style.backgroundColor = level.color;

  temperatureEmoji.textContent = level.emoji;
  temperatureText.textContent =
    "Temperature: " + percent + "% — " + level.name;

  percentageText.textContent = percent + "% close";
}

function addToHistory(word, percent) {
  const level = getTemperatureLevel(percent);

  const emptyHistory = document.querySelector(".empty-history");

  if (emptyHistory) {
    emptyHistory.remove();
  }

  const listItem = document.createElement("li");
  listItem.innerHTML =
    "<span>" + word.toUpperCase() + "</span>" +
    "<span style='color:" + level.color + "'>" +
    level.emoji + " " + level.name +
    "</span>";

  guessHistory.prepend(listItem);
}

function submitGuess() {
  if (gameOver) {
    return;
  }

  const playerGuess = guessInput.value.trim().toLowerCase();

  if (playerGuess === "") {
    messageText.textContent = "⚠️ Please type a word first.";
    return;
  }

  if (!/^[a-zA-Z]+$/.test(playerGuess)) {
    messageText.textContent = "⚠️ Use letters only.";
    return;
  }

  if (playerGuess.length !== 6) {
    messageText.textContent = "⚠️ Your guess must have exactly 6 letters.";
    return;
  }

  guessCount = guessCount + 1;
  guessCountText.textContent = guessCount + " / " + maxGuesses;

  if (playerGuess === secretWord) {
    updateThermometer(100);

    const correctItem = document.createElement("li");
    correctItem.innerHTML =
      "<span>ENERGY</span><span style='color:#16a34a'>✅ Correct!</span>";
    guessHistory.prepend(correctItem);

    messageText.textContent =
      "🎉 You got it! The secret word was ENERGY.";

    gameOver = true;
    submitButton.disabled = true;
    guessInput.disabled = true;
    playAgainButton.hidden = false;

    return;
  }

  const temperature = getTemperature(playerGuess, secretWord);

  updateThermometer(temperature);
  addToHistory(playerGuess, temperature);

  guessInput.value = "";

  if (guessCount === maxGuesses) {
    messageText.textContent =
      "🧪 You reached 20 guesses. The secret word was ENERGY.";

    gameOver = true;
    submitButton.disabled = true;
    guessInput.disabled = true;
    playAgainButton.hidden = false;
  } else {
    messageText.textContent =
      "Keep trying! You have " +
      (maxGuesses - guessCount) +
      " guesses left.";
  }
}

function restartGame() {
  guessCount = 0;
  gameOver = false;

  guessInput.value = "";
  guessInput.disabled = false;
  submitButton.disabled = false;
  playAgainButton.hidden = true;

  guessCountText.textContent = "0 / 20";
  messageText.textContent = "Type a 6-letter word to begin!";
  temperatureEmoji.textContent = "❄️";
  temperatureText.textContent = "Temperature: --";
  percentageText.textContent = "0% close";

  thermometerFill.style.height = "0%";
  thermometerBulb.style.backgroundColor = "#e2e8f0";

  guessHistory.innerHTML =
    '<li class="empty-history">Your guesses will appear here.</li>';
}

submitButton.addEventListener("click", submitGuess);

playAgainButton.addEventListener("click", restartGame);

guessInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    submitGuess();
  }
});