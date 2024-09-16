import { App, PluginSettingTab, Setting } from 'obsidian';
import I18N from "../../main";

import I18nHelp from './i18n-help';
import I18nLanguage from './i18n-language';
import I18nModLDT from './i18n-mod-ldt';
import I18nModNDT from './i18n-mod-ndt';
import I18nNdtApi from './i18n-ndt-api';
import I18nModeNIT from './i18n-mod-nit';
import I18nNitBaiDu from './i18n-nit-baidu';

import I18nAuthor from './i18n-author';
// import I18nAutomaticUpdate from './i18n-automatic-update';
import I18nOpenSettings from './i18n-open-settings';
import I18nAIOpenAI from './i18n-nit-openAI';
import I18nEditMode from './i18n-edit-mode';
import I18nSubmiteTranslationMode from './i18n-submite-translation';
// import I18nRequestTranslationMode from './i18n-request-translation';
import I18nIgnore from './i18n-ignore';

import I18nRE from './i18n-re';


class I18nSettingTab extends PluginSettingTab {
	i18n: I18N;
	app: App;

	constructor(app: App, i18n: I18N) {
		super(app, i18n);
		this.i18n = i18n;
		this.app = app;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName('基础设置').setHeading();
		new I18nHelp(this).display();
		new I18nLanguage(this).display();
		new I18nModLDT(this).display();
		new I18nModNDT(this).display();
		new I18nNdtApi(this).display();
		new I18nModeNIT(this).display();
		new I18nNitBaiDu(this).display();
		new I18nAIOpenAI(this).display();

		new Setting(containerEl).setName('更多功能').setHeading();
		new I18nAuthor(this).display();
		// new I18nAutomaticUpdate(this).display();
		new I18nOpenSettings(this).display();
		new I18nEditMode(this).display();
		new I18nSubmiteTranslationMode(this).display();
		// new I18nRequestTranslationMode(this).display();
		new I18nIgnore(this).display();

		new Setting(containerEl).setName('匹配模式配置').setHeading();
		new I18nRE(this).display();
	}
}

export { I18nSettingTab };

