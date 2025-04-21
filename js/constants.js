// constants.js
// 遊戲的基礎設定

//遊戲畫面縮放率
export const resolutionScaleX = 0.7;
export const resolutionScaleY = 0.7;

// 定義重力常數，用於控制跳躍物理效果
export const gravity = 0.01;

// 定義貓咪的移動速度
const catSpeed = 5;

// 定義遊戲的基礎速度，遊戲進行中速度會逐漸增加
export const baseGameSpeed = 1;

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
        itemType:'obstacle',
        shape: 'rectangle', 
        effect: 'subtractTime',
        value: 5,

        width: 40,
        height: 40,
        radius: 15,

        speedBonus:0, //物件本身的速度

        fillColor: 'rgba(250, 0, 0, 1)', 
        strokeColor:'white',
        
        yRandomSpread:50,

        generatePosition: function (canvas, background) {
                return {
                    x: canvas.width + Math.random() * canvas.width,
                    y: background.floorY  - this.height
                };
        }
    },

    mediumObstacle: {
        itemType:'obstacle',
        shape: 'circle', // 圓形
        effect: 'subtractTime',
        value: 5,

        width: 50,
        height: 50,
        radius: 10, // 圓形需要半徑

        speedBonus:0.5,

        fillColor: 'rgba(250, 0, 0, 1)', 
        strokeColor: 'white', 
        
        yRandomSpread:30,

        generatePosition: function (canvas, background) {

            const randomRange = Math.random();
            let y;

            if (randomRange < 0.60) { 
                y = background.floorY - (40 + Math.random() * this.yRandomSpread); // 範圍 1
            } else if (randomRange < 0.90) {
                y = background.floorY - (70 + Math.random() * this.yRandomSpread); // 範圍 2 
            } else { 
                y = background.floorY - (110 + Math.random() * this.yRandomSpread); // 範圍 3 
            }
            return {
                x: canvas.width + Math.random() * canvas.width,
                y: y // 隨機高度
            };
        }
    },
    largeObstacle: {
        itemType:'obstacle',
        shape: 'rectangle', // 矩形
        effect: 'subtractTime',
        value: 5,

        width: 60,
        height: 60,
        radius: 40, 

        speedBonus:0,

        fillColor: 'rgba(250, 0, 0, 1)', 
        strokeColor: 'white',
        
        yRandomSpread:50,

         generatePosition: function (canvas, background) {
                return {
                    x: canvas.width + Math.random() * canvas.width,
                    y: background.floorY  - this.height
                };
        }
    },

    //貓罐罐
    greenCan: {
        itemType:'catCan',
        shape: 'rectangle', // 矩形
        effect: 'addScore',
        value: 5,

        width: 40,
        height: 25,
         radius: 10,

         speedBonus:0,

        fillColor: 'rgba(164, 251, 135, 1)', 
        strokeColor: 'white',
        
        yRandomSpread:40,

        generatePosition: function (canvas, background) {

            const randomRange = Math.random();
            let y;

            if (randomRange < 0.70) { 
                y = background.floorY - (40 + Math.random() * this.yRandomSpread); // 範圍 1
            } else if (randomRange < 0.90) {
                y = background.floorY - (100 + Math.random() * this.yRandomSpread); // 範圍 2 
            } else { 
                y = background.floorY - (160 + Math.random() * this.yRandomSpread); // 範圍 3 
            }
            return {
                x: canvas.width + Math.random() * canvas.width,
                y: y // 隨機高度
            };
        }
    },
    blueCan: {
        itemType:'catCan',
        shape: 'rectangle', // 矩形
        effect: 'addScore',
        value: 10,

        width: 40,
        height: 25,
        radius: 10,

        speedBonus:0,

        fillColor: 'rgba(30, 70, 192, 1)',
        strokeColor: 'white',
        
        yRandomSpread:30,

        generatePosition: function (canvas, background) {
            const randomRange = Math.random();
            let y;

            if (randomRange < 0.80) { 
                y = background.floorY - (75 + Math.random() * this.yRandomSpread); // 範圍 1
            } else if (randomRange < 0.90) {
                y = background.floorY - (150 + Math.random() * this.yRandomSpread); // 範圍 2 
            } else { 
                y = background.floorY - (50 + Math.random() * this.yRandomSpread); // 範圍 3 
            }
            return {
                x: canvas.width + Math.random() * canvas.width,
                y:y // 隨機高度
            };
        }
    },
    goldCan: {
        itemType:'catCan',
        shape: 'rectangle', // 矩形
        effect: 'addScore',
        value: 20,

        width: 30,
        height: 20,
        radius: 10,

        speedBonus:0.3,

        fillColor: 'rgba(255, 215, 0, 1)',
        strokeColor: 'white',
       
        yRandomSpread:20,

        generatePosition: function (canvas, background) {
            const randomRange = Math.random();
            let y;

            if (randomRange < 0.80) { 
                y = background.floorY - (180 + Math.random() * this.yRandomSpread); // 範圍 1
            } else if (randomRange < 0.95) {
                y = background.floorY - (130 + Math.random() * this.yRandomSpread); // 範圍 2 
            } else { 
                y = background.floorY - (80 + Math.random() * this.yRandomSpread); // 範圍 3 
            }
            return {
                x: canvas.width + Math.random() * canvas.width,
                y: y // 隨機高度
            };
        }
    }   
};

