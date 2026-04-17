/**
 * 灵宝百事通 - 高性能Canvas粒子背景系统
 * 替代原来的DOM粒子方案，性能提升10倍+
 */

const ParticleSystem = {
  canvas: null,
  ctx: null,
  particles: [],
  animationId: null,
  mouseX: -9999,
  mouseY: -9999,

  // 配置参数
  config: {
    count: 60,           // 粒子数量（Canvas可以更多）
    maxRadius: 2.5,      // 最大半径
    minRadius: 0.5,      // 最小半径
    speed: 0.3,          // 基础速度
    connectDistance: 120, // 连线距离
    mouseRadius: 150,    // 鼠标影响半径
    colors: ['#6366F1', '#8B5CF6', '#F59E0B', '#3B82F6']
  },

  /**
   * 初始化粒子系统
   */
  init(container) {
    if (!container) return;

    // 创建Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // 设置尺寸
    this.resize();
    
    // 创建粒子
    this.createParticles();

    // 绑定事件
    window.addEventListener('resize', Utils.debounce(() => this.resize(), 200));
    
    // 鼠标交互（降低频率）
    document.addEventListener('mousemove', Utils.throttle((e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }, 50));

    // 检查减少动画偏好
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      this.animate();
    } else {
      // 减少动画模式：只画静态帧
      this.draw();
    }

    // 监听减少动画偏好变化
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        cancelAnimationFrame(this.animationId);
        this.draw();
      } else {
        this.animate();
      }
    });
  },

  /**
   * 调整Canvas尺寸（支持高DPI）
   */
  resize() {
    if (!this.canvas) return;
    
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // 限制最大2x
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    
    if (!rect) return;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.ctx.scale(dpr, dpr);
    
    this.width = rect.width;
    this.height = rect.height;

    // 粒子位置需要重新分布
    if (this.particles.length > 0) {
      this.particles.forEach(p => {
        if (p.x > this.width) p.x = Math.random() * this.width;
        if (p.y > this.height) p.y = Math.random() * this.height;
      });
    }
  },

  /**
   * 创建粒子数组
   */
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        radius: Math.max(this.config.minRadius, Math.random() * this.config.maxRadius),
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
        alpha: 0.3 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2, // 用于呼吸效果
        pulseSpeed: 0.01 + Math.random() * 0.02
      });
    }
  },

  /**
   * 动画主循环
   */
  animate() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  },

  /**
   * 更新粒子状态
   */
  update() {
    const { mouseRadius, speed } = this.config;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // 呼吸效果
      p.pulse += p.pulseSpeed;
      const pulseFactor = 1 + Math.sin(p.pulse) * 0.3;
      const currentAlpha = p.alpha * pulseFactor;

      // 移动
      p.x += p.vx * speed * 60 / 16.67; // 归一化到60fps
      p.y += p.vy * speed * 60 / 16.67;

      // 边界处理（环绕）
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;

      // 鼠标排斥效果
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius && dist > 0) {
        const force = (mouseRadius - dist) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * 0.02;
        p.vy -= Math.sin(angle) * force * 0.02;
        
        // 接近鼠标时增加亮度
        p.currentAlpha = Math.min(1, currentAlpha + force * 0.5);
      } else {
        p.currentAlpha = currentAlpha;
      }

      // 速度衰减，防止越飞越快
      p.vx *= 0.99;
      p.vy *= 0.99;

      // 保持最小速度
      const v = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (v < 0.1) {
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;
      }
    }
  },

  /**
   * 绘制所有粒子和连线
   */
  draw() {
    if (!this.ctx || !this.width || !this.height) return;

    const ctx = this.ctx;
    const { connectDistance } = this.config;

    // 清空画布
    ctx.clearRect(0, 0, this.width, this.height);

    // 绘制连线（先画连线，在粒子下层）
    ctx.lineWidth = 0.5;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectDistance) {
          const alpha = (1 - dist / connectDistance) * 0.15;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // 绘制粒子
    for (const p of this.particles) {
      const alpha = p.currentAlpha || p.alpha;
      
      // 发光光晕
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, p.color + Math.floor(alpha * 80).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, p.color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // 实心核心
      ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
      ctx.fill();
    }
  },

  /**
   * 停止动画循环（页面不可见时调用）
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  /**
   * 启动动画循环
   */
  start() {
    if (!this.animationId && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.animate();
    }
  },

  /**
   * 销毁粒子系统
   */
  destroy() {
    this.stop();
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
    this.particles = [];
  }
};
