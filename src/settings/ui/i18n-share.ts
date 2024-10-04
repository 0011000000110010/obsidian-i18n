import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

// ==============================
//           共建云端
// ==============================
export default class I18nShare extends BaseSetting {
    main(): void {
        const i18nShareSetting = new Setting(this.containerEl);
        i18nShareSetting.setName(t('SETTING_CLOUD_COLLABORATION_NAME'));
        i18nShareSetting.setDesc(t('SETTING_CLOUD_COLLABORATION_DESC'));
        i18nShareSetting.addButton(cb => {
            cb.setButtonText(this.settings.I18N_SUBMIT_MODE ? '关闭' : '开启')
            cb.onClick(async () => {
                this.settings.I18N_SUBMIT_MODE = !this.settings.I18N_SUBMIT_MODE;
                this.i18n.saveSettings();
                this.settingTab.shareDisplay();
            });
            cb.setClass('i18n-button');
            this.settings.I18N_SUBMIT_MODE ? cb.setClass('i18n-button--danger') : cb.setClass('i18n-button--primary');
        });

        const i18nShareUrlSetting = new Setting(this.containerEl);
        i18nShareUrlSetting.setName(t('SETTING_CLOUD_COLLABORATION_TOKEN_NAME'));
        i18nShareUrlSetting.setDesc(t('SETTING_CLOUD_COLLABORATION_TOKEN_DESC'));
        i18nShareUrlSetting.addText(cb => cb
            .setValue(this.settings.I18N_SUBMIT_URL)
            .setPlaceholder(t('SETTING_CLOUD_COLLABORATION_TOKEN_PLACEHOLDER'))
            .onChange((value) => {
                this.settings.I18N_SUBMIT_URL = value
                this.i18n.saveSettings();
            })
        );

    }
}