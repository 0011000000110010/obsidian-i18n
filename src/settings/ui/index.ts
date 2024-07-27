import { App, PluginSettingTab, Setting } from 'obsidian';
import I18N from "../../main";

import I18nHelp from './i18n-help';
import I18nLanguage from './i18n-language';
import I18nMode from './i18n-mode';
import I18nAutomaticUpdate from './i18n-automatic-update';
import I18nEditMode from './i18n-edit-mode';
import I18nAuthor from './i18n-author';
// import i18nBatch from './i18n-batch';

import I18nNdtApi from './i18n-ndt-api';
import I18nNitApi from './i18n-nit-api';
import I18nNitBaiDu from './i18n-nit-baidu';

import I18nEmailMode from './i18n-email-mode';
import I18nEmail from './i18n-email';

import I18nREMode from './i18n-re-mode';
import I18nREFlags from './i18n-re-flags';
import I18nREModes from './i18n-re-modes';
import I18nREDatas from './i18n-re-datas';

import { t } from "src/lang/inxdex";






class I18nSettingTab extends PluginSettingTab {
	i18n: I18N;

	constructor(app: App, i18n: I18N) {
		super(app, i18n);
		this.i18n = i18n;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName(t('SETTING_BASE_TITLE')).setHeading();
		new I18nHelp(this).display();
		new I18nLanguage(this).display();
		new I18nMode(this).display();
		new I18nAutomaticUpdate(this).display();
		new I18nEditMode(this).display();
		// new i18nBatch(this).display(); // 批量
		new I18nAuthor(this).display();

		// new Setting(containerEl).setName(t('SETTING_LDT_TITLE')).setHeading();


		new Setting(containerEl).setName(t('SETTING_NDT_TITLE')).setHeading();
		new I18nNdtApi(this).display();

		new Setting(containerEl).setName(t('SETTING_NIT_TITLE')).setHeading();
		new I18nNitApi(this).display();
		new I18nNitBaiDu(this).display();

		new Setting(containerEl).setName('译文提交').setHeading();
		new I18nEmailMode(this).display();
		new I18nEmail(this).display();

		new Setting(containerEl).setName('生成配置').setHeading();
		new I18nREMode(this).display();
		new I18nREFlags(this).display();
		new I18nREModes(this).display();
		new I18nREDatas(this).display();
	}
}

export { I18nSettingTab };

