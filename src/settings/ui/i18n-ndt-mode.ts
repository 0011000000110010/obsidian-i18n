import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nNdtMode extends BaseSetting {
    main(): void {
        const i18nNDTMode = new Setting(this.containerEl);
		i18nNDTMode.setName(t('SETTING_NDT_MODE'));
		i18nNDTMode.setDesc(t('SETTING_NDT_MODE_DESC'));
		i18nNDTMode.addToggle(cb => cb
			.setValue(this.settings.I18N_NDT_MODE)
			.onChange(() => {
				this.settings.I18N_NDT_MODE = !this.settings.I18N_NDT_MODE;
				this.i18n.saveSettings();
				this.settingTab.display();
			})
		);
    }
} 