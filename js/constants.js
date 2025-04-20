// constants.js
// 遊戲的基礎設定

// 定義重力常數，用於控制跳躍物理效果
export const gravity = 0.1;

// 定義貓咪的移動速度
export const catSpeed = 5;

// 定義遊戲的基礎速度，遊戲進行中速度會逐漸增加
export const baseGameSpeed = 2;

// 文字樣式定義
export const STYLES = {
    text: {
        // 主畫面標題樣式
        StartScreenMainTitle: { font: '48px sans-serif', color: 'black', textAlign: 'center' },
        // 主畫面按鈕樣式
        StartScreenButton: { font: '24px sans-serif', color: 'black', textAlign: 'center' },
        // 主畫面狀態文字樣式
        StartScreenStatus: { font: '20px sans-serif', color: 'black', textAlign: 'start' },
        // 遊戲畫面狀態文字樣式
        GameScreenStatus: { font: '20px sans-serif', color: 'black', textAlign: 'start' },
        // 結算畫面按鈕樣式
        GameOverScreenButton: { font: '24px sans-serif', color: 'white', textAlign: 'center' },
        // 結算畫面訊息樣式
        GameOverScreenMessage: { font: '32px sans-serif', color: 'white', textAlign: 'center' }
    }
};

// 遊戲物件類型
export const objectTypes = {
    //障礙物
    smallObstacle: {
        effect: 'subtractTime',
        value: 10,
        width: 60,
        height: 30,
        color: 'black', // 小障礙物顏色
        radius: 0, 
        shape: 'rectangle', // 矩形
        generatePosition: (canvas, background) => ({
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
        generatePosition: (canvas, background) => ({
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
        generatePosition: (canvas, background) => ({
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
        generatePosition: (canvas, background) => ({
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
        generatePosition: (canvas, background) => ({
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
        generatePosition: (canvas, background) => ({
            x: canvas.width + Math.random() * 300,
            y: background.floorY - 20 - 10 // 稍微高於地面
        })
    }
};

