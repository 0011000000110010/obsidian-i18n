import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nLdtMode extends BaseSetting {
    main(): void {
        const i18nLDTMode = new Setting(this.containerEl);
		i18nLDTMode.setName(t('SETTING_LDT_MODE'));
		i18nLDTMode.setDesc(t('SETTING_LDT_MODE_DESC'));
		i18nLDTMode.addToggle(cb => cb
			.setValue(this.settings.I18N_LDT_MODE)
			.onChange(() => {
				this.settings.I18N_LDT_MODE = !this.settings.I18N_LDT_MODE;
				this.i18n.saveSettings();
				this.settingTab.display();
			})
		);
    }
} 