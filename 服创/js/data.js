/**
 * 灵宝百事通 - 数据模块
 * 模拟数据与静态内容
 */

// ===== 城市图片源：本地真实地标摄影图（Pexels高清免费图片） =====
// 图片已下载到 images/tourism/photo/ 目录，真实城市地标照片
var CITY_PHOTO_MAP = {
  '成都': './images/tourism/photo/成都.jpg',   // 成都安顺廊桥夜景
  '上海': './images/tourism/photo/上海.jpg',   // 上海陆家嘴天际线/东方明珠
  '武汉': './images/tourism/photo/武汉.jpg',   // 武汉黄鹤楼
  '重庆': './images/tourism/photo/重庆.jpg',   // 重庆洪崖洞夜景
  '北京': './images/tourism/photo/北京.jpg',   // 北京故宫
  '广州': './images/tourism/photo/广州.jpg',   // 广州塔（小蛮腰）
  '苏州': './images/tourism/photo/苏州.jpg',   // 苏州园林
  '南京': './images/tourism/photo/南京.jpg',   // 南京玄武湖天际线
  '杭州': './images/tourism/photo/杭州.jpg',   // 杭州西湖雷峰塔
  '长沙': './images/tourism/photo/长沙.jpg',   // 长沙航拍城市天际线
  '佛山': './images/tourism/photo/佛山.jpg',   // 佛山祖庙
  '济南': './images/tourism/photo/济南.jpg'    // 济南传统亭台湖景
};
// ===== 城市图片 fallback：内联 SVG 数据URI（100%可靠，无需本地文件） =====
// 当 Unsplash 图片加载失败时自动使用此 fallback
// 每张 SVG 含城市名称、战队信息、渐变背景和装饰元素
var CITY_SVG_MAP = {};  // 不再使用外部SVG文件，改用 _getCityFallbackSvg() 动态生成

// 城市配色方案（用于生成 fallback SVG）
var CITY_COLOR_SCHEME = {
  '成都': { bg1: '#1a0a2e', bg2: '#3d1565', accent: '#ff6b35', team: 'AG超玩会' },
  '上海': { bg1: '#0a1628', bg2: '#1a3a5c', accent: '#64b5f6', team: 'EDG.M/RNG.M' },
  '武汉': { bg1: '#1a1408', bg2: '#4a3020', accent: '#ffa726', team: 'eStarPro' },
  '重庆': { bg1: '#0f0820', bg2: '#2d1850', accent: '#ab47bc', team: '狼队' },
  '北京': { bg1: '#1a1208', bg2: '#3d2815', accent: '#ef6c00', team: 'WB/JDG' },
  '广州': { bg1: '#051525', bg2: '#0d3a50', accent: '#26c6da', team: 'TTG' },
  '苏州': { bg1: '#152015', bg2: '#2d4030', accent: '#66bb6a', team: 'KSG' },
  '南京': { bg1: '#101520', bg2: '#253550', accent: '#42a5f5', team: 'Hero久竞' },
  '杭州': { bg1: '#102018', bg2: '#204030', accent: '#26a69a', team: 'LGD大鹅' },
  '长沙': { bg1: '#1a0808', bg2: '#401818', accent: '#ef5350', team: 'TES' },
  '佛山': { bg1: '#180820', bg2: '#381845', accent: '#7e57c2', team: 'GK' },
  '济南': { bg1: '#18181a', bg2: '#303038', accent: '#78909c', team: 'RW侠' }
};

/**
 * 获取城市 fallback SVG（动态生成内联数据URI）
 * @param {string} cityName - 城市名称
 * @returns {string} data:image/svg+xml URL
 */
function _getCityFallbackSvg(cityName) {
  var cs = CITY_COLOR_SCHEME[cityName] || { bg1:'#1a1a2e', bg2:'#2d2250', accent:'#6366f1', team:'' };
  var esc = function(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,"&#39;");
  };
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">'
    + '<defs>'
    + '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">'
    + '<stop offset="0%" stop-color="' + cs.bg1 + '"/>'
    + '<stop offset="100%" stop-color="' + cs.bg2 + '"/>'
    + '</linearGradient>'
    + '</defs>'
    + '<rect width="1600" height="1000" fill="url(#bg)"/>'
    // 装饰圆环
    + '<circle cx="1300" cy="250" r="200" fill="none" stroke="' + cs.accent + '" stroke-width="2" opacity="0.15"/>'
    + '<circle cx="1300" cy="250" r="150" fill="none" stroke="' + cs.accent + '" stroke-width="1.5" opacity="0.1"/>'
    + '<circle cx="300" cy="750" r="150" fill="none" stroke="' + cs.accent + '" stroke-width="1.5" opacity="0.1"/>'
    // 城市名大字
    + '<text x="800" y="420" text-anchor="middle" font-family="Orbitron,Microsoft YaHei,sans-serif" font-size="160" font-weight="900" fill="white" opacity="0.95">' + esc(cityName) + '</text>'
    // 战队名
    + '<text x="800" y="520" text-anchor="middle" font-family="Inter,Microsoft YaHei,sans-serif" font-size="48" fill="' + cs.accent + '" opacity="0.85">' + esc(cs.team) + ' 主场</text>'
    // 分隔线
    + '<line x1="500" y1="560" x2="1100" y2="560" stroke="' + cs.accent + '" stroke-width="2" opacity="0.3"/>'
    // 副标题
    + '<text x="800" y="620" text-anchor="middle" font-family="Noto Sans SC,Microsoft YaHei,sans-serif" font-size="32" fill="#aaa" opacity="0.7">电竞文旅打卡目的地</text>'
    // 角落装饰
    + '<rect x="60" y="60" width="4" height="80" fill="' + cs.accent + '" opacity="0.6"/>'
    + '<rect x="60" y="60" width="80" height="4" fill="' + cs.accent + '" opacity="0.6"/>'
    + '<rect x="1536" y="860" width="4" height="80" fill="' + cs.accent + '" opacity="0.6"/>'
    + '<rect x="1456" y="936" width="84" height="4" fill="' + cs.accent + '" opacity="0.6"/>'
    + '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

/**
 * 获取城市主图路径（真实地标照片优先，用于 data-lazy 主图加载）
 * 使用 Unsplash 高质量摄影图
 * @param {string} cityName - 城市名称
 * @returns {string}
 */
function _cityImage(cityName) { return CITY_PHOTO_MAP[cityName] || ''; }

/**
 * 获取城市 fallback 图片路径（内联 SVG 数据URI，100%可靠）
 * @param {string} cityName - 城市名称
 * @returns {string}
 */
function _cityImageSvg(cityName) { return _getCityFallbackSvg(cityName); }

const Data = {
  // 电竞城市数据（覆盖KPL全18支常驻俱乐部，12个主场城市）
  cities: [
    {
      id: 1,
      name: '成都', team: 'AG超玩会', region: '西南', featured: true,
      description: '天府之国，电竞热土。成都AG超玩会的主场，拥有最热情的粉丝群体和浓厚的电竞氛围。每年KPL春、秋决赛常客，银龙杯得主。',
      image: _cityImage('成都'),
      thumb: _cityImage('成都'),
      fallback: _cityImageSvg('成都'),
      tags: ['主场场馆', '粉丝文化', '美食之旅'],
      color: '#E74C3C',
      stats: { titles: 1, founded: 2016, fansLevel: '★★★★★' },
      highlights: [
        { name: '成都金融城演艺中心', desc: 'KPL赛事核心举办地，可容纳万人观赛' },
        { name: '太古里电竞主题街区', desc: '潮流聚集地，战队周边官方售卖点' },
        { name: '宽窄巷子打卡体验', desc: '传统与电竞文化融合的网红打卡点' },
        { name: '春熙路AG粉丝基地', desc: '赛前集结地，应援氛围拉满' }
      ],
      tips: '推荐春秋两季前往，避开暑期高峰。建议提前在KPL官网购票，热门场次经常售罄。',
      relatedCities: [4, 3]
    },
    {
      id: 2,
      name: '上海', team: 'EDG.M / RNG.M', region: '华东', featured: false,
      description: '国际大都市，中国电竞之都。汇聚众多顶级战队，拥有世界级电竞基础设施。VSPN总部所在地，国际电竞赛事首选举办地。',
      image: _cityImage('上海'),
      thumb: _cityImage('上海'),
      fallback: _cityImageSvg('上海'),
      tags: ['电竞中心', '国际赛事', '潮流文化'],
      color: '#3498DB',
      stats: { titles: 0, founded: 2017, fansLevel: '★★★★☆' },
      highlights: [
        { name: '梅赛德斯奔驰文化中心', desc: 'KPL总决赛级别场馆，顶级视听体验' },
        { name: '静安体育中心', desc: 'EDG.M主场，上海电竞地标' },
        { name: '新天地电竞体验馆', desc: '沉浸式VR电竞体验+战队博物馆' }
      ],
      tips: '上海电竞资源最丰富，建议安排2-3天深度游。关注"上海电竞"公众号获取最新活动信息。',
      relatedCities: [5, 6]
    },
    {
      id: 3,
      name: '武汉', team: 'eStarPro', region: '华中', featured: false,
      description: '英雄之城，冠军底蕴。eStarPro多次夺得KPL总冠军（6座银龙杯），被誉为"银河战舰"，王者荣耀职业联赛的传奇战队。',
      image: _cityImage('武汉'),
      thumb: _cityImage('武汉'),
      fallback: _cityImage('武汉'),
      tags: ['冠军之城', '江城夜色', '热血主场'],
      color: '#F39C12',
      stats: { titles: 6, founded: 2017, fansLevel: '★★★★★' },
      highlights: [
        { name: '光谷国际网球中心', desc: 'eStarPro主战场，6冠诞生圣地' },
        { name: '汉口江滩观赛区', desc: '户外巨幕直播+千人观赛派对' },
        { name: '黄鹤楼电竞文化节', desc: '年度嘉年华，明星选手签售' }
      ],
      tips: 'eStarPro主场氛围堪称KPL最佳！季后赛或总决赛期间前往体验冠军狂热。',
      relatedCities: [1, 2]
    },
    {
      id: 4,
      name: '重庆', team: '狼队', region: '西南', featured: false,
      description: '山城雾都，狼性精神。重庆狼队3次捧起银龙杯，以顽强比赛风格著称。8D魔幻地貌与电竞热血完美契合。',
      image: _cityImage('重庆'),
      thumb: _cityImage('重庆'),
      fallback: _cityImageSvg('重庆'),
      tags: ['山城夜景', '火锅文化', '热血竞技'],
      color: '#9B59B6',
      stats: { titles: 3, founded: 2017, fansLevel: '★★★★☆' },
      highlights: [
        { name: '华熙文体中心', desc: '狼队主场，LIVE级音响震撼' },
        { name: '洪崖洞夜景打卡', desc: '《千与千寻》现实版，博主必拍' },
        { name: '观音桥电竞美食街', desc: '看比赛吃火锅的绝佳组合' }
      ],
      tips: '强烈推荐夜景！洪崖洞亮灯19:00-23:00，可与赛后活动衔接。',
      relatedCities: [1, 3]
    },
    {
      id: 5,
      name: '北京', team: 'WB / JDG', region: '华北', featured: false,
      description: '首都电竞，王者风范。WB王者荣耀分部快速崛起，JDG英雄联盟LPL顶级豪门。五棵松等奥运级场馆承载双端赛事。',
      image: _cityImage('北京'),
      thumb: _cityImage('北京'),
      fallback: _cityImageSvg('北京'),
      tags: ['首都赛事', '历史文化', '科技园区'],
      color: '#E67E22',
      stats: { titles: 0, founded: 2018, fansLevel: '★★★☆☆' },
      highlights: [
        { name: '五棵松体育馆', desc: '奥运级场馆，KPL/LOL双料举办地' },
        { name: '中关村电竞产业园', desc: '中国电竞产业孵化基地' },
        { name: '三里屯电竞潮店', desc: '限量装备发售+选手偶遇圣地' }
      ],
      tips: '适合搭配故宫/长城游玩。WB主场氛围正在快速崛起中。',
      relatedCities: [2, 6]
    },
    {
      id: 6,
      name: '广州', team: 'TTG', region: '华南', featured: false,
      description: '羊城花都，南方电竞重镇。TTG以精湛操作和创新战术著称，KPL老牌劲旅。美食文化与电竞观赛碰撞别具一格。',
      image: _cityImage('广州'),
      thumb: _cityImage('广州'),
      fallback: _cityImage('广州'),
      tags: ['南方主场', '美食之都', '创新战术'],
      color: '#1ABC9C',
      stats: { titles: 0, founded: 2019, fansLevel: '★★★★☆' },
      highlights: [
        { name: '天河体育馆', desc: 'TTG大本营，华南电竞核心' },
        { name: '琶洲电竞馆', desc: '科技感十足的现代化电竞馆' },
        { name: '珠江新城电竞商圈', desc: 'CBD中的电竞天堂' }
      ],
      tips: '早茶文化和赛前预热完美结合！琶洲馆硬件设施顶尖。',
      relatedCities: [1, 11]
    },
    {
      id: 7,
      name: '苏州', team: 'KSG', region: '华东', featured: false,
      description: '园林之城，新星崛起。苏州KSG成绩突飞猛进，年轻选手辈出。姑苏古典韵味与现代电竞的碰撞令人期待。',
      image: _cityImage('苏州'),
      thumb: _cityImage('苏州'),
      fallback: _cityImage('苏州'),
      tags: ['园林电竞', '新星战队', '江南水乡'],
      color: '#27AE60',
      stats: { titles: 0, founded: 2020, fansLevel: '★★★☆☆' },
      highlights: [
        { name: '阳澄国际电竞馆', desc: 'KSG专属主场，华东新地标' },
        { name: '金鸡湖电竞商圈', desc: '湖畔观赛+灯光秀绝配' },
        { name: '平江路电竞文创店', desc: '苏式美学+周边手办' }
      ],
      tips: 'KSG是联盟最具潜力的新生代之一！值得重点关注。',
      relatedCities: [2, 9]
    },
    {
      id: 8,
      name: '南京', team: 'Hero久竞', region: '华东', featured: false,
      description: '六朝古都，Hero荣光。Hero久竞曾斩获KPL总冠军（2018冬），联盟历史底蕴深厚的豪门战队。',
      image: _cityImage('南京'),
      thumb: _cityImage('南京'),
      fallback: _cityImageSvg('南京'),
      tags: ['古都荣耀', '历史名城', '冠军底蕴'],
      color: '#2980B9',
      stats: { titles: 1, founded: 2018, fansLevel: '★★★★☆' },
      highlights: [
        { name: '南京青奥体育馆', desc: 'Hero久竞主场' },
        { name: '夫子庙电竞主题店', desc: '科举文化+电竞跨界' },
        { name: '紫金山观赛营地', desc: '户外露营+巨幕直播' }
      ],
      tips: 'Hero的冠军DNA仍在！搭配秦淮河夜景效果绝佳。',
      relatedCities: [7, 10]
    },
    {
      id: 9,
      name: '杭州', team: 'LGD大鹅', region: '华东', featured: false,
      description: '人间天堂，大鹅展翅。LGD大鹅依托互联网基因和亚运电竞遗产，长三角电竞新势力。',
      image: _cityImage('杭州'),
      thumb: _cityImage('杭州'),
      fallback: _cityImage('杭州'),
      tags: ['亚运遗产', '互联网电竞', '江南美景'],
      color: '#16A085',
      stats: { titles: 0, founded: 2020, fansLevel: '★★★☆☆' },
      highlights: [
        { name: '杭州电竞中心', desc: '亚运会电竞馆，世界级硬件' },
        { name: '西湖电竞音乐节', desc: '年度湖畔电竞赛事IP' },
        { name: '未来科技城', desc: '阿里系电竞生态聚集地' }
      ],
      tips: '杭州亚运电竞馆是国内最好电竞场馆之一，必打卡！',
      relatedCities: [7, 8]
    },
    {
      id: 10,
      name: '长沙', team: 'TES', region: '华中', featured: false,
      description: '星城热浪，滔搏雄心。TES在LPL已证明实力，KPL分部同样势头强劲。不夜城的娱乐基因天然适配电竞。',
      image: _cityImage('长沙'),
      thumb: _cityImage('长沙'),
      fallback: _cityImage('长沙'),
      tags: ['娱乐之都', '网红城市', '热血赛场'],
      color: '#E74C3C',
      stats: { titles: 0, founded: 2020, fansLevel: '★★★☆☆' },
      highlights: [
        { name: '湖南国际会展中心', desc: 'TES KPL主场' },
        { name: '五一广场电竞商圈', desc: '24小时不打烊的电竞天堂' },
        { name: '橘子洲头观赛派对', desc: '湘江边户外巨幕直播' }
      ],
      tips: '长沙夜生活和电竞绝配！茶颜悦色+看比赛=快乐加倍。',
      relatedCities: [3, 8]
    },
    {
      id: 11,
      name: '佛山', team: 'GK', region: '华南', featured: false,
      description: '功夫之乡，GK铁军。GK以铁血防守和后期翻盘能力闻名大湾区。岭南文化与电竞精神融合独具魅力。',
      image: _cityImage('佛山'),
      thumb: _cityImage('佛山'),
      fallback: _cityImageSvg('佛山'),
      tags: ['岭南文化', '铁血战队', '美食胜地'],
      color: '#8E44AD',
      stats: { titles: 0, founded: 2019, fansLevel: '★★★★☆' },
      highlights: [
        { name: '佛山国际体育文化演艺中心', desc: 'GK主场，CBA+KPL双栖场馆' },
        { name: '祖庙电竞文化节', desc: '功夫+电竞跨界嘉年华' },
        { name: '千灯湖电竞夜市', desc: '岭南小吃+赛后聚会' }
      ],
      tips: '佛山的顺德美食绝对不能错过！配合GK的铁血比赛享用。',
      relatedCities: [6, 12]
    },
    {
      id: 12,
      name: '济南', team: 'RW侠', region: '华北', featured: false,
      description: '泉城济南，侠义天下。RW侠扎根齐鲁大地，以"侠"之名传承中国风电竞精神。趵突泉、大明湖见证每一场热血对决。',
      image: _cityImage('济南'),
      thumb: _cityImage('济南'),
      fallback: _cityImageSvg('济南'),
      tags: ['泉城风光', '侠义精神', '齐鲁文化'],
      color: '#C0392B',
      stats: { titles: 0, founded: 2018, fansLevel: '★★★☆☆' },
      highlights: [
        { name: '济南奥体中心', desc: 'RW侠主场，万人级电竞馆' },
        { name: '芙蓉街电竞主题区', desc: '泉水文化+电竞文创' },
        { name: '大明湖观赛船', desc: '湖上泛舟+实时转播' }
      ],
      tips: 'RW侠的比赛充满江湖气息！"四面荷花三面柳"中感受激情。',
      relatedCities: [5, 11]
    }
  ],

  // KPL 全18支常驻俱乐部战队（2026春季赛）
  teams: [
    { name: '成都AG超玩会', abbr: 'AG', cityId: 1, city: '成都', color: '#E74C3C', titles: 1, founded: 2016, group: 'S组' },
    { name: '佛山DRG', abbr: 'DRG', cityId: 11, city: '佛山', color: '#8E44AD', titles: 0, founded: 2019, group: 'B组' },
    { name: '深圳DYG', abbr: 'DYG', cityId: null, city: '深圳（暂驻）', color: '#00CED1', titles: 0, founded: 2019, group: 'S组' },
    { name: '上海EDG.M', abbr: 'EDG', cityId: 2, city: '上海', color: '#3498DB', titles: 0, founded: 2017, group: 'B组' },
    { name: '武汉eStarPro', abbr: 'ESTAR', cityId: 3, city: '武汉', color: '#F39C12', titles: 6, founded: 2017, group: 'B组' },
    { name: '南京Hero久竞', abbr: 'Hero', cityId: 8, city: '南京', color: '#2980B9', titles: 1, founded: 2018, group: 'A组' },
    { name: '北京JDG', abbr: 'JDG', cityId: 5, city: '北京', color: '#E67E22', titles: 0, founded: 2018, group: 'S组' },
    { name: '苏州KSG', abbr: 'KSG', cityId: 7, city: '苏州', color: '#27AE60', titles: 0, founded: 2020, group: 'S组' },
    { name: '重庆狼队', abbr: '狼队', cityId: 4, city: '重庆', color: '#9B59B6', titles: 3, founded: 2017, group: 'S组' },
    { name: '杭州LGD大鹅', abbr: 'LGD', cityId: 9, city: '杭州', color: '#16A085', titles: 0, founded: 2020, group: 'A组' },
    { name: '桐乡情久', abbr: '情久', cityId: null, city: '桐乡', color: '#999999', titles: 0, founded: 2019, group: 'A组' },
    { name: '上海RNG.M', abbr: 'RNG', cityId: 2, city: '上海', color: '#F1C40F', titles: 0, founded: 2017, group: 'B组' },
    { name: '济南RW侠', abbr: 'RW侠', cityId: 12, city: '济南', color: '#C0392B', titles: 0, founded: 2018, group: 'A组' },
    { name: '无锡TCG', abbr: 'TCG', cityId: null, city: '无锡', color: '#666666', titles: 0, founded: 2020, group: 'B组' },
    { name: '长沙滔搏电竞', abbr: 'TES', cityId: 10, city: '长沙', color: '#E74C3C', titles: 0, founded: 2020, group: 'A组' },
    { name: '广州TTG', abbr: 'TTG', cityId: 6, city: '广州', color: '#1ABC9C', titles: 0, founded: 2019, group: 'A组' },
    { name: '北京WB', abbr: 'WB', cityId: 5, city: '北京', color: '#E67E22', titles: 0, founded: 2018, group: 'S组' },
    { name: '西安WE', abbr: 'WE', cityId: null, city: '西安（暂驻）', color: '#D35400', titles: 0, founded: 2019, group: 'A组' }
  ],

  // 王者荣耀英雄数据
  heroes: [
    // 战士
    { id: 1, name: '亚瑟', role: 'warrior', roleName: '战士', avatar: '⚔️', tags: ['新手友好', '续航', '控制'] },
    { id: 2, name: '花木兰', role: 'warrior', roleName: '战士', avatar: '🗡️', tags: ['高爆发', '双形态', '灵活'] },
    { id: 3, name: '李信', role: 'warrior', roleName: '战士', avatar: '⚡', tags: ['高伤害', '远程', '光暗双形态'] },
    { id: 4, name: '云缨', role: 'warrior', roleName: '战士', avatar: '🔥', tags: ['多段伤害', '灵活', '控制'] },
    { id: 5, name: '关羽', role: 'warrior', roleName: '战士', avatar: '🐎', tags: ['高移速', '控制', '爆发'] },
    { id: 6, name: '典韦', role: 'warrior', roleName: '战士', avatar: '🔨', tags: ['真实伤害', '续航', '高爆发'] },
    { id: 7, name: '吕布', role: 'warrior', roleName: '战士', avatar: '👑', tags: ['真实伤害', '护盾', '团控'] },
    { id: 8, name: '夏侯惇', role: 'warrior', roleName: '战士', avatar: '🛡️', tags: ['控制', '护盾', '续航'] },
    { id: 9, name: '司空震', role: 'warrior', roleName: '战士', avatar: '⚡', tags: ['远程', '高伤害', '护盾'] },
    { id: 10, name: '孙策', role: 'warrior', roleName: '战士', avatar: '🚢', tags: ['控制', '位移', '开团'] },
    { id: 11, name: '曹操', role: 'warrior', roleName: '战士', avatar: '⚔️', tags: ['吸血', '韧性', '持续输出'] },
    { id: 12, name: '铠', role: 'warrior', roleName: '战士', avatar: '🛡️', tags: ['高爆发', '护盾', '单体伤害'] },
    { id: 13, name: '赵云', role: 'warrior', roleName: '战士', avatar: '⚔️', tags: ['灵活', '回血', '控制'] },
    { id: 14, name: '达摩', role: 'warrior', roleName: '战士', avatar: '🥋', tags: ['控制', '位移', '爆发'] },
    { id: 15, name: '钟无艳', role: 'warrior', roleName: '战士', avatar: '🔨', tags: ['石化', '爆发', '控制'] },
    { id: 16, name: '哪吒', role: 'warrior', roleName: '战士', avatar: '🔥', tags: ['飞踢', '控制', '团队支援'] },
    { id: 17, name: '杨戬', role: 'warrior', roleName: '战士', avatar: '🐶', tags: ['控制', '回血', '真实伤害'] },
    { id: 18, name: '老夫子', role: 'warrior', roleName: '战士', avatar: '📜', tags: ['捆绑', '免控', '持续输出'] },
    { id: 19, name: '程咬金', role: 'warrior', roleName: '战士', avatar: '🔨', tags: ['回血', '韧性', '坦度'] },
    { id: 20, name: '苏烈', role: 'warrior', roleName: '战士', avatar: '🛡️', tags: ['控制', '复活', '团控'] },
    { id: 21, name: '狂铁', role: 'warrior', roleName: '战士', avatar: '⚡', tags: ['高伤害', '护盾', '续航'] },
    { id: 22, name: '曜', role: 'warrior', roleName: '战士', avatar: '⭐', tags: ['灵活', '多段位移', '爆发'] },
    { id: 23, name: '马超', role: 'warrior', roleName: '战士', avatar: '🏇', tags: ['高移速', '爆发', '灵活'] },
    { id: 24, name: '蒙恬', role: 'warrior', roleName: '战士', avatar: '🛡️', tags: ['护盾', '控制', '爆发'] },
    { id: 25, name: '亚连', role: 'warrior', roleName: '战士', avatar: '⚔️', tags: ['双形态', '控制', '爆发'] },
    { id: 26, name: '赵怀真', role: 'warrior', roleName: '战士', avatar: '☯️', tags: ['控制', '反伤', '坦度'] },
    { id: 27, name: '苍', role: 'warrior', roleName: '战士', avatar: '🌪️', tags: ['位移', '控制', '爆发'] },
    { id: 28, name: '姬小满', role: 'warrior', roleName: '战士', avatar: '🌸', tags: ['灵活', '控制', '爆发'] },
    
    // 法师
    { id: 29, name: '妲己', role: 'mage', roleName: '法师', avatar: '🦊', tags: ['简单', '高爆发', '控制'] },
    { id: 30, name: '诸葛亮', role: 'mage', roleName: '法师', avatar: '⭐', tags: ['灵活', '收割', '位移'] },
    { id: 31, name: '貂蝉', role: 'mage', roleName: '法师', avatar: '💃', tags: ['真实伤害', '回血', '持续输出'] },
    { id: 32, name: '安琪拉', role: 'mage', roleName: '法师', avatar: '📚', tags: ['简单', '高爆发', '范围伤害'] },
    { id: 33, name: '上官婉儿', role: 'mage', roleName: '法师', avatar: '✒️', tags: ['高爆发', '位移', '收割'] },
    { id: 34, name: '周瑜', role: 'mage', roleName: '法师', avatar: '🔥', tags: ['持续伤害', '控制', '推塔'] },
    { id: 35, name: '墨子', role: 'mage', roleName: '法师', avatar: '🔬', tags: ['控制', '护盾', '远程'] },
    { id: 36, name: '女娲', role: 'mage', roleName: '法师', avatar: '🌍', tags: ['远程', '控制', '传送'] },
    { id: 37, name: '姜子牙', role: 'mage', roleName: '法师', avatar: '🧙', tags: ['经验加成', '远程', '控制'] },
    { id: 38, name: '嫦娥', role: 'mage', roleName: '法师', avatar: '🌙', tags: ['护盾', '吸血', '控制'] },
    { id: 39, name: '嬴政', role: 'mage', roleName: '法师', avatar: '👑', tags: ['远程', '范围伤害', '高爆发'] },
    { id: 40, name: '小乔', role: 'mage', roleName: '法师', avatar: '🌸', tags: ['高爆发', '控制', '消耗'] },
    { id: 41, name: '干将莫邪', role: 'mage', roleName: '法师', avatar: '⚔️', tags: ['高爆发', '远程', '消耗'] },
    { id: 42, name: '弈星', role: 'mage', roleName: '法师', avatar: '♟️', tags: ['控制', '消耗', '爆发'] },
    { id: 43, name: '张良', role: 'mage', roleName: '法师', avatar: '📜', tags: ['控制', '消耗', '团队增益'] },
    { id: 44, name: '扁鹊', role: 'mage', roleName: '法师', avatar: '⚗️', tags: ['持续伤害', '回血', '消耗'] },
    { id: 45, name: '沈梦溪', role: 'mage', roleName: '法师', avatar: '🐱', tags: ['高爆发', '消耗', '控制'] },
    { id: 46, name: '海月', role: 'mage', roleName: '法师', avatar: '🌙', tags: ['控制', '爆发', '空间'] },
    { id: 47, name: '王昭君', role: 'mage', role: 'mage', roleName: '法师', avatar: '❄️', tags: ['控制', '范围伤害', '爆发'] },
    { id: 48, name: '甄姬', role: 'mage', roleName: '法师', avatar: '💧', tags: ['控制', '范围伤害', '消耗'] },
    { id: 49, name: '米莱狄', role: 'mage', roleName: '法师', avatar: '🤖', tags: ['推塔', '召唤', '消耗'] },
    { id: 50, name: '高渐离', role: 'mage', roleName: '法师', avatar: '🎸', tags: ['高爆发', '团控', '持续输出'] },
    { id: 51, name: '西施', role: 'mage', roleName: '法师', avatar: '💦', tags: ['控制', '消耗', '团队增益'] },
    { id: 52, name: '司马懿', role: 'mage', roleName: '法师', avatar: '👻', tags: ['高爆发', '位移', '收割'] },
    { id: 53, name: '大司命', role: 'mage', roleName: '法师', avatar: '⚰️', tags: ['控制', '爆发', '消耗'] },
    { id: 54, name: '少司缘', role: 'mage', roleName: '法师', avatar: '🌸', tags: ['控制', '爆发', '团队增益'] },
    
    // 坦克
    { id: 55, name: '张飞', role: 'tank', roleName: '坦克', avatar: '🐉', tags: ['保人', '护盾', '开团'] },
    { id: 56, name: '牛魔', role: 'tank', roleName: '坦克', avatar: '🐂', tags: ['团队增益', '控制', '减伤'] },
    { id: 57, name: '廉颇', role: 'tank', roleName: '坦克', avatar: '💪', tags: ['免控', '控制', '护盾'] },
    { id: 58, name: '东皇太一', role: 'tank', roleName: '坦克', avatar: '🐍', tags: ['无解控', '回血', '压制'] },
    { id: 59, name: '盾山', role: 'tank', roleName: '坦克', avatar: '🛡️', tags: ['格挡飞行物', '修塔', '开团'] },
    { id: 60, name: '刘禅', role: 'tank', roleName: '坦克', avatar: '🤖', tags: ['控制', '拆塔', '护盾'] },
    { id: 61, name: '刘邦', role: 'tank', roleName: '坦克', avatar: '👑', tags: ['传送', '减伤', '控制'] },
    { id: 62, name: '太乙真人', role: 'tank', roleName: '坦克', avatar: '🧪', tags: ['复活', '控制', '团队增益'] },
    { id: 63, name: '庄周', role: 'tank', roleName: '坦克', avatar: '🐟', tags: ['解控', '护盾', '减伤'] },
    { id: 64, name: '猪八戒', role: 'tank', roleName: '坦克', avatar: '🐷', tags: ['回血', '控制', '坦度'] },
    { id: 65, name: '白起', role: 'tank', roleName: '坦克', avatar: '⚔️', tags: ['嘲讽', '坦度', '团队增益'] },
    { id: 66, name: '盘古', role: 'tank', roleName: '坦克', avatar: '🪓', tags: ['缴械', '控制', '坦度'] },
    { id: 67, name: '项羽', role: 'tank', roleName: '坦克', avatar: '🛡️', tags: ['控制', '坦度', '爆发'] },
    { id: 68, name: '大禹', role: 'tank', roleName: '坦克', avatar: '🌊', tags: ['控制', '坦度', '团队增益'] },
    
    // 刺客
    { id: 69, name: '李白', role: 'assassin', roleName: '刺客', avatar: '🍷', tags: ['飘逸', '不可选中', '收割'] },
    { id: 70, name: '韩信', role: 'assassin', roleName: '刺客', avatar: '🐉', tags: ['多位移', '刷野快', '灵活'] },
    { id: 71, name: '澜', role: 'assassin', roleName: '刺客', avatar: '🦈', tags: ['追踪', '真伤', '控制'] },
    { id: 72, name: '镜', role: 'assassin', roleName: '刺客', avatar: '🪞', tags: ['高爆发', '镜像', '多位移'] },
    { id: 73, name: '兰陵王', role: 'assassin', roleName: '刺客', avatar: '🗡️', tags: ['隐身', '秒人', '视野压制'] },
    { id: 74, name: '云中君', role: 'assassin', roleName: '刺客', avatar: '☁️', tags: ['无视地形', '控制', '爆发'] },
    { id: 75, name: '元歌', role: 'assassin', roleName: '刺客', avatar: '🎭', tags: ['傀儡', '多位移', '秀操作'] },
    { id: 76, name: '孙悟空', role: 'assassin', roleName: '刺客', avatar: '🐵', tags: ['暴击', '控制', '爆发'] },
    { id: 77, name: '暃', role: 'assassin', roleName: '刺客', avatar: '🗡️', tags: ['上墙', '灵活', '爆发'] },
    { id: 78, name: '敖隐', role: 'assassin', roleName: '刺客', avatar: '🐉', tags: ['位移', '爆发', '控制'] },
    { id: 79, name: '影', role: 'assassin', roleName: '刺客', avatar: '👤', tags: ['隐身', '爆发', '控制'] },
    { id: 80, name: '裴擒虎', role: 'assassin', roleName: '刺客', avatar: '🐯', tags: ['双形态', '灵活', '爆发'] },
    { id: 81, name: '阿轲', role: 'assassin', roleName: '刺客', avatar: '🗡️', tags: ['隐身', '收割', '爆发'] },
    { id: 82, name: '露娜', role: 'assassin', roleName: '刺客', avatar: '🌙', tags: ['无限连', '灵活', '爆发'] },
    { id: 83, name: '雅典娜', role: 'assassin', roleName: '刺客', avatar: '🛡️', tags: ['灵活', '爆发', '阵亡效果'] },
    { id: 84, name: '元流之子(刺客)', role: 'assassin', roleName: '刺客', avatar: '⚡', tags: ['灵活', '爆发', '控制'] },
    { id: 85, name: '空空儿', role: 'assassin', roleName: '刺客', avatar: '🗡️', tags: ['隐身', '爆发', '控制'] },
    
    // 射手
    { id: 86, name: '后羿', role: 'archer', roleName: '射手', avatar: '🏹', tags: ['简单', '远程', '持续输出'] },
    { id: 87, name: '孙尚香', role: 'archer', roleName: '射手', avatar: '💣', tags: ['灵活', '爆发', '位移'] },
    { id: 88, name: '马可波罗', role: 'archer', roleName: '射手', avatar: '🌍', tags: ['真伤', '灵活', '持续输出'] },
    { id: 89, name: '公孙离', role: 'archer', roleName: '射手', avatar: '🍂', tags: ['多位移', '灵活', '秀操作'] },
    { id: 90, name: '虞姬', role: 'archer', roleName: '射手', avatar: '🦋', tags: ['物免', '远程', '减速'] },
    { id: 91, name: '伽罗', role: 'archer', roleName: '射手', avatar: '🏹', tags: ['远程', '减速', '持续输出'] },
    { id: 92, name: '李元芳', role: 'archer', roleName: '射手', avatar: '🔫', tags: ['推塔', '位移', '爆发'] },
    { id: 93, name: '艾琳', role: 'archer', roleName: '射手', avatar: '🏹', tags: ['真实伤害', '灵活', '持续输出'] },
    { id: 94, name: '戈娅', role: 'archer', roleName: '射手', avatar: '🏍️', tags: ['高移速', '爆发', '持续输出'] },
    { id: 95, name: '莱西奥', role: 'archer', roleName: '射手', avatar: '🔫', tags: ['高爆发', '位移', '持续输出'] },
    { id: 96, name: '蒙犽', role: 'archer', roleName: '射手', avatar: '🔫', tags: ['高爆发', '持续输出', '范围伤害'] },
    { id: 97, name: '狄仁杰', role: 'archer', roleName: '射手', avatar: '⚖️', tags: ['解控', '持续输出', '推塔'] },
    { id: 98, name: '黄忠', role: 'archer', roleName: '射手', avatar: '🔫', tags: ['高爆发', '范围伤害', '架炮'] },
    { id: 99, name: '百里守约', role: 'archer', roleName: '射手', avatar: '🔫', tags: ['远程', '隐身', '爆发'] },
    { id: 100, name: '元流之子(射手)', role: 'archer', roleName: '射手', avatar: '⚡', tags: ['远程', '爆发', '持续输出'] },
    
    // 辅助
    { id: 101, name: '瑶', role: 'support', roleName: '辅助', avatar: '🦌', tags: ['附身', '护盾', '简单'] },
    { id: 102, name: '孙膑', role: 'support', roleName: '辅助', avatar: '⏰', tags: ['加速', '回血', '沉默'] },
    { id: 103, name: '大乔', role: 'support', roleName: '辅助', avatar: '🐟', tags: ['传送', '沉默', '开视野'] },
    { id: 104, name: '蔡文姬', role: 'support', roleName: '辅助', avatar: '🎵', tags: ['群体回血', '眩晕', '简单'] },
    { id: 105, name: '鬼谷子', role: 'support', roleName: '辅助', avatar: '🎭', tags: ['群体隐身', '加速', '开团'] },
    { id: 106, name: '明世隐', role: 'support', roleName: '辅助', avatar: '🔮', tags: ['增益', '减益', '控制'] },
    { id: 107, name: '桑启', role: 'support', roleName: '辅助', avatar: '🌱', tags: ['回血', '位移', '控制'] },
    { id: 108, name: '梦奇', role: 'support', roleName: '辅助', avatar: '🐱', tags: ['护盾', '控制', '减伤'] },
    { id: 109, name: '海诺', role: 'support', roleName: '辅助', avatar: '🌊', tags: ['控制', '回血', '团队增益'] },
    { id: 110, name: '钟馗', role: 'support', roleName: '辅助', avatar: '🔗', tags: ['勾人', '团控', '爆发'] },
    { id: 111, name: '百里玄策', role: 'support', roleName: '辅助', avatar: '🔗', tags: ['控制', '团队增益', '爆发'] },
    { id: 112, name: '金蝉', role: 'support', roleName: '辅助', avatar: '🧘', tags: ['减伤', '控制', '团队增益'] },
    { id: 113, name: '朵莉亚', role: 'support', roleName: '辅助', avatar: '🐟', tags: ['控制', '回血', '团队增益'] },
    { id: 114, name: '元流之子(辅助)', role: 'support', roleName: '辅助', avatar: '⚡', tags: ['控制', '回血', '团队增益'] },
    { id: 115, name: '元流之子(法师)', role: 'support', roleName: '辅助', avatar: '⚡', tags: ['控制', '爆发', '团队增益'] },
    { id: 116, name: '元流之子(坦克)', role: 'support', roleName: '辅助', avatar: '⚡', tags: ['坦度', '控制', '团队增益'] },
    { id: 117, name: '鲁班大师', role: 'support', roleName: '辅助', avatar: '🤖', tags: ['控制', '位移', '团队增益'] },
    { id: 118, name: '蚩奼', role: 'support', roleName: '辅助', avatar: '🐉', tags: ['控制', '团队增益', '爆发'] }
  ],

  getWelcomeMessage(scenarioKey) {
    var scenario = CONFIG.scenarios[scenarioKey];
    if (!scenario) return '';
    var messages = {};
    messages.competition = '<p>你好！我是<strong>' + scenario.name + '——<strong>战事指挥官</strong></strong>模块 🎯</p><p>' + scenario.description + '</p><p>你可以问我关于<strong>KPL赛事</strong>、<strong>战队分析</strong>、<strong>选手数据</strong>等任何问题！</p>';
    messages.mentor = '<p>你好！我是<strong>' + scenario.name + '——<strong>荣耀导师</strong></strong>模块 🎮</p><p>' + scenario.description + '</p><p>我可以教你<strong>英雄连招</strong>、推荐<strong>阵容搭配</strong>、制定<strong>训练计划</strong>，随时帮你上分！</p>';
    messages.travel = '<p>你好！我是<strong>' + scenario.name + '——<strong>电竞文旅</strong></strong>模块 🌆</p><p>' + scenario.description + '</p><p>想了解哪个城市的电竞主场？或者规划一次<strong>电竞主题旅行</strong>？尽管问我！</p>';
    return messages[scenarioKey] || messages.competition;
  },

  getScenarioIcon(scenarioKey) {
    var icons = { competition: './images/heroes/亚瑟.jpg', mentor: './images/heroes/妲己.jpg', travel: './images/heroes/马可波罗.jpg' };
    return icons[scenarioKey] || '🤖';
  },

  getScenarioAIName(scenarioKey) {
    var names = { competition: '战意', mentor: '魅惑', travel: '冒险家' };
    return names[scenarioKey] || '助手';
  },

  getOfflineResponse(message, scenario) {
    var responses = {
      competition: [
        '\u597D\u95EE\u9898\uFF01\u5173\u4E8E\u300C' + message + '\u300D\uFF0C\u8BA9\u6211\u6765\u4E3A\u4F60\u8BE6\u7EC6\u5206\u6790...\uFF08\u8BF7\u914D\u7F6E\u817E\u8BAF\u5143API\u4EE5\u83B7\u53D6\u5B8C\u6574\u56DE\u7B54\uFF09'
      ],
      mentor: [
        '\u5173\u4E8E\u300C' + message + '\u300D\u7684\u95EE\u9898\uFF0C\u6211\u6765\u5E2E\u4F60\u5206\u6790\u4E00\u4E0B...\uFF08\u8BF7\u914D\u7F6EAPI\u83B7\u53D6\u5B8C\u6574\u6307\u5BFC\uFF09'
      ],
      travel: [
        '\u300C' + message + '\u300D\u662F\u4E2A\u5F88\u68D2\u7684\u9009\u62E9\uFF01\uFF08\u914D\u7F6EAPI\u540E\u83B7\u53D6\u5B8C\u6574\u7684\u6587\u65C5\u653E\u7565\uFF09'
      ]
    };
    var list = responses[scenario] || responses.competition;
    return list[Math.floor(Math.random() * list.length)];
  }
};
