import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import Url from "src/url";
import { t } from "src/lang/inxdex";

export default class I18nHelp extends BaseSetting {
	main(): void {
		const helpEl = new Setting(this.containerEl);
		helpEl.setName(t('SETTING_HELP_NAME'));
		helpEl.addButton(cb => cb
			.setButtonText('鸣谢')
			.onClick(() => { this.i18n.notice.primary('设计', '\nzero\n曲淡歌', 10000); this.i18n.notice.error('译文', '\nFENDI\n曲淡歌\n宇桐非\n里安', 10000); this.i18n.notice.warning('建议', '\ncuberwu', 10000); })
		);
		helpEl.addButton(cb => cb.setButtonText('文档').onClick(() => { window.open(Url.DOCUMENTATION_TUTORIAL); }));
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
