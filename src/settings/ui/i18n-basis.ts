import BaseSetting from "../base-setting";
import { Setting } from "obsidian";
import { LANGUAGES } from "src/data/data";
import { t } from "src/lang/inxdex";

export default class I18nBasis extends BaseSetting {
    main(): void {
        // 插件主题
        const i18nColor = new Setting(this.containerEl).setName('插件主题').setDesc('为 Obsidian I18N 选择一个主题色。主题色将影响选中、按钮等元素的颜色。').addColorPicker(cb => cb
            .setValue(this.settings.I18N_COLOR)
            .onChange((value) => {
                // 409EFF
                document.documentElement.style.setProperty('--i18n-color-primary', value);
                this.settings.I18N_COLOR = value;
                this.i18n.saveSettings();
            })
        );
        // 翻译语言
        new Setting(this.containerEl).setName('翻译语言').setDesc(t('SETTING_LANGUAGE_DESC')).addDropdown(cb => cb
            .addOptions(LANGUAGES)
            .setValue(this.settings.I18N_LANGUAGE)
            .onChange(async (value) => {
                this.settings.I18N_LANGUAGE = value;
                await this.i18n.saveSettings();
            })
        );
        // 检查更新
        new Setting(this.containerEl).setName('检查更新').setDesc('插件启动时自动检查是否存在更新').addToggle(cb => cb
            .setValue(this.settings.I18N_CHECK_UPDATES)
            .onChange(() => {
                this.settings.I18N_CHECK_UPDATES = !this.settings.I18N_CHECK_UPDATES;
                this.i18n.saveSettings();
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