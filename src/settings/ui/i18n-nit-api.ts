import { Setting } from "obsidian"
import BaseSetting from "./base-setting"
import { api } from "src/data/data";
import { t } from "src/lang/inxdex";

export default class I18nNitApi extends BaseSetting {
    main(): void {
        const i18nNITAPI = new Setting(this.containerEl);
        i18nNITAPI.setName(t('SETTING_NIT_APIS'));
        i18nNITAPI.setDesc(t('SETTING_NIT_APIS_DESC'));
        i18nNITAPI.addDropdown(cb => cb
            .addOptions(api)
            .setValue(this.settings.I18N_NIT_API)
            .onChange((value) => {
                this.settings.I18N_NIT_API = value;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
} 