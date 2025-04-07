// 佛经语录库
const quotes = [
    "南无阿弥陀佛",
    "善哉善哉",
    "功德+1",
    "福报满满",
    "菩萨保佑",
    "六时吉祥"
];

// 获取元素
const muyuBtn = document.getElementById('muyu-btn');
const countDisplay = document.getElementById('count');
let count = 0;

// 播放音效（使用本地文件）
const playSound = () => {
    const audio = new Audio('audio/muyu.mp3');
    audio.play().catch(e => console.log("请先点击页面激活音频"));
};

// 显示随机语录
const showRandomQuote = () => {
    const quoteContainer = document.getElementById('quote-container');
    const quote = document.createElement('div');
    quote.className = 'quote';
    quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    quoteContainer.innerHTML = '';
    quoteContainer.appendChild(quote);

       // 触发动画
       setTimeout(() => {
        quoteContainer.style.opacity = 1;
        setTimeout(() => {
            quoteContainer.style.opacity = 0;
        }, 1500);
    }, 10);
};
// 点击事件（仅绑定到木鱼图标）
document.getElementById('muyu-icon').addEventListener('click', function() {
    // 更新计数器
    count++;
    document.getElementById('count').textContent = count;
    
    // 播放音效
    playSound();
    
    // 显示语录
    const quote = document.createElement('div');
    quote.className = 'quote';
    quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-container').appendChild(quote);
    
    // 点击动画
    this.style.transform = 'scale(0.9) rotate(5deg)';//合并旋转
    setTimeout(() => {
        this.style.transform = '';//清空让hover样式接管
    }, 100);
    
    // 3秒后移除语录DOM（避免堆积）
    setTimeout(() => {
        quote.remove();
    }, 2000);
});

/* 
  注意：浏览器可能会阻止自动播放音频，
  需要用户先与页面交互（如点击任意位置）
*/

// 粒子系统配置
let particleSystem = null;

function createParticles(x, y) {
    // 清除旧粒子
    if (particleSystem) {
        particleSystem.destroy();
    }

    // 生成新粒子
    particleSystem = new ParticleSystem({
        position: { x, y },
        colors: ['#FFD700', '#FFA500'],
        count: 15,
        size: { min: 2, max: 6 },
        speed: { min: 2, max: 5 },
        lifespan: 1.5 // 粒子存活1.5秒
    });
}

// 粒子系统类（新增代码）
class ParticleSystem {
    constructor(options) {
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // 初始化粒子
        for (let i = 0; i < options.count; i++) {
            this.particles.push({
                x: options.position.x,
                y: options.position.y,
                color: options.colors[Math.floor(Math.random() * options.colors.length)],
                size: Math.random() * (options.size.max - options.size.min) + options.size.min,
                speedX: (Math.random() - 0.5) * 4,
                speedY: -Math.random() * options.speed.max,
                life: options.lifespan,
                alpha: 1
            });
        }

        this.gravity = 0.15; // 重力加速度
        this.particles = [];
        
        for (let i = 0; i < options.count; i++) {
            this.particles.push({
                x: options.position.x,
                y: options.position.y,
                color: options.colors[Math.floor(Math.random() * options.colors.length)],
                size: Math.random() * (options.size.max - options.size.min) + options.size.min,
                speedX: (Math.random() - 0.5) * 6,  // 更宽的横向分散
                speedY: -Math.random() * options.speed.max * 1.5, // 更强的初始向上速度
                life: options.lifespan,
                alpha: 1
            });
        }
        // 开始动画
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        let aliveParticles = 0;
        
        this.particles.forEach(p => {
             // 应用重力（Y轴速度逐渐减小然后反向）
             p.speedY += this.gravity;
            
             // 更新位置
             p.x += p.speedX;
             p.y += p.speedY;
             p.life -= 0.016; // 每帧减少约16ms（60FPS）
             p.alpha = p.life / 1.5; // 同步改为1.5秒渐隐

            // 绘制存活的粒子
            if (p.life > 0) {
                aliveParticles++;
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // 如果还有存活粒子，继续动画
        if (aliveParticles > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.destroy();
        }
    }

    destroy() {
        this.canvas.remove();
        particleSystem = null;
    }
}

// 修改点击事件
document.getElementById('muyu-icon').addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    createParticles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    );
});


// 初始化
const lanes = [1, 2, 3, 4];
const carColors = ['#FF5252', '#448AFF', '#FFC107', '#4CAF50'];
const carTypes = ['sedan', 'truck', 'van'];
let currentLane = 2;
const runner = document.querySelector('.runner');

// 确保DOM加载后立即设置
document.addEventListener('DOMContentLoaded', () => {
    currentLane = 2;
    document.querySelector('.runner').style.top = '75px';
});

// 游戏状态控制
let isGameOver = false;

// 生成随机车辆
function spawnCar() {
    if (isGameOver) return;

    const lane = lanes[Math.floor(Math.random() * 4)];
    const car = document.createElement('div');
    car.className = 'car';
    car.style.top = `${(lane - 1) * 50 + 10}px`; // 10px垂直间距
    car.style.animationDuration = `${2 + Math.random() * 3}s`;
    
    document.querySelector('.road-container').appendChild(car);
    
    // 移除超出屏幕的车辆
    car.addEventListener('animationend', () => car.remove());
    car.style.background = carColors[Math.floor(Math.random() * 4)];
    car.classList.add(carTypes[Math.floor(Math.random() * 3)]);
}

// 每1.5秒生成一辆车
setInterval(spawnCar, 2000);

// 键盘控制上下换道
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    if (e.key === 'ArrowUp' && currentLane > 1) {
        currentLane--;
        runner.style.top = `${(currentLane - 1) * 50 + 10}px`;
    }
    if (e.key === 'ArrowDown' && currentLane < 4) {
        currentLane++;
        runner.style.top = `${(currentLane - 1) * 50 + 10}px`;
    }
});

// 碰撞检测
function checkCollision() {
    if (isGameOver) return;
    
    const runnerRect = runner.getBoundingClientRect();
    document.querySelectorAll('.car').forEach(car => {
        if (isColliding(car.getBoundingClientRect(), runnerRect)) {
            isGameOver = true;
            gameOver();
        }
    });
}


function isColliding(carRect, runnerRect) {
    // 车道范围检测（Y轴±20px为有效碰撞区域）
    const laneHeight = 50;
    const runnerLane = Math.floor((runnerRect.top - 5) / laneHeight) + 1;
    const carLane = Math.floor((carRect.top - 5) / laneHeight) + 1;
    
    // 必须在同一车道才检测X轴碰撞
    if (runnerLane !== carLane) return false;
    
    // X轴碰撞检测
    return !(carRect.right < runnerRect.left || carRect.left > runnerRect.right);
}

// 游戏结束，重置游戏
function gameOver() {
    const gameOverDiv = document.querySelector('.game-over');
    gameOverDiv.style.display = 'flex';
    
    setTimeout(() => {
        gameOverDiv.style.display = 'none';
        resetGame();
    }, 2000);
}

function resetGame() {
    isGameOver = false;
    // 移除所有车辆
    document.querySelectorAll('.car').forEach(car => car.remove());
    // 重置玩家位置
    currentLane = 2;
    runner.style.top = '75px';
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    resetGame();
    setInterval(spawnCar, 1500);
    setInterval(checkCollision, 100);
});

