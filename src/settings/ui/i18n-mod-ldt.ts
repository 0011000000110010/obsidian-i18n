import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

// 自动更新
export default class I18nModLDT extends BaseSetting {
    main(): void {
        const i18nModLDT = new Setting(this.containerEl);
        i18nModLDT.setClass('i18n_bold');
        i18nModLDT.setName(`✍🏻 ${t('SETTING_LDT_NAME')}`);
        i18nModLDT.setDesc("");
        i18nModLDT.addToggle(cb => cb
            .setValue(this.settings.I18N_MODE_LDT)
            .onChange(() => {
                this.settings.I18N_MODE_LDT = !this.settings.I18N_MODE_LDT;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
        const i18nAutomaticUpdate = new Setting(this.containerEl);
        if (!(this.settings.I18N_MODE_LDT)) i18nAutomaticUpdate.setClass('i18n_display-none');
        i18nAutomaticUpdate.setName(t('SETTING_LDT_AUTOMATIC_UPDATE_NAME'));
        i18nAutomaticUpdate.setDesc(t('SETTING_LDT_AUTOMATIC_UPDATE_DESC'));
        i18nAutomaticUpdate.addToggle(cb => cb
            .setValue(this.settings.I18N_AUTOMATIC_UPDATE)
            .onChange(() => {
                this.settings.I18N_AUTOMATIC_UPDATE = !this.settings.I18N_AUTOMATIC_UPDATE;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}