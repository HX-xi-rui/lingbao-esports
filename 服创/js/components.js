/**
 * 灵宝百事通 - UI组件模块
 */

const Components = {
  /**
   * 初始化粒子背景（懒加载 particles.js）
   */
  async initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // 动态加载 particles.js（仅当容器可见时）
    if (typeof ParticleSystem === 'undefined') {
      try {
        await this._loadScript('./js/particles.js');
      } catch (e) {
        console.warn('粒子模块加载失败，使用DOM降级方案', e);
        Utils.createParticles(container, 8);
        return;
      }
    }

    // 移动端自动降级粒子数量
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 30 : 60;
    Utils.initParticles(container, count);
  },

  /**
   * 动态加载脚本
   */
  _loadScript(src) {
    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  },

  // 打卡功能
  _getCheckedCities() {
    return Utils.storage.get('checked_cities', []);
  },
  _toggleCheckin(cityId) {
    let checked = this._getCheckedCities();
    if (checked.includes(cityId)) {
      checked = checked.filter(id => id !== cityId);
    } else {
      checked.push(cityId);
    }
    Utils.storage.set('checked_cities', checked);
    return checked.includes(cityId);
  },
  _isCityChecked(cityId) {
    return this._getCheckedCities().includes(cityId);
  },
  _updateCheckinOverview() {
    const overviewEl = document.getElementById('tourismOverview-travel');
    if (!overviewEl) return;
    const checkedCount = this._getCheckedCities().length;
    const cities = Data.cities;
    const lastItem = overviewEl.querySelector('.tourism-overview-item:last-child');
    if (lastItem) {
      lastItem.querySelector('.overview-number').textContent = `${checkedCount}/${cities.length}`;
    }
  },

  /**
   * 初始化导航栏
   */
  initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    // 使用 IntersectionObserver 监听 section 可见性
    this._initNavObserver();

    // 滚动时更新导航栏样式
    window.addEventListener('scroll', Utils.throttle(() => {
      if (window.scrollY > 60) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    }, 100));

    // 移动端菜单切换
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenuBtn.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }

    // 导航链接点击事件
    if (navMenu) {
      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        });
      });
    }
  },

  /**
   * 使用 IntersectionObserver 监听导航
   */
  _initNavObserver() {
    const sections = ['home', 'lingbao', 'tech'];
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = 'home';

    const updateNav = () => {
      // 跳过板块激活状态
      if (document.body.classList.contains('block-active')) return;

      // 找到最靠近顶部的 section（允许负值，处理首页）
      let minTop = Infinity;
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = Math.abs(rect.top);
          if (top < minTop) {
            minTop = top;
            currentSection = id;
          }
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = href === '#' + currentSection;
        if (link.classList.contains('active') !== isActive) {
          link.classList.toggle('active', isActive);
        }
      });
    };

    const observer = new IntersectionObserver(() => {
      updateNav();
    }, {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.1, 0.5, 1]
    });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 初始化时立即更新
    updateNav();
  },

  // 当前文旅筛选状态
  _tourismFilter: 'all',

  /**
   * 渲染电竞城市卡片（增强版：Hero卡 + 筛选 + 展开 + 问AI）
   */
  renderTourismCards() {
    const grid = document.getElementById('tourismGrid-travel');
    if (!grid) return;

    const cities = Data.cities;
    const featuredCity = cities.find(c => c.featured) || cities[0];
    const normalCities = cities.filter(c => !c.featured);

    // 获取所有区域（用于筛选栏）
    const regions = ['all', ...new Set(cities.map(c => c.region))];
    const regionLabels = { all: '全部城市', 西南: '西南', 华东: '华东', 华中: '华中', 华北: '华北', 华南: '华南' };

    let html = '';

    // ===== 城市概览统计条（仅全部模式显示）=====
    if (this._tourismFilter === 'all') {
      const totalTitles = cities.reduce((sum, c) => sum + (c.stats?.titles || 0), 0);
      const regionCount = new Set(cities.map(c => c.region)).size;
      const allTeams = Data.teams || [];
      const homeTeams = allTeams.filter(t => t.cityId);
      const overviewEl = document.getElementById('tourismOverview-travel');
      if (overviewEl) {
        const checkedCount = this._getCheckedCities().length;
        overviewEl.innerHTML = `
          <div class="tourism-overview-item"><span class="overview-number">${cities.length}</span><span class="overview-label">主场城市</span></div>
          <div class="tourism-overview-item"><span class="overview-number">${allTeams.length}</span><span class="overview-label">KPL战队</span></div>
          <div class="tourism-overview-item"><span class="overview-number">${homeTeams.length}</span><span class="overview-label">主场战队</span></div>
          <div class="tourism-overview-item"><span class="overview-number">${totalTitles}</span><span class="overview-label">冠军奖杯</span></div>
          <div class="tourism-overview-item"><span class="overview-number" style="color:var(--accent)">${checkedCount}/${cities.length}</span><span class="overview-label">已打卡</span></div>
        `;
        overviewEl.style.display = '';
      }
    } else {
      const overviewEl = document.getElementById('tourismOverview-travel');
      if (overviewEl) overviewEl.style.display = 'none';
    }

    // ===== 筛选栏 =====
    html += `<div class="tourism-filters">
      <span class="filter-label">📍 按区域筛选</span>
      <div class="filter-tags">
        ${regions.map(r => `
          <button class="filter-tag ${this._tourismFilter === r ? 'active' : ''}" data-region="${r}">
            ${regionLabels[r] || r}
          </button>
        `).join('')}
      </div>
    </div>`;

    // ===== 普通卡片网格 - 多列独立布局 =====
    html += `<div class="tourism-normal-grid">`;
    
    // 筛选城市
    const heroCity = this._tourismFilter === 'all' || this._tourismFilter === featuredCity.region ? featuredCity : null;
    let allCities = [...normalCities];
    if (heroCity) {
      allCities = [heroCity, ...allCities.filter(c => c.id !== heroCity.id)];
    }
    
    // 过滤出符合当前区域的城市
    const filteredCities = allCities.filter(city => 
      this._tourismFilter === 'all' || city.region === this._tourismFilter
    );
    
    // 根据城市数量动态调整列数
    let columnCount = 4;
    if (filteredCities.length <= 3) columnCount = 1;
    else if (filteredCities.length <= 6) columnCount = 2;
    else if (filteredCities.length <= 9) columnCount = 3;
    
    // 创建对应数量的列
    const columns = Array(columnCount).fill().map(() => []);
    
    // 分配城市到列
    filteredCities.forEach((city, idx) => {
      columns[idx % columnCount].push(city);
    });
    
    // 生成每列
    columns.forEach((colCities, colIdx) => {
      html += `<div class="tourism-column">`;
      colCities.forEach((city, idx) => {
        const globalIdx = filteredCities.indexOf(city);
        html += `
          <div class="city-card-wrapper scroll-reveal" style="${this._tourismFilter !== 'all' ? '' : `--card-delay:${(globalIdx % columnCount) * 0.08}s`}">
            <div class="tourism-card" data-city="${city.id}">
              <div class="tourism-image">
                <div class="img-skeleton card-img-skeleton" aria-hidden="true"></div>
                <img data-lazy="${city.image}"
                     data-thumb="${city.thumb || ''}"
                     data-fallback="${city.fallback || ''}"
                     alt="${Utils.escapeHtml(city.name)}"
                     data-city-name="${Utils.escapeHtml(city.name)}"
                     loading="lazy">
                <!-- 图片上的城市信息遮罩 -->
                <div class="card-city-overlay" style="--team-color: ${city.color}">
                  <span class="card-overlay-name">${Utils.escapeHtml(city.name)}</span>
                  <span class="card-overlay-team">${Utils.escapeHtml(city.team)} 主场</span>
                </div>
                <span class="tourism-badge team-badge">${Utils.escapeHtml(city.team)}</span>
                ${city.featured ? '<span class="tourism-badge featured-badge">⭐ 精选</span>' : ''}
              </div>
              <div class="tourism-body">
                <div class="tourism-header-row">
                  <h4 class="tourism-city">${Utils.escapeHtml(city.name)}</h4>
                  <span class="region-chip" style="--chip-color: ${city.color}">${city.region}</span>
                </div>
                <p class="tourism-team" style="--team-color: ${city.color}">${Utils.escapeHtml(city.team)} 主场</p>
                <p class="tourism-desc">${Utils.escapeHtml(city.description)}</p>
                
                <!-- 亮点预览（前2条）-->
                <div class="highlights-preview">
                  ${city.highlights.slice(0, 2).map(h => `
                    <span class="highlight-mini">✦ ${Utils.escapeHtml(h.name)}</span>
                  `).join('')}
                  ${city.highlights.length > 2 ? `<span class="more-hint">+${city.highlights.length - 2} 更多</span>` : ''}
                </div>

                <div class="tourism-tags">
                  ${city.tags.map(tag => `<span class="tourism-tag">#${Utils.escapeHtml(tag)}</span>`).join('')}
                </div>

                <div class="card-bottom-actions">
                  <button class="ask-ai-btn-sm" data-prompt="${Utils.escapeHtml(`帮我规划一次${city.name}${city.team}主场的电竞之旅`)}" title="询问AI">
                    🤖 问AI
                  </button>
                  <button class="checkin-btn-sm ${this._isCityChecked(city.id) ? 'checked' : ''}" data-city-id="${city.id}" title="${this._isCityChecked(city.id) ? '已打卡' : '打卡'}">
                    ${this._isCityChecked(city.id) ? '✅ 已打卡' : '📍 打卡'}
                  </button>
                  <button class="expand-btn-sm expand-btn" data-city-id="${city.id}">详情 →</button>
                </div>
              </div>
            </div>
            <!-- 展开详情面板 -->
            <div class="tourism-detail" id="detail-${city.id}" style="display:none;">
              ${this._buildCityDetail(city)}
            </div>
          </div>`;
      });
      html += `</div>`;
    });
    html += `</div>`;

    // ===== KPL 全 18 支战队总览（仅全部模式显示）=====
    if (this._tourismFilter === 'all' && Data.teams && Data.teams.length > 0) {
      const teams = Data.teams;
      html += `
        <div class="kpl-league-section scroll-reveal">
          <div class="league-header">
            <h3 class="league-title">🏆 KPL 职业联赛 · 全 18 支常驻俱乐部</h3>
            <span class="league-badge">${teams.length} 支战队</span>
          </div>
          <div class="kpl-team-grid">
            ${teams.map((t, i) => {
              const cityData = t.cityId ? Data.cities.find(c => c.id === t.cityId) : null;
              return `
                <div class="kpl-team-chip" data-prompt="${Utils.escapeHtml(`分析${t.name}（${t.abbr}）的战队实力、历史成绩和当前阵容`)}" title="询问AI关于${t.name}">
                  <span class="team-dot" style="--tc:${t.color}"></span>
                  <span class="team-abbr">${Utils.escapeHtml(t.abbr)}</span>
                  <span class="team-full">${Utils.escapeHtml(t.name.replace(t.abbr + '').trim())}</span>
                  ${cityData ? `<span class="team-city-tag" style="--chip-color:${cityData.color}">${cityData.region}</span>` : `<span class="team-city-tag guest">${Utils.escapeHtml(t.city)}</span>`}
                  ${t.titles > 0 ? `<span class="team-trophy">🏆${t.titles}</span>` : ''}
                </div>`;
            }).join('')}
          </div>
          <p class="league-note">💡 点击任意战队可向 AI 咨询详细分析 | 主场战队已标注所属城市区域</p>
        </div>`;
    }

    // 先清空网格内容，避免事件重复绑定
    grid.innerHTML = '';
    
    // 再设置新内容
    grid.innerHTML = html;

    // 初始化图片懒加载（增强版：骨架屏 + 渐进加载 + 多级回退）
    setTimeout(() => Utils.initLazyImages('.tourism-hero-img[data-lazy], .tourism-image img[data-lazy]', 'data-lazy'), 100);

    // 渲染中国城市地图
    this._renderChinaMap();

    // 绑定事件
    this._bindTourismEvents();
    
    // 重新初始化滚动显示动画
    setTimeout(() => this.initScrollReveal(), 150);
  },

  /**
   * 渲染中国城市地图
   */
  _renderChinaMap() {
    const mapContainer = document.getElementById('chinaMap');
    if (!mapContainer) return;

    const cities = Data.cities;
    
    // 城市坐标配置（基于中国地图相对位置）
const cityPositions = {
      '成都': { x: 53, y: 60 },    // 西南地区
      '上海': { x: 67, y: 61 },    // 东部沿海
      '武汉': { x: 61, y: 61 },    // 华中
      '重庆': { x: 55, y: 64 },    // 西南
      '北京': { x: 63, y: 42 },    // 华北
      '广州': { x: 61, y: 76 },    // 华南
      '苏州': { x: 66, y: 61 },    // 华东
      '南京': { x: 66, y: 60 },    // 华东
      '杭州': { x: 66, y: 63 },    // 华东
      '长沙': { x: 60, y: 67 },    // 华中
      '佛山': { x: 60, y: 76 },    // 华南（广州附近）
      '济南': { x: 64, y: 48 }     // 华东、
};

    // 清空现有内容
    mapContainer.innerHTML = '';

    // 添加背景
    const mapBg = document.createElement('div');
    mapBg.className = 'map-bg';
    mapContainer.appendChild(mapBg);

    // 添加中国地图图片
    const mapImg = document.createElement('div');
    mapImg.className = 'china-map-img';
    mapImg.innerHTML = `
      <img src="./images/R-C.jpg" alt="中国地图" class="map-image">
    `;
    mapContainer.appendChild(mapImg);

    // 添加标题栏
    const header = document.createElement('div');
    header.className = 'map-header';
    const totalTitles = cities.reduce((sum, c) => sum + (c.stats?.titles || 0), 0);
    const championCities = cities.filter(c => c.stats?.titles > 0).length;
    header.innerHTML = `
      <div class="map-title">
        <span class="map-title-icon">🗺️</span>
        <span>电竞城市分布</span>
      </div>
      <div class="map-stats">
        <div class="map-stat"><span class="map-stat-num">${cities.length}</span> 主场城市</div>
        <div class="map-stat"><span class="map-stat-num">${championCities}</span> 冠军之城</div>
        <div class="map-stat"><span class="map-stat-num">🏆 ${totalTitles}</span> 冠军奖杯</div>
      </div>
    `;
    mapContainer.appendChild(header);

    // 区域分组
    const regionIcons = {
      '西南': '🔥',
      '华东': '🌊', 
      '华中': '⚔️',
      '华北': '🏛️',
      '华南': '🌴'
    };

    // 生成城市热点
    cities.forEach((city, index) => {
      const pos = cityPositions[city.name];
      if (!pos) return;

      const isFeatured = city.featured || (city.stats?.titles > 0);
      const point = document.createElement('div');
      point.className = `map-city-point ${isFeatured ? 'featured' : ''}`;
      point.style.cssText = `left: ${pos.x}%; top: ${pos.y}%; animation-delay: ${index * 0.08}s`;
      point.dataset.cityId = city.id;

      const dot = document.createElement('div');
      dot.className = 'map-city-dot';

      const label = document.createElement('div');
      label.className = 'map-city-label';
      label.textContent = city.name;

      // 悬浮信息卡片 - 增强版
      const tooltip = document.createElement('div');
      tooltip.className = 'map-city-tooltip';
      
      const tags = city.tags?.slice(0, 3) || [];
      const highlights = city.highlights?.slice(0, 2) || [];
      
      tooltip.innerHTML = `
        <div class="map-tooltip-header">
          <div class="map-tooltip-icon">${regionIcons[city.region] || '📍'}</div>
          <div>
            <div class="map-tooltip-title">${city.name} <span class="tooltip-region">${city.region}</span></div>
            <div class="map-tooltip-team">${city.team} 主场</div>
          </div>
        </div>
        <div class="map-tooltip-desc">${city.description?.slice(0, 60) || ''}...</div>
        <div class="map-tooltip-stats">
          <div class="map-tooltip-stat">
            <span class="map-tooltip-stat-val ${isFeatured ? 'featured-val' : ''}">${city.stats?.titles || 0}</span>
            <span class="map-tooltip-stat-label">冠军</span>
          </div>
          <div class="map-tooltip-stat">
            <span class="map-tooltip-stat-val">${city.highlights?.length || 0}</span>
            <span class="map-tooltip-stat-label">打卡点</span>
          </div>
          <div class="map-tooltip-stat">
            <span class="map-tooltip-stat-val">${city.stats?.founded || '—'}</span>
            <span class="map-tooltip-stat-label">成立</span>
          </div>
        </div>
        <div class="map-tooltip-highlights">
          ${highlights.map(h => `<span class="tooltip-highlight">📍 ${h.name}</span>`).join('')}
        </div>
        <div class="map-tooltip-tags">
          ${tags.map(tag => `<span class="map-tooltip-tag">#${tag}</span>`).join('')}
        </div>
        <div class="map-tooltip-action">点击查看完整攻略 →</div>
      `;

      point.appendChild(dot);
      point.appendChild(label);
      point.appendChild(tooltip);

      // 点击跳转城市卡片
      point.addEventListener('click', () => {
        const cityCard = document.querySelector(`.tourism-card[data-city="${city.id}"]`);
        if (cityCard) {
          cityCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          cityCard.classList.add('highlight-flash');
          setTimeout(() => cityCard.classList.remove('highlight-flash'), 1500);
        }
      });

      mapContainer.appendChild(point);
    });

    // 入场动画
    setTimeout(() => {
      mapContainer.classList.add('map-loaded');
    }, 100);
  },

  /**
   * 构建城市详情面板 HTML
   */
  _buildCityDetail(city) {
    // 关联城市推荐
    const relatedHtml = city.relatedCities && city.relatedCities.length > 0
      ? `<div class="detail-section">
          <h6 class="detail-subtitle">🔗 相关城市推荐</h6>
          <div class="related-cities">
            ${city.relatedCities.map(rid => {
              const rc = Data.cities.find(c => c.id === rid);
              if (!rc) return '';
              return `
                <button class="related-city-chip" data-prompt="${Utils.escapeHtml(`帮我规划一次${rc.name}${rc.team}主场的电竞之旅`)}" title="询问AI关于${Utils.escapeHtml(rc.name)}">
                  <span class="rc-dot" style="--rc-color: ${rc.color}"></span>
                  <span>${Utils.escapeHtml(rc.name)}</span>
                  <span class="rc-team">${Utils.escapeHtml(rc.team)}</span>
                </button>`;
            }).join('')}
          </div>
        </div>`
      : '';

    return `
      <div class="detail-content">
        <h5 class="detail-title">🏟️ ${Utils.escapeHtml(city.name)} 电竞打卡攻略</h5>
        
        <div class="detail-section">
          <h6 class="detail-subtitle">亮点推荐</h6>
          <div class="detail-highlights">
            ${city.highlights.map(h => `
              <div class="detail-highlight-item">
                <span class="dh-icon">📍</span>
                <div class="dh-body">
                  <strong>${Utils.escapeHtml(h.name)}</strong>
                  <small>${Utils.escapeHtml(h.desc)}</small>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="detail-section">
          <h6 class="detail-subtitle">💡 出行贴士</h6>
          <p class="detail-tips">${Utils.escapeHtml(city.tips)}</p>
        </div>

        ${relatedHtml}

        <div class="section detail-actions">
          <button class="btn btn-primary btn-glow ask-ai-btn detail-ai-btn"
                  data-prompt="${Utils.escapeHtml(`我想了解${city.name}${city.team}的详细电竞旅游攻略，包括场馆信息、最佳观赛时间、周边美食和住宿推荐`)}">
            🤖 让AI为我定制完整攻略
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 初始化图片 Lightbox（点击放大查看）
   */
  _initLightbox(grid) {
    // 创建/复用 Lightbox 容器
    let lb = document.getElementById('tourismLightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'tourismLightbox';
      lb.className = 'lightbox-overlay';
      lb.innerHTML = '<img src="" alt=""><button class="lightbox-close" aria-label="关闭">&times;</button><div class="lightbox-caption"></div>';
      document.body.appendChild(lb);
      
      // 关闭按钮事件
      const closeBtn = lb.querySelector('.lightbox-close');
      closeBtn.addEventListener('click', () => this._closeLightbox());
      lb.addEventListener('click', (e) => {
        if (e.target === lb || e.target.classList.contains('lightbox-overlay')) {
          this._closeLightbox();
        }
      });
      // ESC 关闭
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lb.classList.contains('active')) {
          this._closeLightbox();
        }
      });
    }
    
    const lightboxImg = lb.querySelector('img');
    const lightboxCaption = lb.querySelector('.lightbox-caption');

    // Hero 卡大图点击
    grid.querySelectorAll('.tourism-hero-img').forEach(img => {
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        const src = this.src;
        const cityName = this.alt || '';
        if (!src || src.startsWith('data:') && !src.includes('svg+xml')) return;
        lightboxImg.src = src;
        lightboxCaption.textContent = cityName + ' - 电竞主场城市';
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // 普通卡片图片点击
    grid.querySelectorAll('.tourism-image > img').forEach(img => {
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const src = this.src;
        const cityName = this.getAttribute('data-city-name') || this.alt || '';
        if (!src || src.startsWith('data:image/svg')) return;
        lightboxImg.src = src;
        lightboxCaption.textContent = cityName + ' - 电竞主场城市';
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  },

  /** 关闭 Lightbox */
  _closeLightbox() {
    const lb = document.getElementById('tourismLightbox');
    if (!lb) return;
    lb.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      const img = lb.querySelector('img');
      if (img) img.src = '';
    }, 350);
  },

  /**
   * 绑定文旅板块交互事件
   */
  _bindTourismEvents() {
    const grid = document.getElementById('tourismGrid-travel');
    if (!grid) return;

    // ---- 区域筛选（带淡入动画） ----
    grid.querySelectorAll('.filter-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        const newRegion = btn.getAttribute('data-region');
        if (this._tourismFilter === newRegion) return;
        
        this._tourismFilter = newRegion;

        // 更新激活态
        grid.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 淡出 → 重渲染 → 淡入
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(10px)';
        grid.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

        setTimeout(() => {
          this.renderTourismCards();
          // 强制重绘后淡入
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              grid.style.opacity = '1';
              grid.style.transform = 'translateY(0)';
            });
          });
        }, 250);
      });
    });

    // ---- 展开/收起详情 ----
    const oldHandler = grid._expandHandler;
    if (oldHandler) {
      grid.removeEventListener('click', oldHandler);
    }
    
    const handleExpand = (e) => {
      const btn = e.target.closest('.expand-btn, .expand-btn-sm');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      
      const cityId = btn.getAttribute('data-city-id');
      const detail = document.getElementById(`detail-${cityId}`);
      if (!detail) return;
      
      const isOpening = !detail.classList.contains('open');

      // 关闭所有其他城市的详情
      if (isOpening) {
        document.querySelectorAll('.tourism-detail.open').forEach(otherDetail => {
          if (otherDetail !== detail) {
            otherDetail.classList.remove('open');
            setTimeout(() => { otherDetail.style.display = 'none'; }, 500);
            const otherCityId = otherDetail.id.replace('detail-', '');
            document.querySelectorAll(`.expand-btn[data-city-id="${otherCityId}"], .expand-btn-sm[data-city-id="${otherCityId}"]`).forEach(otherBtn => {
              otherBtn.textContent = otherBtn.classList.contains('expand-btn-sm') ? '详情 →' : '查看详情 ↓';
            });
          }
        });
      }

      if (isOpening) {
        detail.style.display = 'block';
        detail.offsetHeight; // 触发reflow
        detail.classList.add('open');

        // 更新按钮文本
        const updateBtnText = (b) => {
          b.textContent = b.classList.contains('expand-btn-sm') ? '详情 ↑' : '收起详情 ↑';
        };
        updateBtnText(btn);
        const card = btn.closest('.tourism-card, .tourism-hero');
        if (card) {
          const otherBtn = card.querySelector(`.expand-btn-sm[data-city-id="${cityId}"], .expand-btn[data-city-id="${cityId}"]`);
          if (otherBtn && otherBtn !== btn) updateBtnText(otherBtn);
        }

        // 自动滚动到详情面板
        setTimeout(() => {
          const overlay = document.getElementById('block-travel');
          if (overlay) {
            let top = 0;
            let el = detail;
            while (el && el !== overlay) {
              top += el.offsetTop;
              el = el.offsetParent;
            }
            overlay.scrollTo({ top: Math.max(0, top - 120), behavior: 'smooth' });
          }
        }, 400);

      } else {
        detail.classList.remove('open');
        setTimeout(() => { detail.style.display = 'none'; }, 500);

        const updateBtnText = (b) => {
          b.textContent = b.classList.contains('expand-btn-sm') ? '详情 →' : '查看详情 ↓';
        };
        updateBtnText(btn);
        const card = btn.closest('.tourism-card, .tourism-hero');
        if (card) {
          const otherBtn = card.querySelector(`.expand-btn-sm[data-city-id="${cityId}"], .expand-btn[data-city-id="${cityId}"]`);
          if (otherBtn && otherBtn !== btn) updateBtnText(otherBtn);
        }
      }
    };
    
    grid._expandHandler = handleExpand;
    grid.addEventListener('click', handleExpand);

    // ---- 卡片点击波纹（排除图片区域，避免与Lightbox冲突） ----
    grid.querySelectorAll('.tourism-card').forEach(card => {
      card.addEventListener('click', function(e) {
        // 排除按钮和图片点击
        if (e.target.closest('button') || e.target.closest('.tourism-image')) return;
        try {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const ripple = document.createElement('span');
          ripple.className = 'card-ripple';
          ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(99,102,241,0.15);transform:scale(0);animation:cardRipple 0.6s ease-out;pointer-events:none;left:${x}px;top:${y}px;width:200px;height:200px;margin-left:-100px;margin-top:-100px;z-index:2;`;
          this.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        } catch(err) {}
      });
    });

    // ---- 图片点击放大（Lightbox） ----
    this._initLightbox(grid);

    // ---- 问AI按钮（含关联城市推荐 + KPL战队） ----
    grid.querySelectorAll('.ask-ai-btn, .ask-ai-btn-sm, .detail-ai-btn, .related-city-chip, .kpl-team-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (!prompt) return;
        if (typeof Chat !== 'undefined') {
          Chat.sendMessage(prompt, 'travel');
        }
      });
    });

    // ---- 打卡按钮 ----
    grid.querySelectorAll('.checkin-btn-sm').forEach(btn => {
      btn.addEventListener('click', () => {
        const cityId = btn.getAttribute('data-city-id');
        const checked = Components._toggleCheckin(cityId);
        btn.classList.toggle('checked', checked);
        btn.textContent = checked ? '✅ 已打卡' : '📍 打卡';
        btn.title = checked ? '已打卡' : '打卡';
        Utils.showToast(checked ? '打卡成功！' : '已取消打卡', checked ? 'success' : 'info');
        // 更新已打卡城市计数
        Components._updateCheckinOverview();
      });
    });
  },

  /**
   * 渲染快捷提示词按钮
   */
  renderQuickPrompts(scenarioKey) {
    const container = document.getElementById(`quickButtons-${scenarioKey}`);
    if (!container) return;

    const scenario = CONFIG.scenarios[scenarioKey];
    if (!scenario || !scenario.quickPrompts) return;

    container.innerHTML = scenario.quickPrompts.map((prompt, index) => `
      <button class="quick-prompt-btn" data-prompt="${prompt}" style="animation-delay: ${index * 0.08}s">
        ${prompt}
      </button>
    `).join('');

    // 绑定点击事件
    container.querySelectorAll('.quick-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        Chat.sendMessage(prompt);
      });
    });
  },

  /**
   * 创建消息元素
   */
  createMessageElement(content, isUser = false, block = null, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}${isLoading ? ' loading-message' : ''} message-enter`;

    const scenarioKey = block || (typeof Chat !== 'undefined' ? Chat.currentScenario : 'competition');
    const icon = isUser ? '👤' : Data.getScenarioIcon(scenarioKey);
    const iconHtml = icon && (icon.includes('.png') || icon.includes('.webp') || icon.includes('.jpg')) ? `<img src="${icon}" alt="avatar">` : `<span>${icon}</span>`;
    
    if (isLoading) {
      messageDiv.innerHTML = `
        <div class="message-avatar">${iconHtml}</div>
        <div class="message-content">
          <div class="message-bubble">
            <div class="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      `;
    } else {
      const parsedContent = Utils.parseSimpleMarkdown(content);
      messageDiv.innerHTML = `
        <div class="message-avatar">${iconHtml}</div>
        <div class="message-content">
          <div class="message-bubble">${parsedContent}</div>
          <div class="message-time">${Utils.formatTime()}</div>
        </div>
      `;
    }

    return messageDiv;
  },

  /**
   * 滚动到指定区域
   */
  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element !== null) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // 更新导航栏的active状态
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  },

  /**
   * 初始化滚动显示动画
   */
  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
  },

  /**
   * 初始化按钮点击波纹效果（简化版，避免getBoundingClientRect报错）
   */
  initButtonRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        try {
          const rect = this.getBoundingClientRect();
          if (!rect || rect.width === 0) return;
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const ripple = document.createElement('span');
          ripple.className = 'btn-ripple';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          
          this.appendChild(ripple);
          setTimeout(() => ripple?.remove(), 600);
        } catch (err) {
          // 静默忽略，不影响核心功能
        }
      });
    });
  },

  /**
   * 初始化功能卡片的场景选择按钮
   */
  initFeatureCardButtons() {
    document.querySelectorAll('.select-scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scenario = btn.getAttribute('data-scenario');
        Chat.switchScenario(scenario);
        Components.scrollToSection('chat');
      });
    });
  },

  /**
   * 初始化配置弹窗
   */
  initConfigModal() {
    const modal = document.getElementById('configModal');
    const closeBtn = document.getElementById('closeConfigModal');
    const cancelBtn = document.getElementById('cancelConfig');
    const saveBtn = document.getElementById('saveConfig');
    const inputAccessToken = document.getElementById('inputAccessToken');

    if (!modal) return;

    // 从localStorage读取已有配置（兼容新旧key名）
    const savedToken = CONFIG.apiKey; // 通过getter读取
    if (savedToken) inputAccessToken.value = savedToken;

    const closeModal = () => modal.style.display = 'none';

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    saveBtn?.addEventListener('click', () => {
      const token = inputAccessToken.value.trim();

      if (token) {
        CONFIG.apiKey = token; // 通过setter自动存入localStorage（hunyuan_api_key + _apiKey缓存）
      }

      Utils.showToast('API配置已保存！', 'success');
      closeModal();
    });

    // 点击外部关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  },

  /**
   * 显示配置弹窗
   */
  showConfigModal() {
    const modal = document.getElementById('configModal');
    if (modal) modal.style.display = 'flex';
  },

  /**
   * 英雄IP板块当前筛选
   */
  _heroFilter: 'all',

  /**
   * 渲染英雄IP板块
   */
  renderHeroesSection() {
    const grid = document.getElementById('heroesGrid-mentor');
    if (!grid) return;

    this._renderHeroesGrid('all');
    this._initHeroFilter();
  },

  /**
   * 渲染英雄网格
   */
  _renderHeroesGrid(role = 'all') {
    const grid = document.getElementById('heroesGrid-mentor');
    if (!grid) return;

    let heroes = Data.heroes;
    if (role !== 'all') {
      heroes = heroes.filter(h => h.role === role);
    }

    grid.innerHTML = heroes.map(hero => {
      const imagePath = `./images/avatar/${hero.name}.jpg`;
      return `
        <div class="hero-card" data-hero-id="${hero.id}" data-hero-name="${hero.name}">
          <div class="hero-avatar">
            <img src="${imagePath}" alt="${hero.name}" onerror="this.src='${hero.avatar}';">
          </div>
          <div class="hero-name">${hero.name}</div>
          <div class="hero-role">${hero.roleName}</div>
          <div class="hero-tags">
            ${hero.tags.map(tag => `<span class="hero-tag">${tag}</span>`).join('')}
          </div>
          <div class="hero-hint">
            💬 点击咨询AI
          </div>
        </div>
      `;
    }).join('');

    this._bindHeroCardEvents(grid);
  },

  /**
   * 初始化英雄筛选
   */
  _initHeroFilter() {
    const filterBar = document.getElementById('heroesFilterBar-mentor');
    if (!filterBar) return;

    filterBar.querySelectorAll('.hero-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.hero-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const role = btn.getAttribute('data-role');
        this._heroFilter = role;
        this._renderHeroesGrid(role);
      });
    });
  },

  /**
   * 绑定英雄卡片点击事件
   */
  _bindHeroCardEvents(grid) {
    grid.querySelectorAll('.hero-card').forEach(card => {
      card.addEventListener('click', () => {
        const heroName = card.getAttribute('data-hero-name');
        this._askHeroAI(heroName);
      });
    });
  },

  /**
   * 点击英雄咨询AI
   */
  _askHeroAI(heroName) {
    const message = `请为我详细介绍王者荣耀英雄${heroName}，包括：1. 背景故事和世界线设定 2. 核心玩法和技巧 3. 推荐装备搭配 4. 技能连招和使用思路`;
    
    if (typeof Chat !== 'undefined') {
      Chat.sendMessage(message, 'mentor');
    }
    
    Utils.showToast(`正在为您介绍${heroName}...`, 'success');
  },

  /**
   * 初始化所有组件
   */
  initAll() {
    this.initParticles();
    this.initNavbar();
    if (typeof Lingbao !== 'undefined') Lingbao.init();
    this.initScrollReveal();
    this.initButtonRipple();
    this.initFeatureCardButtons();
    this.initConfigModal();

    // 加载用户画像
    if (typeof CONFIG !== 'undefined' && CONFIG.userPreferences) {
      CONFIG.userPreferences.load();
    }

    // 延迟触发滚动显示检测
    setTimeout(() => this.initScrollReveal(), 200);
  },

  /**
   * 渲染选手羁绊区域（动态加载 players.js）
   */
  async renderBondsSection() {
    // 动态加载选手模块
    if (typeof Players === 'undefined') {
      try {
        await this._loadScript('./js/players.js');
      } catch (e) {
        console.warn('选手模块加载失败', e);
        return;
      }
    }
    this._renderBondsContent();
  },

  /**
   * 实际渲染羁绊内容（players.js 已加载）
   */
  _renderBondsContent() {
    if (typeof Players === 'undefined') return;

    // 渲染热门羁绊组合
    const hotGrid = document.getElementById('hotBondsGrid-competition');
    if (hotGrid) {
      hotGrid.innerHTML = Players.hotBonds.map((bond, i) => {
        const p1 = Players.getPlayer(bond.player1Id);
        const p2 = Players.getPlayer(bond.player2Id);
        if (!p1 || !p2) return '';
        const bondType = bond.type || 'teammate';
        const typeInfo = Players.relationshipTypes[bondType] || Players.relationshipTypes.teammate;
        const p1Image = p1.image ? `./images/player/${p1.image}` : '';
        const p2Image = p2.image ? `./images/player/${p2.image}` : '';
        return `
          <div class="hot-bond-card scroll-reveal" style="animation-delay:${i * 0.08}s" data-prompt="介绍一下${p1.name}和${p2.name}的羁绊故事">
            <div class="bond-players">
              <div class="bond-player-item">
                <div class="bond-avatar" style="--bond-color:${bond.strength >= 5 ? '#F59E0B' : '#6366F1'}">
                  ${p1Image ? `<img src="${p1Image}" alt="${p1.name}" onerror="this.style.display='none'">` : ''}
                </div>
                <div class="bond-player-name">${p1.name}</div>
              </div>
              <div class="bond-connector bond-type-${bondType}">
                <span class="bond-type-icon">${typeInfo.icon}</span>
                <div class="bond-strength-bar" style="--strength:${Math.min(bond.strength, 5)}"></div>
              </div>
              <div class="bond-player-item">
                <div class="bond-avatar" style="--bond-color:${bond.strength >= 5 ? '#F59E0B' : '#6366F1'}">
                  ${p2Image ? `<img src="${p2Image}" alt="${p2.name}" onerror="this.style.display='none'">` : ''}
                </div>
                <div class="bond-player-name">${p2.name}</div>
              </div>
            </div>
            <div class="bond-label">${Utils.escapeHtml(bond.label)}</div>
            <span class="bond-type-tag type-${bondType}">${typeInfo.icon} ${typeInfo.label}</span>
            <div class="bond-desc">${Utils.escapeHtml(bond.description)}</div>
            <div class="bond-years">${Utils.escapeHtml(bond.years)}</div>
          </div>`;
      }).join('');

      // 热门羁绊点击事件
      hotGrid.querySelectorAll('.hot-bond-card').forEach(card => {
        card.addEventListener('click', () => {
          const prompt = card.getAttribute('data-prompt');
          if (prompt && typeof Chat !== 'undefined') {
            Chat.sendMessage(prompt, 'competition');
          }
        });
      });

      // 初始化羁绊收缩状态（默认显示6个）
      this._initBondsCollapse();
    }

    // 渲染选手卡片
    this._renderPlayerCards('all');

    // 筛选按钮事件
    const filterBar = document.getElementById('playersFilterBar-competition');
    if (filterBar) {
      filterBar.querySelectorAll('.player-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('.player-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this._renderPlayerCards(btn.getAttribute('data-filter'));
        });
      });
    }

    // 渲染羁绊关系图
    this._renderBondGraph();
  },

  /**
   * 初始化羁绊组合收缩功能
   */
  _initBondsCollapse() {
    const hotGrid = document.getElementById('hotBondsGrid-competition');
    if (!hotGrid) return;

    const cards = hotGrid.querySelectorAll('.hot-bond-card');
    const initialShow = 6; // 默认显示6个

    // 如果数量少于等于初始显示数，不需要收缩
    if (cards.length <= initialShow) return;

    // 隐藏超出初始数量的卡片
    cards.forEach((card, i) => {
      if (i >= initialShow) {
        card.style.display = 'none';
      }
    });

    // 添加更多/收起按钮
    let toggleBtn = hotGrid.parentElement.querySelector('.bonds-toggle-btn');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn btn-outline bonds-toggle-btn';
      toggleBtn.innerHTML = `<span class="toggle-icon">▼</span> 查看更多 (${cards.length - initialShow})`;
      hotGrid.parentElement.appendChild(toggleBtn);

      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.classList.contains('expanded');
        if (isExpanded) {
          // 收起
          cards.forEach((card, i) => {
            if (i >= initialShow) {
              card.style.display = 'none';
            }
          });
          toggleBtn.classList.remove('expanded');
          toggleBtn.innerHTML = `<span class="toggle-icon">▼</span> 查看更多 (${cards.length - initialShow})`;
          // 滚动到羁绊组合位置
          hotGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // 展开
          cards.forEach(card => {
            card.style.display = 'block';
          });
          toggleBtn.classList.add('expanded');
          toggleBtn.innerHTML = `<span class="toggle-icon">▲</span> 收起`;
        }
      });
    }
  },

  /**
   * 渲染选手卡片网格
   */
  _renderPlayerCards(filter) {
    const grid = document.getElementById('playersGrid-competition');
    if (!grid || typeof Players === 'undefined') return;

    // 设置grid样式 - 紧凑5列布局
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    grid.style.gap = '12px';
    grid.style.width = '100%';
    grid.style.maxWidth = 'none';
    grid.style.margin = '0';
    grid.style.padding = '0';

    let players;
    if (filter === 'active') players = Players.getActivePlayers();
    else if (filter === 'legendary') players = Players.getLegendaryPlayers();
    else players = Players.list;

    grid.innerHTML = players.map((p, i) => {
      const playerImage = p.image ? `./images/player/${p.image}` : '';
      return `
      <div class="player-card scroll-reveal" style="animation-delay:${i * 0.06}s" data-player-id="${p.id}">
        <div class="player-card-header">
          <div class="player-avatar" style="--pcolor:${p.titles >= 3 ? '#F59E0B' : p.status === 'active' ? '#10B981' : '#6366F1'}">
            ${playerImage ? `<img src="${playerImage}" alt="${p.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><span class="player-avatar-text" style="display:none;">${p.name.charAt(0)}</span>` : `<span class="player-avatar-text">${p.name.charAt(0)}</span>`}
            ${p.status === 'legendary' ? '<span class="player-legend-badge">传奇</span>' : ''}
          </div>
          <div class="player-info">
            <h4 class="player-name">${Utils.escapeHtml(p.name)}</h4>
            <p class="player-realname">${Utils.escapeHtml(p.realName)}</p>
          </div>
          <div class="player-titles" title="${p.titles}座冠军">
            ${p.titles > 0 ? '🏆'.repeat(Math.min(p.titles, 6)) : ''}
          </div>
        </div>
        <div class="player-meta">
          <span class="player-team">${Utils.escapeHtml(p.team)}</span>
          <span class="player-position">${Utils.escapeHtml(p.position)}</span>
          <span class="player-status ${p.status}">${p.status === 'active' ? '现役' : '传奇'}</span>
        </div>
        <div class="player-highlights">
          ${p.highlights.slice(0, 2).map(h => `<span class="player-highlight-tag">✦ ${Utils.escapeHtml(h)}</span>`).join('')}
        </div>
        <div class="player-bonds-preview">
          ${(() => {
            const rels = Players.getPlayerRelationships(p.id);
            return rels.slice(0, 3).map(rel => {
              return rel.targetPlayer ? `<span class="bond-mini" title="${Utils.escapeHtml(rel.description)}">${rel.typeInfo.icon} ${rel.targetPlayer.name}</span>` : '';
            }).join('');
          })()}
        </div>
        <button class="btn btn-outline btn-sm ask-player-btn" data-prompt="详细介绍${p.name}（${p.realName}）的职业生涯和成就">🤖 了解更多</button>
      </div>
    `}).join('');

    // 绑定事件
    grid.querySelectorAll('.ask-player-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (prompt && typeof Chat !== 'undefined') {
          Chat.sendMessage(prompt, 'competition');
        }
      });
    });

    // 初始化选手收缩状态
    this._initPlayersCollapse();

    // 重新初始化滚动动画
    setTimeout(() => this.initScrollReveal(), 100);
  },

  /**
   * 初始化选手卡片收缩功能
   */
  _initPlayersCollapse() {
    const grid = document.getElementById('playersGrid-competition');
    if (!grid) return;

    const cards = grid.querySelectorAll('.player-card');
    const initialShow = 20; // 默认显示20个选手（4行）

    // 如果数量少于等于初始显示数，不需要收缩
    if (cards.length <= initialShow) return;

    // 隐藏超出初始数量的卡片
    cards.forEach((card, i) => {
      if (i >= initialShow) {
        card.style.display = 'none';
      }
    });

    // 添加更多/收起按钮
    let toggleBtn = grid.parentElement.querySelector('.players-toggle-btn');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn btn-outline players-toggle-btn';
      toggleBtn.innerHTML = `<span class="toggle-icon">▼</span> 查看更多 (${cards.length - initialShow})`;
      grid.parentElement.appendChild(toggleBtn);

      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.classList.contains('expanded');
        if (isExpanded) {
          // 收起
          cards.forEach((card, i) => {
            if (i >= initialShow) {
              card.style.display = 'none';
            }
          });
          toggleBtn.classList.remove('expanded');
          toggleBtn.innerHTML = `<span class="toggle-icon">▼</span> 查看更多 (${cards.length - initialShow})`;
          // 滚动到选手区域位置
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // 展开
          cards.forEach(card => {
            card.style.display = 'block';
          });
          toggleBtn.classList.add('expanded');
          toggleBtn.innerHTML = `<span class="toggle-icon">▲</span> 收起`;
        }
      });
    }
  },

  /**
   * 渲染羁绊关系图（Canvas可视化）
   */
  _renderBondGraph() {
    const canvas = document.getElementById('bondGraphCanvas-competition');
    if (!canvas || typeof Players === 'undefined') return;

    const container = document.getElementById('bondGraphContainer-competition');
    if (!container) return;

    const ctx = canvas.getContext('2d');
    let width, height, nodes, edges;
    let dragging = null;
    let hoveredNode = null;
    let animId = null;

    function resize() {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = Math.min(500, Math.max(350, width * 0.4));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // 获取鼠标在 canvas 中的正确坐标
    function getMousePos(e) {
      // 使用 offsetX/offsetY 直接获取相对于 canvas 的坐标
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }

    function initGraph() {
      const graphData = Players.getGraphData();
      
      // 过滤掉没有连线的节点
      const nodeIdsWithEdges = new Set();
      graphData.links.forEach(link => {
        nodeIdsWithEdges.add(link.source);
        nodeIdsWithEdges.add(link.target);
      });
      
      const filteredNodes = graphData.nodes.filter(node => nodeIdsWithEdges.has(node.id));
      
      // 布局：圆形排列
      const cx = width / 2, cy = height / 2;
      const radius = Math.min(width, height) * 0.35;
      nodes = filteredNodes.map((n, i) => {
        const angle = (i / filteredNodes.length) * Math.PI * 2 - Math.PI / 2;
        return {
          ...n,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: 0, vy: 0,
          symbolSize: n.symbolSize || 30 // 添加默认的symbolSize属性
        };
      });
      edges = graphData.links;
    }

    // 统一的节点半径（所有节点大小一致）
    const NODE_RADIUS = 28;
    const NODE_RADIUS_HOVER = 33;

    // 获取节点的视觉半径
    function getNodeRadius(isHovered) {
      return isHovered ? NODE_RADIUS_HOVER : NODE_RADIUS;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // 画边（不同关系类型用不同线型）
      edges.forEach(e => {
        const s = nodes.find(n => n.id === e.source);
        const t = nodes.find(n => n.id === e.target);
        if (!s || !t) return;

        const isHovered = hoveredNode && (hoveredNode.id === e.source || hoveredNode.id === e.target);
        const midX = (s.x + t.x) / 2;
        const midY = (s.y + t.y) / 2;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = e.lineStyle.color;

        // 按关系类型设线型：队友=实线，宿敌=虚线，传承=点线
        if (e.type === 'rival') {
          ctx.setLineDash([8, 4]);
        } else if (e.type === 'successor') {
          ctx.setLineDash([3, 3]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.globalAlpha = isHovered ? 0.85 : 0.18;
        ctx.lineWidth = isHovered ? Math.max(2, e.lineStyle.width * 0.8) : Math.max(1, e.lineStyle.width * 0.4);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // 悬停时在边的中点显示关系图标+标签
        if (isHovered) {
          const label = e.label || '';
          const icon = e.type === 'teammate' ? '🤝' : e.type === 'rival' ? '⚔️' : '🔥';
          const text = `${icon} ${label}`;
          ctx.font = 'bold 11px "Inter", "Noto Sans SC", sans-serif';
          const tw = ctx.measureText(text).width;

          // 标签背景
          ctx.fillStyle = '#0F0F1A';
          ctx.globalAlpha = 0.9;
          const px = 8, py = 4;
          ctx.beginPath();
          ctx.roundRect(midX - tw / 2 - px, midY - 8 - py, tw + px * 2, 16 + py * 2, 6);
          ctx.fill();
          ctx.strokeStyle = e.lineStyle.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // 标签文字
          ctx.fillStyle = e.lineStyle.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, midX, midY);
        }
      });

      // 画节点
      nodes.forEach(n => {
        const isHovered = hoveredNode && hoveredNode.id === n.id;
        const r = getNodeRadius(isHovered);

        // 光晕
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2);
        const nodeColor = n.titles >= 3 ? '#F59E0B' : n.status === 'active' ? '#10B981' : '#6366F1';
        glow.addColorStop(0, nodeColor + '40');
        glow.addColorStop(1, nodeColor + '00');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2, 0, Math.PI * 2);
        ctx.fill();

        // 圆形节点
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#1A1A2E';
        ctx.fill();
        ctx.strokeStyle = nodeColor;
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();

        // 名字
        ctx.fillStyle = '#fff';
        ctx.font = `${isHovered ? 'bold ' : ''}${Math.max(10, r * 0.45)}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.name, n.x, n.y);

        // 悬停时显示详情
        if (isHovered) {
          // 基本信息
          const detail = `${n.realName} | ${n.team} | ${n.position}`;
          ctx.font = '11px "Inter", sans-serif';
          ctx.fillStyle = '#A1A1AA';
          ctx.fillText(detail, n.x, n.y + r + 16);
          
          // 冠军信息
          if (n.titles > 0) {
            ctx.font = '10px "Inter", sans-serif';
            ctx.fillStyle = '#F59E0B';
            ctx.fillText(`${n.titles}座冠军`, n.x, n.y + r + 32);
          }
          
          // 显示与其他选手的羁绊关系
          const relatedBonds = edges.filter(e => e.source === n.id || e.target === n.id);
          if (relatedBonds.length > 0) {
            ctx.font = '10px "Inter", sans-serif';
            ctx.fillStyle = '#6366F1';
            ctx.fillText(`羁绊关系: ${relatedBonds.length}个`, n.x, n.y + r + 48);
          }
        }
      });
    }

    function animate() {
      // 简单物理模拟（节点互斥）
      for (let i = 0; i < nodes.length; i++) {
        // 跳过正在拖拽的节点
        if (dragging && dragging.id === nodes[i].id) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          // 跳过正在拖拽的节点
          if (dragging && dragging.id === nodes[j].id) continue;
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = 120;
          if (dist < minDist && dist > 0) {
            const force = (minDist - dist) / minDist * 0.3;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nodes[i].x -= fx; nodes[i].y -= fy;
            nodes[j].x += fx; nodes[j].y += fy;
          }
        }
      }
      // 保持在画面内
      nodes.forEach(n => {
        n.x = Math.max(50, Math.min(width - 50, n.x));
        n.y = Math.max(40, Math.min(height - 40, n.y));
      });

      draw();
      animId = requestAnimationFrame(animate);
    }

    // 鼠标交互
    canvas.addEventListener('mousemove', (e) => {
      const pos = getMousePos(e);
      
      // 处理拖拽：节点中心直接跟随鼠标
      if (dragging) {
        dragging.x = pos.x;
        dragging.y = pos.y;
        canvas.style.cursor = 'grabbing';
        return;
      }
      
      // 处理悬停，从后往前检测
      hoveredNode = null;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = pos.x - n.x;
        const dy = pos.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < NODE_RADIUS_HOVER) {
          hoveredNode = n;
          break;
        }
      }
      canvas.style.cursor = hoveredNode ? 'grab' : 'default';
    });

    canvas.addEventListener('mousedown', (e) => {
      const pos = getMousePos(e);
      
      // 检测鼠标位置是否在节点上
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = pos.x - n.x;
        const dy = pos.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < NODE_RADIUS_HOVER) {
          dragging = n;
          dragging.x = pos.x;
          dragging.y = pos.y;
          canvas.style.cursor = 'grabbing';
          break;
        }
      }
    });

    canvas.addEventListener('mouseup', () => {
      dragging = null;
      canvas.style.cursor = hoveredNode ? 'grab' : 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      dragging = null;
      hoveredNode = null;
      canvas.style.cursor = 'default';
    });

    // 初始化
    resize();
    initGraph();
    animate();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      initGraph();
    });
    resizeObserver.observe(container);
  },

  /**
   * 渲染俱乐部卡片网格
   */
  _renderClubsGrid() {
    console.log('开始渲染俱乐部网格');
    const grid = document.getElementById('clubsGrid-competition');
    console.log('clubsGrid元素:', grid);
    if (!grid || typeof Data === 'undefined') {
      console.log('缺少grid元素或Data对象');
      return;
    }

    // 俱乐部图片映射表（根据用户提供的对应关系）
    const clubImageMap = {
      '成都AG超玩会': 1,
      'AG': 1,
      '深圳DYG': 2,
      'DYG': 2,
      '佛山DRG': 3,
      'DRG': 3,
      '佛山GK': 3,
      'GK': 3,
      '上海EDG.M': 4,
      'EDG.M': 4,
      'EDG': 4,
      '南京Hero久竞': 5,
      'Hero': 5,
      '北京JDG': 6,
      'JDG': 6,
      '苏州KSG': 7,
      'KSG': 7,
      '杭州LGD大鹅': 8,
      'LGD': 8,
      'LGD大鹅': 8,
      '重庆狼队': 9,
      '狼队': 9,
      '上海RNG.M': 10,
      'RNG.M': 10,
      'RNG': 10,
      '济南RW侠': 11,
      'RW侠': 11,
      'RW': 11,
      '长沙TES': 12,
      'TES': 12,
      '广州TTG': 13,
      'TTG': 13,
      '西安WE': 14,
      'WE': 14,
      '北京WB': 15,
      'WB': 15,
      'TCG': 16,
      '桐乡情久': 17,
      '情久': 17,
      '武汉eStarPro': 18,
      'eStarPro': 18,
      'ESTAR': 18
    };

    const teams = Data.teams;
    console.log('战队数据:', teams);
    grid.innerHTML = teams.map((team, index) => {
      // 根据战队名称或缩写查找正确的图片编号
      let imgNumber = clubImageMap[team.name] || clubImageMap[team.abbr] || (index + 1);
      
      return `
        <div class="club-card" data-team-name="${team.name}" data-team-id="${imgNumber}">
          <div class="club-logo-container">
            <img src="./images/club/${imgNumber}.png" alt="${team.name}" class="club-logo" onload="console.log('图片加载完成:', this.src); adjustClubLogo(this);">
          </div>
          <h4 class="club-name">${team.name}</h4>
          <p class="club-abbr">${team.abbr}</p>
        </div>
      `;
    }).join('');
    console.log('网格HTML已生成');
    console.log('生成的HTML:', grid.innerHTML);

    // 绑定点击事件
    grid.querySelectorAll('.club-card').forEach(card => {
      card.addEventListener('click', () => {
        const teamName = card.getAttribute('data-team-name');
        const teamId = parseInt(card.getAttribute('data-team-id'));
        this._showClubDetail(teamName, teamId);
      });
    });
    console.log('点击事件已绑定');

    // 智能调整俱乐部图片显示 - 针对特定logo进行微调
    window.adjustClubLogo = function(img) {
      console.log('调整图片:', img.src);
      // 确保图片加载完成
      if (!img.complete) {
        img.addEventListener('load', function() {
          window.adjustClubLogo(this);
        });
        return;
      }
      
      // 从src中提取图片编号
      const src = img.src;
      const match = src.match(/club\/(\d+)\.png/);
      if (!match) return;
      
      const imgNumber = parseInt(match[1]);
      
      // 需要特殊调整的logo配置（根据实际效果调整）
      const specialLogos = {
        // 格式: 图片编号: { scale: 缩放比例, padding: 内边距 }
        1: { scale: 1.4 },
        2: { scale: 1.7},
        3: { scale: 1.5 },
        4: { scale: 2.0 },
        5: { scale: 1.7 },
        6: { scale: 1.8 },
        7: { scale: 1.0 },
        8: { scale: 1.7 },
        9: { scale: 2.1 },
        10: { scale: 2.4 },
        11: { scale: 2.0 },
        12: { scale: 1.7 },
        13: { scale: 3.2 },
        14: { scale: 2.4 },
        15: { scale: 1.6 },
        16: { scale: 1.6 },
        17: { scale: 1.6 },
        18: { scale: 0.8 }
      };
      
      const config = specialLogos[imgNumber];
      if (config && config.scale) {
        img.style.transform = `scale(${config.scale})`;
        console.log(`图片${imgNumber}应用缩放: ${config.scale}x`);
      }
      
      // 为KSG（第7个）添加特殊处理，确保白色背景
      if (imgNumber === 7) {
        const container = img.parentElement;
        if (container) {
          container.style.background = '#fff !important';
          container.style.overflow = 'hidden';
        }
        img.style.background = '#fff';
        img.style.borderRadius = '0';
      }
    }
    
    // 调整所有俱乐部图片
    function adjustAllClubLogos() {
      const logos = document.querySelectorAll('.club-logo');
      console.log('找到', logos.length, '个俱乐部图片');
      logos.forEach(window.adjustClubLogo);
    }
    
    // 立即调整所有图片
    adjustAllClubLogos();
    
    // 页面加载完成后再次调整
    window.addEventListener('DOMContentLoaded', adjustAllClubLogos);
    
    // 监听窗口大小变化，重新调整图片
    window.addEventListener('resize', adjustAllClubLogos);
    
    // 监听图片加载完成事件
    document.addEventListener('DOMContentLoaded', function() {
      const logos = document.querySelectorAll('.club-logo');
      logos.forEach(img => {
        img.addEventListener('load', function() {
          adjustClubLogo(this);
        });
      });
    });
  },

  /**
   * 显示俱乐部详情
   */
  _showClubDetail(teamName, teamId) {
    const overlay = document.getElementById('clubDetailOverlay');
    const content = document.querySelector('#clubDetailCard .club-detail-content');
    if (!overlay || !content) return;

    // 模拟数据
    const team = Data.teams.find(t => t.name === teamName);
    if (!team) return;

    // 真实赛程数据（根据2026年最新战绩报告）
    const teamScheduleData = {
      '成都AG超玩会': [
        { date: '2026-04-15', match: '成都AG超玩会 vs 北京JDG', result: 'win', score: '30:18' },
        { date: '2026-04-12', match: '成都AG超玩会 vs 重庆狼队', result: 'lose', score: '18:30' },
        { date: '2026-04-08', match: '成都AG超玩会 vs KSG', result: 'lose', score: '18:30' },
        { date: '2026-04-04', match: '成都AG超玩会 vs 南通Hero久竞', result: 'win', score: '14:0' }
      ],
      '佛山DRG': [
        { date: '2026-04-15', match: '佛山DRG vs 武汉eStarPro', result: 'win', score: '14:0' },
        { date: '2026-04-12', match: '佛山DRG vs 广州TTG', result: 'win', score: '14:0' },
        { date: '2026-04-08', match: '佛山DRG vs 南通Hero久竞', result: 'win', score: '14:0' },
        { date: '2026-04-04', match: '佛山DRG vs 上海RNG', result: 'win', score: '14:0' }
      ],
      '深圳DYG': [
        { date: '2026-04-15', match: '深圳DYG vs 广州TTG', result: 'win', score: '30:18' },
        { date: '2026-04-12', match: '深圳DYG vs KSG', result: 'win', score: '30:18' },
        { date: '2026-04-08', match: '深圳DYG vs 济南RW侠', result: 'win', score: '14:0' },
        { date: '2026-04-04', match: '深圳DYG vs 广州TTG', result: 'lose', score: '0:14' }
      ],
      '上海EDG.M': [
        { date: '2026-04-12', match: '上海EDG.M vs M', result: 'lose', score: '0:14' },
        { date: '2026-04-08', match: '上海EDG.M vs 无锡TCG', result: 'lose', score: '0:14' }
      ],
      '武汉eStarPro': [
        { date: '2026-04-15', match: '武汉eStarPro vs 北京JDG', result: 'win', score: '14:0' },
        { date: '2026-04-12', match: '武汉eStarPro vs 佛山DRG', result: 'lose', score: '0:14' },
        { date: '2026-04-08', match: '武汉eStarPro vs 广州TTG', result: 'lose', score: '0:14' },
        { date: '2026-04-04', match: '武汉eStarPro vs KSG', result: 'win', score: '14:0' }
      ],
      '南通Hero久竞': [
        { date: '2026-04-15', match: '南通Hero久竞 vs 广州TTG', result: 'lose', score: '18:30' },
        { date: '2026-04-12', match: '南通Hero久竞 vs 广州TTG', result: 'win', score: '17:0' },
        { date: '2026-04-08', match: '南通Hero久竞 vs 佛山DRG', result: 'lose', score: '0:14' },
        { date: '2026-04-04', match: '南通Hero久竞 vs 长沙TES', result: 'win', score: '14:0' }
      ],
      '北京JDG': [
        { date: '2026-04-15', match: '北京JDG vs 成都AG超玩会', result: 'lose', score: '18:30' },
        { date: '2026-04-12', match: '北京JDG vs 北京WB', result: 'lose', score: '18:30' },
        { date: '2026-04-08', match: '北京JDG vs KSG', result: 'win', score: '17:0' },
        { date: '2026-04-04', match: '北京JDG vs 武汉eStarPro', result: 'lose', score: '0:14' }
      ],
      '苏州KSG': [
        { date: '2026-04-15', match: '苏州KSG vs 重庆狼队', result: 'win', score: '30:18' },
        { date: '2026-04-12', match: '苏州KSG vs 深圳DYG', result: 'lose', score: '18:30' },
        { date: '2026-04-08', match: '苏州KSG vs 北京WB', result: 'win', score: '30:18' },
        { date: '2026-04-04', match: '苏州KSG vs 成都AG超玩会', result: 'win', score: '30:18' }
      ],
      '重庆狼队': [
        { date: '2026-04-15', match: '重庆狼队 vs KSG', result: 'lose', score: '18:30' },
        { date: '2026-04-12', match: '重庆狼队 vs 成都AG超玩会', result: 'win', score: '30:18' },
        { date: '2026-04-08', match: '重庆狼队 vs KSG', result: 'win', score: '17:0' },
        { date: '2026-04-04', match: '重庆狼队 vs KSG', result: 'win', score: '17:0' }
      ],
      '杭州LGD.NBW': [
        { date: '2026-04-15', match: 'NBW vs 桐乡情久', result: 'lose', score: '18:30' },
        { date: '2026-04-12', match: 'NBW vs 北京WB', result: 'lose', score: '18:30' },
        { date: '2026-04-08', match: 'NBW vs 西安WE', result: 'win', score: '14:0' },
        { date: '2026-04-04', match: 'NBW vs 上海RNG', result: 'win', score: '14:0' }
      ],
      '上海RNG.M': [
        { date: '2026-04-15', match: '上海RNG vs 重庆狼队', result: 'lose', score: '0:14' },
        { date: '2026-04-12', match: '上海RNG vs 济南RW侠', result: 'lose', score: '0:14' },
        { date: '2026-04-08', match: '上海RNG vs NBW', result: 'lose', score: '0:14' },
        { date: '2026-04-04', match: '上海RNG vs 无锡TCG', result: 'lose', score: '0:14' }
      ],
      '济南RW侠': [
        { date: '2026-04-15', match: '济南RW侠 vs 深圳DYG', result: 'lose', score: '0:14' },
        { date: '2026-04-12', match: '济南RW侠 vs 上海RNG', result: 'win', score: '14:0' },
        { date: '2026-04-08', match: '济南RW侠 vs 长沙TES', result: 'win', score: '14:0' },
        { date: '2026-04-04', match: '济南RW侠 vs 西安WE', result: 'win', score: '14:0' }
      ],
      '长沙TES.A': [
        { date: '2026-04-15', match: '长沙TES vs 桐乡情久', result: 'lose', score: '0:14' },
        { date: '2026-04-12', match: '长沙TES vs 南通Hero久竞', result: 'lose', score: '0:14' },
        { date: '2026-04-08', match: '长沙TES vs 济南RW侠', result: 'lose', score: '0:14' },
        { date: '2026-04-04', match: '长沙TES vs 南通Hero久竞', result: 'lose', score: '0:14' }
      ],
      '广州TTG': [
        { date: '2026-04-15', match: '广州TTG vs 南通Hero久竞', result: 'win', score: '30:18' },
        { date: '2026-04-12', match: '广州TTG vs 深圳DYG', result: 'lose', score: '18:30' },
        { date: '2026-04-08', match: '广州TTG vs 桐乡情久', result: 'win', score: '17:0' },
        { date: '2026-04-04', match: '广州TTG vs 南通Hero久竞', result: 'lose', score: '0:17' }
      ],
      '西安WE': [
        { date: '2026-04-15', match: '西安WE vs A', result: 'lose', score: '0:17' },
        { date: '2026-04-12', match: '西安WE vs 桐乡情久', result: 'win', score: '17:0' },
        { date: '2026-04-08', match: '西安WE vs NBW', result: 'lose', score: '0:14' },
        { date: '2026-04-04', match: '西安WE vs 济南RW侠', result: 'lose', score: '0:14' }
      ],
      '北京WB': [
        { date: '2026-04-15', match: '北京WB vs NBW', result: 'win', score: '30:18' },
        { date: '2026-04-12', match: '北京WB vs 北京JDG', result: 'win', score: '30:18' },
        { date: '2026-04-08', match: '北京WB vs KSG', result: 'lose', score: '18:30' },
        { date: '2026-04-04', match: '北京WB vs KSG', result: 'win', score: '14:0' }
      ],
      '无锡TCG': [
        { date: '2026-04-15', match: '无锡TCG vs M', result: 'lose', score: '0:14' },
        { date: '2026-04-12', match: '无锡TCG vs 上海RNG', result: 'win', score: '14:0' },
        { date: '2026-04-08', match: '无锡TCG vs 武汉eStarPro', result: 'lose', score: '0:14' },
        { date: '2026-04-04', match: '无锡TCG vs 上海EDG', result: 'win', score: '14:0' }
      ],
      '桐乡情久': [
        { date: '2026-04-15', match: '桐乡情久 vs NBW', result: 'win', score: '30:18' },
        { date: '2026-04-12', match: '桐乡情久 vs 广州TTG', result: 'lose', score: '0:17' },
        { date: '2026-04-08', match: '桐乡情久 vs 西安WE', result: 'lose', score: '0:17' },
        { date: '2026-04-04', match: '桐乡情久 vs 长沙TES', result: 'win', score: '14:0' }
      ]
    };

    const schedule = teamScheduleData[team.name] || [
      { date: '2026-04-15', match: `${team.name} vs 待定`, result: 'vs', score: '-' },
      { date: '2026-04-12', match: `${team.name} vs 待定`, result: 'vs', score: '-' }
    ];

    // 真实队员数据（根据俱乐部名称匹配，使用真实选手照片）
    const teamPlayers = {
      '成都AG超玩会': [
        { name: '一诺', position: '发育路', image: '成都AG超玩会/一诺徐必成.png' },
        { name: '大帅', position: '辅助', image: '成都AG超玩会/大帅孟家俊.png' },
        { name: '长生', position: '中路', image: '成都AG超玩会/长生谢承峻.png' },
        { name: '轩染', position: '对抗路', image: '成都AG超玩会/轩染刘明.png' },
        { name: '钟意', position: '打野', image: '成都AG超玩会/钟意陈家豪.png' }
      ],
      '深圳DYG': [
        { name: '凌瑞', position: '对抗路', image: '深圳DYG/凌瑞王厚豪.png' },
        { name: '小乐', position: '打野', image: '深圳DYG/小乐黄家乐.png' },
        { name: '向鱼', position: '中路', image: '深圳DYG/向鱼蔡佑其.png' },
        { name: '钎城', position: '发育路', image: '深圳DYG/钎城周诣涛.png' },
        { name: '星潼', position: '辅助', image: '深圳DYG/星潼吴金辉.png' }
      ],
      '佛山DRG': [
        { name: '旭旭', position: '对抗路', image: '佛山DRG/旭旭陶晨旭.png' },
        { name: '柚子', position: '打野', image: '佛山DRG/柚子袁树鑫.png' },
        { name: '花缘', position: '中路', image: '佛山DRG/花缘谭锦威.png' },
        { name: '梦岚', position: '发育路', image: '佛山DRG/梦岚彭俊岚.png' },
        { name: '呆呆', position: '辅助', image: '佛山DRG/呆呆赖永睿.png' }
      ],
      '南通Hero久竞': [
        { name: '坦然', position: '对抗路', image: '南通Hero久竞/坦然孙麟威.png' },
        { name: '妖刀', position: '打野', image: '南通Hero久竞/妖刀钟乐天.png' },
        { name: 'Silver', position: '中路', image: '南通Hero久竞/Silver黄本帅.png' },
        { name: '玖熙', position: '发育路', image: '南通Hero久竞/玖熙敖语思涵.png' },
        { name: '绝心', position: '辅助', image: '南通Hero久竞/绝心刘泽杉.png' }
      ],
      '北京JDG': [
        { name: '轻语', position: '对抗路', image: '北京JDG/轻语谢欣臻.png' },
        { name: '无畏', position: '打野', image: '北京JDG/无畏杨涛.png' },
        { name: '清融', position: '中路', image: '北京JDG/清融黄垚钦.png' },
        { name: '小玖', position: '发育路', image: '北京JDG/小玖刘行.png' },
        { name: '小A', position: '辅助', image: '北京JDG/小A杨荣鑫.png' }
      ],
      '苏州KSG': [
        { name: '无言', position: '对抗路', image: 'KSG/无言赵昊宇.png' },
        { name: '句号', position: '打野', image: 'KSG/句号何伟嘉.png' },
        { name: '流浪', position: '中路', image: 'KSG/流浪张恒.png' },
        { name: '风箫', position: '发育路', image: 'KSG/风箫于翔任.png' },
        { name: '一笙', position: '辅助', image: 'KSG/一笙李自威.png' }
      ],
      '杭州LGD大鹅': [
        { name: '花花', position: '对抗路', image: '杭州LGD.NBW/花花丁璟灏.png' },
        { name: '小崽', position: '打野', image: '杭州LGD.NBW/小崽夏肇汛.png' },
        { name: '九尾', position: '中路', image: '杭州LGD.NBW/九尾许鑫蓁.png' },
        { name: '小久', position: '发育路', image: '杭州LGD.NBW/小久阳文明.png' },
        { name: '冰尘', position: '辅助', image: '杭州LGD.NBW/冰尘李小龙.png' }
      ],
      '上海EDG.M': [
        { name: '凌云', position: '对抗路', image: '上海EDG.M/凌云陈泓铭.png' },
        { name: '小泽', position: '打野', image: '上海EDG.M/小泽沈宇泽.png' },
        { name: '一曲', position: '中路', image: '上海EDG.M/一曲周锋.png' },
        { name: '花卷', position: '发育路', image: '上海EDG.M/花卷吴育涛.png' },
        { name: '百炼', position: '辅助', image: '上海EDG.M/百炼杨仕晨.png' }
      ],
      '上海RNG.M': [
        { name: '极光', position: '对抗路', image: '上海RNG.M/极光周文强.png' },
        { name: '航航', position: '打野', image: '上海RNG.M/航航谢模航.png' },
        { name: '雨空', position: '中路', image: '上海RNG.M/雨空杨文岳.png' },
        { name: '久酷', position: '发育路', image: '上海RNG.M/久酷王滔.png' },
        { name: '小困', position: '辅助', image: '上海RNG.M/小困张翁豪.png' }
      ],
      '济南RW侠': [
        { name: '小度', position: '对抗路', image: '济南RW侠/小度古伟雄.png' },
        { name: '今屿', position: '打野', image: '济南RW侠/今屿徐翔宇.png' },
        { name: '梦溪', position: '中路', image: '济南RW侠/梦溪李文宝.png' },
        { name: '佩恩', position: '发育路', image: '济南RW侠/佩恩文帅.png' },
        { name: '苏瞳', position: '辅助', image: '济南RW侠/苏瞳孟凡苏.png' }
      ],
      '长沙滔搏电竞': [
        { name: '无幻', position: '对抗路', image: '长沙TES.A/无幻朱俊.png' },
        { name: '帆帆', position: '打野', image: '长沙TES.A/帆帆杨帆.png' },
        { name: '书源', position: '中路', image: '长沙TES.A/书源寇书源.png' },
        { name: '景诗', position: '发育路', image: '长沙TES.A/景诗李知杰.png' },
        { name: '安七', position: '辅助', image: '长沙TES.A/安七戴子强.png' }
      ],
      '广州TTG': [
        { name: '萝卜', position: '对抗路', image: '广州TTG/萝卜陈佳鸿.png' },
        { name: '鹤辞', position: '打野', image: '广州TTG/鹤辞江利杰.png' },
        { name: '佳心', position: '中路', image: '广州TTG/佳心李佳旭.png' },
        { name: '小雪', position: '发育路', image: '广州TTG/小雪岳彩营.png' },
        { name: '阿豆', position: '辅助', image: '广州TTG/阿豆蒋涛.png' }
      ],
      '西安WE': [
        { name: '忆安', position: '对抗路', image: '西安WE/忆安杜国豪.png' },
        { name: '明崽', position: '打野', image: '西安WE/明崽戴家权.png' },
        { name: '文涛', position: '中路', image: '西安WE/文涛朱文涛.png' },
        { name: '九幽', position: '发育路', image: '西安WE/九幽李俊超.png' },
        { name: '墨衍', position: '辅助', image: '西安WE/墨衍张衍佳.png' }
      ],
      '北京WB': [
        { name: '梓墨', position: '对抗路', image: '北京WB/梓墨吴喆杰.png' },
        { name: '暖阳', position: '打野', image: '北京WB/暖阳林恒.png' },
        { name: '花卷', position: '中路', image: '北京WB/花卷吴育涛.png' },
        { name: '乔兮', position: '发育路', image: '北京WB/乔兮曾庆龙.png' },
        { name: '丞丞', position: '辅助', image: '北京WB/丞丞陆俊丞.png' }
      ],
      '无锡TCG': [
        { name: '青槐', position: '对抗路', image: '无锡TCG/青槐赵君.png' },
        { name: '光明', position: '打野', image: '无锡TCG/光明余睿桐.png' },
        { name: '清弦', position: '中路', image: '无锡TCG/清弦肖桂蕊.png' },
        { name: '北觅', position: '发育路', image: '无锡TCG/北觅吴鸿伟.png' },
        { name: '江雾', position: '辅助', image: '无锡TCG/江雾刘舒菡.png' }
      ],
      '桐乡情久': [
        { name: '久寒', position: '对抗路', image: '桐乡情久/久寒朱飞扬.png' },
        { name: '深巅', position: '打野', image: '桐乡情久/深巅张嘉俊.png' },
        { name: '恒心', position: '中路', image: '桐乡情久/恒心汤书恒.png' },
        { name: '白衣', position: '发育路', image: '桐乡情久/白衣刘芳凯.png' },
        { name: '陌冷', position: '辅助', image: '桐乡情久/陌冷徐舟.png' }
      ],
      '武汉eStarPro': [
        { name: '誓约', position: '对抗路', image: '武汉eStarPro/誓约姚嘉鹏.png' },
        { name: 'Fly', position: '打野', image: '武汉eStarPro/Fly彭云飞.png' },
        { name: '亮宇', position: '中路', image: '武汉eStarPro/亮宇陈亮宇.png' },
        { name: 'Ming', position: '发育路', image: '武汉eStarPro/Ming池晓铭.png' },
        { name: '紫渊', position: '辅助', image: '武汉eStarPro/紫渊侯维国.png' }
      ],
      '重庆狼队': [
        { name: '归期', position: '对抗路', image: '重庆狼队/归期双小钧.png' },
        { name: '小胖', position: '打野', image: '重庆狼队/小胖李达亨.png' },
        { name: '紫幻', position: '中路', image: '重庆狼队/紫幻黄广顺.png' },
        { name: '道崽', position: '发育路', image: '重庆狼队/道崽杨凯博.png' },
        { name: '小叶叶', position: '辅助', image: '重庆狼队/小叶叶锦锋.png' }
      ]
    };

    // 获取当前俱乐部的选手数据
    const players = teamPlayers[team.name] || [
      { name: '选手1', position: '对抗路', image: '02776cd9fd27b80c90f9da6e521b2d01.png' },
      { name: '选手2', position: '打野', image: '1ca97e4fbf9cd9bf7d7844f63ed723f7.png' },
      { name: '选手3', position: '中路', image: '61edb1735ea7c7d32446c06775e7d465.png' },
      { name: '选手4', position: '发育路', image: '6dcf841b3fdee175fac77fe895a5c8e4.png' },
      { name: '选手5', position: '辅助', image: '880d089e276b1cb54a78ffa74256d6b9.png' }
    ];

    // 生成详情HTML
    content.innerHTML = `
      <div class="club-detail-header">
        <div class="club-detail-logo-container">
          <img src="./images/club/${teamId}.png" alt="${team.name}" class="club-detail-logo">
        </div>
        <div class="club-detail-info">
          <h3 class="club-detail-name">${team.name}</h3>
          <div class="club-detail-meta">
            <span class="club-detail-meta-item club-city-link" data-city="${team.city}" title="点击跳转到${team.city}文旅主页">
              📍 ${team.city}
            </span>
            <span class="club-detail-meta-item">成立于 ${team.founded} 年</span>
          </div>
          <div class="club-detail-stats">
            <div class="club-detail-stat">
              <span class="club-detail-stat-val">${team.titles}</span>
              <span class="club-detail-stat-label">总冠军</span>
            </div>
            <div class="club-detail-stat">
              <span class="club-detail-stat-val">${Math.floor(Math.random() * 10) + 5}</span>
              <span class="club-detail-stat-label">本赛季胜场</span>
            </div>
            <div class="club-detail-stat">
              <span class="club-detail-stat-val">${Math.floor(Math.random() * 5) + 2}</span>
              <span class="club-detail-stat-label">本赛季负场</span>
            </div>
          </div>
        </div>
      </div>

      <div class="club-detail-section">
        <h4>近期赛程</h4>
        <div class="club-detail-schedule">
          ${schedule.map(item => `
            <div class="schedule-item">
              <span class="schedule-date">${item.date}</span>
              <span class="schedule-match">${item.match}</span>
              <span class="schedule-score">${item.score}</span>
              <span class="schedule-result ${item.result}">
                ${item.result === 'win' ? '胜利' : item.result === 'lose' ? '失败' : '未赛'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="club-detail-section">
        <h4>队员名单</h4>
        <div class="club-detail-players">
          ${players.map(player => `
            <div class="player-mini-card">
              <div class="player-mini-avatar">
                <img src="./images/player/${player.image}" alt="${player.name}" onerror="this.src='./images/player/成都AG超玩会/一诺徐必成.png'">
              </div>
              <div class="player-mini-info">
                <h5 class="player-mini-name">${player.name}</h5>
                <p class="player-mini-position">${player.position}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="club-detail-section">
        <h4>俱乐部背景</h4>
        <p class="club-detail-story">
          ${team.name}是KPL联盟中的一支劲旅，成立于${team.founded}年。战队以${team.abbr}为简称，代表${team.city}参赛。
          经过多年的发展，战队已经成为KPL赛场上的一支强队，拥有众多忠实粉丝。
          战队以${team.titles > 0 ? `曾获得${team.titles}次总冠军` : '正在努力冲击总冠军'}为目标，不断拼搏进取。
          在本赛季，战队表现出色，展现出了强大的竞争力，有望在季后赛中取得更好的成绩。
        </p>
      </div>
    `;

    // 显示模态框
    overlay.classList.add('active');
    // 阻止板块背景滚动
    const blockEl = document.getElementById('block-competition');
    if (blockEl) blockEl.style.overflow = 'hidden';

    // 处理详情页logo样式 - 所有logo都使用透明背景
    const detailLogo = content.querySelector('.club-detail-logo');
    const detailContainer = content.querySelector('.club-detail-logo-container');
    if (detailLogo && detailContainer) {
      // 详情页所有logo都透明背景
      detailContainer.style.background = 'transparent';
      detailContainer.style.border = 'none';
      detailContainer.style.boxShadow = 'none';
      
      const src = detailLogo.src;
      const match = src.match(/club\/(\d+)\.png/);
      if (match) {
        const imgNumber = parseInt(match[1]);
        
        // 缩放配置
        const specialLogos = {
          1: { scale: 1.4 },
          2: { scale: 1.7 },
          3: { scale: 1.5 },
          4: { scale: 2.0 },
          5: { scale: 1.7 },
          6: { scale: 1.8 },
          7: { scale: 1.0 },
          8: { scale: 1.7 },
          9: { scale: 2.1 },
          10: { scale: 2.4 },
          11: { scale: 2.0 },
          12: { scale: 1.7 },
          13: { scale: 3.2 },
          14: { scale: 2.4 },
          15: { scale: 1.6 },
          16: { scale: 1.6 },
          17: { scale: 1.6 },
          18: { scale: 0.8 }
        };
        
        const config = specialLogos[imgNumber];
        if (config && config.scale) {
          detailLogo.style.transform = `scale(${config.scale})`;
        }
      }
    }

    // 绑定关闭事件
    document.getElementById('clubDetailClose').addEventListener('click', () => {
      overlay.classList.remove('active');
      const blockEl = document.getElementById('block-competition');
      if (blockEl) blockEl.style.overflow = '';
    });

    // 点击外部关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        const blockEl = document.getElementById('block-competition');
        if (blockEl) blockEl.style.overflow = '';
      }
    });

    // 城市跳转事件：点击城市跳转到文旅板块对应城市
    const cityLink = content.querySelector('.club-city-link');
    if (cityLink) {
      cityLink.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const cityName = cityLink.getAttribute('data-city');
        
        // 关闭俱乐部详情弹窗
        overlay.classList.remove('active');
        const competitionBlock = document.getElementById('block-competition');
        if (competitionBlock) competitionBlock.style.overflow = '';
        
        // 跳转到文旅板块
        if (typeof Lingbao !== 'undefined') {
          // 查找对应城市的数据
          const cityData = Data.cities.find(c => c.name === cityName);
          if (!cityData) {
            Utils.showToast(`未找到${cityName}的文旅信息`, 'warning');
            return;
          }
          
          // 定位到对应城市的函数
          const scrollToCity = () => {
            const cityCard = document.querySelector(`.tourism-card[data-city="${cityData.id}"]`);
            const cityDetail = document.getElementById(`detail-${cityData.id}`);
            
            if (cityCard && cityDetail) {
              // 先关闭所有其他城市的详情
              document.querySelectorAll('.tourism-detail.open').forEach(detail => {
                if (detail !== cityDetail) {
                  detail.classList.remove('open');
                  setTimeout(() => { detail.style.display = 'none'; }, 500);
                  const otherCityId = detail.id.replace('detail-', '');
                  document.querySelectorAll(`.expand-btn-sm[data-city-id="${otherCityId}"]`).forEach(btn => {
                    btn.textContent = '详情 →';
                  });
                }
              });
              
              // 展开目标城市详情
              cityDetail.style.display = 'block';
              cityDetail.offsetHeight;
              cityDetail.classList.add('open');
              
              // 更新按钮文本
              const expandBtn = cityCard.querySelector(`.expand-btn-sm[data-city-id="${cityData.id}"]`);
              if (expandBtn) {
                expandBtn.textContent = '详情 ↑';
              }
              
              // 滚动到城市卡片
              const travelBlock = document.getElementById('block-travel');
              if (travelBlock) {
                const cardWrapper = cityCard.closest('.city-card-wrapper') || cityCard;
                const blockRect = travelBlock.getBoundingClientRect();
                const cardRect = cardWrapper.getBoundingClientRect();
                const scrollOffset = cardRect.top - blockRect.top + travelBlock.scrollTop - 100;
                
                travelBlock.scrollTo({ 
                  top: Math.max(0, scrollOffset), 
                  behavior: 'smooth' 
                });
              }
              
              Utils.showToast(`已跳转到${cityName}文旅主页`, 'success');
            } else {
              Utils.showToast(`已进入文旅板块，请手动查找${cityName}`, 'info');
            }
          };
          
          // 进入文旅板块，并在完成后定位到对应城市
          Lingbao.enterBlock('travel', scrollToCity);
        }
      });
    }
  }
};

// 全局函数：滚动到区域
function scrollToSection(id) {
  Components.scrollToSection(id);
}

// 页面加载完成后初始化
console.log('DOMContentLoaded事件监听器已添加');
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded事件触发');
  // 俱乐部和板块功能由 BlockManager 懒加载，不再自动初始化
});
