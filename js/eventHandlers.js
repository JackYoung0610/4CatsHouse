// eventHandlers.js

import { procKeyDown, procKeyUp, procClick, procRelease, procWindowResize } from './inputLogic.js';

/**
 * 註冊所有的事件監聽器。
 * @param {HTMLCanvasElement} gameCanvas - 遊戲的 gameCanvas 元素。
 */
export function addEventListeners(ctx, gameCanvas) {

    // 鍵盤事件
    document.addEventListener('keydown', (event) => handleKeyDown(ctx, gameCanvas, event));
    document.addEventListener('keyup', (event) => handleKeyUp(ctx, gameCanvas, event,));

    // 滑鼠事件
    gameCanvas.addEventListener('mousedown', (event) => handleMouseDown(ctx, gameCanvas, event));
    gameCanvas.addEventListener('mouseup', (event) => handleMouseUp(ctx, gameCanvas, event));

    // 觸控事件
    gameCanvas.addEventListener('touchstart', (event) => handleTouchStart(ctx, gameCanvas, event), false);
    gameCanvas.addEventListener('touchend', (event) => handleTouchEnd(ctx, gameCanvas, event), false);

    // 監聽視窗大小改變事件
    window.addEventListener('resize', handleWindowResize);
}

/**
 * 移除所有的事件監聽器。
 * @param {HTMLCanvasElement} gameCanvas - 遊戲的 gameCanvas 元素。
 */
export function removeEventListeners(ctx, gameCanvas) {
    // 確保 gameCanvas 存在
    if (!gameCanvas) {
        throw new Error('Canvas is not defined.');
    }

    // 鍵盤事件
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // 滑鼠事件
    gameCanvas.removeEventListener('mousedown', handleMouseDown);
    gameCanvas.removeEventListener('mouseup', handleMouseUp);

    // 觸控事件
    gameCanvas.removeEventListener('touchstart', handleTouchStart, false);
    gameCanvas.removeEventListener('touchend', handleTouchEnd, false);

    // 視窗大小改變事件
    window.removeEventListener('resize', handleWindowResize);
}

// 鍵盤事件
function handleKeyDown(ctx, gameCanvas, event) {
    
    procKeyDown(ctx, gameCanvas, event);

}

function handleKeyUp(ctx, gameCanvas, event) {

    procKeyUp(ctx, gameCanvas, event);

}

// 滑鼠事件
function handleMouseDown(ctx, gameCanvas, event) {
    const rect = gameCanvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    procClick(ctx, gameCanvas, clickX, clickY);
}

function handleMouseUp(ctx, gameCanvas, event) {
    const rect = gameCanvas.getBoundingClientRect();
    const releaseX = event.clientX - rect.left;
    const releaseY= event.clientY - rect.top;
    procRelease(ctx, gameCanvas, releaseX, releaseY);
}

// 觸控事件
function handleTouchStart(ctx, gameCanvas, event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = gameCanvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    procClick(ctx, gameCanvas, touchX, touchY);
}

function handleTouchEnd(ctx, gameCanvas, event) {
    event.preventDefault();
    // 不需要檢查 event.touches.length，因為 touchend 就表示觸摸結束
    if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0]; // 使用 changedTouches 來獲取離開的觸摸點信息
        const rect = gameCanvas.getBoundingClientRect();
        const releaseX = touch.clientX - rect.left;
        const releaseY = touch.clientY - rect.top;
        procRelease(ctx, gameCanvas, releaseX, releaseY);
    }else {
        console.log("Debug: No changed touches on touchend.");
    }
}

// 視窗大小改變事件
function handleWindowResize() {
    procWindowResize();
}

