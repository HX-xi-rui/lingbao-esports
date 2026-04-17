/**
 * 灵宝百事通 - 工具函数
 */

const Utils = {
  /**
   * 生成唯一ID
   */
  generateId() {
    return 'msg_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },
  
  /**
   * 格式化时间
   */
  formatTime(date = new Date()) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  
  /**
   * 本地存储操作
   */
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Storage error:', e);
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Storage error:', e);
      }
    }
  },

  /**
   * 防抖函数
   */
  debounce(fn, delay = 300) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },
  
  /**
   * 节流函数
   */
  throttle(fn, delay = 100) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  },
  
  /**
   * 初始化Canvas粒子系统（高性能替代DOM粒子）
   */
  initParticles(container, count = 60) {
    if (typeof ParticleSystem !== 'undefined') {
      ParticleSystem.config.count = count;
      ParticleSystem.init(container);
    } else {
      // 降级为DOM粒子（兼容模式）
      this.createParticles(container, Math.min(count / 6, 12));
    }
  },
  
  /**
   * DOM粒子降级方案（保留用于兼容）
   */
  createParticles(container, count = 8) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      container.appendChild(particle);
    }
  },
  
  /**
   * 转义HTML（防止XSS攻击）
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return String(text);
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  /**
   * 净化用户输入（深度XSS防护）
   * 移除所有潜在危险的HTML标签，保留安全格式
   */
  sanitize(text) {
    if (typeof text !== 'string') return String(text);
    
    // 先转义所有HTML
    let safe = this.escapeHtml(text);
    
    // 再恢复安全的格式标签
    safe = safe
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>');
    
    // 处理换行
    safe = safe.replace(/\n/g, '<br>');
    
    return safe;
  },
  
  /**
   * 解析Markdown增强版（带XSS防护）
   * 支持: 标题、粗体、斜体、代码、代码块、删除线、列表、引用、链接、分割线
   */
  parseSimpleMarkdown(text) {
    if (typeof text !== 'string') return this.escapeHtml(text);
    
    const hasHtml = text.includes('<') && text.includes('>');
    let processed = hasHtml ? text : this.escapeHtml(text);

    processed = processed.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
      const langLabel = lang ? `<div class="code-lang">${lang}</div>` : '';
      return `<div class="code-block">${langLabel}<pre><code>${code.trim()}</code></pre></div>`;
    });

    processed = processed.replace(/^### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
    processed = processed.replace(/^## (.+)$/gm, '<h3 class="md-h3">$1</h3>');
    processed = processed.replace(/^# (.+)$/gm, '<h2 class="md-h2">$1</h2>');

    processed = processed.replace(/^\* (.+)$/gm, '<li class="md-li">$1</li>');
    processed = processed.replace(/^- (.+)$/gm, '<li class="md-li">$1</li>');
    processed = processed.replace(/(<li class="md-li">[\s\S]*?<\/li>\n?)+/g, '<ul class="md-ul">$&</ul>');

    processed = processed.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>');
    processed = processed.replace(/(<li class="md-oli">[\s\S]*?<\/li>\n?)+/g, '<ol class="md-ol">$&</ol>');

    processed = processed.replace(/^> (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>');

    processed = processed.replace(/^---$/gm, '<hr class="md-hr">');

    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="md-link">$1</a>');

    processed = processed
      .replace(/\*\*(.+?)\*\*/g, '<strong class="md-strong">$1</strong>')
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="md-em">$1</em>')
      .replace(/`([^`\n]+)`/g, '<code class="md-code">$1</code>')
      .replace(/~~(.+?)~~/g, '<del class="md-del">$1</del>');

    processed = processed.replace(/\n/g, '<br>');

    return processed;
  },
  
  /**
   * 复制文本到剪贴板
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch {
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
  },

  /**
   * 图片懒加载（增强版：渐进式加载 + 多级回退 + 骨架屏联动）
   * 支持 data-lazy(主图), data-thumb(缩略图), data-fallback(备用图)
   * @param {string} selector - 图片选择器
   * @param {string} dataAttr - data属性名
   */
  initLazyImages(selector = '[data-lazy]', dataAttr = 'data-lazy') {
    if (!('IntersectionObserver' in window)) {
      // 不支持Observer的降级方案
      document.querySelectorAll(selector).forEach(el => this._loadImageEnhanced(el, dataAttr));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._loadImageEnhanced(entry.target, dataAttr);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '120px',
      threshold: 0.05
    });

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
    return observer;
  },

  /**
   * 单张图片增强加载（渐进式 + 多级回退 + 骨架屏隐藏）
   */
  _loadImageEnhanced(img, dataAttr) {
    const src = img.getAttribute(dataAttr);
    const thumb = img.getAttribute('data-thumb') || '';
    const fallback = img.getAttribute('data-fallback') || '';
    
    if (!src && !thumb) return;

    // 找到关联的骨架屏并标记
    const parent = img.closest('.hero-image-wrap') || img.closest('.tourism-image');
    const skeleton = parent ? parent.querySelector('.img-skeleton') : null;
    let loadState = 'pending'; // pending → thumb-loaded → loaded / failed

    // 图片加载成功处理
    const onLoaded = () => {
      if (skeleton) {
        skeleton.classList.add('skeleton-hide');
        setTimeout(() => skeleton.remove(), 350);
      }
      img.classList.add('img-loaded');
      img.style.opacity = '1';
    };

    // 加载失败重试
    const onError = (currentSrc) => {
      if (!fallback || currentSrc === fallback || currentSrc.includes('data:image/svg')) {
        // 所有源都失败了，显示错误占位图
        img.src = this._getErrorPlaceholder(img.alt || '');
        img.classList.add('img-error-state');
        onLoaded();
        return;
      }
      // 尝试用 fallback 源
      if (fallback && currentSrc !== fallback) {
        img.src = fallback;
      } else {
        img.src = this._getErrorPlaceholder(img.alt || '');
        img.classList.add('img-error-state');
        onLoaded();
      }
    };

    // 设置初始状态（透明，准备渐入）
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    // 如果有缩略图，先加载缩略图做模糊预览
    if (thumb) {
      const thumbImg = new Image();
      thumbImg.onload = () => {
        if (img.src !== src) { // 主图还没加载完
          img.src = thumb;
          img.classList.add('img-blur-preview');
          img.style.opacity = '1';
          loadState = 'thumb-loaded';
        }
      };
      thumbImg.onerror = () => {
        // 缩略图失败也无所谓，继续加载主图
      };
      thumbImg.src = thumb;
    }

    // 加载主图
    const mainImg = new Image();
    mainImg.onload = () => {
      img.src = src;
      img.classList.remove('img-blur-preview');
      onLoaded();
    };
    mainImg.onerror = () => {
      // 主图失败，尝试回退
      if (fallback && fallback !== src) {
        const fbImg = new Image();
        fbImg.onload = () => {
          img.src = fallback;
          onLoaded();
        };
        fbImg.onerror = () => {
          onError(fallback);
        };
        fbImg.src = fallback;
      } else {
        onError(src);
      }
    };
    mainImg.src = src;

    // 绑定最终错误兜底
    img.addEventListener('error', function handler(e) {
      img.removeEventListener('error', handler);
      onError(img.src);
    });

    // 移除 lazy 属性防止浏览器重复请求
    img.removeAttribute(dataAttr);
  },

  /**
   * 获取图片加载失败的 SVG 占位符
   */
  _getErrorPlaceholder(altText = '') {
    const text = altText ? Utils.escapeHtml(altText) : '\u56FE\u7247\u52A0\u8F7D\u5931\u8D25';
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231A1A2E"/><stop offset="100%" stop-color="%232D2252"/></linearGradient></defs><rect fill="url(%23bg)" width="800" height="520"/><g transform="translate(400,250)"><circle r="40" fill="none" stroke="%234B5563" stroke-width="3"/><line x1="-18" y1="18" x2="18" y2="-18" stroke="%234B5563" stroke-width="3" stroke-linecap="round"/></g><text fill="%236B7280" font-size="16" x="50%" y="78%" text-anchor="middle">${text}</text></svg>`;
  },

  /**
   * 骨架屏生成器
   */
  createSkeleton(width = '100%', height = '200px') {
    return `<div class="skeleton" style="width:${width};height:${height};background:linear-gradient(90deg,var(--bg-surface) 25%,rgba(99,102,241,0.06) 50%,var(--bg-surface) 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite;border-radius:12px;"></div>`;
  },

  /**
   * Toast 提示
   * @param {string} message - 提示文字
   * @param {string} type - 类型: 'success' | 'error' | 'warning' | 'info'
   * @param {number} duration - 持续时间(ms)
   */
  _toastTimer: null,
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) {
      console.warn('[Toast] #toast element not found');
      return;
    }
    clearTimeout(this._toastTimer);
    toast.className = 'toast';
    toast.textContent = message;
    if (type) toast.classList.add(type);
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
};

// 注入骨架屏动画样式（只执行一次）
if (!document.getElementById('skeleton-styles')) {
  const style = document.createElement('style');
  style.id = 'skeleton-styles';
  style.textContent = `
    @keyframes skeleton-shimmer { 
      0% { background-position: -200% 0; } 
      100% { background-position: 200% 0; } 
    } 
    .skeleton-loaded { animation: fadeIn 0.4s ease-out; }
  `;
  document.head.appendChild(style);
}
