"""
图片背景去除工具
使用 rembg 库去除图片背景
"""

from rembg import remove
from PIL import Image
import os

# 输入输出路径
input_path = r'c:\Users\26771\Desktop\服创\images\R-C.jpg'
output_path = r'/images/R-C.jpg'

print(f"正在处理图片: {input_path}")
print("请稍候，首次运行需要下载模型文件...")

try:
    # 读取图片
    with open(input_path, 'rb') as input_file:
        input_data = input_file.read()
    
    # 去除背景
    output_data = remove(input_data)
    
    # 保存结果
    with open(output_path, 'wb') as output_file:
        output_file.write(output_data)
    
    print(f"✅ 背景去除完成！")
    print(f"📁 保存位置: {output_path}")
    
    # 打开图片预览
    result = Image.open(output_path)
    result.show()
    
except Exception as e:
    print(f"❌ 处理失败: {e}")
    print("\n💡 解决方案:")
    print("1. 安装 rembg: pip install rembg")
    print("2. 或使用在线工具: https://www.remove.bg/zh")
