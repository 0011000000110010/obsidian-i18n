import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";

// 自动更新
export default class I18nModLDT extends BaseSetting {
    main(): void {
        const i18nModLDT = new Setting(this.containerEl);
        i18nModLDT.setName(t('SETTING_LDT_NAME'));
        i18nModLDT.setDesc('是否开启本地文件模式');
        i18nModLDT.addButton(cb => {
            cb.setButtonText(this.settings.I18N_MODE_LDT ? '关闭' : '开启');
            cb.onClick(() => {
                this.settings.I18N_MODE_LDT = !this.settings.I18N_MODE_LDT;
                this.i18n.saveSettings();
                this.settingTab.ldtDisplay();
            })
            cb.setClass('i18n-button');
            this.settings.I18N_MODE_LDT ? cb.setClass('i18n-button--danger') : cb.setClass('i18n-button--primary');
        });
        const i18nAutomaticUpdate = new Setting(this.containerEl);
        i18nAutomaticUpdate.setName(t('SETTING_LDT_AUTOMATIC_UPDATE_NAME'));
        i18nAutomaticUpdate.setDesc(t('SETTING_LDT_AUTOMATIC_UPDATE_DESC'));
        i18nAutomaticUpdate.addToggle(cb => cb
            .setValue(this.settings.I18N_AUTOMATIC_UPDATE)
            .onChange(() => {
                this.settings.I18N_AUTOMATIC_UPDATE = !this.settings.I18N_AUTOMATIC_UPDATE;
                this.i18n.saveSettings();
                this.settingTab.ldtDisplay();
            })
            .toggleEl.addClass('i18n-checkbox')
        );

        const i18nIncrementalExtraction = new Setting(this.containerEl);
        i18nIncrementalExtraction.setName('增量提取');
        i18nIncrementalExtraction.setDesc('增量提取功能允许您在本地已有译文的基础上，继续提取并自动合并新译文，实现译文的持续更新与累积。');
        i18nIncrementalExtraction.addToggle(cb => cb
            .setValue(this.settings.I18N_INCREMENTAL_EXTRACTION)
            .onChange(() => {
                this.settings.I18N_INCREMENTAL_EXTRACTION = !this.settings.I18N_INCREMENTAL_EXTRACTION;
                this.i18n.saveSettings();
                this.settingTab.ldtDisplay();
            })
            .toggleEl.addClass('i18n-checkbox')
        );

        const i18nNameTranslation = new Setting(this.containerEl);
        i18nNameTranslation.setName('名称翻译');
        i18nNameTranslation.setDesc('启用插件名称翻译功能，将在插件后添加[]以展示其翻译名称(插件设置界面刷新操作会导致当前翻译失效，需重启ob重新加载翻译)');
        i18nNameTranslation.addText(cb => cb
            .setValue(this.settings.I18N_NAME_TRANSLATION_PREFIX)
            .onChange((value) => {
                this.settings.I18N_NAME_TRANSLATION_PREFIX = value;
                this.i18n.reloadPluginsName();
                this.i18n.saveSettings();
            })
            .inputEl.addClass('i18n-name__input')
        );
        i18nNameTranslation.addText(cb => cb
            .setValue(this.settings.I18N_NAME_TRANSLATION_SUFFIX)
            .onChange((value) => {
                this.settings.I18N_NAME_TRANSLATION_SUFFIX = value;
                this.i18n.reloadPluginsName();
                this.i18n.saveSettings();
                // this.settingTab.ldtDisplay();
            })
            .inputEl.addClass('i18n-name__input')
        );
        i18nNameTranslation.addToggle(cb => cb
            .setValue(this.settings.I18N_NAME_TRANSLATION)
            .onChange(() => {
                this.settings.I18N_NAME_TRANSLATION = !this.settings.I18N_NAME_TRANSLATION;
                this.settings.I18N_NAME_TRANSLATION ? this.i18n.trenslatorPluginsName() : this.i18n.restorePluginsName();
                this.i18n.saveSettings();
                this.settingTab.ldtDisplay();
            })
            .toggleEl.addClass('i18n-checkbox')
        );
    }
}