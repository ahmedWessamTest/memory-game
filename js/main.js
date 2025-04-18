// // --------------- global ----------------
// let memoImages = [
//   "../images/Type=10.svg",
//   "../images/Type=20.svg",
//   "../images/Type=Big.svg",
//   "../images/Type=Fire.svg",
//   "../images/Type=Small.svg",
//   "../images/Type=Snow.svg",
//   "../images/Type=10.svg",
//   "../images/Type=20.svg",
//   "../images/Type=Big.svg",
//   "../images/Type=Fire.svg",
//   "../images/Type=Small.svg",
//   "../images/Type=Snow.svg",
// ];
// const maxToWin = 6;
// const progressEl = document.getElementById("progress");
// const winNumEl = document.getElementById("winNum");
// const cardsDoc = document.querySelectorAll(".game-content .memo-card");
// const allImages = document.querySelectorAll(".game-content .memo-card img");
// const starImg = "../images/star.svg";
// let turn = 1;
// let prevElement = "";
// let isLoad = false;
// let score = 0;
// // --------------- when start ----------------
// shuffle(memoImages);
// putMax(maxToWin);
// // --------------- Event ----------------
// cardsDoc.forEach((elem) => {
//   {
//     elem.addEventListener("click", (e) => {
//       openImg(e.currentTarget.childNodes[1]);
//     });
//   }
// });
// document.getElementById("againBtn").addEventListener("click", () => {
//   turn = 1;
//   prevElement = null;
//   score = 0;
//   allImages.forEach((e) => {
//     e.src = starImg;
//     animateCard(e.parentElement, "close");
//   });
//   checkProgress(0);
//   shuffle(memoImages);
//   modalToggle();
// });
// // --------------- functions ----------------
// function openImg(e) {
//   if (isLoad || e === prevElement) return;
//   for (let i = 0; i < cardsDoc.length; i++) {
//     if (e === allImages[i]) {
//       animateCard(e.parentElement);
//       allImages[i].src = memoImages[i];
//       if (turn == 1) {
//         prevElement = allImages[i];
//         turn++;
//         return;
//       }
//       if (turn === 2) {
//         checkUserWin(prevElement, allImages[i]);
//       }
//     }
//   }
// }
// function checkUserWin(prevEl, currentEl) {
//   if (prevEl.src === currentEl.src) {
//     turn = 1;
//     prevElement = null;
//     score++;
//     checkProgress(score);
//     if (score === 6) {
//       modalToggle();
//     }
//     return;
//   } else {
//     isLoad = true;
//     setTimeout(function () {
//       animateCard(currentEl.parentElement, "close");
//       animateCard(prevEl.parentElement, "close");
//       prevEl.src = starImg;
//       currentEl.src = starImg;
//       prevElement = null;
//       turn = 1;
//       isLoad = false;
//       return;
//     }, 1000);
//   }
// }
// function shuffle(arr) {
//   let currentIndex = arr.length;

//   while (currentIndex != 0) {
//     let randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;
//     [arr[currentIndex], arr[randomIndex]] = [
//       arr[randomIndex],
//       arr[currentIndex],
//     ];
//   }
// }
// function animateCard(elem, animationState) {
//   elem.style.transform = `rotateY(${animationState === "close" ? 0 : 360}deg)`;
// }
// function checkProgress(num) {
//   const calcWin = Math.floor((num * 100) / maxToWin);
//   progressEl.style.width = `${calcWin}%`;
//   winNumEl.innerText = num;
// }
// function putMax(max) {
//   const maxWinEls = document.querySelectorAll(".maxWin");
//   maxWinEls.forEach((elem) => {
//     elem.innerText = max;
//   });
// }
// function modalToggle() {
//   document.getElementById("winModal").classList.toggle("d-flex");
// }
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
