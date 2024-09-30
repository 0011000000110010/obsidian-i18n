import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';

import { App, ButtonComponent, ExtraButtonComponent, Modal, PluginManifest, Setting } from 'obsidian';
import I18N from 'main';
import { I18nSettings } from '../settings/data';

import { Manifest, Translation } from 'src/data/types';
import { API_TYPES, I18N_SORT, I18N_TYPE } from 'src/data/data';
import { NoticeError, State, generateTranslation, NoticeInfo, NoticeOperationResult, compareVersions, NoticePrimary, NoticeWarning } from '../utils';
import { I18NSubmiteModal } from './i18n-submite-modal';
import { WizardModal } from './i18n-wizard-modal';

import { t } from '../lang/inxdex';
import Url from 'src/url';


// prompt
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
        this.regexps = this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE];
    }
    footEl: HTMLDivElement;
    // ============================================================
    //                        展示操作
    // ============================================================
    public async showHead() {
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n_modal');
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);
        this.titleEl.addClass('i18n_modal_title');
        this.contentEl.addClass('i18n_modal_item_box');

        this.footEl = document.createElement("div");
        this.footEl.addClass('i18n_modal_foot');
        modalEl.appendChild(this.footEl);

        const helpTitle = new Setting(this.titleEl);
        helpTitle.setClass('i18n_modal_title_help');
        helpTitle.setName(t('I18N_HELP_TITLE_NAME'));

        const helpQQButton = new ButtonComponent(helpTitle.controlEl);
        helpQQButton.setIcon('i18n_qq');
        helpQQButton.setTooltip(t('I18N_HELP_TITLE_QQ_BUTTON_TIP'));
        helpQQButton.onClick(() => { window.open(Url.QQ_GROUP) });

        const helpSettingButton = new ButtonComponent(helpTitle.controlEl);
        helpSettingButton.setIcon('settings');
        helpSettingButton.setTooltip(t('I18N_HELP_TITLE_SETTING_BUTTON_TIP'));
        helpSettingButton.onClick(() => {
            this.settingPlugins.open();
            this.settingPlugins.openTabById(this.i18n.manifest.id);
            this.close();
        });

        const helpButton = new ButtonComponent(helpTitle.controlEl);
        helpButton.setIcon('circle-help');
        helpButton.setTooltip(t('I18N_HELP_TITLE_HELP_BUTTON_TIP'));
        helpButton.onClick(() => { new WizardModal(this.app, this.i18n).open() });

        if (this.developerMode) {
            const reload = new ButtonComponent(helpTitle.controlEl);
            reload.setIcon('refresh-ccw');
            reload.setTooltip('刷新插件');
            reload.onClick(async () => {
                await this.reloadPlugin(this.i18n.manifest.id);
                this.close();
            });
        }

        const searchTitle = new Setting(this.titleEl);
        searchTitle.setClass('i18n_modal_title_search');
        searchTitle.setName(t('I18N_SEARCH_TITLE_NAME'));
        searchTitle.addDropdown(cb => cb
            .addOptions(I18N_SORT)
            .setValue(this.settings.I18N_SORT)
            .onChange((value) => {
                this.settings.I18N_SORT = value;
                this.i18n.saveSettings();
                this.reloadShowData();
            })
        );
        searchTitle.addDropdown(cb => cb
            .addOptions(I18N_TYPE)
            .setValue(this.settings.I18N_TYPE)
            .onChange((value) => {
                this.settings.I18N_TYPE = value;
                this.i18n.saveSettings();
                this.reloadShowData();
            })
        );
        searchTitle.addSearch(cb => cb
            .setValue(this.settings.I18N_SEARCH_TEXT)
            .onChange((value) => {
                this.settings.I18N_SEARCH_TEXT = value;
                this.i18n.saveSettings();
                this.reloadShowData();
            })
        );

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
            case '0':  // 全部
                break
            case '1':  // 未提取
                for (const plugin of this.showPlugins) {
                    // @ts-ignore
                    const pluginDir = path.join(this.basePath, plugin.dir);
                    if (fs.pathExistsSync(path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`))) {
                        idsToRemove.push(plugin.id);
                    }
                }
                this.showPlugins = this.showPlugins.filter(plugin => !idsToRemove.includes(plugin.id));
                break
            case '2':  // 未翻译
                for (const plugin of this.showPlugins) {
                    // @ts-ignore
                    const pluginDir = path.join(this.basePath, plugin.dir);
                    const stateDoc = path.join(pluginDir, 'lang', 'state.json');
                    const isStateDoc = fs.pathExistsSync(stateDoc);
                    if (fs.pathExistsSync(path.join(pluginDir, 'lang')) && isStateDoc) { if (fs.readJsonSync(stateDoc).state != false) { idsToRemove.push(plugin.id) } }
                    else { idsToRemove.push(plugin.id) }
                }
                this.showPlugins = this.showPlugins.filter(plugin => !idsToRemove.includes(plugin.id));
                break
            case '3':  // 已翻译
                for (const plugin of this.showPlugins) {
                    // @ts-ignore
                    const pluginDir = path.join(this.basePath, plugin.dir);
                    const stateDoc = path.join(pluginDir, 'lang', 'state.json');
                    const isStateDoc = fs.pathExistsSync(stateDoc);
                    if (fs.pathExistsSync(path.join(pluginDir, 'lang')) && isStateDoc) { if (fs.readJsonSync(stateDoc).state != true) { idsToRemove.push(plugin.id) } }
                    else { idsToRemove.push(plugin.id) }
                }
                this.showPlugins = this.showPlugins.filter(plugin => !idsToRemove.includes(plugin.id));
                break
        }
        // 排序
        switch (this.settings.I18N_SORT) {
            case '0':  // 正序
                this.showPlugins.sort((item1, item2) => { return item1.name.localeCompare(item2.name) });
                break
            case '1':  // 倒序
                this.showPlugins.sort((item1, item2) => { return item2.name.localeCompare(item1.name) });
                break
        }

        // ==============================
        //           主逻辑
        // ==============================
        for (const plugin of this.showPlugins) {
            // ============================================================
            //                         路径及其状态
            // ============================================================
            // #region
            // @ts-ignore
            const pluginDir = path.join(this.basePath, plugin.dir);
            const langDir = path.join(pluginDir, 'lang');
            const langDoc = path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`);
            const stateDoc = path.join(pluginDir, 'lang', 'state.json');
            const isLangDir = fs.pathExistsSync(langDir);
            const isLangDoc = fs.pathExistsSync(langDoc);
            let isStateDoc = fs.pathExistsSync(stateDoc);
            const manifestDoc = path.join(pluginDir, 'manifest.json');
            const mainDoc = path.join(pluginDir, 'main.js');
            const duplicateDoc = path.join(pluginDir, 'duplicate.js');

            // 创建状态文件对象
            const stateObj = new State(stateDoc);

            // 当状态文件不存在时创建状态文件
            if (isLangDir && !isStateDoc) {
                try { stateObj.insert(); isStateDoc = fs.pathExistsSync(stateDoc); }
                catch (e) { NoticeError(t('I18N_STATE_HEAD'), e); }
            }
            // 插件更新(更新还原插件状态)
            if (isStateDoc && stateObj.state() && plugin.version != stateObj.pluginVersion())
                try { fs.removeSync(duplicateDoc); stateObj.reset(); NoticePrimary(t('I18N_UPDATE_HEAD'), plugin.name); } catch (e) { NoticeError(t('I18N_UPDATE_HEAD'), e); }

            // ====================
            // 本地插件 vs 云端插件
            // ====================
            // 本地译文
            let localTranslationJson: Translation | undefined;
            // 云端译文介绍
            let cloudTranslationJson: Manifest | undefined;
            // 判断 本地插件和云端插件 版本是否相同标记
            let isPluginsVersionSameMark: number;
            // 判断 本地译文和云端译文 版本是否相同标记
            let isTranslationVersionSameMark: number;
            // 云端最新版插件版本号
            let latestCloudVersion: string;
            // 译文格式是否正常标记
            let translationFormatMark: boolean = true;
            // 当本地译文存在时 提取本地译文 并 判断译文格式
            if (isLangDoc) {
                try {
                    localTranslationJson = fs.readJsonSync(langDoc);
                    // 运行时检查以确保localTranslationJson包含所有必要的字段  
                    if (
                        localTranslationJson !== undefined &&
                        'manifest' in localTranslationJson &&
                        'id' in localTranslationJson.manifest &&
                        'author' in localTranslationJson.manifest &&
                        'version' in localTranslationJson.manifest &&
                        'pluginVersion' in localTranslationJson.manifest &&
                        'description' in localTranslationJson &&
                        'original' in localTranslationJson.description &&
                        'translation' in localTranslationJson.description &&
                        'dict' in localTranslationJson
                    ) {
                        translationFormatMark = true; // 格式正确

                    } else {
                        translationFormatMark = false;
                    }
                } catch (e) {
                    translationFormatMark = false;
                }
            }
            // 当云端译文存在时 获取云端译文
            if (this.i18n.directoryMark) { cloudTranslationJson = this.i18n.directory.find((manifest: Manifest) => manifest.id === plugin.id) }
            // 判断本地译文和云端译文 及 本地插件和云端插件
            if (cloudTranslationJson !== undefined) {
                // 判断 云端是否存在与本地插件相同版本的译文
                const tempCloud = cloudTranslationJson.translations.find(translation => translation.pluginVersion === localTranslationJson?.manifest.pluginVersion) !== undefined ? true : false;
                // 最新云端版本
                latestCloudVersion = tempCloud ? plugin.version : cloudTranslationJson.translations.slice(-1)[0].pluginVersion;
                // 最新云端版本号对象
                const temp = cloudTranslationJson.translations.find(translation => translation.pluginVersion === latestCloudVersion);
                // 判断 本地译文和云端译文 版本是否相同标记
                if (localTranslationJson !== undefined && temp != undefined && translationFormatMark) {
                    isPluginsVersionSameMark = compareVersions(localTranslationJson.manifest.pluginVersion, temp.pluginVersion);
                    isTranslationVersionSameMark = compareVersions(localTranslationJson.manifest.version, temp.translationVersion);
                }
                // 测试
                // if (localTranslationJson !== undefined) {
                //     console.log(`=====${plugin.id}=====`);
                //     console.log(`本地最新插件版本 ${localTranslationJson.manifest.pluginVersion}`)
                //     console.log(`云端最新插件版本 ${latestCloudVersion}`);
                //     if (temp != undefined) {
                //         console.log(`本地最新译文版本 ${localTranslationJson.manifest.version}`)
                //         console.log(`云端最新译文版本 ${temp.translationVersion}`);
                //     }
                // }
            }
            // #endregion

            // ============================================================
            //      插件基础功能(介绍 打开目录 删除目录 编辑译文 提交译文)
            // ============================================================
            // #region
            // ====================
            // 插件介绍头部
            // ====================
            const itemEl = new Setting(this.contentEl);
            itemEl.setClass('i18n_modal_item');
            itemEl.nameEl.addClass('i18n_modal_item_title');
            // @ts-ignore
            let desc: { mark: number, label: { color: string; text: string; }, text: string }
                = { mark: 1, label: { color: '', text: '' }, text: '' };
            if (isLangDoc) {
                if (translationFormatMark) {
                    // (大的是负数小的是正数)
                    if (compareVersions(plugin.version, localTranslationJson?.manifest.pluginVersion as string) === 1) {
                        desc.label.color = 'orange';
                        desc.label.text = t('I18N_ITEM_LABEL_D_NAME'); // 已过时
                    } else {
                        if (stateObj.state()) {
                            desc.label.color = 'green';
                            desc.label.text = t('I18N_ITEM_LABEL_B_NAME'); // 已翻译
                        } else {
                            desc.label.color = 'red';
                            desc.label.text = t('I18N_ITEM_LABEL_C_NAME'); // 未翻译
                        }
                    }
                    desc.text = `${t('I18N_ITEM_LABEL_BCD_DESC_AUTHOR')}:${localTranslationJson?.manifest.author}(${localTranslationJson?.manifest.version}) ${t('I18N_ITEM_LABEL_BCD_DESC_VERSION')}:${localTranslationJson?.manifest.pluginVersion}`;
                } else {
                    desc.label.color = 'red';
                    desc.label.text = t('I18N_ITEM_LABEL_E_NAME');
                    desc.text = t('I18N_ITEM_LABEL_E_DESC');
                }
            } else {
                desc.label.color = 'grey';
                desc.label.text = t('I18N_ITEM_LABEL_A_NAME');
                desc.text = t('I18N_ITEM_LABEL_A_DESC');
            }
            if (this.i18n.ignoreMark && this.i18n.ignorePlugins.includes(plugin.id)) {
                desc.label.color = 'blue';
                desc.label.text = t('I18N_ITEM_LABEL_F_NAME');
                desc.text = t('I18N_ITEM_LABEL_F_DESC');
            }

            itemEl.nameEl.innerHTML = `
            <span class="i18n_modal_item_state i18n_modal_item_state_${desc.label.color}">${desc.label.text}</span>
            <span class="i18n_modal_item_title">${plugin.name}</span> 
            <span class="i18n_modal_item_version" style="color:--simple-blue-2;">(${plugin.version})</span> 
            `;
            itemEl.settingEl.onmouseover = (e) => { this.footEl.innerHTML = desc.text };
            itemEl.settingEl.onmouseout = (e) => { this.footEl.innerHTML = t('I18N_ITEM_LABEL_G_DESC') };

            // ====================
            // 打开插件设置
            // ====================
            if (this.settings.I18N_OPEN_SETTINGS && this.enabledPlugins.has(plugin.id)) {
                const openPluginSetting = new ExtraButtonComponent(itemEl.controlEl);
                openPluginSetting.setIcon('settings');
                openPluginSetting.setTooltip(t('I18N_ITEM_OPEN_SETTING_BUTTON_TIP'));
                openPluginSetting.onClick(() => {
                    openPluginSetting.setDisabled(true);
                    this.settingPlugins.open();
                    this.settingPlugins.openTabById(plugin.id);
                    this.close();
                });
            }

            // ====================
            // 打开插件目录(打开)
            // ====================
            // eslint-disable-next-line no-constant-condition
            if (true) {
                const openPluginDirButton = new ExtraButtonComponent(itemEl.controlEl);
                openPluginDirButton.setIcon('folder-open');
                openPluginDirButton.setTooltip(t('I18N_ITEM_OPEN_DIR_BUTTON_TIP'));
                openPluginDirButton.onClick(() => {
                    openPluginDirButton.setDisabled(true);
                    if (navigator.userAgent.match(/Win/i)) {
                        // const command = `powershell.exe -Command "Invoke-Item \\"${pluginDir}\\""`;
                        const command = `start ${pluginDir}`
                        exec(command, (error) => {
                            if (error) {
                                NoticeOperationResult(t('I18N_ITEM_OPEN_DIR_BUTTON_NOTICE_HEAD'), false, error);
                            } else {
                                NoticeOperationResult(t('I18N_ITEM_OPEN_DIR_BUTTON_NOTICE_HEAD'), true);
                            }
                        });
                    }
                    if (navigator.userAgent.match(/Mac/i)) {
                        const command = `open ${mainDoc}`
                        exec(command, (error) => {
                            if (error) {
                                NoticeOperationResult(t('I18N_ITEM_OPEN_DIR_BUTTON_NOTICE_HEAD'), false, error);
                            } else {
                                NoticeOperationResult(t('I18N_ITEM_OPEN_DIR_BUTTON_NOTICE_HEAD'), true);
                            }
                        });
                    }
                    openPluginDirButton.setDisabled(false);
                });
            }
            // ====================
            // 清空翻译文件(删除)
            // ====================
            if (isLangDir) {
                const deletePluginDirButton = new ExtraButtonComponent(itemEl.controlEl);
                deletePluginDirButton.setIcon('trash');
                deletePluginDirButton.setTooltip(t('I18N_ITEM_DELETE_DIR_BUTTON_TIP'));
                deletePluginDirButton.onClick(() => {
                    deletePluginDirButton.setDisabled(true);
                    try {
                        // 当为已翻译状态时
                        if (stateObj.state()) {
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
                        NoticeOperationResult(t('I18N_ITEM_DELETE_DIR_BUTTON_NOTICE_HEAD'), true);
                    } catch (error) {
                        NoticeOperationResult(t('I18N_ITEM_DELETE_DIR_BUTTON_NOTICE_HEAD'), false, error);
                    }
                    this.reloadShowData();
                });
            }
            // ====================
            // 编辑译文
            // ====================
            if (translationFormatMark && isLangDoc && this.settings.I18N_EDIT_MODE) {
                const editTranslationButton = new ExtraButtonComponent(itemEl.controlEl);
                editTranslationButton.setIcon('pencil');
                editTranslationButton.setTooltip(t('I18N_ITEM_EDIT_TRANSLATION_BUTTON_TIP'));
                editTranslationButton.onClick(() => {
                    this.i18n.selectTranslation = langDoc;
                    this.i18n.activateEditView();
                });
            }
            // ====================
            // 译文提交模式
            // ====================
            if (this.settings.I18N_SUBMIT_MODE && translationFormatMark && (this.i18n.tempSubmitUrl != undefined || this.i18n.settings.I18N_SUBMIT_URL != "")) {
                const submitTranslationButton = new ExtraButtonComponent(itemEl.controlEl);
                submitTranslationButton.setIcon('cloud-upload');
                submitTranslationButton.setTooltip(t('I18N_ITEM_SUBMIT_TRANSLATION_BUTTON_TIP'));
                submitTranslationButton.onClick(() => { new I18NSubmiteModal(this.app, this.i18n, plugin, langDoc).open() });
            }
            // #endregion

            // ============================================================
            //                     本地译文翻译(提取) 
            // ============================================================
            if (this.settings.I18N_MODE_LDT && !isLangDoc) {
                const ExtractTranslationButton = new ButtonComponent(itemEl.controlEl);
                ExtractTranslationButton.setClass('bt');
                ExtractTranslationButton.setButtonText(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_TEXT'));
                ExtractTranslationButton.setTooltip(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_TIP'));
                ExtractTranslationButton.onClick(() => {
                    ExtractTranslationButton.setDisabled(true);
                    try {
                        // 1. 获取 main.js 字符串
                        const mainStr = fs.readFileSync(mainDoc).toString();
                        // 2. 获取 manifest.json JSON文本
                        const manifestJSON = fs.readJsonSync(manifestDoc);
                        // 3. 生成译文
                        const translationJson = generateTranslation(plugin.id, this.settings.I18N_AUTHOR, "1.0.0", plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                        // 4. 确保语言目录存在
                        fs.ensureDirSync(langDir);
                        // 5. 将 译文json 写入文件
                        fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                        NoticeOperationResult(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_HEAD'), true, t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_CONTENT_A'));
                    } catch (error) {
                        NoticeOperationResult(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_NOTICE_HEAD'), false, `${error}`);
                    }
                    this.reloadShowData();
                });
            }
            // ============================================================
            //                     本地译文翻译(增量提取) 
            // ============================================================
            if (this.settings.I18N_MODE_LDT && this.settings.I18N_INCREMENTAL_EXTRACTION && isLangDoc && translationFormatMark) {
                const IncrementExtractTranslationButton = new ButtonComponent(itemEl.controlEl);
                IncrementExtractTranslationButton.setClass('bt');
                IncrementExtractTranslationButton.setButtonText(t('I18N_ITEM_EXTRACT_TRANSLATION_BUTTON_TEXT'));
                IncrementExtractTranslationButton.onClick(async () => {
                    if (localTranslationJson != null) {
                        const translationJson = localTranslationJson;
                        let mainStr;
                        if (stateObj.state() == true) { mainStr = fs.readJsonSync(duplicateDoc).toString() }
                        else { mainStr = fs.readFileSync(mainDoc).toString(); }
                        // 2. 获取 manifest.json JSON文本
                        const manifestJSON = fs.readJsonSync(manifestDoc);
                        // 3. 生成译文
                        const newTranslationJson = generateTranslation(plugin.id, this.settings.I18N_AUTHOR, "1.0.0", plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                        const mergedObj = { ...newTranslationJson.dict, ...translationJson.dict };
                        translationJson.dict = mergedObj;
                        // 4. 确保语言目录存在
                        fs.ensureDirSync(langDir);
                        // 5. 将 译文json 写入文件
                        fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                    }
                });
            }


            // ============================================================
            //                  网络译文翻译(下载、更新)
            // ============================================================
            // 开启云端模式 云端目录标记 译文格式正常 云端存在
            if (this.settings.I18N_MODE_NDT && this.i18n.directoryMark && translationFormatMark && cloudTranslationJson != undefined) {
                // 下载
                const downloadTranslationButton = new ButtonComponent(itemEl.controlEl);
                if (isLangDoc) downloadTranslationButton.setClass('i18n_display-none');
                downloadTranslationButton.setClass('bt');
                downloadTranslationButton.setButtonText(t('I18N_ITEM_DOWNLOAD_TRANSLATION_BUTTON_TEXT'));
                downloadTranslationButton.setTooltip(t('I18N_ITEM_DOWNLOAD_TRANSLATION_BUTTON_TIP'));
                downloadTranslationButton.onClick(async () => {
                    downloadTranslationButton.setDisabled(true);
                    try {
                        // 1. 
                        fs.ensureDirSync(langDir);
                        // 2. 获取译文并写入文件
                        fs.writeJsonSync(langDoc, await this.i18n.api.translation(plugin.id, latestCloudVersion), { spaces: 4 });
                        NoticeOperationResult(t('I18N_ITEM_DOWNLOAD_TRANSLATION_BUTTON_NOTICE_HEAD'), true);
                    } catch (error) {
                        NoticeOperationResult(t('I18N_ITEM_DOWNLOAD_TRANSLATION_BUTTON_NOTICE_HEAD'), false, error);
                    }
                    await this.reloadShowData();
                });

                // 更新
                const updateTranslationButton = new ButtonComponent(itemEl.controlEl);
                // @ts-ignore
                if (!(isLangDoc && (isPluginsVersionSameMark == -1 || isTranslationVersionSameMark == -1))) updateTranslationButton.setClass('i18n_display-none');
                updateTranslationButton.setButtonText(t('I18N_ITEM_UPDATE_TRANSLATION_BUTTON_TEXT'));
                updateTranslationButton.setClass('bt');
                updateTranslationButton.setTooltip(t('I18N_ITEM_UPDATE_TRANSLATION_BUTTON_TIP'));
                updateTranslationButton.onClick(async () => {
                    updateTranslationButton.setDisabled(true);
                    try {
                        // 1. 获取译文并写入文件
                        fs.writeJsonSync(langDoc, await this.i18n.api.translation(plugin.id, latestCloudVersion), { spaces: 4 });
                        NoticeOperationResult(t('I18N_ITEM_UPDATE_TRANSLATION_BUTTON_NOTICE_HEAD'), true);
                    } catch (error) {
                        NoticeOperationResult(t('I18N_ITEM_UPDATE_TRANSLATION_BUTTON_NOTICE_HEAD'), false, error);
                    }
                    await this.reloadShowData();
                });
            }

            // ============================================================
            //                    网络接口翻译(生成)
            // ============================================================
            if (this.settings.I18N_MODE_NIT && !isLangDoc) {
                const machineTranslationButton = new ButtonComponent(itemEl.controlEl);
                // @ts-ignore
                machineTranslationButton.setButtonText(API_TYPES[this.settings.I18N_NIT_API]);
                machineTranslationButton.setTooltip(t('I18N_ITEM_MACHINE_TRANSLATION_BUTTON_TIP'));
                machineTranslationButton.setClass('bt');
                machineTranslationButton.onClick(async () => {
                    machineTranslationButton.setDisabled(true);
                    try {
                        const mainStr = fs.readFileSync(mainDoc).toString();
                        // 2. 获取 manifest.json JSON文本
                        const manifestJSON = fs.readJsonSync(manifestDoc);
                        // 3. 转换为译文格式
                        const translationJson = generateTranslation(plugin.id, this.settings.I18N_AUTHOR, "1.0.0", plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                        const regex = /(['"`])(.*)(\1)/;
                        let temp = 0;
                        // 百度
                        if (this.settings.I18N_NIT_API == 'BAIDU') {
                            const response = await this.i18n.api.baidu(translationJson.description.original);
                            if ('trans_result' in response.json) { translationJson.description.translation = response.json['trans_result'][0]['dst'] }
                            else { translationJson.description.translation = translationJson.description.original; }
                            await sleep(this.settings.I18N_NIT_API_INTERVAL);
                            for (const key in translationJson.dict) {
                                NoticeInfo(t('I18N_ITEM_MACHINE_TRANSLATION_BUTTON_NOTICE_HEAD'), `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
                                const tempArray = key.match(regex);
                                if (tempArray != null) {
                                    const response = await this.i18n.api.baidu(tempArray[2]);
                                    if ('trans_result' in response.json) {
                                        translationJson.dict[key] = key.replace(tempArray[2], response.json['trans_result'][0]['dst']);
                                    } else {
                                        translationJson.dict[key] = key;
                                    }
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
                                NoticeInfo(t('I18N_ITEM_MACHINE_TRANSLATION_BUTTON_NOTICE_HEAD'), `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
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
                    } catch (error) {
                        NoticeOperationResult(t('I18N_ITEM_MACHINE_TRANSLATION_BUTTON_NOTICE_HEAD'), false, error);
                    }
                    this.reloadShowData();
                });
            }

            // ============================================================
            //                 插件基础功能(翻译 还原)
            // ============================================================
            if (isLangDoc && isStateDoc && translationFormatMark) {
                // 翻译按钮
                const trenslatorButton = new ButtonComponent(itemEl.controlEl);
                trenslatorButton.setClass('bt');
                trenslatorButton.setButtonText(t('I18N_ITEM_TRANSLATION_BUTTON_TEXT'));
                trenslatorButton.setTooltip(t('I18N_ITEM_TRANSLATION_BUTTON_TIP'));
                if (!(stateObj.state() == false)) trenslatorButton.setClass('i18n_display-none');
                trenslatorButton.onClick(() => {
                    try {
                        trenslatorButton.setDisabled(true);
                        // NoticeWarning(t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_HEAD'), '请等待成功提示后继续操作');
                        // 1. 复制备份文件
                        fs.copySync(mainDoc, duplicateDoc);
                        // 2. 读取译文
                        const translationJson: Translation = fs.readJsonSync(langDoc);
                        // 3. 读取 main.js
                        let mainString = fs.readFileSync(mainDoc).toString();
                        // 4. 翻译 main.js
                        // for (const key in translationJson.dict) { mainString = mainString.replaceAll(key, translationJson.dict[key]); console.log(mainString) }
                        mainString = this.translationMain(translationJson, mainString);
                        // 5. 写入 main.js
                        fs.writeFileSync(mainDoc, mainString);
                        // 6. 读取 manifest.json
                        const manifestJSON = fs.readJsonSync(manifestDoc);
                        // 7. 翻译 manifest.json
                        manifestJSON.description = translationJson.description.translation;
                        // 8. 写入 manifest.json
                        fs.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
                        // 9. 更新状态文件
                        stateObj.update(true, plugin.version, translationJson.manifest.version);
                        // 10. 判断插件是否开启 开启则重载此插件
                        if (this.enabledPlugins.has(plugin.id)) { this.reloadPlugin(plugin.id); }
                        // NoticeOperationResult(t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_HEAD'), true, t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_CONTENT_A'));
                    } catch (error) {
                        NoticeOperationResult(t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_HEAD'), false, error);
                    }
                    // 11. 刷新
                    this.reloadShowData();
                });

                // 还原按钮
                const restoreButton = new ButtonComponent(itemEl.controlEl);
                restoreButton.setClass('bt');
                restoreButton.setDisabled(false);
                restoreButton.setButtonText(t('I18N_ITEM_RESTORE_BUTTON_TEXT'));
                restoreButton.setTooltip(t('I18N_ITEM_RESTORE_BUTTON_TIP'));
                if (!(stateObj.state() == true)) restoreButton.setClass('i18n_display-none');
                restoreButton.onClick(() => {
                    restoreButton.setDisabled(true);
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
                        NoticeOperationResult(t('I18N_ITEM_RESTORE_BUTTON_NOTICE_HEAD'), true);
                    } catch (error) {
                        NoticeOperationResult(t('I18N_ITEM_RESTORE_BUTTON_NOTICE_HEAD'), false, error);
                    }
                    // 9. 刷新
                    this.reloadShowData();
                });
            }

            if (this.developerMode) {
                const test = new ButtonComponent(itemEl.controlEl);
                test.setButtonText('测试');
                test.onClick(async () => {
                    if (localTranslationJson != null) {
                        const translationJson = localTranslationJson;
                        let mainStr;
                        if (stateObj.state() == true) {
                            mainStr = fs.readJsonSync(duplicateDoc).toString()
                        } else {
                            mainStr = fs.readFileSync(mainDoc).toString();
                        }
                        // 2. 获取 manifest.json JSON文本
                        const manifestJSON = fs.readJsonSync(manifestDoc);
                        // 3. 生成译文
                        const newTranslationJson = generateTranslation(plugin.id, this.settings.I18N_AUTHOR, "1.0.0", plugin.version, manifestJSON, mainStr, this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
                        const mergedObj = { ...newTranslationJson.dict, ...translationJson.dict };
                        translationJson.dict = mergedObj;
                        // 4. 确保语言目录存在
                        fs.ensureDirSync(langDir);
                        // 5. 将 译文json 写入文件
                        fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                    }
                });
            }
        }
    }

    // window.location.reload();
    // [重载数据显示]
    async reloadShowData() {
        console.log('调用了[刷新]');
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
        NoticeOperationResult(t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_HEAD'), true, t('I18N_ITEM_TRANSLATION_BUTTON_NOTICE_CONTENT_A'));
        return mainString;
    }
}