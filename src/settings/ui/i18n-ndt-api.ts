import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { LANGUAGES } from 'src/data/data'
import { t } from "src/lang/inxdex";

export default class I18nNdtApi extends BaseSetting {
	main(): void {
		let temp_ndt_lang = '';
		let temp_ndt_url = '';
		const i18nNdtApis = new Setting(this.containerEl);
		if (!(this.settings.I18N_MODE_NDT)) i18nNdtApis.setClass('i18n_display-none');
		i18nNdtApis.setName(t('SETTING_NDT_APIS'));
		i18nNdtApis.setDesc(t('SETTING_NDT_APIS_DESC'));
		i18nNdtApis.addDropdown(cb => cb
			.addOptions(LANGUAGES)
			.setValue('')
			.onChange(async (value) => {
				temp_ndt_lang = value;
			})
		);
		i18nNdtApis.addText(cb => cb
			.setPlaceholder('URL')
			.onChange((value) => {
				temp_ndt_url = value
			})
		);
		i18nNdtApis.addButton(cb => cb
			.setButtonText(t('SETTING_NDT_API_ADD'))
			.onClick(() => {
				if (temp_ndt_lang != '' && temp_ndt_url != '') {
					this.settings.I18N_NDT_APIS[temp_ndt_lang] = temp_ndt_url;
					this.i18n.saveSettings();
					this.settingTab.display();
				}
			})
		);
		i18nNdtApis.addButton(cb => cb
			.setButtonText(this.settings.I18N_NDT_APIS_DISPLAY ? '隐藏' : '查看')
			.onClick(() => {
				this.settings.I18N_NDT_APIS_DISPLAY = !this.settings.I18N_NDT_APIS_DISPLAY;
				this.i18n.saveSettings();
				this.settingTab.display();
			})
		);
		if (this.settings.I18N_NDT_APIS_DISPLAY) {
			for (const key in this.settings.I18N_NDT_APIS) {
				const i18nNDTURL = new Setting(this.containerEl);
				i18nNDTURL.setName(key);
				i18nNDTURL.setDesc(this.settings.I18N_NDT_APIS[key]);
				i18nNDTURL.addButton(cb => cb
					.setIcon('trash')
					.onClick(() => {
						delete this.settings.I18N_NDT_APIS[key];
						this.i18n.saveSettings();
						this.settingTab.display();
					})
				)
			}
		}
	}
}