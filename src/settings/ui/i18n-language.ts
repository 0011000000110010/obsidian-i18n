import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { languages } from "src/data/data";
import { t } from "src/lang/inxdex";

export default class I18nLanguage extends BaseSetting {
    main(): void {
        const i18nLanguage = new Setting(this.containerEl);
        i18nLanguage.setName(t('SETTING_LANGUAGE'));
        i18nLanguage.setDesc(t('SETTING_LANGUAGE_DESC'));
        i18nLanguage.addDropdown(cb => cb
            .addOptions(languages)
            .setValue(this.settings.I18N_LANGUAGE)
            .onChange(async (value) => {
                this.settings.I18N_LANGUAGE = value;
                await this.i18n.saveSettings();
            })
        );
    }
}