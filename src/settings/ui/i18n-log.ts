import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nLog extends BaseSetting {
    main(): void {
        const i18nLog = new Setting(this.containerEl);
        i18nLog.setName(t('SETTING_LOG'));
        i18nLog.setDesc(t('SETTING_LOG_DESC'));
        // I18N_LOG.addSearch()
        i18nLog.addToggle(cb => cb
            .setValue(this.settings.I18N_LOG)
            .onChange(() => {
                this.settings.I18N_LOG = !this.settings.I18N_LOG;
                this.i18n.saveSettings();
            })
        );
    }
}