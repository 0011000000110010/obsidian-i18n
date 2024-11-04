import os
import requests
import zipfile
import io

# Gitee 和 GitHub 的信息
GITEE_REPO = 'zero--two/obsidian-i18n-translation'
GITHUB_REPO = '0011000000110010/obsidian-i18n'
GITHUB_TOKEN = os.environ.get('secret.GITHUB_TOKEN')  # 用于身份验证

# 检查 GitHub 上是否存在同名的 Release
def check_existing_release(release_name):
    existing_releases_url = f'https://api.github.com/repos/{GITHUB_REPO}/releases'
    existing_releases_response = requests.get(existing_releases_url, headers={'Authorization': f'token {GITHUB_TOKEN}'})
    
    try:
        existing_releases_response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print(f'检查现有 Release 时出错: {e}')
        return False  # 返回 False 表示检查失败
    
    existing_releases = existing_releases_response.json()
    
    # 检查是否存在同名的 Release
    for release in existing_releases:
        if release['name'] == release_name:
            print(f'错误: 已存在同名的 Release: {release_name}，不执行下载操作。')
            return True  # 返回 True 表示存在同名 Release
    
    return False  # 返回 False 表示不存在同名 Release

# 下载 Gitee Release
def download_gitee_release():
    url = f'https://gitee.com/api/v5/repos/{GITEE_REPO}/releases/latest'
    response = requests.get(url)
    response.raise_for_status()  # 检查请求是否成功
    release_data = response.json()
    
    # 获取 Release 名称
    release_name = release_data.get('name', 'Latest Release')
    
    # 创建子目录以存放下载的文件
    download_dir = f'downloads/{release_name}'
    os.makedirs(download_dir, exist_ok=True)  # 创建目录，如果已存在则不报错
    
    # 获取 Release 中的资产
    assets = release_data.get('assets', [])
    downloaded_files = []  # 用于记录下载的文件名
    for asset in assets:
        download_url = asset['browser_download_url']
        file_name = asset['name']
        
        # 只下载非源代码文件
        if not (file_name.endswith('.zip') or file_name.endswith('.tar.gz')):
            print(f'正在下载 {file_name}...')
            file_response = requests.get(download_url)
            file_response.raise_for_status()
            
            # 保存文件到子目录
            file_path = os.path.join(download_dir, file_name)
            with open(file_path, 'wb') as f:
                f.write(file_response.content)
            print(f'{file_name} 下载完成。')
            downloaded_files.append(file_path)  # 记录下载的文件路径
        else:
            print(f'跳过源代码文件 {file_name}。')
    
    return release_name, downloaded_files  # 返回 Release 名称和下载的文件路径列表

# 上传到 GitHub
def upload_to_github(release_name, downloaded_files):
    # 创建新的 GitHub Release
    create_release_url = f'https://api.github.com/repos/{GITHUB_REPO}/releases'
    release_data = {
        'tag_name': release_name,  # 使用 Release 名称作为标签
        'name': release_name,
        'body': f'Release {release_name} from Gitee',
        'draft': False,
        'prerelease': False
    }
    
    release_response = requests.post(create_release_url, json=release_data, headers={'Authorization': f'token {GITHUB_TOKEN}'})
    
    # 添加错误处理
    try:
        release_response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print(f'创建 Release 时出错: {e}')
        return  # 退出函数，避免后续代码执行
    
    release_id = release_response.json()['id']
    
    # 上传下载的文件
    for file_path in downloaded_files:
        file_name = os.path.basename(file_path)  # 获取文件名
        print(f'正在上传 {file_name} 到 GitHub...')
        with open(file_path, 'rb') as f:
            upload_response = requests.post(
                f'https://uploads.github.com/repos/{GITHUB_REPO}/releases/{release_id}/assets?name={file_name}',
                headers={
                    'Authorization': f'token {GITHUB_TOKEN}',
                    'Content-Type': 'application/octet-stream'
                },
                data=f
            )
            upload_response.raise_for_status()  # 检查上传是否成功
        print(f'{file_name} 上传完成。')

if __name__ == '__main__':
    release_name, downloaded_files = download_gitee_release()  # 获取 Release 名称和下载的文件路径
    if not check_existing_release(release_name):  # 检查是否存在同名 Release
        upload_to_github(release_name, downloaded_files)  # 上传下载的文件并同步 Release 名称