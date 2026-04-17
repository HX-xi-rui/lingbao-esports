const Players = {
  // KPL选手数据 - 使用真实选手照片
  list: [
    // ===== 成都AG超玩会 =====
    {
      id: '一诺',
      name: '一诺',
      realName: '徐必成',
      team: '成都AG超玩会',
      position: '发育路',
      titles: 1,
      seasons: '2018-至今',
      status: 'active',
      image: '成都AG超玩会/一诺徐必成.png',
      highlights: ['AG超玩会核心', '2024夏季赛总冠军', '新生代射手标杆'],
      stats: { mvp: 14, finals: 3 }
    },
    {
      id: '钟意',
      name: '钟意',
      realName: '陈家豪',
      team: '成都AG超玩会',
      position: '打野',
      titles: 1,
      seasons: '2023-至今',
      status: 'active',
      image: '成都AG超玩会/钟意陈家豪.png',
      highlights: ['AG打野核心', '2024冠军功臣', '新生代打野'],
      stats: { mvp: 6, finals: 2 }
    },
    {
      id: '长生',
      name: '长生',
      realName: '谢承峻',
      team: '成都AG超玩会',
      position: '中路',
      titles: 1,
      seasons: '2023-至今',
      status: 'active',
      image: '成都AG超玩会/长生谢承峻.png',
      highlights: ['AG中路核心', '工具人法师代表', '稳健型选手'],
      stats: { mvp: 7, finals: 3 }
    },
    {
      id: '轩染',
      name: '轩染',
      realName: '刘明',
      team: '成都AG超玩会',
      position: '对抗路',
      titles: 1,
      seasons: '2023-至今',
      status: 'active',
      image: '成都AG超玩会/轩染刘明.png',
      highlights: ['AG边路核心', '坦边代表', '冠军功臣'],
      stats: { mvp: 5, finals: 3 }
    },
    {
      id: '大帅',
      name: '大帅',
      realName: '孟家俊',
      team: '成都AG超玩会',
      position: '辅助',
      titles: 1,
      seasons: '2024-至今',
      status: 'active',
      image: '成都AG超玩会/大帅孟家俊.png',
      highlights: ['AG辅助核心', '视野控制大师', '团战指挥大脑'],
      stats: { mvp: 5, finals: 2 }
    },
    {
      id: '北诗',
      name: '北诗',
      realName: '郑国浩',
      team: '成都AG超玩会',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '成都AG超玩会/北诗郑国浩.png',
      highlights: ['AG替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '救赎',
      name: '救赎',
      realName: '张佳豪',
      team: '成都AG超玩会',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '成都AG超玩会/救赎张佳豪.png',
      highlights: ['AG替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '烈峰峰',
      name: '烈峰峰',
      realName: '张玉峰',
      team: '成都AG超玩会',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '成都AG超玩会/烈峰峰张玉峰.png',
      highlights: ['AG替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '染详',
      name: '染详',
      realName: '管泓宇',
      team: '成都AG超玩会',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '成都AG超玩会/染详管泓宇.png',
      highlights: ['AG替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小凡',
      name: '小凡',
      realName: '陈一帆',
      team: '成都AG超玩会',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '成都AG超玩会/小凡陈一帆.png',
      highlights: ['AG替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小俞',
      name: '小俞',
      realName: '周宇',
      team: '成都AG超玩会',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '成都AG超玩会/小俞周宇.png',
      highlights: ['AG替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 北京JDG =====
    {
      id: '无畏',
      name: '无畏',
      realName: '杨涛',
      team: '北京JDG',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京JDG/无畏杨涛.png',
      highlights: ['JDG打野核心', '操作型选手', '节奏型打野'],
      stats: { mvp: 7, finals: 2 }
    },
    {
      id: '清融',
      name: '清融',
      realName: '黄垚钦',
      team: '北京JDG',
      position: '中路',
      titles: 6,
      seasons: '2019-至今',
      status: 'active',
      image: '北京JDG/清融黄垚钦.png',
      highlights: ['KPL最强中路之一', '六届总冠军', '诸葛亮使用者标杆'],
      stats: { mvp: 18, finals: 8 }
    },
    {
      id: '小玖',
      name: '小玖',
      realName: '刘行',
      team: '北京JDG',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '北京JDG/小玖刘行.png',
      highlights: ['JDG射手核心', '稳定输出', '新生代代表'],
      stats: { mvp: 5, finals: 1 }
    },
    {
      id: '小A',
      name: '小A',
      realName: '杨荣鑫',
      team: '北京JDG',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '北京JDG/小A杨荣鑫.png',
      highlights: ['JDG辅助核心', '团战指挥大脑', '视野控制'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '小寒',
      name: '小寒',
      realName: '金书瀚',
      team: '北京JDG',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京JDG/小寒金书瀚.png',
      highlights: ['JDG打野', '新生代打野代表', '潜力选手'],
      stats: { mvp: 3, finals: 0 }
    },
    {
      id: '轻语',
      name: '轻语',
      realName: '谢欣臻',
      team: '北京JDG',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京JDG/轻语谢欣臻.png',
      highlights: ['JDG边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 5, finals: 1 }
    },
    {
      id: '绝意',
      name: '绝意',
      realName: '廖友侠',
      team: '北京JDG',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京JDG/绝意廖友侠.png',
      highlights: ['JDG替补射手', '稳定输出', '新生代代表'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '零栩',
      name: '零栩',
      realName: '喻创鑫',
      team: '北京JDG',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京JDG/零栩喻创鑫.png',
      highlights: ['JDG替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '奶龙',
      name: '奶龙',
      realName: '郑毅恒',
      team: '北京JDG',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京JDG/奶龙郑毅恒.png',
      highlights: ['JDG替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '无双',
      name: '无双',
      realName: '胡家荣',
      team: '北京JDG',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京JDG/无双胡家荣.png',
      highlights: ['JDG替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 北京WB =====
    {
      id: '暖阳',
      name: '暖阳',
      realName: '林恒',
      team: '北京WB',
      position: '打野',
      titles: 1,
      seasons: '2018-至今',
      status: 'active',
      image: '北京WB/暖阳林恒.png',
      highlights: ['2020世冠FMVP', 'WB打野核心', '打野位常青树'],
      stats: { mvp: 10, finals: 3 }
    },
    {
      id: '梓墨',
      name: '梓墨',
      realName: '吴喆杰',
      team: '北京WB',
      position: '对抗路',
      titles: 0,
      seasons: '2021-至今',
      status: 'active',
      image: '北京WB/梓墨吴喆杰.png',
      highlights: ['新生代对抗路代表', 'WB边路核心', '操作型选手'],
      stats: { mvp: 5, finals: 2 }
    },
    {
      id: '乔兮',
      name: '乔兮',
      realName: '曾庆龙',
      team: '北京WB',
      position: '发育路',
      titles: 0,
      seasons: '2022-至今',
      status: 'active',
      image: '北京WB/乔兮曾庆龙.png',
      highlights: ['WB射手核心', '稳定输出', '新生代代表'],
      stats: { mvp: 4, finals: 2 }
    },
    {
      id: '丞丞',
      name: '丞丞',
      realName: '陆俊丞',
      team: '北京WB',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '北京WB/丞丞陆俊丞.png',
      highlights: ['WB辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '果冻',
      name: '果冻',
      realName: '倪钰城',
      team: '北京WB',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京WB/果冻倪钰城.png',
      highlights: ['WB中单', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '玖欣',
      name: '玖欣',
      realName: '邹伟鑫',
      team: '北京WB',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京WB/玖欣邹伟鑫.png',
      highlights: ['WB替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '听悦',
      name: '听悦',
      realName: '吴佐',
      team: '北京WB',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京WB/听悦吴佐.png',
      highlights: ['WB替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小麦',
      name: '小麦',
      realName: '彭超平',
      team: '北京WB',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京WB/小麦彭超平.png',
      highlights: ['WB替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '雨寂',
      name: '雨寂',
      realName: '张帆远航',
      team: '北京WB',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '北京WB/雨寂张帆远航.png',
      highlights: ['WB替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 武汉eStarPro =====
    {
      id: 'Fly',
      name: 'Fly',
      realName: '彭云飞',
      team: '武汉eStarPro',
      position: '对抗路',
      titles: 6,
      seasons: '2017-至今',
      status: 'active',
      image: '武汉eStarPro/Fly彭云飞.png',
      highlights: ['花木兰FMVP皮肤拥有者', 'KPL历史第一人', '六届总冠军'],
      stats: { mvp: 12, finals: 8 }
    },
    {
      id: 'Ming',
      name: 'Ming',
      realName: '池晓铭',
      team: '武汉eStarPro',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '武汉eStarPro/Ming池晓铭.png',
      highlights: ['eStar射手', '稳定输出', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '紫渊',
      name: '紫渊',
      realName: '侯维国',
      team: '武汉eStarPro',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '武汉eStarPro/紫渊侯维国.png',
      highlights: ['eStar辅助核心', '视野控制大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '誓约',
      name: '誓约',
      realName: '姚嘉鹏',
      team: '武汉eStarPro',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '武汉eStarPro/誓约姚嘉鹏.png',
      highlights: ['eStar边路', '操作型选手', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '亮宇',
      name: '亮宇',
      realName: '陈亮宇',
      team: '武汉eStarPro',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '武汉eStarPro/亮宇陈亮宇.png',
      highlights: ['eStar中单', '工具人法师', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '昊昊',
      name: '昊昊',
      realName: '黄政昊',
      team: '武汉eStarPro',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '武汉eStarPro/昊昊黄政昊.png',
      highlights: ['eStar打野', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '浅风',
      name: '浅风',
      realName: '胡宸语',
      team: '武汉eStarPro',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '武汉eStarPro/浅风胡宸语.png',
      highlights: ['eStar替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小楼',
      name: '小楼',
      realName: '沈宇轩',
      team: '武汉eStarPro',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '武汉eStarPro/小楼沈宇轩.png',
      highlights: ['eStar替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '余忆',
      name: '余忆',
      realName: '陈文塔',
      team: '武汉eStarPro',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '武汉eStarPro/余忆陈文塔.png',
      highlights: ['eStar替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 重庆狼队 =====
    {
      id: '小胖',
      name: '小胖',
      realName: '李达亨',
      team: '重庆狼队',
      position: '打野',
      titles: 2,
      seasons: '2021-至今',
      status: 'active',
      image: '重庆狼队/小胖李达亨.png',
      highlights: ['狼队打野核心', 'FMVP获得者', 'KPL顶级打野'],
      stats: { mvp: 10, finals: 5 }
    },
    {
      id: '归期',
      name: '归期',
      realName: '双小钧',
      team: '重庆狼队',
      position: '对抗路',
      titles: 1,
      seasons: '2022-至今',
      status: 'active',
      image: '重庆狼队/归期双小钧.png',
      highlights: ['狼队边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 6, finals: 3 }
    },
    {
      id: '紫幻',
      name: '紫幻',
      realName: '黄广顺',
      team: '重庆狼队',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '重庆狼队/紫幻黄广顺.png',
      highlights: ['狼队中单', '操作型中单', '新生代代表'],
      stats: { mvp: 5, finals: 2 }
    },
    {
      id: '道崽',
      name: '道崽',
      realName: '杨凯博',
      team: '重庆狼队',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '重庆狼队/道崽杨凯博.png',
      highlights: ['狼队射手', '稳定输出', '新生代代表'],
      stats: { mvp: 4, finals: 2 }
    },
    {
      id: '小叶叶',
      name: '小叶叶',
      realName: '叶锦锋',
      team: '重庆狼队',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '重庆狼队/小叶叶锦锋.png',
      highlights: ['狼队辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 2 }
    },
    {
      id: '清清',
      name: '清清',
      realName: '吴金翔',
      team: '重庆狼队',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '重庆狼队/清清吴金翔.png',
      highlights: ['狼队边路', '操作型边路', '明星选手'],
      stats: { mvp: 8, finals: 3 }
    },
    {
      id: '晚星',
      name: '晚星',
      realName: '王恒鸿',
      team: '重庆狼队',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '重庆狼队/晚星王恒鸿.png',
      highlights: ['狼队替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '皖皖',
      name: '皖皖',
      realName: '杜远航',
      team: '重庆狼队',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '重庆狼队/皖皖杜远航.png',
      highlights: ['狼队替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '信苟',
      name: '信苟',
      realName: '苟宏鑫',
      team: '重庆狼队',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '重庆狼队/信苟宏鑫.png',
      highlights: ['狼队替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 苏州KSG =====
    {
      id: '风箫',
      name: '风箫',
      realName: '于翔任',
      team: '苏州KSG',
      position: '发育路',
      titles: 0,
      seasons: '2022-至今',
      status: 'active',
      image: 'KSG/风箫于翔任.png',
      highlights: ['KSG射手核心', '稳定输出', '新生代代表'],
      stats: { mvp: 5, finals: 2 }
    },
    {
      id: '句号',
      name: '句号',
      realName: '何伟嘉',
      team: '苏州KSG',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: 'KSG/句号何伟嘉.png',
      highlights: ['KSG打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '流浪',
      name: '流浪',
      realName: '张恒',
      team: '苏州KSG',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: 'KSG/流浪张恒.png',
      highlights: ['KSG中路核心', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '一笙',
      name: '一笙',
      realName: '李自威',
      team: '苏州KSG',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: 'KSG/一笙李自威.png',
      highlights: ['KSG辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '子阳',
      name: '子阳',
      realName: '向阳',
      team: '苏州KSG',
      position: '辅助',
      titles: 4,
      seasons: '2024-至今',
      status: 'active',
      image: 'KSG/子阳向阳.png',
      highlights: ['eStar王朝辅助', '视野控制大师', '团战指挥'],
      stats: { mvp: 6, finals: 5 }
    },
    {
      id: '无言',
      name: '无言',
      realName: '赵昊宇',
      team: '苏州KSG',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: 'KSG/无言赵昊宇.png',
      highlights: ['KSG边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '流星',
      name: '流星',
      realName: '李星',
      team: '苏州KSG',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: 'KSG/流星李星.png',
      highlights: ['KSG替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '小屿',
      name: '小屿',
      realName: '王思琪',
      team: '苏州KSG',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: 'KSG/小屿王思琪.png',
      highlights: ['KSG替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 南通Hero久竞 =====
    {
      id: '坦然',
      name: '坦然',
      realName: '孙麟威',
      team: '南通Hero久竞',
      position: '对抗路',
      titles: 4,
      seasons: '2021-至今',
      status: 'active',
      image: '南通Hero久竞/坦然孙麟威.png',
      highlights: ['新生代对抗路标杆', '2022-2023两连FMVP', 'eStar新一代核心'],
      stats: { mvp: 8, finals: 5 }
    },
    {
      id: '妖刀',
      name: '妖刀',
      realName: '钟乐天',
      team: '南通Hero久竞',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '南通Hero久竞/妖刀钟乐天.png',
      highlights: ['Hero打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 5, finals: 2 }
    },
    {
      id: 'Silver',
      name: 'Silver',
      realName: '黄本帅',
      team: '南通Hero久竞',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '南通Hero久竞/Silver黄本帅.png',
      highlights: ['Hero中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '玖熙',
      name: '玖熙',
      realName: '敖语思涵',
      team: '南通Hero久竞',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '南通Hero久竞/玖熙敖语思涵.png',
      highlights: ['Hero射手', '稳定输出', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '绝心',
      name: '绝心',
      realName: '刘泽杉',
      team: '南通Hero久竞',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '南通Hero久竞/绝心刘泽杉.png',
      highlights: ['Hero辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '白清',
      name: '白清',
      realName: '吴轲蔚',
      team: '南通Hero久竞',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '南通Hero久竞/白清吴轲蔚.png',
      highlights: ['Hero替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '多多',
      name: '多多',
      realName: '易嘉磊',
      team: '南通Hero久竞',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '南通Hero久竞/多多易嘉磊.png',
      highlights: ['Hero替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '落尘',
      name: '落尘',
      realName: '张世杰',
      team: '南通Hero久竞',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '南通Hero久竞/落尘张世杰.png',
      highlights: ['Hero替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 佛山DRG =====
    {
      id: '旭旭',
      name: '旭旭',
      realName: '陶晨旭',
      team: '佛山DRG',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '佛山DRG/旭旭陶晨旭.png',
      highlights: ['DRG边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '柚子',
      name: '柚子',
      realName: '袁树鑫',
      team: '佛山DRG',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '佛山DRG/柚子袁树鑫.png',
      highlights: ['DRG打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '花缘',
      name: '花缘',
      realName: '谭锦威',
      team: '佛山DRG',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '佛山DRG/花缘谭锦威.png',
      highlights: ['DRG中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '梦岚',
      name: '梦岚',
      realName: '彭俊岚',
      team: '佛山DRG',
      position: '发育路',
      titles: 0,
      seasons: '2019-至今',
      status: 'active',
      image: '佛山DRG/梦岚彭俊岚.png',
      highlights: ['DRG射手核心', '稳定输出', '新生代代表'],
      stats: { mvp: 5, finals: 2 }
    },
    {
      id: '呆呆',
      name: '呆呆',
      realName: '赖永睿',
      team: '佛山DRG',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '佛山DRG/呆呆赖永睿.png',
      highlights: ['DRG辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '小小阳',
      name: '小小阳',
      realName: '应恒阳',
      team: '佛山DRG',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '佛山DRG/小小阳应恒阳.png',
      highlights: ['DRG替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '源',
      name: '源',
      realName: '李盛源',
      team: '佛山DRG',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '佛山DRG/源李盛源.png',
      highlights: ['DRG替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 广州TTG =====
    {
      id: '萝卜',
      name: '萝卜',
      realName: '陈佳鸿',
      team: '广州TTG',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '广州TTG/萝卜陈佳鸿.png',
      highlights: ['TTG边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '鹤辞',
      name: '鹤辞',
      realName: '江利杰',
      team: '广州TTG',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '广州TTG/鹤辞江利杰.png',
      highlights: ['TTG打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '佳心',
      name: '佳心',
      realName: '李佳旭',
      team: '广州TTG',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '广州TTG/佳心李佳旭.png',
      highlights: ['TTG中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '小雪',
      name: '小雪',
      realName: '岳彩营',
      team: '广州TTG',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '广州TTG/小雪岳彩营.png',
      highlights: ['TTG射手', '稳定输出', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '阿豆',
      name: '阿豆',
      realName: '蒋涛',
      team: '广州TTG',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '广州TTG/阿豆蒋涛.png',
      highlights: ['TTG辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '涵',
      name: '涵',
      realName: '黄涵熙',
      team: '广州TTG',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '广州TTG/涵黄涵熙.png',
      highlights: ['TTG替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '嘉宝',
      name: '嘉宝',
      realName: '康祺',
      team: '广州TTG',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '广州TTG/嘉宝康祺.png',
      highlights: ['TTG替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 杭州LGD.NBW =====
    {
      id: '花花',
      name: '花花',
      realName: '丁璟灏',
      team: '杭州LGD.NBW',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '杭州LGD.NBW/花花丁璟灏.png',
      highlights: ['LGD边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '小崽',
      name: '小崽',
      realName: '夏肇汛',
      team: '杭州LGD.NBW',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '杭州LGD.NBW/小崽夏肇汛.png',
      highlights: ['LGD打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '九尾',
      name: '九尾',
      realName: '许鑫蓁',
      team: '杭州LGD.NBW',
      position: '中路',
      titles: 0,
      seasons: '2019-至今',
      status: 'active',
      image: '杭州LGD.NBW/九尾许鑫蓁.png',
      highlights: ['LGD中路核心', '操作型中单', '明星选手'],
      stats: { mvp: 9, finals: 3 }
    },
    {
      id: '小久',
      name: '小久',
      realName: '阳文明',
      team: '杭州LGD.NBW',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '杭州LGD.NBW/小久阳文明.png',
      highlights: ['LGD射手', '稳定输出', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '冰尘',
      name: '冰尘',
      realName: '李小龙',
      team: '杭州LGD.NBW',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '杭州LGD.NBW/冰尘李小龙.png',
      highlights: ['LGD辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '米苏',
      name: '米苏',
      realName: '姜腾瑞',
      team: '杭州LGD.NBW',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '杭州LGD.NBW/米苏姜腾瑞.png',
      highlights: ['LGD替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '小涵',
      name: '小涵',
      realName: '钟志涵',
      team: '杭州LGD.NBW',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '杭州LGD.NBW/小涵钟志涵.png',
      highlights: ['LGD替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小落',
      name: '小落',
      realName: '王科',
      team: '杭州LGD.NBW',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '杭州LGD.NBW/小落王科.png',
      highlights: ['LGD替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小名',
      name: '小名',
      realName: '李书名',
      team: '杭州LGD.NBW',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '杭州LGD.NBW/小名李书名.png',
      highlights: ['LGD替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 深圳DYG =====
    {
      id: '凌瑞',
      name: '凌瑞',
      realName: '王厚豪',
      team: '深圳DYG',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '深圳DYG/凌瑞王厚豪.png',
      highlights: ['DYG边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '小乐',
      name: '小乐',
      realName: '黄家乐',
      team: '深圳DYG',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '深圳DYG/小乐黄家乐.png',
      highlights: ['DYG打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '向鱼',
      name: '向鱼',
      realName: '蔡佑其',
      team: '深圳DYG',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '深圳DYG/向鱼蔡佑其.png',
      highlights: ['DYG中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '钎城',
      name: '钎城',
      realName: '周诣涛',
      team: '深圳DYG',
      position: '发育路',
      titles: 0,
      seasons: '2020-至今',
      status: 'active',
      image: '深圳DYG/钎城周诣涛.png',
      highlights: ['DYG射手核心', '稳定输出点', '新生代代表'],
      stats: { mvp: 6, finals: 2 }
    },
    {
      id: '星潼',
      name: '星潼',
      realName: '吴金辉',
      team: '深圳DYG',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '深圳DYG/星潼吴金辉.png',
      highlights: ['DYG辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '栋栋',
      name: '栋栋',
      realName: '王栋',
      team: '深圳DYG',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '深圳DYG/栋栋王栋.png',
      highlights: ['DYG替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '落空',
      name: '落空',
      realName: '周熙瑞',
      team: '深圳DYG',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '深圳DYG/落空周熙瑞.png',
      highlights: ['DYG替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '秋源',
      name: '秋源',
      realName: '吴星源',
      team: '深圳DYG',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '深圳DYG/秋源吴星源.png',
      highlights: ['DYG替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小轩',
      name: '小轩',
      realName: '王胜',
      team: '深圳DYG',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '深圳DYG/小轩王胜.png',
      highlights: ['DYG替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '叶凡',
      name: '叶凡',
      realName: '刘译凡',
      team: '深圳DYG',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '深圳DYG/叶凡刘译凡.png',
      highlights: ['DYG替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 济南RW侠 =====
    {
      id: '小度',
      name: '小度',
      realName: '古伟雄',
      team: '济南RW侠',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '济南RW侠/小度古伟雄.png',
      highlights: ['RW侠边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '今屿',
      name: '今屿',
      realName: '徐翔宇',
      team: '济南RW侠',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '济南RW侠/今屿徐翔宇.png',
      highlights: ['RW侠打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '梦溪',
      name: '梦溪',
      realName: '李文宝',
      team: '济南RW侠',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '济南RW侠/梦溪李文宝.png',
      highlights: ['RW侠中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '佩恩',
      name: '佩恩',
      realName: '文帅',
      team: '济南RW侠',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '济南RW侠/佩恩文帅.png',
      highlights: ['RW侠射手', '稳定输出', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '苏瞳',
      name: '苏瞳',
      realName: '孟凡苏',
      team: '济南RW侠',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '济南RW侠/苏瞳孟凡苏.png',
      highlights: ['RW侠辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '初晨',
      name: '初晨',
      realName: '陶传凯',
      team: '济南RW侠',
      position: '打野',
      titles: 0,
      seasons: '2017-至今',
      status: 'active',
      image: '济南RW侠/初晨陶传凯.png',
      highlights: ['RW侠打野', '野区统治者', '老将代表'],
      stats: { mvp: 8, finals: 1 }
    },
    {
      id: '挽墨',
      name: '挽墨',
      realName: '骆雪岩',
      team: '济南RW侠',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '济南RW侠/挽墨骆雪岩.png',
      highlights: ['RW侠替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '小团',
      name: '小团',
      realName: '刘孝睿',
      team: '济南RW侠',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '济南RW侠/小团刘孝睿.png',
      highlights: ['RW侠替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 长沙TES.A =====
    {
      id: '无幻',
      name: '无幻',
      realName: '朱俊',
      team: '长沙TES.A',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '长沙TES.A/无幻朱俊.png',
      highlights: ['TES边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '帆帆',
      name: '帆帆',
      realName: '杨帆',
      team: '长沙TES.A',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '长沙TES.A/帆帆杨帆.png',
      highlights: ['TES打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '书源',
      name: '书源',
      realName: '寇书源',
      team: '长沙TES.A',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '长沙TES.A/书源寇书源.png',
      highlights: ['TES中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '景诗',
      name: '景诗',
      realName: '李知杰',
      team: '长沙TES.A',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '长沙TES.A/景诗李知杰.png',
      highlights: ['TES射手', '稳定输出', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '安七',
      name: '安七',
      realName: '戴子强',
      team: '长沙TES.A',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '长沙TES.A/安七戴子强.png',
      highlights: ['TES辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '蓝桉',
      name: '蓝桉',
      realName: '李涿阳',
      team: '长沙TES.A',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '长沙TES.A/蓝桉李涿阳.png',
      highlights: ['TES替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '小小飞',
      name: '小小飞',
      realName: '张宇飞',
      team: '长沙TES.A',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '长沙TES.A/小小飞张宇飞.png',
      highlights: ['TES替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '星河',
      name: '星河',
      realName: '陈森锐',
      team: '长沙TES.A',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '长沙TES.A/星河陈森锐.png',
      highlights: ['TES替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 上海EDG.M =====
    {
      id: '凌云',
      name: '凌云',
      realName: '陈泓铭',
      team: '上海EDG.M',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海EDG.M/凌云陈泓铭.png',
      highlights: ['EDG.M边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '小泽',
      name: '小泽',
      realName: '沈宇泽',
      team: '上海EDG.M',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海EDG.M/小泽沈宇泽.png',
      highlights: ['EDG.M打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '一曲',
      name: '一曲',
      realName: '周锋',
      team: '上海EDG.M',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海EDG.M/一曲周锋.png',
      highlights: ['EDG.M中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '花卷',
      name: '花卷',
      realName: '吴育涛',
      team: '上海EDG.M',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海EDG.M/花卷吴育涛.png',
      highlights: ['EDG.M射手', '稳定输出', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '百炼',
      name: '百炼',
      realName: '杨仕晨',
      team: '上海EDG.M',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海EDG.M/百炼杨仕晨.png',
      highlights: ['EDG.M辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '鸣鸣',
      name: '鸣鸣',
      realName: '张恒鸣',
      team: '上海EDG.M',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海EDG.M/鸣鸣张恒鸣.png',
      highlights: ['EDG.M替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '涛',
      name: '涛',
      realName: '应泽涛',
      team: '上海EDG.M',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海EDG.M/涛应泽涛.png',
      highlights: ['EDG.M替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '夏凌',
      name: '夏凌',
      realName: '张蜀徽',
      team: '上海EDG.M',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海EDG.M/夏凌张蜀徽.png',
      highlights: ['EDG.M替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小碎',
      name: '小碎',
      realName: '李文浩',
      team: '上海EDG.M',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海EDG.M/小碎李文浩.png',
      highlights: ['EDG.M替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '月秋',
      name: '月秋',
      realName: '赵浩伟',
      team: '上海EDG.M',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海EDG.M/月秋赵浩伟.png',
      highlights: ['EDG.M替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 上海RNG.M =====
    {
      id: '极光',
      name: '极光',
      realName: '周文强',
      team: '上海RNG.M',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海RNG.M/极光周文强.png',
      highlights: ['RNG.M边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '航航',
      name: '航航',
      realName: '谢模航',
      team: '上海RNG.M',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海RNG.M/航航谢模航.png',
      highlights: ['RNG.M打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '雨空',
      name: '雨空',
      realName: '杨文岳',
      team: '上海RNG.M',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海RNG.M/雨空杨文岳.png',
      highlights: ['RNG.M中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '久酷',
      name: '久酷',
      realName: '王滔',
      team: '上海RNG.M',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海RNG.M/久酷王滔.png',
      highlights: ['RNG.M射手', '稳定输出', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '小困',
      name: '小困',
      realName: '张翁豪',
      team: '上海RNG.M',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '上海RNG.M/小困张翁豪.png',
      highlights: ['RNG.M辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '赤辰',
      name: '赤辰',
      realName: '伯晨赫',
      team: '上海RNG.M',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海RNG.M/赤辰伯晨赫.png',
      highlights: ['RNG.M替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '润润',
      name: '润润',
      realName: '蒋润',
      team: '上海RNG.M',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海RNG.M/润润蒋润.png',
      highlights: ['RNG.M替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '小优',
      name: '小优',
      realName: '秦子恒',
      team: '上海RNG.M',
      position: '发育路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海RNG.M/小优秦子恒.png',
      highlights: ['RNG.M替补射手', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '奕雨',
      name: '奕雨',
      realName: '项奕源',
      team: '上海RNG.M',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海RNG.M/奕雨项奕源.png',
      highlights: ['RNG.M替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '樱花',
      name: '樱花',
      realName: '林子涵',
      team: '上海RNG.M',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '上海RNG.M/樱花林子涵.png',
      highlights: ['RNG.M替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 西安WE =====
    {
      id: '忆安',
      name: '忆安',
      realName: '杜国豪',
      team: '西安WE',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '西安WE/忆安杜国豪.png',
      highlights: ['WE边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '明崽',
      name: '明崽',
      realName: '戴家权',
      team: '西安WE',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '西安WE/明崽戴家权.png',
      highlights: ['WE打野核心', '节奏型打野', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '文涛',
      name: '文涛',
      realName: '朱文涛',
      team: '西安WE',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '西安WE/文涛朱文涛.png',
      highlights: ['WE中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '九幽',
      name: '九幽',
      realName: '李俊超',
      team: '西安WE',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '西安WE/九幽李俊超.png',
      highlights: ['WE射手', '稳定输出', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '墨衍',
      name: '墨衍',
      realName: '张衍佳',
      team: '西安WE',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '西安WE/墨衍张衍佳.png',
      highlights: ['WE辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '昭珏',
      name: '昭珏',
      realName: '屈万东',
      team: '西安WE',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '西安WE/昭珏屈万东.png',
      highlights: ['WE替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '子意',
      name: '子意',
      realName: '秦子意',
      team: '西安WE',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '西安WE/子意秦子意.png',
      highlights: ['WE替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 无锡TCG =====
    {
      id: '青槐',
      name: '青槐',
      realName: '赵君',
      team: '无锡TCG',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '无锡TCG/青槐赵君.png',
      highlights: ['TCG边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '光明',
      name: '光明',
      realName: '余睿桐',
      team: '无锡TCG',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '无锡TCG/光明余睿桐.png',
      highlights: ['TCG打野核心', '新生代打野', '潜力选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '清弦',
      name: '清弦',
      realName: '肖桂蕊',
      team: '无锡TCG',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '无锡TCG/清弦肖桂蕊.png',
      highlights: ['TCG中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '北觅',
      name: '北觅',
      realName: '吴鸿伟',
      team: '无锡TCG',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '无锡TCG/北觅吴鸿伟.png',
      highlights: ['TCG射手', '稳定输出', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '江雾',
      name: '江雾',
      realName: '刘舒菡',
      team: '无锡TCG',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '无锡TCG/江雾刘舒菡.png',
      highlights: ['TCG辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '安凉',
      name: '安凉',
      realName: '张雪龙',
      team: '无锡TCG',
      position: '对抗路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '无锡TCG/安凉张雪龙.png',
      highlights: ['TCG替补边路', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '大海',
      name: '大海',
      realName: '叶建炜',
      team: '无锡TCG',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '无锡TCG/大海叶建炜.png',
      highlights: ['TCG替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '数字',
      name: '数字',
      realName: '陆峰',
      team: '无锡TCG',
      position: '中路',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '无锡TCG/数字陆峰.png',
      highlights: ['TCG替补中单', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    {
      id: '熙河',
      name: '熙河',
      realName: '韩佳成',
      team: '无锡TCG',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '无锡TCG/熙河韩佳成.png',
      highlights: ['TCG替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    },
    // ===== 桐乡情久 =====
    {
      id: '久寒',
      name: '久寒',
      realName: '朱飞扬',
      team: '桐乡情久',
      position: '对抗路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '桐乡情久/久寒朱飞扬.png',
      highlights: ['情久边路核心', '新生代对抗路代表', '操作型选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '深巅',
      name: '深巅',
      realName: '张嘉俊',
      team: '桐乡情久',
      position: '打野',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '桐乡情久/深巅张嘉俊.png',
      highlights: ['情久打野核心', '新生代打野', '潜力选手'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '恒心',
      name: '恒心',
      realName: '汤书恒',
      team: '桐乡情久',
      position: '中路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '桐乡情久/恒心汤书恒.png',
      highlights: ['情久中单', '操作型中单', '新生代代表'],
      stats: { mvp: 4, finals: 1 }
    },
    {
      id: '白衣',
      name: '白衣',
      realName: '刘芳凯',
      team: '桐乡情久',
      position: '发育路',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '桐乡情久/白衣刘芳凯.png',
      highlights: ['情久射手', '稳定输出', '新生代代表'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '陌冷',
      name: '陌冷',
      realName: '徐舟',
      team: '桐乡情久',
      position: '辅助',
      titles: 0,
      seasons: '2023-至今',
      status: 'active',
      image: '桐乡情久/陌冷徐舟.png',
      highlights: ['情久辅助核心', '视野大师', '团战指挥'],
      stats: { mvp: 3, finals: 1 }
    },
    {
      id: '楠枫',
      name: '楠枫',
      realName: '李亮',
      team: '桐乡情久',
      position: '打野',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '桐乡情久/楠枫李亮.png',
      highlights: ['情久替补打野', '新生代选手', '潜力股'],
      stats: { mvp: 2, finals: 0 }
    },
    {
      id: '无玄',
      name: '无玄',
      realName: '陈志凯',
      team: '桐乡情久',
      position: '辅助',
      titles: 0,
      seasons: '2024-至今',
      status: 'active',
      image: '桐乡情久/无玄陈志凯.png',
      highlights: ['情久替补辅助', '新生代选手', '潜力股'],
      stats: { mvp: 1, finals: 0 }
    }
  ],

  // 获取选手
  getPlayer(id) {
    return this.list.find(p => p.id === id);
  },

  // 根据名字查找选手
  getPlayerByName(name) {
    return this.list.find(p => p.name === name || p.realName === name);
  },

  // 获取选手的所有羁绊关系
  getPlayerRelationships(playerId) {
    const rels = [];
    this.hotBonds.forEach(bond => {
      if (bond.player1Id === playerId || bond.player2Id === playerId) {
        const targetId = bond.player1Id === playerId ? bond.player2Id : bond.player1Id;
        const targetPlayer = this.getPlayer(targetId);
        if (targetPlayer) {
          rels.push({
            targetPlayer,
            type: bond.type,
            typeInfo: this.relationshipTypes[bond.type] || this.relationshipTypes.teammate,
            description: bond.description
          });
        }
      }
    });
    return rels;
  },

  // 获取现役选手列表
  getActivePlayers() {
    return this.list.filter(p => p.status === 'active');
  },

  // 获取传奇选手列表
  getLegendaryPlayers() {
    return this.list.filter(p => p.status === 'legendary');
  },

  // 羁绊类型定义
  relationshipTypes: {
    teammate: { label: '队友', icon: '🤝', color: '#10B981' },
    rival: { label: '宿敌', icon: '⚔️', color: '#EF4444' },
    mentor: { label: '传承', icon: '🔥', color: '#F59E0B' },
    partner: { label: '搭档', icon: '💫', color: '#8B5CF6' },
    champion: { label: '冠军', icon: '🏆', color: '#EAB308' },
    dynasty: { label: '王朝', icon: '👑', color: '#8B5CF6' }
  },

  // 热门羁绊组合 - 精选最火选手，包含队友/宿敌/传承三种关系
  hotBonds: [
    // ===== 王朝羁绊（队友） =====
    {
      player1Id: 'Fly',
      player2Id: '清融',
      type: 'dynasty',
      label: 'eStar王朝双核',
      description: '2021-2022年eStarPro王朝核心，共同缔造六冠传奇',
      strength: 5,
      years: '2021-2022'
    },
    {
      player1Id: 'Fly',
      player2Id: '坦然',
      type: 'dynasty',
      label: 'eStar冠军边野',
      description: 'eStarPro冠军时期的核心边野组合',
      strength: 5,
      years: '2021-2023'
    },
    {
      player1Id: '一诺',
      player2Id: '钟意',
      type: 'champion',
      label: 'AG复兴双核',
      description: '2024年AG超玩会夺冠核心组合',
      strength: 5,
      years: '2024'
    },
    {
      player1Id: '小胖',
      player2Id: '归期',
      type: 'champion',
      label: '狼队新王双核',
      description: '重庆狼队新生代冠军组合',
      strength: 5,
      years: '2022-至今'
    },
    {
      player1Id: '暖阳',
      player2Id: '梓墨',
      type: 'teammate',
      label: 'WB双子星',
      description: '北京WB的核心搭档，多年默契配合',
      strength: 5,
      years: '2021-至今'
    },
    {
      player1Id: '九尾',
      player2Id: '钎城',
      type: 'teammate',
      label: 'TTG双核',
      description: '广州TTG时期的默契搭档',
      strength: 4,
      years: '2020-2023'
    },
    {
      player1Id: '无畏',
      player2Id: '清融',
      type: 'teammate',
      label: 'JDG野中核心',
      description: 'JDG野区中路核心组合',
      strength: 5,
      years: '2024-至今'
    },
    // ===== 宿敌羁绊（对手） =====
    {
      player1Id: 'Fly',
      player2Id: '暖阳',
      type: 'rival',
      label: '边路巅峰对决',
      description: 'KPL两大顶级边路的宿敌对决，多次总决赛交锋',
      strength: 5,
      years: '2018-至今'
    },
    {
      player1Id: '小胖',
      player2Id: '无畏',
      type: 'rival',
      label: '野王之争',
      description: '新生代打野王者的巅峰对决',
      strength: 5,
      years: '2022-至今'
    },
    {
      player1Id: '清融',
      player2Id: '九尾',
      type: 'rival',
      label: '中路法王之争',
      description: 'KPL两大顶级中单的宿敌较量',
      strength: 5,
      years: '2020-至今'
    },
    {
      player1Id: '一诺',
      player2Id: '梓墨',
      type: 'rival',
      label: '边射巅峰战',
      description: '顶级边路与射手的关键对决',
      strength: 4,
      years: '2021-至今'
    },
    {
      player1Id: '归期',
      player2Id: '坦然',
      type: 'rival',
      label: '新生代边路之争',
      description: '两大新生代对抗路的巅峰较量',
      strength: 5,
      years: '2022-至今'
    },
    {
      player1Id: '暖阳',
      player2Id: '小胖',
      type: 'rival',
      label: '打野王座之争',
      description: 'KPL打野位的巅峰竞争',
      strength: 5,
      years: '2021-至今'
    },
    {
      player1Id: '钟意',
      player2Id: '小胖',
      type: 'rival',
      label: '新生代野王对决',
      description: 'AG与狼队打野核心的直接对话',
      strength: 4,
      years: '2024'
    },
    // ===== 传承羁绊（师徒/接替） =====
    {
      player1Id: 'Fly',
      player2Id: '归期',
      type: 'mentor',
      label: '边路传承',
      description: 'Fly的边路精神传承给新生代归期',
      strength: 4,
      years: '2022-至今'
    },
    {
      player1Id: '子阳',
      player2Id: '一笙',
      type: 'mentor',
      label: '辅助传承',
      description: '冠军辅助子阳的经验传承',
      strength: 4,
      years: '2023-至今'
    },
    {
      player1Id: '暖阳',
      player2Id: '小胖',
      type: 'mentor',
      label: '打野传承',
      description: '老牌野王暖阳对新生代打野的影响',
      strength: 4,
      years: '2021-至今'
    },
    {
      player1Id: '一诺',
      player2Id: 'Fly',
      type: 'mentor',
      label: 'FMVP传承',
      description: '两大FMVP选手的相互尊重与传承',
      strength: 3,
      years: '2018-至今'
    }
  ],

  // 获取羁绊网络图数据
  getGraphData() {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();
    
    // 关系类型对应的颜色
    const typeColors = {
      teammate: '#10B981',
      rival: '#EF4444',
      mentor: '#F59E0B',
      partner: '#8B5CF6',
      champion: '#EAB308',
      dynasty: '#8B5CF6'
    };

    // 遍历所有羁绊，提取节点和连线
    this.hotBonds.forEach(bond => {
      const p1 = this.getPlayer(bond.player1Id);
      const p2 = this.getPlayer(bond.player2Id);
      
      if (!p1 || !p2) return;

      // 添加节点（去重）
      if (!nodeMap.has(p1.id)) {
        nodeMap.set(p1.id, true);
        nodes.push({
          id: p1.id,
          name: p1.name,
          status: p1.status,
          titles: p1.titles,
          team: p1.team,
          position: p1.position,
          symbolSize: 30
        });
      }
      if (!nodeMap.has(p2.id)) {
        nodeMap.set(p2.id, true);
        nodes.push({
          id: p2.id,
          name: p2.name,
          status: p2.status,
          titles: p2.titles,
          team: p2.team,
          position: p2.position,
          symbolSize: 30
        });
      }

      // 添加连线
      links.push({
        source: p1.id,
        target: p2.id,
        type: bond.type,
        label: bond.label,
        description: bond.description,
        strength: bond.strength,
        lineStyle: {
          color: typeColors[bond.type] || '#6366F1',
          width: bond.strength || 2
        }
      });
    });

    return { nodes, links };
  },

  /**
   * 从用户消息中检测提到的选手
   * @param {string} message - 用户消息
   * @returns {string[]} 匹配到的选手ID列表
   */
  detectPlayerInMessage(message) {
    if (!message || typeof message !== 'string') return [];
    
    const detected = [];
    const lowerMsg = message.toLowerCase();
    
    // 遍历所有选手，检查是否在消息中被提及
    this.list.forEach(player => {
      // 检查游戏ID（如 "一诺"、"Fly"）
      if (lowerMsg.includes(player.name.toLowerCase())) {
        if (!detected.includes(player.id)) {
          detected.push(player.id);
        }
      }
      // 检查真名（如 "徐必成"、"彭云飞"）
      if (player.realName && lowerMsg.includes(player.realName.toLowerCase())) {
        if (!detected.includes(player.id)) {
          detected.push(player.id);
        }
      }
    });
    
    return detected;
  },

  /**
   * 获取选手的上下文信息（用于AI对话）
   * @param {string} playerId - 选手ID
   * @returns {string|null} 选手信息文本
   */
  getPlayerContext(playerId) {
    const player = this.getPlayer(playerId);
    if (!player) return null;
    
    let context = `【${player.name}】`;
    context += `真名：${player.realName}，`;
    context += `战队：${player.team}，`;
    context += `位置：${player.position}，`;
    context += `冠军数：${player.titles}个，`;
    context += `赛季：${player.seasons}，`;
    if (player.highlights && player.highlights.length > 0) {
      context += `成就：${player.highlights.join('、')}`;
    }
    
    return context;
  }
};
