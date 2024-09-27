import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

// 打开设置
export default class I18nOpenSettings extends BaseSetting {
    main(): void {
        const i18nOpenSettings = new Setting(this.containerEl);
        i18nOpenSettings.setClass('i18n_bold');
        i18nOpenSettings.setName(t('SETTING_OPEN_SETTING_NAME'));
        i18nOpenSettings.setDesc(t('SETTING_OPEN_SETTING_DESC'));
        i18nOpenSettings.addToggle(cb => cb
            .setValue(this.settings.I18N_OPEN_SETTINGS)
            .onChange(() => {
                this.settings.I18N_OPEN_SETTINGS = !this.settings.I18N_OPEN_SETTINGS;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}