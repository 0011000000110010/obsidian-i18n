import * as fs from 'fs-extra';
import { join, normalize } from 'path';
import BaseSetting from "../base-setting";
import { Setting } from "obsidian";
import { LANGUAGES } from "src/data/data";
import { t } from "src/lang/inxdex";

export default class I18nBasis extends BaseSetting {
    main(): void {
        // 鸣谢列表
        new Setting(this.containerEl)
            .setName(t('设置_基础_鸣谢列表_标题'))
            .setDesc(t('设置_基础_鸣谢列表_描述'))
            .addButton(cb => cb.setButtonText(t('设置_基础_鸣谢列表_按钮'))
                .setClass('i18n-button')
                .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`)
                .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                .onClick(async () => {
                    this.i18n.notice.warning('Git', '\n曲淡歌', 10000);
                    this.i18n.notice.success('审核人员', '\n曲淡歌\nFENDI\n宇桐非\n孤猫', 10000);
                    this.i18n.notice.error('贡献人员', '详情查看贡献榜单', 10000);
                })
            );
        // 翻译语言
        new Setting(this.containerEl)
            .setName(t('设置_基础_翻译语言_标题'))
            .setDesc(t('设置_基础_翻译语言_描述'))
            .addDropdown(cb => cb
                .addOptions(LANGUAGES)
                .setValue(this.settings.I18N_LANGUAGE)
                .onChange(async (value) => {
                    this.settings.I18N_LANGUAGE = value;
                    await this.i18n.saveSettings();
                }).selectEl.addClass('i18n-select')
            );
        // 检查更新
        new Setting(this.containerEl)
            .setName(t('设置_基础_检查更新_标题'))
            .setDesc(t('设置_基础_检查更新_描述'))
            .addButton(cb => cb.setButtonText(t('设置_基础_检查更新_按钮'))
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
                            //@ts-ignore
                            const i18nDir = join(normalize(this.app.vault.adapter.getBasePath()), this.i18n.manifest.dir)
                            console.log(i18nDir);
                            fs.ensureDirSync(i18nDir);
                            await fs.writeFile(join(i18nDir, 'styles.css'), styleString);
                            await fs.writeFile(join(i18nDir, 'main.js'), mainString);
                            await fs.writeFile(join(i18nDir, 'manifest.json'), manifestString);
                            this.i18n.notice.result('检查更新', true, '更新成功');
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
        new Setting(this.containerEl)
            .setName(t('设置_基础_跳转设置_标题'))
            .setDesc(t('设置_基础_跳转设置_描述'))
            .addToggle(cb => cb
                .setValue(this.settings.I18N_OPEN_SETTINGS)
                .onChange(() => {
                    this.settings.I18N_OPEN_SETTINGS = !this.settings.I18N_OPEN_SETTINGS;
                    this.i18n.saveSettings();
                    this.settingTab.basisDisplay();
                })
                .toggleEl.addClass('i18n-checkbox')
            );
        // 译文编辑
        new Setting(this.containerEl)
            .setName(t('设置_基础_译文编辑_标题'))
            .setDesc(t('设置_基础_译文编辑_描述'))
            .addToggle(cb => cb
                .setValue(this.settings.I18N_EDIT_MODE)
                .onChange(() => {
                    this.settings.I18N_EDIT_MODE = !this.settings.I18N_EDIT_MODE;
                    this.i18n.saveSettings();
                    this.settingTab.basisDisplay();
                })
                .toggleEl.addClass('i18n-checkbox')
            );
        // 启动时间
        new Setting(this.containerEl)
            .setName(t('设置_基础_通知提示_标题'))
            .setDesc(t('设置_基础_通知提示_描述'))
            .addToggle(cb => cb
                .setValue(this.settings.I18N_NOTICE)
                .onChange(() => {
                    this.settings.I18N_NOTICE = !this.settings.I18N_NOTICE;
                    this.i18n.saveSettings();
                })
                .toggleEl.addClass('i18n-checkbox')
            );
        // 启动时间
        new Setting(this.containerEl)
            .setName(t('设置_基础_启动耗时_标题'))
            .setDesc(t('设置_基础_启动耗时_描述'))
            .addToggle(cb => cb
                .setValue(this.settings.I18N_START_TIME)
                .onChange(() => {
                    this.settings.I18N_START_TIME = !this.settings.I18N_START_TIME;
                    this.i18n.saveSettings();
                })
                .toggleEl.addClass('i18n-checkbox')
            );
    }
}