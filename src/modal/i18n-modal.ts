import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';

import { App, ButtonComponent, ExtraButtonComponent, Modal, PluginManifest, Setting } from 'obsidian';
import I18N from 'main';
import { I18nSettings } from '../settings/data';

import { Translation, TranslationDirectoryItem } from 'src/data/types';
import { API_TYPES, I18N_SORT, I18N_TYPE } from 'src/data/data';
import { State, generateTranslation, compareVersions, formatTimestamp, isValidTranslationFormat } from '../utils';
import { WizardModal } from './i18n-wizard-modal';

import { t } from '../lang/inxdex';
import Url from 'src/url';
// import { ShareHistoryModal } from './i18n-share-history-modal';
import { NameTranslationModal } from './i18n-name-translation-modal';
import { ContributorModal } from './i18n-contributor-modal';

// ==============================
//          侧边栏 对话框 翻译
// ==============================
export class I18NModal extends Modal {
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
        // this.regexps = ;
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

        const helpTitle = new Setting(this.titleEl).setClass('i18n__help').setName(t('I18N_HELP_TITLE_NAME'));

        new ButtonComponent(helpTitle.controlEl).setIcon('i18n_qq').setTooltip(t('I18N_HELP_TITLE_QQ_BUTTON_TIP')).setClass('i18n-button').onClick(() => { window.open(Url.QQ_GROUP) });
        // if (this.settings.I18N_SUBMIT_MODE) {
        //     const submiteHistoryButton = new ButtonComponent(helpTitle.controlEl);
        //     submiteHistoryButton.setIcon('history');
        //     submiteHistoryButton.setTooltip('云端提交记录');
        //     submiteHistoryButton.onClick(() => { new ShareHistoryModal(this.app, this.i18n).open() });
        //     const taskButton = new ButtonComponent(helpTitle.controlEl);
        //     taskButton.setIcon('task');
        //     taskButton.setTooltip('诚挚地邀请你帮助我们共同为插件进行翻译');
        //     taskButton.onClick(() => { window.open(Url.TASK) });
        // } 
        if (this.settings.I18N_MODE_NDT) new ButtonComponent(helpTitle.controlEl).setIcon('i18n-contributor').setTooltip('译文贡献榜单').setClass('i18n-button').onClick(() => { new ContributorModal(this.app, this.i18n).open() });
        if (this.settings.I18N_MODE_LDT && this.settings.I18N_NAME_TRANSLATION) { new ButtonComponent(helpTitle.controlEl).setClass('i18n-button').setClass('i18n-button--primary').setIcon('name-setting').setTooltip('插件列表').onClick(() => { this.close(); new NameTranslationModal(this.app, this.i18n).open(); }); }
        new ButtonComponent(helpTitle.controlEl).setIcon('settings').setTooltip(t('I18N_HELP_TITLE_SETTING_BUTTON_TIP')).setClass('i18n-button').onClick(() => { this.settingPlugins.open(); this.settingPlugins.openTabById(this.i18n.manifest.id); this.close(); });
        new ButtonComponent(helpTitle.controlEl).setIcon('circle-help').setTooltip(t('I18N_HELP_TITLE_HELP_BUTTON_TIP')).setClass('i18n-button').onClick(() => { new WizardModal(this.app, this.i18n).open() });
        if (this.developerMode) { new ButtonComponent(helpTitle.controlEl).setIcon('refresh-ccw').setTooltip('刷新插件').setClass('i18n-button').onClick(async () => { this.close(); await this.reloadPlugin(this.i18n.manifest.id); }); }

        const searchTitle = new Setting(this.titleEl).setClass('i18n__search').setName(t('I18N_SEARCH_TITLE_NAME'));
        searchTitle.addDropdown(cb => cb.addOptions(I18N_SORT).setValue(this.settings.I18N_SORT).onChange((value) => { this.settings.I18N_SORT = value; this.i18n.saveSettings(); this.reloadShowData(); }));
        searchTitle.addDropdown(cb => cb.addOptions(I18N_TYPE).setValue(this.settings.I18N_TYPE).onChange((value) => { this.settings.I18N_TYPE = value; this.i18n.saveSettings(); this.reloadShowData(); }));
        searchTitle.addSearch(cb => cb.setValue(this.settings.I18N_SEARCH_TEXT).onChange((value) => { this.settings.I18N_SEARCH_TEXT = value; this.i18n.saveSettings(); this.reloadShowData(); }));
        if (this.i18n.settings.I18N_RE_TEMP_MODE) { new Setting(this.titleEl).setClass('i18n__search').addText(cb => cb.setValue(this.settings.I18N_RE_TEMP).setPlaceholder('临时正则表达式(使用|分割)').onChange((value) => { this.settings.I18N_RE_TEMP = value; this.i18n.saveSettings(); this.regexps = [...this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE], ...this.i18n.settings.I18N_RE_TEMP.split('|')].filter(item => { return item !== '' }); }).inputEl.addClass('i18n__re-input')).infoEl.remove(); }
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
            if (stateObj.isStateDoc && stateObj.getState() && plugin.version != stateObj.getPluginVersion()) try { fs.removeSync(duplicateDoc); stateObj.reset(); this.i18n.notice.primary(t('I18N_UPDATE_HEAD'), plugin.name); } catch (e) { this.i18n.notice.error(t('I18N_UPDATE_HEAD'), e); }

            // ====================
            // 本地插件 vs 云端插件
            // ====================
            // 本地译文
            let localTranslationJson: Translation | undefined;
            // 云端译文介绍
            let cloudTranslationJson: TranslationDirectoryItem | undefined;

            // 译文格式是否正常标记
            let translationFormatMark = true;
            // 是否存在更新标记
            let updateMark = false;
            // 可下载的版本号
            let downloadVersion: string;
            // 当本地译文存在时 提取本地译文 并 判断译文格式
            if (isLangDoc) { try { localTranslationJson = fs.readJsonSync(langDoc); translationFormatMark = isValidTranslationFormat(localTranslationJson); } catch (e) { translationFormatMark = false; } }
            // 自动转换旧格式
            if (localTranslationJson && !('translationVersion' in localTranslationJson.manifest)) {
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
                localTranslationJson = {
                    manifest: {
                        translationVersion: new Date('1949-10-01T15:00:00+08:00').getTime(),
                        // @ts-ignore
                        pluginVersion: localTranslationJson.manifest.pluginVersion,
                    },
                    description: localTranslationJson.description,
                    dict: localTranslationJson.dict
                }
                fs.writeJsonSync(langDoc, localTranslationJson, { spaces: 4 });
                translationFormatMark = true;
                this.i18n.notice.result('格式转换', true, plugin.name);
            }

            // [云端模式] 当云端目录存在时 获取云端目录
            if (this.i18n.translationDirectoryMark) { cloudTranslationJson = this.i18n.translationDirectory.find((manifest) => manifest.id === plugin.id) }

            // [云端模式] 当云端目录存在时 判断是否存在云端插件
            if (this.i18n.translationDirectoryMark && cloudTranslationJson && translationFormatMark) {
                // 获取可下载的版本号
                downloadVersion = (plugin.version in cloudTranslationJson.translations ? true : false) ? plugin.version : Object.keys(cloudTranslationJson.translations).slice(-1)[0];
                // 判断是否有更新
                if (localTranslationJson) { updateMark = stateObj.getType() === 'download' && localTranslationJson.manifest.translationVersion < cloudTranslationJson.translations[downloadVersion] }
            }
            // #endregion

            // ============================================================
            //      插件基础功能(介绍 打开目录 删除目录 编辑译文 提交译文)
            // ============================================================
            // #region 插件基础功能(介绍 打开目录 删除目录 编辑译文 提交译文)
            // ====================
            // 插件介绍头部
            // ====================
            const itemEl = new Setting(this.contentEl);
            itemEl.setClass('i18n__item');
            itemEl.nameEl.addClass('i18n__item-title');

            // modal-header
            const desc: { mark: number, label: { color: string; text: string; }, text: string } = { mark: 1, label: { color: '', text: '' }, text: '' };
            if (stateObj.isStateDoc) {
                if (localTranslationJson && translationFormatMark) {
                    if (compareVersions(plugin.version, localTranslationJson.manifest.pluginVersion) === 1) {
                        desc.label.color = 'orange'; desc.label.text = t('I18N_ITEM_LABEL_D_NAME'); // 已过时
                    } else {
                        if (stateObj.getState()) {
                            desc.label.color = 'green'; desc.label.text = t('I18N_ITEM_LABEL_B_NAME');
                        } else { desc.label.color = 'red'; desc.label.text = t('I18N_ITEM_LABEL_C_NAME'); }
                    }
                    desc.text = `更新日期: ${formatTimestamp(Number(localTranslationJson?.manifest.translationVersion))} ${t('I18N_ITEM_LABEL_BCD_DESC_VERSION')}:[${localTranslationJson?.manifest.pluginVersion}]`;
                } else {
                    desc.label.color = 'red';
                    desc.label.text = t('I18N_ITEM_LABEL_E_NAME');
                    desc.text = t('I18N_ITEM_LABEL_E_DESC');
                }
            } else { desc.label.color = 'grey'; desc.label.text = t('I18N_ITEM_LABEL_A_NAME'); desc.text = t('I18N_ITEM_LABEL_A_DESC'); }
            if (this.i18n.ignoreMark && this.i18n.ignorePlugins.includes(plugin.id)) { desc.label.color = 'blue'; desc.label.text = '自带翻译'; desc.text = t('I18N_ITEM_LABEL_F_DESC'); }
            itemEl.nameEl.innerHTML = `<span class="i18n__item-state i18n__item-state--${desc.label.color}">${desc.label.text}</span><span class="i18n__item-title b"> ${plugin.name}</span> <span class="i18n__item-version" style="color:--simple-blue-2;">(${plugin.version})</span> `;
            itemEl.settingEl.onmouseover = (e) => { this.detailsEl.innerHTML = desc.text };
            itemEl.settingEl.onmouseout = (e) => { this.detailsEl.innerHTML = t('I18N_ITEM_LABEL_G_DESC') };

            // ====================
            // 打开插件设置
            // ====================
            if (this.settings.I18N_OPEN_SETTINGS && this.enabledPlugins.has(plugin.id)) {
                const openPluginSetting = new ExtraButtonComponent(itemEl.controlEl).setIcon('settings').setTooltip(t('I18N_ITEM_OPEN_SETTING_BUTTON_TIP')).onClick(() => {
                    openPluginSetting.setDisabled(true);
                    this.settingPlugins.open();
                    this.settingPlugins.openTabById(plugin.id);
                    this.close();
                });
            }

            // ====================
            // 打开插件目录(打开)
            // ====================
            const openPluginDirButton = new ExtraButtonComponent(itemEl.controlEl).setIcon('folder-open').setTooltip(t('I18N_ITEM_OPEN_DIR_BUTTON_TIP')).onClick(() => {
                openPluginDirButton.setDisabled(true);
                if (navigator.userAgent.match(/Win/i)) {
                    // const command = `powershell.exe -Command "Invoke-Item \\"${pluginDir}\\""`;
                    const command = `start "" "${pluginDir}"`
                    exec(command, (error) => {
                        if (error) {
                            this.i18n.notice.result(t('I18N_ITEM_OPEN_DIR_BUTTON_NOTICE_HEAD'), false, error);
                        } else {
                            this.i18n.notice.result(t('I18N_ITEM_OPEN_DIR_BUTTON_NOTICE_HEAD'), true);
                        }
                    });
                }
                if (navigator.userAgent.match(/Mac/i)) {
                    const command = `open ${mainDoc}`
                    exec(command, (error) => {
                        if (error) {
                            this.i18n.notice.result(t('I18N_ITEM_OPEN_DIR_BUTTON_NOTICE_HEAD'), false, error);
                        } else {
                            this.i18n.notice.result(t('I18N_ITEM_OPEN_DIR_BUTTON_NOTICE_HEAD'), true);
                        }
                    });
                }
                openPluginDirButton.setDisabled(false);
            });

            // ====================
            // 清空翻译文件(删除)
            // ====================
            if (isLangDir) {
                const deletePluginDirButton = new ExtraButtonComponent(itemEl.controlEl).setIcon('trash').setTooltip(t('I18N_ITEM_DELETE_DIR_BUTTON_TIP')).onClick(() => {
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
                        this.i18n.notice.result(t('I18N_ITEM_DELETE_DIR_BUTTON_NOTICE_HEAD'), true);
                    } catch (error) {
                        this.i18n.notice.result(t('I18N_ITEM_DELETE_DIR_BUTTON_NOTICE_HEAD'), false, error);
                    }
                    this.reloadShowData();
                });
            }

            // ====================
            // 编辑译文
            // ====================
            if (translationFormatMark && isLangDoc && this.settings.I18N_EDIT_MODE) {
                new ExtraButtonComponent(itemEl.controlEl).setIcon('pencil').setTooltip(t('I18N_ITEM_EDIT_TRANSLATION_BUTTON_TIP')).onClick(() => {
                    this.i18n.editorTranslationDoc = langDoc;
                    this.i18n.activateEditView();
                });
            }

            // ====================
            // 译文提交模式
            // ====================
            if (this.settings.I18N_SHARE_MODE && translationFormatMark && isLangDoc) {
                const submitTranslationButton = new ExtraButtonComponent(itemEl.controlEl);
                submitTranslationButton.setIcon('cloud-upload');
                submitTranslationButton.setTooltip(t('I18N_ITEM_SUBMIT_TRANSLATION_BUTTON_TIP'));
                submitTranslationButton.onClick(() => {
                    this.i18n.shareTranslationDoc = langDoc;
                    this.i18n.sharePluginObj = plugin;
                    this.i18n.activateShareView();
                });

            }
            // #endregion

            // ============================================================
            //                     本地译文翻译(提取) 
            // ============================================================
            if (this.settings.I18N_MODE_LDT && !isLangDoc) {
                itemEl.controlEl.createEl('button', { text: t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_TEXT'), cls: ['i18n-button', 'i18n-button--primary'] }, (el) => {
                    el.addEventListener("click", () => {
                        try {
                            // 1. 获取 main.js 字符串
                            const mainStr = fs.readFileSync(mainDoc).toString();
                            // 2. 获取 manifest.json JSON文本
                            const manifestJSON = fs.readJsonSync(manifestDoc);
                            // 3. 生成译文
                            const translationJson = generateTranslation(plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                            // 4. 确保语言目录存在
                            fs.ensureDirSync(langDir);
                            // 5. 将 译文json 写入文件
                            fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                            // 6. 生成 状态文件
                            stateObj.insert();
                            stateObj.setType('extract');
                            this.i18n.notice.result(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_HEAD'), true, t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_CONTENT_A'));
                        } catch (error) {
                            this.i18n.notice.result(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_HEAD'), false, `${error}`);
                        }
                        this.reloadShowData();
                    });
                });
            }
            // ============================================================
            //                     本地译文翻译(增量提取) 
            // ============================================================
            if (this.settings.I18N_MODE_LDT && this.settings.I18N_INCREMENTAL_EXTRACTION && isLangDoc && translationFormatMark) {
                itemEl.controlEl.createEl('button', { text: t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_TEXT'), cls: ['i18n-button', 'i18n-button--primary'] }, (el) => {
                    el.addEventListener("click", () => {
                        if (stateObj.isStateDoc && !stateObj.getState()) {
                            try {
                                // 1. 原始的译文
                                const originalTranslationJson = fs.readJsonSync(langDoc);
                                // 2. 获取 main.js 字符串
                                const modifiedTranslationJson = generateTranslation(plugin.version, fs.readJsonSync(manifestDoc), fs.readFileSync(mainDoc).toString(), this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                                // 3. 将旧译文合并到新译文中
                                modifiedTranslationJson.manifest = originalTranslationJson.manifest;
                                modifiedTranslationJson.description = originalTranslationJson.description;
                                modifiedTranslationJson.dict = { ...modifiedTranslationJson.dict, ...originalTranslationJson.dict };
                                // 4. 确保语言目录存在
                                fs.ensureDirSync(langDir);
                                // 5. 将 译文json 写入文件
                                fs.writeJsonSync(langDoc, modifiedTranslationJson, { spaces: 4 });
                                this.i18n.notice.result(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_HEAD'), true, `提取译文${Object.keys(modifiedTranslationJson.dict).length - Object.keys(originalTranslationJson.dict).length}条`);
                            } catch (error) {
                                this.i18n.notice.result(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_HEAD'), false, `${error}`);
                            }
                        } else {
                            this.i18n.notice.result(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_HEAD'), false, '请还原插件后再进行提取');
                        }
                    });
                });
            }

            // ============================================================
            //                  网络译文翻译(下载、更新)
            // ============================================================
            if (this.settings.I18N_MODE_NDT && this.i18n.translationDirectory && translationFormatMark && cloudTranslationJson != undefined) {
                if (!isLangDoc) {
                    itemEl.controlEl.createEl('button', { text: t('I18N_ITEM_DOWNLOAD_TRANSLATION_BUTTON_TEXT'), cls: ['i18n-button', 'i18n-button--primary'] }, (el) => {
                        el.addEventListener("click", async () => {
                            try {
                                // 1. 确保语言目录存在
                                fs.ensureDirSync(langDir);
                                // 2. 从云端获取译文
                                const res = await this.i18n.api.giteeGetTranslation(plugin.id, downloadVersion);
                                if (res.state) {
                                    fs.writeJsonSync(langDoc, res.data, { spaces: 4 })
                                    // 4. 生成 状态文件
                                    stateObj.insert();
                                    // 5. 更新 状态文件
                                    stateObj.setType('download');
                                    this.i18n.notice.result(t('I18N_ITEM_DOWNLOAD_TRANSLATION_BUTTON_NOTICE_HEAD'), true);
                                } else {
                                    this.i18n.notice.result(t('I18N_ITEM_DOWNLOAD_TRANSLATION_BUTTON_NOTICE_HEAD'), false)
                                }
                            } catch (error) {
                                this.i18n.notice.result(t('I18N_ITEM_DOWNLOAD_TRANSLATION_BUTTON_NOTICE_HEAD'), false, error);
                            }
                            await this.reloadShowData();
                        });
                    });
                }
                if (isLangDoc && updateMark) {
                    itemEl.controlEl.createEl('button', { text: t('I18N_ITEM_UPDATE_TRANSLATION_BUTTON_TEXT'), cls: ['i18n-button', 'i18n-button--primary'] }, (el) => {
                        el.addEventListener("click", async () => {
                            try {
                                // 1. 从云端获取译文
                                const res = await this.i18n.api.giteeGetTranslation(plugin.id, downloadVersion);
                                if (res.state) {
                                    fs.writeJsonSync(langDoc, res.data, { spaces: 4 });
                                    // 3. 生成 状态文件
                                    stateObj.insert();
                                    // 4. 更新 状态文件
                                    stateObj.setType('download');
                                    this.i18n.notice.result(t('I18N_ITEM_UPDATE_TRANSLATION_BUTTON_NOTICE_HEAD'), true);
                                } else {
                                    this.i18n.notice.result(t('I18N_ITEM_UPDATE_TRANSLATION_BUTTON_NOTICE_HEAD'), false)
                                }

                            } catch (error) {
                                this.i18n.notice.result(t('I18N_ITEM_UPDATE_TRANSLATION_BUTTON_NOTICE_HEAD'), false, error);
                            }
                            await this.reloadShowData();
                        });
                    });
                }
            }

            // ============================================================
            //                    网络接口翻译(生成)
            // ============================================================
            if (this.settings.I18N_MODE_NIT && !isLangDoc) {
                itemEl.controlEl.createEl('button', { text: API_TYPES[this.settings.I18N_NIT_API], cls: ['i18n-button', 'i18n-button--primary'] }, (el) => {
                    el.addEventListener("click", async () => {
                        try {
                            const mainStr = fs.readFileSync(mainDoc).toString();
                            // 2. 获取 manifest.json JSON文本
                            const manifestJSON = fs.readJsonSync(manifestDoc);
                            // 3. 转换为译文格式
                            const translationJson = generateTranslation(plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                            const regex = /(['"`])(.*)(\1)/;
                            let temp = 0;
                            // 百度
                            if (this.settings.I18N_NIT_API == 'BAIDU') {
                                const response = await this.i18n.api.baiduAPI(translationJson.description.original);
                                translationJson.description.translation = response.state ? response.data : translationJson.description.original;
                                await sleep(this.settings.I18N_NIT_API_INTERVAL);
                                for (const key in translationJson.dict) {
                                    this.i18n.notice.info(t('I18N_ITEM_MACHINE_TRANSLATION_BUTTON_NOTICE_HEAD'), `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
                                    const tempArray = key.match(regex);
                                    if (tempArray != null) {
                                        const response = await this.i18n.api.baiduAPI(tempArray[2]);
                                        translationJson.dict[key] = response.state ? key.replace(tempArray[2], response.data) : key;
                                        await sleep(this.settings.I18N_NIT_API_INTERVAL);
                                    }
                                }
                            }
                            // OPENAI
                            if (this.settings.I18N_NIT_API == 'OPENAI') {
                                // 4. 翻译 描述
                                const response = await this.i18n.api.openAI(plugin.name, translationJson.description.original);
                                if ('content' in response) { translationJson.description.translation = response.content }
                                else { translationJson.description.translation = translationJson.description.original; }
                                await sleep(this.settings.I18N_NIT_API_INTERVAL);
                                // 5. 翻译 字典
                                for (const key in translationJson.dict) {
                                    this.i18n.notice.info(t('I18N_ITEM_MACHINE_TRANSLATION_BUTTON_NOTICE_HEAD'), `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
                                    const tempArray = key.match(regex);
                                    if (tempArray != null) {
                                        const response = await this.i18n.api.openAI(plugin.name, tempArray[2]);
                                        if ('content' in response) {
                                            translationJson.dict[key] = key.replace(tempArray[2], response.content);
                                        } else {
                                            translationJson.dict[key] = key;
                                        }
                                        await sleep(this.settings.I18N_NIT_API_INTERVAL);
                                    }
                                }
                            }
                            fs.ensureDirSync(langDir);
                            fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                            // 生成 状态文件
                            stateObj.insert();
                            stateObj.setType('extract');
                        } catch (error) {
                            this.i18n.notice.result(t('I18N_ITEM_MACHINE_TRANSLATION_BUTTON_NOTICE_HEAD'), false, error);
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
                    itemEl.controlEl.createEl('button', { text: '替换', cls: ['i18n-button', 'i18n-button--primary'] }, (el) => {
                        el.addEventListener("click", () => {
                            try {
                                // 1. 读取译文
                                const translationJson: Translation = fs.readJsonSync(langDoc);
                                // 2. 检测译文是否翻译
                                if (translationJson && Object.keys(translationJson.dict).every(key => translationJson.dict[key] === key)) { this.i18n.notice.result(t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_HEAD'), false, '译文未翻译，请先翻译译文'); return; }
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
                                this.i18n.notice.result(t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_HEAD'), false, error);
                            }
                            this.reloadShowData();
                        });
                    });

                }
                // 还原按钮
                if (stateObj.getState() == true) {
                    itemEl.controlEl.createEl('button', { text: t('I18N_ITEM_RESTORE_BUTTON_TEXT'), cls: ['i18n-button', 'i18n-button--primary'] }, (el) => {
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
                                this.i18n.notice.result(t('I18N_ITEM_RESTORE_BUTTON_NOTICE_HEAD'), true)
                            } catch (error) {
                                // NoticeOperationResult(t('I18N_ITEM_RESTORE_BUTTON_NOTICE_HEAD'), false, error);
                                this.i18n.notice.result(t('I18N_ITEM_RESTORE_BUTTON_NOTICE_HEAD'), false, error)
                            }
                            // 9. 刷新
                            this.reloadShowData();
                        });
                    });
                }
            }

            if (this.developerMode) {
                itemEl.controlEl.createEl('button', { text: '测试', cls: ['i18n-button', 'i18n-button--primary'] }, (el) => {
                    el.addEventListener("click", async () => {
                        // @ts-ignore
                        const dir = path.join(this.app.vault.adapter.getBasePath(), this.i18n.manifest.dir, 'Admin');
                        // @ts-ignore
                        const doc = path.join(this.app.vault.adapter.getBasePath(), this.i18n.manifest.dir, 'Admin', `${this.i18n.settings.I18N_LANGUAGE}.json`);
                        console.log(dir)
                        console.log(doc)
                    });
                });

            }
        }

    }

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
        // console.log('调用了[开启]');
        await this.showHead();
        await this.showData();
    }

    // [关闭]
    async onClose() {
        // console.log('调用了[关闭]');
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

    translationMain(translationJson: Translation, mainString: string) {
        for (const key in translationJson.dict) { mainString = mainString.replaceAll(key, translationJson.dict[key]) }
        this.i18n.notice.result(t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_HEAD'), true, t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_CONTENT_A'));
        return mainString;
    }
}