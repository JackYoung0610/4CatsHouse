// 4CatsHouse - main.js
// 版本號: 0.005
export const gameVersion = 'v 0.005'

import { gameStates, mainCat, background,  objects } from './js/gameState.js';
import { getHighScore,  calculateButtonArea } from './js/utils.js';
import { addEventListeners, removeEventListeners } from './js/eventHandlers.js';
import { drawGamePhase_StartScreen, drawGamePhase_GameScene, drawGamePhase_GameOver } from './js/drawing.js';
import { updateGameLogic, createObject } from './js/gameLogic.js';

export {  init };

/**
 * 獲取 canvas 元素並檢查其是否存在。
 * @type {HTMLCanvasElement}
 * @throws {Error} 如果找不到具有 id "gameCanvas" 的 canvas 元素。
 */
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
    throw new Error('Canvas element with id "gameCanvas" not found.');
}

/**
 * 獲取 canvas 的 2D 繪圖上下文。
 * @type {CanvasRenderingContext2D}
 * @throws {Error} 如果無法獲取 2D 繪圖上下文。
 */
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Failed to get 2D context for canvas.');
}


// 遊戲初始化
function init(resetSelectedCat = true) {
   
    
    // 設定 canvas 的寬度與高度
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight * 0.7;
    const floorHeight = canvas.height / 5;
    const floorY = canvas.height - floorHeight;

    // 初始化背景
    background.width = canvas.width * 2;
    background.x = 0;
    background.floorHeight = floorHeight;
    background.floorY = floorY;

    // 初始化分數與遊戲狀態
    gameStates.score = 0;
    gameStates.highScore = getHighScore();
    gameStates.timeLeft = 60;

    gameStates.isGameOver = false;
    gameStates.gameState = 'start';

    gameStates.gameStartTime = null;
    // 清除之前的 interval
    if (gameStates.gameInterval) {
        clearInterval(gameStates.gameInterval);
        gameStates.gameInterval = null;
    }

    // 初始化選擇的小貓
    if (resetSelectedCat) {
        mainCat.currentCatIndex = Math.floor(Math.random() * mainCat.allCats.length);
    }
    console.log('mainCat.currentCatIndex  : ', mainCat.allCats[mainCat.currentCatIndex]);


     //初始化物件表
    objects.push(createObject(ctx, canvas,'smallObstacle', objects, 100));
    objects.push(createObject(ctx, canvas,'mediumObstacle', objects, 100));
    //objects.push(createObject('largeObstacle', objects, 100));
    objects.push(createObject(ctx, canvas,'greenCan', objects, 100));
    objects.push(createObject(ctx, canvas,'blueCan', objects, 100));
    //objects.push(createObject('goldCan', objects, 100));

    // 設置事件監聽器
    addEventListeners(ctx, canvas);
}

//更新判斷與畫面
/**
 * 更新遊戲畫面與邏輯的主迴圈函式。
 * 根據遊戲狀態 (start, playing, gameOver) 執行相應的繪製與邏輯更新。
 * 使用 requestAnimationFrame 進行畫面更新。
 */
function update() {
    try {
        if (gameStates.gameState === 'start') {
            // 繪製開始畫面
            drawGamePhase_StartScreen(ctx, canvas);
        
            requestAnimationFrame(update);
            return;
        }

        // 檢查遊戲是否結束
        if (gameStates.isGameOver) {
            // 繪製背景與結算畫面
            drawGamePhase_GameOver(ctx, canvas);
        
            requestAnimationFrame(update);
            return;
        }

        // 更新遊戲邏輯
        updateGameLogic(ctx, canvas);

        // 繪製遊戲畫面
        drawGamePhase_GameScene(ctx, canvas);
    
        // 使用 requestAnimationFrame 繼續更新畫面
        requestAnimationFrame(update);

    } catch (error) {
        // 捕捉並記錄錯誤，提示使用者刷新頁面
        console.error('Error in game loop:', error);
        alert('An error occurred during the game. Please refresh the page to continue.');
    }
}

/**
 * 選擇並初始化控制的小貓。
 * @param {Object} selectedCat - 從 cats 陣列中選擇的小貓物件。
 * @param {number} floorY - 地板的 Y 座標，用於計算小貓的初始位置。
 */
function initSelectedCat(floorY=0) {

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    selectedCat.x = canvas.width * 0.3;
    selectedCat.y = floorY - (selectedCat.shape === 'circle' ? selectedCat.radius * 2 : selectedCat.height);
    selectedCat.velocityY = 0;
    selectedCat.isJumping = false;

}


// 監聽視窗大小改變事件
window.addEventListener('resize', handleResize);

function handleResize() {
    // 更新 canvas 的寬度與高度
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight * 0.7;

    // 更新地板高度與位置
    const floorHeight = canvas.height / 5;
    const floorY = canvas.height - floorHeight;
    background.floorHeight = floorHeight;
    background.floorY = floorY;

    // 更新背景寬度
    background.width = canvas.width * 2;

    // 更新貓咪的位置
    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
    selectedCat.x = canvas.width * selectedCat.x;
    selectedCat.y = floorY - (selectedCat.shape === 'circle' ? selectedCat.radius * 2 : selectedCat.height);

    // 更新結算畫面按鈕的位置
    if (canvas.restartButtonArea) {
        canvas.restartButtonArea = calculateButtonArea(ctx, canvas.width * 0.25, canvas.height * 0.8, '重新再用餐');

    }
    if (canvas.backToStartButtonArea) {
        canvas.backToStartButtonArea = calculateButtonArea(ctx, canvas.width * 0.75, canvas.height * 0.8, '回到主畫面');
    }
}

function cleanup() {
    removeEventListeners();
    // 其他清理邏輯
}

/**
 * 捕捉全域錯誤的處理函式。
 * @param {string} message - 錯誤訊息。
 * @param {string} source - 錯誤來源檔案的 URL。
 * @param {number} lineno - 錯誤發生的行號。
 * @param {number} colno - 錯誤發生的列號。
 * @param {Error} error - 錯誤物件。
 */
window.onerror = function (message, source, lineno, colno, error) {
    console.error('Global error caught:', {
        message,
        source,
        lineno,
        colno,
        error
    });
    alert('An unexpected error occurred. Please refresh the page to continue.');
};

init();
update();