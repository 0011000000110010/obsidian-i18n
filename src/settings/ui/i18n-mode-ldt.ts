import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";

// 自动更新
export default class I18nModLDT extends BaseSetting {
    main(): void {
        const i18nModLDT = new Setting(this.containerEl);
        i18nModLDT.setName(`${t('设置_本地_标题')} ${this.settings.I18N_MODE_LDT ? '🟢' : '🔴'}`);
        i18nModLDT.setDesc(t('设置_本地_描述'));
        i18nModLDT.addButton(cb => {
            cb.setButtonText(this.settings.I18N_MODE_LDT ? t('设置_通用_关闭_文本') : t('设置_通用_开启_文本'));
            cb.onClick(() => {
                this.settings.I18N_MODE_LDT = !this.settings.I18N_MODE_LDT;
                this.i18n.saveSettings();
                this.settingTab.ldtDisplay();
            })
            cb.setClass('i18n-button');
            cb.setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            this.settings.I18N_MODE_LDT ? cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-danger`) : cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`);
        });
        const i18nAutomaticUpdate = new Setting(this.containerEl);
        i18nAutomaticUpdate.setName(t('设置_本地_智能更新_标题'));
        i18nAutomaticUpdate.setDesc(t('设置_本地_智能更新_描述'));
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
        i18nIncrementalExtraction.setName(t('设置_本地_扩展提取_标题'));
        i18nIncrementalExtraction.setDesc(t('设置_本地_扩展提取_描述'));
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
        i18nNameTranslation.setName(t('设置_本地_名称翻译_标题'));
        i18nNameTranslation.setDesc(t('设置_本地_名称翻译_描述'));
        i18nNameTranslation.addText(cb => cb
            .setValue(this.settings.I18N_NAME_TRANSLATION_PREFIX)
            .onChange((value) => {
                this.settings.I18N_NAME_TRANSLATION_PREFIX = value;
                this.i18n.reloadPluginsName();
                this.i18n.saveSettings();
            })
            .inputEl.addClass('i18n-name__input', 'i18n-input')
        );
        i18nNameTranslation.addText(cb => cb
            .setValue(this.settings.I18N_NAME_TRANSLATION_SUFFIX)
            .onChange((value) => {
                this.settings.I18N_NAME_TRANSLATION_SUFFIX = value;
                this.i18n.reloadPluginsName();
                this.i18n.saveSettings();
            })
            .inputEl.addClass('i18n-name__input', 'i18n-input')
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