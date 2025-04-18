// --------------- constants ----------------
const CARD_IMAGES = [
  "../images/Type=10.svg",
  "../images/Type=20.svg",
  "../images/Type=Big.svg",
  "../images/Type=Fire.svg",
  "../images/Type=Small.svg",
  "../images/Type=Snow.svg",
];
const STAR_IMAGE = "../images/star.svg";
const MAX_PAIRS_TO_WIN = 6;
const FLIP_ANIMATION_DURATION = 1000;
// --------------- Game State ----------------
let gameState = {
  cardImages: [],
  flippedCards: [],
  matchedPairs: 0,
  isProcessing: false,
  firstCard: null,
  secondCard: null,
};
// --------------- Game State ----------------
const elements = {
  progress: document.getElementById("progress"),
  winNum: document.getElementById("winNum"),
  cards: document.querySelectorAll(".game-content .memo-card"),
  cardsImages: document.querySelectorAll(".game-content .memo-card img"),
  againBtn: document.getElementById("againBtn"),
  winModal: document.getElementById("winModal"),
};
// --------------- when start ----------------
initGame();
setupEventListeners();
// --------------- Event ----------------
elements.againBtn.addEventListener("click", () => {
  initGame();
  toggleModal();
});
// --------------- functions ----------------
function initGame() {
  gameState.cardImages = [...CARD_IMAGES, ...CARD_IMAGES];
  shuffleArray(gameState.cardImages);

  gameState.matchedPairs = 0;
  gameState.isProcessing = false;
  gameState.firstCard = null;
  gameState.secondCard = null;

  updateProgress(0);
  resetCards();
  setMaxPairsInUI(MAX_PAIRS_TO_WIN);
}
function resetCards() {
  elements.cardsImages.forEach((img) => {
    img.src = STAR_IMAGE;
    img.parentElement.style.transform = "rotateY(0deg)";
    img.parentElement.style.cursor = "pointer";
  });
}
function setupEventListeners() {
  elements.cards.forEach((card) => {
    card.addEventListener("click", () => {
      handleCardClick(card);
    });
  });
}
function resetTurn() {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.isProcessing = false;
}
// - game logic -
function handleCardClick(card) {
  if (
    gameState.isProcessing ||
    card === gameState.firstCard ||
    (card === card.style.cursor) === "auto"
  ) {
    return;
  }
  const cardImage = card.querySelector("img");
  const cardIndex = Array.from(elements.cards).indexOf(card);

  flipCard(card, gameState.cardImages[cardIndex]);

  if (!gameState.firstCard) {
    gameState.firstCard = card;
    return;
  }

  gameState.secondCard = card;
  gameState.isProcessing = true;

  const firstImg = gameState.firstCard.querySelector("img").src;
  const secondImg = gameState.secondCard.querySelector("img").src;

  if (firstImg === secondImg) {
    handleMatch();
  } else {
    handleMismatch();
  }
}
function handleMatch() {
  gameState.firstCard.style.cursor = "auto";
  gameState.secondCard.style.cursor = "auto";

  gameState.matchedPairs++;
  updateProgress(gameState.matchedPairs);

  if (gameState.matchedPairs === MAX_PAIRS_TO_WIN) {
    setTimeout(toggleModal, FLIP_ANIMATION_DURATION / 2);
  }
  resetTurn();
}
function handleMismatch() {
  setTimeout(() => {
    flipCard(gameState.firstCard, STAR_IMAGE);
    flipCard(gameState.secondCard, STAR_IMAGE);
    resetTurn();
  }, FLIP_ANIMATION_DURATION);
}
// - UI Updates -
function flipCard(card, newImageSrc) {
  const img = card.querySelector("img");
  img.src = newImageSrc;
  card.style.transform = `rotateY(${newImageSrc === STAR_IMAGE ? 0 : 360}deg)`;
}
function updateProgress(matchedPairs) {
  const progressPercent = Math.floor((matchedPairs * 100) / MAX_PAIRS_TO_WIN);
  elements.progress.style.width = `${progressPercent}%`;
  elements.winNum.textContent = matchedPairs;
}
function setMaxPairsInUI(maxPairs) {
  document.querySelectorAll(".maxWin").forEach((el) => {
    el.textContent = maxPairs;
  });
}
function toggleModal() {
  elements.winModal.classList.toggle("d-flex");
}
// - utility function -
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
