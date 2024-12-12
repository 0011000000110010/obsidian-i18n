import { App, PluginSettingTab } from 'obsidian';
import I18N from "../main";

import I18nBasis from './ui/i18n-basis';
import I18nModLDT from './ui/i18n-mode-ldt';
import I18nModNDT from './ui/i18n-mode-ndt';
import I18nModeNIT from './ui/i18n-mode-nit';
import I18nModIMT from './ui/i18n-mode-imt';
import I18nNitBaiDu from './ui/i18n-nit-baidu';
import I18nAIOpenAI from './ui/i18n-nit-openAI';
import I18nRE from './ui/i18n-re';
import I18nShare from './ui/i18n-mode-share';
import I18nStyle from './ui/i18n-style';
import { t } from 'src/lang/inxdex';

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
			{ text: t('设置_主题_标题_缩写'), content: () => this.styleDisplay() },
			{ text: t('设置_基础_标题_缩写'), content: () => this.basisDisplay() },
			{ text: t('设置_本地_标题_缩写'), content: () => this.ldtDisplay() },
			{ text: t('设置_云端_标题_缩写'), content: () => this.ndtDisplay() },
			{ text: t('设置_AI_标题_缩写'), content: () => this.nitDisplay() },
			{ text: t('设置_沉浸_标题_缩写'), content: () => this.imtDisplay() },
			{ text: t('设置_共享_标题_缩写'), content: () => this.shareDisplay() },
			{ text: t('设置_正则_标题_缩写'), content: () => this.reDisplay() },
		];
		const tabItemsEls: HTMLDivElement[] = [];

		tabItems.forEach((item, index) => {
			const itemEl = tabsEl.createEl('div');
			itemEl.addClass('i18n-setting__tabs-item');
			itemEl.textContent = item.text;
			tabItemsEls.push(itemEl);
			if (index === 0) { itemEl.addClass('i18n-setting__tabs-item_is-active'); item.content(); }
			itemEl.addEventListener('click', () => {
				tabItemsEls.forEach(tabEl => { tabEl.removeClass('i18n-setting__tabs-item_is-active') });
				itemEl.addClass('i18n-setting__tabs-item_is-active');
				item.content();
			});
		});
	}
	styleDisplay() { this.contentEl.empty(); new I18nStyle(this).display(); }
	basisDisplay() { this.contentEl.empty(); new I18nBasis(this).display(); }
	ldtDisplay() { this.contentEl.empty(); new I18nModLDT(this).display(); }
	ndtDisplay() { this.contentEl.empty(); new I18nModNDT(this).display(); }
	nitDisplay() { this.contentEl.empty(); new I18nModeNIT(this).display(); new I18nNitBaiDu(this).display(); new I18nAIOpenAI(this).display(); }
	imtDisplay() { this.contentEl.empty(); new I18nModIMT(this).display(); }
	shareDisplay() { this.contentEl.empty(); new I18nShare(this).display(); }
	reDisplay() { this.contentEl.empty(); new I18nRE(this).display(); }
}

export { I18nSettingTab };

