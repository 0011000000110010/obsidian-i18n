import * as fs from 'fs-extra';
import { ButtonComponent, ItemView, Notice, SearchComponent, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Translation } from 'src/data/types';
import { formatTimestamp_concise } from 'src/utils';
import { t } from 'src/lang/inxdex';
import { exec } from 'child_process';
import * as path from 'path';

// @ts-ignore
import { diffWords } from 'diff';

export const EDIT_VIEW_TYPE = 'i18n-edit-view'

export class EditorView extends ItemView {
    private i18n: I18N;
    private notices: Notice[] = [];
    private translationDoc: string;
    private translationJson: Translation;
    private translationDict: { key: string, value: string, el: HTMLTableRowElement }[] = [];

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.i18n.notice.reload();
        this.contentEl.style.setProperty('--i18n-color-primary', this.i18n.settings.I18N_COLOR);
        this.translationDoc = this.i18n.editorTranslationDoc
    }

    onload(): void {
        if (this.translationDoc != '') this.translationJson = fs.readJsonSync(this.translationDoc);
        const editEl = this.contentEl;
        editEl.parentElement?.getElementsByClassName('view-header')[0].remove();
        editEl.addClass('i18n-edit__container');

        const manifestEl_1 = editEl.createEl('div');
        manifestEl_1.addClass('i18n-edit__manifest');
        // 译文版本
        const translationVersionLabelEl = manifestEl_1.createEl('span');
        translationVersionLabelEl.textContent = '译文版本';
        translationVersionLabelEl.addClass('i18n-edit__label-wrap');
        const translationVersionEl = manifestEl_1.createEl('input');
        translationVersionEl.addClass('i18n-edit__plugin-version-input');
        translationVersionEl.disabled = true;
        // 旧描述
        const originalDescriptionLabelEl = manifestEl_1.createEl('span');
        originalDescriptionLabelEl.textContent = '旧描述';
        originalDescriptionLabelEl.addClass('i18n-edit__label-wrap');
        const originalDescriptionInputEl = manifestEl_1.createEl('input');
        originalDescriptionInputEl.addClass('i18n-edit__description-input');
        originalDescriptionInputEl.disabled = true;

        // manifestDOM
        const manifestEl = editEl.createEl('div');
        manifestEl.addClass('i18n-edit__manifest');
        // 插件版本
        const pluginVersionLabelEl = manifestEl.createEl('span');
        pluginVersionLabelEl.textContent = '插件版本';
        pluginVersionLabelEl.addClass('i18n-edit__label-wrap');
        const pluginVersionEl = manifestEl.createEl('input');
        pluginVersionEl.addClass('i18n-edit__plugin-version-input');
        // 描述
        const descriptionLabelEl = manifestEl.createEl('span');
        descriptionLabelEl.textContent = '新描述';
        descriptionLabelEl.addClass('i18n-edit__label-wrap');
        const descriptionInputEl = manifestEl.createEl('input');
        descriptionInputEl.addClass('i18n-edit__description-input');

        // 描述翻译DOM
        if (this.i18n.settings.I18N_MODE_NIT && this.i18n.settings.I18N_NIT_API == 'BAIDU' && this.translationJson != undefined) {
            const translationDescriptionButton = new ButtonComponent(manifestEl);
            translationDescriptionButton.setClass('i18n-button');
            translationDescriptionButton.setClass('i18n-button--primary');
            translationDescriptionButton.setClass('i18n-edit__save-button');
            translationDescriptionButton.setButtonText('百度');
            translationDescriptionButton.onClick(async () => {
                try {
                    const response = await this.i18n.api.baiduAPI(descriptionInputEl.value);
                    if (response.state) descriptionInputEl.value = response.data;
                    this.translationJson.description.translation = response.data;
                } catch (error) {
                    console.log(error);
                }
            });
        }
        // 字典DOM
        const dictEl = editEl.createEl('div');
        dictEl.addClass('i18n-edit__dict');
        // 搜索DOM
        const searchEl = editEl.createEl('div');
        searchEl.addClass('i18n-edit__search');
        // 操作DOM
        const operateEl = editEl.createEl('div');
        operateEl.addClass('i18n-edit__operate');

        if (this.translationJson != undefined) {
            // 翻译版本
            translationVersionEl.value = formatTimestamp_concise(this.translationJson.manifest.translationVersion);
            // 旧描述
            originalDescriptionInputEl.value = this.translationJson.description.original;

            pluginVersionEl.value = this.translationJson.manifest.pluginVersion;
            pluginVersionEl.addEventListener('input', () => { this.translationJson.manifest.pluginVersion = pluginVersionEl.value });
            descriptionInputEl.value = this.translationJson.description.translation;
            descriptionInputEl.addEventListener('input', () => { this.translationJson.description.translation = descriptionInputEl.value });

            // ==============================
            // dictEl
            // ==============================
            const tableEl = dictEl.createEl('table');
            tableEl.addClass('i18n-edit__table');
            for (const key in this.translationJson.dict) {
                if (this.translationJson.dict.hasOwnProperty(key)) {
                    // row DOM
                    const rowEl = tableEl.createEl('tr');
                    rowEl.addClass('i18n-edit__table-row')
                    const dictItem = { key: key, value: this.translationJson.dict[key], el: rowEl }
                    // 新增 字典条目
                    this.translationDict.push(dictItem);
                    // key DOM
                    const keyCellEl = rowEl.createEl('td');
                    keyCellEl.addClass('i18n-edit__table-key');
                    // value DOM
                    const valueCellEl = rowEl.createEl('td');
                    valueCellEl.addClass('i18n-edit__table-value');
                    valueCellEl.setAttribute('contenteditable', 'true');
                    valueCellEl.addEventListener('input', () => {
                        if (valueCellEl.textContent) dictItem.value = valueCellEl.textContent;
                        const res = this.diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                    });
                    valueCellEl.addEventListener('blur', () => {
                        const res = this.diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                        valueCellEl.innerHTML = res.s2;
                    });
                    const operateEl = rowEl.createEl('td');
                    // operateEl.addClass('i18n-edit__table-operate');
                    operateEl.createEl('button', { text: '还原', cls: ['i18n-basic-button', 'i18n-basic-button--warning'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            dictItem.value = dictItem.key;
                            keyCellEl.textContent = dictItem.key;
                            valueCellEl.textContent = dictItem.key;
                            this.i18n.notice.success(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000);
                            // this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                        })
                    });
                    const operateEl1 = rowEl.createEl('td');
                    // operateEl1.addClass('i18n-edit__table-operate');
                    operateEl1.createEl('button', { text: '删除', cls: ['i18n-basic-button', 'i18n-basic-button--danger'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            rowEl.remove();
                            this.translationDict = this.translationDict.filter(item => item.key !== dictItem.key);
                            this.i18n.notice.success(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000);
                            // this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                        })
                    });
                    const diff = this.diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = diff.s1;
                    valueCellEl.innerHTML = diff.s2;
                }
            }

            // ==============================
            // searchEl
            // ==============================
            let matchingItems: { key: string; value: string; el: HTMLTableRowElement; }[];
            let selectSearchCount = 0;
            let isSearch = false;
            let Aa = false;
            // 搜索栏
            const searchInput = new SearchComponent(searchEl);
            searchInput.onChange((value) => {
                // 获取 匹配项
                matchingItems = Aa ? this.translationDict.filter(item => item.key.includes(value) || item.value.includes(value)) : this.translationDict.filter(item => item.key.toLowerCase().includes(value.toLowerCase()) || item.value.toLowerCase().includes(value.toLowerCase()));
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
            searchInput.inputEl.addClass('i18n-edit__search-input')

            const AaButton = new ButtonComponent(searchEl);
            AaButton.setClass('i18n-button')
            AaButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            AaButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            AaButton.setClass('i18n-button--left')
            AaButton.setIcon('a-large-small');
            AaButton.onClick(() => {
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
            // 搜索 向上
            const searchUpButton = new ButtonComponent(searchEl);
            searchUpButton.setClass('i18n-button')
            searchUpButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            searchUpButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            searchUpButton.setClass('i18n-button--left')
            searchUpButton.setIcon('arrow-up');
            searchUpButton.onClick(() => {
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
            // 搜索 向下
            const searchDownButton = new ButtonComponent(searchEl);
            searchDownButton.setClass('i18n-button')
            searchDownButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            searchDownButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            searchDownButton.setClass('i18n-button--left')
            searchDownButton.setIcon('arrow-down');
            searchDownButton.onClick(() => {
                if (isSearch) {
                    // 1. 变更 搜索选中
                    if (selectSearchCount < matchingItems.length - 1) { selectSearchCount += 1 } else if (selectSearchCount == matchingItems.length - 1) { selectSearchCount = 0; }
                    searchCountButton.setButtonText(`${selectSearchCount + 1}/${matchingItems.length}`);
                    matchingItems[selectSearchCount].el.scrollIntoView({ behavior: 'auto', block: 'center' });
                    matchingItems[selectSearchCount].el.classList.remove('animate');
                    void matchingItems[selectSearchCount].el.offsetWidth;
                    matchingItems[selectSearchCount].el.classList.add('animate');
                }
            });
            // 显示数量
            const searchCountButton = new ButtonComponent(searchEl);
            searchCountButton.setClass('i18n-button')
            searchCountButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            searchCountButton.setClass('i18n-button--left')
            searchCountButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            searchCountButton.setButtonText('0/0');
            // ==============================
            // operateEl
            // ==============================
            const insertItemInput = new SearchComponent(operateEl);
            insertItemInput.inputEl.parentElement?.addClass('i18n-edit__operate-input');
            insertItemInput.onChange((value) => { });
            // 插入 按钮
            const insertItemButton = new ButtonComponent(operateEl);
            insertItemButton.setClass('i18n-button')
            insertItemButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            insertItemButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            insertItemButton.setClass('i18n-button--left')
            insertItemButton.setButtonText(t('EDITOR_INSERT_ITEM_BUTTON_TEXT'));
            insertItemButton.onClick(() => {
                const key = insertItemInput.inputEl.value;
                insertItemInput.inputEl.value = '';
                if (this.translationDict.find(d => d.key === key) === undefined) {
                    const rowEl = tableEl.createEl('tr');
                    rowEl.addClass('i18n-edit__table-row')
                    const dictItem = { key: key, value: key, el: rowEl }
                    this.translationDict.push(dictItem);
                    const keyCellEl = rowEl.createEl('td');
                    keyCellEl.addClass('i18n-edit__table-key');
                    const valueCellEl = rowEl.createEl('td');
                    valueCellEl.addClass('i18n-edit__table-value');
                    valueCellEl.setAttribute('contenteditable', 'true');
                    valueCellEl.addEventListener('input', () => {
                        if (valueCellEl.textContent) dictItem.value = valueCellEl.textContent;
                        const res = this.diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                    });
                    valueCellEl.addEventListener('blur', () => {
                        const res = this.diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                        valueCellEl.innerHTML = res.s2;
                    });
                    const operateEl = rowEl.createEl('td');
                    operateEl.createEl('button', { text: '还原', cls: ['i18n-basic-button', 'i18n-basic-button--warning'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            dictItem.value = dictItem.key;
                            keyCellEl.textContent = dictItem.key;
                            valueCellEl.textContent = dictItem.key;
                            this.i18n.notice.success(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000);
                            // this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                        })
                    });
                    const operateEl1 = rowEl.createEl('td');
                    operateEl1.createEl('button', { text: '删除', cls: ['i18n-basic-button', 'i18n-basic-button--danger'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            rowEl.remove();
                            this.translationDict = this.translationDict.filter(item => item.key !== dictItem.key);
                            this.i18n.notice.success(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000);
                            // this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                        })
                    });
                    const diff = this.diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = diff.s1;
                    valueCellEl.innerHTML = diff.s2;
                    rowEl.scrollIntoView({ behavior: 'auto', block: 'center' });
                    // countButton.setButtonText(`共${Object.keys(this.translationJson.dict).length.toString()}条数据`);
                    this.i18n.notice.success(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000);
                } else {
                    this.i18n.notice.error(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_B'));
                }
            });
            // 删除 按钮
            const deleteButton = new ButtonComponent(operateEl);
            deleteButton.setClass('i18n-button')
            deleteButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            deleteButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            deleteButton.setClass('i18n-button--left')
            deleteButton.setButtonText('删除');
            deleteButton.setTooltip('一键删除所有未翻译项')
            deleteButton.onClick(() => {
                let count = 0;
                this.translationDict.forEach(item => {
                    if (item.key === item.value) {
                        item.el.remove();
                        this.translationDict = this.translationDict.filter(item => item.key !== item.key);
                        count++;
                    }
                })
                if (count > 0) { this.i18n.notice.success(t('EDITOR_PUBLIC_HEAD'), `共删除${count}项未翻译内容`); count = 0 }
            });
            // 插件DOM
            const mainButton = new ButtonComponent(operateEl);
            mainButton.setClass('i18n-button')
            mainButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            mainButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            mainButton.setButtonText('插件').setTooltip('打开main.js文件')
            mainButton.setClass('i18n-button--left')
            mainButton.onClick(async () => {
                if (navigator.userAgent.match(/Win/i)) {
                    const command = `start "" "${path.join(this.translationDoc.split('\\').slice(0, -2).join('\\'), 'main.js')}"`
                    console.log(command)
                    exec(command, (error) => {
                        if (error) {
                            this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), false, error);
                        } else {
                            this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), true, '', 1000);
                        }
                    });
                }
                if (navigator.userAgent.match(/Mac/i)) {
                    const command = `open ${path.join(this.translationDoc.split('\\').slice(0, -2).join('\\'), 'main.js')}`
                    exec(command, (error) => {
                        if (error) {
                            this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), false, error);
                        } else {
                            this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), true, '', 1000);
                        }
                    });
                }

            });
            // 译文DOM
            const langButton = new ButtonComponent(operateEl);
            langButton.setClass('i18n-button')
            langButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            langButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            langButton.setClass('i18n-button--left')
            langButton.setButtonText('译文').setTooltip('打开译文文件');
            langButton.onClick(async () => {
                if (navigator.userAgent.match(/Win/i)) {
                    const command = `start "" "${this.translationDoc}"`
                    exec(command, (error) => {
                        if (error) {
                            this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), false, error);
                        } else {
                            this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), true, '', 1000);
                        }
                    });
                }
                if (navigator.userAgent.match(/Mac/i)) {
                    const command = `open ${this.translationDoc}`
                    exec(command, (error) => {
                        if (error) {
                            this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), false, error);
                        } else {
                            this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), true, '', 1000);
                        }
                    });
                }

            });

            // 保存DOM
            const saveTranslationButton = new ButtonComponent(operateEl);
            saveTranslationButton.setClass('i18n-button')
            saveTranslationButton.setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`)
            saveTranslationButton.setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            saveTranslationButton.setClass('i18n-button--left')
            saveTranslationButton.setButtonText(t('EDITOR_SAVE_TRANSLATION_BUTTON_TEXT'));
            saveTranslationButton.onClick(async () => {
                try {
                    this.translationJson.manifest.translationVersion = Date.now();
                    const dict: { [key: string]: string } = {};
                    this.translationDict.forEach(item => { dict[item.key] = item.value; })
                    this.translationJson.dict = dict;
                    fs.writeJsonSync(this.translationDoc, this.translationJson, { spaces: 4 });
                    this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), true, '', 1000);
                } catch (error) {
                    this.i18n.notice.result(t('EDITOR_PUBLIC_HEAD'), false, error);
                }
            });
        }
    }

    async onunload() {
        this.i18n.notice.reload();
        this.translationDoc = ''
    }

    diff(s1: string, s2: string) {
        const differences = diffWords(s1, s2);
        let keyHighlightedHTML = "";
        let valueHighlightedHTML = "";
        differences.forEach((part: { added: unknown; removed: unknown; value: unknown; }) => {
            if (part.added) { valueHighlightedHTML += `<span class='color__text--success'>${part.value}</span>` }
            else if (part.removed) { keyHighlightedHTML += `<span class='color__text--danger'>${part.value}</span>` }
            else { keyHighlightedHTML += part.value; valueHighlightedHTML += part.value; }
        });
        return { s1: keyHighlightedHTML, s2: valueHighlightedHTML };
    }

    async onOpen() {
    }

    async onClose() {
        this.contentEl.empty();
        this.i18n.detachEditView();
    }

    focus(): void {
        this.focus();
        this.onClose();
    }

    // 用于返回当前视图的唯一标识。
    getViewType(): string {
        return EDIT_VIEW_TYPE;
    }
    // 用于返回一个更加人性化的视图名称
    getDisplayText(): string {
        return t('EDITOR_PUBLIC_HEAD');
    }
    // 用于返回一个更加人性化的视图图标
    getIcon(): string {
        return 'i18n_translate';
    }
}



