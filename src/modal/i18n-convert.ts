import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';

import { App, ButtonComponent, Modal, Notice, PluginManifest, Setting } from 'obsidian';
import I18N from 'main';

import { I18nSettings } from '../settings/data';
import { Translation } from '../data/types';

// ==============================
//          侧边栏 对话框 转译
// ==============================
export class ConvertModal extends Modal {
    i18n: I18N;
    settings: I18nSettings;
    i18nDir: string;
    plugins: PluginManifest[] = [];

    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n;
        this.settings = i18n.settings;
    }

    public async Main() {
        // #region 初始化
        const { contentEl } = this;
        this.contentEl.setText('译文转换');
        new Setting(contentEl);

        this.plugins = Object.values(this.app.plugins.manifests);
        const i18nDirTemp = this.plugins.find(plugin => plugin.id === 'i18n')?.dir;
        if (i18nDirTemp != null) this.i18nDir = path.join(path.normalize(this.app.vault.adapter.getBasePath()), i18nDirTemp);;

        const inputDir = path.join(this.i18nDir, 'input');
        const outputDir = path.join(this.i18nDir, 'output');
        const isInputDir = fs.pathExistsSync(inputDir);
        const isOutputDir = fs.pathExistsSync(outputDir);
        // #endregion

        // #region 基础
        const stateBlock = new Setting(contentEl);
        stateBlock.setName('基础');
        const InputDirButton = new ButtonComponent(stateBlock.controlEl);
        InputDirButton.setButtonText('输入文件夹');
        isInputDir ? InputDirButton.setCta() : InputDirButton.setWarning();
        InputDirButton.onClick(() => {
            InputDirButton.setDisabled(true);
            try {
                if (isInputDir) {
                    if (navigator.userAgent.match(/Win/i)) {
                        const commandInput = `powershell.exe -Command "Invoke-Item \\"${inputDir}\\""`;
                        exec(commandInput, (error) => {
                            if (error) {
                                new Notice(`⚠ ${error}`);
                                console.error(`⚠ ${error}`);
                            }
                        });
                    }
                    new Notice('输入文件夹: 打开成功');
                } else {
                    fs.ensureDirSync(inputDir);
                    new Notice('输入文件夹: 创建成功');
                }
            } catch (error) {
                new Notice(`输入文件夹: 创建失败 ${error}`);
            }
            this.reload();
        });
        const OutputDirButton = new ButtonComponent(stateBlock.controlEl);
        OutputDirButton.setButtonText('输出文件夹');
        isOutputDir ? OutputDirButton.setCta() : OutputDirButton.setWarning();
        OutputDirButton.onClick(() => {
            OutputDirButton.setDisabled(true);
            try {
                if (isOutputDir) {
                    if (navigator.userAgent.match(/Win/i)) {
                        const commandOutput = `powershell.exe -Command "Invoke-Item \\"${outputDir}\\""`;
                        exec(commandOutput, (error) => {
                            if (error) {
                                new Notice(`⚠ ${error}`);
                                console.error(`⚠ ${error}`);
                            }
                        });
                    }
                    new Notice('输出文件夹: 打开成功');
                } else {
                    fs.ensureDirSync(outputDir);
                    new Notice('输出文件夹: 创建成功');
                }
            } catch (error) {
                new Notice(`输出文件夹: 创建失败 ${error}`);
            }
            this.reload();
        });
        const ConvertOpenButton = new ButtonComponent(stateBlock.controlEl);
        ConvertOpenButton.setButtonText('一键打开');
        ConvertOpenButton.onClick(() => {
            ConvertOpenButton.setDisabled(true);
            inspectDir();
            if (navigator.userAgent.match(/Win/i)) {
                const commandInput = `powershell.exe -Command "Invoke-Item \\"${inputDir}\\""`;
                exec(commandInput, (error) => {
                    if (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                });
                const commandOutput = `powershell.exe -Command "Invoke-Item \\"${outputDir}\\""`;
                exec(commandOutput, (error) => {
                    if (error) {
                        new Notice(`⚠ ${error}`);
                        console.error(`⚠ ${error}`);
                    }
                });
            }
            this.reload();
        });
        // #endregion

        // #region 蚕子
        const canziBlock = new Setting(contentEl);
        canziBlock.setName('蚕子');
        const ConvertButton = new ButtonComponent(canziBlock.controlEl);
        ConvertButton.setButtonText('批量转换');
        ConvertButton.onClick(() => {
            ConvertButton.setDisabled(true);
            // 检查文件夹
            inspectDir();
            try {
                // 1. 获取所有文件
                const files = fs.readdirSync(inputDir);
                // 2. 计数
                let count = 0;
                // 3. 遍历文件
                for (const fileName of files) {
                    // 4. 拼接路径
                    const translationDoc = path.join(inputDir, fileName);
                    // 5. 获取内容
                    const translationString = fs.readFileSync(translationDoc, 'utf8').toString();
                    // 6. 原始数据
                    const originalLines: string[] = [];
                    // 7. 译文数据
                    const translateLines: string[] = [];
                    // 8. 分割数据
                    const lines = translationString.split(/\r?\n/);
                    // 9. 获取作者
                    let author = '';
                    const match = lines[0].match(/汉化:(.*?)(?=\s+QQ:)/);
                    if (match != null) author = match[1].trim();
                    // 10. 遍历数据
                    lines.forEach((line, index) => {
                        (index % 2 === 0) ? originalLines.push(line) : translateLines.push(line);
                    });
                    // 11. 空json译文
                    const translationJson: Translation = {
                        "manifest": {
                            "author": author,
                            "version": "-1"
                        },
                        "dict": {}
                    }
                    // 12. 转换数据
                    for (let i = 1; i < originalLines.length; i++) {
                        translationJson.dict[originalLines[i]] = translateLines[i];
                    }
                    // 13. 转换保存路径
                    const translationDir = path.join(outputDir, `${fileName.slice(0, fileName.lastIndexOf('.'))}.json`);
                    // 14. 写入数据
                    fs.writeJsonSync(translationDir, translationJson, { spaces: 4 });
                    // 15. 计数
                    count += 1
                }
                new Notice(`转换完成[${count}]个译文`);
            } catch (error) {
                new Notice(`⚠ ${error}`);
            }
            this.reload();
        });
        // #endregion

        // #region 功能
        // 检查文件夹
        const inspectDir = () => {
            try {
                if (!isInputDir || !isOutputDir) {
                    fs.ensureDirSync(inputDir);
                    fs.ensureDirSync(outputDir);
                }
            } catch (error) {
                new Notice(`${error}`);
            }
        }
        // #endregion
    }

    private reload() {
        this.close();
        this.open();
    }
    async onOpen() {
        await this.Main();
    }
    async onClose() {
        this.contentEl.empty();
    }
}