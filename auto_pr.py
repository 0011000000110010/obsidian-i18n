import json
import os
import subprocess
import requests

GITEE_API_BASE = "https://gitee.com/api/v5"
REPO_OWNER = "zero--two"
REPO_NAME = "obsidian-i18n-translation"

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
    return subprocess.run(command, shell=True, check=True, capture_output=True, text=True)

def branch_exists(branch_name):
    result = git_command(f"git ls-remote --heads origin {branch_name}")
    return bool(result.stdout.strip())

def create_pull_request(info, issue_number):
    url = f"{GITEE_API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/pulls"
    
    branch_name = f"{info['id']}-{info['pluginVersion']}-{info['version']}-{info['author']}"
    
    payload = {
        "access_token": os.environ['GITEE_ACCESS_TOKEN'],
        "title": branch_name,
        "head": f"ob-i18n/obsidian-i18n-translation:{branch_name}",
        "base": "master",
        "body": f"关联 issue: #{issue_number}"  # 添加这一行来关联 issue
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 201:
        print(f"Pull request 创建成功，已关联 issue #{issue_number}")
    else:
        print(f"创建 Pull request 失败，状态码：{response.status_code}")
        print(f"错误信息：{response.text}")

def process_issues():
    issues = get_issues()
    for issue in issues:
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
            
            directory = f'zh-cn/plugins/{info["id"]}'
            os.makedirs(directory, exist_ok=True)
            
            file_path = f'{directory}/{info["pluginVersion"]}.json'
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(body, f, ensure_ascii=False, indent=2)
            
            print(f'已保存: {file_path}')
            
            git_command(f"git checkout -b {branch_name}")
            git_command(f"git add {file_path}")
            git_command(f'git commit -m "Add {info["id"]} version {info["pluginVersion"]}"')
            git_command(f'git push -u origin {branch_name}')
            
            create_pull_request(info, issue['number'])  # 传入 issue 编号
            
            git_command("git checkout master")

if __name__ == "__main__":
    process_issues()