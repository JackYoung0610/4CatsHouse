// gameState.js
// 管理遊戲的全域狀態與變數

export const gameStates = {
    // 分數相關
    score : 0,
    highScore : 0,
    timeLeft : 60,

    gameInterval:null, // 用於儲存 setInterval 的 ID
    gameStartTime:null , // 用於儲存遊戲開始的時間
    gameEndTime:null , // 用於儲存遊戲結束的時間
    gameTime : 0, // 遊戲時間

    // 遊戲狀態
    isGameOver : false,
    gameState :  'start' // 'start', 'playing', 'gameOver'
};

// 貓咪角色資料
export const mainCat = { currentCatIndex : 0,  allCats :[
    { name: '冰炫風',      fillColor: 'blue',          strokeColor:'white',    width: 30,  height: 30,       radius: 20,      shape: 'rectangle' ,    isJumping: false,     jumpHeight: 180,      velocityY:0,       x:  0.3,    y: 0,},
    { name: '醬太郎',      fillColor: 'orange',     strokeColor:'white',    width: 35,  height: 35,       radius: 25,     shape: 'circle',               isJumping: false,     jumpHeight: 200,       velocityY:0,      x:  0.3,    y: 0,},
    { name: '牛奶糖',      fillColor: 'white',         strokeColor:'black',     width: 35, height: 35,       radius: 20,     shape: 'rectangle',     isJumping: false,      jumpHeight: 160,      velocityY:0,        x:  0.3,     y: 0,},
    { name: '青草茶',      fillColor: 'black',         strokeColor:'white',    width: 40,  height: 30,       radius: 20,     shape: 'rectangle',     isJumping: false,      jumpHeight: 190,      velocityY:0,        x:  0.3,     y: 0,},
    { name: '炸豬排',      fillColor: 'pink',          strokeColor:'white',    width: 30,  height: 30,       radius: 15,     shape: 'circle',                isJumping: false,     jumpHeight: 150,       velocityY:0,        x:  0.3,     y: 0, }
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
