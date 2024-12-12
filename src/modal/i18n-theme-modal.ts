import * as path from 'path';
import * as fs from 'fs-extra';

import { App, ButtonComponent, ExtraButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'main';
import { I18nSettings } from '../settings/data';

import { OBThemeManifest, Plugin, Theme, TranslationDirectoryItem } from 'src/data/types';
import { State, generatePlugin, compareVersions, formatTimestamp, generateTheme, isValidThemeTranslationFormat, i18nOpen, ai } from '../utils';
import { WizardModal } from './i18n-wizard-modal';

import { t } from '../lang/inxdex';
import Url from 'src/url';
import { NameTranslationModal } from './i18n-name-translation-modal';
import { ContributorModal } from './i18n-contributor-modal';
import { I18NPluginModal } from './i18n-plugin-modal';

// ==============================
//          侧边栏 对话框 翻译
// ==============================
export class I18NThemeModal extends Modal {
    i18n: I18N;
    settings: I18nSettings;
    basePath: string;
    // [本地][变量] 全部插件列表
    themes: OBThemeManifest[] = [];
    // [本地][变量] 展示主题列表
    showThemes: OBThemeManifest[] = [];
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
            .setClass('i18n-button').setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`).setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('i18n_qq').setTooltip(t('通用_QQ_描述')).onClick(() => { window.open(Url.QQ_GROUP) });
        if (this.settings.I18N_MODE_NDT) new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button').setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`).setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('i18n-contributor').setTooltip(t('通用_贡献榜_描述')).onClick(() => { new ContributorModal(this.app, this.i18n).open() });
        if (this.settings.I18N_MODE_LDT && this.settings.I18N_NAME_TRANSLATION) new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button').setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`).setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('name-setting').setTooltip(t('通用_名称翻译_描述')).onClick(() => { this.close(); new NameTranslationModal(this.app, this.i18n).open(); });
        new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button').setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`).setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('settings').setTooltip(t('通用_设置_描述')).onClick(() => {
                if (this.enabledPlugins.has(this.i18n.settings.I18N_STYLE_SETTINGS)) {
                    this.settingPlugins.open();
                    this.settingPlugins.openTabById(this.i18n.settings.I18N_STYLE_SETTINGS);
                    this.close();
                } else {
                    this.i18n.notice.result('设置', false, '插件未开启');
                }
            });
        new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button').setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`).setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('circle-help').setTooltip(t('通用_帮助_描述')).onClick(() => { new WizardModal(this.app, this.i18n).open() });
        new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button').setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('chevrons-left-right-ellipsis').setTooltip(t('通用_插件_描述')).onClick(() => {
                this.i18n.settings.I18N_MODE = 0;
                this.i18n.saveSettings();
                this.i18n.themeModal.close();
                this.i18n.pluginModal = new I18NPluginModal(this.app, this.i18n);
                this.i18n.pluginModal.open();
            });
        if (this.developerMode) new ButtonComponent(helpTitle.controlEl)
            .setClass('i18n-button').setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-info`).setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('refresh-ccw').setTooltip('刷新插件').onClick(async () => { this.close(); await this.reloadPlugin(this.i18n.manifest.id); });

        const searchTitle = new Setting(this.titleEl).setClass('i18n__search').setName(t('通用_搜索_标题'));
        // searchTitle.addDropdown(cb => cb.addOptions(I18N_SORT).setValue(this.settings.I18N_SORT).onChange((value) => { this.settings.I18N_SORT = value; this.i18n.saveSettings(); this.reloadShowData(); }).selectEl.addClass('i18n-select'));
        // searchTitle.addDropdown(cb => cb.addOptions(I18N_TYPE).setValue(this.settings.I18N_TYPE).onChange((value) => { this.settings.I18N_TYPE = value; this.i18n.saveSettings(); this.reloadShowData(); }).selectEl.addClass('i18n-select'));
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
        this.themes = Object.values(this.app.customCss.themes);
        // @ts-ignore
        this.enabledPlugins = this.app.plugins.enabledPlugins;
        // 搜索
        if (this.settings.I18N_SEARCH_TEXT == '') { this.showThemes = this.themes }
        else { this.showThemes = this.themes.filter(item => item.name.toLowerCase().indexOf(this.settings.I18N_SEARCH_TEXT.toLowerCase()) != -1); }
        // 分类
        // const idsToRemove: string[] = [];
        // switch (this.settings.I18N_TYPE) {
        //     case '0': break
        //     // @ts-ignore
        //     // 未提取
        //     case '1': for (const plugin of this.showThemes) { if (fs.pathExistsSync(path.join(this.basePath, plugin.dir, 'lang', `${this.settings.I18N_LANGUAGE}.json`))) idsToRemove.push(plugin.id); } this.showThemes = this.showThemes.filter(plugin => !idsToRemove.includes(plugin.id)); break;
        //     // @ts-ignore
        //     // 未翻译
        //     case '2': for (const plugin of this.showThemes) { const themeDir = path.join(this.basePath, plugin.dir); const stateDoc = path.join(themeDir, 'lang', 'state.json'); const isStateDoc = fs.pathExistsSync(stateDoc); if (fs.pathExistsSync(path.join(themeDir, 'lang')) && isStateDoc) { if (fs.readJsonSync(stateDoc).state != false) { idsToRemove.push(plugin.id) } } else { idsToRemove.push(plugin.id) } } this.showThemes = this.showThemes.filter(plugin => !idsToRemove.includes(plugin.id)); break;
        //     // @ts-ignore
        //     // 已翻译
        //     case '3': for (const plugin of this.showThemes) { const themeDir = path.join(this.basePath, plugin.dir); const stateDoc = path.join(themeDir, 'lang', 'state.json'); const isStateDoc = fs.pathExistsSync(stateDoc); if (fs.pathExistsSync(path.join(themeDir, 'lang')) && isStateDoc) { if (fs.readJsonSync(stateDoc).state != true) { idsToRemove.push(plugin.id) } } else { idsToRemove.push(plugin.id) } } this.showThemes = this.showThemes.filter(plugin => !idsToRemove.includes(plugin.id)); break;
        // }
        // // 排序
        // switch (this.settings.I18N_SORT) { case '0': this.showThemes.sort((item1, item2) => { return item1.name.localeCompare(item2.name) }); break; case '1': this.showThemes.sort((item1, item2) => { return item2.name.localeCompare(item1.name) }); break; }

        // ==============================
        //           主逻辑
        // ==============================
        for (const theme of this.showThemes) {
            // ============================================================
            //                         路径及状态
            // ============================================================
            // #region 路径及状态
            // @ts-ignore
            const themeDir = path.join(this.basePath, theme.dir);
            const langDir = path.join(themeDir, 'lang');
            const langDoc = path.join(themeDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`);
            const stateDoc = path.join(themeDir, 'lang', 'state.json');
            const isLangDir = fs.pathExistsSync(langDir);
            const isLangDoc = fs.pathExistsSync(langDoc);
            const manifestDoc = path.join(themeDir, 'manifest.json');
            const mainDoc = path.join(themeDir, 'theme.css');
            const duplicateDoc = path.join(themeDir, 'duplicate.css');
            const stateObj = new State(this.i18n, stateDoc);
            if (isLangDir && !stateObj.isStateDoc) stateObj.insert();

            // 插件更新(更新还原插件状态)
            if (stateObj.isStateDoc && stateObj.getState() && theme.version != stateObj.getPluginVersion()) try {
                fs.removeSync(duplicateDoc); stateObj.reset();
                this.i18n.notice.primary(t('通用_插件更新_前缀'), theme.name);
            } catch (e) {
                this.i18n.notice.error(t('通用_插件更新_前缀'), e);
            }

            // ====================
            // 本地插件 vs 云端插件
            // ====================
            // 本地译文
            let localJson: Theme | undefined;
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
                    translationFormatMark = isValidThemeTranslationFormat(localJson);
                } catch (e) {
                    translationFormatMark = false;
                }
            }

            // [云端模式] 当云端目录存在时 获取云端目录
            if (this.i18n.themeDirectoryMark) {
                directoryItem = this.i18n.themeDirectory.find((manifest) => manifest.id === theme.name)
            }

            // [云端模式] 当云端目录存在时 判断是否存在云端插件
            if (this.i18n.themeDirectoryMark && directoryItem && translationFormatMark) {
                // 获取可下载的版本号
                downloadVersion = (theme.version in directoryItem.translations ? true : false) ? theme.version : Object.keys(directoryItem.translations).slice(-1)[0];
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
            // #region 插件基础功能(介绍 打开目录 删除目录 编辑译文 提交译文)
            // ====================
            // 插件介绍头部
            // ====================
            const itemEl = new Setting(this.contentEl);
            itemEl.setClass('i18n__item');
            itemEl.nameEl.addClass('i18n__item-title');

            const desc: { mark: number, label: { color: string; text: string; }, text: string } = { mark: 1, label: { color: '', text: '' }, text: '' };
            if (stateObj.isStateDoc) {
                if (localJson && translationFormatMark) {
                    if (compareVersions(theme.version, localJson.manifest.pluginVersion) === 1) {
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
            } else { desc.label.color = 'info'; desc.label.text = t('标签_无译文_文本'); desc.text = t('标签_无译文_描述'); }
            if (this.i18n.ignoreMark && this.i18n.ignorePlugins.includes('这里需要修改')) {
                desc.label.color = 'primary';
                desc.label.text = t('标签_自带翻译_文本');
                desc.text = t('标签_自带翻译_描述');
            }

            itemEl.nameEl.innerHTML = `<span class="i18n-tag i18n-tag--${this.settings.I18N_TAG_TYPE}-${desc.label.color} is-${this.settings.I18N_TAG_SHAPE}">${desc.label.text}</span><span class="i18n__item-name">${theme.name}</span> <span class="i18n__item-version">[${theme.version}]</span> `;
            itemEl.settingEl.onmouseover = (e) => { this.detailsEl.innerHTML = desc.text };
            itemEl.settingEl.onmouseout = (e) => { this.detailsEl.innerHTML = t('标签_无_文本') };

            // ====================
            // 打开插件目录(打开)
            // ====================
            const openthemeDirButton = new ExtraButtonComponent(itemEl.controlEl).setIcon('folder-open').setTooltip(t('功能_打开_描述')).onClick(() => {
                openthemeDirButton.setDisabled(true);
                i18nOpen(this.i18n, themeDir);
                openthemeDirButton.setDisabled(false);
            });

            // ====================
            // 清空翻译文件(删除)
            // ====================
            if (isLangDir) {
                const deletethemeDirButton = new ExtraButtonComponent(itemEl.controlEl).setIcon('trash').setTooltip(t('功能_删除_描述')).onClick(() => {
                    deletethemeDirButton.setDisabled(true);
                    try {
                        // 当为已翻译状态时
                        if (stateObj.stateObj.state) {
                            // 1. 删除已翻译代码
                            fs.removeSync(mainDoc);
                            // 2. 还原备份文件
                            fs.renameSync(duplicateDoc, mainDoc);
                        }
                        // 递归删除所有文件
                        fs.removeSync(langDir);
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
                    this.i18n.editorLoad('theme', langDoc, stateObj);
                });
            }

            // ====================
            // 译文共享模式
            // ====================
            if (this.settings.I18N_SHARE_MODE && translationFormatMark && isLangDoc) {
                const submitTranslationButton = new ExtraButtonComponent(itemEl.controlEl);
                submitTranslationButton.setIcon('cloud-upload');
                submitTranslationButton.setTooltip(t('功能_共享_描述'));
                submitTranslationButton.onClick(() => {
                    this.i18n.shareLoad(1, langDoc, theme);
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
                            const translationJson = generateTheme(manifestJSON, mainStr);
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
                                const modifiedTranslationJson = generatePlugin(theme.version, fs.readJsonSync(manifestDoc), fs.readFileSync(mainDoc).toString(), this.settings.I18N_RE_LENGTH, this.regexps, this.settings.I18N_RE_FLAGS);
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
            if (this.settings.I18N_MODE_NDT && this.i18n.themeDirectory && translationFormatMark && directoryItem != undefined && updateMark2) {
                if (!isLangDoc || updateMark == true) {
                    itemEl.controlEl.createEl('button', { text: (isLangDoc ? t('功能_更新_文本') : t('功能_下载_文本')), cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                        el.addEventListener("click", async () => {
                            let cloudJson;
                            if (this.i18n.settings.I18N_NDT_URL === 'gitee') {
                                cloudJson = await this.i18n.api.giteeGetTranslation('theme', theme.name, downloadVersion);
                            } else if (this.i18n.settings.I18N_NDT_URL === 'github') {
                                cloudJson = await this.i18n.api.githubGetTranslation('theme', theme.name, downloadVersion);
                            }
                            if (cloudJson !== undefined && localJson == undefined) localJson = cloudJson.data;
                            if (localJson !== undefined && cloudJson !== undefined) {
                                this.i18n.downloadType = '1';
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
                            const manifestJSON = fs.readJsonSync(manifestDoc);
                            const translationJson = generateTheme(manifestJSON, mainStr);
                            let temp = 0;
                            for (const key in translationJson.dict) {
                                this.i18n.notice.info(t('功能_AI_文本'), `${temp += 1}/${Object.keys(translationJson.dict).length}`, this.settings.I18N_NIT_API_INTERVAL);
                                const match = key.match(/title:(.*)|description:(.*)/);
                                const textToTranslate = match ? (match[1] || match[2]) : null;
                                if (textToTranslate && match) {
                                    const res = await ai(this.i18n, textToTranslate);
                                    if (res) {
                                        if (match[1]) {
                                            translationJson.dict[key] = key.replace(match[1], ` ${res.data}`);
                                        } else if (match[2]) {
                                            translationJson.dict[key] = key.replace(match[2], ` ${res.data}`);
                                        }
                                    }
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
            //                 插件基础功能(替换 还原)
            // ============================================================
            if (isLangDoc && stateObj.isStateDoc && translationFormatMark) {
                // 替换按钮
                if (stateObj.getState() == false) {
                    itemEl.controlEl.createEl('button', { text: t('功能_替换_文本'), cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                        el.addEventListener("click", () => {
                            try {
                                const translationJson: Plugin = fs.readJsonSync(langDoc);
                                if (translationJson && Object.keys(translationJson.dict).every(key => translationJson.dict[key] === key)) {
                                    this.i18n.notice.result(t('功能_替换_前缀'), false, t('功能_替换_通知一'));
                                    return;
                                }
                                fs.copySync(mainDoc, duplicateDoc);
                                let mainString = fs.readFileSync(mainDoc).toString();
                                mainString = this.translationMain(translationJson, mainString);
                                fs.writeFileSync(mainDoc, mainString);
                                stateObj.setState(true);
                                stateObj.setPluginVersion(theme.version);
                                stateObj.setTranslationVersion(translationJson.manifest.translationVersion);
                                if (this.enabledPlugins.has(this.i18n.settings.I18N_STYLE_SETTINGS)) {
                                    this.reloadPlugin(this.i18n.settings.I18N_STYLE_SETTINGS);
                                }
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
                                fs.unlinkSync(mainDoc);
                                fs.renameSync(duplicateDoc, mainDoc);
                                stateObj.reset();
                                if (this.enabledPlugins.has(this.i18n.settings.I18N_STYLE_SETTINGS)) {
                                    this.reloadPlugin(this.i18n.settings.I18N_STYLE_SETTINGS);
                                }
                                this.i18n.notice.result(t('功能_还原_前缀'), true)
                            } catch (error) {
                                this.i18n.notice.result(t('功能_还原_前缀'), false, error)
                            }
                            this.reloadShowData();
                        });
                    });
                }
            }

            if (this.developerMode) {
                itemEl.controlEl.createEl('button', { text: '测试', cls: ['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`, `is-${this.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
                    el.addEventListener("click", async () => {
                    });
                });
            }
        }
    }

    async reloadShowData() {
        // 滚动条定位
        let scrollTop = 0;
        // @ts-ignore
        const modalElement: HTMLElement = this.contentEl;
        scrollTop = modalElement.scrollTop;
        // 删除所有数据
        modalElement.empty();
        // 刷新展示数据
        await this.showData();
        // 复原scroll位置
        modalElement.scrollTo(0, scrollTop);
    }

    async onOpen() {
        await this.showHead();
        await this.showData();
    }

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