import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import nodemailer from 'nodemailer';

import { App, ButtonComponent, ExtraButtonComponent, Modal, Notice, PluginManifest, RequestUrlResponse, Setting } from 'obsidian';
import I18N from 'main';
import { I18nSettings } from '../settings/data';

import { mode } from '../data/data';
import { API } from '../api/api';
import { PNotice, State, generateTranslation } from '../utils';

import { t } from '../lang/inxdex';

// ==============================
//          侧边栏 对话框 翻译
// ==============================
export class I18NModal extends Modal {
    i18n: I18N;
    settings: I18nSettings;
    basePath: string;
    api: API;
    i18nDir: string;
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
        const i18nDirTemp = this.plugins.find(plugin => plugin.id === 'i18n')?.dir;
        if (i18nDirTemp != null) this.i18nDir = path.join(this.basePath, i18nDirTemp);;
        this.plugins = this.plugins.filter(item => item.id !== 'i18n');
        this.plugins.sort((item1, item2) => { return item1.name.localeCompare(item2.name) });

        // 获取译文目录
        if (this.settings.I18N_MODE === "ndt" && !(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS)) PNotice('网络', t('SETTING_NDT_NPTICE'));
        if (this.settings.I18N_MODE === "ndt" && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS) {
            try {
                const data = await this.api.directory();
                this.directory = data.json['plugins'];
                this.ndtMark = true;
            } catch (error) {
                PNotice('错误', error);
            }
        }
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

            // 创建状态文件对象
            const stateObj = new State(stateDoc);
            // 当状态文件不存在时创建状态文件
            if (isLangDir && !isStateDoc) {
                try {
                    stateObj.insert();
                    isStateDoc = fs.pathExistsSync(stateDoc);
                } catch (error) {
                    PNotice('错误', error);
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
                    PNotice('错误', error);
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
            // 译文求译
            // ====================
            if (this.settings.I18N_REQUEST_REANSLATION_MODE === true && this.settings.I18N_EMAIL_EMAIL != '' && this.settings.I18N_EMAIL_KEY != '') {
                const RequestRernslationButton = new ExtraButtonComponent(block.controlEl);
                RequestRernslationButton.setIcon('send');
                RequestRernslationButton.setTooltip('译文求译');
                RequestRernslationButton.onClick(async () => {
                    RequestRernslationButton.setDisabled(true);
                    try {
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.qq.com',
                            port: 465,
                            pool: true,
                            secure: true,
                            auth: {
                                type: 'login',
                                user: this.settings.I18N_EMAIL_EMAIL,
                                pass: this.settings.I18N_EMAIL_KEY
                            }
                        });
                        const mailOptions = {
                            from: this.settings.I18N_EMAIL_EMAIL,
                            to: '210555848@qq.com',
                            subject: `${plugin.id}`,
                            text: `请求翻译\nid: ${plugin.id}\n名称: ${plugin.name}\n版本: ${plugin.version}\n作者: ${plugin.author}\n说明: ${plugin.description}`,
                        };
                        await transporter.sendMail(mailOptions);
                        PNotice('邮箱', '提交成功');
                    } catch (error) {
                        PNotice('错误', error);
                    }
                    this.reload();
                });
            }

            // ====================
            // 译文提交
            // ====================
            if (this.settings.I18N_SUBMIT_REANSLATION_MODE === true && this.settings.I18N_EMAIL_EMAIL != '' && this.settings.I18N_EMAIL_KEY != '' && isLangDoc) {
                const submitRernslationButton = new ExtraButtonComponent(block.controlEl);
                submitRernslationButton.setIcon('mail');
                submitRernslationButton.setTooltip('译文提交');
                submitRernslationButton.onClick(async () => {
                    submitRernslationButton.setDisabled(true);
                    try {
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.qq.com',
                            port: 465,
                            pool: true,
                            secure: true,
                            auth: {
                                type: 'login',
                                user: this.settings.I18N_EMAIL_EMAIL,
                                pass: this.settings.I18N_EMAIL_KEY
                            }
                        });
                        const mailOptions = {
                            from: this.settings.I18N_EMAIL_EMAIL,
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
                        await transporter.sendMail(mailOptions);
                        PNotice('邮箱', '提交成功');
                    } catch (error) {
                        PNotice('错误', error);
                    }
                    this.reload();
                });
            }

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
                            PNotice('错误', error);
                        }
                    });
                }
                openPluginDir.setDisabled(false);
            });

            // ====================
            // 清空翻译文件(删除)
            // ====================
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
                        PNotice('删除', '成功');
                    } catch (error) {
                        PNotice('错误', error);
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
                        this.i18n.dangqianchajian = langDoc;
                        console.log('当前插件' + this.i18n.dangqianchajian);
                        this.i18n.activateEditView();
                    } catch (error) {
                        PNotice('错误', error);
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
                    PNotice('生成', '成功 请前往插件目录进行手动翻译工作');
                } catch (error) {
                    PNotice('错误', error);
                }
                this.reload();
            });
            // #endregion

            // ============================================================
            //                  网络译文翻译(下载、更新)
            // ============================================================
            // #region
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
                        fs.writeJsonSync(langDoc, JSON.parse(response.text), { spaces: 4 });
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
                        fs.writeJsonSync(langDoc, JSON.parse(response.text), { spaces: 4 });
                        this.reload();
                    });
                } catch (error) {
                    PNotice('错误', error);
                }
            }
            // #endregion

            // ============================================================
            //                    网络接口翻译(生成)
            // ============================================================
            // #region
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
                            PNotice('生成', `${temp += 1}/${Object.keys(translationJson.dict).length}`);
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
                        PNotice('错误', error);
                    }
                    this.reload();
                });
            }
            // #endregion
            
            // ============================================================
            //                 插件基础功能(翻译 还原)
            // ============================================================
            // #region
            if (isStateDoc && isLangDoc) {
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
                        PNotice('翻译', '重启 Obsidian 生效');
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
                        PNotice('还原', '重启 Obsidian 生效');
                        this.reload();
                    });
                } catch (error) {
                    PNotice('错误', error);
                }
            }
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