import os
import json

def update_directory():
    zh_cn_path = 'zh-cn'
    plugins_path = os.path.join(zh_cn_path, 'plugins')
    directory_file = os.path.join(zh_cn_path, 'directory.json')
    
    print(f"正在读取 {directory_file}")
    # 读取现有的directory.json
    with open(directory_file, 'r', encoding='utf-8') as f:
        directory = json.load(f)
    
    # 创建一个字典来存储id到索引的映射
    id_to_index = {item['id']: index for index, item in enumerate(directory)}
    
    # 遍历zh-cn/plugins目录下的所有子目录
    for plugin_id in os.listdir(plugins_path):
        plugin_path = os.path.join(plugins_path, plugin_id)
        if os.path.isdir(plugin_path):
            print(f"正在处理插件: {plugin_id}")
            # 获取插件目录下的JSON文件
            json_files = [f for f in os.listdir(plugin_path) if f.endswith('.json')]
            if json_files:
                json_file = os.path.join(plugin_path, json_files[0])
                print(f"  找到JSON文件: {json_file}")
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if 'manifest' in data:
                    manifest = data['manifest']
                    translation_info = {
                        "author": manifest.get('author', ''),
                        "translationVersion": manifest.get('version', ''),
                        "pluginVersion": manifest.get('pluginVersion', '')
                    }
                    print(f"  提取的信息: {translation_info}")
                    
                    # 更新或添加到directory
                    if plugin_id in id_to_index:
                        directory[id_to_index[plugin_id]]['translations'] = [translation_info]
                        print(f"  更新了现有条目: {plugin_id}")
                    else:
                        directory.append({
                            "id": plugin_id,
                            "translations": [translation_info]
                        })
                        print(f"  添加了新条目: {plugin_id}")
                else:
                    print(f"  警告: {json_file} 中没有找到 'manifest' 键")
            else:
                print(f"  警告: {plugin_path} 中没有找到JSON文件")
    
    print(f"正在写入更新后的 {directory_file}")
    # 将更新后的directory写回文件
    with open(directory_file, 'w', encoding='utf-8') as f:
        json.dump(directory, f, ensure_ascii=False, indent=4)
    
    print("更新完成")

update_directory()