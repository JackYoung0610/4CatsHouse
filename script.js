// 4CatsHouse - script.js
// 版本號: 0.002

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

// 文字常用樣式定義
const STYLES = {
    text: {
        StartScreenMainTitle: { font: '48px sans-serif', color: 'black', textAlign: 'center' },
        StartScreenButton: { font: '24px sans-serif', color: 'black', textAlign: 'center' },
        StartScreenStatus: { font: '20px sans-serif', color: 'black', textAlign: 'start' },
        //StartScreenMessage: { font: '32px sans-serif', color: 'white', textAlign: 'center' }

        //GameScreenMainTitle: { font: '48px sans-serif', color: 'black', textAlign: 'center' },
        //GameScreenButton: { font: '24px sans-serif', color: 'white', textAlign: 'center' },
        GameScreenStatus: { font: '20px sans-serif', color: 'black', textAlign: 'start' },
        //GameScreenMessage: { font: '32px sans-serif', color: 'white', textAlign: 'center' }

        //GameOverScreenMainTitle: { font: '48px sans-serif', color: 'black', textAlign: 'center' },
        GameOverScreenButton: { font: '24px sans-serif', color: 'white', textAlign: 'center' },
        //GameOverScreenStatus: { font: '16px sans-serif', color: 'black', textAlign: 'start' },
        GameOverScreenMessage: { font: '32px sans-serif', color: 'white', textAlign: 'center' }
    }
};

// 小貓的顏色陣列
const catColors = ['blue', 'orange', 'white', 'black', 'pink'];
const catNames = ['冰炫風', '醬太郎', '牛奶糖', '青草茶', '炸豬排'];

// 貓咪的初始狀態
const cat = { x: canvas.width * 0.3, y: 0, width: 30, height: 30, velocityY: 0, isJumping: false };

// 背景的初始狀態
const background = { x: 0, width: 0, floorHeight: 0, floorY: 0 };

//定義物件 障礙物與貓罐罐的屬性
const objectTypes = {
    //障礙物
    smallObstacle: {
        effect: 'subtractTime',
        value: 10,
        width: 60,
        height: 30,
        color: 'black', // 小障礙物顏色
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 30 // 貼齊地面
        })
    },
    mediumObstacle: {
        effect: 'subtractTime',
        value: 10,
        width: 50,
        height: 50,
        color: 'darkred', // 中障礙物顏色
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 50 // 貼齊地面
        })
    },
    largeObstacle: {
        effect: 'subtractTime',
        value: 10,
        width: 80,
        height: 80,
        color: 'brown', // 大障礙物顏色
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 80 // 貼齊地面
        })
    },

    //貓罐罐
    greenCan: {
        effect: 'addScore',
        value: 5,
        width: 20,
        height: 20,
        color: 'green', // 綠色罐罐顏色
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 20 //貼齊地面
        })
    },
    blueCan: {
        effect: 'addScore',
        value: 10,
        width: 20,
        height: 20,
        color: 'blue', // 藍色罐罐顏色
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 20 - 40 // 稍微高於地面
        })
    },
    goldCan: {
        effect: 'addTime',
        value: 5,
        width: 20,
        height: 20,
        color: 'gold', // 金色罐罐顏色
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 20 - 10 // 稍微高於地面
        })
    }
};

//初始化物件表
let objects = [];
objects.push(createObject('smallObstacle', objects, 100));
//objects.push(createObject('mediumObstacle', objects, 100));
//objects.push(createObject('largeObstacle', objects, 100));
objects.push(createObject('greenCan', objects, 100));
objects.push(createObject('blueCan', objects, 100));
//objects.push(createObject('goldCan', objects, 100));


// 遊戲初始化
function init(resetSelectedCat = true) {
    highScore = getHighScore();

    /**
     * 設定 canvas 的寬度與高度，並初始化地板與背景的相關屬性。
     */
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight * 0.7;
    const floorHeight = canvas.height / 5; // 地板的高度
    const floorY = canvas.height - floorHeight; // 地板的 Y 座標
    cat.y = floorY - cat.height; // 設定貓咪的初始 Y 座標
    background.width = canvas.width * 2; // 背景的寬度
    background.x = 0; // 背景的初始 X 座標
    background.floorHeight = floorHeight; // 設定背景的地板高度
    background.floorY = floorY; // 設定背景的地板 Y 座標

    /**
     * 初始化遊戲的分數、時間與狀態。
     */
    score = 0; // 分數初始化為 0
    timeLeft = 60; // 遊戲剩餘時間初始化為 60 秒
    isGameOver = false; // 遊戲是否結束的狀態
    cat.velocityY = 0; // 貓咪的垂直速度初始化為 0
    cat.isJumping = false; // 貓咪是否正在跳躍的狀態
    isSpaceKeyPressed = false; // 空白鍵是否被按下的狀態
    gameSpeed = baseGameSpeed; // 遊戲速度初始化為基礎速度
    gameState = 'start'; // 遊戲狀態初始化為 "start"
    cat.x = canvas.width * 0.3; // 設定貓咪的初始 X 座標
    gameStartTime = null; // 重置遊戲開始時間

    if (resetSelectedCat) {
        selectedCatIndex = Math.floor(Math.random() * catColors.length);
    }
    currentCatIndex = selectedCatIndex;

    // 清除之前的 interval (如果存在)
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    // 設置事件監聽器
    setupEventListeners();
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

//繪製主角貓咪
function drawCat() {
    drawRectangle(cat.x, cat.y, cat.width, cat.height, { fillColor: catColors[currentCatIndex] });
}

//繪製背景
function drawBackground() {
    drawRectangle(background.x, 0, background.width, canvas.height, { fillColor: 'lightgreen' });
    const floorHeight = canvas.height / 5;
    const floorY = canvas.height - floorHeight;
    drawRectangle(0, floorY, canvas.width, floorHeight, { fillColor: 'dimgray' });
    background.floorHeight = floorHeight;
    background.floorY = floorY;
}

//繪製分數與時間
function drawScoreAndTime() {
    drawText(`最高分: ${highScore}`, 10, 20, STYLES.text.GameScreenStatus);
    drawText(`分數: ${Math.floor(score)}`, 10, 40, STYLES.text.GameScreenStatus);
    const displayedTime = Math.max(0, timeLeft);
    drawText(`時間: ${displayedTime}`, canvas.width - 80, 20, STYLES.text.GameScreenStatus);
}

//根據物件類型生成物件
function createObject(type, existingObjects, minDistance = 100) {
    const config = objectTypes[type];
    if (!config) {
        throw new Error(`未知的物件類型: ${type}`);
    }

    let position;
    let isValidPosition = false;
    let attempts = 0; // 加入嘗試次數
    const maxAttempts = 100; // 最大嘗試次數

    while (!isValidPosition && attempts < maxAttempts) {
        position = config.generatePosition();
        isValidPosition = existingObjects.every(
            (other) => !isTooClose({ x: position.x, y: position.y }, other, minDistance)
        );
        attempts++;
    }

    if (!isValidPosition) {
        console.warn(`無法為 ${type} 生成有效位置，超過最大嘗試次數`);
    }

    return {
        type,
        effect: config.effect,
        value: config.value,
        x: position.x,
        y: position.y,
        width: config.width,
        height: config.height,
        color: config.color // 新增顏色屬性
    };
}

//繪製主畫面
function drawStartScreen() {

    drawRectangle(0, 0, canvas.width, canvas.height, { fillColor: 'lightblue' });
    const currentHighScore = getHighScore();

    // 顯示狀態類：最高分
    drawText(`最高分: ${currentHighScore}`, 10, 20, STYLES.text.StartScreenStatus);

    // 主標題
    drawText('4CatsHouse', canvas.width / 2, canvas.height * 0.3, STYLES.text.StartScreenMainTitle);

    const catDisplayWidth = 50;
    const catDisplayHeight = 50;
    const catDisplayX = canvas.width / 2 - catDisplayWidth / 2;
    const catDisplayY = canvas.height * 0.5 - catDisplayHeight / 2;

    drawRectangle(catDisplayX, catDisplayY, catDisplayWidth, catDisplayHeight, {
        fillColor: catColors[currentCatIndex],
        strokeColor: 'black',
        lineWidth: 2
    });

    // 顯示小貓名稱
    drawText(catNames[currentCatIndex], catDisplayX + catDisplayWidth / 2, catDisplayY + catDisplayHeight / 2 + 7, {
        font: '20px sans-serif',
        color: 'white',
        textAlign: 'center',
        baseline: 'middle'
    });

    // 按鈕類：點擊後開始用餐
    drawText('點擊後開始用餐', canvas.width / 2, canvas.height * 0.7, STYLES.text.StartScreenButton);

    // 保存小貓顯示區域的邊界，方便點擊檢測
    canvas.catDisplayArea = {
        x: catDisplayX,
        y: catDisplayY,
        width: catDisplayWidth,
        height: catDisplayHeight
    };
}

//繪製遊戲
function drawGameScene() {
    drawBackground();
    objects.forEach((object) => {
        drawRectangle(object.x, object.y, object.width, object.height, {
            fillColor: object.color // 使用物件的顏色屬性
        });
    });
    drawCat();
    drawScoreAndTime();
}

//繪製結算畫面
function drawGameOver() {
    drawRectangle(0, 0, canvas.width, canvas.height, { fillColor: 'rgba(0, 0, 0, 0.5)' });

    // 結算訊息類：用餐時間結束
    drawText('用餐時間結束囉', canvas.width / 2, canvas.height / 2 - 80, STYLES.text.GameOverScreenMessage);

    // 結算訊息類：分數
    drawText(`${catNames[currentCatIndex]} 得到的分數：${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 - 40, STYLES.text.GameOverScreenMessage);

    const previousHighScore = highScore;
    let congratsMessage = '';

    if (Math.floor(score) < previousHighScore || (Math.floor(score) === 0 && previousHighScore === 0)) {
        congratsMessage = '太可惜啦，再加油多吃一些罐罐吧！';
    } else if (Math.floor(score) === previousHighScore && previousHighScore > 0) {
        congratsMessage = '哇，差那一個小罐罐就能創造歷史啦！';
    } else if (Math.floor(score) > previousHighScore) {
        congratsMessage = `太棒啦，${catNames[currentCatIndex]} 果然是能創造奇蹟的！`;
        drawText(`全新的最高得分為：${Math.max(highScore, Math.floor(score))}`, canvas.width / 2, canvas.height / 2 + 80, STYLES.text.GameOverScreenMessage);
        setHighScore(Math.max(highScore, Math.floor(score)));
    }

    // 顯示狀態類：最高分
    drawText(`貓史上最高得分：${previousHighScore}`, canvas.width / 2, canvas.height / 2, STYLES.text.GameOverScreenMessage);

    // 結算訊息類：提示訊息
    drawText(congratsMessage, canvas.width / 2, canvas.height / 2 + 40, STYLES.text.GameOverScreenMessage);

    // 按鈕類：重新再用餐
    canvas.restartButtonArea = calculateButtonArea(canvas.width * 0.25, canvas.height * 0.8, '重新再用餐');
    drawText('重新再用餐', canvas.width * 0.25, canvas.height * 0.8, STYLES.text.GameOverScreenButton);

    // 按鈕類：回到主畫面
    canvas.backToStartButtonArea = calculateButtonArea(canvas.width * 0.75, canvas.height * 0.8, '回到主畫面');
    drawText('回到主畫面', canvas.width * 0.75, canvas.height * 0.8, STYLES.text.GameOverScreenButton);
}

//繪製文字，支援字體樣式、對齊方式等參數。
function drawText(text, x, y, options = {}) {
    const { font = '16px sans-serif', color = 'black', textAlign = 'start', baseline = 'alphabetic' } = options;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
}

//繪製矩形的邏輯，支援填充顏色與邊框顏色。
function drawRectangle(x, y, width, height, options = {}) {
    const { fillColor = 'black', strokeColor = null, lineWidth = 1 } = options;
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, width, height);
    }
    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
}

//包含所有與遊戲邏輯相關
function updateGameLogic() {
    // 更新遊戲速度
    const elapsedTimeInSeconds = gameStartTime ? (Date.now() - gameStartTime) / 1000 : 0;
    const timeBasedSpeedIncrease = Math.floor(elapsedTimeInSeconds / 10) * 0.1;
    const scoreBasedSpeedIncrease = score * 0.001;
    gameSpeed = baseGameSpeed + timeBasedSpeedIncrease + scoreBasedSpeedIncrease;

    // 背景移動
    background.x -= gameSpeed;
    if (background.x < -background.width / 2) {
        background.x = 0;
    }

    // 更新物件位置與碰撞檢測
    objects.forEach((object) => {
        object.x -= gameSpeed;

        // 如果物件超出畫面，重新生成位置
        if (object.x < -object.width) {
            object.x = canvas.width + Math.random() * 300;
            object.y = background.floorY - object.height - 10;
        }

        // 碰撞檢測
        if (
            cat.x < object.x + object.width &&
            cat.x + cat.width > object.x &&
            cat.y < object.y + object.height &&
            cat.y + cat.height > object.y
        ) {
            handleCollision(object);
        }
    });

    // 小貓跳躍邏輯
    if (cat.isJumping) {
        const groundLevel = background.floorY - cat.height;
        const maxJumpHeight = 6 * cat.height;
        const targetY = groundLevel - maxJumpHeight;
        if (cat.velocityY < 0) {
            if (isSpaceKeyPressed && cat.y > targetY) {
                cat.y += cat.velocityY;
            } else {
                cat.velocityY = 0;
            }
        }
        if (cat.velocityY >= 0) {
            cat.velocityY += gravity;
            cat.y += cat.velocityY;
        }
        if (cat.y >= groundLevel) {
            cat.y = groundLevel;
            cat.isJumping = false;
            cat.velocityY = 0;
        }
    }
}

//更新判斷與畫面
function update() {
    if (gameState === 'start') {
        drawStartScreen();
        requestAnimationFrame(update);
        return;
    }
    if (isGameOver) {
        drawBackground();
        drawGameOver();
        requestAnimationFrame(update);
        return;
    }

    // 更新遊戲邏輯
    updateGameLogic();

    // 繪製遊戲畫面
    drawGameScene();

    requestAnimationFrame(update);
}

//取得歷史高分
function getHighScore() {
    return localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
}

//設定歷史高分
function setHighScore(score) {
    localStorage.setItem('highScore', score);
}

//抽取按鈕區域計算邏輯
function calculateButtonArea(x, y, text, paddingX = 30, paddingY = 15) {
    const textWidth = ctx.measureText(text).width;
    const textHeight = 20; // 與字體大小相關，可調整
    return {
        x: x - textWidth / 2 - paddingX,
        y: y - textHeight / 2 - paddingY,
        width: textWidth + 2 * paddingX,
        height: textHeight + 2 * paddingY
    };
}

//註冊所有的事件處理邏輯
function setupEventListeners() {
    // 鍵盤事件
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // 滑鼠事件
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    // 觸控事件
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchend', handleTouchEnd, false);
}

function handleKeyDown(event) {
    if (event.code === 'Space') {
        if (gameState === 'start') {
            startGame();
        } else if (!cat.isJumping && gameState === 'playing') {
            startJump();
        }
    } else if (event.code === 'KeyR') {
        handleRestart();
    } else if (event.code === 'KeyC') {
        handleResetHighScore();
    } else if (event.code === 'KeyB') {
        handleBackToStart();
    } else if (gameState === 'start') {
        handleCatSelection(event.code);
    }
}

function handleKeyUp(event) {
    if (event.code === 'Space') {
        endJump();
    }
}

function handleMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (isGameOver) {
        if (isClickInside(clickX, clickY, canvas.restartButtonArea)) {
            handleRestart();
        } else if (isClickInside(clickX, clickY, canvas.backToStartButtonArea)) {
            handleBackToStart();
        }
    } else if (gameState === 'start' && isClickInsideCat(clickX, clickY)) {
        cycleCat();
    } else if (gameState === 'start') {
        startGame();
    } else if (!cat.isJumping && gameState === 'playing') {
        startJump();
    }
}

function handleMouseUp(event) {
    endJump();
}

function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    if (isGameOver) {
        if (isClickInside(touchX, touchY, canvas.restartButtonArea)) {
            handleRestart();
        } else if (isClickInside(touchX, touchY, canvas.backToStartButtonArea)) {
            handleBackToStart();
        }
    } else if (gameState === 'start' && isClickInsideCat(touchX, touchY)) {
        cycleCat();
    } else if (gameState === 'start') {
        startGame();
    } else if (!cat.isJumping && gameState === 'playing') {
        startJump();
    }
}

function handleTouchEnd(event) {
    endJump();
}


//處理物件的碰撞效果
function handleCollision(object) {
    switch (object.effect) {
        case 'addScore':
            score += object.value;
            break;
        case 'subtractScore':
            score = Math.max(0, score - object.value); // 確保分數不為負
            break;
        case 'addTime':
            timeLeft += object.value;
            break;
        case 'subtractTime':
            timeLeft = Math.max(0, timeLeft - object.value); // 確保時間不為負
            break;
    }

    // 使用 createObject 重新生成物件位置
    const newObject = createObject(object.type, objects, 100);
    object.x = newObject.x;
    object.y = newObject.y;
}


//檢查兩個物件是否太接近
function isTooClose(obj1, obj2, minDistance) {
    const dx = Math.abs(obj1.x - obj2.x);
    const dy = Math.abs(obj1.y - obj2.y);
    const combinedWidth = (obj1.width + obj2.width) / 2;
    const combinedHeight = (obj1.height + obj2.height) / 2;

    return dx < combinedWidth + minDistance && dy < combinedHeight + minDistance;
}



function isClickInside(x, y, rect) {
    return isInsideRectangle(x, y, rect);
}

function isClickInsideCat(x, y) {
    if (canvas.catDisplayArea) {
        return isInsideRectangle(x, y, canvas.catDisplayArea);
    }
    return false;
}

//碰撞檢測
function isInsideRectangle(x, y, rect) {
    return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
}

function cycleCat() {
    currentCatIndex = (currentCatIndex + 1) % catColors.length;
}

function startGame() {
    gameState = 'playing';
    cat.y = background.floorY - cat.height;
    selectedCatIndex = currentCatIndex;
    startGameTimer(); // 開始計時器並記錄開始時間
}

function startJump() {
    cat.isJumping = true;
    cat.velocityY = -4;
    isSpaceKeyPressed = true;
}

function endJump() {
    isSpaceKeyPressed = false;
    if (cat.isJumping && cat.velocityY < 0) {
        cat.velocityY = 0;
    }
}

function handleRestart() {
    if (isGameOver) {
        init(false);
        isGameOver = false;
        gameState = 'playing';
        startGameTimer(); // 重新開始計時器並記錄開始時間
    }
}

function handleResetHighScore() {
    if (gameState === 'start') {
        localStorage.setItem('highScore', 0);
        init();
        console.log('Debug: 歷史最高分已重置為 0 (按下 C)');
    }
}

function handleBackToStart() {
    if (isGameOver) {
        isGameOver = false;
        gameState = 'start';
        init();
    }
}

function handleCatSelection(keyCode) {
    if (keyCode === 'Digit1') { currentCatIndex = 0; } else if (keyCode === 'Digit2') { currentCatIndex = 1; }
    else if (keyCode === 'Digit3') { currentCatIndex = 2; } else if (keyCode === 'Digit4') { currentCatIndex = 3; }
    else if (keyCode === 'Digit5') { currentCatIndex = 4; }
    selectedCatIndex = currentCatIndex;
}

init();
update();