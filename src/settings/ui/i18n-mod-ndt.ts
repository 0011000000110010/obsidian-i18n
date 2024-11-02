import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";


// 自动更新
export default class I18nModNDT extends BaseSetting {
    main(): void {
        const i18nModNDT = new Setting(this.containerEl);
        i18nModNDT.setName(`${t('SETTING_NDT_NAME')}`);
        i18nModNDT.setDesc('是否开启云端文件模式。');
        i18nModNDT.addButton(cb => {
            cb.setButtonText(this.settings.I18N_MODE_NDT ? '关闭' : '开启');
            cb.onClick(async () => {
                this.settings.I18N_MODE_NDT = !this.settings.I18N_MODE_NDT;
                await this.i18n.saveSettings();
                await this.i18n.ignoreCache();
                await this.i18n.directoryCache();
                this.settingTab.ndtDisplay();
            });
            cb.setClass('i18n-button');
            cb.setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            this.settings.I18N_MODE_NDT ? cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-danger`) : cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`);
            // this.settings.I18N_MODE_NDT ? cb.setClass('i18n-button--danger') : cb.setClass('i18n-button--primary');
        });

        const i18nIgnore = new Setting(this.containerEl);
        i18nIgnore.setName(t('SETTING_NDT_IGNORE_NAME'));
        i18nIgnore.setDesc(t('SETTING_NDT_IGNORE_DESC'));
        i18nIgnore.addToggle(cb => cb
            .setValue(this.settings.I18N_IGNORE)
            .onChange(async () => {
                this.settings.I18N_IGNORE = !this.settings.I18N_IGNORE;
                this.i18n.saveSettings();
                await this.i18n.ignoreCache();
                this.settingTab.ndtDisplay();
            })
            .toggleEl.addClass('i18n-checkbox')
        );

        const i18nNdtApi = new Setting(this.containerEl);
        i18nNdtApi.setName(t('SETTING_NDT_APIS_NAME'));
        i18nNdtApi.setDesc(t('SETTING_NDT_APIS_DESC'));
        i18nNdtApi.addText(cb => cb
            .setPlaceholder('owner')
            .setValue(this.settings.I18N_GITEE_OWNER)
            .onChange((value) => {
                this.settings.I18N_GITEE_OWNER = value;
            }).inputEl.addClass('i18n-input')
        );
        i18nNdtApi.addText(cb => cb
            .setPlaceholder('repo')
            .setValue(this.settings.I18N_GITEE_REPO)
            .onChange((value) => {
                this.settings.I18N_GITEE_REPO = value;
            }).inputEl.addClass('i18n-input')
        );
    }
}