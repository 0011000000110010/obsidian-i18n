import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
// import { t } from "src/lang/inxdex";

export default class I18nREDatas extends BaseSetting {
	main(): void {
		let regexpString = '';
		const i18nREDatas = new Setting(this.containerEl);
		i18nREDatas.setName('数据编辑');
		i18nREDatas.setDesc('可自定义正则表达式用来获取数据');
		i18nREDatas.addText(cb => cb
			.setPlaceholder('RegExp')
			.onChange((value) => {
				regexpString = value
			})
		);
		i18nREDatas.addButton(cb => cb
			.setButtonText('添加')
			.onClick(() => {
				if (regexpString != '') {
					this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].push(regexpString);
					this.i18n.saveSettings();
					this.settingTab.display();
				}
			})
		);
		i18nREDatas.addButton(cb => cb
			.setButtonText(this.settings.I18N_RE_DATAS_DISPLAY ? '隐藏' : '查看')
			.onClick(() => {
				this.settings.I18N_RE_DATAS_DISPLAY = !this.settings.I18N_RE_DATAS_DISPLAY;
				this.i18n.saveSettings();
				this.settingTab.display();
			})
		);

		if (this.settings.I18N_RE_DATAS_DISPLAY) {
			for (let i = 0; i < this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].length; i++) {
				const i18nREDatasItem = new Setting(this.containerEl);
				i18nREDatasItem.setName(this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE][i]);
				i18nREDatasItem.addButton(cb => cb
					.setIcon('trash')
					.onClick(() => {
						this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].splice(i, 1);
						this.i18n.saveSettings();
						this.settingTab.display();
					})
				)
			}
		}

	}
}