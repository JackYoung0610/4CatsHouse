// 4CatsHouse - script.js
// 版本號: 0.002


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

const cats = [
    { name: '冰炫風', color: 'blue', width: 30, height: 30, jumpHeight: 180, shape: 'rectangle', radius: 0 ,isJumping: false,x: canvas.width * 0.3, y: 0,},
    { name: '醬太郎', color: 'orange', width: 35, height: 35, jumpHeight: 200, shape: 'circle', radius: 18 ,isJumping: false,x: canvas.width * 0.3, y: 0,},
    { name: '牛奶糖', color: 'white', width: 35, height: 35, jumpHeight: 160, shape: 'rectangle', radius: 0 ,isJumping: false,x: canvas.width * 0.3, y: 0,},
    { name: '青草茶', color: 'black', width: 40, height: 30, jumpHeight: 190, shape: 'rectangle', radius: 0 ,isJumping: false,x: canvas.width * 0.3, y: 0,},
    { name: '炸豬排', color: 'pink', width: 30, height: 30, jumpHeight: 150, shape: 'circle', radius: 13,isJumping: false,x: canvas.width * 0.3, y: 0, }
];

// 全域變數：貓咪的狀態
let cat = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    radius: 0,
    shape: 'rectangle',
    velocityY: 0,
    isJumping: false
};

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
        radius: 0, 
        shape: 'rectangle', // 矩形
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 30  // 貼齊地面
        })
    },
    mediumObstacle: {
        effect: 'subtractTime',
        value: 10,
        width: 50,
        height: 50,
        color: 'darkred', // 中障礙物顏色
        radius: 25, // 圓形需要半徑
        shape: 'circle', // 圓形
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
        radius: 0, 
        shape: 'rectangle', // 矩形
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
        radius: 0,
        shape: 'rectangle', // 矩形
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
        radius: 0,
        shape: 'rectangle', // 矩形
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 20 - 60 // 稍微高於地面
        })
    },
    goldCan: {
        effect: 'addTime',
        value: 5,
        width: 20,
        height: 20,
        color: 'gold', // 金色罐罐顏色
        radius: 0,
        shape: 'rectangle', // 矩形
        generatePosition: () => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 20 - 10 // 稍微高於地面
        })
    }
};

//初始化物件表
let objects = [];
objects.push(createObject('smallObstacle', objects, 100));
objects.push(createObject('mediumObstacle', objects, 100));
//objects.push(createObject('largeObstacle', objects, 100));
objects.push(createObject('greenCan', objects, 100));
objects.push(createObject('blueCan', objects, 100));
//objects.push(createObject('goldCan', objects, 100));


// 遊戲初始化
function init(resetSelectedCat = true) {
    highScore = getHighScore();

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
    score = 0;
    timeLeft = 60;
    isGameOver = false;
    isSpaceKeyPressed = false;
    gameSpeed = baseGameSpeed;
    gameState = 'start';
    gameStartTime = null;

    // 初始化選擇的小貓
    if (resetSelectedCat) {
        selectedCatIndex = Math.floor(Math.random() * cats.length);
    }
    currentCatIndex = selectedCatIndex;

    const selectedCat = cats[currentCatIndex];
    cat.x = selectedCat.x;
    cat.y = floorY - (selectedCat.shape === 'circle' ? selectedCat.radius * 2 : selectedCat.height);
    cat.width = selectedCat.width;
    cat.height = selectedCat.height;
    cat.radius = selectedCat.radius;
    cat.shape = selectedCat.shape;
    cat.velocityY = 0;
    cat.isJumping = false;
    cat.name = selectedCat.name; // 新增 name 屬性

    // 清除之前的 interval
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
    if (cat.shape === 'rectangle') {
        drawRectangle(cat.x, cat.y, cat.width, cat.height, { fillColor: cats[currentCatIndex].color });
    } else if (cat.shape === 'circle') {
        drawCircle(cat.x + cat.radius, cat.y + cat.radius, cat.radius, { fillColor: cats[currentCatIndex].color });
    }
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
            (other) => !isTooClose({ x: position.x, y: position.y, width: config.width, height: config.height }, other, minDistance)
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
        width: config.width || 0,
        height: config.height || 0,
        radius: config.radius || 0,
        color: config.color,
        shape: config.shape
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

    //繪製主角貓咪
    const selectedCat = cats[currentCatIndex];
    if (selectedCat.shape === 'rectangle') {
        drawRectangle(
            canvas.width / 2 - selectedCat.width / 2,
            canvas.height * 0.5 - selectedCat.height / 2,
            selectedCat.width,
            selectedCat.height,
            { fillColor: selectedCat.color, strokeColor: 'black', lineWidth: 2 }
        );
    } else if (selectedCat.shape === 'circle') {
        drawCircle(
            canvas.width / 2,
            canvas.height * 0.5,
            selectedCat.radius,
            { fillColor: selectedCat.color, strokeColor: 'black', lineWidth: 2 }
        );
    }


    // 顯示小貓名稱
    drawText(selectedCat.name, canvas.width / 2, canvas.height * 0.6, {
        font: '20px sans-serif',
        color: 'white',
        textAlign: 'center',
        baseline: 'middle'
    });

    // 按鈕類：點擊後開始用餐
    drawText('點擊後開始用餐', canvas.width / 2, canvas.height * 0.7, STYLES.text.StartScreenButton);
}


//繪製遊戲
function drawGameScene() {
    drawBackground();
    objects.forEach((object) => {
        if (object.shape === 'rectangle') {
            drawRectangle(object.x, object.y, object.width, object.height, {
                fillColor: object.color
            });
        } else if (object.shape === 'circle') {
            drawCircle(object.x, object.y, object.radius, {
                fillColor: object.color
            });
        }
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
    drawText(`${cat.name} 得到的分數：${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 - 40, STYLES.text.GameOverScreenMessage);

    const previousHighScore = highScore;
    let congratsMessage = '';

    if (Math.floor(score) < previousHighScore || (Math.floor(score) === 0 && previousHighScore === 0)) {
        congratsMessage = '太可惜啦，再加油多吃一些罐罐吧！';
    } else if (Math.floor(score) === previousHighScore && previousHighScore > 0) {
        congratsMessage = '哇，差那一個小罐罐就能創造歷史啦！';
    } else if (Math.floor(score) > previousHighScore) {
        congratsMessage = `太棒啦，${cat.name} 果然是能創造奇蹟的！`;
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

/**
 * 繪製圓形的邏輯，支援填充顏色與邊框顏色。
 * @param {number} x - 圓心的 X 座標。
 * @param {number} y - 圓心的 Y 座標。
 * @param {number} radius - 圓的半徑。
 * @param {Object} options - 繪製選項，包括填充顏色與邊框顏色。
 */
function drawCircle(x, y, radius, options = {}) {
    const { fillColor = 'black', strokeColor = null, lineWidth = 1 } = options;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
    ctx.closePath();
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
            object.y = background.floorY - (object.height || object.radius * 2) - 10;
        }

        // 碰撞檢測
        if (isColliding(cat, object)) {
            handleCollision(object);
        }
      });


    // 小貓跳躍邏輯
    if (cat.isJumping) {
        const groundLevel = background.floorY - (cat.shape === 'circle' ? cat.radius * 2 : cat.height);
        const maxJumpHeight = cats[currentCatIndex].jumpHeight;
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
/**
 * 更新遊戲畫面與邏輯的主迴圈函式。
 * 根據遊戲狀態 (start, playing, gameOver) 執行相應的繪製與邏輯更新。
 * 使用 requestAnimationFrame 進行畫面更新。
 */
function update() {
    try {
        if (gameState === 'start') {
            // 繪製開始畫面
            drawStartScreen();
            requestAnimationFrame(update);
            return;
        }
        if (isGameOver) {
            // 繪製背景與結算畫面
            drawBackground();
            drawGameOver();
            requestAnimationFrame(update);
            return;
        }

        // 更新遊戲邏輯
        updateGameLogic();

        // 繪製遊戲畫面
        drawGameScene();

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
function selectControlledCat(selectedCat, floorY) {
    cat.x = selectedCat.x;
    cat.y = floorY - (selectedCat.shape === 'circle' ? selectedCat.radius * 2 : selectedCat.height);
    cat.width = selectedCat.width;
    cat.height = selectedCat.height;
    cat.radius = selectedCat.radius;
    cat.shape = selectedCat.shape;
    cat.velocityY = 0;
    cat.isJumping = false;
    cat.name = selectedCat.name; // 設定小貓的名稱
}

//取得歷史高分
function getHighScore() {
    try {
        const storedHighScore = localStorage.getItem('highScore');
        return storedHighScore ? parseInt(storedHighScore) : 0;
    } catch (error) {
        console.error('Error accessing localStorage for highScore:', error);
        return 0; // 返回預設值
    }
}

//設定歷史高分
function setHighScore(score) {
    try {
        localStorage.setItem('highScore', score);
    } catch (error) {
        console.error('Error saving highScore to localStorage:', error);
    }
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
    } else if (gameState === 'start') {
        // 先判斷是否點擊到小貓
        if (isClickInsideCat(clickX, clickY)) {
            cycleCat(); // 切換小貓
        } else {
            startGame(); // 未點擊小貓則進入遊戲
        }
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
    } else if (gameState === 'start') {
        // 先判斷是否點擊到小貓
        if (isClickInsideCat(touchX, touchY)) {
            cycleCat(); // 切換小貓
        } else {
            startGame(); // 未點擊小貓則進入遊戲
        }
    } else if (!cat.isJumping && gameState === 'playing') {
        startJump();
    }
}


function handleTouchEnd(event) {
    endJump();
}

/**
 * 檢查兩個物件是否發生碰撞。
 * @param {Object} obj1 - 第一個物件，包含形狀、位置和尺寸資訊。
 * @param {Object} obj2 - 第二個物件，包含形狀、位置和尺寸資訊。
 * @returns {boolean} 如果兩個物件發生碰撞，返回 true，否則返回 false。
 */
function isColliding(obj1, obj2) {
    if (obj1.shape === 'rectangle' && obj2.shape === 'rectangle') {
        return isRectangleColliding(obj1, obj2);
    } else if (obj1.shape === 'circle' && obj2.shape === 'circle') {
        return isCircleColliding(obj1, obj2);
    } else if (obj1.shape === 'rectangle' && obj2.shape === 'circle') {
        return isRectangleCircleColliding(obj1, obj2);
    } else if (obj1.shape === 'circle' && obj2.shape === 'rectangle') {
        return isRectangleCircleColliding(obj2, obj1);
    }
    return false; // 預設不碰撞
}


/**
 * 檢查兩個矩形是否發生碰撞。
 * @param {Object} rect1 - 第一個矩形，包含 x, y, width, height 屬性。
 * @param {Object} rect2 - 第二個矩形，包含 x, y, width, height 屬性。
 * @returns {boolean} 如果兩個矩形發生碰撞，返回 true，否則返回 false。
 */
function isRectangleColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

/**
 * 檢查兩個圓形是否發生碰撞。
 * @param {Object} circle1 - 第一個圓形，包含 x, y, radius 屬性。
 * @param {Object} circle2 - 第二個圓形，包含 x, y, radius 屬性。
 * @returns {boolean} 如果兩個圓形發生碰撞，返回 true，否則返回 false。
 */
function isCircleColliding(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

/**
 * 檢查矩形與圓形是否發生碰撞。
 * @param {Object} rect - 矩形，包含 x, y, width, height 屬性。
 * @param {Object} circle - 圓形，包含 x, y, radius 屬性。
 * @returns {boolean} 如果矩形與圓形發生碰撞，返回 true，否則返回 false。
 */
function isRectangleCircleColliding(rect, circle) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy < circle.radius * circle.radius;
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
    const selectedCat = cats[currentCatIndex];
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




//碰撞檢測
function isInsideRectangle(x, y, rect) {
    return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
}

//變更小貓
function cycleCat() {
    currentCatIndex = (currentCatIndex + 1) % cats.length;

    // 呼叫 selectControlledCat 更新 cat
    selectControlledCat(cats[currentCatIndex], background.floorY);
}




function startGame() {
    gameState = 'playing';
    cat.y = background.floorY - cat.height;
    selectedCatIndex = currentCatIndex;
    startGameTimer(); // 開始計時器並記錄開始時間
}

function startJump() {
    if (!cat.isJumping) {
        cat.isJumping = true;
        cat.velocityY = -Math.sqrt(2 * gravity * cats[currentCatIndex].jumpHeight); // 根據跳躍高度計算初速度
        isSpaceKeyPressed = true;
    }
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

//選擇小貓
function handleCatSelection(keyCode) {
    if (keyCode === 'Digit1') { currentCatIndex = 0; }
    else if (keyCode === 'Digit2') { currentCatIndex = 1; }
    else if (keyCode === 'Digit3') { currentCatIndex = 2; }
    else if (keyCode === 'Digit4') { currentCatIndex = 3; }
    else if (keyCode === 'Digit5') { currentCatIndex = 4; }

    // 呼叫 selectControlledCat 更新 cat
    selectControlledCat(cats[currentCatIndex], background.floorY);
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