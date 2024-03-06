import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';

import { App, ButtonComponent, ExtraButtonComponent, Modal, Notice, Plugin, PluginManifest, RequestUrlResponse, Setting } from 'obsidian';
import { DEFAULT_SETTINGS, I18nSettings } from './settings/data';
import { I18nSettingTab } from './settings/ui';

import { regexs, regexs_1 } from './data';
import { API } from './api';
import { t } from './lang/inxdex';
import { State, generateTranslation } from './utils';


// ==============================
//          [入口] I18n
// ==============================
export default class I18N extends Plugin {
    // [变量] 总配置文件
    settings: I18nSettings;

    // 生命周期函数在用户激活 Obsidian 插件时触发。这将是您设置插件大部分功能的地方。该方法在插件更新时也会被触发。
    async onload() {
        console.log(`%c ${this.manifest.name} %c v${this.manifest.version} `,
        `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: #5B5B5B;`,
        `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: #409EFF;`,
        );
        // 加载配置
        await this.loadSettings();

        // 功能页
        this.addRibbonIcon('globe-2', 'I18N', (evt: MouseEvent) => { new I18NModal(this.app, this).open() });

        // 状态栏
        // this.addStatusBarItem().setText(`[语言] ${this.settings.I18N_LANGUAGE}`);

        // 设置页
        this.addSettingTab(new I18nSettingTab(this.app, this));
    }

    // 命周期函数在插件被禁用时触发。插件所调用的任何资源必须在这里得到释放，以防止在您的插件被禁用后对 Obsidian 的性能产生影响。
    async onunload() {
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

// ==============================
//          侧边栏 对话框 翻译
// ==============================
class I18NModal extends Modal {
    i18n: I18N;
    settings: I18nSettings;
    basePath: string;
    api: API;

    ndtMark = false;
    // [本地][变量] 插件列表
    plugins: PluginManifest[] = [];
    // [网络][变量] 网络文件目录 Directory
    directory: string[] = [];

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
        const { contentEl } = this;
        this.contentEl.setText(t('I18N_RIBBON_TITLE'));
        new Setting(contentEl);
        // ==============================
        //           初始化区域       	     
        // ==============================
        this.plugins = Object.values(this.app.plugins.manifests);
        this.plugins = this.plugins.filter(item => item.id !== 'i18n');
        this.plugins.sort((item1, item2) => { return item1.name.localeCompare(item2.name) });

        // 获取译文目录
        // 1. 网络译文模式开启
        // 2. 所选文件地址存在于数据库
        if (this.settings.I18N_NDT_MODE && !(this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS)) new Notice(t('SETTING_NDT_NPTICE'));
        if (this.settings.I18N_NDT_MODE && this.settings.I18N_LANGUAGE in this.settings.I18N_NDT_APIS) {
            try {
                const data = await this.api.directory();
                this.directory = data.json['plugins'];
                this.ndtMark = true;
            } catch (error) {
                new Notice(`⚠ ${error}`);
                console.error(`⚠ ${error}`);
            }
        }

        // ==============================
        //           批量操作	     
        // ==============================
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
                        const translationJson = generateTranslation(mainStr, regexs);
                        for (const key in translationJson.dict) translationJson.dict[key] = key;
                        fs.ensureDirSync(path.join(pluginDir, 'lang'));
                        fs.writeJsonSync(langDoc, translationJson);
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

        // ==============================
        //           主逻辑	     
        // ==============================
        for (const plugin of this.plugins) {
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
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
            }

            // ====================
            // 插件更新(更新)
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
                if(navigator.userAgent.match(/Win/i)){
                    const command = `powershell.exe -Command "ii ${pluginDir}"`;
                    exec(command, (error, stdout, stderr) => {
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
                        if (stateObj.state()) {
                            fs.removeSync(mainDoc);
                            fs.renameSync(duplicateDoc, mainDoc);
                        }
                        fs.removeSync(langDir);
                        fs.removeSync(stateDoc);
                        new Notice(t('DELETE_PLUGINDIR_NPTICE_2'));
                    } catch (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                    this.reload();
                });
            }

            // ====================
            // 网络接口翻译(生成)
            // ====================
            // 1. 开启网络接口模式
            // 2. 当前语言译文不存在
            if (this.settings.I18N_NIT_MODE && !isLangDoc) {
                const NITGenerateButton = new ButtonComponent(block.controlEl);
                if (!this.settings.I18N_NIT_MODE) NITGenerateButton.setClass('display-none');
                NITGenerateButton.setCta();
                NITGenerateButton.setButtonText(t('NIT_GENERATE_TEXT'));
                NITGenerateButton.setTooltip(t('NIT_GENERATE_TOOLTIP'));
                NITGenerateButton.onClick(async () => {
                    NITGenerateButton.setDisabled(true);
                    try {
                        const mainStr = fs.readFileSync(mainDoc).toString();
                        const translationJson = generateTranslation(mainStr, regexs_1);
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
                                    }
                                    await sleep(500);
                                }
                                if (this.settings.I18N_NIT_API == 'YOUDAO') {
                                    // 未完待续
                                }
                            }
                        }
                        fs.ensureDirSync(langDir);
                        fs.writeJsonSync(langDoc, translationJson);
                    } catch (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                    this.reload();
                });
            }

            // ====================
            // 网络译文翻译(下载、更新)
            // ====================
            // 1. 网络文件模式开启
            // 2. 网络连接通过
            // 3. 网络存在译文
            if (this.settings.I18N_NDT_MODE && this.ndtMark && this.directory.includes(plugin.id)) {
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
                    // 2. 本地和网络版本号不符
                    // 3. 本地译文版本不为-1标识符
                    const NDTUpdateButton = new ButtonComponent(block.controlEl);
                    if (!(isLangDoc && make)) NDTUpdateButton.setClass('display-none');
                    NDTUpdateButton.setButtonText(t('NDT_UPDATE_TEXT'));
                    NDTUpdateButton.setTooltip(t('NDT_UPDATE_TOOLTIP'));
                    NDTUpdateButton.setCta();
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
                    NDTUpdateButton.setCta();
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

            // ====================
            // 本地译文翻译(翻译、还原)
            // ====================
            // 1. 开启本地译文模式
            // 2. 存在状态文件
            // 3. 存在译文文件
            if (this.settings.I18N_LDT_MODE && isStateDoc && isLangDoc) {
                try {
                    const LDTTrenslatorButton = new ButtonComponent(block.controlEl);
                    LDTTrenslatorButton.setButtonText(t('LDT_TRENSLATOR_TEXT'));
                    LDTTrenslatorButton.setTooltip(t('LDT_TRENSLATOR_TOOLTIP'));
                    if (!(stateObj.state() == false)) LDTTrenslatorButton.setClass('display-none');
                    LDTTrenslatorButton.onClick(() => {
                        LDTRestoreButton.setDisabled(true);
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
                        new Notice(t('LDT_TRENSLATOR_NPTICE'));
                        this.reload();
                    });

                    const LDTRestoreButton = new ButtonComponent(block.controlEl);
                    LDTRestoreButton.setButtonText(t('LDT_RESTORE_TEXT'));
                    LDTRestoreButton.setTooltip(t('LDT_RESTORE_TOOLTIP'));
                    if (!(stateObj.state() == true)) LDTRestoreButton.setClass('display-none');
                    LDTRestoreButton.onClick(() => {
                        LDTRestoreButton.setDisabled(true);
                        // 1. 删除 main.js
                        fs.unlinkSync(mainDoc);
                        // 2. 替换 main.js
                        fs.renameSync(duplicateDoc, mainDoc);
                        // 3. 更新状态文件
                        stateObj.reset();
                        new Notice(t('LDT_RESTORE_NPTICE'));
                        this.reload();
                    });
                } catch (error) {
                    new Notice(`⚠ ${error}`);
                    console.error(`⚠ ${error}`);
                }
            }

            // ====================
            // 本地译文翻译(生成)
            // ====================
            // 1. 开启本地译文模式
            // 2. 开启生成功能
            // 3. 当前语言译文不存在
            if (this.settings.I18N_LDT_MODE && this.settings.I18N_LDT_GENERATE && !isLangDoc) {
                const LDTGenerateButton = new ButtonComponent(block.controlEl);
                if (!this.settings.I18N_LDT_GENERATE) LDTGenerateButton.setClass('display-none');
                LDTGenerateButton.setButtonText(t('LDT_GENERATE_TEXT'));
                LDTGenerateButton.setTooltip(t('LDT_GENERATE_TOOLTIP'));
                LDTGenerateButton.onClick(() => {
                    LDTGenerateButton.setDisabled(true);
                    try {
                        // 1. 获取 main.js 字符串
                        const mainStr = fs.readFileSync(mainDoc).toString();
                        // 2. 获取 译文json 
                        const translationJson = generateTranslation(mainStr, regexs);
                        for (const key in translationJson.dict) translationJson.dict[key] = key;
                        // 3. 确保语言目录存在
                        fs.ensureDirSync(langDir);
                        // 4. 将 译文json 写入文件
                        fs.writeJsonSync(langDoc, translationJson);
                        new Notice(t('LDT_GENERATE_NPTICE'));
                    } catch (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                    this.reload();
                });
            }
            // const TEST = new ButtonComponent(block.controlEl);
            // TEST.setButtonText('TEST');
            // TEST.onClick(async () => {
            //     TEST.setDisabled(true);
            //     try {
            //     } catch (error) {
            //         new Notice(`⚠ ${error}`);
            //         console.error(`⚠ ${error}`);
            //     }
            //     this.reload();
            // });
            // =========================================================================================
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



