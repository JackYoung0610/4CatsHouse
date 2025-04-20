// utils.js

// =========================
// 分數管理相關函式
// =========================

/**
 * 取得歷史最高分。
 * @returns {number} 歷史最高分。
 */
export function getHighScore() {
    try {
        const storedHighScore = localStorage.getItem('highScore');
        return storedHighScore ? parseInt(storedHighScore) : 0;
    } catch (error) {
        console.error('Error accessing localStorage for highScore:', error);
        return 0; // 返回預設值
    }
}

/**
 * 設定歷史最高分。
 * @param {number} score - 要儲存的分數。
 */
export function setHighScore(score) {
    try {
        localStorage.setItem('highScore', score);
    } catch (error) {
        console.error('Error saving highScore to localStorage:', error);
    }
}

// =========================
// 按鈕相關函式
// =========================

/**
 * 計算按鈕的點擊區域。
 * @param {CanvasRenderingContext2D} ctx - Canvas 的 2D 繪圖上下文。
 * @param {number} x - 按鈕中心的 X 座標。
 * @param {number} y - 按鈕中心的 Y 座標。
 * @param {string} text - 按鈕上的文字。
 * @param {number} [paddingX=30] - X 軸的額外邊距。
 * @param {number} [paddingY=15] - Y 軸的額外邊距。
 * @returns {Object} 按鈕的區域資訊。
 */
export function calculateButtonArea(ctx, x, y, text, paddingX = 30, paddingY = 15) {
    const textWidth = ctx.measureText(text).width;
    const textHeight = 20; // 與字體大小相關，可調整
    return {
        x: x - textWidth / 2 - paddingX,
        y: y - textHeight / 2 - paddingY,
        width: textWidth + 2 * paddingX,
        height: textHeight + 2 * paddingY
    };
}

/**
 * 檢查點擊是否在矩形內。
 * @param {number} x - 點擊的 X 座標。
 * @param {number} y - 點擊的 Y 座標。
 * @param {Object} rect - 矩形的資訊，包含 x, y, width, height。
 * @returns {boolean} 如果點擊在矩形內，返回 true，否則返回 false。
 */
export function isInsideRectangle(x, y, rect) {
    return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
}

// =========================
// 碰撞檢測相關函式
// =========================

/**
 * 檢查兩個物件是否發生碰撞。
 * @param {Object} obj1 - 第一個物件，包含形狀、位置和尺寸資訊。
 * @param {Object} obj2 - 第二個物件，包含形狀、位置和尺寸資訊。
 * @returns {boolean} 如果兩個物件發生碰撞，返回 true，否則返回 false。
 */
export function isColliding(obj1, obj2) {
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
 * @param {Object} rect1 - 第一個矩形，包含 x, y, width, height。
 * @param {Object} rect2 - 第二個矩形，包含 x, y, width, height。
 * @returns {boolean} 如果發生碰撞，返回 true。
 */
export function isRectangleColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

/**
 * 檢查兩個圓形是否發生碰撞。
 * @param {Object} circle1 - 第一個圓形，包含 x, y, radius。
 * @param {Object} circle2 - 第二個圓形，包含 x, y, radius。
 * @returns {boolean} 如果發生碰撞，返回 true。
 */
export function isCircleColliding(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

/**
 * 檢查矩形與圓形是否發生碰撞。
 * @param {Object} rect - 矩形，包含 x, y, width, height。
 * @param {Object} circle - 圓形，包含 x, y, radius。
 * @returns {boolean} 如果發生碰撞，返回 true。
 */
export function isRectangleCircleColliding(rect, circle) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy < circle.radius * circle.radius;
}

/**
 * 檢查兩個物件是否太接近。
 * @param {Object} obj1 - 第一個物件，包含 x, y, width, height。
 * @param {Object} obj2 - 第二個物件，包含 x, y, width, height。
 * @param {number} minDistance - 最小距離。
 * @returns {boolean} 如果太接近，返回 true。
 */
export function isTooClose(obj1, obj2, minDistance) {
    const dx = Math.abs(obj1.x - obj2.x);
    const dy = Math.abs(obj1.y - obj2.y);
    const combinedWidth = (obj1.width + obj2.width) / 2;
    const combinedHeight = (obj1.height + obj2.height) / 2;

    return dx < combinedWidth + minDistance && dy < combinedHeight + minDistance;
}
