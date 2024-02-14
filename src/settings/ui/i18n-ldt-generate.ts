import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nLdtGenerate extends BaseSetting {
    main(): void {
        const i18nLDTGenerate = new Setting(this.containerEl);
		if (!(this.settings.I18N_LDT_MODE)) i18nLDTGenerate.setClass('display-none');
		i18nLDTGenerate.setName(t('SETTING_LDT_GENERATE'));
		i18nLDTGenerate.setDesc(t('SETTING_LDT_GENERATE_DESC'));
		i18nLDTGenerate.addToggle(cb => cb
			.setValue(this.settings.I18N_LDT_GENERATE)
			.onChange(() => {
				this.settings.I18N_LDT_GENERATE = !this.settings.I18N_LDT_GENERATE;
				this.i18n.saveSettings();
			})
		);
    }
} 