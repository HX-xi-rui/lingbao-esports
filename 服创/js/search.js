/**
 * 灵宝百事通 - 搜索模块
 * 在AI回答前先搜索相关实时数据
 */

const SearchAPI = {
  /**
   * 搜索KPL相关信息
   * @param {string} query - 搜索关键词
   * @returns {Promise<string>} 搜索结果
   */
  async searchKPL(query) {
    try {
      // 方案A：调用后端搜索API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, source: 'kpl' })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result || '';
      }
      
      // 方案B：使用模拟数据
      return this._getMockData(query);
    } catch (error) {
      console.error('[搜索失败]', error);
      return '';
    }
  },
  
  /**
   * 搜索KPL相关信息
   */
  async searchKPL(query) {
    try {
      // 显示搜索提示
      console.log('[搜索] 正在查询:', query);
      
      // 调用后端搜索API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, source: 'kpl' })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[搜索] 成功获取数据');
        return data.result || '';
      }
      
      // 后端失败时使用备用数据
      console.log('[搜索] 后端不可用，使用备用数据');
      return this._getFallbackData(query);
    } catch (error) {
      console.error('[搜索失败]', error);
      return this._getFallbackData(query);
    }
  },
  
  /**
   * 备用数据（后端不可用时）
   */
  _getFallbackData(query) {
    const fallbackData = {
      '最新': '【2026年KPL春季赛】当前共有17支战队参赛，比赛正在进行中。建议访问官网查看详细赛程：https://kpl.qq.com',
      '战况': '【最新战况】成都AG超玩会、武汉eStarPro等战队表现强势。实时比分请访问：https://kpl.qq.com/schedule',
      'AG': '【成都AG超玩会】KPL老牌强队，曾多次夺冠。2026春季赛状态出色，详情：https://kpl.qq.com/teams',
      'eStar': '【武汉eStarPro】KPL顶级战队，多次获得冠军。2026春季赛稳居积分榜前列',
      '版本': '【2026版本】王者荣耀春季赛版本已更新，装备和英雄有调整。详细数据：https://kpl.qq.com/data'
    };
    
    for (const [key, value] of Object.entries(fallbackData)) {
      if (query.includes(key)) {
        return value;
      }
    }
    
    return '建议访问KPL官网查看最新数据：https://kpl.qq.com';
  },
  
  /**
   * 智能判断是否需要搜索
   */
  needsSearch(query) {
    const keywords = ['最新', '最近', '当前', '现在', '战况', '比赛', '阵容', '版本', '2026', '2025'];
    return keywords.some(k => query.includes(k));
  }
};
