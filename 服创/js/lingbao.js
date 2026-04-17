/**
 * 灵宝百事通 - 灵宝互动模块
 * 灵宝作为智能引路人，帮助用户导航到三大AI场景（独立板块）
 */

const Lingbao = {
  isProcessing: false,
  currentBlock: null,
  
  // 等待确认跳转的状态
  pendingScenario: null,
  
  // 对话历史（用于上下文理解）
  conversationHistory: [],
  
  // AI对话控制器
  abortController: null,

  keywordMap: {
    competition: [
      '赛事', '比赛', 'KPL', 'kpl', '战队', '战术', '战报', '选手', '胜负',
      '赛季', '季后赛', '常规赛', '总决赛', '冠军', '亚军', '比分', '阵容',
      '解说', '赛事指挥官', '亚瑟', '竞技', '对抗', '竞技场', '杯赛',
      'ag', 'AG', 'estar', 'eStar', '狼队', 'wb', 'WB', 'hero', 'Hero',
      'drg', 'DRG', 'ttg', 'TTG', 'ksg', 'KSG', 'hero久竞', '重庆'
    ],
    mentor: [
      '英雄', '教学', '技巧', '连招', '铭文', '装备', '出装', '上分',
      '教学', '攻略', '对线', '团战', '打法', '克制', '推荐', '版本',
      '荣耀导师', '妲己', '法师', '射手', '打野', '辅助', '对抗路',
      '中路', '发育路', '游走', '段位', '钻石', '王者', '星耀', '铂金',
      '怎么玩', '怎么打', '如何', '教学', '出什么', '带什么'
    ],
    travel: [
      '文旅', '旅行', '旅游', '城市', '主场', '场馆', '打卡', '攻略',
      '电竞文旅', '马可波罗', '冒险家', '路线', '景点', '美食', '酒店',
      '机票', '门票', '观赛', '线下', '主场城市', '成都', '上海', '武汉',
      '深圳', '西安', '北京', '广州', '杭州', '南京', '重庆', '长沙', '济南'
    ]
  },

  scenarioInfo: {
    competition: {
      name: '亚瑟',
      role: '赛事指挥官',
      icon: './images/heroes/亚瑟.jpg',
      reply: '让我为你连接<strong>圣骑亚瑟</strong>，前往KPL赛事，他是专业的赛事解说和战术分析师！'
    },
    mentor: {
      name: '妲己',
      role: '荣耀导师',
      icon: './images/heroes/妲己.jpg',
      reply: '让我为你连接<strong>妲己导师</strong>，学习英雄技巧和上分攻略，她会手把手教你成为王者！'
    },
    travel: {
      name: '马可波罗',
      role: '电竞文旅向导',
      icon: './images/heroes/马可波罗.jpg',
      reply: '让我为你连接<strong>冒险家马可波罗</strong>，去往电竞文旅，他走遍了所有主场城市！'
    }
  },

  // 灵宝的对话回复库（模仿王者荣耀风格）
  dialogueResponses: {
    greetings: [
      '召唤师，今天想探索什么新世界呢？✨',
      '哇~看到你真开心！有什么可以帮到你的吗？🌟',
      '嗨嗨！灵宝一直在等你呢~想知道什么？💫'
    ],
    confirmations: {
      competition: [
        '看起来你想了解KPL赛事相关的信息呢！要去找<strong>亚瑟大哥</strong>聊聊吗？他可是赛事专家哦！🏆',
        '哎呀~是要看比赛战报吗？<strong>亚瑟</strong>正在等着你呢，要去找他吗？⚔️'
      ],
      mentor: [
        '想学习英雄技巧呀！<strong>妲己姐姐</strong>最擅长这个了，要去找她学习吗？🎮',
        '上分秘籍？这个我懂！不过<strong>妲己导师</strong>比我更厉害，要去找她吗？📚'
      ],
      travel: [
        '想去电竞城市打卡吗？<strong>马可波罗</strong>可是专业的旅行家！要和他一起出发吗？🌆',
        '哇~电竞赛事主场城市超酷的！<strong>马可波罗</strong>可以带你逛遍全国，要去找他吗？✈️'
      ]
    },
    confirmWords: ['好的', '可以', '嗯', '是', '对', '要', '去吧', '走', '行', 'OK', 'ok', 'Ok', '确认', '确定', '是的', '好的吧', '走起'],
    cancelWords: ['不', '不要', '算了', '取消', 'no', 'No', 'NO', '不用', '不了', '下次', '等等', '停', '不想'],
    unsure: [
      '嗯...灵宝没太听懂呢，能再说清楚一点吗？🤔',
      '召唤师，你说的有点深奥呢，能换个说法吗？💭',
      '这个灵宝还需要学习~你能告诉我更多细节吗？📖'
    ],
    chat: [
      '嘻嘻~这个话题有点难倒灵宝了呢！不过灵宝会继续努力的！💪',
      '召唤师真有趣！虽然灵宝不太懂，但是很开心和你聊天！😊',
      '你说的这些灵宝还在学习中~不如我们聊聊王者荣耀？🎮'
    ],
    help: [
      '灵宝可以帮你找到最合适的伙伴哦！\n\n🏆 <strong>赛事指挥官·亚瑟</strong> - KPL赛事、战队、选手\n🎮 <strong>荣耀导师·妲己</strong> - 英雄教学、上分攻略\n🌆 <strong>电竞文旅·马可波罗</strong> - 城市打卡、线下观赛\n\n告诉我你想了解什么，灵宝帮你连接！✨'
    ],
    farewell: [
      '下次再来找灵宝玩哦！灵宝会一直在这里的~💕',
      '拜拜召唤师！有需要随时叫灵宝哦！👋',
      '期待下次见面！灵宝会想念你的~🌟'
    ]
  },

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.bindEvents();
  },

  bindEvents() {
    const input = document.getElementById('lingbaoInput');
    const sendBtn = document.getElementById('lingbaoSendBtn');

    if (!input || !sendBtn) return;

    // 浮动灵宝点击事件
    const floatingLingbao = document.querySelector('.floating-lingbao');
    if (floatingLingbao) {
      floatingLingbao.addEventListener('click', () => {
        document.getElementById('lingbao').scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[href="#lingbao"]').classList.add('active');
      });
    }

    sendBtn.addEventListener('click', () => this.handleSend());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    // 快捷标签 - 直接跳转（跟导航栏一样）
    document.querySelectorAll('.lb-quick-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const scenario = tag.getAttribute('data-scenario');
        if (scenario) {
          console.log('[灵宝] 快捷标签点击，直接跳转:', scenario);
          Lingbao.enterBlock(scenario);
        }
      });
    });

    // 英雄卡片点击 - 直接跳转（跟导航栏一样）
    document.querySelectorAll('.orbit-card').forEach(card => {
      card.addEventListener('click', () => {
        const scenario = card.getAttribute('data-hero');
        if (scenario) {
          console.log('[灵宝] 英雄卡片点击，直接跳转:', scenario);
          Lingbao.enterBlock(scenario);
        }
      });
    });

    // 板块返回按钮
    ['competition', 'mentor', 'travel'].forEach(scenario => {
      const backBtn = document.getElementById(`back-${scenario}`);
      if (backBtn) {
        backBtn.addEventListener('click', () => this.exitBlock(scenario));
      }

      // 返回首页按钮
      const backToHomeBtn = document.getElementById(`backToHome-${scenario}`);
      if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
          this.exitBlock(scenario);
          // 更新导航栏状态，切换到首页
          const navLinks = document.querySelectorAll('.nav-link');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-nav') === 'home') {
              link.classList.add('active');
            }
          });
          // 滚动到首页
          setTimeout(() => {
            const homeSection = document.getElementById('home');
            if (homeSection) {
              homeSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        });
      }
    });
  },

  handleSend() {
    if (this.isProcessing) return;
    const input = document.getElementById('lingbaoInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    this.appendUserMessage(text);
    
    // 记录对话历史
    this.conversationHistory.push({ role: 'user', content: text });

    // 检查是否在等待确认跳转
    if (this.pendingScenario) {
      this.handleConfirmResponse(text);
      return;
    }

    // 调用AI进行智能对话
    this.callAI(text);
  },

  /**
   * 调用AI进行智能对话
   */
  async callAI(text) {
    if (!API.isConfigured()) {
      // API未配置，使用本地规则回复
      this.showThinking();
      setTimeout(() => {
        this.handleDialogue(text);
      }, 800);
      return;
    }

    this.isProcessing = true;
    this.abortController = new AbortController();
    
    // 显示思考动画
    this.showThinking();

    try {
      // 构建消息历史（保留最近10轮对话）
      const messages = [
        { role: 'system', content: CONFIG.lingbao.systemPrompt },
        ...this.conversationHistory.slice(-10)
      ];

      let fullContent = '';
      let hasStartedTyping = false;

      await API.streamChat(
        messages,
        (chunk) => {
          // 流式更新
          if (!hasStartedTyping) {
            hasStartedTyping = true;
            this.removeThinking();
          }
          this.updateLingbaoMessage(chunk);
        },
        (finalContent) => {
          // 完成
          fullContent = finalContent;
          this.conversationHistory.push({ role: 'assistant', content: finalContent });
          
          // 分析AI回复，判断是否包含跳转意图
          this.analyzeAIResponse(finalContent);
          
          this.isProcessing = false;
        },
        (error) => {
          // 错误处理
          this.removeThinking();
          this.appendLingbaoMessage('哎呀~灵宝有点累了，我们等会儿再聊吧...💫');
          this.isProcessing = false;
          console.error('灵宝AI对话出错:', error);
        },
        this.abortController.signal
      );
    } catch (error) {
      this.removeThinking();
      this.appendLingbaoMessage('唔...灵宝遇到了一点小问题，再说一次好吗？🤔');
      this.isProcessing = false;
    }
  },

  /**
   * 更新灵宝消息（流式）
   */
  updateLingbaoMessage(content) {
    let msgEl = document.querySelector('.lb-msg.lb-reply:last-child .lb-msg-content p');
    
    if (!msgEl) {
      // 创建新消息
      const container = document.getElementById('lingbaoMessages');
      if (!container) return;
      
      const msg = document.createElement('div');
      msg.className = 'lb-msg lb-reply';
      msg.innerHTML = `
        <div class="lb-msg-avatar"><img src="./images/灵宝.jpg" alt="灵宝"></div>
        <div class="lb-msg-content">
          <p></p>
        </div>
      `;
      container.appendChild(msg);
      msgEl = msg.querySelector('p');
    }
    
    if (msgEl) {
      msgEl.innerHTML = content;
      this.scrollMessages();
    }
  },

  /**
   * 分析AI回复，判断是否推荐了场景
   */
  analyzeAIResponse(content) {
    const lower = content.toLowerCase();
    
    // 检测AI是否推荐了场景（等待用户确认）
    const scenarioPatterns = {
      competition: /亚瑟|赛事指挥官|kpl|比赛.*找他|赛事.*亚瑟/,
      mentor: /妲己|荣耀导师|英雄教学|上分.*妲己|技巧.*妲己/,
      travel: /马可波罗|电竞文旅|城市.*马可|旅行.*马可/
    };
    
    // 检查是否包含确认提示（更宽松的检测）
    const hasConfirmHint = /好的|可以|走|要|去吧|确认|确定/.test(content);
    
    // 判断推荐场景
    for (const [scenario, pattern] of Object.entries(scenarioPatterns)) {
      if (pattern.test(content) && hasConfirmHint) {
        // AI推荐了该场景并等待确认
        this.pendingScenario = scenario;
        console.log(`[灵宝] 检测到推荐场景: ${scenario}, 等待用户确认`);
        break;
      }
    }
  },

  /**
   * 处理对话（本地规则，无API时使用）
   */
  handleDialogue(text) {
    const lower = text.toLowerCase();
    
    // 检查是否是帮助请求
    if (lower.includes('帮助') || lower.includes('help') || lower.includes('怎么用') || lower.includes('功能')) {
      this.showHelpReply();
      return;
    }
    
    // 检查是否是告别
    if (lower.includes('再见') || lower.includes('拜拜') || lower.includes('bye') || lower.includes('走了')) {
      this.showFarewellReply();
      return;
    }
    
    // 检查是否是打招呼
    if (lower.includes('你好') || lower.includes('嗨') || lower.includes('hi') || lower.includes('hello') || lower === '在吗') {
      this.showGreetingReply();
      return;
    }
    
    // 分析意图
    const scenario = this.analyzeIntent(text);
    
    // 如果有明确的意图匹配，询问是否跳转
    if (scenario) {
      this.pendingScenario = scenario;
      this.showConfirmReply(scenario);
    } else {
      // 没有明确意图，进行普通对话
      this.showChatReply();
    }
  },

  /**
   * 处理用户的确认/取消响应
   */
  handleConfirmResponse(text) {
    const lower = text.toLowerCase().trim();
    
    console.log('[灵宝] 处理确认响应:', text, 'pendingScenario:', this.pendingScenario);
    
    // 精确匹配确认词（避免误判）
    const confirmKeywords = ['好的', '可以', '走', '行', '好呀', '好哒', '嗯', '是', '对', '要', '去吧', 'ok', '确认', '确定', '是的', '走起', '好', 'ok'];
    const cancelKeywords = ['不', '不要', '算了', '取消', 'no', '不用', '不了', '下次', '等等', '停', '不想', '别'];
    
    const isConfirm = confirmKeywords.some(word => lower === word || lower.startsWith(word + ' ') || lower.endsWith(' ' + word));
    const isCancel = cancelKeywords.some(word => lower === word || lower.startsWith(word + ' ') || lower.endsWith(' ' + word));
    
    console.log('[灵宝] 确认检测结果:', { isConfirm, isCancel });
    
    if (isConfirm && !isCancel) {
      // 用户确认跳转
      console.log('[灵宝] 用户确认跳转，场景:', this.pendingScenario);
      this.appendLingbaoMessage('好哒~这就带你去找他！出发咯！🚀');
      setTimeout(() => {
        console.log('[灵宝] 执行 enterBlock:', this.pendingScenario);
        this.enterBlock(this.pendingScenario);
        this.pendingScenario = null;
      }, 600);
    } else if (isCancel && !isConfirm) {
      // 用户取消跳转
      console.log('[灵宝] 用户取消跳转');
      this.appendLingbaoMessage('没问题！那我们继续聊吧~还有什么想问灵宝的吗？😊');
      this.pendingScenario = null;
    } else {
      // 不确定用户意图，继续AI对话
      console.log('[灵宝] 不确定用户意图，继续AI对话');
      this.callAI(text);
    }
  },

  /**
   * 获取意图匹配分数
   */
  getIntentScore(text, scenario) {
    const lower = text.toLowerCase();
    let score = 0;
    const keywords = this.keywordMap[scenario] || [];
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    return score;
  },

  analyzeIntent(text) {
    const lower = text.toLowerCase();
    const scores = { competition: 0, mentor: 0, travel: 0 };

    for (const [scenario, keywords] of Object.entries(this.keywordMap)) {
      for (const kw of keywords) {
        if (lower.includes(kw.toLowerCase())) {
          scores[scenario] += 1;
        }
      }
    }

    let maxScore = 0;
    let bestScenario = 'competition';
    for (const [scenario, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestScenario = scenario;
      }
    }

    if (maxScore === 0) {
      const genericGameWords = ['玩', '游戏', '王者', '农药', '英雄'];
      for (const w of genericGameWords) {
        if (lower.includes(w)) {
          return 'mentor';
        }
      }
      return null; // 返回null表示没有明确意图
    }

    return bestScenario;
  },

  // ========== 各种回复方法 ==========
  
  showGreetingReply() {
    this.removeThinking();
    const replies = this.dialogueResponses.greetings;
    const reply = replies[Math.floor(Math.random() * replies.length)];
    this.appendLingbaoMessage(reply);
  },

  showConfirmReply(scenario) {
    this.removeThinking();
    const replies = this.dialogueResponses.confirmations[scenario];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    this.appendLingbaoMessage(reply + '\n\n<strong><strong></strong>告诉我，我立刻带你去找他，或者告诉我你还想聊别的~');
  },

  showHelpReply() {
    this.removeThinking();
    this.appendLingbaoMessage(this.dialogueResponses.help[0]);
  },

  showChatReply() {
    this.removeThinking();
    const replies = this.dialogueResponses.chat;
    const reply = replies[Math.floor(Math.random() * replies.length)];
    this.appendLingbaoMessage(reply);
  },

  showFarewellReply() {
    this.removeThinking();
    const replies = this.dialogueResponses.farewell;
    const reply = replies[Math.floor(Math.random() * replies.length)];
    this.appendLingbaoMessage(reply);
  },

  appendLingbaoMessage(text) {
    const container = document.getElementById('lingbaoMessages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = 'lb-msg lb-reply';
    msg.innerHTML = `
      <div class="lb-msg-avatar"><img src="./images/灵宝.jpg" alt="灵宝"></div>
      <div class="lb-msg-content">
        <p>${text}</p>
      </div>
    `;
    container.appendChild(msg);
    this.scrollMessages();
    
    // 记录对话历史
    this.conversationHistory.push({ role: 'assistant', content: text });
  },

  showThinking() {
    const container = document.getElementById('lingbaoMessages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = 'lb-msg lb-thinking';
    msg.id = 'lb-thinking-msg';
    msg.innerHTML = `
      <div class="lb-msg-avatar"><img src="./images/灵宝.jpg" alt="灵宝"></div>
      <div class="lb-msg-content">
        <div class="lb-thinking-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    container.appendChild(msg);
    this.scrollMessages();
  },

  removeThinking() {
    const el = document.getElementById('lb-thinking-msg');
    if (el) el.remove();
  },

  showReply(scenario) {
    this.removeThinking();
    const info = this.scenarioInfo[scenario];
    if (!info) return;

    const container = document.getElementById('lingbaoMessages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = 'lb-msg lb-reply';
    msg.innerHTML = `
      <div class="lb-msg-avatar"><img src="./images/灵宝.jpg" alt="灵宝"></div>
      <div class="lb-msg-content">
        <p>${info.reply}</p>
      </div>
    `;
    container.appendChild(msg);
    this.scrollMessages();
  },

  appendUserMessage(text) {
    const container = document.getElementById('lingbaoMessages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = 'lb-msg lb-user';
    msg.innerHTML = `
      <div class="lb-msg-avatar">👤</div>
      <div class="lb-msg-content">
        <p>${Utils.escapeHtml(text)}</p>
      </div>
    `;
    container.appendChild(msg);
    this.scrollMessages();
  },

  scrollMessages() {
    const container = document.getElementById('lingbaoMessages');
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  },

  /**
   * 进入板块（全屏切换）
   * @param {string} scenario - 板块名称
   * @param {function} callback - 板块加载完成后的回调函数
   */
  enterBlock(scenario, callback) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const info = this.scenarioInfo[scenario];
    if (!info) {
      this.isProcessing = false;
      return;
    }

    // 1. 激活对应英雄卡片
    this.activateHeroCard(scenario);

    // 2. 显示灵宝思考
    this.showThinking();

    // 3. 灵宝回复
    setTimeout(() => {
      this.showReply(scenario);
    }, 1200);

    // 4. 显示过渡动画
    setTimeout(() => {
      // 创建过渡动画元素
      const transitionOverlay = document.createElement('div');
      transitionOverlay.className = 'lb-transition-overlay';
      transitionOverlay.innerHTML = `
        <div class="lb-transition-content">
          <div class="lb-transition-avatar">
            <img src="${info.icon}" alt="${info.name}">
          </div>
          <div class="lb-transition-text">正在连接 ${info.name}...</div>
          <div class="lb-transition-progress"></div>
        </div>
      `;
      document.body.appendChild(transitionOverlay);

      // 激活过渡动画
      setTimeout(() => {
        transitionOverlay.classList.add('active');
      }, 100);

      // 5. 切换到板块视图
      setTimeout(() => {
        const overlay = document.getElementById(`block-${scenario}`);
        if (overlay) {
          overlay.classList.add('active');
          document.body.classList.add('block-active');
          overlay.scrollTop = 0;
          this.currentBlock = scenario;
          
          // 跳转成功，清理pending状态
          this.pendingScenario = null;

          // 初始化该板块的聊天和功能
          if (typeof BlockManager !== 'undefined') {
            BlockManager.initBlock(scenario);
          }
          
          // 执行回调（板块已显示）
          if (typeof callback === 'function') {
            // 延迟执行回调，确保内容已渲染
            setTimeout(() => {
              try {
                callback();
              } catch (err) {
                console.warn('板块回调执行失败:', err);
              }
            }, 200);
          }
        }
        this.deactivateHeroCards();
        
        // 移除过渡动画
        setTimeout(() => {
          if (transitionOverlay) {
            transitionOverlay.classList.remove('active');
            setTimeout(() => {
              if (transitionOverlay.parentNode) {
                transitionOverlay.parentNode.removeChild(transitionOverlay);
              }
            }, 500);
          }
          this.isProcessing = false;
        }, 300);
      }, 1000);
    }, 1800);
  },

  /**
   * 退出板块，返回灵宝
   */
  exitBlock(scenario) {
    const overlay = document.getElementById(`block-${scenario}`);
    if (overlay) {
      // 添加退出动画
      overlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      overlay.style.opacity = '0';
      overlay.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        overlay.classList.remove('active');
        document.body.classList.remove('block-active');
        // 重置样式
        setTimeout(() => {
          overlay.style.transition = '';
          overlay.style.opacity = '';
          overlay.style.transform = '';
        }, 100);
      }, 300);
    }
    if (this.currentBlock === scenario) {
      this.currentBlock = null;
    }

    // 清理跳转状态 - 关键修复！
    this.pendingScenario = null;
    
    // 清空对话历史（可选，如果想保留对话历史可以注释掉）
    // this.conversationHistory = [];

    // 更新导航栏状态，切换到灵宝
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === 'lingbao') {
        link.classList.add('active');
      }
    });

    // 滚动回灵宝区域
    setTimeout(() => {
      const lingbaoSection = document.getElementById('lingbao');
      if (lingbaoSection) {
        lingbaoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  },

  activateHeroCard(scenario) {
    document.querySelectorAll('.orbit-card').forEach(card => {
      card.style.animationPlayState = 'paused';
    });

    const target = document.getElementById(`hero-${scenario}`);
    if (target) {
      target.classList.add('active');
    }

    const conn = document.getElementById(`conn-${scenario}`);
    if (conn) {
      conn.classList.add('active');
    }
  },

  deactivateHeroCards() {
    document.querySelectorAll('.orbit-card').forEach(card => {
      card.classList.remove('active');
      card.style.animationPlayState = '';
    });
    document.querySelectorAll('.orbit-connector').forEach(conn => {
      conn.classList.remove('active');
    });
  }
};
