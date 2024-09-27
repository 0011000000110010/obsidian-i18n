import { App, PluginSettingTab, Setting } from 'obsidian';
import I18N from "../../main";

import I18nLanguage from './i18n-language';
import I18nModLDT from './i18n-mod-ldt';
import I18nModNDT from './i18n-mod-ndt';
import I18nModeNIT from './i18n-mod-nit';
import I18nNitBaiDu from './i18n-nit-baidu';

import I18nAuthor from './i18n-author';
import I18nOpenSettings from './i18n-open-settings';
import I18nAIOpenAI from './i18n-nit-openAI';
import I18nEditMode from './i18n-edit-mode';
import I18nSubmiteMode from './i18n-submite';

import I18nRE from './i18n-re';
import { t } from 'src/lang/inxdex';


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

		new Setting(containerEl).setName(`[${t('SETTING_BASE_TITLE_NAME')}]`).setHeading();
		new I18nLanguage(this).display();
		new I18nModLDT(this).display();
		new I18nModNDT(this).display();
		new I18nModeNIT(this).display();
		new I18nNitBaiDu(this).display();
		new I18nAIOpenAI(this).display();

		new Setting(containerEl).setName(`[${t('SETTING_MORE_TITLE_NAME')}]`).setHeading();

		new I18nAuthor(this).display();
		new I18nOpenSettings(this).display();
		new I18nEditMode(this).display();
		new I18nSubmiteMode(this).display();

		new Setting(containerEl).setName(`[${t('SETTING_RE_TITLE_NAME')}]`).setHeading();
		new I18nRE(this).display();
	}
}

export { I18nSettingTab };

