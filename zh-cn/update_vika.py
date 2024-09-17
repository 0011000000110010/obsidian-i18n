import json
import requests
from tqdm import tqdm
import time
import os

# 从环境变量获取 API 密钥
API_URL = "https://api.vika.cn/fusion/v1/datasheets/dstYkrs9t44YXVqf1r/records"
API_KEY = os.environ.get("VIKA_API_KEY")
VIEW_ID = "viwHmlgiKVSEs"

def load_json_file(file_name):
    """加载JSON文件"""
    with open(file_name, 'r', encoding='utf-8') as file:
        return json.load(file)

def match_plugin_info(ranked_plugins, directory):
    """匹配插件信息"""
    matched_plugins = []
    ranked_plugins_dict = {plugin['id']: plugin for plugin in ranked_plugins}
    
    for plugin in tqdm(directory, desc="匹配插件信息"):
        plugin_id = plugin['id']
        ranked_plugin = ranked_plugins_dict.get(plugin_id)
        
        if ranked_plugin:
            matched_plugins.append({
                "fields": {
                    "fldKXbFgZiqxw": ranked_plugin['name'],  # 插件名称
                    "fldf5SsCXT47w": plugin_id,              # 插件id
                    "fldUGwUCXYtCZ": ranked_plugin['rank']   # 插件下载量排名（数字类型）
                }
            })
        else:
            matched_plugins.append({
                "fields": {
                    "fldKXbFgZiqxw": "此插件未上架官方市场，请手动填写名称",  # 插件名称
                    "fldf5SsCXT47w": plugin_id,                              # 插件id
                    "fldUGwUCXYtCZ": 99999                                   # 未上架插件的排名（数字类型）
                }
            })
    
    print(f"总共匹配到 {len(matched_plugins)} 条记录")
    return matched_plugins

def send_to_vika(matched_plugins):
    """分批发送匹配的插件信息到Vika，并遵守速率限制"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    print(f"准备发送 {len(matched_plugins)} 条记录到Vika")
    
    if not matched_plugins:
        print("没有匹配的插件信息需要发送")
        return
    
    batch_size = 10
    total_sent = 0
    
    with tqdm(total=len(matched_plugins), desc="发送数据到Vika") as pbar:
        for i in range(0, len(matched_plugins), batch_size):
            batch = matched_plugins[i:i+batch_size]
            data = {
                "records": batch,
                "fieldKey": "id"
            }
            try:
                print(f"发送批次 {i // batch_size + 1}，数据示例：")
                print(json.dumps(batch[0], indent=2, ensure_ascii=False))
                response = requests.post(f"{API_URL}?viewId={VIEW_ID}&fieldKey=id", headers=headers, json=data)
                response.raise_for_status()
                result = response.json()
                print("API 响应:")
                print(json.dumps(result, indent=2, ensure_ascii=False))
                
                if result.get('success'):
                    sent_count = len(result.get('data', {}).get('records', []))
                    total_sent += sent_count
                    print(f"本批次成功发送 {sent_count} 条记录")
                else:
                    print(f"API 返回错误: {result.get('message')}")
                
                pbar.update(len(batch))
                
                time.sleep(0.5)  # 等待 0.5 秒，确保不超过每秒 2 次请求
            except requests.exceptions.HTTPError as e:
                print(f"HTTP 错误: {e}")
                print(f"错误响应: {e.response.text}")
                if e.response.status_code == 429:
                    print("请求过于频繁，等待 5 秒后重试...")
                    time.sleep(5)
                    continue  # 重试当前批次
                else:
                    break
            except Exception as e:
                print(f"发送数据时发生未知错误: {e}")
                break
    
    print(f"成功创建 {total_sent} 条记录")

def main():
    if not API_KEY:
        print("错误：未设置 VIKA_API_KEY 环境变量")
        return

    print("开始处理...")
    
    # 加载JSON文件
    ranked_plugins = load_json_file('zh-cn/ranked_plugins.json')
    directory = load_json_file('zh-cn/directory.json')
    
    print(f"ranked_plugins.json 包含 {len(ranked_plugins)} 条记录")
    print(f"directory.json 包含 {len(directory)} 条记录")
    
    # 匹配插件信息
    matched_plugins = match_plugin_info(ranked_plugins, directory)
    
    # 发送到Vika
    send_to_vika(matched_plugins)
    
    print("处理完成！")

if __name__ == "__main__":
    main()