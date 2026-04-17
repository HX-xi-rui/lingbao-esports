/**
 * 灵宝百事通 - 主应用入口
 */

/**
 * 板块管理器 - 懒加载各板块的聊天和专属功能
 */
const BlockManager = {
  _initialized: {},

  initBlock(scenario) {
    if (!scenario) return;

    // 设置当前活跃板块
    if (typeof Chat !== 'undefined') {
      Chat.setActive(scenario);
    }

    // 恢复聊天记录
    if (typeof Chat !== 'undefined') {
      Chat.restoreMessages(scenario);
    }

    // 渲染快捷提示词
    Components.renderQuickPrompts(scenario);

    // 首次进入时初始化板块专属功能
    if (!this._initialized[scenario]) {
      this._initialized[scenario] = true;
      switch (scenario) {
        case 'competition':
          Components._renderClubsGrid();
          Components.renderBondsSection();
          break;
        case 'mentor':
          Components.renderHeroesSection();
          break;
        case 'travel':
          Components.renderTourismCards();
          break;
      }
    }

    // 重新初始化滚动动画
    setTimeout(() => Components.initScrollReveal(), 200);

    // 初始化板块内导航栏点击
    this._initBlockNav(scenario);
  },

  /**
   * 初始化板块内功能导航栏
   */
  _initBlockNav(scenario) {
    const nav = document.getElementById(`blockNav-${scenario}`);
    if (!nav || nav._navInitialized) return;
    nav._navInitialized = true;

    const overlay = document.getElementById(`block-${scenario}`);
    if (!overlay) return;

    const links = nav.querySelectorAll('.block-nav-link');
    if (links.length <= 1) return;

    // 点击导航项
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        if (!targetId) return;

        // 更新active状态
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // 滚动到目标区域
        const target = document.getElementById(targetId);
        if (target) {
          const navHeight = 64 + 48; // block-header + block-nav
          const top = target.offsetTop - navHeight;
          overlay.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // 滚动时自动更新导航高亮
    overlay.addEventListener('scroll', Utils.throttle(() => {
      const sections = [];
      links.forEach(link => {
        const tid = link.getAttribute('data-target');
        const el = document.getElementById(tid);
        if (el) sections.push({ id: tid, el, link });
      });

      const scrollTop = overlay.scrollTop;
      const navHeight = 64 + 48;
      let current = sections[0]?.id;

      for (const sec of sections) {
        if (sec.el.offsetTop - navHeight - 20 <= scrollTop) {
          current = sec.id;
        }
      }

      links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-target') === current);
      });
    }, 100));
  }
};

const App = {
  initialized: false,

  /**
   * 初始化应用
   */
  init() {
    if (this.initialized) return;

    try {
      // 加载本地存储的配置
      this.loadSavedConfig();

      // 初始化引导（首次访问）
      this.initOnboarding();

      // 初始化所有组件
      Components.initAll();

      // 初始化聊天系统
      Chat.init();

      // 绑定全局事件
      this.bindGlobalEvents();

      this.initialized = true;
      console.log('%c⚡ 灵宝百事通 v1.0 已启动', 'color: #6366F1; font-size: 14px; font-weight: bold;');

    } catch (error) {
      console.error('App initialization error:', error);
      Utils.showToast('应用初始化失败，请刷新页面重试', 'error');
    }
  },

  /**
   * 加载保存的配置
   */
  loadSavedConfig() {
    // CONFIG.apiKey 的 getter 已自动从 localStorage('hunyuan_api_key') 读取
    // 此处无需额外操作，保留兼容性
  },

  /**
   * 绑定全局事件
   */
  bindGlobalEvents() {
    // 主题切换（主页面 + 各板块）
    ['themeToggle', 'themeToggle2', 'themeToggle3', 'themeToggle4'].forEach(id => {
      const btn = document.getElementById(id);
      btn?.addEventListener('click', () => this.toggleTheme());
    });

    // 开始体验按钮 → 滚动到灵宝区域
    const startChatBtn = document.getElementById('startChatBtn');
    startChatBtn?.addEventListener('click', () => {
      Components.scrollToSection('lingbao');
    });

    // 页面可见性变化时控制粒子动画
    document.addEventListener('visibilitychange', () => {
      if (typeof ParticleSystem !== 'undefined') {
        if (document.hidden) {
          ParticleSystem.stop();
        } else {
          ParticleSystem.start();
        }
      }
    });

    // 网络状态监听：仅使用toast提示，不显示横幅
    const updateOnlineStatus = () => {
      if (!navigator.onLine) {
        Utils.showToast('网络连接已断开，AI对话将使用模拟回复模式', 'warning', 4000);
      } else {
        Utils.showToast('网络已恢复', 'success', 2000);
      }
    };
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('online', updateOnlineStatus);

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      // Ctrl+/ 或 Cmd+/ 打开/关闭配置弹窗
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        Components.showConfigModal();
      }
    });

    // 窗口大小变化时重新计算布局
    window.addEventListener('resize', Utils.debounce(() => {
      // 可以在这里处理响应式调整
    }, 250));
  },

  /**
   * 切换主题
   */
  toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    Utils.storage.set('theme', newTheme);
    
    Utils.showToast(newTheme === 'light' ? '已切换至浅色模式' : '已切换至深色模式', 'info');
  },

  /**
   * 加载保存的主题
   */
  loadSavedTheme() {
    const savedTheme = Utils.storage.get('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  },

  // ========== 首次引导 ==========
  _obCurrentSlide: 0,
  _obTotalSlides: 4,

  initOnboarding() {
    // 如果已经看过引导，不再显示
    if (Utils.storage.get('onboarding_done')) return;

    const overlay = document.getElementById('onboardingOverlay');
    if (!overlay) return;

    overlay.style.display = 'flex';

    const nextBtn = document.getElementById('obNextBtn');
    const skipBtn = document.getElementById('obSkipBtn');
    const dots = overlay.querySelectorAll('.ob-dot');

    const goToSlide = (index) => {
      const slides = overlay.querySelectorAll('.onboarding-slide');
      slides.forEach((s, i) => {
        s.classList.remove('active', 'prev');
        if (i < index) s.classList.add('prev');
        else if (i === index) s.classList.add('active');
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
      this._obCurrentSlide = index;

      if (index === this._obTotalSlides - 1) {
        if (nextBtn) nextBtn.textContent = '开始体验';
      } else {
        if (nextBtn) nextBtn.textContent = '下一步';
      }
    };

    const closeOnboarding = () => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.style.opacity = '';
        overlay.style.transition = '';
      }, 400);
      Utils.storage.set('onboarding_done', 'true');
    };

    nextBtn?.addEventListener('click', () => {
      if (this._obCurrentSlide < this._obTotalSlides - 1) {
        goToSlide(this._obCurrentSlide + 1);
      } else {
        closeOnboarding();
      }
    });

    skipBtn?.addEventListener('click', closeOnboarding);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.slide));
      });
    });
  }
};

// ========== DOM Ready 时初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  App.loadSavedTheme();
  App.init();
});
