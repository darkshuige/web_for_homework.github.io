// 页面管理器
class PageManager {
    constructor() {
        this.currentPage = null;
        this.pages = {};
        this.audio = null;
        this.isAudioPlaying = false;
        this.init();
    }

    init() {
        // 获取所有页面元素
        const pageElements = document.querySelectorAll('.page');
        pageElements.forEach(page => {
            this.pages[page.id] = page;
        });

        // 初始化音频
        this.initAudio();

        // 显示加载页面
        this.showPage('loading');

        // 模拟加载过程
        setTimeout(() => {
            this.showPage('cover');
            this.initInteractions();
            this.createParticles();
        }, 2000);

        // 初始化返回按钮事件
        this.initBackButtons();
        this.initMediaTabs();
    }

    initAudio() {
        this.audio = document.getElementById('background-music');
        const musicControl = document.getElementById('music-control');
        const musicButton = document.querySelector('.music-button');
        
        if (this.audio) {
            // 尝试自动播放音频
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isAudioPlaying = true;
                    musicButton.classList.add('playing');
                }).catch(error => {
                    console.log("音频自动播放失败:", error);
                    this.isAudioPlaying = false;
                    musicButton.classList.remove('playing');
                });
            }

            // 添加音乐控制按钮事件监听
            musicControl.addEventListener('click', () => {
                if (this.isAudioPlaying) {
                    this.audio.pause();
                    this.isAudioPlaying = false;
                    musicButton.classList.remove('playing');
                } else {
                    this.audio.play().then(() => {
                        this.isAudioPlaying = true;
                        musicButton.classList.add('playing');
                    }).catch(error => {
                        console.log("音频播放失败:", error);
                    });
                }
            });
        }
    }

    showPage(pageId) {
        // 隐藏当前页面
        if (this.currentPage) {
            this.currentPage.classList.remove('active');
        }

        // 显示新页面
        this.currentPage = this.pages[pageId];
        this.currentPage.classList.add('active');

        // 特殊处理：如果是内容页，添加粒子效果
        if (pageId !== 'cover' && pageId !== 'loading') {
            this.createPageParticles();
        }
    }

    initInteractions() {
        // 封面页下滑事件
        const coverPage = this.pages['cover'];
        let startY = 0;
        let endY = 0;

        coverPage.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });

        coverPage.addEventListener('touchend', (e) => {
            endY = e.changedTouches[0].clientY;
            if (startY > endY + 50) { // 向上滑动
                this.showPage('guide');
            }
        });

        // 鼠标滚轮事件（用于桌面测试）
        coverPage.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) { // 向下滚动
                this.showPage('guide');
            }
        });

        // 引导页点击事件
        const guideCard = document.querySelector('.option-card');
        if (guideCard) {
            guideCard.addEventListener('click', () => {
                this.showPage('options');
            });
        }

        // 选项页点击事件
        const optionItems = document.querySelectorAll('.option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = item.dataset.target;
                if (target) {
                    this.showPage(target);
                }
            });
        });

        // 内容页返回按钮
        const backButtons = document.querySelectorAll('.back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = button.dataset.back;
                if (target) {
                    this.showPage(target);
                } else {
                    // 默认返回选项页
                    this.showPage('options');
                }
            });
        });
// ... existing code ...

        // 重启按钮
        const restartButton = document.querySelector('.restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.showPage('cover');
            });
        }

        // 提交按钮
        const submitButton = document.querySelector('.submit-btn');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                const textarea = document.querySelector('textarea');
                if (textarea && textarea.value.trim() !== '') {
                    alert('感谢您的留言！');
                    textarea.value = '';
                } else {
                    alert('请输入您的留言内容');
                }
            });
        }
    }

    initBackButtons() {
        // 为所有内容页添加返回按钮功能
        const contentPages = document.querySelectorAll('.content-page, .data-page, .media-page, .animation-page, .interactive-page');
        contentPages.forEach(page => {
            if (!page.querySelector('.back-button')) {
                const header = page.querySelector('.content-header');
                if (header) {
                    const backButton = document.createElement('div');
                    backButton.className = 'back-button';
                    backButton.textContent = '← 返回';
                    backButton.dataset.back = 'options';
                    header.insertBefore(backButton, header.firstChild);
                    
                    backButton.addEventListener('click', () => {
                        this.showPage('options');
                    });
                }
            }
        });
    }

    initMediaTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有活动状态
                document.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // 添加当前活动状态
                tab.classList.add('active');
                
                // 隐藏所有媒体内容
                document.querySelectorAll('.media-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // 显示对应内容
                const tabName = tab.dataset.tab;
                if (tabName) {
                    const content = document.getElementById(`${tabName}-content`);
                    if (content) {
                        content.classList.add('active');
                    }
                }
            });
        });
    }

    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);

        // 创建粒子
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机大小
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // 随机位置
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // 随机动画延迟和持续时间
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    createPageParticles() {
        // 为内容页创建装饰性粒子
        const currentPage = this.currentPage;
        if (!currentPage.querySelector('.page-particles')) {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'page-particles';
            particlesContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 0;
            `;
            
            // 创建装饰性粒子
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    width: ${Math.random() * 8 + 2}px;
                    height: ${Math.random() * 8 + 2}px;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
                    animation-delay: ${Math.random() * 5}s;
                `;
                
                particlesContainer.appendChild(particle);
            }
            
            currentPage.appendChild(particlesContainer);
        }
    }
}

// 音频播放器功能
class AudioManager {
    constructor() {
        this.init();
    }

    init() {
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                this.togglePlay();
            });
        }
    }

    togglePlay() {
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            if (playButton.textContent === '▶️') {
                playButton.textContent = '⏸️';
                // 这里可以添加实际的音频播放逻辑
            } else {
                playButton.textContent = '▶️';
                // 这里可以添加实际的音频暂停逻辑
            }
        }
    }
}

// VR体验功能
class VRManager {
    constructor() {
        this.init();
    }

    init() {
        const vrOverlay = document.querySelector('.vr-overlay');
        if (vrOverlay) {
            vrOverlay.addEventListener('click', () => {
                alert('VR模式已启动！\n在实际应用中，这里会进入全景视图。');
            });
        }
    }
}

// 数据可视化功能
class DataVisualizer {
    constructor() {
        this.init();
    }

    init() {
        // 在实际应用中，这里会初始化图表库并渲染数据
        // 示例中使用静态图片代替
    }
}

// 动画控制器
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        // 在实际应用中，这里会控制Lottie动画或其他动画效果
        // 示例中使用静态图片代替
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化页面管理器
    const pageManager = new PageManager();
    
    // 初始化其他功能模块
    const audioManager = new AudioManager();
    const vrManager = new VRManager();
    const dataVisualizer = new DataVisualizer();
    const animationController = new AnimationController();
    
    // 全局暴露pageManager以便调试
    window.pageManager = pageManager;
});

// 添加一些全局交互功能
document.addEventListener('DOMContentLoaded', () => {
    // 添加点击波纹效果
    document.body.addEventListener('click', function(e) {
        // 创建波纹元素
        const ripple = document.createElement('div');
        const rect = document.body.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            animation: rippleEffect 0.6s linear;
        `;
        
        document.body.appendChild(ripple);
        
        // 动画结束后移除元素
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// 添加波纹动画样式
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        0% {
            width: 20px;
            height: 20px;
            opacity: 0.5;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// 处理页面可见性变化（当用户切换标签页时）
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画等操作
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面显示时恢复动画
        document.body.style.animationPlayState = 'running';
    }
});