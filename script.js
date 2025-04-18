// 4CatsHouse - script.js
// 版本號: 0.001

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 遊戲的基本設定
const gravity = 0.1;
const catSpeed = 5;
let baseGameSpeed = 2;
let gameSpeed = baseGameSpeed;
let score = 0;
let highScore = 0;
let timeLeft = 60;
let isGameOver = false;
let isSpaceKeyPressed = false;
let gameState = 'start';
let currentCatIndex = 0;
let selectedCatIndex = 0;
let gameInterval; // 用於儲存 setInterval 的 ID
let gameStartTime; // 記錄遊戲開始的時間

// 小貓的顏色陣列
const catColors = ['blue', 'orange', 'white', 'black', 'pink'];
const catNames = ['冰炫風', '醬太郎', '牛奶糖', '青草茶', '炸豬排'];

// 貓咪的初始狀態
const cat = { x: canvas.width * 0.3, y: 0, width: 30, height: 30, velocityY: 0, isJumping: false };

// 背景的初始狀態
const background = { x: 0, width: 0, floorHeight: 0, floorY: 0 };

// 障礙物的初始狀態
const obstacle = { width: 40, height: 30, x: 0, y: 0 };

// 貓罐罐的初始狀態
const can = { width: 20, height: 20, x: 0, y: 0 };

// 遊戲初始化
function init(resetSelectedCat = true) {
  highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
  canvas.width = window.innerWidth * 0.7;
  canvas.height = window.innerHeight * 0.7;
  const floorHeight = canvas.height / 5;
  const floorY = canvas.height - floorHeight;
  cat.y = floorY - cat.height;
  background.width = canvas.width * 2;
  background.x = 0;
  background.floorHeight = floorHeight;
  background.floorY = floorY;
  score = 0;
  timeLeft = 60;
  isGameOver = false;
  cat.velocityY = 0;
  cat.isJumping = false;
  isSpaceKeyPressed = false;
  gameSpeed = baseGameSpeed;
  gameState = 'start';
  cat.x = canvas.width * 0.3;
  gameStartTime = null; // 重置遊戲開始時間

  if (resetSelectedCat) {
    selectedCatIndex = Math.floor(Math.random() * catColors.length);
  }
  currentCatIndex = selectedCatIndex;

  obstacle.y = floorY - obstacle.height;
  can.y = floorY - can.height - 10;
  obstacle.x = canvas.width + 150;
  can.x = canvas.width + 350;

  // 清除之前的 interval (如果存在)
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

function startGameTimer() {
  gameInterval = setInterval(() => {
    if (gameState === 'playing' && !isGameOver) {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        isGameOver = true;
        clearInterval(gameInterval); // 時間結束時清除 interval
      }
    }
  }, 1000); // 每 1000 毫秒 (1 秒) 執行一次
  gameStartTime = Date.now(); // 記錄遊戲開始的確切時間
}

function drawCat() { ctx.fillStyle = catColors[currentCatIndex]; ctx.fillRect(cat.x, cat.y, cat.width, cat.height); }
function drawBackground() {
  ctx.fillStyle = 'lightgreen'; ctx.fillRect(background.x, 0, background.width, canvas.height);
  const floorHeight = canvas.height / 5; const floorY = canvas.height - floorHeight;
  ctx.fillStyle = 'dimgray'; ctx.fillRect(0, floorY, canvas.width, floorHeight);
  background.floorHeight = floorHeight; background.floorY = floorY;
}
function drawObstacle() { ctx.fillStyle = 'brown'; ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); }
function drawCan() { ctx.fillStyle = 'gold'; ctx.fillRect(can.x, can.y, can.width, can.height); }
function drawScoreAndTime() {
  ctx.fillStyle = 'black'; ctx.font = '16px sans-serif';
  ctx.fillText(`最高分: ${highScore}`, 10, 20); ctx.fillText(`分數: ${Math.floor(score)}`, 10, 40);
  const displayedTime = Math.max(0, timeLeft); // 顯示剩餘的整數秒數
  ctx.fillText(`時間: ${displayedTime}`, canvas.width - 80, 20);
}
function drawStartScreen() {
  ctx.fillStyle = 'lightblue'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'black'; ctx.font = '16px sans-serif'; ctx.textAlign = 'start';
  const currentHighScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
  ctx.fillText(`最高分: ${currentHighScore}`, 10, 20);
  ctx.font = '48px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('4CatsHouse', canvas.width / 2, canvas.height * 0.3);
  const catDisplayWidth = 50; const catDisplayHeight = 50; const catDisplayX = canvas.width / 2 - catDisplayWidth / 2;
  const catDisplayY = canvas.height * 0.5 - catDisplayHeight / 2; ctx.fillStyle = catColors[currentCatIndex];
  ctx.fillRect(catDisplayX, catDisplayY, catDisplayWidth, catDisplayHeight); ctx.strokeStyle = 'black'; ctx.lineWidth = 2;
  ctx.strokeRect(catDisplayX, catDisplayY, catDisplayWidth, catDisplayHeight);
  ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.strokeStyle = 'black'; ctx.lineWidth = 1;
  ctx.strokeText(catNames[currentCatIndex], catDisplayX + catDisplayWidth / 2, catDisplayY + catDisplayHeight / 2 + 7);
  ctx.fillStyle = 'white'; ctx.fillText(catNames[currentCatIndex], catDisplayX + catDisplayWidth / 2, catDisplayY + catDisplayHeight / 2 + 7);
  ctx.font = '24px sans-serif'; ctx.fillText('按下 空白鍵 開始用餐', canvas.width / 2, canvas.height * 0.7);
  ctx.font = '12px sans-serif'; ctx.fillText(' (Debug: 按 1-5 切換貓咪)', canvas.width / 2, canvas.height * 0.7 + 20);
  ctx.textAlign = 'start';
}
function drawGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.font = '24px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('用餐時間結束囉', canvas.width / 2, canvas.height / 2 - 80);
  ctx.font = '18px sans-serif'; ctx.fillText(`${catNames[currentCatIndex]} 得到的分數：${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 - 40);
  const previousHighScore = highScore; let congratsMessage = '';
  if ((Math.floor(score) < previousHighScore) || (Math.floor(score) === 0 && previousHighScore === 0)) { congratsMessage = '太可惜啦，再加油多吃一些罐罐吧！'; }
  else if (Math.floor(score) === previousHighScore && previousHighScore > 0) { congratsMessage = '哇，差那一個小罐罐就能創造歷史啦！'; }
  else if (Math.floor(score) > previousHighScore) { congratsMessage = `太棒啦，${catNames[currentCatIndex]} 果然是能創造奇蹟的！`;
    ctx.fillText(`全新的最高得分為：${Math.max(highScore, Math.floor(score))}`, canvas.width / 2, canvas.height / 2 + 80); localStorage.setItem('highScore', Math.max(highScore, Math.floor(score))); }
  ctx.fillText(`貓史上最高得分：${previousHighScore}`, canvas.width / 2, canvas.height / 2); ctx.fillText(congratsMessage, canvas.width / 2, canvas.height / 2 + 40);
  ctx.font = '16px sans-serif'; ctx.textAlign = 'start'; ctx.fillText('按下 R 重新再用餐', canvas.width * 0.25, canvas.height * 0.8);
  ctx.textAlign = 'end'; ctx.fillText('按下 B 回到主畫面', canvas.width * 0.75, canvas.height * 0.8); ctx.textAlign = 'start';
}

function update() {
  if (gameState === 'start') { drawStartScreen(); requestAnimationFrame(update); return; }
  if (isGameOver) { drawBackground(); drawGameOver(); requestAnimationFrame(update); return; }

  // 基於時間的緩慢加速 (每 10 秒增加 0.1 的速度)
  const elapsedTimeInSeconds = gameStartTime ? (Date.now() - gameStartTime) / 1000 : 0;
  const timeBasedSpeedIncrease = Math.floor(elapsedTimeInSeconds / 10) * 0.1;

  // 基於分數的少量加速
  const scoreBasedSpeedIncrease = score * 0.001;

  gameSpeed = baseGameSpeed + timeBasedSpeedIncrease + scoreBasedSpeedIncrease;

  background.x -= gameSpeed;
  if (background.x < -background.width / 2) { background.x = 0; }

  obstacle.x -= gameSpeed;
  if (obstacle.x < -obstacle.width) {
    let newObstacleX;
    do { newObstacleX = canvas.width + Math.random() * 200; } while (Math.abs(newObstacleX - can.x) < obstacle.width + can.width);
    obstacle.x = newObstacleX;
    obstacle.y = background.floorY - obstacle.height;
  }

  can.x -= gameSpeed;
  if (can.x < -can.width) {
    let newCanX;
    do { newCanX = canvas.width + Math.random() * 300; } while (Math.abs(newCanX - obstacle.x) < can.width + obstacle.width);
    can.x = newCanX;
    can.y = background.floorY - can.height - 10;
  }

  if (cat.isJumping) {
    const groundLevel = background.floorY - cat.height;
    const maxJumpHeight = 6 * cat.height;
    const targetY = groundLevel - maxJumpHeight;
    if (cat.velocityY < 0) { if (isSpaceKeyPressed && cat.y > targetY) { cat.y += cat.velocityY; } else { cat.velocityY = 0; } }
    if (cat.velocityY >= 0) { cat.velocityY += gravity; cat.y += cat.velocityY; }
    if (cat.y >= groundLevel) { cat.y = groundLevel; cat.isJumping = false; cat.velocityY = 0; }
  }

  if (
    cat.x < obstacle.x + obstacle.width && cat.x + cat.width > obstacle.x &&
    cat.y < obstacle.y + obstacle.height && cat.y + cat.height > obstacle.y
  ) {
    timeLeft -= 10;
    let newObstacleX;
    do { newObstacleX = canvas.width + Math.random() * 200; } while (Math.abs(newObstacleX - can.x) < obstacle.width + can.width);
    obstacle.x = newObstacleX;
  }

  if (
    cat.x < can.x + can.width && cat.x + cat.width > can.x &&
    cat.y < can.y + can.height && cat.y + cat.height > can.y
  ) {
    score += 10;
    let newCanX;
    do { newCanX = canvas.width + Math.random() * 300; } while (Math.abs(newCanX - obstacle.x) < can.width + obstacle.width);
    can.x = newCanX;
    can.y = background.floorY - can.height - 10;
  }

  drawBackground(); drawObstacle(); drawCan(); drawCat(); drawScoreAndTime();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    if (gameState === 'start') {
      gameState = 'playing';
      cat.y = background.floorY - cat.height;
      selectedCatIndex = currentCatIndex;
      startGameTimer(); // 開始計時器並記錄開始時間
    } else if (!cat.isJumping && gameState === 'playing') {
      cat.isJumping = true;
      cat.velocityY = -4;
      isSpaceKeyPressed = true;
    }
  } else if (event.code === 'KeyR') {
    if (isGameOver) {
      init(false);
      isGameOver = false;
      gameState = 'playing';
      startGameTimer(); // 重新開始計時器並記錄開始時間
    }
  } else if (event.code === 'KeyC') {
    if (gameState === 'start') {
      localStorage.setItem('highScore', 0);
      init();
      console.log('Debug: 歷史最高分已重置為 0 (按下 C)');
    }
  } else if (event.code === 'KeyB') {
    if (isGameOver) {
      isGameOver = false;
      gameState = 'start';
      init();
    }
  } else if (gameState === 'start') {
    if (event.code === 'Digit1') { currentCatIndex = 0; } else if (event.code === 'Digit2') { currentCatIndex = 1; }
    else if (event.code === 'Digit3') { currentCatIndex = 2; } else if (event.code === 'Digit4') { currentCatIndex = 3; }
    else if (event.code === 'Digit5') { currentCatIndex = 4; }
    selectedCatIndex = currentCatIndex;
  }
});

document.addEventListener('keyup', (event) => { if (event.code === 'Space') { isSpaceKeyPressed = false; if (cat.isJumping && cat.velocityY < 0) { cat.velocityY = 0; } } });

init();
update();