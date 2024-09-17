import json
import os
import subprocess
import requests
import time

GITEE_API_BASE = "https://gitee.com/api/v5"
REPO_OWNER = "zero--two"
REPO_NAME = "obsidian-i18n-translation"
FORK_OWNER = "ob-i18n"  # 假设这是您的 Gitee 用户名

# 获取脚本所在目录的路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# 获取项目根目录的路径
ROOT_DIR = os.path.dirname(SCRIPT_DIR)

def unescape_json(escaped_json):
    try:
        return json.loads(escaped_json)
    except json.JSONDecodeError:
        try:
            return json.loads(json.loads(f'"{escaped_json}"'))
        except json.JSONDecodeError as e:
            print(f"无法解析 JSON: {e}")
            return escaped_json

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

def git_command(command):
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True, cwd=ROOT_DIR)
        print(f"执行命令: {command}")
        print(f"输出: {result.stdout}")
        return result
    except subprocess.CalledProcessError as e:
        print(f"命令执行失败: {command}")
        print(f"错误输出: {e.stderr}")
        raise

def branch_exists(branch_name):
    result = git_command(f"git ls-remote --heads origin {branch_name}")
    return bool(result.stdout.strip())

def create_pull_request(pr_type, info, issue_number, branch_name=None):
    url = f"{GITEE_API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/pulls"
    
    if pr_type in ["提交译文", "提交修改"]:
        branch_name = f"{info['id']}-{info['pluginVersion']}-{info['version']}-{info['author']}"
        title = f"[{pr_type}] {branch_name}"
    elif pr_type == "标记汉化":
        if not branch_name:
            raise ValueError("标记汉化类型的 PR 必须提供 branch_name")
        title = f"[标记汉化] {info['id']}自带中文"
    else:
        raise ValueError(f"未知的 PR 类型: {pr_type}")
    
    payload = {
        "access_token": os.environ['GITEE_ACCESS_TOKEN'],
        "title": title,
        "head": f"{FORK_OWNER}:{branch_name}",
        "base": "master",
        "body": f"关联 issue: #{issue_number}" if issue_number != "N/A" else f"更新 ignore.json，添加 {info['id']}",
        "prune_source_branch": "true",
        "close_related_issue": "true" if issue_number != "N/A" else "false"
    }
    
    print(f"创建 PR 的请求数据: {payload}")
    
    max_retries = 3
    for attempt in range(max_retries):
        response = requests.post(url, json=payload)
        
        if response.status_code == 201:
            print(f"Pull request 创建成功: {title}")
            return
        elif response.status_code == 400 and "已存在具有相同源分支的 PR" in response.text:
            print(f"已存在相同的 PR，跳过创建")
            return
        elif response.status_code == 400 and "源分支不存在" in response.text:
            print(f"尝试 {attempt + 1}/{max_retries}: 源分支可能还未同步，等待 5 秒后重试...")
            time.sleep(5)
        else:
            print(f"创建 Pull request 失败，状态码：{response.status_code}")
            print(f"错误信息：{response.text}")
            return
    
    print(f"在 {max_retries} 次尝试后仍未能创建 Pull request")

def sync_with_upstream():
    print("正在同步仓库与上游...")
    try:
        # 添加上游仓库（如果还没有添加）
        git_command("git remote add upstream https://gitee.com/zero--two/obsidian-i18n-translation.git")
    except subprocess.CalledProcessError:
        # 如果上游仓库已经存在，忽略错误
        pass

    # 获取上游的最新变更
    git_command("git fetch upstream")

    # 切换到主分支
    git_command("git checkout master")

    # 合并上游的变更
    git_command("git merge upstream/master")

    # 推送到自己的远程仓库
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
        
        if "提交译文" in title or "提交修改" in title:
            pr_type = "提交译文" if "提交译文" in title else "提交修改"
            body_escaped = issue['body']
            body = unescape_json(body_escaped)
            
            manifest = body.get('manifest', {})
            info = {
                'id': manifest.get('id', ''),
                'pluginVersion': manifest.get('pluginVersion', ''),
                'version': manifest.get('version', ''),
                'author': manifest.get('author', '')
            }
            
            if info['id'] and info['pluginVersion']:
                branch_name = f"{info['id']}-{info['pluginVersion']}-{info['version']}-{info['author']}"
                
                if branch_exists(branch_name):
                    print(f"分支已存在，跳过 {info['id']} 版本 {info['pluginVersion']}")
                    continue
                
                directory = os.path.join('zh-cn', 'plugins', info['id'])
                os.makedirs(os.path.join(ROOT_DIR, directory), exist_ok=True)
                
                file_path = os.path.join(directory, f"{info['pluginVersion']}.json")
                full_file_path = os.path.join(ROOT_DIR, file_path)
                with open(full_file_path, 'w', encoding='utf-8') as f:
                    json.dump(body, f, ensure_ascii=False, indent=2)
                
                print(f'已保存: {full_file_path}')
                
                git_command(f"git checkout -b {branch_name}")
                git_command(f"git add {file_path}")
                git_command(f'git commit -m "Add {info["id"]} version {info["pluginVersion"]}"')
                git_command(f'git push -u origin {branch_name}')
                
                create_pull_request(pr_type, info, issue['number'])
                
                git_command("git checkout master")
        elif "标记汉化" in title:
            body_escaped = issue['body']
            body = unescape_json(body_escaped)
            
            plugin_id = body.get('id', '')
            
            if plugin_id:
                new_ignore_ids.append(plugin_id)
                print(f"添加插件 ID 到忽略列表: {plugin_id}")
                
                # 为每个"标记汉化"的插件创建单独的分支和PR
                updated_ignore_list = update_ignore_file([plugin_id])
                print(f"更新后的忽略列表: {updated_ignore_list}")

                branch_name = f"ignore-{plugin_id}"
                
                try:
                    git_command(f"git checkout -b {branch_name}")
                except subprocess.CalledProcessError:
                    print(f"分支 {branch_name} 已存在，切换到该分支")
                    git_command(f"git checkout {branch_name}")
                
                git_command("git add zh-cn/ignore.json")
                try:
                    git_command(f'git commit -m "Add {plugin_id} to ignore.json"')
                except subprocess.CalledProcessError as e:
                    if "nothing to commit" in str(e.stderr):
                        print("没有需要提交的更改")
                        continue
                    else:
                        raise

                git_command(f"git push -u origin {branch_name}")

                # 等待一段时间，确保分支已经同步到远程
                print("等待 5 秒，确保分支同步到远程...")
                time.sleep(5)

                create_pull_request("标记汉化", {'id': plugin_id}, issue['number'], branch_name)

                git_command("git checkout master")
                print(f"已尝试创建 PR 以将 {plugin_id} 添加到 ignore.json")
            else:
                print(f"警告: 无法从 issue 中提取插件 ID（标题：{title}）")
        else:
            print(f"跳过 issue: {title}（不是提交译文、提交修改或标记汉化）")

    if not new_ignore_ids:
        print("没有新的插件 ID 需要添加到忽略列表")

if __name__ == "__main__":
    process_issues()