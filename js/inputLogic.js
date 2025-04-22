// inputLogic.js

import { gravity } from './constants.js';
import { gameStates, mainCat, background } from './gameState.js';
import { setHighScore, isInsideRectangle } from './utils.js';

import { init_central } from '../main.js';


//處理按下鍵盤
export function procKeyDown(ctx, gameCanvas, event) {
    
    // 根據目前的遊戲階段執行不同的邏輯
    switch (gameStates.currentGameState) {
        case 'mainMenu':

            switch (event.code) {
                case 'KeyC':
                    // 清除最高分
                    clearHighScore();
                    break;
                case 'Space':
                    toPlaying();
                    break;

                case 'Digit1':
                case 'Digit2':
                case 'Digit3':
                case 'Digit4':
                case 'Digit5':
                    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
                    const digit =Math.max(Math.min(Math.abs(event.code.slice(5))-1, mainCat.allCats.length),0); 
                    mainCat.currentCatIndex = digit ;
                    break;
                default:
                    //nothing to do
                    break;
            }
            break;

        case 'playing':

            switch (event.code) {
                    case 'Space':
                        mainCatStartJump();
                        break;
                    default:
                        //nothing to do
                        break;
                }
            break;

        case 'gameOver':

            switch (event.code) {
                    case 'KeyR':
                        toPlaying();
                        break;
                    case 'KeyM':
                        toMainMenu();
                        break;
                    default:
                        //nothing to do
                        break;
                }
            break;

        default:
            console.warn('Unknown game state:', gameStates.currentGameState);
            break;
    }

}

//處理放開鍵盤
export function procKeyUp(ctx, gameCanvas, event) {
    
    // 根據目前的遊戲階段執行不同的邏輯
    switch (gameStates.currentGameState) {
        case 'mainMenu':

            break;

        case 'playing':
             switch (event.code) {
                case 'Space':
                    mainCatEndJump();
                    break;
                default:
                    //nothing to do
                    break;
            }
            break;

        case 'gameOver':

            break;

        default:
            console.warn('Unknown game state:', gameStates.currentGameState);
            break;
    }
  
}

//處理點擊效果
export function procClick(ctx, gameCanvas, x, y) {
    
    // 根據目前的遊戲階段執行不同的邏輯
    switch (gameStates.currentGameState) {
        case 'mainMenu':

            // 檢查是否點擊到小貓
            if (isClickInsideCat(ctx, gameCanvas, x, y)) {
                cycleCat(); // 切換小貓
            } else {
                toPlaying(); // 未點擊小貓則進入遊戲
            }

            break;

        case 'playing':
             
             mainCatStartJump();

            break;

        case 'gameOver':

            // 檢查是否點擊到重新開始或回到主畫面按鈕
            if (isInsideRectangle(x, y, gameCanvas.restartButtonArea)) {
                toPlaying();
            } else if (isInsideRectangle(x, y, gameCanvas.backToStartButtonArea)) {
                toMainMenu();
            }
            break;

        default:
            console.warn('Unknown game state:', gameStates.currentGameState);
            break;
    }

}

//處理放開點擊效果
export function procRelease (ctx, gameCanvas, x, y) {

    // 根據目前的遊戲階段執行不同的邏輯
    switch (gameStates.currentGameState) {
        case 'mainMenu':

            break;

        case 'playing':

            mainCatEndJump();

            break;

        case 'gameOver':

            break;

        default:
            console.warn('Unknown game state:', gameStates.currentGameState);
            break;
    }

}

//處理視窗大小變化
export function procWindowResize(){
    init_central( {bInitCanvas : true ,  bInitBackgroud : true, bInitMainCat : true});
}


// 檢查是否點擊到小貓
 function isClickInsideCat(ctx, gameCanvas, x, y) {

        const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
        // 計算小貓的中心點
        const padding = 10; // 擴大點擊範圍
        const catCenterX = gameCanvas.width / 2;
        const catCenterY = gameCanvas.height * 0.5;

        if (selectedCat.shape === 'rectangle') {
            return isInsideRectangle(x, y, {
                x: catCenterX - selectedCat.width / 2 - padding,
                y: catCenterY - selectedCat.height / 2 - padding,
                width: selectedCat.width + padding * 2,
                height: selectedCat.height + padding * 2
            });
        } else if (selectedCat.shape === 'circle') {
            const dx = x - catCenterX;
            const dy = y - catCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= selectedCat.radius + padding; // 擴大圓形點擊範圍
        }
        return false;
}

//變更小貓
function cycleCat() {

    mainCat.currentCatIndex = (mainCat.currentCatIndex + 1) % mainCat.allCats.length;

}

//回到主畫面
function toMainMenu() {

    init_central( {bInitAll : true , bRandSelectCat : true} );

}

//進入遊戲
function toPlaying() {

    init_central( {bInitAll : true} );
    gameStates.currentGameState = 'playing';
    startGameTimer(); // 開始計時器並記錄開始時間

}

//開始計時
function startGameTimer() {
    gameStates.gameInterval = setInterval(() => {
        if (gameStates.currentGameState === 'playing' && !gameStates.isGameOver) {
            gameStates.timeLeft -= 1;
            if (gameStates.timeLeft <= 0) {
                gameStates.isGameOver = true;
                gameStates.currentGameState = 'gameOver';;
                clearInterval(gameStates.gameInterval); // 時間結束時清除 interval
            }
        }
    }, 1000); // 每 1000 毫秒 (1 秒) 執行一次
    gameStates.gameStartTime = Date.now(); // 記錄遊戲開始的確切時間
}

//小貓起跳
 function mainCatStartJump() {

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    if (!selectedCat.isJumping) {
        selectedCat.isJumping = true;
        selectedCat.velocityY = -Math.sqrt(2 * gravity * selectedCat.jumpHeight); // 根據跳躍高度計算初速度
    }

}

//小貓落下
function mainCatEndJump() {

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    if (selectedCat.isJumping && selectedCat.velocityY < 0) {
        selectedCat.velocityY = 0;
    }

}

//將最高分清除為0
function clearHighScore() {

        setHighScore(0);
        init_central( {bInitGameStates : true });
        console.log('Debug: 歷史最高分已重置為 0 (按下 C)');

}
