import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nNitMode extends BaseSetting {
    main(): void {
        const i18nNITMode = new Setting(this.containerEl)
		i18nNITMode.setName(t('SETTING_NIT_MODE'));
		i18nNITMode.setDesc(t('SETTING_NIT_MODE_DESC'));
		i18nNITMode.addToggle(cb => cb
			.setValue(this.settings.I18N_NIT_MODE)
			.onChange(() => {
				this.settings.I18N_NIT_MODE = !this.settings.I18N_NIT_MODE;
				this.i18n.saveSettings();
				this.settingTab.display();
			})
		);
    }
} 