import * as path from 'path';
import * as fs from 'fs-extra';

import { App, ButtonComponent, ExtraButtonComponent, Modal, PluginManifest, Setting } from 'obsidian';
import I18N from 'main';
import { I18nSettings } from '../settings/data';

import { Plugin, TranslationDirectoryItem } from 'src/data/types';
import { I18N_SORT, I18N_TYPE } from 'src/data/data';
import { State, generatePlugin, compareVersions, formatTimestamp, isValidpluginTranslationFormat, i18nOpen, ai } from '../utils';
import { WizardModal } from './i18n-wizard-modal';

import { t } from '../lang/inxdex';
import Url from 'src/url';
import { NameTranslationModal } from './i18n-name-translation-modal';
import { ContributorModal } from './i18n-contributor-modal';
import { I18NThemeModal } from './i18n-theme-modal';

// ==============================
//          侧边栏 对话框 翻译
// ==============================
export class I18NPluginModal extends Modal {
    i18n: I18N;
    settings: I18nSettings;
    basePath: string;
    // [本地][变量] 全部插件列表
    plugins: PluginManifest[] = [];
    // [本地][变量] 展示插件列表
    showPlugins: PluginManifest[] = [];
    // [本地][变量] 开启插件列表
    enabledPlugins: Set<string>;
    // [本地][变量] 插件设置
    settingPlugins: { open: () => void; openTabById: (arg0: string) => void; };

    regexps: string[];
    developerMode = false;

    // ============================================================
    //                       构造函数
    // ============================================================
    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n;
        // @ts-ignore
        this.basePath = path.normalize(this.app.vault.adapter.getBasePath());
        this.settings = i18n.settings;
        // @ts-ignore 
        this.settingPlugins = this.app.setting;
        this.regexps = [...this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE], ...this.i18n.settings.I18N_RE_TEMP.split('|')].filter(item => { return item !== '' });
    }
    detailsEl: HTMLDivElement;
    // ============================================================
    //                        展示操作
    // ============================================================
    public async showHead() {
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n__container');
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);
        this.titleEl.parentElement?.addClass('i18n__header');
        this.contentEl.addClass('i18n__item-box');

        this.detailsEl = document.createElement("div");
        this.detailsEl.addClass('i18n__item-details');
        this.detailsEl.innerText = '无';
        modalEl.appendChild(this.detailsEl);

        const helpTitle = new Setting(this.titleEl).setClass('i18n__help').setName(t('通用_标题_文本'));

        new ButtonComponent(helpTitle.controlEl)
            .setIcon('i18n_qq')
            .setTooltip(t('通用_QQ_描述'))
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .onClick(() => { window.open(Url.QQ_GROUP) });

        if (this.settings.I18N_MODE_NDT) new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('i18n-contributor')
            .setTooltip(t('通用_贡献榜_描述'))
            .onClick(() => { new ContributorModal(this.app, this.i18n).open() });
        if (this.settings.I18N_MODE_LDT && this.settings.I18N_NAME_TRANSLATION) new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('name-setting')
            .setTooltip(t('通用_名称翻译_描述'))
            .onClick(() => { this.close(); new NameTranslationModal(this.app, this.i18n).open(); });
        new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('settings')
            .setTooltip(t('通用_设置_描述'))
            .onClick(() => { this.settingPlugins.open(); this.settingPlugins.openTabById(this.i18n.manifest.id); this.close(); });
        new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('circle-help')
            .setTooltip(t('通用_帮助_描述'))
            .onClick(() => { new WizardModal(this.app, this.i18n).open() });
        new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('palette')
            .setTooltip(t('通用_主题_描述'))
            .onClick(() => {
                this.i18n.settings.I18N_MODE = 1;
                this.i18n.saveSettings();
                this.i18n.pluginModal.close();
                this.i18n.themeModal = new I18NThemeModal(this.app, this.i18n);
                this.i18n.themeModal.open();
            });
        if (this.developerMode) new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('refresh-ccw')
            .setTooltip('刷新插件')
            .onClick(async () => { this.close(); await this.reloadPlugin(this.i18n.manifest.id); });

        const searchTitle = new Setting(this.titleEl).setClass('i18n__search').setName(t('通用_搜索_标题'));
        searchTitle.addDropdown(cb => cb.addOptions(I18N_SORT).setValue(this.settings.I18N_SORT).onChange((value) => { this.settings.I18N_SORT = value; this.i18n.saveSettings(); this.reloadShowData(); }).selectEl.addClass('i18n-select'));
        searchTitle.addDropdown(cb => cb.addOptions(I18N_TYPE).setValue(this.settings.I18N_TYPE).onChange((value) => { this.settings.I18N_TYPE = value; this.i18n.saveSettings(); this.reloadShowData(); }).selectEl.addClass('i18n-select'));
        searchTitle.addSearch(cb => cb.setValue(this.settings.I18N_SEARCH_TEXT).onChange((value) => { this.settings.I18N_SEARCH_TEXT = value; this.i18n.saveSettings(); this.reloadShowData(); }).inputEl.addClass('i18n-input'));
        if (this.i18n.settings.I18N_RE_TEMP_MODE) {
            new Setting(this.titleEl)
                .setClass('i18n__search')
                .addText(cb => cb
                    .setValue(this.settings.I18N_RE_TEMP)
                    .setPlaceholder(t('功能_正则_占位符'))
                    .onChange((value) => {
                        this.settings.I18N_RE_TEMP = value;
                        this.i18n.saveSettings();
                        this.regexps = [...this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE], ...this.i18n.settings.I18N_RE_TEMP.split('|')].filter(item => { return item !== '' });
                    })
                    .inputEl.addClass('i18n__re-input', 'i18n-input')
                ).infoEl.remove();
        }
    }
    // ============================================================
    //                        展示数据
    // ============================================================
    public async showData() {
        // ==============================
        //            获取数据
        // ==============================
        // @ts-ignore
        this.plugins = Object.values(this.app.plugins.manifests);
        this.plugins = this.plugins.filter(item => item.id !== this.i18n.manifest.id);
        // @ts-ignore
        this.enabledPlugins = this.app.plugins.enabledPlugins;
        // 搜索
        if (this.settings.I18N_SEARCH_TEXT == '') { this.showPlugins = this.plugins }
        else { this.showPlugins = this.plugins.filter(item => item.name.toLowerCase().indexOf(this.settings.I18N_SEARCH_TEXT.toLowerCase()) != -1); }
        // 分类
        const idsToRemove: string[] = [];
        switch (this.settings.I18N_TYPE) {
            case '0': break
            // @ts-ignore
            // 未提取
            case '1': for (const plugin of this.showPlugins) { if (fs.pathExistsSync(path.join(this.basePath, plugin.dir, 'lang', `${this.settings.I18N_LANGUAGE}.json`))) idsToRemove.push(plugin.id); } this.showPlugins = this.showPlugins.filter(plugin => !idsToRemove.includes(plugin.id)); break;
            // @ts-ignore
            // 未翻译
            case '2': for (const plugin of this.showPlugins) { const pluginDir = path.join(this.basePath, plugin.dir); const stateDoc = path.join(pluginDir, 'lang', 'state.json'); const isStateDoc = fs.pathExistsSync(stateDoc); if (fs.pathExistsSync(path.join(pluginDir, 'lang')) && isStateDoc) { if (fs.readJsonSync(stateDoc).state != false) { idsToRemove.push(plugin.id) } } else { idsToRemove.push(plugin.id) } } this.showPlugins = this.showPlugins.filter(plugin => !idsToRemove.includes(plugin.id)); break;
            // @ts-ignore
            // 已翻译
            case '3': for (const plugin of this.showPlugins) { const pluginDir = path.join(this.basePath, plugin.dir); const stateDoc = path.join(pluginDir, 'lang', 'state.json'); const isStateDoc = fs.pathExistsSync(stateDoc); if (fs.pathExistsSync(path.join(pluginDir, 'lang')) && isStateDoc) { if (fs.readJsonSync(stateDoc).state != true) { idsToRemove.push(plugin.id) } } else { idsToRemove.push(plugin.id) } } this.showPlugins = this.showPlugins.filter(plugin => !idsToRemove.includes(plugin.id)); break;
        }
        // 排序
        switch (this.settings.I18N_SORT) { case '0': this.showPlugins.sort((item1, item2) => { return item1.name.localeCompare(item2.name) }); break; case '1': this.showPlugins.sort((item1, item2) => { return item2.name.localeCompare(item1.name) }); break; }

        // ==============================
        //           主逻辑
        // ==============================
        for (const plugin of this.showPlugins) {
            // ============================================================
            //                         路径及状态
            // ============================================================
            // #region 路径及状态
            // @ts-ignore
            const pluginDir = path.join(this.basePath, plugin.dir);
            const langDir = path.join(pluginDir, 'lang');
            const langDoc = path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`);
            const stateDoc = path.join(pluginDir, 'lang', 'state.json');
            const isLangDir = fs.pathExistsSync(langDir);
            const isLangDoc = fs.pathExistsSync(langDoc);
            const manifestDoc = path.join(pluginDir, 'manifest.json');
            const mainDoc = path.join(pluginDir, 'main.js');
            const duplicateDoc = path.join(pluginDir, 'duplicate.js');
            const stateObj = new State(this.i18n, stateDoc);
            if (isLangDir && !stateObj.isStateDoc) stateObj.insert();

            // 插件更新(更新还原插件状态)
            if (stateObj.isStateDoc && stateObj.getState() && plugin.version != stateObj.getPluginVersion()) try {
                fs.removeSync(duplicateDoc); stateObj.reset();
                this.i18n.notice.primary(t('通用_插件更新_前缀'), plugin.name);
            } catch (e) {
                this.i18n.notice.error(t('通用_插件更新_前缀'), e);
            }

            // ====================
            // 本地插件 vs 云端插件
            // ====================
            // 本地译文
            let localJson: Plugin | undefined;
            // 云端译文介绍
            let directoryItem: TranslationDirectoryItem | undefined;

            // 译文格式是否正常标记
            let translationFormatMark = true;
            // 是否存在更新标记
            let updateMark = false;
            // 可下载的版本号
            let downloadVersion: string;
            // 当本地译文存在时 提取本地译文 并 判断译文格式
            if (isLangDoc) {
                try {
                    localJson = fs.readJsonSync(langDoc);
                    translationFormatMark = isValidpluginTranslationFormat(localJson);
                } catch (e) {
                    translationFormatMark = false;
                }
            }
            // 自动转换旧格式
            if (localJson && !('translationVersion' in localJson.manifest)) {
                if (stateObj.getState()) {
                    fs.unlinkSync(mainDoc);
                    fs.renameSync(duplicateDoc, mainDoc);
                    const translationJson = fs.readJsonSync(langDoc);
                    const manifestJSON = fs.readJsonSync(manifestDoc);
                    manifestJSON.description = translationJson.description.original;
                    fs.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
                    stateObj.reset();
                    stateObj.setType('extract');
                    stateObj.setState(false);
                    stateObj.setTranslationVersion(0);
                }
                localJson = {
                    manifest: {
                        translationVersion: new Date('1949-10-01T15:00:00+08:00').getTime(),
                        // @ts-ignore
                        pluginVersion: localJson.manifest.pluginVersion,
                    },
                    description: localJson.description,
                    dict: localJson.dict
                }
                fs.writeJsonSync(langDoc, localJson, { spaces: 4 });
                translationFormatMark = true;
                this.i18n.notice.result('格式转换', true, plugin.name);
            }

            // [云端模式] 当云端目录存在时 获取云端目录
            if (this.i18n.pluginDirectoryMark) {
                directoryItem = this.i18n.pluginDirectory.find((manifest) => manifest.id === plugin.id)
            }

            // [云端模式] 当云端目录存在时 判断是否存在云端插件
            if (this.i18n.pluginDirectoryMark && directoryItem && translationFormatMark) {
                // 获取可下载的版本号
                downloadVersion = (plugin.version in directoryItem.translations ? true : false) ? plugin.version : Object.keys(directoryItem.translations).slice(-1)[0];
                // 判断是否有更新
                if (localJson) {
                    if (localJson.manifest.translationVersion < directoryItem.translations[downloadVersion]) { updateMark = true; }
                }
            }
            // #endregion

            // 是否可更新
            let updateMark2: boolean;
            if (stateObj.isStateDoc) {
                if (['0', '1'].includes(stateObj.getType())) {
                    updateMark2 = stateObj.getType() === '0' ? true : false;
                } else {
                    updateMark2 = true;
                }
            } else {
                updateMark2 = true;
            }

            // ============================================================
            //      插件基础功能(介绍 打开目录 删除目录 编辑译文 提交译文)
            // ============================================================
            // #region 
            // ====================
            // 插件介绍头部
            // ====================
            const itemEl = new Setting(this.contentEl);
            itemEl.setClass('i18n__item');
            itemEl.nameEl.addClass('i18n__item-title');

            const desc: { mark: number, label: { color: string; text: string; }, text: string } = { mark: 1, label: { color: '', text: '' }, text: '' };
            if (stateObj.isStateDoc) {
                if (localJson && translationFormatMark) {
                    if (compareVersions(plugin.version, localJson.manifest.pluginVersion) === 1) {
                        desc.label.color = 'warning'; desc.label.text = t('标签_已过时_文本');
                    } else {
                        if (stateObj.getState()) {
                            desc.label.color = 'success'; desc.label.text = t('标签_已翻译_文本');
                        } else { desc.label.color = 'danger'; desc.label.text = t('标签_未翻译_文本'); }
                    }
                    desc.text = `<span class="i18n-tag i18n-tag--${this.settings.I18N_TAG_TYPE}-primary is-${this.settings.I18N_TAG_SHAPE}">修改日期</span> ${formatTimestamp(fs.statSync(langDoc).mtimeMs)} <span class="i18n-tag i18n-tag--${this.settings.I18N_TAG_TYPE}-primary is-${this.settings.I18N_TAG_SHAPE}">支持版本</span> ${localJson?.manifest.pluginVersion}`;
                } else {
                    desc.label.color = 'danger';
                    desc.label.text = t('标签_译文有误_文本');
                    desc.text = t('标签_译文有误_描述');
                }
            } else {
                desc.label.color = 'info';
                desc.label.text = t('标签_无译文_文本');
                desc.text = t('标签_无译文_描述');
            }
            if (this.i18n.ignoreMark && this.i18n.ignorePlugins.includes(plugin.id)) {
                desc.label.color = 'primary';
                desc.label.text = t('标签_自带翻译_文本');
                desc.text = t('标签_自带翻译_描述');
            }

            itemEl.nameEl.innerHTML = `<span class="i18n-tag i18n-tag--${this.settings.I18N_TAG_TYPE}-${desc.label.color} is-${this.settings.I18N_TAG_SHAPE}">${desc.label.text}</span><span class="i18n__item-name">${plugin.name}</span> <span class="i18n__item-version">[${plugin.version}]</span> `;
            itemEl.settingEl.onmouseover = (e) => { this.detailsEl.innerHTML = desc.text };
            itemEl.settingEl.onmouseout = (e) => { this.detailsEl.innerHTML = t('标签_无_文本') };

            // ====================
            // 打开名称设置
            // ====================
            // new ExtraButtonComponent(itemEl.controlEl)
            //     .setIcon('i18n-name')
            //     .setTooltip(plugin.name)
            //     .onClick(() => {
            //         openPluginDirButton.setDisabled(true);
            //         i18nOpen(this.i18n, pluginDir);
            //         openPluginDirButton.setDisabled(false);
            //     });

            // ====================
            // 打开插件设置
            // ====================
            if (this.settings.I18N_OPEN_SETTINGS && this.enabledPlugins.has(plugin.id)) {
                const openPluginSetting = new ExtraButtonComponent(itemEl.controlEl)
                    .setIcon('settings')
                    .setTooltip(t('功能_打开_描述'))
                    .onClick(() => {
                        openPluginSetting.setDisabled(true);
                        this.settingPlugins.open();
                        this.settingPlugins.openTabById(plugin.id);
                        this.close();
                    });
            }

            // ====================
            // 打开插件目录(打开)
            // ====================
            const openPluginDirButton = new ExtraButtonComponent(itemEl.controlEl)
                .setIcon('folder-open')
                .setTooltip(t('功能_打开_描述'))
                .onClick(() => {
                    openPluginDirButton.setDisabled(true);
                    i18nOpen(this.i18n, pluginDir);
                    openPluginDirButton.setDisabled(false);
                });

            // ====================
            // 清空翻译文件(删除)
            // ====================
            if (isLangDir) {
                const deletePluginDirButton = new ExtraButtonComponent(itemEl.controlEl)
                    .setIcon('trash')
                    .setTooltip(t('功能_删除_描述'))
                    .onClick(() => {
                        deletePluginDirButton.setDisabled(true);
                        try {
                            // 当为已翻译状态时
                            if (stateObj.stateObj.state) {
                                // 1. 删除已翻译代码
                                fs.removeSync(mainDoc);
                                // 2. 还原备份文件
                                fs.renameSync(duplicateDoc, mainDoc);
                                // 3. 读取译文
                                const translationJson = fs.readJsonSync(langDoc);
                                if (translationJson.hasOwnProperty("description")) {
                                    // 4. 读取 manifest.json
                                    const manifestJSON = fs.readJsonSync(manifestDoc);
                                    // 5. 还原 manifest.json
                                    manifestJSON.description = translationJson.description.original;
                                    // 6. 写入 manifest.json
                                    fs.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
                                }
                            }
                            // 递归删除所有文件
                            fs.removeSync(langDir);
                            this.reloadPlugin(plugin.id);
                            this.i18n.notice.result(t('功能_删除_前缀'), true);
                        } catch (error) {
                            this.i18n.notice.result(t('功能_删除_前缀'), false, error);
                        }
                        this.reloadShowData();
                    });
            }

            // ====================
            // 编辑译文
            // ====================
            if (translationFormatMark && isLangDoc && this.settings.I18N_EDIT_MODE) {
                new ExtraButtonComponent(itemEl.controlEl).setIcon('pencil').setTooltip(t('功能_编辑_描述')).onClick(() => {
                    this.i18n.editorPath = langDoc;
                    this.i18n.editorLoad('plugin', langDoc, stateObj);
                });
            }

            // ====================
            // 译文共享模式
            // ====================
            if (this.settings.I18N_SHARE_MODE && translationFormatMark && isLangDoc) {
                const submitTranslationButton = new ExtraButtonComponent(itemEl.controlEl);
                submitTranslationButton.setIcon('cloud-upload');
                submitTranslationButton.setTooltip(t('功能_共享_描述'));
                submitTranslationButton.onClick(async () => {
                    // const res = await this.i18n.api.version();
                    // if (res.state) {
                    //     if (this.i18n.manifest.version === res.data.version) {
                    //         this.i18n.shareLoad(0, langDoc, plugin);
                    //     } else {
                    //         this.i18n.notice.result(t('设置_共享_标题_缩写'), false, '请升级本插件至最新版即可提交');
                    //     }
                    // } else {
                    //     this.i18n.notice.result(t('设置_共享_标题_缩写'), false, '网络异常');
                    // }
                    this.i18n.shareLoad(0, langDoc, plugin);
                });

            }
            // #endregion

            // ============================================================
            //                     本地译文翻译(提取) 
            // ============================================================
            if (this.settings.I18N_MODE_LDT && !isLangDoc) {
                itemEl.controlEl.createEl('button', { text: t('功能_提取_文本'), cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                    el.addEventListener("click", () => {
                        try {
                            // 1. 获取 main.js 字符串
                            const mainStr = fs.readFileSync(mainDoc).toString();
                            // 2. 获取 manifest.json JSON文本
                            const manifestJSON = fs.readJsonSync(manifestDoc);
                            // 3. 生成译文
                            const translationJson = generatePlugin(plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                            // 4. 确保语言目录存在
                            fs.ensureDirSync(langDir);
                            // 5. 将 译文json 写入文件
                            fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                            // 6. 生成 状态文件
                            stateObj.insert();
                            stateObj.setType('0');
                            this.i18n.notice.result(t('功能_提取_前缀'), true);
                        } catch (error) {
                            this.i18n.notice.result(t('功能_提取_前缀'), false, `${error}`);
                        }
                        this.reloadShowData();
                    });
                });
            }
            // ============================================================
            //                     本地译文翻译(增量提取) 
            // ============================================================
            if (this.settings.I18N_MODE_LDT && this.settings.I18N_INCREMENTAL_EXTRACTION && isLangDoc && translationFormatMark) {
                itemEl.controlEl.createEl('button', { text: t('功能_提取_文本'), cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                    el.addEventListener("click", () => {
                        if (stateObj.isStateDoc && !stateObj.getState()) {
                            try {
                                // 1. 原始的译文
                                const originalTranslationJson = fs.readJsonSync(langDoc);
                                // 2. 获取 main.js 字符串
                                const modifiedTranslationJson = generatePlugin(plugin.version, fs.readJsonSync(manifestDoc), fs.readFileSync(mainDoc).toString(), this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                                // 3. 将旧译文合并到新译文中
                                modifiedTranslationJson.manifest = originalTranslationJson.manifest;
                                modifiedTranslationJson.description = originalTranslationJson.description;
                                modifiedTranslationJson.dict = { ...modifiedTranslationJson.dict, ...originalTranslationJson.dict };
                                // 4. 确保语言目录存在
                                fs.ensureDirSync(langDir);
                                // 5. 将 译文json 写入文件
                                fs.writeJsonSync(langDoc, modifiedTranslationJson, { spaces: 4 });
                                this.i18n.notice.result(t('功能_提取_前缀'), true, `提取译文${Object.keys(modifiedTranslationJson.dict).length - Object.keys(originalTranslationJson.dict).length}条`);
                            } catch (error) {
                                this.i18n.notice.result(t('功能_提取_前缀'), false, `${error}`);
                            }
                        } else {
                            this.i18n.notice.result(t('功能_提取_前缀'), false, t('功能_提取_通知一'));
                        }
                    });
                });
            }

            // ============================================================
            //                  网络译文翻译(下载、更新)
            // ============================================================
            if (this.settings.I18N_MODE_NDT && this.i18n.pluginDirectory && translationFormatMark && directoryItem != undefined && updateMark2) {
                if (!isLangDoc || updateMark == true) {
                    itemEl.controlEl.createEl('button', { text: (isLangDoc ? t('功能_更新_文本') : t('功能_下载_文本')), cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                        el.addEventListener("click", async () => {
                            let cloudJson;
                            if (this.i18n.settings.I18N_NDT_URL === 'gitee') {
                                cloudJson = await this.i18n.api.giteeGetTranslation('translation', plugin.id, downloadVersion);
                            } else if (this.i18n.settings.I18N_NDT_URL === 'github') {
                                cloudJson = await this.i18n.api.githubGetTranslation('translation', plugin.id, downloadVersion);
                            }
                            if (cloudJson !== undefined && localJson == undefined) localJson = cloudJson.data;
                            if (localJson !== undefined && cloudJson !== undefined) {
                                this.i18n.downloadType = '0';
                                this.i18n.downloadPath = langDir;
                                this.i18n.downloadCloudJson = cloudJson.data;
                                if (localJson !== undefined) this.i18n.downloadLocalJson = localJson;
                                this.i18n.downloadView = this;
                                this.i18n.activateDownloadView();
                                await this.reloadShowData();
                            } else {
                                this.i18n.notice.result((isLangDoc ? t('功能_更新_文本') : t('功能_下载_文本')), false, t('功能_下载更新_通知一'));
                            }
                        });
                    });
                }
            }

            // ============================================================
            //                    网络接口翻译(生成)
            // ============================================================
            if (this.settings.I18N_MODE_NIT && !isLangDoc) {
                itemEl.controlEl.createEl('button', { text: 'AI', cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                    el.addEventListener("click", async () => {
                        try {
                            const mainStr = fs.readFileSync(mainDoc).toString();
                            // 2. 获取 manifest.json JSON文本
                            const manifestJSON = fs.readJsonSync(manifestDoc);
                            // 3. 转换为译文格式
                            const translationJson = generatePlugin(plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                            let temp = 0;
                            const regex = /(['"`])(.*)(\1)/;
                            for (const key in translationJson.dict) {
                                this.i18n.notice.info(t('功能_AI_文本'), `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
                                const tempArray = key.match(regex);
                                if (tempArray != null) {
                                    const res = await ai(this.i18n, tempArray[2]);
                                    if (res) translationJson.dict[key] = res.state ? key.replace(tempArray[2], res.data) : key;
                                    await sleep(this.settings.I18N_NIT_API_INTERVAL);
                                }
                            }
                            fs.ensureDirSync(langDir);
                            fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                            stateObj.insert();
                            stateObj.setType('0');
                            this.reloadShowData();
                        } catch (error) {
                            this.i18n.notice.result(t('功能_AI_文本'), false, error);
                        }

                    });
                });
            }

            // ============================================================
            //                 插件基础功能(翻译 还原)
            // ============================================================
            if (isLangDoc && stateObj.isStateDoc && translationFormatMark) {
                // 翻译按钮
                if (stateObj.getState() == false) {
                    itemEl.controlEl.createEl('button', { text: t('功能_替换_文本'), cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                        el.addEventListener("click", () => {
                            try {
                                // 1. 读取译文
                                const translationJson: Plugin = fs.readJsonSync(langDoc);
                                // 2. 检测译文是否翻译
                                if (translationJson && Object.keys(translationJson.dict).every(key => translationJson.dict[key] === key)) { this.i18n.notice.result(t('功能_替换_前缀'), false, t('功能_替换_通知一')); return; }
                                // 3. 复制备份文件
                                fs.copySync(mainDoc, duplicateDoc);
                                // 4. 读取 main.js
                                let mainString = fs.readFileSync(mainDoc).toString();
                                // 5. 翻译 main.js
                                mainString = this.translationMain(translationJson, mainString);
                                // 6. 写入 main.js
                                fs.writeFileSync(mainDoc, mainString);
                                // 7. 读取 manifest.json
                                const manifestJSON = fs.readJsonSync(manifestDoc);
                                // 8. 翻译 manifest.json
                                manifestJSON.description = translationJson.description.translation;
                                // 9. 写入 manifest.json
                                fs.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
                                // 10. 更新状态文件
                                stateObj.setState(true);
                                stateObj.setPluginVersion(plugin.version);
                                stateObj.setTranslationVersion(translationJson.manifest.translationVersion);
                                // 11. 判断插件是否开启 开启则重载此插件
                                if (this.enabledPlugins.has(plugin.id)) { this.reloadPlugin(plugin.id); }
                                // NoticeOperationResult(t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_HEAD'), true, t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_CONTENT_A'));
                            } catch (error) {
                                this.i18n.notice.result(t('功能_替换_前缀'), false, error);
                            }
                            this.reloadShowData();
                        });
                    });
                }
                // 还原按钮
                if (stateObj.getState() == true) {
                    itemEl.controlEl.createEl('button', { text: t('功能_还原_文本'), cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-danger`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                        el.addEventListener("click", () => {
                            try {
                                // 1. 删除 main.js
                                fs.unlinkSync(mainDoc);
                                // 2. 替换 main.js
                                fs.renameSync(duplicateDoc, mainDoc);
                                // 3. 读取译文
                                const translationJson = fs.readJsonSync(langDoc);
                                // 4. 读取 manifest.json
                                const manifestJSON = fs.readJsonSync(manifestDoc);
                                // 5. 还原 manifest.json
                                manifestJSON.description = translationJson.description.original;
                                // 6. 写入 manifest.json
                                fs.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
                                // 7. 更新状态文件
                                stateObj.reset();
                                // 8. 判断插件是否开启 开启则重载此插件
                                if (this.enabledPlugins.has(plugin.id)) this.reloadPlugin(plugin.id);
                                this.i18n.notice.result(t('功能_还原_前缀'), true)
                            } catch (error) {
                                // NoticeOperationResult(t('I18N_ITEM_RESTORE_BUTTON_NOTICE_HEAD'), false, error);
                                this.i18n.notice.result(t('功能_还原_前缀'), false, error)
                            }
                            // 9. 刷新
                            this.reloadShowData();
                        });
                    });
                }
            }

            if (this.developerMode) {
                itemEl.controlEl.createEl('button', { text: '测试', cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                    el.addEventListener("click", async () => {
                        // console.log(path.normalize(this.app.vault.adapter.getBasePath()))
                    });
                });
            }
        }
    }


    // private async getContents(path: string) {
    //     const res = await this.i18n.api.giteeGetContents(path);
    //     const start = res.state;
    //     let sha = '';
    //     let count = '';
    //     if (start) {
    //         sha = res.data.sha; res.data.encoding;
    //         count = JSON.parse(Buffer.from(res.data.content, 'base64').toString('utf8'));
    //     }
    //     return { state: start, count: count, sha: sha };
    // }

    // window.location.reload();
    // [重载数据显示]
    async reloadShowData() {
        // console.log('调用了[刷新]');
        // 滚动条定位
        let scrollTop = 0;
        // @ts-ignore
        const modalElement: HTMLElement = this.contentEl;
        scrollTop = modalElement.scrollTop;
        // 使用 while 循环从最后一个子元素开始向前遍历并删除 从最后一个子元素开始向前遍历，以避免在遍历时影响索引  
        // while (this.contentEl.firstChild) { this.contentEl.removeChild(this.contentEl.firstChild) }
        // 删除所有数据
        modalElement.empty();
        // 刷新展示数据
        await this.showData();
        // 复原scroll位置
        modalElement.scrollTo(0, scrollTop);
    }

    // [开启]
    async onOpen() {
        await this.showHead();
        await this.showData();
    }

    // [关闭]
    async onClose() {
        this.contentEl.empty();
    }

    async reloadPlugin(id: string) {
        if (this.enabledPlugins.has(id)) {
            // @ts-ignore
            await this.app.plugins.disablePlugin(id);
            // @ts-ignore
            await this.app.plugins.enablePlugin(id);
        }
    }

    translationMain(translationJson: Plugin, mainString: string) {
        for (const key in translationJson.dict) { mainString = mainString.replaceAll(key, translationJson.dict[key]) }
        this.i18n.notice.result(t('功能_替换_前缀'), true, t('功能_替换_通知二'));
        return mainString;
    }
}

