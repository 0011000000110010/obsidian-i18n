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
import I18nRequestTranslationMode from './i18n-request-translation';
import I18nSubmiteTranslationMode from './i18n-submite-translation';


import I18nEmail from './i18n-email';

import I18nREMode from './i18n-re-mode';
import I18nREFlags from './i18n-re-flags';
import I18nREModes from './i18n-re-modes';
import I18nREDatas from './i18n-re-datas';

import I18nConvertMode from './i18n-convert';


class I18nSettingTab extends PluginSettingTab {
	i18n: I18N;

	constructor(app: App, i18n: I18N) {
		super(app, i18n);
		this.i18n = i18n;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName('基础设置').setHeading();
		new I18nLanguage(this).display();
		new I18nMode(this).display();
		new I18nAutomaticUpdate(this).display();
		// new i18nBatch(this).display(); // 批量
		new I18nHelp(this).display();

		new Setting(containerEl).setName('更多功能').setHeading();
		new I18nAuthor(this).display();
		new I18nEditMode(this).display();
		new I18nConvertMode(this).display();
		new I18nSubmiteTranslationMode(this).display();
		new I18nRequestTranslationMode(this).display();

		new Setting(containerEl).setName('匹配模式配置').setHeading();
		new I18nREMode(this).display();
		new I18nREFlags(this).display();
		new I18nREModes(this).display();
		new I18nREDatas(this).display();

		new Setting(containerEl).setName('网络文件配置').setHeading();
		new I18nNdtApi(this).display();

		new Setting(containerEl).setName('网络接口配置').setHeading();
		new I18nNitApi(this).display();
		new I18nNitBaiDu(this).display();

		new Setting(containerEl).setName('邮箱地址配置').setHeading();
		new I18nEmail(this).display();
	}
}

export { I18nSettingTab };

