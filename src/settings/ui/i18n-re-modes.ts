import { Notice, Setting } from "obsidian";
import BaseSetting from "./base-setting";

export default class I18nREModes extends BaseSetting {
	main(): void {
		let modeString = '';
		const i18nREModes = new Setting(this.containerEl);
		i18nREModes.setName('模式编辑');
		i18nREModes.setDesc('新增和删除正则表达式匹配模式');
		i18nREModes.addText(cb => cb
			.setPlaceholder('模式')
			.onChange((value) => {
				modeString = value
			})
		);
		i18nREModes.addButton(cb => cb
			.setButtonText('添加')
			.onClick(() => {
				if (modeString != '' && !this.settings.I18N_RE_MODES.includes(modeString)) {
					this.settings.I18N_RE_MODES.push(modeString);
					if (!this.settings.I18N_RE_DATAS.hasOwnProperty(modeString)) {
						this.settings.I18N_RE_DATAS[modeString] = [];
					}
					this.i18n.saveSettings();
					this.settingTab.display();
				} else {
					new Notice(`RE模式名称重复 无法添加`);
				}
			})
		);
		i18nREModes.addButton(cb => cb
			.setButtonText(this.settings.I18N_RE_MODE_DISPLAY ? '隐藏' : '查看')
			.onClick(() => {
				this.settings.I18N_RE_MODE_DISPLAY = !this.settings.I18N_RE_MODE_DISPLAY;
				this.i18n.saveSettings();
				this.settingTab.display();
			})
		);
		if (this.settings.I18N_RE_MODE_DISPLAY) {
			for (let i = 0; i < this.settings.I18N_RE_MODES.length; i++) {
				const i18nREModeItem = new Setting(this.containerEl);
				i18nREModeItem.setName(this.settings.I18N_RE_MODES[i]);
				if (this.settings.I18N_RE_MODE != this.settings.I18N_RE_MODES[i]) {
					i18nREModeItem.addButton(cb => cb
						.setIcon('check')
						.onClick(() => {
							this.settings.I18N_RE_MODE = this.settings.I18N_RE_MODES[i];
							this.i18n.saveSettings();
							this.settingTab.display();
						})
					)
				}
				i18nREModeItem.addButton(cb => cb
					.setIcon('trash')
					.onClick(() => {
						if (this.settings.I18N_RE_MODES.length > 1) {
							delete this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODES[i]];
							const a = this.settings.I18N_RE_MODES[i]
							const b = this.settings.I18N_RE_MODE
							console.log(a == b);
							if (this.settings.I18N_RE_MODES[i] == this.settings.I18N_RE_MODE) {
								this.settings.I18N_RE_MODE = this.settings.I18N_RE_MODES[0]
							}
							this.settings.I18N_RE_MODES.splice(i, 1);
							new Notice(`删除成功`);
						} else {
							new Notice(`只剩下一个了 无法删除`);
						}
						this.i18n.saveSettings();
						this.settingTab.display();
					})
				)

			}
		}

	}
}