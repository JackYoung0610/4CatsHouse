// inputLogic.js

import { gravity } from './constants.js';
import { gameStates, mainCat, background } from './gameState.js';
import { isInsideRectangle } from './utils.js';

import { init } from '../main.js';


//處理按下鍵盤
export function procKeyDown(ctx, canvas, event) {
    
    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    if (gameStates.gameState === 'start'){

        //清除最高分
        if (event.code === 'KeyC') {
            clearHighScore();
        } 

        if (event.code === 'Digit1') { mainCat.currentCatIndex = 0; }
        else if (event.code === 'Digit2') { mainCat.currentCatIndex = 1; }
        else if (event.code === 'Digit3') { mainCat.currentCatIndex = 2; }
        else if (event.code === 'Digit4') { mainCat.currentCatIndex = 3; }
        else if (event.code === 'Digit5') { mainCat.currentCatIndex = 4; }
        
        if (event.code === 'Space'){
            gamePlay();
        }
    } else if (gameStates.isGameOver){

         if (event.code === 'KeyR') {
            gameRePlay();
          }else if (event.code === 'KeyB') {
            gameToStart();
           }

    }else if (!selectedCat.isJumping && gameStates.gameState === 'playing') {

        if (event.code === 'Space') {
            mainCatStartJump();
        }

    }

}

//處理放開鍵盤
export function procKeyUp(ctx, canvas, event) {
    
    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    if (gameStates.gameState === 'start'){

        
    } else if (gameStates.isGameOver){

        

    }else if (gameStates.gameState === 'playing') {
        if (event.code === 'Space') {
            mainCatEndJump();
        }
    }

}

//處理點擊效果
export function procClick(ctx, canvas, x, y) {
    
    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    if (gameStates.gameState === 'start'){

        // 檢查是否點擊到小貓
        if (isClickInsideCat(ctx, canvas, x, y)) {
            cycleCat(); // 切換小貓
        } else {
            gamePlay(); // 未點擊小貓則進入遊戲
        }

    } else if (gameStates.isGameOver){

        // 檢查是否點擊到重新開始或回到主畫面按鈕
        if (isInsideRectangle(x, y, canvas.restartButtonArea)) {
            gameRePlay();
        } else if (isInsideRectangle(x, y, canvas.backToStartButtonArea)) {
            gameToStart();
        }

    }else if (!selectedCat.isJumping && gameStates.gameState === 'playing') {
        mainCatStartJump();
    }

}

//處理放開效果
export function procRelease (ctx, canvas, x, y) {

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

    if (gameStates.gameState === 'start'){
        
    } else if (gameStates.isGameOver){
        
    }else if (gameStates.gameState === 'playing') {
        mainCatEndJump();
    }

}

// 檢查是否點擊到小貓
 function isClickInsideCat(ctx, canvas, x, y) {

        const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
        // 計算小貓的中心點
        const padding = 10; // 擴大點擊範圍
        const catCenterX = canvas.width / 2;
        const catCenterY = canvas.height * 0.5;

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
function gameToStart() {
    if (gameStates.isGameOver) {
        gameStates.isGameOver = false;
        gameStates.gameState = 'start';
        init();
    }
}

//進入遊戲
function gamePlay() {
    gameStates.gameState = 'playing';

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
    selectedCat.y = background.floorY - selectedCat.height;

    startGameTimer(); // 開始計時器並記錄開始時間
}

//重新開始
function gameRePlay() {
    if (gameStates.isGameOver) {
        init(false);
        gameStates.isGameOver = false;
        gameStates.gameState = 'playing';
        startGameTimer(); // 重新開始計時器並記錄開始時間
    }
}

//開始計時
function startGameTimer() {
    gameStates.gameInterval = setInterval(() => {
        if (gameStates.gameState === 'playing' && !gameStates.isGameOver) {
            gameStates.timeLeft -= 1;
            if (gameStates.timeLeft <= 0) {
                gameStates.isGameOver = true;
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
    if (gameStates.gameState === 'start') {
        localStorage.setItem('highScore', 0);
        init();
        console.log('Debug: 歷史最高分已重置為 0 (按下 C)');
    }
}
