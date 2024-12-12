import * as path from 'path';
import * as fs from 'fs-extra';

import { App, Plugin, PluginManifest, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, I18nSettings } from './settings/data';
import { I18nSettingTab } from './settings';
import { t } from './lang/inxdex';

import { clearStorage, restoreTranslate, State, Notification } from './utils';
import { I18NPluginModal } from './modal/i18n-plugin-modal';
import { WizardModal } from './modal/i18n-wizard-modal';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { API, TranslationAPI } from './api';
import { ImtConfig, NameTranslationJSON, OBThemeManifest, Theme, TranslationDirectory } from './data/types';
import Icons from './icon';
import { EditorView, EDIT_VIEW_TYPE } from './views/editor-view';
import { AgreementModal } from './modal/i18n-agreement-modal';
import Url from './url';
import Commands from './command';
import { SHARE_VIEW_TYPE, ShareView } from './views/share-view';
import { ADMIN_VIEW_TYPE, AdminView } from './views/admin-view';
import { AdminModal } from './modal/i18n-admin-modal';
import { I18NThemeModal } from './modal/i18n-theme-modal';
import { Contributor, Issue } from './data/gitee-types';
import { DOWNLOAD_VIEW_TYPE, DownloadView } from './views/download-view';

declare global {
    interface Window {
        immersiveTranslateConfig: ImtConfig;
    }
}

// ==============================
//          [入口] I18n
// ==============================
export default class I18N extends Plugin {
    // [变量] 总配置文件
    settings: I18nSettings;
    // [变量] API
    api: API;
    // [变量] 翻译API
    tapi: TranslationAPI;
    // [变量] Notice
    notice: Notification;

    // [变量] 是否存在更新标记
    updatesMark = false;
    updatesVersion: string;

    // [变量] 插件目录标记
    pluginDirectoryMark: boolean;
    // [变量] 插件目录缓存列表
    pluginDirectory: TranslationDirectory;
    // [变量] 主题目录标记
    themeDirectoryMark: boolean;
    // [变量] 主题目录缓存列表
    themeDirectory: TranslationDirectory;

    // [变量] 标记汉化标记
    ignoreMark = true;
    // [变量] 标记汉化缓存列表
    ignorePlugins: string[];
    // [变量] 插件贡献者缓存列表
    contributorCache: Contributor[] | undefined;

    // [变量][编辑器] 选中译文地址
    editorType = '';
    editorPath = '';
    // [变量][编辑器] 选中插件地址
    editorState: State;

    // [变量][共享云端] 选中译文对象
    sharePath: string;
    shareType: number;
    shareObj: PluginManifest | OBThemeManifest;

    // [变量][共享云端] 审核
    issue: Issue;
    issues: Issue[];

    // [变量][共享云端] 下载
    downloadType: string;
    downloadPath: string;
    downloadCloudJson: Plugin | Theme;
    downloadLocalJson: Plugin | Theme;
    downloadView: I18NThemeModal | I18NPluginModal;

    nameTranslationJSON: NameTranslationJSON;
    originalPluginsManifests: PluginManifest[];

    i18nReviewEl: HTMLElement;
    admin: AdminModal;
    themeModal: I18NThemeModal;
    pluginModal: I18NPluginModal;

    async onload() {
        const startTime = Date.now();
        // [加载] 图标类
        Icons();
        // [加载] 通知类
        this.notice = new Notification(this.app, this);
        // [加载] 配置 
        await this.loadSettings();
        console.log(`%c ${this.manifest.name} %c v${this.manifest.version} `, `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: #5B5B5B;`, `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: #409EFF;`);
        if (this.settings.I18N_AGREEMENT) {
            // [加载] API类
            this.api = new API(this);
            this.tapi = new TranslationAPI(this);
            // [函数] 首次运行
            this.firstRun();
            // [函数] 检测更新
            if (this.settings.I18N_CHECK_UPDATES) this.checkUpdates();
            // [函数] 云端标记插件
            this.ignoreCache();
            // [函数] 云端插件目录缓存
            this.pliginDirectoryCache();
            // [函数] 云端主题目录缓存
            this.themeDirectoryCache();
            // [函数] 自动更新
            if (this.settings.I18N_MODE_LDT && this.settings.I18N_AUTOMATIC_UPDATE) await this.i18nAutomaticUpdate(this.app);
            // [函数] 沉浸式翻译
            if (this.settings.I18N_MODE_IMT) this.activateIMT();
            // [函数] 审核获取
            // if (this.settings.I18N_ADMIN_VERIFY && this.settings.I18N_ADMIN_MODE) this.getAdmin();
            // const sideDock = translateIcon.parentNode;
            // sideDock?.appendChild(translateIcon); // appendChild prepend
            // [功能] 翻译
            this.addRibbonIcon('i18n_translate', t('通用_I18N_文本'), () => {
                if (this.settings.I18N_MODE === 0) {
                    this.pluginModal = new I18NPluginModal(this.app, this);
                    this.pluginModal.open()
                } else if (this.settings.I18N_MODE === 1) {
                    this.themeModal = new I18NThemeModal(this.app, this);
                    this.themeModal.open()
                }
            });

            // [功能] 审核
            if (this.settings.I18N_ADMIN_VERIFY && this.settings.I18N_ADMIN_MODE) this.i18nReviewEl = this.addRibbonIcon('i18n-review', 'I18N审核', (evt: MouseEvent) => {
                this.admin = new AdminModal(this.app, this)
                this.admin.open();
            });

            // [视图] 审核视图
            this.registerView(ADMIN_VIEW_TYPE, (leaf) => new AdminView(leaf, this));
            // [视图] 编辑器视图
            this.registerView(EDIT_VIEW_TYPE, (leaf) => new EditorView(leaf, this));
            // [视图] 共建云端视图
            this.registerView(SHARE_VIEW_TYPE, (leaf) => new ShareView(leaf, this));
            // [视图] 下载视图
            this.registerView(DOWNLOAD_VIEW_TYPE, (leaf) => new DownloadView(leaf, this));
            // 状态栏
            // this.addStatusBarItem().setText(`[模式] ${mode[this.settings.I18N_MODE]}`);

            // [加载] 功能
            Commands(this.app, this);
            // [函数] 更新设置面板
            if (this.settings.I18N_MODE_LDT && this.settings.I18N_NAME_TRANSLATION) { this.trenslatorPluginsName(); }
            // [设置]
            this.addSettingTab(new I18nSettingTab(this.app, this));
        } else {
            new AgreementModal(this.app, this).open();
        }
        const endTime = Date.now();
        if (this.settings.I18N_START_TIME) {
            this.notice.success(t('设置_基础_启动耗时_标题'), `${((endTime - startTime) / 1000).toFixed(5)}s`);
        }
    }

    async onunload() {
        this.detachAdminView();
        this.detachEditorView();
        this.detachShareView();
        this.detachDownloadView();
        this.restorePluginsName();
        if (this.settings.I18N_MODE_IMT) await this.enableIMT();
    }

    onUserEnable(): void {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async firstRun() {
        if (this.settings.I18N_WIZARD) {
            new WizardModal(this.app, this).open();
            this.settings.I18N_UUID = uuidv4();
            this.settings.I18N_WIZARD = false;
            this.saveSettings();
        }
    }

    async checkUpdates() {
        const res = await this.api.version();
        if (res.state) {
            if (this.manifest.version !== res.data.version) {
                this.notice.primary(t('功能_检查更新_前缀'), `${t('功能_检查更新_通知一')}(${res.data.version})\n${res.data.content}`, 10000);
                this.updatesMark = true;
                this.updatesVersion = res.data.version;
            }
        } else {
            this.notice.result(t('功能_检查更新_前缀'), false, res.data);
        }
    }

    async ignoreCache() {
        if (!this.settings.I18N_MODE_NDT || !this.settings.I18N_IGNORE) { this.ignoreMark = false; return; }
        const res = await this.api.getMark();
        if (!res.state) { this.ignoreMark = false; this.notice.result(t('设置_云端_标记汉化_标题'), false, t('设置_云端_通知一')); return; }
        try { this.ignorePlugins = res.data; this.ignoreMark = true; if (this.settings.I18N_NOTICE) this.notice.result(t('设置_云端_标记汉化_标题'), true); }
        catch (error) { this.ignoreMark = false; this.notice.result(t('设置_云端_标记汉化_标题'), false, error); }
    }

    async pliginDirectoryCache() {
        if (!this.settings.I18N_MODE_NDT) {
            this.pluginDirectoryMark = false;
            return;
        }
        const res = await this.api.giteeGetDirectory('translation');
        if (!res.state) {
            this.pluginDirectoryMark = false;
            this.notice.result(t('设置_云端_标题_缩写'), false, t('设置_云端_通知一')); return;
        }
        try {
            this.pluginDirectory = res.data;
            this.pluginDirectoryMark = true;
            if (this.settings.I18N_NOTICE) this.notice.result(t('设置_云端_标题_缩写'), true, t('设置_云端_通知三'));
        } catch (error) {
            this.pluginDirectoryMark = false; this.notice.result(t('设置_云端_标题_缩写'), false, error);
        }
    }

    async themeDirectoryCache() {
        if (!this.settings.I18N_MODE_NDT) {
            this.themeDirectoryMark = false;
            return;
        }
        const res = await this.api.giteeGetDirectory('theme');
        if (!res.state) {
            this.themeDirectoryMark = false;
            this.notice.result(t('设置_云端_标题_缩写'), false, t('设置_云端_通知一')); return;
        }
        try {
            this.themeDirectory = res.data;
            this.themeDirectoryMark = true;
            if (this.settings.I18N_NOTICE) this.notice.result(t('设置_云端_标题_缩写'), true, t('设置_云端_通知二'));
        } catch (error) {
            this.themeDirectoryMark = false; this.notice.result(t('设置_云端_标题_缩写'), false, error);
        }
    }

    async i18nAutomaticUpdate(app: App) {
        if (this.settings.I18N_MODE_LDT && this.settings.I18N_AUTOMATIC_UPDATE) {
            let plugins: PluginManifest[] = [];
            if (this.settings.I18N_NOTICE) this.notice.success(t('设置_本地_智能更新_标题'), t('设置_本地_智能更新_通知一'));
            // @ts-ignore
            plugins = Object.values(app.plugins.manifests).filter(item => item.id !== 'i18n');
            let updateitem = 0;
            for (const plugin of plugins) {
                // @ts-ignore
                const pluginDir = path.join(path.normalize(app.vault.adapter.getBasePath()), plugin.dir ?? '');
                const stateObj = fs.pathExistsSync(path.join(pluginDir, 'lang', 'state.json')) ? new State(this, path.join(pluginDir, 'lang', 'state.json')) : undefined;
                // 当运行到这里面的时候也就是意味着插件已经更新了
                if (stateObj != undefined && stateObj.getState() && plugin.version != stateObj.getPluginVersion()) {
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
                        stateObj.setState(true);
                        stateObj.setPluginVersion(plugin.version);
                        stateObj.setTranslationVersion(translationJson.manifest.translationVersion);
                        // 10. 重启
                        // @ts-ignore
                        await this.app.plugins.disablePlugin(plugin.id);
                        // @ts-ignore
                        await this.app.plugins.enablePlugin(plugin.id);
                    } catch (error) {
                        this.notice.error(t('设置_本地_智能更新_标题'), error);
                    }
                }
            }
            if (this.settings.I18N_NOTICE) updateitem == 0 ? this.notice.success(t('设置_本地_智能更新_标题'), t('设置_本地_智能更新_通知二')) : this.notice.success(t('设置_本地_智能更新_标题'), `${t('设置_本地_智能更新_通知三')}${updateitem}${t('设置_本地_智能更新_通知四')}`)
        }
    }

    public trenslatorPluginsName() {
        // @ts-ignore
        const thisnDir = path.join(path.normalize(this.app.vault.adapter.getBasePath()), this.manifest.dir, 'name.json');
        this.nameTranslationJSON = fs.pathExistsSync(thisnDir) ? fs.readJsonSync(thisnDir) : {};
        //  @ts-ignore
        this.nameTranslationJSON = Object.keys(this.nameTranslationJSON).sort().reduce((obj, key) => { obj[key] = this.nameTranslationJSON[key]; return obj; }, {});
        // @ts-ignore
        const translationPluginsManifests: PluginManifest[] = Object.values(this.app.plugins.manifests);
        this.originalPluginsManifests = JSON.parse(JSON.stringify(translationPluginsManifests));
        translationPluginsManifests.forEach(plugin => {
            if (this.nameTranslationJSON.hasOwnProperty(plugin.name) && this.nameTranslationJSON[plugin.name] !== '') {
                plugin.name = `${plugin.name} ${this.settings.I18N_NAME_TRANSLATION_PREFIX}${this.nameTranslationJSON[plugin.name]}${this.settings.I18N_NAME_TRANSLATION_SUFFIX}`;
            }
        });
    }

    public restorePluginsName() {
        if (this.originalPluginsManifests !== undefined) {
            // 创建一个基于 id 的查找表  
            const originalPluginsById = new Map<string, PluginManifest>(this.originalPluginsManifests.map(oplugin => [oplugin.id, oplugin]));
            // @ts-ignore
            const pluginManifests = Object.values(this.app.plugins.manifests) as PluginManifest[];
            pluginManifests.forEach(plugin => {
                const originalPlugin = originalPluginsById.get(plugin.id);
                if (originalPlugin) plugin.name = originalPlugin.name;
            });
        }
    }

    public reloadPluginsName() {
        this.restorePluginsName();
        this.trenslatorPluginsName();
    }

    /**
     * 激活编辑器视图。
     * 如果编辑器视图已经存在于工作区中，则使用它；否则，在右侧边栏中创建一个新的叶子。
     */
    public async activateEditorView() {
        const { workspace } = this.app;
        // 清空
        this.detachEditorView();
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
        // “显示”叶子，以防它在折叠的侧边栏中
        if (leaf != null) workspace.revealLeaf(leaf);
    }
    /**
     * 从工作区中分离编辑器视图。
     */
    public detachEditorView() { this.app.workspace.detachLeavesOfType(EDIT_VIEW_TYPE) }
    /**
     * 激活管理员视图。
     * 如果管理员视图已经存在于工作区中，则使用它；否则，在右侧边栏中创建一个新的叶子。
     */
    public async activateAdminView() {
        const { workspace } = this.app;
        this.detachAdminView();
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(ADMIN_VIEW_TYPE);
        if (leaves.length > 0) {
            leaf = leaves[0];
        } else {
            leaf = workspace.getLeaf('window'); // 'window' true  
            if (leaf != null) await leaf.setViewState({ type: ADMIN_VIEW_TYPE, active: true });
        }
        if (leaf != null) workspace.revealLeaf(leaf);
    }
    /**
     * 从工作区中分离管理员视图。
     */
    public detachAdminView() { this.app.workspace.detachLeavesOfType(ADMIN_VIEW_TYPE) }
    /**
     * 激活分享视图。
     * 如果分享视图已经存在于工作区中，则使用它；否则，在右侧边栏中创建一个新的叶子。
     */
    public async activateShareView() {
        const { workspace } = this.app;
        this.detachShareView();
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(SHARE_VIEW_TYPE);
        if (leaves.length > 0) {
            leaf = leaves[0];
        } else {
            leaf = workspace.getLeaf('window'); // 'window' true
            if (leaf != null) await leaf.setViewState({ type: SHARE_VIEW_TYPE, active: true });
        }
        if (leaf != null) workspace.revealLeaf(leaf);
    }
    /**
     * 从工作区中分离分享视图。
     */
    public detachShareView() { this.app.workspace.detachLeavesOfType(SHARE_VIEW_TYPE) }
    /**
     * 激活分享视图。
     * 如果分享视图已经存在于工作区中，则使用它；否则，在右侧边栏中创建一个新的叶子。
     */
    public async activateDownloadView() {
        const { workspace } = this.app;
        this.detachDownloadView();
        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(DOWNLOAD_VIEW_TYPE);
        if (leaves.length > 0) {
            leaf = leaves[0];
        } else {
            leaf = workspace.getLeaf('window');
            if (leaf != null) await leaf.setViewState({ type: DOWNLOAD_VIEW_TYPE, active: true });
        }
        if (leaf != null) workspace.revealLeaf(leaf);
    }
    /**
     * 从工作区中分离分享视图。
     */
    public detachDownloadView() { this.app.workspace.detachLeavesOfType(DOWNLOAD_VIEW_TYPE) }

    activateIMT() {
        // 检查window对象上是否已存在immersiveTranslateConfig属性  
        if (!window.immersiveTranslateConfig) {
            window.immersiveTranslateConfig = { 'pageRule': this.settings.I18N_IMT_CONFIG };
            console.log(window.immersiveTranslateConfig);
            // 创建一个新的script元素  
            const script = document.createElement('script');
            // 给script元素添加一个类名imt-script  
            script.classList.add('imt-script');
            // 设置script元素为异步加载  
            script.async = true;
            // 设置script元素的src属性为Url.SDK_URL，这里Url.SDK_URL应该是在其他地方定义的SDK地址  
            script.src = Url.SDK_URL;

            script.onload = () => {
                setTimeout(() => {
                    // 创建了一个div? ID为immersive-translate-popup
                    const shadowRoot = document.querySelector('#immersive-translate-popup')?.shadowRoot;
                    // 如果找到了shadowRoot  
                    if (shadowRoot) {
                        // 在shadowRoot中查找类名为.imt-fb-container>div的元素（即关闭按钮）   // btn-animate
                        const closeBtn = shadowRoot.querySelector('.imt-fb-container>div') as HTMLElement;
                        // 如果找到了关闭按钮，则将其隐藏  
                        if (closeBtn) { closeBtn.style.display = 'none'; }
                        // 在shadowRoot中查找类名为.imt-fb-container>div的元素（即关闭按钮）   // btn-animate
                        const setBtn = shadowRoot.querySelector('.popup-container>footer') as HTMLElement;
                        // 如果找到了关闭按钮，则将其隐藏  
                        if (setBtn) { setBtn.style.display = 'none'; }
                    }
                }, 1000); // 为了防止在页面加载完成之前执行脚本，这里设置了1秒的延迟

            };
            // 在shadowRoot中查找类名为.imt-fb-container>div的元素（即关闭按钮）   // btn-animate
            document.body.append(script);
            // const shadowRoot = document.querySelector('#immersive-translate-popup')?.shadowRoot;
            // console.log(shadowRoot)
            // const closeBtn = shadowRoot.querySelector('.imt-fb-container>div') as HTMLElement;
            // console.log(closeBtn)
            // // 如果找到了关闭按钮，则将其隐藏  
            // if (closeBtn) { closeBtn.style.display = 'none'; }
        }
    }

    async enableIMT() {
        // 查找ID为immersive-translate-popup的元素  
        const imtPopup = document.querySelector('#immersive-translate-popup');
        // 查找html元素  
        const html = document.querySelector('html');
        // 获取html元素的imt-state属性  
        const state = html?.getAttribute?.('imt-state');
        // 如果状态为dual，则调用restoreTranslate函数（可能用于恢复某种翻译状态）  
        state === 'dual' && restoreTranslate();
        // 查找类名为imt-script的元素  
        const imtScript = document.querySelector('.imt-script');
        // 查找所有包含immersive-translate关键字的data-id属性的元素  
        // @ts-ignore
        const styleList = [...document.querySelectorAll('[data-id*="immersive-translate"]'),];
        // 创建一个空数组，用于存放需要移除的元素  
        const removeList: Element[] = [];
        // 对imtPopup, imtScript, styleList进行过滤，只保留存在的元素  
        [imtPopup, imtScript, styleList].filter((v) => !!v).forEach((v) => Array.isArray(v) ? v.forEach((s) => s && removeList.push(s)) : v && removeList.push(v));
        // 遍历removeList，并移除每个元素  
        removeList.forEach((v) => v?.remove?.());
        // 查找所有包含data-immersive-translate-walked属性的元素，并移除该属性
        document.querySelectorAll(`[data-immersive-translate-walked]`)?.forEach((v) => v.removeAttribute('data-immersive-translate-walked'));
        // 如果html元素存在，则移除其imt-state和imt-trans-position属性  
        html?.removeAttribute('imt-state');
        html?.removeAttribute('imt-trans-position');
        // 调用clearStorage函数（可能用于清除某种存储，如localStorage或sessionStorage），并等待其执行完成
        await clearStorage();
    }

    async getAdmin() {
        const res = await this.api.giteeGetAllIssue();
        if (res.state) {
            if (res.data.length > 0) {
                this.issues = res.data;
                this.notice.result('获取', true, `${this.issues.length}条待审核内容`);
            } else {
                this.notice.result('获取', true, '暂时没有可审核任务');
            }
        } else {
            this.notice.result('获取', false, '获取失败,请检查网络后重试');
        }
    }

    /** 加载编辑器视图。
     * @param type 编辑器的类型。
     * @param path 编辑器文件的路径。
     */
    public editorLoad(type: string, path: string, state: State) {
        this.editorType = type;
        this.editorPath = path;
        this.editorState = state
        this.activateEditorView();
    }
    /** 加载共享视图。
     * @param type 共享内容的类型，0表示插件，1表示主题。
     * @param path 共享文件的路径。
     * @param obj 插件或主题的manifest对象。
     */
    public shareLoad(type: number, path: string, obj: PluginManifest | OBThemeManifest) {
        this.shareType = type;
        this.sharePath = path;
        this.shareObj = obj;
        this.activateShareView();
    }

}

