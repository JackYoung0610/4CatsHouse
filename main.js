// 4CatsHouse - main.js
// 版本號: 0.005
export const gameVersion = 'v 0.007'

import { resolutionScaleX, resolutionScaleY } from './js/constants.js';
import { gameStates, mainCat, background,  objects } from './js/gameState.js';
import { getHighScore,  calculateButtonArea } from './js/utils.js';
import { addEventListeners, removeEventListeners } from './js/eventHandlers.js';
import { drawGamePhase_StartScreen, drawGamePhase_GameScene, drawGamePhase_GameOver } from './js/drawing.js';
import { updateGameLogic, createObject } from './js/gameLogic.js';

export {  init_central };

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


// 初始化 中央室
function init_central(options = {}) {
 
    const { bInitAll = false, 
                    // 初始化選項
                    bInitCanvas = false, bInitGameStates = false,bInitBackgroud = false , bInitMainCat = false, bInitObjects = false,

                    bRandSelectCat = false 

                } = options;

    // 初始化畫布
    if (bInitAll || bInitCanvas){
        init_canvas();
    }
    // 初始化遊戲狀態
    if (bInitAll || bInitGameStates){
        init_gameStates();
    }
    // 初始化背景
    if (bInitAll || bInitBackgroud){
        init_background();
    }
    // 初始化小貓
    if (bInitAll || bInitMainCat){
        init_mainCat(bRandSelectCat);
    }
    // 初始化物件
     if (bInitAll || bInitObjects){
        init_objects();
    }

}


// 初始化 遊戲畫布
function init_canvas() {
    // 設定 canvas 的寬度與高度
    canvas.width = window.innerWidth * resolutionScaleX;
    canvas.height = window.innerHeight * resolutionScaleY;
}

// 初始化 遊戲狀態
function init_gameStates() {

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
}

// 初始化 背景
function init_background() {

    const floorHeight = canvas.height / 5;
    const floorY = canvas.height - floorHeight;

    // 初始化背景
    background.width = canvas.width * 2;
    background.x = 0;
    background.floorHeight = floorHeight;
    background.floorY = floorY;

}

// 初始化 小貓
function init_mainCat(bRandSelectCat=false) {

    // 亂數換小貓選擇的小貓
    if (bRandSelectCat) {
        mainCat.currentCatIndex = Math.floor(Math.random() * mainCat.allCats.length);
    }

    // 設定小貓的初始位置
    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    selectedCat.x = canvas.width * 0.3;
    selectedCat.y = background.floorY - (selectedCat.shape === 'circle' ? selectedCat.radius * 2 : selectedCat.height);
    selectedCat.velocityY = 0;
    selectedCat.isJumping = false;

}

// 初始化 物件
function init_objects(gameLevel = 0) {

    //清空
    objects.length = 0;

    //初始化物件表
    objects.push(createObject(ctx, canvas,'smallObstacle', objects, 100));
    objects.push(createObject(ctx, canvas,'mediumObstacle', objects, 100));
    objects.push(createObject(ctx, canvas,'largeObstacle', objects, 100));
    objects.push(createObject(ctx, canvas,'greenCan', objects, 100));
    objects.push(createObject(ctx, canvas,'blueCan', objects, 100));
    objects.push(createObject(ctx, canvas,'goldCan', objects, 100));

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


//初始化
init_central( {bInitAll : true , bRandSelectCat : true});

// 設置事件監聽器
addEventListeners(ctx, canvas);

update();

//移除事件監聽器
//removeEventListeners(ctx, canvas);

