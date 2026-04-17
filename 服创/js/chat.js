/**
 * 灵宝百事通 - AI对话模块（多板块版）
 * 每个板块有独立的聊天实例
 */

const Chat = {
  // 每个板块的独立状态
  _instances: {},

  getInstance(scenarioKey) {
    if (!this._instances[scenarioKey]) {
      this._instances[scenarioKey] = {
        currentScenario: scenarioKey,
        messages: [],
        isTyping: false,
        _abortController: null,
        _lastUserMessage: '',
        _loadingTimer: null,
        _voiceRecognition: null,
        _isListening: false
      };
    }
    return this._instances[scenarioKey];
  },

  // 当前活跃板块
  _activeBlock: null,

  setActive(block) {
    this._activeBlock = block;
  },

  init() {
    // 绑定主聊天区事件（保留兼容）
    this._bindBlockEvents('competition');
    this._bindBlockEvents('mentor');
    this._bindBlockEvents('travel');
  },

  _getEl(block, suffix) {
    return document.getElementById(`${suffix}-${block}`);
  },

  _bindBlockEvents(block) {
    const inst = this.getInstance(block);

    // 发送按钮
    const sendBtn = this._getEl(block, 'sendBtn');
    sendBtn?.addEventListener('click', () => this.handleSend(block));

    // 输入框
    const input = this._getEl(block, 'messageInput');
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend(block);
      }
      if (e.key === 'Escape' && inst.isTyping) {
        e.preventDefault();
        this.stopGeneration(block);
      }
    });

    // 输入框自动高度
    input?.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    // 语音输入
    const voiceBtn = this._getEl(block, 'voiceInputBtn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => this.toggleVoiceInput(block));
    }

    // 新对话按钮
    const newChatBtn = document.querySelector(`.new-chat-btn[data-block="${block}"]`);
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        if (inst.isTyping) {
          Utils.showToast('请等待当前对话完成', 'warning');
          return;
        }
        if (confirm('确定要开始新对话吗？当前对话记录将被清空。')) {
          this.clearMessages(block);
        }
      });
    }

    // 模型切换
    const modelSelect = document.querySelector(`.model-select[data-block="${block}"]`);
    if (modelSelect) {
      const savedModel = Utils.storage.get('selected_model');
      if (savedModel) {
        CONFIG.model = savedModel;
        modelSelect.value = savedModel;
      }
      modelSelect.addEventListener('change', () => {
        CONFIG.model = modelSelect.value;
        Utils.storage.set('selected_model', modelSelect.value);
        Utils.showToast(`已切换模型: ${modelSelect.options[modelSelect.selectedIndex].text}`, 'info');
      });
    }
  },

  // ========== 语音输入 ==========
  toggleVoiceInput(block) {
    const inst = this.getInstance(block);
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      Utils.showToast('当前浏览器不支持语音输入', 'warning');
      return;
    }

    if (inst._isListening) {
      this.stopVoiceInput(block);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    inst._voiceRecognition = new SpeechRecognition();
    inst._voiceRecognition.lang = 'zh-CN';
    inst._voiceRecognition.continuous = false;
    inst._voiceRecognition.interimResults = true;

    const btn = this._getEl(block, 'voiceInputBtn');
    const input = this._getEl(block, 'messageInput');

    inst._voiceRecognition.onstart = () => {
      inst._isListening = true;
      if (btn) { btn.classList.add('recording'); btn.title = '点击停止录音'; }
      Utils.showToast('正在聆听...', 'info', 2000);
    };

    inst._voiceRecognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (input) input.value = transcript;
    };

    inst._voiceRecognition.onend = () => this.stopVoiceInput(block);
    inst._voiceRecognition.onerror = (e) => {
      this.stopVoiceInput(block);
      if (e.error === 'not-allowed') Utils.showToast('请允许麦克风权限', 'error');
      else Utils.showToast('语音识别失败，请重试', 'warning');
    };

    inst._voiceRecognition.start();
  },

  stopVoiceInput(block) {
    const inst = this.getInstance(block);
    if (inst._voiceRecognition) {
      try { inst._voiceRecognition.stop(); } catch (e) {}
    }
    inst._isListening = false;
    const btn = this._getEl(block, 'voiceInputBtn');
    if (btn) { btn.classList.remove('recording'); btn.title = '语音输入'; }
  },

  // ========== 语音播报 ==========
  speak(text) {
    const synth = window.speechSynthesis || null;
    if (!synth) return;
    synth.cancel();
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/\*/g, '').replace(/`/g, '').replace(/~/g, '');
    if (!cleanText.trim()) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    synth.speak(utterance);
  },

  // ========== 消息持久化 ==========
  _storageKey(block) {
    return `chat_history_${block}`;
  },

  saveMessages(block) {
    const inst = this.getInstance(block);
    try { Utils.storage.set(this._storageKey(block), inst.messages); } catch (e) {}
  },

  restoreMessages(block) {
    const inst = this.getInstance(block);
    try {
      const saved = Utils.storage.get(this._storageKey(block), []);
      if (saved && saved.length > 0) {
        inst.messages = saved;
        const container = this._getEl(block, 'messagesContainer');
        if (container) {
          container.innerHTML = '';
          this._appendWelcomeMessage(block);
          saved.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
              const el = Components.createMessageElement(msg.content, msg.role === 'user', block);
              if (msg.role === 'assistant') this._addMessageActions(el, msg.content, block);
              container.appendChild(el);
            }
          });
          this._scrollToBottom(block);
        }
      }
    } catch (e) {}
  },

  _appendWelcomeMessage(block) {
    const container = this._getEl(block, 'messagesContainer');
    if (!container) return;
    const welcomeHtml = Data.getWelcomeMessage(block);
    const welcomeEl = Components.createMessageElement(welcomeHtml, false, block);
    container.appendChild(welcomeEl);
  },

  // ========== 发送消息 ==========
  async sendMessage(text, block) {
    if (!block) block = this._activeBlock;
    if (!block) return;

    // 切换到AI对话标签页
    const nav = document.getElementById(`blockNav-${block}`);
    if (nav) {
      const chatLink = nav.querySelector('.block-nav-link[data-target="chatArea-' + block + '"]');
      if (chatLink && !chatLink.classList.contains('active')) {
        chatLink.click();
      }
    }

    const inst = this.getInstance(block);
    const input = this._getEl(block, 'messageInput');
    const messageText = text || (input ? input.value.trim() : '');

    if (!messageText || inst.isTyping) return;

    if (input) { input.value = ''; input.style.height = 'auto'; }

    inst._lastUserMessage = messageText;
    this._appendMessage(messageText, true, block);
    
    // 智能搜索：如果需要实时数据，先搜索
    let searchData = '';
    if (typeof SearchAPI !== 'undefined' && SearchAPI.needsSearch(messageText)) {
      try {
        // 显示搜索提示
        Utils.showToast('🔍 正在搜索实时数据...', 'info', 2000);
        searchData = await SearchAPI.searchKPL(messageText);
        if (searchData) {
          Utils.showToast('✅ 已获取实时数据', 'success', 1500);
        }
      } catch (error) {
        console.error('[搜索出错]', error);
      }
    }
    
    // 将搜索结果注入消息
    const enhancedMessage = searchData ? 
      `${messageText}\n\n[系统提示：以下是搜索到的实时数据]\n${searchData}` : 
      messageText;
    
    inst.messages.push({ role: 'user', content: enhancedMessage });
    this.saveMessages(block);

    this._showLoading(block);
    inst.isTyping = true;

    try {
      const apiMessages = inst.messages.slice(-CONFIG.maxHistoryLength);
      if (API.isConfigured()) {
        await this._callAI(block, apiMessages);
      } else {
        await this._simulateResponse(block, messageText);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      this._removeLoading(block);
      const errMsg = `抱歉，出现了错误：${Utils.escapeHtml(error.message)}`;
      const container = this._getEl(block, 'messagesContainer');
      if (container) {
        const errEl = Components.createMessageElement(errMsg, false, block);
        container.appendChild(errEl);
        this._scrollToBottom(block);
      }
      inst.isTyping = false;
      this._resetSendButton(block, false);
    }
  },

  handleSend(block) {
    if (!block) block = this._activeBlock;
    const input = this._getEl(block, 'messageInput');
    if (input) this.sendMessage(input.value.trim(), block);
  },

  // ========== AI调用 ==========
  async _callAI(block, messages) {
    const inst = this.getInstance(block);
    this._resetSendButton(block, true);
    inst._abortController = new AbortController();
    let aiMsgEl = null;
    let finalContent = '';

    try {
      await API.streamChat(
        messages,
        (chunk) => {
          if (!aiMsgEl) {
            this._removeLoading(block);
            aiMsgEl = this._createStreamingMessage(block);
          }
          finalContent = chunk;
          const textNode = aiMsgEl?.querySelector('.stream-text');
          if (textNode) textNode.textContent = finalContent;
          this._throttleScroll(block);
        },
        (content) => {
          if (!aiMsgEl) { this._removeLoading(block); aiMsgEl = this._createStreamingMessage(block); }
          finalContent = finalContent || content;
          this._renderFinalMessage(aiMsgEl, finalContent, block);
          inst.messages.push({ role: 'assistant', content: finalContent });
          this.saveMessages(block);
          inst.isTyping = false;
          inst._abortController = null;
          this._resetSendButton(block, false);
          this._scrollToBottom(block);
        },
        (error) => {
          if (error.name === 'AbortError') return;
          this._removeLoading(block);
          this._appendMessage(`抱歉，请求失败：${Utils.escapeHtml(error.message)}。请稍后重试。`, false, block);
          inst.isTyping = false;
          inst._abortController = null;
          this._resetSendButton(block, false);
        },
        inst._abortController.signal
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        this._removeLoading(block);
        this._appendMessage(`抱歉，请求异常：${Utils.escapeHtml(error.message)}。`, false, block);
        inst.isTyping = false;
      }
      inst._abortController = null;
      this._resetSendButton(block, false);
    }
  },

  // ========== 停止/重新生成 ==========
  stopGeneration(block) {
    if (!block) block = this._activeBlock;
    const inst = this.getInstance(block);
    if (inst._abortController) {
      inst._abortController.abort();
      inst._abortController = null;
    }
    this._removeLoading(block);
    const streamEl = this._getEl(block, 'messagesContainer')?.querySelector('#streaming-message');
    if (streamEl) {
      const bubble = streamEl.querySelector('.stream-text');
      if (bubble && bubble.textContent.trim()) {
        this._renderFinalMessage(streamEl, bubble.textContent, block);
        streamEl.id = '';
        const content = bubble.textContent;
        if (content) {
          inst.messages.push({ role: 'assistant', content });
          // 保存暂停状态，以便后续继续
          inst._pausedContent = content;
          this.saveMessages(block);
        }
      } else {
        streamEl.remove();
      }
    }
    inst.isTyping = false;
    this._resetSendButton(block, false);
    Utils.showToast('已停止生成', 'info');
  },

  // ========== 继续生成 ==========
  continueGeneration(block) {
    if (!block) block = this._activeBlock;
    const inst = this.getInstance(block);
    
    // 检查是否有暂停的内容
    if (!inst._pausedContent) {
      Utils.showToast('没有可继续的内容', 'info');
      return;
    }
    
    // 获取最后一条用户消息
    const userMessages = inst.messages.filter(msg => msg.role === 'user');
    if (userMessages.length === 0) {
      Utils.showToast('没有用户消息可继续', 'info');
      return;
    }
    
    const lastUserMessage = userMessages[userMessages.length - 1];
    
    // 构建新的消息列表，包含用户消息和已生成的内容
    const messages = [lastUserMessage, { role: 'assistant', content: inst._pausedContent }];
    
    // 调用AI继续生成
    this._callAI(block, messages);
    
    // 清除暂停状态
    inst._pausedContent = null;
  },


  // ========== 模拟回复 ==========
  async _simulateResponse(block, userMessage) {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    this._removeLoading(block);
    const response = Data.getOfflineResponse(userMessage, block);
    this._appendMessage(response, false, block);
    const inst = this.getInstance(block);
    inst.messages.push({ role: 'assistant', content: response });
    this.saveMessages(block);
    inst.isTyping = false;
    if (!API.isConfigured()) {
      setTimeout(() => Utils.showToast('提示：连接服务器可解锁完整AI对话能力', 'info', 4000), 1000);
    }
  },

  // ========== 消息渲染 ==========
  _appendMessage(content, isUser, block) {
    const container = this._getEl(block, 'messagesContainer');
    if (!container) return;
    const msgEl = Components.createMessageElement(content, isUser, block);
    if (!isUser && !msgEl.classList.contains('loading-message')) {
      this._addMessageActions(msgEl, content, block);
    }
    container.appendChild(msgEl);
    this._scrollToBottom(block);
  },

  _addMessageActions(msgEl, content, block) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'msg-actions';
    actionsDiv.innerHTML = `
      <button class="msg-action-btn copy-btn" title="复制内容">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        <span>复制</span>
      </button>
      <button class="msg-action-btn speak-btn" title="语音播报">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
        <span>播报</span>
      </button>
      <button class="msg-action-btn continue-btn" title="继续生成">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,9 12,19 2,9"/></svg>
        <span>继续生成</span>
      </button>
      <button class="msg-action-btn regenerate-btn" title="重新生成">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
        <span>重新生成</span>
      </button>
    `;

    const contentDiv = msgEl.querySelector('.message-content');
    if (contentDiv) contentDiv.appendChild(actionsDiv);

    actionsDiv.querySelector('.copy-btn').addEventListener('click', async () => {
      const success = await Utils.copyToClipboard(content.replace(/<[^>]*>/g, ''));
      Utils.showToast(success ? '已复制到剪贴板' : '复制失败', success ? 'success' : 'error');
    });
    actionsDiv.querySelector('.speak-btn').addEventListener('click', () => {
      const plainText = content.replace(/<[^>]*>/g, '');
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
        Utils.showToast('已停止播报', 'info');
      } else {
        this.speak(plainText);
        Utils.showToast('正在播报...', 'info', 2000);
      }
    });
    actionsDiv.querySelector('.continue-btn').addEventListener('click', () => {
      const inst = this.getInstance(block);
      if (inst.isTyping) return;
      this.continueGeneration(block);
    });
    actionsDiv.querySelector('.regenerate-btn').addEventListener('click', () => {
      const inst = this.getInstance(block);
      if (!inst._lastUserMessage || inst.isTyping) return;
      const container = this._getEl(block, 'messagesContainer');
      if (container) {
        const msgs = container.querySelectorAll('.ai-message');
        if (msgs.length > 1) msgs[msgs.length - 1]?.remove();
      }
      if (inst.messages.length >= 2 && inst.messages[inst.messages.length - 1].role === 'assistant') {
        inst.messages.pop();
      }
      this.sendMessage(inst._lastUserMessage, block);
    });
  },

  // ========== 加载状态 ==========
  _showLoading(block) {
    const container = this._getEl(block, 'messagesContainer');
    if (!container) return;
    const icon = Data.getScenarioIcon(block);
    const iconHtml = icon && (icon.includes('.png') || icon.includes('.webp') || icon.includes('.jpg')) ? `<img src="${icon}" alt="avatar">` : `<span>${icon}</span>`;

    const loadingEl = document.createElement('div');
    loadingEl.className = 'message ai-message message-enter loading-message';
    loadingEl.id = 'loading-message';
    loadingEl.innerHTML = `
      <div class="message-avatar">${iconHtml}</div>
      <div class="message-content">
        <div class="message-bubble">
          <div class="loading-dots"><span></span><span></span><span></span></div>
        </div>
      </div>
    `;
    container.appendChild(loadingEl);
    this._scrollToBottom(block);
  },

  _removeLoading(block) {
    const inst = this.getInstance(block);
    if (inst._loadingTimer) { clearInterval(inst._loadingTimer); inst._loadingTimer = null; }
    const el = this._getEl(block, 'messagesContainer')?.querySelector('#loading-message');
    if (el) el.remove();
  },

  _createStreamingMessage(block) {
    const container = this._getEl(block, 'messagesContainer');
    if (!container) return null;
    const icon = Data.getScenarioIcon(block);
    const iconHtml = icon && (icon.includes('.png') || icon.includes('.webp') || icon.includes('.jpg')) ? `<img src="${icon}" alt="avatar">` : `<span>${icon}</span>`;
    const msgEl = document.createElement('div');
    msgEl.className = 'message ai-message message-enter';
    msgEl.id = 'streaming-message';
    msgEl.innerHTML = `
      <div class="message-avatar">${iconHtml}</div>
      <div class="message-content">
        <div class="message-bubble"><span class="stream-text"></span></div>
      </div>
    `;
    container.appendChild(msgEl);
    return msgEl;
  },

  _renderFinalMessage(msgEl, content, block) {
    const bubble = msgEl?.querySelector('.message-bubble');
    if (!bubble) return;
    bubble.innerHTML = Utils.parseSimpleMarkdown(content);
    const contentDiv = msgEl.querySelector('.message-content');
    if (contentDiv && !contentDiv.querySelector('.message-time')) {
      const timeEl = document.createElement('div');
      timeEl.className = 'message-time';
      timeEl.textContent = Utils.formatTime();
      contentDiv.appendChild(timeEl);
    }
    this._addMessageActions(msgEl, content, block);
  },

  _resetSendButton(block, isLoading) {
    const btn = this._getEl(block, 'sendBtn');
    if (!btn) return;
    
    // 移除所有旧的事件监听器
    const oldStopHandler = btn._stopHandler;
    if (oldStopHandler) {
      btn.removeEventListener('click', oldStopHandler);
      btn._stopHandler = null;
    }
    
    if (isLoading) {
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      btn.title = '停止生成 (ESC)';
      btn.disabled = false; // 启用按钮以便点击停止
      
      // 添加停止生成的点击事件
      const stopHandler = () => this.stopGeneration(block);
      btn._stopHandler = stopHandler;
      btn.addEventListener('click', stopHandler);
    } else {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>';
      btn.title = '发送消息';
      btn.disabled = false;
      // 发送事件已经在_bindBlockEvents中绑定，不需要重新绑定
    }
  },

  _scrollCounter: {},

  _throttleScroll(block) {
    if (!this._scrollCounter[block]) this._scrollCounter[block] = 0;
    this._scrollCounter[block]++;
    if (this._scrollCounter[block] >= 5) {
      this._scrollCounter[block] = 0;
      this._scrollToBottom(block);
    }
  },

  _scrollToBottom(block) {
    const container = this._getEl(block, 'messagesContainer');
    if (container) {
      requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
    }
  },

  // ========== 兼容旧接口 ==========
  get currentScenario() {
    return this._activeBlock || CONFIG.defaultScenario;
  },

  get messages() {
    return this._activeBlock ? this.getInstance(this._activeBlock).messages : [];
  },

  get isTyping() {
    return this._activeBlock ? this.getInstance(this._activeBlock).isTyping : false;
  },

  // 兼容旧的 switchScenario (现在在板块内不需要切换tab)
  switchScenario(scenarioKey) {
    // no-op, handled by enterBlock in Lingbao
  },

  clearMessages(block) {
    if (!block) block = this._activeBlock;
    if (!block) return;
    
    const inst = this.getInstance(block);
    if (inst.isTyping) this.stopGeneration(block);
    
    inst.messages = [];
    inst._lastUserMessage = '';
    inst._pausedContent = null;
    
    Utils.storage.remove(this._storageKey(block));
    
    const container = this._getEl(block, 'messagesContainer');
    if (container) {
      container.innerHTML = '';
      this._appendWelcomeMessage(block);
    }
    
    Utils.showToast('对话已清空，开始新对话', 'success');
  }
};
