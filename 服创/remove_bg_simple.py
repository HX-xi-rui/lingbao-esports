"""
简单的背景去除工具
使用 PIL 进行基础背景处理
"""

from PIL import Image
import os

def remove_background_simple(input_path, output_path, bg_color=(255, 255, 255)):
    """
    简单的背景去除方法（适用于背景颜色较统一的图片）
    """
    print(f"正在处理: {input_path}")
    
    # 打开图片
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    
    width, height = img.size
    
    # 获取图片四角的像素作为背景色参考
    corners = [
        pixels[0, 0][:3],
        pixels[width-1, 0][:3],
        pixels[0, height-1][:3],
        pixels[width-1, height-1][:3]
    ]
    
    # 计算平均背景色
    bg_r = sum([c[0] for c in corners]) // 4
    bg_g = sum([c[1] for c in corners]) // 4
    bg_b = sum([c[2] for c in corners]) // 4
    
    print(f"检测到背景色: RGB({bg_r}, {bg_g}, {bg_b})")
    
    # 设置阈值（可调整）
    threshold = 60
    
    # 遍历所有像素
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # 计算与背景色的差异
            diff = abs(r - bg_r) + abs(g - bg_g) + abs(b - bg_b)
            
            # 如果差异小于阈值，设为透明
            if diff < threshold:
                pixels[x, y] = (r, g, b, 0)
    
    # 保存结果
    img.save(output_path, "PNG")
    print(f"[OK] 处理完成！保存至: {output_path}")
    
    return output_path

# 使用方法
if __name__ == "__main__":
    input_path = r'c:\Users\26771\Desktop\服创\images\R-C.jpg'
    output_path = r'/images/R-C.jpg'
    
    try:
        result = remove_background_simple(input_path, output_path)
        print("\n提示: 如果效果不理想，可以：")
        print("1. 使用在线工具: https://www.remove.bg/zh")
        print("2. 或使用 Photoshop/GIMP 手动处理")
        
        # 打开图片预览
        Image.open(result).show()
        
    except Exception as e:
        print(f"[ERROR] 处理失败: {e}")
