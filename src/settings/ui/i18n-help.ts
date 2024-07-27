import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { exec } from "child_process";

export default class I18nHelp extends BaseSetting {
	main(): void {
		const I18nHelp = new Setting(this.containerEl);
		I18nHelp.setName('帮助');
		I18nHelp.addButton(cb => cb
			.setButtonText('Q群')
			.onClick(() => {
				// 打开译文编辑器
				const url = 'https://qm.qq.com/cgi-bin/qm/qr?k=7vFP82ZS4wYY-S8fykwTXaUPUmcFbTNb&jump_from=webapi&authKey=jQCeIUgdJev8DBmQJVrHKUpq60k589WvNheMGoKoa6VbUdV7UhLKtHlVTzczmEgF';
				exec(`start ${url}`);
			})
		);

	}
}