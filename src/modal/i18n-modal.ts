import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';

import { App, ButtonComponent, ExtraButtonComponent, Modal, PluginManifest, Setting } from 'obsidian';
import I18N from 'main';
import { I18nSettings } from '../settings/data';

import { Manifest, Translation } from 'src/data/types';
import { API_TYPES, I18N_SORT, I18N_TYPE } from 'src/data/data';
import { PNotice, NoticeError, State, generateTranslation, NoticeInfo, NoticeOperationResult } from '../utils';
import { GitIssueModal } from './git-issue-modal';
import { WizardModal } from './wizard-modal';
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

    // ============================================================
    //                        展示操作
    // ============================================================
    public async showHead() {
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n_modal');
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);

        this.titleEl.addClass('i18n_modal_title_box');
        this.contentEl.addClass('i18n_modal_item_box');

        const test = new Setting(this.titleEl);
        test.setClass('i18n_modal_title_box_1');
        test.setName('遇到难题？速加Q群咨询！');

        const qqButton = new ButtonComponent(test.controlEl);
        qqButton.setIcon('i18n_qq');
        qqButton.setTooltip('一键直达，加入Q群共享精彩！');
        qqButton.onClick(() => { window.open(Url.QQ_GROUP) });

        const settingTabButton = new ButtonComponent(test.controlEl);
        settingTabButton.setIcon('settings');
        settingTabButton.setTooltip('打开插件设置');
        settingTabButton.onClick(() => {
            this.settingPlugins.open();
            this.settingPlugins.openTabById(this.i18n.manifest.id);
            this.close();
        });

        const helpButton = new ButtonComponent(test.controlEl);
        helpButton.setIcon('circle-help');
        helpButton.setTooltip('帮助');
        helpButton.onClick(() => { new WizardModal(this.app, this.i18n).open() });

        const search = new Setting(this.titleEl);
        search.setClass('i18n_modal_title_box_2');
        search.setName('搜索');
        search.addDropdown(cb => cb
            .addOptions(I18N_SORT)
            .setValue(this.settings.I18N_SORT)
            .onChange((value) => {
                this.settings.I18N_SORT = value;
                this.i18n.saveSettings();
                this.reloadShowData();
            })
        );
        search.addDropdown(cb => cb
            .addOptions(I18N_TYPE)
            .setValue(this.settings.I18N_TYPE)
            .onChange((value) => {
                this.settings.I18N_TYPE = value;
                this.i18n.saveSettings();
                this.reloadShowData();
            })
        );
        search.addSearch(cb => cb
            .setValue(this.settings.I18N_SEARCH_TEXT)
            .onChange((value) => {
                this.settings.I18N_SEARCH_TEXT = value;
                this.i18n.saveSettings();
                this.reloadShowData();
            })
        );

        if (this.developerMode) {
            const reload = new ButtonComponent(test.controlEl);
            reload.setIcon('refresh-ccw');
            reload.setTooltip('刷新插件');
            reload.onClick(async () => {
                await this.reloadPlugin(this.i18n.manifest.id);
                this.close();
            });
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
        if (this.settings.I18N_SEARCH_TEXT == "") { this.showPlugins = this.plugins }
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
                    // const stateDoc = path.join(pluginDir, 'lang', 'state.json');
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
                try {
                    stateObj.insert();
                    isStateDoc = fs.pathExistsSync(stateDoc);
                } catch (error) {
                    NoticeError('错误', `error`);
                }
            }

            // 本地译文介绍
            let localTranslationJson: Translation | undefined;
            // 云端译文介绍
            let cloudTranslationManifestJson: Manifest | undefined;
            // 判断 本地插件和云端插件 版本是否相同标记
            let isPluginsVersionSameMark: boolean;
            // 判断 本地译文和云端译文 版本是否相同标记
            let isTranslationVersionSameMark: boolean = false;
            // 云端最新版插件版本号
            let latestCloudVersion: string;
            // 译文格式是否正常标记
            let translationFormatMark = true;

            if (this.i18n.directoryMark) { cloudTranslationManifestJson = this.i18n.directory.find((manifest: Manifest) => manifest.id === plugin.id) }
            if (cloudTranslationManifestJson != undefined) {
                // 本地译文和云端译文 插件版本是否相同标记
                isPluginsVersionSameMark = cloudTranslationManifestJson.translations.find(translation => translation.pluginVersion === plugin.version) !== undefined ? true : false;
                // 最新云端版本
                latestCloudVersion = isPluginsVersionSameMark ? plugin.version : cloudTranslationManifestJson.translations.slice(-1)[0].pluginVersion;
                const temp = cloudTranslationManifestJson.translations.find(translation => translation.pluginVersion === latestCloudVersion);
                console.log(temp);
                // 本地译文标记(判断本地译文和网络中最新译文是否匹配)
                if (isLangDoc && temp != undefined) {
                    isTranslationVersionSameMark = fs.readJsonSync(langDoc).manifest.version == temp.translationVersion ? false : true;
                }
            }

            // 检查译文格式
            if (isLangDoc) {
                try {
                    localTranslationJson = fs.readJsonSync(langDoc);
                } catch (error) {
                    translationFormatMark = false;
                    NoticeError(`${plugin.name}`, '译文格式错误');
                }
            }

            // ====================
            // 插件更新(更新还原插件状态)
            // ====================
            if (isStateDoc && stateObj.state() && plugin.version != stateObj.pluginVersion()) {
                try {
                    fs.removeSync(duplicateDoc);
                    stateObj.reset();
                } catch (error) {
                    PNotice('错误', error);
                }
            }
            // #endregion

            // ============================================================
            //      插件基础功能(介绍 打开目录 删除目录 编辑译文 提交译文)
            // ============================================================
            // #region
            // ====================
            // 插件介绍头部
            // ====================
            const block = new Setting(this.contentEl);
            block.setClass('i18n_modal_item');
            block.nameEl.addClass('i18n_modal_item_title');
            let stateMark;

            if (isLangDoc && stateObj.state() == true && translationFormatMark) {
                const translationJson: Translation = fs.readJSONSync(langDoc);
                if (translationJson.manifest.pluginVersion === plugin.version) {
                    stateMark = ["success", "已翻译"];  // 未翻译
                } else {
                    stateMark = ["warning", "已过时"]; // 已过时
                }
            } else if (isLangDoc && stateObj.state() == false && translationFormatMark) {

                const translationJson: Translation = fs.readJSONSync(langDoc);
                if (translationJson.manifest.pluginVersion === plugin.version) {
                    stateMark = ["error", "未翻译"]; // 已翻译
                } else {
                    stateMark = ["warning", "已过时"]; // 已过时
                }
            } else {
                stateMark = ["error", "无译文"]; // 无译文
            }

            block.nameEl.innerHTML = `
            <span class="i18n_modal_item_state i18n_modal_item_state_${stateMark[0]}">${stateMark[1]}</span>
            <span class="i18n_modal_item_title">${plugin.name}</span> 
            <span class="i18n_modal_item_version" style="color:--simple-blue-2;">(${plugin.version})</span> 
            `;
            // ====================
            // 插件介绍详情
            // ====================
            if (isLangDoc) {
                if (translationFormatMark) {
                    // 本地存在译文
                    block.descEl.createDiv({ text: `[本地] ${localTranslationJson?.manifest.author} (${localTranslationJson?.manifest.pluginVersion}) ` });
                    block.descEl.createDiv({ text: '[本地] 欢迎共享您的译文' });
                } else {
                    // 译文格式有误
                    block.descEl.createDiv({ text: '[译文] 译文格式错误' }).addClass('i18n_color_red');
                    block.descEl.createDiv({ text: '[译文] 请仔细检查调整或删除后重试' }).addClass('i18n_color_red');
                }
            } else if (this.i18n.directoryMark && !this.i18n.ignoreMark) {
                if (this.i18n.ignoreMark && this.i18n.ignorePlugins.includes(plugin.id)) {
                    block.descEl.createDiv({ text: `[插件] 此插件可能自带翻译功能` });
                    block.descEl.createDiv({ text: '‎' });
                }
                if (cloudTranslationManifestJson !== undefined) {
                    const temp = cloudTranslationManifestJson.translations.find(translation => translation.pluginVersion === latestCloudVersion);
                    block.descEl.createDiv({ text: `[云端] ${temp?.author} (${temp?.translationVersion})` });
                    block.descEl.createDiv({ text: '‎' });
                } else {
                    block.descEl.createDiv({ text: `[云端] 云端无可下载译文` });
                    block.descEl.createDiv({ text: '[云端] 欢迎共享您的译文' });
                }
            } else if (this.i18n.ignoreMark && this.i18n.ignorePlugins.includes(plugin.id)) {
                block.descEl.createDiv({ text: `[插件] 此插件可能自带翻译功能` });
                block.descEl.createDiv({ text: '‎' });
            } else {
                //不存在译文
                block.descEl.createDiv({ text: `[本地] 您还未提取译文` });
                block.descEl.createDiv({ text: '‎' });
            }

            // ====================
            // 打开插件设置
            // ====================
            if (this.settings.I18N_OPEN_SETTINGS && this.enabledPlugins.has(plugin.id)) {
                const openPluginSetting = new ExtraButtonComponent(block.controlEl);
                openPluginSetting.setIcon('settings');
                openPluginSetting.setTooltip('打开插件设置');
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
                const openPluginDir = new ExtraButtonComponent(block.controlEl);
                openPluginDir.setIcon('folder-open');
                openPluginDir.setTooltip('打开插件目录');
                openPluginDir.onClick(() => {
                    openPluginDir.setDisabled(true);
                    if (navigator.userAgent.match(/Win/i)) {
                        const command = `powershell.exe -Command "Invoke-Item \\"${pluginDir}\\""`;
                        exec(command, (error) => {
                            if (error) {
                                NoticeOperationResult('打开目录', false, error);
                            } else {
                                NoticeOperationResult('打开目录', true);
                            }
                        });
                    }
                    openPluginDir.setDisabled(false);
                });
            }
            // ====================
            // 清空翻译文件(删除)
            // ====================
            if (isLangDir) {
                const deletePluginDirButton = new ExtraButtonComponent(block.controlEl);
                deletePluginDirButton.setIcon('trash');
                deletePluginDirButton.setTooltip('删除译文目录');
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
                        NoticeOperationResult('删除译文', true);
                    } catch (error) {
                        NoticeOperationResult('删除译文', false, error);
                    }
                    this.reloadShowData();
                });
            }
            // ====================
            // 编辑译文
            // ====================
            if (this.settings.I18N_EDIT_MODE && isLangDoc) {
                const deletePluginDirButton = new ExtraButtonComponent(block.controlEl);
                deletePluginDirButton.setIcon('pencil');
                deletePluginDirButton.setTooltip('编辑译文');
                deletePluginDirButton.onClick(() => {
                    deletePluginDirButton.setDisabled(true);
                    if (navigator.userAgent.match(/Win/i)) {
                        const command = `powershell.exe -Command "Invoke-Item \\"${langDoc}\\""`;
                        exec(command, (error) => {
                            if (error) { NoticeOperationResult('打开译文', false, error); }
                            else { NoticeOperationResult('打开译文', true); }
                        });
                    }
                    window.open('https://www.json.cn/jsonedit/');
                    this.reloadShowData();
                });
            }
            // ====================
            // 译文提交
            // ====================
            if (this.settings.I18N_SUBMIT_TRANSLATION_MODE && isLangDoc && translationFormatMark) {
                const submitRernslationButton = new ExtraButtonComponent(block.controlEl);
                submitRernslationButton.setIcon('cloud-upload');
                submitRernslationButton.setTooltip('提交译文');
                submitRernslationButton.onClick(() => {
                    try {
                        new GitIssueModal(this.app, plugin.id, plugin.version, async () => {
                            const translationJson: Translation = fs.readJSONSync(langDoc);
                            const titleJson = {
                                id: plugin.id,
                                author: translationJson.manifest.author,
                                translationVersion: translationJson.manifest.version,
                                pluginVersion: translationJson.manifest.pluginVersion
                            }
                            const url = await this.i18n.api.giteeIssue(JSON.stringify(titleJson), JSON.stringify(translationJson));
                            if (url != null) window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${url}`, '_blank');
                        }).open();
                    } catch (error) {
                        NoticeOperationResult('译文提交', false, `${error}`)
                    }
                });
            }
            // #endregion

            // ============================================================
            //                     本地译文翻译(提取) 
            // ============================================================
            if (this.settings.I18N_MODE_LDT && !isLangDoc) {
                const LDTGenerateButton = new ButtonComponent(block.controlEl);
                LDTGenerateButton.setButtonText('提取');
                LDTGenerateButton.setTooltip('提取译文');
                LDTGenerateButton.onClick(() => {
                    LDTGenerateButton.setDisabled(true);
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
                        NoticeOperationResult('提取', true, '导航至插件安装目录\n手动翻译您的译文\n或使用编辑模式');
                    } catch (error) {
                        NoticeOperationResult('提取', false, `${error}`);
                    }
                    this.reloadShowData();
                });
            }
            // ============================================================
            //                  网络译文翻译(下载、更新)
            // ============================================================
            if (this.settings.I18N_MODE_NDT && this.i18n.directoryMark && cloudTranslationManifestJson != undefined && translationFormatMark) {
                // 插件版本标记(网络上是否存在相同版本的译文)
                // const pluginVersionMake = cloudTranslationManifestJson.translations.find(translation => translation.pluginVersion === plugin.version) !== undefined ? true : false;
                // 版本标记(存在 则返回相同 不存在责返回最新的一个)
                // const version = pluginVersionMake ? plugin.version : cloudTranslationManifestJson.translations.slice(-1)[0].pluginVersion;
                // 译文对象
                // const translationManifestJSON = cloudTranslationManifestJson.translations.find(translation => translation.pluginVersion === version);
                // 本地译文标记(判断本地译文和网络中最新译文是否匹配)
                // let translationVersionMake = false;
                // if (isLangDoc && translationManifestJSON != undefined) { translationVersionMake = fs.readJsonSync(langDoc).manifest.version == translationManifestJSON.translationVersion ? false : true; }
                try {
                    // 1. 本地存在译文
                    const NDTUpdateButton = new ButtonComponent(block.controlEl);
                    // 本地存在译文
                    // 网络和当前译文版本号不同
                    if (!(isLangDoc && isTranslationVersionSameMark)) NDTUpdateButton.setClass('i18n_display-none');
                    NDTUpdateButton.setButtonText('更新');
                    NDTUpdateButton.setTooltip(t('NDT_UPDATE_TOOLTIP'));
                    NDTUpdateButton.onClick(async () => {
                        NDTUpdateButton.setDisabled(true);
                        fs.writeJsonSync(langDoc, await this.i18n.api.translation(plugin.id, latestCloudVersion), { spaces: 4 });
                        await this.reloadShowData();
                    });
                    // 1. 本地不存在译文
                    const NDTDownloadButton = new ButtonComponent(block.controlEl);
                    if (isLangDoc) NDTDownloadButton.setClass('i18n_display-none');
                    NDTDownloadButton.setButtonText('下载');
                    NDTDownloadButton.setTooltip(t('NDT_DOWNLOAD_TOOLTIP'));
                    NDTDownloadButton.onClick(async () => {
                        NDTDownloadButton.setDisabled(true);
                        fs.ensureDirSync(langDir);
                        fs.writeJsonSync(langDoc, await this.i18n.api.translation(plugin.id, latestCloudVersion), { spaces: 4 });
                        await this.reloadShowData();
                    });
                } catch (error) {
                    PNotice('错误', error);
                }
            }

            // ============================================================
            //                    网络接口翻译(生成)
            // ============================================================
            if (this.settings.I18N_MODE_NIT && !isLangDoc) {
                const NITGenerateButton = new ButtonComponent(block.controlEl);
                // @ts-ignore
                NITGenerateButton.setButtonText(API_TYPES[this.settings.I18N_NIT_API]);
                NITGenerateButton.setTooltip(t('NIT_GENERATE_TOOLTIP'));
                NITGenerateButton.setCta();
                NITGenerateButton.onClick(async () => {
                    NITGenerateButton.setDisabled(true);
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
                                NoticeInfo('生成', `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
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
                                NoticeInfo('生成', `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
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
                        NoticeOperationResult('云端译文', false, error);
                    }
                    this.reloadShowData();
                });
            }

            // ============================================================
            //                 插件基础功能(翻译 还原)
            // ============================================================
            if (isStateDoc && isLangDoc && translationFormatMark) {
                try {
                    // 翻译按钮
                    const TrenslatorButton = new ButtonComponent(block.controlEl);
                    TrenslatorButton.setButtonText('翻译');
                    TrenslatorButton.setTooltip('翻译插件');
                    if (!(stateObj.state() == false)) TrenslatorButton.setClass('i18n_display-none');
                    TrenslatorButton.onClick(() => {
                        TrenslatorButton.setDisabled(true);
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
                        // 6. 判断是否存在description
                        if (translationJson.hasOwnProperty("description")) {
                            // 7. 读取 manifest.json
                            const manifestJSON = fs.readJsonSync(manifestDoc);
                            // 8. 翻译 manifest.json
                            manifestJSON.description = translationJson.description.translation;
                            // 9. 写入 manifest.json
                            fs.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
                        }
                        // 10. 更新状态文件
                        stateObj.update(true, plugin.version, translationJson.manifest.version);
                        // 11. 插件失效提示
                        if (this.enabledPlugins.has(plugin.id)) {
                            this.reloadPlugin(plugin.id);
                        }
                        NoticeOperationResult('翻译', true, '如遇翻译后插件失效\n说明译文可能出现问题\n点击还原即可恢复原状');
                        // 12. 刷新
                        this.reloadShowData();
                    });

                    // 还原按钮
                    const RestoreButton = new ButtonComponent(block.controlEl);
                    RestoreButton.setButtonText('还原');
                    RestoreButton.setTooltip('还原插件');
                    if (!(stateObj.state() == true)) RestoreButton.setClass('i18n_display-none');
                    RestoreButton.onClick(() => {
                        RestoreButton.setDisabled(true);
                        // 1. 删除 main.js
                        fs.unlinkSync(mainDoc);
                        // 2. 替换 main.js
                        fs.renameSync(duplicateDoc, mainDoc);
                        // 3. 读取译文
                        const translationJson = fs.readJsonSync(langDoc);
                        // 4. 判断是否存在description
                        if (translationJson.hasOwnProperty("description")) {
                            // 5. 读取 manifest.json
                            const manifestJSON = fs.readJsonSync(manifestDoc);
                            // 6. 还原 manifest.json
                            manifestJSON.description = translationJson.description.original;
                            // 7. 写入 manifest.json
                            fs.writeJsonSync(manifestDoc, manifestJSON, { spaces: 4 });
                        }
                        // 8. 更新状态文件
                        stateObj.reset();
                        // 9. 更新
                        if (this.enabledPlugins.has(plugin.id)) {
                            this.reloadPlugin(plugin.id);
                        }
                        NoticeOperationResult('还原', true);
                        // 10. 刷新
                        this.reloadShowData();
                    });
                } catch (error) {
                    NoticeOperationResult('翻译', false, error);
                }
            }

            if (this.developerMode) {
                const test = new ButtonComponent(block.controlEl);
                test.setButtonText('测试');
                test.onClick(async () => {
                    console.log(this.i18n.manifest.id);
                });
            }
        }
    }

    // [重载数据显示]
    async reloadShowData() {
        console.log('调用了[刷新]');
        // 滚动条定位
        let scrollTop = 0;
        // @ts-ignore
        const modalElement: HTMLElement = this.contentEl;
        console.log(modalElement);
        scrollTop = modalElement.scrollTop;
        // 使用 while 循环从最后一个子元素开始向前遍历并删除 从最后一个子元素开始向前遍历，以避免在遍历时影响索引  
        while (this.contentEl.firstChild) { this.contentEl.removeChild(this.contentEl.firstChild) }
        // 刷新展示数据
        await this.showData();
        // 复原scroll位置
        modalElement.scrollTo(0, scrollTop);
    }

    // [开启]
    async onOpen() {
        console.log('调用了[开启]');
        await this.showHead();
        await this.showData();
    }

    // [关闭]
    async onClose() {
        console.log('调用了[关闭]');
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
}