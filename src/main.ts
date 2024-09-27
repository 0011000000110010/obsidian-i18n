import * as path from 'path';
import * as fs from 'fs-extra';

import { App, Plugin, PluginManifest, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, I18nSettings } from './settings/data';
import { I18nSettingTab } from './settings/ui';
import { t } from './lang/inxdex';

import { NoticeError, NoticeOperationResult, NoticeSuccess, NoticeWarning, State } from './utils';
import { I18NModal } from './modal/i18n-modal';
import { WizardModal } from './modal/i18n-wizard-modal';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { API } from './api';
import { Manifest } from './data/types';
import Icons from './icon';
import { EDIT_VIEW_TYPE, EditView } from './views/view';


// ==============================
//          [入口] I18n
// ==============================
export default class I18N extends Plugin {
    // [变量] 总配置文件
    settings: I18nSettings;
    api: API;
    directory: Manifest[];
    directoryMark = true;
    ignorePlugins: string[];
    ignoreMark = true;
    tempSubmitUrl: string | undefined;
    // 选中译文地址
    selectTranslation: string = '';

    // 当Obsidian启动时默认调用
    async onload() {
        console.log(`%c ${this.manifest.name} %c v${this.manifest.version} `, `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: #5B5B5B;`, `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: #409EFF;`);

        // [加载] 图标
        Icons();
        // [加载] 配置
        await this.loadSettings();
        // [加载] API
        this.api = new API(this);
        // [函数] 首次运行
        this.firstRun();
        // [函数] 检测更新
        this.checkUpdates();

        // [函数] 读取提交地址
        const temp = await this.api.submitUrl();
        if (temp != undefined) this.tempSubmitUrl = atob(temp);

        // [函数] 云端标记插件
        await this.ignoreCache();
        // [函数] 云端目录缓存
        await this.directoryCache();

        // [函数] 自动更新
        if (this.settings.I18N_MODE_LDT && this.settings.I18N_AUTOMATIC_UPDATE) await this.i18nAutomaticUpdate(this.app);

        // [功能] 翻译
        const translateIcon = this.addRibbonIcon('i18n_translate', t('I18N_NAME'), (evt: MouseEvent) => { new I18NModal(this.app, this).open() });
        const sideDock = translateIcon.parentNode;
        sideDock?.appendChild(translateIcon); // appendChild prepend

        // [视图] 编辑器
        this.registerView(EDIT_VIEW_TYPE, (leaf) => new EditView(leaf, this));
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

    async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }

    async saveSettings() { await this.saveData(this.settings); }

    async firstRun() {
        if (this.settings.I18N_WIZARD) {
            new WizardModal(this.app, this).open();
            this.settings.I18N_UUID = uuidv4();
            this.settings.I18N_WIZARD = false;
            this.saveSettings();
        }
    }

    async checkUpdates() { this.api.version(this.manifest.version) }

    async ignoreCache() {
        if (!this.settings.I18N_MODE_NDT || !this.settings.I18N_IGNORE) { this.ignoreMark = false; return; }
        if (!(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS)) { NoticeOperationResult(t('SETTING_NDT_PUBLIC_IGNORE_HEAD'), false, t('SETTING_NDT_IGNORE_NOTICE_A')); this.ignoreMark = false; return; }
        if (!await this.api.ignoreTest()) { this.ignoreMark = false; NoticeOperationResult(t('SETTING_NDT_PUBLIC_IGNORE_HEAD'), false, t('SETTING_NDT_IGNORE_NOTICE_B')); return; }
        try { this.ignorePlugins = await this.api.ignore(); NoticeOperationResult(t('SETTING_NDT_PUBLIC_IGNORE_HEAD'), true); }
        catch (error) { this.ignoreMark = false; NoticeOperationResult(t('SETTING_NDT_PUBLIC_IGNORE_HEAD'), false, error); }
    }

    async directoryCache() {
        if (!this.settings.I18N_MODE_NDT) { this.directoryMark = false; return; }
        if (!(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS)) { this.directoryMark = false; NoticeOperationResult(t('SETTING_NDT_PUBLIC_MODE_HEAD'), false, t('SETTING_NDT_MODE_NOTICE_A')); return; }
        if (!await this.api.directoryTest()) { this.directoryMark = false; NoticeOperationResult(t('SETTING_NDT_PUBLIC_MODE_HEAD'), false, t('SETTING_NDT_MODE_NOTICE_B')); return; }
        try { this.directory = await this.api.directory(); NoticeOperationResult(t('SETTING_NDT_PUBLIC_MODE_HEAD'), true); }
        catch (error) { this.directoryMark = false; NoticeOperationResult(t('SETTING_NDT_PUBLIC_MODE_HEAD'), false, error); }
    }

    async i18nAutomaticUpdate(app: App) {
        if (this.settings.I18N_MODE_LDT && this.settings.I18N_AUTOMATIC_UPDATE) {
            let plugins: PluginManifest[] = [];
            NoticeSuccess(t('SETTING_LDT_PUBLIC_AUTOMATIC_UPDATE_HEAD'), t('SETTING_LDT_AUTOMATIC_UPDATE_NOTICE_A'));
            // @ts-ignore
            plugins = Object.values(app.plugins.manifests).filter(item => item.id !== 'i18n');
            let updateitem = 0;
            for (const plugin of plugins) {
                // @ts-ignore
                const pluginDir = path.join(path.normalize(app.vault.adapter.getBasePath()), plugin.dir ?? '');
                const stateObj = fs.pathExistsSync(path.join(pluginDir, 'lang', 'state.json')) ? new State(path.join(pluginDir, 'lang', 'state.json')) : undefined;
                // 当运行到这里面的时候也就是意味着插件已经更新了
                if (stateObj != undefined && stateObj.state() && plugin.version != stateObj.pluginVersion()) {
                    try {
                        // 加数量
                        updateitem = updateitem + 1;
                        // =====还原插件=====
                        // 1. 删除备份文件
                        fs.removeSync(path.join(pluginDir, 'duplicate.js'));
                        // 2. 重置状态
                        stateObj.reset();
                        // =====翻译插件=====
                        // 1. 复制备份文件
                        fs.copySync(path.join(pluginDir, 'main.js'), path.join(pluginDir, 'duplicate.js'));
                        // 2. 读取译文
                        const translationJson = fs.readJsonSync(path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`));
                        // 3. 读取 main.js
                        let mainString = fs.readFileSync(path.join(pluginDir, 'main.js')).toString();
                        // 4. 翻译 main.js
                        for (const key in translationJson.dict) mainString = mainString.replaceAll(key, translationJson.dict[key]);
                        // 5. 写入 main.js
                        fs.writeFileSync(path.join(pluginDir, 'main.js'), mainString);
                        // 6. 读取 manifest.json
                        const manifestJSON = fs.readJsonSync(path.join(pluginDir, 'manifest.json'));
                        // 7. 翻译 manifest.json
                        manifestJSON.description = translationJson.description.translation;
                        // 8. 写入 manifest.json
                        fs.writeJsonSync(path.join(pluginDir, 'manifest.json'), manifestJSON, { spaces: 4 });
                        // 9. 更新状态文件
                        stateObj.update(true, plugin.version, translationJson.manifest.version);
                        // 10. 重启
                        // @ts-ignore
                        await this.app.plugins.disablePlugin(plugin.id);
                        // @ts-ignore
                        await this.app.plugins.enablePlugin(plugin.id);
                    } catch (error) {
                        NoticeError(t('SETTING_LDT_PUBLIC_AUTOMATIC_UPDATE_HEAD'), error);
                    }
                }
            }
            updateitem == 0 ? NoticeSuccess(t('SETTING_LDT_PUBLIC_AUTOMATIC_UPDATE_HEAD'), t('SETTING_LDT_AUTOMATIC_UPDATE_NOTICE_B')) : NoticeSuccess(t('SETTING_LDT_PUBLIC_AUTOMATIC_UPDATE_HEAD'), `更新${updateitem}个插件`)
        }
    }

    async activateEditView() {
        const { workspace } = this.app;
        // 清空
        await this.detachEditView();
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(EDIT_VIEW_TYPE);

        if (leaves.length > 0) {
            // 具有我们视图的叶子已经存在，请使用它
            leaf = leaves[0];
        } else {
            // 在工作区中找不到我们的视图，请创建一个新的叶子 在右侧边栏中
            leaf = workspace.getLeaf('window'); // 'window' true
            if (leaf != null) await leaf.setViewState({ type: EDIT_VIEW_TYPE, active: true });
        }
        if (leaf != null) workspace.revealLeaf(leaf); // “显示”叶子，以防它在折叠的侧边栏中
    }

    async detachEditView() { this.app.workspace.detachLeavesOfType(EDIT_VIEW_TYPE) }
}

