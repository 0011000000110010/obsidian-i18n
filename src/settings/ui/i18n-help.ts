import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { PNotice } from "src/utils";
import Url from "src/url";

export default class I18nHelp extends BaseSetting {
	main(): void {
		const I18nHelp = new Setting(this.containerEl);
		I18nHelp.setName('帮助');
		I18nHelp.addButton(cb => cb
			.setButtonText('鸣谢')
			.onClick(() => {
				PNotice('文档', '\ndangehub');
				PNotice('建议', '\ncuberwu');
				PNotice('译文', '\nFENDI');
			})
		);
		I18nHelp.addButton(cb => cb
			.setButtonText('文档')
			.onClick(() => {
				// exec(`start ${url}`);
				window.open(Url.DOCUMENTATION_TUTORIAL);
			})
		);
		// I18nHelp.addButton(cb => cb
		// 	.setButtonText('教程')
		// 	.onClick(() => {
		// 		PNotice('教程', '敬请期待');
		// 	})
		// );
		// I18nHelp.addButton(cb => cb
		// 	.setButtonText('QQ')
		// 	.onClick(() => {
		// 		const url = 'http://wpa.qq.com/msgrd?v=3&uin=210555848&site=qq&menu=yes';
		// 		exec(`start ${url}`);
		// 	})
		// );

		// I18nHelp.addButton(cb => cb
		// 	.setButtonText('Q群')
		// 	.onClick(() => {
		// 		// 打开译文编辑器
		// 		const url = 'https://qm.qq.com/cgi-bin/qm/qr?k=7vFP82ZS4wYY-S8fykwTXaUPUmcFbTNb&jump_from=webapi&authKey=jQCeIUgdJev8DBmQJVrHKUpq60k589WvNheMGoKoa6VbUdV7UhLKtHlVTzczmEgF';
		// 		exec(`start ${url}`);
		// 	})
		// );

	}
}