import * as path from 'path';
import * as fs from 'fs-extra';

import { addIcon, App, Notice, Plugin, PluginManifest } from 'obsidian';
import { DEFAULT_SETTINGS, I18nSettings } from './settings/data';
import { I18nSettingTab } from './settings/ui';
import { t } from './lang/inxdex';

import { NoticeOperationResult, NoticeWarning, State } from './utils';
import { I18NModal } from './modal/i18n-modal';
import { WizardModal } from './modal/wizard-modal';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { API } from './api';
import { Manifest } from './data/types';


// ==============================
//          [入口] I18n
// ==============================
export default class I18N extends Plugin {
    // [变量] 总配置文件
    settings: I18nSettings;
    currentPlugin = '';
    api: API;
    directory: Manifest[];
    ignorePlugins: string[];
    directoryMark = true;
    ignoreMark = true;

    // 当Obsidian启动时默认调用
    async onload() {
        console.log(`%c ${this.manifest.name} %c v${this.manifest.version} `,
            `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: #5B5B5B;`,
            `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: #409EFF;`,
        );
        // 颜色 b3b3b3 孙裕汶 "translate"icon
        addIcon("cloud-upload", `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-upload"><path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/></svg>`);
        addIcon("circle-help", `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-help"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`);
        addIcon("i18n_translate", `<svg t="1726147647142" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5625" width="100" height="100"><path d="M213.333333 640v85.333333a85.333333 85.333333 0 0 0 78.933334 85.077334L298.666667 810.666667h128v85.333333H298.666667a170.666667 170.666667 0 0 1-170.666667-170.666667v-85.333333h85.333333z m554.666667-213.333333l187.733333 469.333333h-91.946666l-51.242667-128h-174.506667l-51.157333 128h-91.904L682.666667 426.666667h85.333333z m-42.666667 123.093333L672.128 682.666667h106.325333L725.333333 549.76zM341.333333 85.333333v85.333334h170.666667v298.666666H341.333333v128H256v-128H85.333333V170.666667h170.666667V85.333333h85.333333z m384 42.666667a170.666667 170.666667 0 0 1 170.666667 170.666667v85.333333h-85.333333V298.666667a85.333333 85.333333 0 0 0-85.333334-85.333334h-128V128h128zM256 256H170.666667v128h85.333333V256z m170.666667 0H341.333333v128h85.333334V256z" p-id="5626" fill="#b3b3b3"></path></svg>`);
        addIcon("i18n_qq", `<svg t="1726285705266" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4293" width="100" height="100"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" p-id="4294" fill="#dadada"></path></svg>`);

        // [加载] 配置
        await this.loadSettings();
        // [加载] API
        this.api = new API(this);
        // [函数] 首次运行
        this.firstRun();

        // [函数] 云端忽略插件缓存
        await this.ignoreCache();
        // [函数] 云端目录缓存
        await this.directoryCache();

        // [函数] 自动更新
        // if (this.settings.I18N_AUTOMATIC_UPDATE) this.i18nAutomaticUpdate(this.app);

        // [功能] 翻译
        this.addRibbonIcon('i18n_translate', '翻译', (evt: MouseEvent) => { new I18NModal(this.app, this).open(); });
        // [视图] 编辑器
        // this.registerView(EDIT_VIEW_TYPE, (leaf) => new EditView(leaf));
        // 状态栏
        // this.addStatusBarItem().setText(`[模式] ${mode[this.settings.I18N_MODE]}`);
        // [设置]
        this.addSettingTab(new I18nSettingTab(this.app, this));

    }

    // 命周期函数在插件被禁用时触发。
    async onunload() {
        // 卸载编辑视图
        // this.app.workspace.detachLeavesOfType(EDIT_VIEW_TYPE);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
    // 缓存 忽略插件
    async ignoreCache() {
        if (this.settings.I18N_IGNORE && !(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS)) NoticeWarning('忽略插件', `当前语言 API 不存在`);
        // 测试获取译文字典
        const ignoreTest = await this.api.ignoreTest();
        // 获取忽略插件
        if (this.settings.I18N_IGNORE && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS && ignoreTest) {
            try {
                this.ignorePlugins = await this.api.ignore();
                console.log(this.ignorePlugins)
                NoticeOperationResult('忽略插件', true);
            } catch (error) {
                this.ignoreMark = false;
                NoticeOperationResult('忽略插件', false, error);
            }
        } else if (this.settings.I18N_IGNORE && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS && !ignoreTest) {
            this.ignoreMark = false;
            NoticeOperationResult('忽略插件', false, '网络异常');
        } else {
            this.ignoreMark = false;
        }

    }

    // 缓存 云端目录
    async directoryCache() {
        if (this.settings.I18N_MODE_NDT && !(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS)) NoticeWarning('云端模式', `当前语言 API 不存在`);
        // 测试获取译文字典
        const directoryTest = await this.api.directoryTest();
        if (this.settings.I18N_MODE_NDT && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS && directoryTest) {
            try {
                this.directory = await this.api.directory();
                NoticeOperationResult('云端模式', true);
            } catch (error) {
                this.directoryMark = false;
                NoticeOperationResult('云端模式', false, error);
            }
        } else if (this.settings.I18N_MODE_NDT && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS && !directoryTest) {
            this.directoryMark = false;
            NoticeOperationResult('云端模式', false, '网络异常');
        } else {
            this.directoryMark = false;
        }
    }

    // 首次运行
    firstRun() {
        if (this.settings.I18N_WIZARD) {
            new WizardModal(this.app, this).open();
            this.settings.I18N_UUID = uuidv4();
            this.settings.I18N_WIZARD = false;
            this.saveSettings();
        }
    }

    // 自动更新插件(失效)
    i18nAutomaticUpdate = (app: App) => {
        let plugins: PluginManifest[] = [];
        new Notice('开始检查更新');
        // @ts-ignore
        plugins = Object.values(app.plugins.manifests);
        plugins = plugins.filter(item => item.id !== 'i18n');
        plugins.sort((item1, item2) => { return item1.name.localeCompare(item2.name) });
        let updateitem = 0;

        for (const plugin of plugins) {
            // @ts-ignore
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

}

