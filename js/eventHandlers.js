// eventHandlers.js

import { procKeyDown, procKeyUp, procClick, procRelease, procWindowResize } from './inputLogic.js';

/**
 * 註冊所有的事件監聽器。
 * @param {HTMLCanvasElement} canvas - 遊戲的 canvas 元素。
 */
export function addEventListeners(ctx, canvas) {

    // 鍵盤事件
    document.addEventListener('keydown', (event) => handleKeyDown(ctx, canvas, event));
    document.addEventListener('keyup', (event) => handleKeyUp(ctx, canvas, event,));

    // 滑鼠事件
    canvas.addEventListener('mousedown', (event) => handleMouseDown(ctx, canvas, event));
    canvas.addEventListener('mouseup', (event) => handleMouseUp(ctx, canvas, event));

    // 觸控事件
    canvas.addEventListener('touchstart', (event) => handleTouchStart(ctx, canvas, event), false);
    canvas.addEventListener('touchend', (event) => handleTouchEnd(ctx, canvas, event), false);

    // 監聽視窗大小改變事件
    window.addEventListener('resize', handleWindowResize);
}

/**
 * 移除所有的事件監聽器。
 * @param {HTMLCanvasElement} canvas - 遊戲的 canvas 元素。
 */
export function removeEventListeners(ctx, canvas) {
    // 確保 canvas 存在
    if (!canvas) {
        throw new Error('Canvas is not defined.');
    }

    // 鍵盤事件
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // 滑鼠事件
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);

    // 觸控事件
    canvas.removeEventListener('touchstart', handleTouchStart, false);
    canvas.removeEventListener('touchend', handleTouchEnd, false);

    // 視窗大小改變事件
    window.removeEventListener('resize', handleWindowResize);
}

// 鍵盤事件
function handleKeyDown(ctx, canvas, event) {
    
    procKeyDown(ctx, canvas, event);

}

function handleKeyUp(ctx, canvas, event) {

    procKeyUp(ctx, canvas, event);

}

// 滑鼠事件
function handleMouseDown(ctx, canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    procClick(ctx, canvas, clickX, clickY);
}

function handleMouseUp(ctx, canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const releaseX = event.clientX - rect.left;
    const releaseY= event.clientY - rect.top;
    procRelease(ctx, canvas, releaseX, releaseY);
}

// 觸控事件
function handleTouchStart(ctx, canvas, event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    procClick(ctx, canvas, touchX, touchY);
}

function handleTouchEnd(ctx, canvas, event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const releaseX = touch.clientX - rect.left;
    const releaseY = touch.clientY - rect.top;
    procRelease(ctx, canvas, releaseX, releaseY);
}

// 視窗大小改變事件
function handleWindowResize() {
    procWindowResize();
}

