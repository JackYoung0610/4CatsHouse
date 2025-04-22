// drawing.js

import {   gameVersion } from '../main.js';
import {   gameDisplay, STYLES } from './constants.js';
import { calculateButtonArea, setHighScore } from './utils.js';
import { gameStates, mainCat, background, objects } from './gameState.js';

/**
 * 繪製文字。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {string} text - 要繪製的文字。
 * @param {number} originalXx - 文字的 X 座標。
 * @param {number} originalY - 文字的 Y 座標。
 * @param {Object} options - 繪製選項（字體、顏色等）。
* @param {boolean} shouldScale - 是否根據畫布大小縮放文字位置。
* @param {boolean} shouldScaleFont - 是否根據畫布大小縮放字體大小。
 */
export function drawText(ctx, text, originalX, originalY, options = {},  shouldScale = true,  shouldScaleFont = true) {

    const { font = '20px "Microsoft JhengHei", sans-serif', fillStyle = 'white', textAlign = 'center', textBaseline = 'alphabetic' } = options;

    const scaledX = shouldScale ? originalX * gameDisplay.scaleX : originalX;
    const scaledY = shouldScale ? originalY * gameDisplay.scaleY : originalY;

    let scaledFont = font;

    if (shouldScaleFont && font ) {
        const parts = font.split(' ');
        const size = parseFloat(parts[0]);
        if (!isNaN(size)) {
          parts[0] = `${size * Math.min(gameDisplay.scaleX, gameDisplay.scaleY)}px`;
          scaledFont = parts.join(' ');
        }
      }

    ctx.font = scaledFont;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillText(text, scaledX, scaledY);

}

/**
 * 繪製矩形。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {number} originalX - 矩形的 X 座標。
 * @param {number} originalY - 矩形的 Y 座標。
 * @param {number} originalWidth - 矩形的寬度。
 * @param {number} originalHeight - 矩形的高度。
 * @param {Object} options - 繪製選項（填充顏色、邊框顏色等）。
 * @param {boolean} shouldScale - 是否根據畫布大小縮放矩形位置和大小。
 */
export function drawRectangle(ctx, originalX, originalY, originalWidth, originalHeight, options = {}, shouldScale = true, shouldScaleSize = true) {

    const { fillColor = 'black', strokeColor = null, lineWidth = 1 } = options;

    const scaledX = shouldScale ? originalX * gameDisplay.scaleX : originalX;
    const scaledY = shouldScale ? originalY * gameDisplay.scaleY : originalY;
    const scaledWidth = shouldScaleSize ? originalWidth * gameDisplay.scaleX : originalWidth;
    const scaledHeight = shouldScaleSize ? originalHeight * gameDisplay.scaleY : originalHeight;
    const scaledLineWidth = shouldScaleSize ? lineWidth * Math.min(gameDisplay.scaleX, gameDisplay.scaleY) : lineWidth;

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
    }

    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = scaledLineWidth
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
    }
}
/**
 * 繪製圓形。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {number} originalX - 圓心的 X 座標。
 * @param {number} originalY - 圓心的 Y 座標。
 * @param {number} originalRadius - 圓的半徑。
 * @param {Object} options - 繪製選項（填充顏色、邊框顏色等）。
  * @param {boolean} shouldScale - 是否根據畫布大小縮放圓形位置和大小。
 */
export function drawCircle(ctx, originalX, originalY, originalRadius, options = {}, shouldScale = true,  shouldScaleSize = true) {

    const { fillColor = 'black', strokeColor = null, lineWidth = 1 } = options;

    const scaledX = shouldScale ? originalX * gameDisplay.scaleX : originalX;
    const scaledY = shouldScale ? originalY * gameDisplay.scaleY : originalY;
    const scaledRadius = shouldScaleSize ? originalRadius * Math.min(gameDisplay.scaleX, gameDisplay.scaleY) : originalRadius;
    const scaledLineWidth = shouldScaleSize ? lineWidth * Math.min(gameDisplay.scaleX, gameDisplay.scaleY) : lineWidth;

    ctx.beginPath();
    ctx.arc(scaledX, scaledY, scaledRadius, 0, Math.PI * 2);

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = scaledLineWidth
        ctx.stroke();
    }
    ctx.closePath();
}

/**
 * 繪製背景。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {HTMLCanvasElement} gameCanvas - Canvas 元素。
  */
export function drawBackground(ctx, gameCanvas) {

    // 繪製背景
    drawRectangle(ctx, background.x, 0, background.width, gameCanvas.height, { fillColor: 'lightgreen' }, false, false);

    // 繪製地板
    drawRectangle(ctx, 0, background.floorY, gameCanvas.width, background.floorHeight, { fillColor: 'dimgray' }, false, false);

}


/**
 * 繪製主角貓咪。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {Object} cat - 控制的貓咪，包含位置、形狀、顏色等資訊。
 */
export function drawCat(ctx, shouldScale = true, shouldScaleSize = true) {

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
    //const selectedCat = cats[cat.currentCatIndex];

    if (selectedCat.shape === 'rectangle') {
        drawRectangle(ctx, selectedCat.x, selectedCat.y, selectedCat.width, selectedCat.height, { fillColor: selectedCat.fillColor, strokeColor:selectedCat.strokeColor},shouldScale,shouldScaleSize);
    } else if (selectedCat.shape === 'circle') {
        //drawCircle(ctx, selectedCat.x + selectedCat.radius, selectedCat.y + selectedCat.radius, selectedCat.radius, { fillColor: selectedCat.fillColor, strokeColor:selectedCat.strokeColor });
        drawCircle(ctx, selectedCat.x , selectedCat.y , selectedCat.radius, { fillColor: selectedCat.fillColor, strokeColor:selectedCat.strokeColor },shouldScale,shouldScaleSize);
    }

}

//繪製分數與時間
export function drawScoreAndTime(ctx, gameCanvas) {
    drawText(ctx,`最高分: ${gameStates.highScore}`,  gameCanvas.width * 0.02, gameCanvas.height * 0.04 , STYLES.text.GameScreenStatus, false);
    drawText(ctx,`分數: ${Math.floor(gameStates.score)}`,  gameCanvas.width * 0.02, gameCanvas.height * 0.08 , STYLES.text.GameScreenStatus, false);
    const displayedTime = Math.max(0, gameStates.timeLeft);
    drawText(ctx,`時間: ${displayedTime}`,  gameCanvas.width * 0.95, gameCanvas.height * 0.04 , STYLES.text.GameScreenStatus, false);
}

/**
 * 繪製開始畫面。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {HTMLCanvasElement} gameCanvas - Canvas 元素。
 * @param {Object} gameStates - 遊戲狀態物件。
 * @param {Object} cat - 控制的貓咪，包含位置、形狀、顏色等資訊。
 */
export function drawGamePhase_StartScreen(ctx, gameCanvas) {

    // 清除畫布
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // 繪製背景
    drawRectangle(ctx, 0, 0, gameCanvas.width, gameCanvas.height, { fillColor: 'lightblue' },false, false);

    // 繪製標題
    drawText(ctx, '4CatsHouse', gameCanvas.width / 2, gameCanvas.height * 0.3, STYLES.text.StartScreenMainTitle, false);

    //繪製最高分
    drawText(ctx, `最高分: ${gameStates.highScore}`, gameCanvas.width * 0.02, gameCanvas.height * 0.04 , STYLES.text.StartScreenStatus, false);

    //設定小貓位置並繪製
    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
    if (selectedCat.shape === 'rectangle') {
         selectedCat.x = (gameCanvas.width * 0.5) - (selectedCat.width * 0.5);
        selectedCat.y = (gameCanvas.height * 0.5) - (selectedCat.height * 0.8) ;
    } else if (selectedCat.shape === 'circle') {
        selectedCat.x = (gameCanvas.width * 0.5) ;
        selectedCat.y = (gameCanvas.height * 0.5) - (selectedCat.radius *0.8);
    }
    drawCat(ctx,false);

    drawText(ctx, selectedCat.name, gameCanvas.width / 2, gameCanvas.height * 0.6, { font: '20px sans-serif', color: 'white', textAlign: 'center' },false);
    drawText(ctx, '點擊後開始用餐', gameCanvas.width / 2, gameCanvas.height * 0.7, STYLES.text.StartScreenButton,false);
    drawText(ctx, gameVersion , gameCanvas.width - 50 , gameCanvas.height - 10, STYLES.text.StartScreenButton,false);

}

/**
 * 繪製遊戲畫面。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {HTMLCanvasElement} gameCanvas - Canvas 元素。
 * @param {Function} drawScoreAndTime - 繪製分數與時間的函式。
 */
export function drawGamePhase_GameScene(ctx, gameCanvas) {
    
    // 清除畫布
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // 繪製背景
    drawBackground(ctx, gameCanvas, background);

    // 繪製遊戲物件
    objects.forEach((object) => {
        if (object.shape === 'rectangle') {
            drawRectangle(ctx, object.x, object.y, object.width, object.height, { fillColor: object.fillColor , strokeColor: object.strokeColor},false);
        } else if (object.shape === 'circle') {
            drawCircle(ctx, object.x, object.y, object.radius, { fillColor: object.fillColor , strokeColor: object.strokeColor },false);
        }
    });

    // 繪製貓咪
    drawCat(ctx,false);
    // 繪製分數與時間
    drawScoreAndTime(ctx, gameCanvas);

}

/**
 * 繪製結算畫面。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {HTMLCanvasElement} gameCanvas - Canvas 元素。
 */
export function drawGamePhase_GameOver(ctx, gameCanvas) {

    // 清除畫布
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    drawRectangle(ctx, 0, 0, gameCanvas.width, gameCanvas.height, { fillColor: 'black' }, false, false);

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
    const HighScore = gameStates.highScore;
    const currentScore = gameStates.score
    let congratsMessage = '';

    drawText(ctx, '用餐時間結束囉', gameCanvas.width / 2, gameCanvas.height *0.3 , STYLES.text.GameOverScreenMessage, false);
    drawText(ctx, `${selectedCat.name} 得到的分數：${Math.floor(gameStates.score)}`, gameCanvas.width / 2, gameCanvas.height / 2 - 40, STYLES.text.GameOverScreenMessage, false);

    if (Math.floor(currentScore) < Math.floor(HighScore)) {
        // 如果當前分數小於最高分，顯示鼓勵訊息
        congratsMessage = '太可惜啦，再加油多吃一些罐罐吧！';

    } else if  (Math.floor(currentScore) === Math.floor(HighScore))  {
        // 如果當前分數等於最高分，顯示鼓勵訊息
        congratsMessage = '哇，差那一個小罐罐就能創造歷史啦！';

    } else if  (Math.floor(currentScore) > Math.floor(HighScore)) {
        // 如果當前分數大於最高分，顯示鼓勵訊息
        congratsMessage = `太棒啦，${selectedCat.name} 果然是能創造奇蹟的！`;
        drawText(ctx, `全新的最高得分為：${Math.max(gameStates.highScore, Math.floor(gameStates.score))}`, gameCanvas.width / 2, gameCanvas.height / 2 + 80, STYLES.text.GameOverScreenMessage, false);
        setHighScore(currentScore);
    }

    // 顯示狀態類：最高分
    drawText(ctx, `貓史上最高得分：${HighScore}`, gameCanvas.width / 2, gameCanvas.height / 2, STYLES.text.GameOverScreenMessage, false);
    // 結算訊息類：提示訊息
    drawText(ctx, congratsMessage, gameCanvas.width / 2, gameCanvas.height / 2 + 40, STYLES.text.GameOverScreenMessage, false);

    // 按鈕類：重新再用餐
    gameCanvas.restartButtonArea = calculateButtonArea(ctx, gameCanvas.width * 0.25, gameCanvas.height * 0.8, '重新再用餐');
    drawText(ctx, '重新再用餐', gameCanvas.width * 0.25, gameCanvas.height * 0.8, STYLES.text.GameOverScreenButton, false);

    // 按鈕類：回到主畫面
    gameCanvas.backToStartButtonArea = calculateButtonArea(ctx, gameCanvas.width * 0.75, gameCanvas.height * 0.8, '回到主畫面');
    drawText(ctx, '回到主畫面', gameCanvas.width * 0.75, gameCanvas.height * 0.8, STYLES.text.GameOverScreenButton, false);

}

