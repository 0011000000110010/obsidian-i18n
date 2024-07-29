import * as path from 'path';
import * as fs from 'fs-extra';

import { App, Notice, Plugin, PluginManifest } from 'obsidian';

import { DEFAULT_SETTINGS, I18nSettings } from './settings/data';
import { I18nSettingTab } from './settings/ui';
import { EDIT_VIEW_TYPE, EditView } from './views/view';
import { Translation } from './data/types';
import { t } from './lang/inxdex';

import { State } from './utils';
import { I18NModal } from './modal/i18n-modal';
import { ConvertModal } from './modal/i18n-convert';

// ==============================
//          [入口] I18n
// ==============================
export default class I18N extends Plugin {
    // [变量] 总配置文件
    settings: I18nSettings;
    dangqianchajian: string = '';

    // 当Obsidian启动时默认调用
    async onload() {
        console.log(`%c ${this.manifest.name} %c v${this.manifest.version} `,
            `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: #5B5B5B;`,
            `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: #409EFF;`,
        );
        // 加载配置
        await this.loadSettings();

        // [函数] 自动更新
        if (this.settings.I18N_AUTOMATIC_UPDATE) this.i18nAutomaticUpdate(this.app);
        // [函数] 译文编辑
        if (this.settings.I18N_EDIT_MODE) this.serve();

        // [功能] 翻译
        this.addRibbonIcon('globe-2', '翻译', (evt: MouseEvent) => { new I18NModal(this.app, this).open(); });
        // [功能] 转换
        if (this.settings.I18N_CONVERT_MODE) this.addRibbonIcon('arrow-left-right', '转换', () => { new ConvertModal(this.app, this).open(); });

        // [视图] 编辑器
        this.registerView(EDIT_VIEW_TYPE, (leaf) => new EditView(leaf));

        // 状态栏
        // this.addStatusBarItem().setText(`[模式] ${mode[this.settings.I18N_MODE]}`);
        
        // [设置]
        this.addSettingTab(new I18nSettingTab(this.app, this));

    }

    // 命周期函数在插件被禁用时触发。
    async onunload() {
        // 卸载编辑视图
        this.app.workspace.detachLeavesOfType(EDIT_VIEW_TYPE);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
    // 激活译文编辑视图
    async activateEditView() {
        this.app.workspace.detachLeavesOfType(EDIT_VIEW_TYPE);
        await this.app.workspace.getRightLeaf(false).setViewState({
            type: EDIT_VIEW_TYPE,
            active: true,
        });
        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(EDIT_VIEW_TYPE)[0]
        );
    }

    // 自动更新插件
    i18nAutomaticUpdate = (app: App) => {
        let plugins: PluginManifest[] = [];
        new Notice('开始检查更新');
        plugins = Object.values(app.plugins.manifests);
        plugins = plugins.filter(item => item.id !== 'i18n');
        plugins.sort((item1, item2) => { return item1.name.localeCompare(item2.name) });
        let updateitem = 0;

        for (const plugin of plugins) {
            const pluginDir = path.join(path.normalize(app.vault.adapter.getBasePath()), plugin.dir ?? '');

            const langDir = path.join(pluginDir, 'lang');
            const langDoc = path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`);
            const stateDoc = path.join(pluginDir, 'lang', 'state.json');

            const isLangDir = fs.pathExistsSync(langDir);
            // const isLangDoc = fs.pathExistsSync(langDoc);
            let isStateDoc = fs.pathExistsSync(stateDoc);

            const mainDoc = path.join(pluginDir, 'main.js');
            const duplicateDoc = path.join(pluginDir, 'duplicate.js');

            // 创建状态文件对象
            const stateObj = new State(stateDoc);
            // 当状态文件不存在时创建状态文件
            if (isLangDir && !isStateDoc) {
                try {
                    stateObj.insert();
                    isStateDoc = fs.pathExistsSync(stateDoc);
                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
            }

            // 当运行到这里面的时候也就是意味着插件已经更新了
            if (isStateDoc && stateObj.state() && plugin.version != stateObj.pluginVersion()) {
                try {
                    // 加数量
                    updateitem = updateitem + 1;
                    // =====还原插件=====
                    // 1. 删除备份文件
                    fs.removeSync(duplicateDoc);
                    // 2. 重置状态
                    stateObj.reset();
                    // =====翻译插件=====
                    // 1. 复制备份文件
                    fs.copySync(mainDoc, duplicateDoc);
                    // 2. 读取译文
                    const translationJson = fs.readJsonSync(langDoc);
                    // 3. 读取 main.js
                    let mainString = fs.readFileSync(mainDoc).toString();
                    // 4. 翻译 main.js
                    for (const key in translationJson.dict) mainString = mainString.replaceAll(key, translationJson.dict[key]);
                    // 5. 写入 main.js
                    fs.writeFileSync(mainDoc, mainString);
                    // 6. 更新状态
                    stateObj.update(true, plugin.version, translationJson.manifest.version);
                    new Notice(t('TRANSLATE_NPTICE'));

                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
            }
        }
        if (updateitem == 0) {
            new Notice(`没有需要更新的插件`);
        } else {
            new Notice(`自动更新${updateitem}个插件`);
        }

    }
    // 本地服务器
    serve() {
        try {
            const http = require('http');
            const host = '127.0.0.1';
            const port = 3000;
            // 1. 创建本地服务器
            const server = http.createServer(async (req: any, res: any) => {
                // 2. 添加请求头
                res.setHeader('Access-Control-Allow-Origin', 'https://0011000000110010.github.io');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
                // 3. 验证
                if (req.method === 'OPTIONS') {
                    res.writeHead(204);
                    res.end();
                    return;
                }
                const method = req.method;
                const url = req.url;
                const path = url.split('?')[0];
                let translationJson: Translation;
                // 4. 创建请求
                if (method === 'GET' && path === '/api/plugin/get') {
                    console.log(this.dangqianchajian)
                    // 1. 获取译文JSON
                    const translationString = fs.readFileSync(this.dangqianchajian);
                    // 2. 返回状态码
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    // 3. 返回数据
                    res.end(translationString);
                } else if (method === 'POST' && path === '/api/plugin/save') {
                    try {
                        req.on('data', (chunk: Translation) => {
                            translationJson = JSON.parse(chunk.toString())
                            fs.writeJSONSync(this.dangqianchajian, translationJson, { spaces: 4 });
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'JSON received successfully' }));
                    } catch (err) {
                        console.error('Error parsing JSON:', err);
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end('Bad Request: Invalid JSON');
                    }
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                }
            });
            server.listen(port, host, () => {
                console.log(`Server running at http://${host}:${port}/`);
            });
        } catch (error) {
            new Notice(`⚠ ${error}`);
            console.error(`⚠ ${error}`);
        }
    }
}

