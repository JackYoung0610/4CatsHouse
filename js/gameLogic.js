// gameLogic.js

import { gravity, baseGameSpeed, objectTypes} from './constants.js';
import { gameStates, mainCat, background, objects } from './gameState.js';
import { isColliding, isTooClose } from './utils.js';

//包含所有與遊戲邏輯相關
export function updateGameLogic(ctx, canvas) {
    // 更新遊戲速度
    const elapsedTimeInSeconds = gameStates.gameStartTime ? (Date.now() - gameStates.gameStartTime) / 1000 : 0;
    const timeBasedSpeedIncrease = Math.floor(elapsedTimeInSeconds / 10) * 0.1;
    const scoreBasedSpeedIncrease = gameStates.score * 0.001;
    const gameSpeed = baseGameSpeed + timeBasedSpeedIncrease + scoreBasedSpeedIncrease;

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]

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
        if (isColliding(selectedCat, object)) {
            handleCollision(ctx, canvas, object);
        }
      });


    // 小貓跳躍邏輯
    if (selectedCat.isJumping) {
        const groundLevel = background.floorY - (selectedCat.shape === 'circle' ? selectedCat.radius * 2 : selectedCat.height);
        const maxJumpHeight = selectedCat.jumpHeight;
        const targetY = groundLevel - maxJumpHeight;

        if (selectedCat.velocityY < 0) {
            if (selectedCat.isJumping && selectedCat.y > targetY) {
                selectedCat.y += selectedCat.velocityY;
            } else {
                selectedCat.velocityY = 0;
            }
        }

        if (selectedCat.velocityY >= 0) {
            selectedCat.velocityY += gravity;
            selectedCat.y += selectedCat.velocityY;
        }
        // 碰撞地面
        if (selectedCat.y >= groundLevel) {
            selectedCat.y = groundLevel;
            selectedCat.isJumping = false;
            selectedCat.velocityY = 0;
        }
    }
}

//處理物件的碰撞效果
function handleCollision(ctx, canvas, object) {
    switch (object.effect) {
        case 'addScore':
            gameStates.score += object.value;
            break;
        case 'subtractScore':
            gameStates.score = Math.max(0, gameStates.score - object.value); // 確保分數不為負
            break;
        case 'addTime':
            gameStates.timeLeft += object.value;
            break;
        case 'subtractTime':
            gameStates.timeLeft = Math.max(0, gameStates.timeLeft - object.value); // 確保時間不為負
            break;
    }

    // 使用 createObject 重新生成物件位置
    const newObject = createObject(ctx, canvas, object.type, objects, 100);
    object.x = newObject.x;
    object.y = newObject.y;
}

//生成物件
export function createObject(ctx, canvas, type, existingObjects, minDistance = 100) {
    const config = objectTypes[type];
    if (!config) {
        throw new Error(`未知的物件類型: ${type}`);
    }

    if (typeof config.generatePosition !== 'function') {
        throw new Error(`物件類型 ${type} 缺少 generatePosition 方法`);
    }

    let position;
    let isValidPosition = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!isValidPosition && attempts < maxAttempts) {
        position = config.generatePosition(canvas, background); // 傳遞 canvas 和 background
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

