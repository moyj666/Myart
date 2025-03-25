const button = document.getElementById('magic-button');
const title = document.querySelector('.title');

button.addEventListener('click', () => {
    // 随机颜色生成
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
    
    // 修改标题颜色和文本
    title.style.color = randomColor;
    title.textContent = '特效触发成功！🎉';
    
    // 按钮动画
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 300);
});