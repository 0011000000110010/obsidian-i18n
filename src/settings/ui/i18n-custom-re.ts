import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { regexs } from 'src/data/data'
import { t } from "src/lang/inxdex";

export default class I18nCustomRE extends BaseSetting {
	main(): void {
		let temp_ndt_lang = '';
		let temp_ndt_url = '';
		const i18nCustomRE = new Setting(this.containerEl);
		i18nCustomRE.setName('自定义正则表达式');
		i18nCustomRE.setDesc('可自定义正则表达式用来获取数据');
		i18nCustomRE.addDropdown(cb => cb
			.addOptions(regexs)
			.setValue('')
			.onChange(async (value) => {
				temp_ndt_lang = value;
			})
		);
		i18nCustomRE.addText(cb => cb
			.setPlaceholder('URL')
			.onChange((value) => {
				temp_ndt_url = value
			})
		);
		i18nCustomRE.addButton(cb => cb
			.setButtonText(t('SETTING_NDT_API_ADD'))
			.onClick(() => {
				if (temp_ndt_lang != '' && temp_ndt_url != '') {
					this.settings.I18N_NDT_APIS[temp_ndt_lang] = temp_ndt_url;
					this.i18n.saveSettings();
					this.settingTab.display();
				}
			})
		);
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