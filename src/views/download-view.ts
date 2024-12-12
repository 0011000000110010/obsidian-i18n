import * as fs from 'fs-extra';
import * as path from 'path';
import { ButtonComponent, ItemView, SearchComponent, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Plugin, Theme } from 'src/data/types';
import { comparePlugin, compareTheme, diff, isPlugin, isTheme } from 'src/utils';

export const DOWNLOAD_VIEW_TYPE = 'i18n-download-view'

export class DownloadView extends ItemView {
    private i18n: I18N;
    private langDoc: string;
    private localJson: Plugin | Theme;
    private cloudJson: Plugin | Theme;
    private updateTranslationObj: { type: string, key: string, value: string, el: HTMLTableRowElement, state: boolean }[] = [];
    private errorView = false;

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.i18n.notice.reload();
        this.langDoc = this.i18n.downloadPath;
        // @ts-ignore
        this.localJson = this.i18n.downloadLocalJson;
        // @ts-ignore
        this.cloudJson = this.i18n.downloadCloudJson;
    }

    async onload() {
        const contentEl = this.contentEl;
        contentEl.addClass('i18n-review__container');
        contentEl.parentElement?.getElementsByClassName('view-header')[0].remove();
        if (!this.errorView) {
            let compare;
            if (this.i18n.downloadType === '0' && isPlugin(this.localJson) && isPlugin(this.cloudJson)) compare = comparePlugin(this.localJson, this.cloudJson);
            if (this.i18n.downloadType === '1' && isTheme(this.localJson) && isTheme(this.cloudJson)) compare = compareTheme(this.localJson, this.cloudJson);
            // ==============================
            // 描述行
            // ==============================
            if (this.i18n.downloadType === '0' && isPlugin(this.localJson) && isPlugin(this.cloudJson)) {
                const aEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                aEl.createEl('span', { text: '译文版本', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.cloudJson.manifest.translationVersion.toString(), cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
                aEl.createEl('span', { text: '源代码', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.cloudJson.description.original, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                const bEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                bEl.createEl('span', { text: '插件版本', cls: 'i18n-edit__label-wrap' });
                bEl.createEl('input', { value: this.cloudJson.manifest.pluginVersion, cls: 'i18n-edit__plugin-version-input' }).disabled = true;
                bEl.createEl('span', { text: '新描述', cls: 'i18n-edit__label-wrap' });
                bEl.createEl('input', { value: this.cloudJson.description.translation, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
            }
            if (this.i18n.downloadType === '1' && isTheme(this.localJson) && isTheme(this.cloudJson)) {
                const aEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                aEl.createEl('span', { text: '译文版本', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.cloudJson.manifest.translationVersion.toString(), cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                aEl.createEl('span', { text: '主题版本', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.cloudJson.manifest.pluginVersion, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
            }
            // ==============================
            // 数据行
            // ==============================
            const dictEl = contentEl.createEl('div', { cls: ['i18n-edit__dict'] });
            if (compare && this.localJson != undefined && this.cloudJson !== undefined) {
                const tableEl = dictEl.createEl('table', { cls: ['i18n-edit__table'] });
                // 改
                for (const key in compare.modified) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns-added'] });
                    const dictItem = { type: 'modified', key: key, value: compare.modified[key].newValue, el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);

                    const res = diff(dictItem.key, dictItem.value);
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '修改', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-warning`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = compare.modified[key].oldValue;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s2;

                    const operateCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    operateCellEl.createEl('button', { text: dictItem.state ? '禁止下载' : '允许下载', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            dictItem.state = !dictItem.state;
                            el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            el.textContent = dictItem.state ? '禁止下载' : '允许下载';
                        })
                    });
                }
                // 增
                for (const key in compare.added) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    const dictItem = { type: 'added', key: key, value: compare.added[key], el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);
                    const res = diff(dictItem.key, dictItem.value)
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '新增', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-success`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s2;
                    const operateEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    operateEl.createEl('button', { text: dictItem.state ? '禁止下载' : '允许下载', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            dictItem.state = !dictItem.state;
                            el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            el.textContent = dictItem.state ? '禁止下载' : '允许下载';
                        })
                    });
                }
                // 删
                for (const key in compare.removed) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    const dictItem = { type: 'removed', key: key, value: compare.removed[key], el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);
                    const res = diff(dictItem.key, dictItem.value)
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '删除', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-danger`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s2;

                    const operateEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    operateEl.createEl('button', { text: dictItem.state ? '禁止下载' : '允许下载', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            dictItem.state = !dictItem.state;
                            el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            el.textContent = dictItem.state ? '禁止下载' : '允许下载';
                        })
                    });

                }
                // 初始
                for (const key in compare.unchanged) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    const dictItem = { type: 'unchanged', key: key, value: compare.unchanged[key], el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);
                    const res = diff(dictItem.key, dictItem.value);
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '初始', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-info`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s2;

                    const operateEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    operateEl.createEl('button', { text: dictItem.state ? '禁止下载' : '允许下载', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            dictItem.state = !dictItem.state;
                            el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            el.textContent = dictItem.state ? '禁止下载' : '允许下载';
                        })
                    });

                }
            }
            // ==============================
            // 操作行
            // ==============================
            const searchEl = contentEl.createEl('div', { cls: ['i18n-edit__search'] });
            let matchingItems: { key: string; value: string; el: HTMLTableRowElement; }[];
            let selectSearchCount = 0;
            let isSearch = false;
            let Aa = false;
            // [搜索] 搜索栏
            const searchInput = new SearchComponent(searchEl).onChange((value) => {
                // 获取 匹配项
                matchingItems = Aa ? this.updateTranslationObj.filter(item => item.key.includes(value) || item.value.includes(value)) : this.updateTranslationObj.filter(item => item.key.toLowerCase().includes(value.toLowerCase()) || item.value.toLowerCase().includes(value.toLowerCase()));
                if (matchingItems.length > 0 && value !== '') {
                    isSearch = true;
                    searchCountButton.setButtonText(`${selectSearchCount + 1}/${matchingItems.length}`);
                    selectSearchCount = 0;
                    // 跳转 选中对象
                    matchingItems[selectSearchCount].el.scrollIntoView({ behavior: 'auto', block: 'center' });
                    matchingItems[selectSearchCount].el.classList.remove('animate');
                    void matchingItems[selectSearchCount].el.offsetWidth;
                    matchingItems[selectSearchCount].el.classList.add('animate');
                } else {
                    isSearch = false;
                    searchCountButton.setButtonText(`0/0`);
                }
            });
            // @ts-ignore
            searchInput.setClass('i18n-edit__search-box');
            searchInput.inputEl.addClass('i18n-input', 'i18n-edit__search-input')

            const AaButton = new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setIcon('a-large-small').onClick(() => {
                    if (Aa) {
                        Aa = false;
                        AaButton.buttonEl.removeClass('i18n-button--success');
                        AaButton.setClass('i18n-button--primary');
                    } else {
                        Aa = true;
                        AaButton.buttonEl.removeClass('i18n-button--primary');
                        AaButton.setClass('i18n-button--success');
                    }
                });
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setIcon('arrow-up').onClick(() => {
                    if (isSearch) {
                        // 1. 变更 搜索选中
                        if (selectSearchCount > 0) { selectSearchCount -= 1 } else if (selectSearchCount == 0) { selectSearchCount = matchingItems.length - 1; }
                        // 2. 变更 显示数量
                        searchCountButton.setButtonText(`${selectSearchCount + 1}/${matchingItems.length}`);
                        matchingItems[selectSearchCount].el.scrollIntoView({ behavior: 'auto', block: 'center' });
                        matchingItems[selectSearchCount].el.classList.remove('animate');
                        void matchingItems[selectSearchCount].el.offsetWidth;
                        matchingItems[selectSearchCount].el.classList.add('animate');
                    }
                });
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setIcon('arrow-down').onClick(() => {
                    if (isSearch) {
                        if (selectSearchCount < matchingItems.length - 1) { selectSearchCount += 1 } else if (selectSearchCount == matchingItems.length - 1) { selectSearchCount = 0; }
                        searchCountButton.setButtonText(`${selectSearchCount + 1}/${matchingItems.length}`);
                        matchingItems[selectSearchCount].el.scrollIntoView({ behavior: 'auto', block: 'center' });
                        matchingItems[selectSearchCount].el.classList.remove('animate');
                        void matchingItems[selectSearchCount].el.offsetWidth;
                        matchingItems[selectSearchCount].el.classList.add('animate');
                    }
                });
            const searchCountButton = new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText('0/0');
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-danger`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText('译文失效').onClick(async () => {
                    this.i18n.notice.result('下载视图', true, `敬请期待`);
                });
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText('保存').onClick(async () => {
                    const unchangedEntries = this.updateTranslationObj.filter(item => item.type === 'unchanged' && item.state === true).map(item => [item.key, item.value]);
                    const modifiedEntries = this.updateTranslationObj.filter(item => item.type === 'modified' && item.state === true).map(item => [item.key, item.value]);
                    const addedEntries = this.updateTranslationObj.filter(item => item.type === 'added' && item.state === true).map(item => [item.key, item.value]);
                    const falseRemovedEntries = this.updateTranslationObj.filter(item => item.type === 'removed' && item.state === false).map(item => [item.key, item.value]);
                    const allEntries = [...unchangedEntries, ...modifiedEntries, ...addedEntries, ...falseRemovedEntries];
                    this.cloudJson.dict = Object.fromEntries(allEntries);
                    fs.ensureDirSync(this.langDoc);
                    fs.writeJSONSync(path.join(this.langDoc, `${this.i18n.settings.I18N_LANGUAGE}.json`), this.cloudJson, { spaces: 4 });
                    await this.i18n.downloadView.reloadShowData();
                    this.i18n.notice.result('下载', true, `下载成功`);
                });
        } else {
            contentEl.createEl('h1', { text: 'Oh~抱歉，您的数据走丢了', cls: ['i18n-empty'] });
        }
    }

    async onunload() {
        this.i18n.notice.reload();
        this.contentEl.empty();
    }

    getViewType(): string { return DOWNLOAD_VIEW_TYPE; }
    getDisplayText(): string { return '下载视图'; }
    getIcon(): string { return 'i18n_translate'; }
}



