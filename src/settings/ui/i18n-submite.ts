import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nSubmiteMode extends BaseSetting {
    main(): void {
        const i18nSubmiteMode = new Setting(this.containerEl);
        i18nSubmiteMode.setClass('i18n_bold');
        i18nSubmiteMode.setName(t('SETTING_CLOUD_COLLABORATION_NAME'));
        i18nSubmiteMode.setDesc(t('SETTING_CLOUD_COLLABORATION_DESC'));
        i18nSubmiteMode.addToggle(cb => cb
            .setValue(this.settings.I18N_SUBMIT_MODE)
            .onChange(() => {
                this.settings.I18N_SUBMIT_MODE = !this.settings.I18N_SUBMIT_MODE;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );

        const i18nSubmiteUrl = new Setting(this.containerEl);
        if (!(this.settings.I18N_SUBMIT_MODE)) i18nSubmiteUrl.setClass('i18n_display-none');
        i18nSubmiteUrl.setName(t('SETTING_CLOUD_COLLABORATION_TOKEN_NAME'));
        i18nSubmiteUrl.setDesc(t('SETTING_CLOUD_COLLABORATION_TOKEN_DESC'));
        i18nSubmiteUrl.addText(cb => cb
            .setValue(this.settings.I18N_SUBMIT_URL)
            .setPlaceholder(t('SETTING_CLOUD_COLLABORATION_TOKEN_PLACEHOLDER'))
            .onChange((value) => {
                this.settings.I18N_SUBMIT_URL = value
                this.i18n.saveSettings();
            })
        );

    }
}