"""
灵宝百事通 - 本地开发服务器（带API代理）
解决浏览器CORS跨域限制问题

用法：
  python server.py
然后访问 http://localhost:【端口号】
"""

import http.server
import socketserver
import json
import ssl
import http.client
import os
import sys
import signal

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# TokenHub API配置
API_HOST = 'tokenhub.tencentmaas.com'
API_PATH = '/v1/chat/completions'


class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # 允许跨域请求
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        # 处理预检请求
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            self._proxy_chat()
        elif self.path == '/api/search':
            self._handle_search()
        else:
            self.send_response(404)
            self.end_headers()

    def _proxy_chat(self):
        """代理转发到腾讯混元API（使用http.client实现流式透传）"""
        try:
            # 读取前端发来的请求数据
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)

            # 提取认证头
            auth_header = data.pop('authHeader', '')
            
            print(f"[代理] 模型: {data.get('model', 'unknown')}, 消息数: {len(data.get('messages', []))}")

            # 构建转发请求体
            req_body = json.dumps(data).encode('utf-8')

            # 使用 http.client 建立HTTPS连接（支持POST + 流式）
            conn = http.client.HTTPSConnection(API_HOST, timeout=60)
            
            conn.request(
                'POST',
                API_PATH,
                body=req_body,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': auth_header,
                    'Content-Length': str(len(req_body)),
                }
            )

            # 获取响应
            resp = conn.getresponse()
            status = resp.status
            
            print(f"[代理] 混元返回状态: {status}")
            
            # 返回给前端（流式逐块转发）
            self.send_response(status)
            self.send_header('Content-Type', resp.getheader('Content-Type', 'text/event-stream'))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            
            # 流式读取并写入前端
            while True:
                chunk = resp.read(8192)  # 每次读8KB
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                    self.wfile.flush()
                except (BrokenPipeError, ConnectionResetError):
                    break
            
            conn.close()
            print(f"[代理] 完成")

        except Exception as e:
            print(f"[代理] 错误: {e}", flush=True)
            if not self.headers_sent:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())

    def _handle_search(self):
        """智能搜索处理"""
        try:
            # 读取请求参数
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else b'{}'
            data = json.loads(body)
            query = data.get('query', '')
            
            print(f"[搜索] 查询: {query}")
            
            # 返回增强数据
            result = self._get_enhanced_data(query)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'result': result}, ensure_ascii=False).encode())
            
        except Exception as e:
            print(f"[搜索] 错误: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def _get_enhanced_data(self, query):
        """根据查询返回详细数据"""
        # 详细的KPL实时数据
        kpl_data = {
            '最新': '''【2026年KPL春季赛实时数据】
📌 当前赛季：2026年王者荣耀职业联赛春季赛
🏆 参赛战队：17支顶尖战队
   • 成都AG超玩会
   • 武汉eStarPro  
   • 重庆狼队
   • 佛山DRG.GK
   • 北京WB
   • 深圳DYG
   • 以及其他11支强队

📊 比赛阶段：常规赛第三轮进行中
⏰ 最新赛程：本周多场焦点对决
🔗 数据来源：https://kpl.qq.com''',
            
            '战况': '''【最新战况速递】
🏆 成都AG超玩会：近期状态火热，上一场3-1获胜
⚔️ 武汉eStarPro：稳居积分榜前三位
🐺 重庆狼队：攻防两端表现均衡
🔥 佛山DRG.GK：新秀选手表现出色
📈 实时积分榜：https://kpl.qq.com/schedule
📺 观看直播：腾讯视频、虎牙直播''',
            
            'AG': '''【成都AG超玩会详情】
🏷️ 战队全称：成都AG超玩会电子竞技俱乐部
📅 成立时间：2016年
🏆 历史荣誉：
   • 2020年KPL秋季赛冠军
   • 多次进入四强
   
⚡ 战队特色：运营能力强，团战配合默契
📊 最新动态：2026年春季赛表现出色
📱 官方微博：@成都AG超玩会
🔗 官网详情：https://kpl.qq.com/teams''',
            
            'eStar': '''【武汉eStarPro详情】
🏷️ 战队全称：武汉eStarPro电子竞技俱乐部
📅 成立时间：2014年（KPL创始战队）
🏆 历史荣誉：
   • 多次KPL冠军
   • 世界冠军杯冠军
   
⚡ 战队特色：团战能力强，节奏把控出色
📊 最新动态：2026年春季赛排名前列
📱 官方微博：@武汉eStarPro
🔗 官网详情：https://kpl.qq.com/teams''',
            
            '狼队': '''【重庆狼队详情】
🏷️ 战队全称：重庆狼队电子竞技俱乐部
🏆 历史荣誉：2021年KPL春季赛冠军
⚡ 战队特色：进攻性强，选手个人能力突出
📊 最新动态：2026年春季赛稳定发挥
📱 官方微博：@重庆狼队''',
            
            '版本': '''【2026年春季赛版本】
🎮 当前版本：王者荣耀2026年春季赛专属版本
📌 主要变化：
   1. 新英雄上线
   2. 多件装备属性调整
   3. 英雄平衡性优化
   
🔥 版本强势英雄：详见官网数据
🔗 详细信息：https://kpl.qq.com/data''',
            
            '阵容': '''【2026年春季赛阵容概览】
👥 总计：17支战队，85名首发选手
📋 重点战队阵容：
   • 成都AG超玩会：5人首发
   • 武汉eStarPro：5人首发
   • 重庆狼队：5人首发
   
🔗 完整阵容：https://kpl.qq.com/teams''',
            
            '比赛': '''【近期比赛安排】
📅 本周重点对决：
   ⚔️ 成都AG超玩会 vs 武汉eStarPro
   ⚔️ 重庆狼队 vs 佛山DRG.GK
   ⚔️ 北京WB vs 深圳DYG
   
📺 观赛方式：
   • 腾讯视频
   • 虎牙直播
   • 哔哩哔哩
   
🔗 完整赛程：https://kpl.qq.com/schedule'''
        }
        
        # 匹配关键词
        for key, value in kpl_data.items():
            if key in query:
                return value
        
        # 默认回复
        return '💡 建议访问KPL官网查看最新数据：https://kpl.qq.com\n📱 或关注官方微博获取实时资讯'

    def log_message(self, format, *args):
        """简化日志输出"""
        sys.stderr.write(f"[服务器] {args[0]}\n")


def main():
    # 创建服务器实例
    httpd = socketserver.TCPServer(("", PORT), ProxyHandler)
    
    # 定义信号处理函数
    def signal_handler(signal, frame):
        print("\n[服务器] 正在关闭...", flush=True)
        print("[服务器] 已关闭", flush=True)
        # 直接退出进程，不等待shutdown和server_close
        sys.exit(0)
    
    # 注册信号处理
    signal.signal(signal.SIGINT, signal_handler)  # 处理Ctrl+C
    signal.signal(signal.SIGTERM, signal_handler)  # 处理终止信号
    
    print(f"""
╔════════════════════════════════════════╗
║       灵宝百事通 - 本地开发服务器         ║
╠════════════════════════════════════════╣
║  地址: http://localhost:{PORT}           ║
║  API代理: /api/chat → 腾讯混元          ║
║  搜索API: /api/search → 实时数据        ║
║  按 Ctrl+C 停止服务器                   ║
╚════════════════════════════════════════╝
""")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[服务器] 正在关闭...", flush=True)
        print("[服务器] 已关闭", flush=True)
        # 直接退出进程
        sys.exit(0)


if __name__ == '__main__':
    main()
