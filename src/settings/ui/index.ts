import { App, PluginSettingTab } from 'obsidian';
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
import I18nSubmiteMode from './i18n-share';
import I18nRE from './i18n-re';
import { t } from 'src/lang/inxdex';
import I18nColor from './i18n-color';
import I18nShare from './i18n-share';


class I18nSettingTab extends PluginSettingTab {
	i18n: I18N;
	app: App;
	contentEl: HTMLDivElement;

	constructor(app: App, i18n: I18N) {
		super(app, i18n);
		this.i18n = i18n;
		this.app = app;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass('i18n-setting__container');

		const tabsEl = this.containerEl.createEl('div');
		tabsEl.addClass('i18n-setting__tabs');
		this.contentEl = this.containerEl.createEl('div');
		this.contentEl.addClass('i18n-setting__content');

		const tabItems = [
			{ text: '基础设置', content: () => this.basisDisplay() },
			{ text: '本地模式', content: () => this.ldtDisplay() },
			{ text: '云端模式', content: () => this.ndtDisplay() },
			{ text: '机器翻译', content: () => this.nitDisplay() },
			{ text: '共建云端', content: () => this.shareDisplay() },
			{ text: '正则配置', content: () => this.reDisplay() },
		];
		const tabItemsEls: HTMLDivElement[] = [];

		tabItems.forEach((item, index) => {
			const itemEl = tabsEl.createEl('div');
			itemEl.addClass('i18n-setting__tabs-item');
			itemEl.textContent = item.text;
			tabItemsEls.push(itemEl);
			if (index === 0) { itemEl.addClass('i18n-setting__tabs-item_is-active'); item.content(); }
			itemEl.addEventListener('click', () => {
				// this.display();
				// 移除所有标签上的激活类
				tabItemsEls.forEach(tabEl => { tabEl.removeClass('i18n-setting__tabs-item_is-active') });
				itemEl.addClass('i18n-setting__tabs-item_is-active');
				item.content();
			});
		});
	}

	basisDisplay() {
		this.contentEl.empty();
		new I18nLanguage(this).display();
		new I18nColor(this).display();
		new I18nAuthor(this).display();
		new I18nOpenSettings(this).display();
		new I18nEditMode(this).display();
	}
	ldtDisplay() {
		this.contentEl.empty();
		new I18nModLDT(this).display();
	}
	ndtDisplay() {
		this.contentEl.empty();
		new I18nModNDT(this).display();
	}
	nitDisplay() {
		this.contentEl.empty();
		new I18nModeNIT(this).display();
		new I18nNitBaiDu(this).display();
		new I18nAIOpenAI(this).display();
	}
	shareDisplay() {
		this.contentEl.empty();
		new I18nShare(this).display();
	}
	reDisplay() {
		this.contentEl.empty();
		new I18nRE(this).display();
	}
}

export { I18nSettingTab };

