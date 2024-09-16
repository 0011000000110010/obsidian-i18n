import os
import json

def update_directory():
    zh_cn_path = 'zh-cn'
    plugins_path = os.path.join(zh_cn_path, 'plugins')
    directory_file = os.path.join(zh_cn_path, 'directory.json')
    
    print(f"正在读取 {directory_file}")
    with open(directory_file, 'r', encoding='utf-8') as f:
        directory = json.load(f)
    
    # 创建一个字典来存储id到条目的映射
    id_to_entry = {item['id']: item for item in directory}
    
    for plugin_id in os.listdir(plugins_path):
        plugin_path = os.path.join(plugins_path, plugin_id)
        if os.path.isdir(plugin_path):
            print(f"正在处理插件: {plugin_id}")
            json_files = [f for f in os.listdir(plugin_path) if f.endswith('.json')]
            for json_file in json_files:
                file_path = os.path.join(plugin_path, json_file)
                print(f"  处理文件: {file_path}")
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if 'manifest' in data:
                    manifest = data['manifest']
                    translation_info = {
                        "author": manifest.get('author', ''),
                        "translationVersion": manifest.get('version', ''),
                        "pluginVersion": manifest.get('pluginVersion', '')
                    }
                    print(f"  提取的信息: {translation_info}")
                    
                    if plugin_id in id_to_entry:
                        translations = id_to_entry[plugin_id].get('translations', [])
                        # 检查是否已存在相同pluginVersion的译文
                        existing = next((t for t in translations if t['pluginVersion'] == translation_info['pluginVersion']), None)
                        if existing:
                            existing.update(translation_info)
                            print(f"  更新了现有译文: {plugin_id} - {translation_info['pluginVersion']}")
                        else:
                            translations.append(translation_info)
                            print(f"  添加了新译文: {plugin_id} - {translation_info['pluginVersion']}")
                        id_to_entry[plugin_id]['translations'] = translations
                    else:
                        new_entry = {
                            "id": plugin_id,
                            "translations": [translation_info]
                        }
                        directory.append(new_entry)
                        id_to_entry[plugin_id] = new_entry
                        print(f"  添加了新条目: {plugin_id}")
                else:
                    print(f"  警告: {file_path} 中没有找到 'manifest' 键")
    
    # 按照id的内容进行排序
    directory.sort(key=lambda x: x['id'].lower())
    
    print(f"正在写入更新后的 {directory_file}")
    with open(directory_file, 'w', encoding='utf-8') as f:
        json.dump(directory, f, ensure_ascii=False, indent=4)
    
    print("更新完成")

update_directory()