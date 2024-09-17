import json
import os
import requests
import subprocess

GITEE_API_BASE = "https://gitee.com/api/v5"
REPO_OWNER = "zero--two"
REPO_NAME = "obsidian-i18n-translation"
FORK_OWNER = "ob-i18n"  # 假设这是您的 Gitee 用户名

# 获取脚本所在目录的路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# 获取项目根目录的路径
ROOT_DIR = os.path.dirname(SCRIPT_DIR)

def get_issues():
    url = f"{GITEE_API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/issues"
    params = {
        'access_token': os.environ['GITEE_ACCESS_TOKEN'],
        'state': 'open'
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f'获取 issues 失败，状态码: {response.status_code}')
        return []

def unescape_json(escaped_json):
    try:
        return json.loads(escaped_json)
    except json.JSONDecodeError:
        try:
            return json.loads(json.loads(f'"{escaped_json}"'))
        except json.JSONDecodeError as e:
            print(f"无法解析 JSON: {e}")
            return escaped_json

def git_command(command):
    return subprocess.run(command, shell=True, check=True, capture_output=True, text=True, cwd=ROOT_DIR)

def sync_with_upstream():
    print("正在同步仓库与上游...")
    try:
        git_command("git remote add upstream https://gitee.com/zero--two/obsidian-i18n-translation.git")
    except subprocess.CalledProcessError:
        pass
    git_command("git fetch upstream")
    git_command("git checkout master")
    git_command("git merge upstream/master")
    git_command("git push origin master")
    print("仓库已成功与上游同步")

def update_ignore_file(new_ids):
    ignore_file = os.path.join(SCRIPT_DIR, 'ignore.json')
    if os.path.exists(ignore_file):
        with open(ignore_file, 'r', encoding='utf-8') as f:
            ignore_list = json.load(f)
    else:
        ignore_list = []

    ignore_list.extend(new_ids)
    ignore_list = list(set(ignore_list))  # 去重
    ignore_list.sort()  # 排序

    with open(ignore_file, 'w', encoding='utf-8') as f:
        json.dump(ignore_list, f, ensure_ascii=False, indent=1)

    return ignore_list

def process_issues():
    sync_with_upstream()

    issues = get_issues()
    new_ignore_ids = []

    for issue in issues:
        title = issue['title']
        
        if "标记汉化" in title:
            body_escaped = issue['body']
            body = unescape_json(body_escaped)
            
            plugin_id = body.get('id', '')
            
            if plugin_id:
                new_ignore_ids.append(plugin_id)
                print(f"添加插件 ID 到忽略列表: {plugin_id}")
            else:
                print(f"警告: 无法从 issue 中提取插件 ID（标题：{title}）")

    if new_ignore_ids:
        updated_ignore_list = update_ignore_file(new_ignore_ids)
        print(f"更新后的忽略列表: {updated_ignore_list}")

        # 提交更改
        git_command("git add zh-cn/ignore.json")
        git_command('git commit -m "Update ignore.json with new plugin IDs"')
        git_command("git push origin master")
        print("已提交并推送更改到 ignore.json")
    else:
        print("没有新的插件 ID 需要添加到忽略列表")

if __name__ == "__main__":
    process_issues()