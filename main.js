// 4CatsHouse - main.js
// 版本號: 0.005
export const gameVersion = 'v 0.011'

import { gameDisplay , objectTypes} from './js/constants.js';
import { gameStates, mainCat, background,  objects } from './js/gameState.js';
import { getHighScore,  calculateButtonArea } from './js/utils.js';
import { addEventListeners, removeEventListeners } from './js/eventHandlers.js';
import { drawGamePhase_StartScreen, drawGamePhase_GameScene, drawGamePhase_GameOver } from './js/drawing.js';
import { updateGameLogic, createObject } from './js/gameLogic.js';

export {  init_central };

/**
 * 獲取 gameCanvas 元素並檢查其是否存在。
 * @type {HTMLCanvasElement}
 * @throws {Error} 如果找不到具有 id "gameCanvas" 的 gameCanvas 元素。
 */
const gameCanvas = document.getElementById('gameCanvas');
if (!gameCanvas) {
    throw new Error('Canvas element with id "gameCanvas" not found.');
}

/**
 * 獲取 gameCanvas 的 2D 繪圖上下文。
 * @type {CanvasRenderingContext2D}
 * @throws {Error} 如果無法獲取 2D 繪圖上下文。
 */
const ctx = gameCanvas.getContext('2d');
if (!ctx) {
    throw new Error('Failed to get 2D context for gameCanvas.');
}


// 初始化 中央室
function init_central(options = {}) {
 
    const { bInitAll = false, 
                    // 初始化選項
                    bInitGameCanvas = false, 
                    
                    bInitGameStates = false,
                    
                    bInitBackgroud = false , 
                    
                    bInitMainCat = false, 
                    bRandSelectCat = false ,
                    bKeepMainCat = false,

                    bInitObjects = false,                
                    bKeepObjects = false,

                } = options;

    // 初始化畫布
    if (bInitAll || bInitGameCanvas){
        init_gameCanvas();
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
        init_mainCat( bRandSelectCat , {bKeepMainCat:bKeepMainCat});
    }
    // 初始化物件
     if (bInitAll || bInitObjects){
        init_objects( gameStates.gameLevel , {bKeepObjects:bKeepObjects} );
    }

}


// 初始化 遊戲畫布
function init_gameCanvas() {
    // 設定 gameCanvas 的寬度與高度
    gameCanvas.width = window.innerWidth * gameDisplay.resolutionScaleX;
    gameCanvas.height = window.innerHeight * gameDisplay.resolutionScaleY;

    // 設定 縮放倍率
    gameDisplay.scaleX = gameCanvas.width / gameDisplay.BASE_WIDTH;
    gameDisplay.scaleY = gameCanvas.height / gameDisplay.BASE_HEIGHT;
}

// 初始化 遊戲狀態
function init_gameStates() {

    // 初始化分數與遊戲狀態
    gameStates.score = 0;
    gameStates.highScore = getHighScore();
    gameStates.timeLeft = 60;

    gameStates.isGameOver = false;
    gameStates.currentGameState = 'mainMenu';

    gameStates.gameStartTime = null;
    // 清除之前的 interval
    if (gameStates.gameInterval) {
        clearInterval(gameStates.gameInterval);
        gameStates.gameInterval = null;
    }
}

// 初始化 背景
function init_background() {

    // 初始化背景
    background.width = gameCanvas.width * 2;
    background.x = 0;
    background.floorHeight = gameCanvas.height / 5;
    background.floorY = gameCanvas.height - background.floorHeight;

}

// 初始化 小貓
function init_mainCat(bRandSelectCat=false,option=[]) {

    const { bKeepMainCat = false } = option;

    // 亂數換小貓選擇的小貓
    if (bRandSelectCat) {
        mainCat.currentCatIndex = Math.floor(Math.random() * mainCat.allCats.length);
    }

    // 設定小貓的初始位置
    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    selectedCat.x = gameCanvas.width * 0.3;
    if (bKeepMainCat) {
        selectedCat.y = gameCanvas.height * selectedCat.currentYScalex;
    }else{
        selectedCat.y = background.floorY - (selectedCat.shape === 'circle' ? selectedCat.radius * Math.min(gameDisplay.scaleX, gameDisplay.scaleY) : selectedCat.height *gameDisplay.scaleY );
    }
    selectedCat.velocityY = 0;
    selectedCat.isJumping = false;

    //console.log('init_mainCat selectedCat)',selectedCat);
}

// 初始化 物件
function init_objects(gameLevel = 0, option=[]) {

    const { bKeepObjects = false } = option;

    if (bKeepObjects && objects.length > 0) {
        
        //保留物件 : 保留座標
        objects.forEach((object) => {
            const config = objectTypes[object.type];
            if (config && typeof config.generatePosition === 'function') {
                const newPosition = config.generatePosition(gameCanvas, background);
                object.x = gameCanvas.width *  object.currentXScalex;
                object.y = gameCanvas.height * object.currentYScalex;
            }
        });

    }else{

        //清空
        objects.length = 0;

        //初始化物件表
        objects.push(createObject(ctx, gameCanvas,'smallObstacle', objects,));
        objects.push(createObject(ctx, gameCanvas,'mediumObstacle', objects, ));
        objects.push(createObject(ctx, gameCanvas,'largeObstacle', objects, ));
        objects.push(createObject(ctx, gameCanvas,'greenCan', objects,));
        objects.push(createObject(ctx, gameCanvas,'blueCan', objects, ));
        objects.push(createObject(ctx, gameCanvas,'goldCan', objects, ));

    }
}

//更新判斷與畫面
/**
 * 更新遊戲畫面與邏輯的主迴圈函式。
 * 根據遊戲狀態 (start, playing, gameOver) 執行相應的繪製與邏輯更新。
 * 使用 requestAnimationFrame 進行畫面更新。
 */
function update() {
    try {
        // 根據目前的遊戲階段執行不同的邏輯
        switch (gameStates.currentGameState) {
            case 'mainMenu':

                drawGamePhase_StartScreen(ctx, gameCanvas);
    
                break;

            case 'playing':

                 // 更新遊戲邏輯
                updateGameLogic(ctx, gameCanvas);

                // 繪製遊戲畫面
                 drawGamePhase_GameScene(ctx, gameCanvas);

                break;

            case 'gameOver':

                // 繪製背景與結算畫面
                drawGamePhase_GameOver(ctx, gameCanvas);

                break;

            default:
                console.warn('Unknown game state:', gameStates.currentGameState);
        }

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
addEventListeners(ctx, gameCanvas);

update();

//移除事件監聽器
//removeEventListeners(ctx, gameCanvas);

