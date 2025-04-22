// drawing.js

import {   gameVersion } from '../main.js';
import {   STYLES } from './constants.js';
import { calculateButtonArea, setHighScore } from './utils.js';
import { gameStates, mainCat, background, objects } from './gameState.js';

/**
 * 繪製文字。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {string} text - 要繪製的文字。
 * @param {number} x - 文字的 X 座標。
 * @param {number} y - 文字的 Y 座標。
 * @param {Object} options - 繪製選項（字體、顏色等）。
 */
export function drawText(ctx, text, x, y, options = {}) {
    const { font = '20px "Microsoft JhengHei", sans-serif', color = 'black', textAlign = 'start', baseline = 'alphabetic' } = options;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
}

/**
 * 繪製矩形。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {number} x - 矩形的 X 座標。
 * @param {number} y - 矩形的 Y 座標。
 * @param {number} width - 矩形的寬度。
 * @param {number} height - 矩形的高度。
 * @param {Object} options - 繪製選項（填充顏色、邊框顏色等）。
 */
export function drawRectangle(ctx, x, y, width, height, options = {}) {

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
 * 繪製圓形。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {number} x - 圓心的 X 座標。
 * @param {number} y - 圓心的 Y 座標。
 * @param {number} radius - 圓的半徑。
 * @param {Object} options - 繪製選項（填充顏色、邊框顏色等）。
 */
export function drawCircle(ctx, x, y, radius, options = {}) {
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

/**
 * 繪製背景。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {HTMLCanvasElement} gameCanvas - Canvas 元素。
  */
export function drawBackground(ctx, gameCanvas) {

    // 繪製背景
    drawRectangle(ctx, background.x, 0, background.width, gameCanvas.height, { fillColor: 'lightgreen' });

    // 計算地板高度和位置
    const floorHeight = gameCanvas.height / 5;
    const floorY = gameCanvas.height - floorHeight;

    drawRectangle(ctx, 0, floorY, gameCanvas.width, floorHeight, { fillColor: 'dimgray' });

    // 更新背景物件的地板屬性
    background.floorHeight = floorHeight;
    background.floorY = floorY;

    // 繪製地板
    drawRectangle(ctx, 0, floorY, gameCanvas.width, floorHeight, { fillColor: 'dimgray' });
}


/**
 * 繪製主角貓咪。
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 繪圖上下文。
 * @param {Object} cat - 控制的貓咪，包含位置、形狀、顏色等資訊。
 */
export function drawCat(ctx) {

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
    //const selectedCat = cats[cat.currentCatIndex];

    if (selectedCat.shape === 'rectangle') {
        drawRectangle(ctx, selectedCat.x, selectedCat.y, selectedCat.width, selectedCat.height, { fillColor: selectedCat.fillColor, strokeColor:selectedCat.strokeColor});
    } else if (selectedCat.shape === 'circle') {
        //drawCircle(ctx, selectedCat.x + selectedCat.radius, selectedCat.y + selectedCat.radius, selectedCat.radius, { fillColor: selectedCat.fillColor, strokeColor:selectedCat.strokeColor });
        drawCircle(ctx, selectedCat.x , selectedCat.y , selectedCat.radius, { fillColor: selectedCat.fillColor, strokeColor:selectedCat.strokeColor });
    }

}

//繪製分數與時間
export function drawScoreAndTime(ctx, gameCanvas) {
    drawText(ctx,`最高分: ${gameStates.highScore}`, 10, 20, STYLES.text.GameScreenStatus);
    drawText(ctx,`分數: ${Math.floor(gameStates.score)}`, 10, 40, STYLES.text.GameScreenStatus);
    const displayedTime = Math.max(0, gameStates.timeLeft);
    drawText(ctx,`時間: ${displayedTime}`, gameCanvas.width - 80, 20, STYLES.text.GameScreenStatus);
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
    drawRectangle(ctx, 0, 0, gameCanvas.width, gameCanvas.height, { fillColor: 'lightblue' });

    // 繪製標題
    drawText(ctx, '4CatsHouse', gameCanvas.width / 2, gameCanvas.height * 0.3, STYLES.text.StartScreenMainTitle);

    //繪製最高分
    drawText(ctx, `最高分: ${gameStates.highScore}`, 10, 20, STYLES.text.StartScreenStatus);

    //設定小貓位置並繪製
    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
    if (selectedCat.shape === 'rectangle') {
         selectedCat.x = (gameCanvas.width * 0.5) - (selectedCat.width * 0.5);
        selectedCat.y = (gameCanvas.height * 0.5) - (selectedCat.height * 0.8) ;
    } else if (selectedCat.shape === 'circle') {
        selectedCat.x = (gameCanvas.width * 0.5) ;
        selectedCat.y = (gameCanvas.height * 0.5) - (selectedCat.radius *0.8);
    }
    drawCat(ctx);

    drawText(ctx, selectedCat.name, gameCanvas.width / 2, gameCanvas.height * 0.6, { font: '20px sans-serif', color: 'white', textAlign: 'center' });
    drawText(ctx, '點擊後開始用餐', gameCanvas.width / 2, gameCanvas.height * 0.7, STYLES.text.StartScreenButton);
    drawText(ctx, gameVersion , gameCanvas.width - 50 , gameCanvas.height - 10, STYLES.text.StartScreenButton);

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
            drawRectangle(ctx, object.x, object.y, object.width, object.height, { fillColor: object.fillColor , strokeColor: object.strokeColor});
        } else if (object.shape === 'circle') {
            drawCircle(ctx, object.x, object.y, object.radius, { fillColor: object.fillColor , strokeColor: object.strokeColor });
        }
    });

    // 繪製貓咪
    drawCat(ctx);
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

    drawRectangle(ctx, 0, 0, gameCanvas.width, gameCanvas.height, { fillColor: 'black' });

    const selectedCat = mainCat.allCats[mainCat.currentCatIndex]
    const HighScore = gameStates.highScore;
    const currentScore = gameStates.score
    let congratsMessage = '';

    drawText(ctx, '用餐時間結束囉', gameCanvas.width / 2, gameCanvas.height / 2 - 80, STYLES.text.GameOverScreenMessage);
    drawText(ctx, `${selectedCat.name} 得到的分數：${Math.floor(gameStates.score)}`, gameCanvas.width / 2, gameCanvas.height / 2 - 40, STYLES.text.GameOverScreenMessage);

    if (Math.floor(currentScore) < Math.floor(HighScore)) {
        // 如果當前分數小於最高分，顯示鼓勵訊息
        congratsMessage = '太可惜啦，再加油多吃一些罐罐吧！';

    } else if  (Math.floor(currentScore) === Math.floor(HighScore))  {
        // 如果當前分數等於最高分，顯示鼓勵訊息
        congratsMessage = '哇，差那一個小罐罐就能創造歷史啦！';

    } else if  (Math.floor(currentScore) > Math.floor(HighScore)) {
        // 如果當前分數大於最高分，顯示鼓勵訊息
        congratsMessage = `太棒啦，${selectedCat.name} 果然是能創造奇蹟的！`;
        drawText(ctx, `全新的最高得分為：${Math.max(gameStates.highScore, Math.floor(gameStates.score))}`, gameCanvas.width / 2, gameCanvas.height / 2 + 80, STYLES.text.GameOverScreenMessage);
        setHighScore(currentScore);
    }

    // 顯示狀態類：最高分
    drawText(ctx, `貓史上最高得分：${HighScore}`, gameCanvas.width / 2, gameCanvas.height / 2, STYLES.text.GameOverScreenMessage);
    // 結算訊息類：提示訊息
    drawText(ctx, congratsMessage, gameCanvas.width / 2, gameCanvas.height / 2 + 40, STYLES.text.GameOverScreenMessage);

    // 按鈕類：重新再用餐
    gameCanvas.restartButtonArea = calculateButtonArea(ctx, gameCanvas.width * 0.25, gameCanvas.height * 0.8, '重新再用餐');
    drawText(ctx, '重新再用餐', gameCanvas.width * 0.25, gameCanvas.height * 0.8, STYLES.text.GameOverScreenButton);

    // 按鈕類：回到主畫面
    gameCanvas.backToStartButtonArea = calculateButtonArea(ctx, gameCanvas.width * 0.75, gameCanvas.height * 0.8, '回到主畫面');
    drawText(ctx, '回到主畫面', gameCanvas.width * 0.75, gameCanvas.height * 0.8, STYLES.text.GameOverScreenButton);

}

