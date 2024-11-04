import * as fs from 'fs-extra';
import * as path from 'path';
import BaseSetting from "../base-setting";
import { Setting } from "obsidian";
import { LANGUAGES } from "src/data/data";
import { t } from "src/lang/inxdex";

export default class I18nBasis extends BaseSetting {
    main(): void {
        // 插件主题
        // new Setting(this.containerEl).setName('插件主题').setDesc('为 Obsidian I18N 选择一个主题色。主题色将影响选中、按钮等元素的颜色。').addColorPicker(cb => cb
        //     .setValue(this.settings.I18N_COLOR)
        //     .onChange((value) => {
        //         // 409EFF
        //         document.documentElement.style.setProperty('--i18n-color-primary', value);
        //         this.settings.I18N_COLOR = value;
        //         this.i18n.saveSettings();
        //     })
        // );
        // 翻译语言
        new Setting(this.containerEl).setName('翻译语言').setDesc(t('SETTING_LANGUAGE_DESC')).addDropdown(cb => cb
            .addOptions(LANGUAGES)
            .setValue(this.settings.I18N_LANGUAGE)
            .onChange(async (value) => {
                this.settings.I18N_LANGUAGE = value;
                await this.i18n.saveSettings();
            }).selectEl.addClass('i18n-select')
        );
        // 检查更新
        new Setting(this.containerEl)
            .setName('检查更新')
            .setDesc('插件启动时自动检查是否存在更新')
            .addButton(cb => cb.setButtonText('下载')
                .setClass('i18n-button')
                .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`)
                .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                .onClick(async () => {
                    const res = await this.i18n.api.giteeGetReleasesLatest();
                    if (res.data.tag_name === this.i18n.updatesVersion) {
                        const manifest = res.data.assets.find((obj: { name: string; }) => obj.name === 'manifest.json');
                        const style = res.data.assets.find((obj: { name: string; }) => obj.name === 'styles.css');
                        const main = res.data.assets.find((obj: { name: string; }) => obj.name === 'main.js');
                        let styleString = '';
                        let mainString = '';
                        let manifestString = '';
                        if (manifest !== undefined) {
                            const res = await this.i18n.api.giteeDownload(manifest.browser_download_url);
                            if (res.state) {
                                manifestString = res.data;
                            } else {
                                this.i18n.notice.result('检查更新', false, `请求manifest.json失败\n${res.data}`)
                                return
                            }
                        } else {
                            this.i18n.notice.result('检查更新', false, '未找到manifest.json文件')
                            return;
                        }
                        if (style !== undefined) {
                            const res = await this.i18n.api.giteeDownload(style.browser_download_url);
                            if (res.state) {
                                styleString = res.data;
                            } else {
                                this.i18n.notice.result('检查更新', false, `请求styles.css失败\n${res.data}`)
                                return;
                            }
                        } else {
                            this.i18n.notice.result('检查更新', false, '未找到styles.css文件')
                            return;
                        }
                        if (main !== undefined) {
                            const res = await this.i18n.api.giteeDownload(main.browser_download_url);
                            if (res.state) {
                                mainString = res.data;
                            } else {
                                this.i18n.notice.result('检查更新', false, `请求main.js失败\n${res.data}`)
                                return;
                            }
                        } else {
                            this.i18n.notice.result('检查更新', false, '未找到main.js文件')
                            return;
                        }
                        try {
                            // @ts-ignore
                            const i18nDir = path.join(path.normalize(this.app.vault.adapter.getBasePath()), this.i18n.manifest.dir)
                            console.log(i18nDir);
                            fs.ensureDirSync(i18nDir);
                            await fs.writeFile(path.join(i18nDir, 'styles.css'), styleString);
                            await fs.writeFile(path.join(i18nDir, 'main.js'), mainString);
                            await fs.writeFile(path.join(i18nDir, 'manifest.json'), manifestString);
                            this.i18n.notice.result('检查更新', true, '更新成功');
                            // // @ts-ignore
                            // const a: PluginManifest[] = Object.values(this.app.plugins.manifests);
                            // const foundIndex = a.findIndex(manifest => manifest.id === this.i18n.manifest.id);
                            // if (foundIndex !== -1) a[foundIndex].version = this.i18n.updatesVersion;
                            // this.i18n.updatesMark = false;
                            // this.i18n.updatesVersion = '';
                            // // @ts-ignore
                            // await this.app.plugins.disablePlugin(this.i18n.manifest.id);
                            // // @ts-ignore
                            // await this.app.plugins.enablePlugin(this.i18n.manifest.id);
                            document.location.reload();
                        } catch (e) {
                            this.i18n.notice.result('检查更新', false, `写入文件失败${e}`);
                        }
                    } else {
                        this.i18n.notice.result('检查更新', false, '未找到文件')
                    }

                }).setClass(this.i18n.updatesMark ? '1' : 'i18n--hidden'))

            .addToggle(cb => cb
                .setValue(this.settings.I18N_CHECK_UPDATES)
                .onChange(async () => {
                    this.settings.I18N_CHECK_UPDATES = !this.settings.I18N_CHECK_UPDATES;
                    this.i18n.saveSettings();
                    if (this.settings.I18N_CHECK_UPDATES) {
                        await this.i18n.checkUpdates();
                    } else {
                        this.i18n.updatesMark = false;
                        this.i18n.updatesVersion = '';
                    }
                    this.settingTab.basisDisplay();
                })
                .toggleEl.addClass('i18n-checkbox')
            );
        // 跳转设置
        new Setting(this.containerEl).setName(t('SETTING_OPEN_SETTING_NAME')).setDesc(t('SETTING_OPEN_SETTING_DESC')).addToggle(cb => cb
            .setValue(this.settings.I18N_OPEN_SETTINGS)
            .onChange(() => {
                this.settings.I18N_OPEN_SETTINGS = !this.settings.I18N_OPEN_SETTINGS;
                this.i18n.saveSettings();
                this.settingTab.basisDisplay();
            })
            .toggleEl.addClass('i18n-checkbox')
        );
        // 译文编辑
        new Setting(this.containerEl).setName(t('SETTING_EDITOR_NAME')).setDesc(t('SETTING_EDITOR_DESC')).addToggle(cb => cb
            .setValue(this.settings.I18N_EDIT_MODE)
            .onChange(() => {
                this.settings.I18N_EDIT_MODE = !this.settings.I18N_EDIT_MODE;
                this.i18n.saveSettings();
                this.settingTab.basisDisplay();
            })
            .toggleEl.addClass('i18n-checkbox')
        );
    }
}