// gameLogic.js

import { gravity, baseGameSpeed, objectTypes} from './constants.js';
import { gameStates, mainCat, background, objects } from './gameState.js';
import { isColliding, isTooClose } from './utils.js';

//包含所有與遊戲邏輯相關
export function updateGameLogic(ctx, gameCanvas) {
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
        const objectSpeed = gameSpeed + object.speedBonus;

        object.x -= objectSpeed ;

        // 如果物件超出畫面，重新生成位置
        if (object.x < -object.width) {
            const config = objectTypes[object.type];
            if (config && typeof config.generatePosition === 'function') {
                const newPosition = config.generatePosition(gameCanvas, background);
                object.x = newPosition.x;
                object.y = newPosition.y;
            }
        }

        // 碰撞檢測
        if (isColliding(selectedCat, object)) {
            handleCollision(ctx, gameCanvas, object);
        }
      });


    // 小貓跳躍邏輯
    if (selectedCat.isJumping) {
        const groundLevel = background.floorY - (selectedCat.shape === 'circle' ? selectedCat.radius : selectedCat.height);
        const maxJumpHeight = selectedCat.jumpHeight;
        const targetY = groundLevel - maxJumpHeight;

        // 更新小貓的 Y 軸位置 : 上升階段
        if (selectedCat.velocityY < 0) {
            if (selectedCat.isJumping && selectedCat.y > targetY) {
                selectedCat.y += selectedCat.velocityY;
            } else {
                selectedCat.velocityY = 0;
            }
        }

        // 更新小貓的 Y 軸位置 : 下降階段
        if (selectedCat.velocityY >= 0) {
            selectedCat.velocityY += (gravity + selectedCat.catGravity);
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
function handleCollision(ctx, gameCanvas, object) {

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

    // 重新生成物件位置
    const config = objectTypes[object.type];
     if (config && typeof config.generatePosition === 'function') {
         const newPosition = config.generatePosition(gameCanvas, background);
         object.x = newPosition.x;
         object.y = newPosition.y;
     }

}

//生成物件
export function createObject(ctx, gameCanvas, type, existingObjects, options = {}) {

    const config = objectTypes[type];
    const { fixPositionX = null  ,fixPositionY = null , minDistanceX = 100, minDistanceY = 0 } = options;

    if (!config) {
        throw new Error(`未知的物件類型: ${type}`);
    }

    if (typeof config.generatePosition !== 'function') {
        throw new Error(`物件類型 ${type} 缺少 generatePosition 方法`);
    }

    let position;
    let bIsTooClose = true;
    let attempts = 0;
    const maxAttempts = 100;

   while (bIsTooClose && attempts < maxAttempts) {
        position = config.generatePosition.call(config, gameCanvas, background);

        // 檢查位置是否有效
        bIsTooClose = existingObjects.some(
            (other) => isTooClose({ x: position.x, y: position.y, width: config.width, height: config.height }, other, config.width+20, config.height+20)
        );

        attempts++;
    }
    if (bIsTooClose) {
        console.warn(`無法為 ${type} 生成有效位置，超過最大嘗試次數`);
    }

    return {
        type,

        ...config,

        x: position.x,
        y: position.y,
        
    };
}

