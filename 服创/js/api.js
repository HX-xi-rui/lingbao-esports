/**
 * 灵宝百事通 - API模块
 * 腾讯混元大模型（OpenAI兼容接口）
 * 支持直连模式和本地代理模式（解决CORS跨域）
 */

const API = {
  /**
   * 检查API是否已配置
   */
  isConfigured() {
    const key = CONFIG.apiKey;
    return key && typeof key === 'string' && key.length > 10;
  },
  
  /**
   * 构建带系统提示的消息列表（混元支持 system 角色）
   * 增强：注入选手知识库（简易RAG）+ 用户画像
   */
  _buildMessages(rawMessages) {
    // 检查是否已经包含system消息（灵宝模式）
    const hasSystemMessage = rawMessages.length > 0 && rawMessages[0].role === 'system';
    
    // 如果已经有system消息，直接追加对话历史，不做修改
    if (hasSystemMessage) {
      const messages = [];
      
      // 使用传入的system消息
      messages.push({
        role: 'system',
        content: rawMessages[0].content
      });
      
      // 追加user和assistant消息
      for (let i = 1; i < rawMessages.length; i++) {
        const msg = rawMessages[i];
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: typeof msg.content === 'string' ? msg.content : String(msg.content)
          });
        }
      }
      return messages;
    }
    
    // 原有逻辑：根据场景构建system消息
    const scenario = Chat.currentScenario || CONFIG.defaultScenario;
    const scenarioConfig = CONFIG.scenarios[scenario];
    
    // 以 system 消息开头注入场景人设
    const messages = [];
    
    let systemContent = '';
    if (scenarioConfig && scenarioConfig.systemPrompt) {
      systemContent = scenarioConfig.systemPrompt;
    }

    // 注入用户画像
    if (typeof CONFIG !== 'undefined' && CONFIG.userPreferences) {
      const prefs = [];
      if (CONFIG.userPreferences.favoriteTeam) prefs.push(`用户关注的战队：${CONFIG.userPreferences.favoriteTeam}`);
      if (CONFIG.userPreferences.favoriteCity) prefs.push(`用户关注的城市：${CONFIG.userPreferences.favoriteCity}`);
      if (CONFIG.userPreferences.favoritePlayers && CONFIG.userPreferences.favoritePlayers.length > 0) {
        prefs.push(`用户关注的选手：${CONFIG.userPreferences.favoritePlayers.join('、')}`);
      }
      if (prefs.length > 0) {
        systemContent += '\n\n【用户画像】\n' + prefs.join('\n') + '\n回答时可适当侧重上述偏好。';
      }
    }

    // 注入选手知识库（简易RAG）
    if (typeof Players !== 'undefined') {
      const lastUserMsg = rawMessages.filter(m => m.role === 'user').pop();
      if (lastUserMsg) {
        const detected = Players.detectPlayerInMessage(lastUserMsg.content);
        if (detected.length > 0) {
          let playerContext = '\n\n【选手数据参考】\n以下是相关选手的官方数据，请基于这些信息回答：\n';
          detected.forEach(pid => {
            const ctx = Players.getPlayerContext(pid);
            if (ctx) playerContext += ctx + '\n';
          });
          systemContent += playerContext;
        }
      }
    }

    if (systemContent) {
      messages.push({ role: 'system', content: systemContent });
    }
    
    // 追加对话历史
    for (const msg of rawMessages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content : String(msg.content)
        });
      }
    }
    
    return messages;
  },

  /**
   * 发送流式请求到腾讯混元API（OpenAI兼容格式）
   * @param {Array} rawMessages - 原始消息历史 [{role, content}]
   * @param {function} onChunk - 流式数据回调 (累积内容)
   * @param {function} onComplete - 完成回调 (最终内容)
   * @param {function} onError - 错误回调
   * @param {AbortSignal} [signal] - 可选，用于中止请求
   */
  async streamChat(rawMessages, onChunk, onComplete, onError, signal) {
    const useProxy = CONFIG.useProxy;
    const endpoint = useProxy ? CONFIG.proxyEndpoint : CONFIG.apiEndpoint;
    
    const messages = this._buildMessages(rawMessages);
    
    // 根据模型类型调整参数
    const requestBody = {
      model: CONFIG.model,
      messages: messages,
      stream: true,
      max_tokens: 4096,
      temperature: 0.9,
      top_p: 1.0
    };
    
    // 混元思考模型启用联网搜索
    // TokenHub使用OpenAI兼容格式，联网搜索参数为 search: true
    if (CONFIG.model === 'hunyuan-2.0-thinking-20251109') {
      requestBody.search = true;  // 开启联网搜索（关键参数）
    }
    
    let headers = {
      'Content-Type': 'application/json'
    };

    if (useProxy) {
      headers['X-API-Authorization'] = `Bearer ${CONFIG.apiKey}`;
    } else {
      headers['Authorization'] = `Bearer ${CONFIG.apiKey}`;
    }

    try {
      console.log(`[API] 混元请求 (${useProxy ? '代理' : '直连'}):`, CONFIG.model);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(useProxy ? { ...requestBody, authHeader: `Bearer ${CONFIG.apiKey}` } : requestBody),
        signal: signal || null
      });
      
      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const errData = await response.json();
          errorMsg = errData?.error?.message || 
                     errData?.message ||
                     JSON.stringify(errData) ||
                     errorMsg;
        } catch (e) {}
        throw new Error(`混元API请求失败 (${response.status}): ${errorMsg}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          
          // 跳过空行和注释行
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          
          const data = trimmed.slice(5).trim();
          
          // 流结束标记
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            
            // OpenAI标准格式：choices[0].delta.content
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              fullContent += content;
              onChunk(fullContent);
            }
          } catch (e) {
            // 忽略解析错误，继续处理下一行
          }
        }
      }
      
      onComplete(fullContent);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[API] 请求被中止');
        onError(error);
        return;
      }
      console.error('混元API Error:', error);
      onError(error);
    }
  },

  /**
   * 发送非流式请求（备选方案）
   */
  async chat(messages) {
    const useProxy = CONFIG.useProxy;
    const endpoint = useProxy ? CONFIG.proxyEndpoint : CONFIG.apiEndpoint;
    const fullMessages = this._buildMessages(messages);
    
    const requestBody = {
      model: CONFIG.model,
      messages: fullMessages,
      stream: false,
      max_tokens: 4096
    };

    let headers = { 'Content-Type': 'application/json' };
    
    if (useProxy) {
      headers['X-API-Authorization'] = `Bearer ${CONFIG.apiKey}`;
    } else {
      headers['Authorization'] = `Bearer ${CONFIG.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(
        useProxy 
          ? { ...requestBody, authHeader: `Bearer ${CONFIG.apiKey}` }
          : requestBody
      )
    });
    
    if (!response.ok) {
      throw new Error(`混元API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    // OpenAI标准响应格式
    return data.choices?.[0]?.message?.content || '';
  }
};
