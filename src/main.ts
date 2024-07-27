import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';

import nodemailer from 'nodemailer';

import { App, ButtonComponent, ExtraButtonComponent, Modal, Notice, Plugin, PluginManifest, RequestUrlResponse, Setting } from 'obsidian';

import { DEFAULT_SETTINGS, I18nSettings } from './settings/data';
import { I18nSettingTab } from './settings/ui';
import { EDIT_VIEW_TYPE } from './views/view';
import { mode } from './data/data';
import { Translation } from './data/types';
import { API } from './api/api';
import { t } from './lang/inxdex';

import { State, generateTranslation } from './utils';

// ==============================
//          [入口] I18n
// ==============================
export default class I18N extends Plugin {
    // [变量] 总配置文件
    settings: I18nSettings;

    // 当Obsidian启动时默认调用
    async onload() {
        console.log(`%c ${this.manifest.name} %c v${this.manifest.version} `,
            `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: #5B5B5B;`,
            `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: #409EFF;`,
        );
        // 加载配置
        await this.loadSettings();

        // 自动更新插件
        if (this.settings.I18N_AUTOMATIC_UPDATE) this.i18nAutomaticUpdate(this.app);

        // 功能页
        this.addRibbonIcon('globe-2', 'I18N', (evt: MouseEvent) => { new I18NModal(this.app, this).open(); });

        // 激活译文编辑视图
        // this.activateEditView();
        // 注册译文编辑视图
        // this.registerView(EDIT_VIEW_TYPE, (leaf) => new EditView(leaf));

        // 状态栏
        // this.addStatusBarItem().setText(`[模式] ${mode[this.settings.I18N_MODE]}`);

        // 设置页
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

    // 激活译文编辑视图
    // async activateEditView() {
    //     this.app.workspace.detachLeavesOfType(EDIT_VIEW_TYPE);
    //     await this.app.workspace.getRightLeaf(false).setViewState({
    //         type: EDIT_VIEW_TYPE,
    //         active: true,
    //     });
    //     this.app.workspace.revealLeaf(
    //         this.app.workspace.getLeavesOfType(EDIT_VIEW_TYPE)[0]
    //     );
    // }
}

// ==============================
//          侧边栏 对话框 翻译
// ==============================
export class I18NModal extends Modal {
    i18n: I18N;
    settings: I18nSettings;
    basePath: string;
    api: API;

    ndtMark = false;
    // [本地][变量] 插件列表
    plugins: PluginManifest[] = [];
    // [网络][变量] 网络文件目录 Directory
    directory: string[] = [];
    regexps: string[];

    // ============================================================
    //                       构造函数
    // ============================================================
    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n;
        this.basePath = path.normalize(this.app.vault.adapter.getBasePath());
        this.settings = i18n.settings;
        this.api = new API(this.i18n);

    }

    // ============================================================
    //                        主函数
    // ============================================================
    public async Main() {
        // ============================================================
        //                          初始化
        // ============================================================
        // #region
        const { contentEl } = this;
        this.contentEl.setText(t('I18N_RIBBON_TITLE') + `[${mode[this.settings.I18N_MODE]}]`);
        new Setting(contentEl);

        this.regexps = this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE];
        this.plugins = Object.values(this.app.plugins.manifests);
        this.plugins = this.plugins.filter(item => item.id !== 'i18n');
        this.plugins.sort((item1, item2) => { return item1.name.localeCompare(item2.name) });

        // 获取译文目录
        if (this.settings.I18N_MODE === "ndt" && !(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS)) new Notice(t('SETTING_NDT_NPTICE'));
        if (this.settings.I18N_MODE === "ndt" && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS) {
            try {
                const data = await this.api.directory();
                this.directory = data.json['plugins'];
                this.ndtMark = true;
            } catch (error) {
                new Notice(`⚠ ${error}`);
                console.error(`⚠ ${error}`);
            }
        }
        // #endregion

        // ============================================================
        //                          批量操作
        // ============================================================
        // #region 
        const batchBlock = new Setting(contentEl);
        batchBlock.setName(t('BATCH_TITLE'));
        if (!(this.settings.I18N_BATCH)) batchBlock.setClass('display-none');

        // ====================
        // 批量删除
        // ====================
        const batchDeleteButton = new ButtonComponent(batchBlock.controlEl);
        batchDeleteButton.setWarning();
        batchDeleteButton.setButtonText(t('BATCH_DELETE_TEXT'));
        batchDeleteButton.setTooltip(t('BATCH_DELETE_TOOLTIP'));
        batchDeleteButton.setDisabled(false);
        batchDeleteButton.onClick(() => {
            batchDeleteButton.setDisabled(true);
            try {
                for (const plugin of this.plugins) {
                    const pluginDir = path.join(this.basePath, plugin.dir ?? '');
                    const langDir = path.join(pluginDir, 'lang');
                    const stateDoc = path.join(pluginDir, 'lang', 'state.json');
                    const mainDoc = path.join(pluginDir, 'main.js');
                    const duplicateDoc = path.join(pluginDir, 'duplicate.js');
                    const stateObj = new State(stateDoc);
                    if (stateObj.isState() && stateObj.state() == true) {
                        // 还原操作
                        fs.removeSync(mainDoc);
                        fs.renameSync(duplicateDoc, mainDoc);
                    }
                    fs.removeSync(langDir);
                    new Notice(`[${plugin.name}] ${t('BATCH_DELETE_NPTICE')}`);
                }
            } catch (error) {
                new Notice(`⚠ ${error}`);
                console.error(`⚠ ${error}`);
            }
            new Notice(`${t('BATCH_DELETE_NPTICE_2')}`);
            this.reload();
        });

        // ====================
        // 批量还原
        // ====================
        const batchRestoreButton = new ButtonComponent(batchBlock.controlEl);
        if (!(this.settings.I18N_LDT_MODE)) batchRestoreButton.setClass('display-none');
        batchRestoreButton.setButtonText(t('BATCH_RESTORE_TEXT'));
        batchRestoreButton.setTooltip(t('BATCH_RESTORE_TOOLTIP'));
        batchRestoreButton.setDisabled(false);
        batchRestoreButton.onClick(() => {
            batchRestoreButton.setDisabled(true);
            try {
                for (const plugin of this.plugins) {
                    const pluginDir = path.join(this.basePath, plugin.dir ?? '');
                    const mainDoc = path.join(pluginDir, 'main.js');
                    const stateObj = new State(path.join(pluginDir, 'lang', 'state.json'));
                    // 1. 状态文件存在
                    // 2. 当前状态已翻译状态
                    if (stateObj.isState() && stateObj.state() == true) {
                        fs.removeSync(mainDoc);
                        fs.renameSync(path.join(pluginDir, 'duplicate.js'), mainDoc);
                        stateObj.reset();
                    }
                    new Notice(`[${plugin.name}] ${t('BATCH_RESTORE_NPTICE')}`);
                }
            } catch (error) {
                new Notice(`⚠ ${error}`);
                console.error(`⚠ ${error}`);
            }
            new Notice(`${t('BATCH_RESTORE_NPTICE_2')}`);
            this.reload();
        });

        // ====================
        // 批量翻译
        // ====================
        const batchTrenslatorButton = new ButtonComponent(batchBlock.controlEl);
        batchTrenslatorButton.setCta();
        batchTrenslatorButton.setButtonText(t('BATCH_TRENSLATOR_TEXT'));
        batchTrenslatorButton.setTooltip(t('BATCH_TRENSLATOR_TOOLTIP'));
        if (!(this.settings.I18N_LDT_MODE)) batchTrenslatorButton.setClass('display-none');
        batchTrenslatorButton.setDisabled(false);
        batchTrenslatorButton.onClick(() => {
            batchTrenslatorButton.setDisabled(true);
            try {
                for (const plugin of this.plugins) {
                    const pluginDir = path.join(this.basePath, plugin.dir ?? '');
                    const mainDoc = path.join(pluginDir, 'main.js');
                    const langDoc = path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`);
                    const stateDoc = path.join(pluginDir, 'lang', 'state.json');
                    const stateObj = new State(stateDoc);
                    const isLangDoc = fs.pathExistsSync(langDoc);
                    const isStateDoc = fs.pathExistsSync(stateDoc);
                    if (isLangDoc && isStateDoc && stateObj.state() == false) {
                        fs.copySync(mainDoc, path.join(pluginDir, 'duplicate.js'));
                        const translationJson = fs.readJsonSync(langDoc);
                        let mainString = fs.readFileSync(mainDoc).toString();
                        for (const key in translationJson.dict) {
                            mainString = mainString.replaceAll(key, translationJson.dict[key]);
                        }
                        fs.writeFileSync(mainDoc, mainString);
                        stateObj.update(true, plugin.version, translationJson.manifest.version);
                        new Notice(`[${plugin.name}] ${t('BATCH_TRENSLATOR_NPTICE')}`);
                    }
                }
            } catch (error) {
                new Notice(`⚠ ${error}`);
                console.error(`⚠ ${error}`);
            }
            new Notice(t('BATCH_TRENSLATOR_NPTICE_2'));
            this.reload();
        });

        // ====================
        // 批量生成
        // ====================
        const batchGenerateButton = new ButtonComponent(batchBlock.controlEl);
        batchGenerateButton.setButtonText(t('BATCH_GENERATE_TEXT'));
        batchGenerateButton.setTooltip(t('BATCH_GENERATE_TOOLTIP'));
        if (!(this.settings.I18N_LDT_MODE && this.settings.I18N_LDT_GENERATE)) batchGenerateButton.setClass('display-none');
        batchGenerateButton.setDisabled(false);
        batchGenerateButton.onClick(() => {
            batchGenerateButton.setDisabled(true);
            try {
                for (const plugin of this.plugins) {
                    const pluginDir = path.join(this.basePath, plugin.dir ?? '');
                    const langDoc = path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`);
                    const isLangDoc = fs.pathExistsSync(langDoc);
                    if (!isLangDoc) {
                        const mainStr = fs.readFileSync(path.join(pluginDir, 'main.js')).toString();

                        const translationJson = generateTranslation(mainStr, this.settings.I18N_AUTHOR, this.regexps, this.settings.I18N_RE_FLAGS);
                        for (const key in translationJson.dict) translationJson.dict[key] = key;
                        fs.ensureDirSync(path.join(pluginDir, 'lang'));
                        fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                        new Notice(`[${plugin.name}] ${t('BATCH_GENERATE_NPTICE')}`);
                    }
                }
            } catch (error) {
                new Notice(`⚠ ${error}`);
                console.error(`⚠ ${error}`);
            }
            new Notice(t('BATCH_GENERATE_NPTICE_2'));
            this.reload();
        });
        // #endregion

        // ==============================
        //           主逻辑	     
        // ==============================
        for (const plugin of this.plugins) {
            // ============================================================
            //                         路径及其状态
            // ============================================================
            // #region 
            const pluginDir = path.join(this.basePath, plugin.dir ?? '');

            const langDir = path.join(pluginDir, 'lang');
            const langDoc = path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.json`);
            const stateDoc = path.join(pluginDir, 'lang', 'state.json');

            const isLangDir = fs.pathExistsSync(langDir);
            const isLangDoc = fs.pathExistsSync(langDoc);
            let isStateDoc = fs.pathExistsSync(stateDoc);

            const mainDoc = path.join(pluginDir, 'main.js');
            const duplicateDoc = path.join(pluginDir, 'duplicate.js');

            // 额外支持
            const canziLangDoc = path.join(pluginDir, 'lang', `${this.settings.I18N_LANGUAGE}.canzi.txt`);
            const isCanziLangDoc = fs.pathExistsSync(canziLangDoc);

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

            // ====================
            // 插件更新(更新还原插件状态)
            // ====================
            // 1. 是否存在状态文件
            // 2. 为已翻译状态
            // 3. 插件当前版本和记录版本不同
            if (isStateDoc && stateObj.state() && plugin.version != stateObj.pluginVersion()) {
                try {
                    fs.removeSync(duplicateDoc);
                    stateObj.reset();
                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
            }
            // #endregion

            // ============================================================
            //      插件基础功能(介绍 打开目录 删除目录 编辑译文 提交译文)
            // ============================================================
            // #region
            // ====================
            // 插件介绍
            // ====================
            const block = new Setting(contentEl);
            block.setName(plugin.name);
            block.descEl.createDiv({ text: `${t('I18N_VERSION_TITLE')} ` + plugin.version });

            // ====================
            // 打开插件目录(打开)
            // ====================
            const openPluginDir = new ExtraButtonComponent(block.controlEl);
            openPluginDir.setIcon('folder-open');
            openPluginDir.setTooltip(t('OPEN_PLUGINDIR_TOOLTIP'));
            openPluginDir.onClick(() => {
                openPluginDir.setDisabled(true);
                if (navigator.userAgent.match(/Win/i)) {
                    const command = `powershell.exe -Command "Invoke-Item \\"${pluginDir}\\""`;
                    exec(command, (error) => {
                        if (error) {
                            new Notice(`⚠ ${error}`);
                            console.error(`⚠ ${error}`);
                        }
                    });
                }
                openPluginDir.setDisabled(false);
            });

            // ====================
            // 清空翻译文件(删除)
            // ====================
            // 1. 是否存在语言文件夹
            if (isLangDir) {
                const deletePluginDirButton = new ExtraButtonComponent(block.controlEl);
                deletePluginDirButton.setIcon('trash');
                deletePluginDirButton.setTooltip(t('DELETE_PLUGINDIR_TOOLTIP'));
                deletePluginDirButton.onClick(() => {
                    deletePluginDirButton.setDisabled(true);
                    try {
                        // 当为已翻译状态时
                        if (stateObj.state()) {
                            // 删除目录
                            fs.removeSync(mainDoc);
                            // 还原备份文件
                            fs.renameSync(duplicateDoc, mainDoc);
                        }
                        // 递归删除所有文件
                        fs.removeSync(langDir);
                        new Notice(t('DELETE_PLUGINDIR_NPTICE'));
                    } catch (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                    this.reload();
                });
            }

            // ====================
            // 提交译文
            // ====================
            if (this.settings.I18N_EMAIL_MODE === true && this.settings.I18N_EMAIL_EMAIL != '' && this.settings.I18N_EMAIL_KEY != '' && isLangDoc) {
                const EmailButton = new ExtraButtonComponent(block.controlEl);
                EmailButton.setIcon('mail');
                EmailButton.onClick(async () => {
                    EmailButton.setDisabled(true);
                    try {
                        // 开启一个 SMTP 连接池  
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.qq.com',
                            port: 465,
                            pool: true,
                            secure: true,
                            auth: {
                                type: 'login',
                                user: this.settings.I18N_EDIT_EMAIL,
                                pass: this.settings.I18N_EDIT_KEY
                            }
                        });
                        // 发送内容
                        const mailOptions = {
                            from: this.settings.I18N_EDIT_EMAIL,
                            to: '210555848@qq.com',
                            subject: `${plugin.id}`,
                            text: `id: ${plugin.id}\n名称: ${plugin.name}\n版本: ${plugin.version}\n作者: ${plugin.author}\n说明: ${plugin.description}`,
                            attachments: [
                                {
                                    filename: `${this.settings.I18N_LANGUAGE}.json`,
                                    path: langDoc,
                                    contentType: 'application/json'
                                }
                            ]
                        };
                        // 发送
                        await transporter.sendMail(mailOptions);
                        new Notice('提交成功');
                    } catch (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                    this.reload();
                });
            }

            // ====================
            // 编辑译文
            // ====================
            if (this.settings.I18N_EDIT_MODE === true && isLangDoc) {
                const deletePluginDirButton = new ExtraButtonComponent(block.controlEl);
                deletePluginDirButton.setIcon('pencil');
                deletePluginDirButton.onClick(() => {
                    deletePluginDirButton.setDisabled(true);
                    try {
                        new Notice('功能未完成');
                    } catch (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                    this.reload();
                });
            }
            // #endregion

            // ============================================================
            //                     本地译文翻译(生成) 
            // ============================================================
            // #region

            // [生成]
            const LDTGenerateButton = new ButtonComponent(block.controlEl);
            if (!(this.settings.I18N_MODE === "ldt" && !isLangDoc)) LDTGenerateButton.setClass('display-none');
            LDTGenerateButton.setButtonText(t('LDT_GENERATE_TEXT'));
            LDTGenerateButton.setTooltip(t('LDT_GENERATE_TOOLTIP'));
            LDTGenerateButton.onClick(() => {
                LDTGenerateButton.setDisabled(true);
                try {
                    // 1. 获取 main.js 字符串
                    const mainStr = fs.readFileSync(mainDoc).toString();
                    // 2. 获取 译文json 
                    const translationJson = generateTranslation(mainStr, this.settings.I18N_AUTHOR, this.regexps, this.settings.I18N_RE_FLAGS);
                    // 3. 确保语言目录存在
                    fs.ensureDirSync(langDir);
                    // 4. 将 译文json 写入文件
                    fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                    new Notice(t('LDT_GENERATE_NPTICE'));
                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
                this.reload();
            });
            // #endregion

            // ============================================================
            //                  网络译文翻译(下载、更新)
            // ============================================================
            // #region
            // 1. 网络文件模式开启
            // 2. 网络连接通过
            // 3. 网络存在译文 ndt
            if (this.settings.I18N_MODE === "ndt" && this.ndtMark && this.directory.includes(plugin.id)) {
                let make = false;
                let response: RequestUrlResponse;
                try {
                    response = await this.api.translation(plugin.id);
                    if (isLangDoc) {
                        const locVersion = fs.readJsonSync(langDoc).manifest.version;
                        const webVersion = response.json['manifest']['version'];
                        make = locVersion != webVersion && locVersion != '-1';
                    }
                    // 1. 本地存在译文
                    const NDTUpdateButton = new ButtonComponent(block.controlEl);
                    if (!(isLangDoc && make)) NDTUpdateButton.setClass('display-none');
                    NDTUpdateButton.setButtonText(t('NDT_UPDATE_TEXT'));
                    NDTUpdateButton.setTooltip(t('NDT_UPDATE_TOOLTIP'));
                    NDTUpdateButton.onClick(() => {
                        NDTUpdateButton.setDisabled(true);
                        fs.writeJsonSync(langDoc, JSON.parse(response.text));
                        this.reload();
                    });
                    // 1. 本地不存在译文
                    const NDTDownloadButton = new ButtonComponent(block.controlEl);
                    if (isLangDoc) NDTDownloadButton.setClass('display-none');
                    NDTDownloadButton.setButtonText(t('NDT_DOWNLOAD_TEXT'));
                    NDTDownloadButton.setTooltip(t('NDT_DOWNLOAD_TOOLTIP'));
                    NDTDownloadButton.onClick(() => {
                        NDTDownloadButton.setDisabled(true);
                        fs.ensureDirSync(langDir);
                        fs.writeJsonSync(langDoc, JSON.parse(response.text));
                        this.reload();
                    });
                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
            }
            // #endregion

            // ============================================================
            //                    网络接口翻译(生成)
            // ============================================================
            // #region
            // 1. 开启网络接口模式
            // 2. 当前语言译文不存在
            if (this.settings.I18N_MODE === "nit" && !isLangDoc) {
                const NITGenerateButton = new ButtonComponent(block.controlEl);
                NITGenerateButton.setButtonText(t('NIT_GENERATE_TEXT'));
                NITGenerateButton.setTooltip(t('NIT_GENERATE_TOOLTIP'));
                NITGenerateButton.onClick(async () => {
                    NITGenerateButton.setDisabled(true);
                    try {
                        const mainStr = fs.readFileSync(mainDoc).toString();
                        const translationJson = generateTranslation(mainStr, this.settings.I18N_AUTHOR, this.regexps, this.settings.I18N_RE_FLAGS);
                        const regex = /(['"`])(.*)(\1)/;
                        let temp = 0;
                        for (const key in translationJson.dict) {
                            new Notice(`${t('NIT_GENERATE_NPTICE')} ${temp += 1}/${Object.keys(translationJson.dict).length}`);
                            const tempArray = key.match(regex);
                            if (tempArray != null) {
                                if (this.settings.I18N_NIT_API == 'BAIDU') {
                                    const response = await this.api.baidu(tempArray[2]);
                                    if ('trans_result' in response.json) {
                                        translationJson.dict[key] = key.replace(tempArray[2], response.json['trans_result'][0]['dst']);
                                    } else {
                                        translationJson.dict[key] = key;
                                    }
                                    await sleep(500);
                                }
                                if (this.settings.I18N_NIT_API == 'YOUDAO') {
                                    // 未完待续
                                }
                            }
                        }
                        fs.ensureDirSync(langDir);
                        fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                    } catch (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                    this.reload();
                });
            }
            // #endregion

            // ============================================================
            //          译文编辑模式(生成、读取、写入、提交到邮箱)
            // ============================================================
            // #region
            // [生成]
            // const EDITGenerateButton = new ButtonComponent(block.controlEl);
            // if (!(this.settings.I18N_MODE === "edit" && !isLangDoc)) LDTGenerateButton.setClass('display-none');
            // EDITGenerateButton.setButtonText('生成');
            // EDITGenerateButton.onClick(() => {
            //     EDITGenerateButton.setDisabled(true);
            //     try {
            //         // 1. 获取 main.js 字符串
            //         const mainStr = fs.readFileSync(mainDoc).toString();
            //         // 2. 获取 译文json 
            //         const translationJson = generateTranslation(mainStr, regexs);
            //         for (const key in translationJson.dict) translationJson.dict[key] = key;
            //         // 3. 确保语言目录存在
            //         fs.ensureDirSync(langDir);
            //         // 4. 将 译文json 写入文件
            //         fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
            //         new Notice(t('LDT_GENERATE_NPTICE'));
            //     } catch (error) {
            //         new Notice(`⚠ ${error}`);
            //         console.error(`⚠ ${error}`);
            //     }
            //     this.reload();
            // });

            // const EDITGetButton = new ButtonComponent(block.controlEl);
            // EDITGetButton.setButtonText('读取');
            // if (!(this.settings.I18N_MODE === "edit" && isLangDoc)) EDITGetButton.setClass('display-none');
            // EDITGetButton.onClick(() => {
            //     EDITGetButton.setDisabled(true);
            //     try {
            //         const mainStr = fs.readFileSync(langDoc).toString();
            //         navigator.clipboard.writeText(mainStr).then(function () {
            //             new Notice(`译文已成功复制到剪贴板`);
            //         }).catch(function (err) {
            //             new Notice('无法复制文本: ', err);
            //         });
            //     } catch (error) {
            //         new Notice(`⚠ ${error}`);
            //         console.error(`⚠ ${error}`);
            //     }
            //     this.reload();
            // });

            // const EDITSetButton = new ButtonComponent(block.controlEl);
            // EDITSetButton.setButtonText('写入');
            // if (!(this.settings.I18N_MODE === "edit" && isLangDoc)) EDITSetButton.setClass('display-none');
            // EDITSetButton.onClick(async () => {
            //     EDITSetButton.setDisabled(true);
            //     try {
            //         navigator.clipboard.readText().then(function (text) {
            //             fs.ensureDirSync(langDir);
            //             fs.writeJsonSync(langDoc, JSON.parse(text), { spaces: 4 });
            //             new Notice(`剪贴板内容写入成功`);
            //         }).catch(function (err) {
            //             new Notice('无法从剪贴板读取文本: ', err);
            //         });
            //     } catch (error) {
            //         new Notice(`⚠ ${error}`);
            //         console.error(`⚠ ${error}`);
            //     }
            //     this.reload();
            // });


            // #endregion

            // ============================================================
            //                 插件基础功能(翻译 还原)
            // ============================================================
            // #region
            if (isStateDoc && isLangDoc && this.settings.I18N_MODE != "canzi" && this.settings.I18N_MODE != "edit") {
                try {
                    // 翻译按钮
                    const TrenslatorButton = new ButtonComponent(block.controlEl);
                    TrenslatorButton.setButtonText(t('TRANSLATE_TEXT'));
                    TrenslatorButton.setTooltip(t('TRANSLATE_TOOLTIP'));
                    if (!(stateObj.state() == false)) TrenslatorButton.setClass('display-none');
                    TrenslatorButton.onClick(() => {
                        TrenslatorButton.setDisabled(true);
                        // 1. 复制备份文件
                        fs.copySync(mainDoc, duplicateDoc);
                        // 2. 读取译文
                        const translationJson = fs.readJsonSync(langDoc);
                        // 3. 读取 main.js
                        let mainString = fs.readFileSync(mainDoc).toString();
                        // 4. 翻译 main.js
                        for (const key in translationJson.dict) {
                            mainString = mainString.replaceAll(key, translationJson.dict[key]);
                        }
                        // 5. 写入 main.js
                        fs.writeFileSync(mainDoc, mainString);
                        // 6. 更新状态文件
                        stateObj.update(true, plugin.version, translationJson.manifest.version);
                        new Notice(t('TRANSLATE_NPTICE'));
                        this.reload();
                    });

                    // 还原按钮
                    const RestoreButton = new ButtonComponent(block.controlEl);
                    RestoreButton.setButtonText(t('RESTORE_TEXT'));
                    RestoreButton.setTooltip(t('RESTORE_TOOLTIP'));
                    if (!(stateObj.state() == true)) RestoreButton.setClass('display-none');
                    RestoreButton.onClick(() => {
                        RestoreButton.setDisabled(true);
                        // 1. 删除 main.js
                        fs.unlinkSync(mainDoc);
                        // 2. 替换 main.js
                        fs.renameSync(duplicateDoc, mainDoc);
                        // 3. 更新状态文件
                        stateObj.reset();
                        new Notice(t('RESTORE_NPTICE'));
                        this.reload();
                    });
                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
            }
            // #endregion

            // ============================================================
            //          Obsidian-Plugin-Localization 蚕子插件支持
            // ============================================================
            // #region
            // 生成按钮
            const CanZiGenerateButton = new ButtonComponent(block.controlEl);
            if (!(this.settings.I18N_MODE === "canzi" && !isCanziLangDoc)) CanZiGenerateButton.setClass('display-none');
            CanZiGenerateButton.setButtonText('生成');
            CanZiGenerateButton.onClick(() => {
                CanZiGenerateButton.setDisabled(true);
                try {
                    // 读取文件
                    const translationJson = generateTranslation(fs.readFileSync(mainDoc).toString(), this.settings.I18N_AUTHOR, this.regexps, this.settings.I18N_RE_FLAGS);
                    fs.ensureDirSync(langDir);
                    // 写入文件
                    const lines: string[] = [];
                    lines.push("汉化:  QQ:");
                    lines.push("=========================================");
                    for (const key in translationJson.dict) {
                        lines.push(translationJson.dict[key].replace(/[\r\n]+/g, ''));
                        lines.push(key.replace(/[\r\n]+/g, ''));
                    }
                    lines.forEach((line, index, array) => {
                        if (index === array.length - 1) {
                            fs.appendFileSync(canziLangDoc, line);
                        } else {
                            fs.appendFileSync(canziLangDoc, line + '\n');
                        }
                    });
                    new Notice(t('LDT_GENERATE_NPTICE'));
                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
                this.reload();
            });

            // 转换按钮
            const CanZiConvertButton = new ButtonComponent(block.controlEl);
            if (!(this.settings.I18N_MODE === "canzi" && isCanziLangDoc && !isLangDoc)) CanZiConvertButton.setClass('display-none');
            CanZiConvertButton.setButtonText('转换');
            CanZiConvertButton.onClick(() => {
                CanZiConvertButton.setDisabled(true);
                try {
                    // 2. 原始数据
                    const originalLines: string[] = [];
                    // 3. 译文数据
                    const translateLines: string[] = [];
                    // 4. 读取数据
                    const translationString = fs.readFileSync(canziLangDoc).toString();
                    // 5. 分割数据
                    const lines = translationString.split(/\r?\n/);
                    // 获取作者
                    let author = '';
                    const match = lines[0].match(/汉化:(.*?)(?=\s+QQ:)/);
                    if (match != null) author = match[1].trim();
                    // 6. 遍历数据
                    lines.forEach((line, index) => {
                        (index % 2 === 0) ? originalLines.push(line) : translateLines.push(line);
                    });
                    // 7. 空json译文
                    const translationJson: Translation = {
                        "manifest": {
                            "author": author,
                            "version": "-1"
                        },
                        "dict": {}
                    }
                    // 8. 转换数据
                    for (let i = 1; i < originalLines.length; i++) {
                        translationJson.dict[originalLines[i]] = translateLines[i];
                    }
                    // 9. 写入数据
                    fs.writeJsonSync(langDoc, translationJson, { spaces: 4 });
                    console.log('转换完成');
                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
                this.reload();
            });

            // 翻译按钮
            const CanZiTranslateButton = new ButtonComponent(block.controlEl);
            CanZiTranslateButton.setButtonText('翻译');
            CanZiTranslateButton.setTooltip('蚕子译文翻译格式');
            if (!(this.settings.I18N_MODE === "canzi" && isStateDoc && isCanziLangDoc && stateObj.state() == false)) CanZiTranslateButton.setClass('display-none');
            CanZiTranslateButton.onClick(() => {
                CanZiTranslateButton.setDisabled(true);
                // 1. 复制备份文件
                fs.copySync(mainDoc, duplicateDoc);
                // 2. 原始数据
                const originalLines: string[] = [];
                // 3. 译文数据
                const translateLines: string[] = [];
                // 4. 读取数据
                const translationString = fs.readFileSync(canziLangDoc).toString();
                // 5. 分割数据
                const lines = translationString.split(/\r?\n/);
                // 6. 遍历数据
                lines.forEach((line, index) => {
                    if (index % 2 === 0) {
                        originalLines.push(line);
                    } else {
                        translateLines.push(line);
                    }
                });
                // 7. 读取 main.js
                let mainString = fs.readFileSync(mainDoc).toString();
                // 8. 翻译 main.js
                for (let i = 0; i < originalLines.length; i++) {
                    const originalText = originalLines[i];
                    const translatedText = translateLines[i];
                    mainString = mainString.replaceAll(originalText, translatedText);
                }
                // 9. 写入 main.js
                fs.writeFileSync(mainDoc, mainString);
                // 10. 更新状态文件
                stateObj.update(true, plugin.version, '-1');
                new Notice(t('TRANSLATE_NPTICE'));
                this.reload();
            });

            // 还原按钮
            const CanZiRestoreButton = new ButtonComponent(block.controlEl);
            CanZiRestoreButton.setButtonText(t('RESTORE_TEXT'));
            CanZiRestoreButton.setTooltip(t('RESTORE_TOOLTIP'));
            if (!(this.settings.I18N_MODE === "canzi" && isStateDoc && isCanziLangDoc && stateObj.state() == true)) CanZiRestoreButton.setClass('display-none');
            CanZiRestoreButton.onClick(() => {
                CanZiRestoreButton.setDisabled(true);
                // 1. 删除 main.js
                fs.unlinkSync(mainDoc);
                // 2. 替换 main.js
                fs.renameSync(duplicateDoc, mainDoc);
                // 3. 更新状态文件
                stateObj.reset();
                new Notice(t('RESTORE_NPTICE'));
                this.reload();
            });
            // #endregion

            // ============================================================
            //                       开发测试模式 
            // ============================================================
            // #region
            // const Test = new ButtonComponent(block.controlEl);
            // Test.setButtonText('测试');
            // if (!(this.settings.I18N_MODE === "test")) Test.setClass('display-none');
            // Test.onClick(() => {
            //     Test.setDisabled(true);
            //     try {
            //         // 打开译文目录
            //         if (navigator.userAgent.match(/Win/i)) {
            //             const command = `powershell.exe -Command "ii ${langDir}"`;
            //             exec(command, (error, stdout, stderr) => {
            //                 if (error) {
            //                     new Notice(`⚠ ${error}`);
            //                     console.error(`⚠ ${error}`);
            //                 }
            //             });
            //         }
            //         // 打开译文编辑器
            //         const url = 'https://www.example.com';
            //         exec(`start ${url}`);
            //     } catch (error) {
            //         new Notice(`⚠ ${error}`);
            //         console.error(`⚠ ${error}`);
            //     }
            //     this.reload();
            // });
            // #endregion
        }
    }

    // [重载]
    private reload() {
        this.close();
        this.open();
    }
    // [开启]
    async onOpen() {
        await this.Main();
    }
    // [关闭]
    async onClose() {
        this.contentEl.empty()
    }
}