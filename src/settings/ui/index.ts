import { App, PluginSettingTab } from 'obsidian';
import I18N from "../../main";

import I18nLanguage from './i18n-language';
import I18nLog from './i18n-log';
import i18nBatch from './i18n-batch';
import I18nLdtMode from './i18n-ldt-mode';
import I18nLdtGenerate from './i18n-ldt-generate';
import I18nNdtMode from './i18n-ndt-mode';
import I18nNdtApi from './i18n-ndt-api';
import I18nNitMode from './i18n-nit-mode';
import I18nNitApi from './i18n-nit-api';
import I18nNitBaiDu  from './i18n-nit-baidu';

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

		containerEl.createEl('h2', { text: t('SETTING_BASE_TITLE') });
		new I18nLanguage(this).display();
		new I18nLog(this).display();
		new i18nBatch(this).display();

		containerEl.createEl('h2', { text: t('SETTING_LDT_TITLE') });
		new I18nLdtMode(this).display();
		new I18nLdtGenerate(this).display();

		containerEl.createEl('h2', { text: t('SETTING_NDT_TITLE') });
		new I18nNdtMode(this).display();
		new I18nNdtApi(this).display();
		
		containerEl.createEl('h2', { text: t('SETTING_NIT_TITLE') });
		new I18nNitMode(this).display();
		new I18nNitApi(this).display();
		new I18nNitBaiDu(this).display();

	}
}

export { I18nSettingTab };

