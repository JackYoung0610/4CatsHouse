// gameState.js

import { gameDisplay } from './constants.js';

// 管理遊戲的全域狀態與變數

export const gameStates = {
    // 分數相關
    score : 0,
    highScore : 0,
    timeLeft : 60,

    gameLevel : 0,

    gameInterval:null, // 用於儲存 setInterval 的 ID
    gameStartTime:null , // 用於儲存遊戲開始的時間
    gameEndTime:null , // 用於儲存遊戲結束的時間
    gameTime : 0, // 遊戲時間

    // 遊戲狀態
    isGameOver : false,
    currentGameState :  'mainMenu' // 'mainMenu', 'playing', 'gameOver'
};

// 貓咪角色資料
export const mainCat = { currentCatIndex : 0,  
    currentCat : [],
    allCats :[
        { name: '冰炫風',      fillColor: 'rgba(51, 149, 255, 1)',     strokeColor:'white',    width: 120  ,  height: 80  ,       radius: 0,      shape: 'rectangle' ,    isJumping: false,     jumpHeight: 450,      catGravity:0,    velocityY:0,       x:  0.3,    y: 0, currentYScalex : 0},
        { name: '醬太郎',      fillColor: 'rgba(255, 150, 33, 1)',     strokeColor:'white',    width: 35,  height: 35,       radius: 60,     shape: 'circle',               isJumping: false,     jumpHeight: 480,       catGravity:0.15,     velocityY:0,      x:  0.3,    y: 0, currentYScalex : 0},
        { name: '牛奶糖',      fillColor: 'rgba(255, 255, 255, 1)',    strokeColor:'black',     width: 150, height: 100,       radius: 0,     shape: 'rectangle',     isJumping: false,      jumpHeight: 500,      catGravity:0.04,       velocityY:0,        x:  0.3,     y: 0, currentYScalex : 0},
        { name: '青草茶',      fillColor: 'rgba(0, 0, 0, 1)',                  strokeColor:'white',    width: 100,  height: 160,       radius: 0,     shape: 'rectangle',     isJumping: false,      jumpHeight: 550,      catGravity:0.09,     velocityY:0,        x:  0.3,     y: 0, currentYScalex : 0},
        { name: '炸豬排',      fillColor: 'rgba(251, 135, 210, 1)',    strokeColor:'white',    width: 30,  height: 30,       radius: 40,     shape: 'circle',                isJumping: false,     jumpHeight: 400,       catGravity:0.02,    velocityY:0,        x:  0.3,     y: 0,currentYScalex : 0 }
    ],
}

// 背景的狀態
export const background = {
    x: 0,
    width: 0,
    floorHeight: 0,
    floorY: 0
};

// 遊戲物件列表
export const objects = [];
