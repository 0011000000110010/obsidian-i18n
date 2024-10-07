import * as fs from 'fs-extra';
import { ButtonComponent, ItemView, Notice, SearchComponent, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Translation } from 'src/data/types';
import { NoticeError, NoticeOperationResult, NoticeSuccess } from 'src/utils';
import { t } from 'src/lang/inxdex';
import { exec } from 'child_process';
import * as path from 'path';

// @ts-ignore
import { diffWords } from 'diff';

export const EDIT_VIEW_TYPE = 'i18n-edit-view'

export class EditView extends ItemView {
    private i18n: I18N;
    private notices: Notice[] = [];

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.contentEl.style.setProperty('--i18n-color-primary', this.i18n.settings.I18N_COLOR);
    }

    onload(): void {
        let selectRowEl: HTMLTableRowElement | null = null;
        let selectItem: string | undefined;
        let translationJson: Translation | undefined;
        let count = 0;
        let translationDict: { key: string, value: string, el: HTMLTableRowElement }[] = [];
        // 获取内容
        if (this.i18n.selectTranslation != '') translationJson = fs.readJsonSync(this.i18n.selectTranslation);

        // 编辑器DOM
        const editEl = this.contentEl;
        editEl.addClass('i18n-edit__container');
        // manifestDOM
        const manifestEl = editEl.createEl('div');
        manifestEl.addClass('i18n-edit__manifest');
        // 译文作者标签
        const authorLabelEl = manifestEl.createEl('span');
        authorLabelEl.textContent = t('EDITOR_TITLE_AUTHOR');
        authorLabelEl.addClass('i18n-edit__label-wrap');
        // 译文作者DOM
        const authorEl = manifestEl.createEl('input');
        authorEl.addClass('i18n-edit__author-input');
        // 译文版本标签
        const translationVersionLabelEl = manifestEl.createEl('span');
        translationVersionLabelEl.textContent = t('EDITOR_TITLE_TRANSLATION_VERSION');
        translationVersionLabelEl.addClass('i18n-edit__label-wrap');
        // 译文版本DOM
        const translationVersionEl = manifestEl.createEl('input');
        translationVersionEl.addClass('i18n-edit__translation-version-input');
        // 插件版本标签
        const pluginVersionLabelEl = manifestEl.createEl('span');
        pluginVersionLabelEl.textContent = t('EDITOR_TITLE_PLUGIN_VERSION');
        pluginVersionLabelEl.addClass('i18n-edit__label-wrap');
        // 插件版本DOM
        const pluginVersionEl = manifestEl.createEl('input');
        pluginVersionEl.addClass('i18n-edit__plugin-version-input');
        // descriptionDOM
        const descriptionEl = editEl.createEl('div');
        descriptionEl.addClass('i18n-edit__description');
        // 描述标签
        const descriptionLabelEl = descriptionEl.createEl('span');
        descriptionLabelEl.textContent = t('EDITOR_TITLE_DESCRIPTION');
        descriptionLabelEl.addClass('i18n-edit__label-wrap');
        // 描述DOM
        const descriptionInputEl = descriptionEl.createEl('input');
        descriptionInputEl.addClass('i18n-edit__description-input');
        // 描述翻译DOM
        if (this.i18n.settings.I18N_MODE_NIT && this.i18n.settings.I18N_NIT_API == 'BAIDU' && translationJson != undefined) {
            const translationDescriptionButton = new ButtonComponent(descriptionEl);
            translationDescriptionButton.setClass('i18n-button');
            translationDescriptionButton.setClass('i18n-button--primary');
            translationDescriptionButton.setClass('i18n-edit__save-button');
            translationDescriptionButton.setButtonText('百度');
            translationDescriptionButton.onClick(async () => {
                try {
                    const response = await this.i18n.api.baidu(descriptionInputEl.value);
                    if ('trans_result' in response.json) descriptionInputEl.value = response.json['trans_result'][0]['dst'];
                    translationJson.description.translation = response.json['trans_result'][0]['dst'];
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
        // 修改DOM
        const modifyEl = editEl.createEl('div');
        modifyEl.addClass('i18n-edit__modify');
        const footInputEl = modifyEl.createEl('textarea');
        footInputEl.addClass('i18n-edit__modify-input');

        if (translationJson != undefined) {
            // 初始化字典条目数量
            count = Object.keys(translationJson.dict).length;
            // ==============================
            // headeEl
            // ==============================
            authorEl.value = translationJson.manifest.author;
            authorEl.addEventListener('input', () => { translationJson.manifest.author = authorEl.value });
            translationVersionEl.value = translationJson.manifest.version;
            translationVersionEl.addEventListener('input', () => { translationJson.manifest.version = translationVersionEl.value });
            pluginVersionEl.value = translationJson.manifest.pluginVersion;
            pluginVersionEl.addEventListener('input', () => { translationJson.manifest.pluginVersion = pluginVersionEl.value });
            descriptionInputEl.value = translationJson.description.translation;
            descriptionInputEl.addEventListener('input', () => { translationJson.description.translation = descriptionInputEl.value });
            // 保存DOM
            const saveTranslationButton = new ButtonComponent(manifestEl);
            saveTranslationButton.setButtonText(t('EDITOR_SAVE_TRANSLATION_BUTTON_TEXT'));
            saveTranslationButton.setClass('i18n-button');
            saveTranslationButton.setClass('i18n-button--success');
            saveTranslationButton.setClass('i18n-edit__save-button');
            saveTranslationButton.onClick(async () => {
                try {
                    fs.writeJsonSync(this.i18n.selectTranslation, translationJson, { spaces: 4 });
                    // 关闭窗口
                    // this.i18n.detachEditView();
                    this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true, '', 1000));
                } catch (error) {
                    this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error));
                }
            });

            // ==============================
            // dictEl
            // ==============================
            const tableEl = dictEl.createEl('table');
            tableEl.addClass('i18n-edit__table');
            for (const key in translationJson.dict) {
                if (translationJson.dict.hasOwnProperty(key)) {
                    // row DOM
                    const rowEl = tableEl.createEl('tr');
                    rowEl.addClass('i18n-edit__table-row')
                    rowEl.onclick = (e) => {
                        if (selectRowEl != undefined && selectRowEl != rowEl) {
                            selectRowEl.removeClass('i18n-edit__selected');
                            selectRowEl = rowEl;
                            selectItem = key;
                            selectRowEl.addClass('i18n-edit__selected');
                            footInputEl.value = translationJson.dict[selectItem];
                        } else if (selectRowEl != undefined && selectRowEl == rowEl) {
                            selectRowEl.removeClass('i18n-edit__selected');
                            selectRowEl = null;
                            selectItem = undefined;
                            footInputEl.value = '';
                        } else {
                            selectRowEl = rowEl;
                            selectItem = key;
                            selectRowEl.addClass('i18n-edit__selected');
                            footInputEl.value = translationJson.dict[selectItem];
                        }
                    };
                    // key DOM
                    const keyCellEl = rowEl.createEl('td');
                    keyCellEl.addClass('i18n-edit__table-key');
                    // value DOM
                    const valueCellEl = rowEl.createEl('td');
                    valueCellEl.addClass('i18n-edit__table-value');
                    translationDict.push({ key: key, value: translationJson.dict[key], el: rowEl });
                    const differences = diffWords(key, translationJson.dict[key]);
                    let keyHighlightedHTML = "";
                    let valueHighlightedHTML = "";
                    differences.forEach((part: { added: any; removed: any; value: any; }) => {
                        if (part.added) { valueHighlightedHTML += `<span class='color__text--green'>${part.value}</span>` }
                        else if (part.removed) { keyHighlightedHTML += `<span class='color__text--red'>${part.value}</span>` }
                        else { keyHighlightedHTML += part.value; valueHighlightedHTML += part.value; }
                    });
                    keyCellEl.innerHTML = keyHighlightedHTML;
                    valueCellEl.innerHTML = valueHighlightedHTML;
                }
            }

            // ==============================
            // searchEl
            // ==============================
            let matchingItems: { key: string; value: string; el: HTMLTableRowElement; }[];
            let searchValue = '';
            let selectSearchCount = 0;
            let isSearch = false;
            // 搜索栏
            const searchInput = new SearchComponent(searchEl);
            searchInput.setValue(searchValue);
            searchInput.onChange((value) => {
                searchValue = value;
                // 获取 匹配项
                matchingItems = translationDict.filter(item => item.key.includes(searchValue) || item.value.includes(searchValue));
                if (matchingItems.length > 0 && value !== '') {
                    // 变更 搜索选中
                    selectSearchCount = 0;
                    // 清除 选中对象
                    if (selectRowEl != undefined) selectRowEl.removeClass('i18n-edit__selected');
                    // 变更 选中对象
                    selectRowEl = matchingItems[selectSearchCount].el;
                    // 变更 选中对象
                    selectItem = matchingItems[selectSearchCount].key;
                    // 变更 选中对象
                    selectRowEl.addClass('i18n-edit__selected');
                    // 跳转 选中对象
                    matchingItems[0].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 变更 输入框数据
                    footInputEl.value = translationJson.dict[selectItem];
                    // 变更 显示数量
                    cs3.setButtonText(`${selectSearchCount + 1}/${matchingItems.length}`);
                    isSearch = true;
                } else {
                    isSearch = false;
                    cs3.setButtonText(`0/0`);
                }
            });
            // @ts-ignore
            searchInput.setClass('i18n-edit__search-box');
            searchInput.inputEl.addClass('i18n-edit__search-input')

            // 显示数量
            const cs3 = new ButtonComponent(searchEl);
            cs3.setClass('i18n-button');
            cs3.setClass('i18n-button--primary');
            cs3.setClass('i18n-edit__search-button');
            cs3.setButtonText('0/0');

            // 搜索 向上
            const searchUpButton = new ButtonComponent(searchEl);
            searchUpButton.setClass('i18n-button');
            searchUpButton.setClass('i18n-button--primary');
            searchUpButton.setClass('i18n-edit__search-button');
            searchUpButton.setIcon('arrow-up');
            searchUpButton.onClick(() => {
                if (isSearch) {
                    // 1. 变更 搜索选中
                    if (selectSearchCount > 0) { selectSearchCount -= 1 } else if (selectSearchCount == 0) { selectSearchCount = matchingItems.length - 1; };
                    // 2. 变更 显示数量
                    cs3.setButtonText(`${selectSearchCount + 1}/${matchingItems.length}`);
                    // 3. 清除 选中对象
                    if (selectRowEl != undefined) selectRowEl.removeClass('i18n-edit__selected');
                    // 4. 变更 选中对象
                    selectRowEl = matchingItems[selectSearchCount].el;
                    // 5. 变更 选中对象
                    selectItem = matchingItems[selectSearchCount].key;
                    // 6. 变更 选中对象
                    selectRowEl.addClass('i18n-edit__selected');
                    // 7. 跳转 选中对象
                    // matchingItems[selectSearchCount].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    selectRowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 8. 变更 输入框数据
                    footInputEl.value = translationJson.dict[selectItem];
                    console.log(selectSearchCount);
                }
            });

            // 搜索 向下
            const searchDownButton = new ButtonComponent(searchEl);
            searchDownButton.setClass('i18n-button');
            searchDownButton.setClass('i18n-button--primary');
            searchDownButton.setClass('i18n-edit__search-button');
            searchDownButton.setIcon('arrow-down');
            searchDownButton.onClick(() => {
                if (isSearch) {
                    // 1. 变更 搜索选中
                    if (selectSearchCount < matchingItems.length - 1) { selectSearchCount += 1 } else if (selectSearchCount == matchingItems.length - 1) { selectSearchCount = 0; };
                    // 2. 变更 显示数量
                    cs3.setButtonText(`${selectSearchCount + 1}/${matchingItems.length}`);
                    // 3. 清除 选中对象
                    if (selectRowEl != undefined) selectRowEl.removeClass('i18n-edit__selected');
                    // 4. 变更 选中对象
                    selectRowEl = matchingItems[selectSearchCount].el;
                    // 5. 变更 选中对象
                    selectItem = matchingItems[selectSearchCount].key;
                    // 6. 变更 选中对象
                    selectRowEl.addClass('i18n-edit__selected');
                    // 7. 跳转 选中对象
                    // matchingItems[selectSearchCount].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    selectRowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 8. 变更 输入框数据
                    footInputEl.value = translationJson.dict[selectItem];
                    console.log(selectSearchCount);
                }
            });

            // ==============================
            // operateEl
            // ==============================
            const insertItemButton = new ButtonComponent(operateEl);
            insertItemButton.setClass('i18n-button');
            insertItemButton.setClass('i18n-button--primary');
            insertItemButton.setButtonText(t('EDITOR_INSERT_ITEM_BUTTON_TEXT'));
            insertItemButton.setClass('i18n-edit__operate-button-left');
            insertItemButton.onClick(() => {
                if (selectRowEl == null) {
                    const key = footInputEl.value;
                    // 变更显示数据
                    if (!translationJson.dict.hasOwnProperty(key)) {
                        // 变更 译文数据
                        translationJson.dict[key] = key;
                        // row DOME
                        const rowEl = tableEl.createEl('tr');
                        rowEl.addClass('i18n-edit__table-row');
                        rowEl.onclick = (e) => {
                            if (selectRowEl != undefined) selectRowEl.removeClass('i18n-edit__selected');
                            // 变更 选中对象
                            selectRowEl = rowEl;
                            // 变更 选中对象
                            selectItem = key;
                            // 变更 选中状态
                            selectRowEl.addClass('i18n-edit__selected');
                            // 变更 输入框数据
                            footInputEl.value = translationJson.dict[selectItem];
                        };
                        // key DOM
                        const keyCellEl = rowEl.createEl('td');
                        keyCellEl.addClass('i18n-edit__table-key');
                        keyCellEl.textContent = key
                        // value DOM
                        const valueCellEl = rowEl.createEl('td');
                        valueCellEl.addClass('i18n-edit__table-value');
                        valueCellEl.textContent = translationJson.dict[key];
                        // 变更 字典数据
                        translationDict.push({ key: key, value: translationJson.dict[key], el: rowEl });
                        // 滚动 到选中行
                        rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // 变更 清除数据
                        footInputEl.value = '';
                        // 变更 计数数据
                        countButton.setButtonText(`共${Object.keys(translationJson.dict).length.toString()}条数据`);
                        this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                    } else {
                        this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_B')));
                    }
                } else {
                    this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_C')));
                }
            });

            const deleteItemButton = new ButtonComponent(operateEl);
            deleteItemButton.setClass('i18n-button');
            deleteItemButton.setClass('i18n-button--primary');
            deleteItemButton.setClass('i18n-edit__operate-button-left');
            deleteItemButton.setButtonText(t('EDITOR_DELETE_ITEM_BUTTON_TEXT'));
            deleteItemButton.onClick(() => {
                if (selectRowEl != null && selectItem != undefined) {
                    // 清除 输入框 
                    footInputEl.value = '';
                    // 清除 显示数据
                    selectRowEl.remove();
                    // 清除 译文数据
                    delete (translationJson.dict[selectItem]);
                    // 清除 字典数据
                    translationDict = translationDict.filter(item => item.key !== selectItem);
                    // 清除 选中对象
                    selectRowEl = null;
                    // 清除 选中内容
                    selectItem = undefined;
                    // 变更 计数数据
                    countButton.setButtonText(`共${Object.keys(translationJson.dict).length.toString()}条数据`);
                    this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                } else {
                    this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_B')));
                }
            });

            const restoreItemButton = new ButtonComponent(operateEl);
            restoreItemButton.setClass('i18n-button');
            restoreItemButton.setClass('i18n-button--primary');
            restoreItemButton.setClass('i18n-edit__operate-button-left');
            restoreItemButton.setButtonText(t('EDITOR_RESTORE_ITEM_BUTTON_TEXT'));
            restoreItemButton.onClick(() => {
                if (selectRowEl != undefined && selectItem != undefined) {
                    // 还原 显示数据
                    selectRowEl.children[0].textContent = selectItem;
                    selectRowEl.children[1].textContent = selectItem;
                    // 还原 译文数据
                    translationJson.dict[selectItem] = selectItem;
                    // 还原 字典数据
                    const itemToUpdate = translationDict.find(item => item.key === selectItem);
                    if (itemToUpdate) itemToUpdate.value = selectItem;
                    // 还原 输入框数据
                    footInputEl.value = selectItem;
                    this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                } else {
                    this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_B')));
                }
            });

            const cancelItemButton = new ButtonComponent(operateEl);
            cancelItemButton.setClass('i18n-button');
            cancelItemButton.setClass('i18n-button--primary');
            cancelItemButton.setClass('i18n-edit__operate-button-left');
            cancelItemButton.setButtonText(t('EDITOR_CANCEL_ITEM_BUTTON_TEXT'));
            cancelItemButton.onClick(() => {
                if (selectRowEl != undefined && selectItem != undefined) selectRowEl.removeClass('i18n-edit__selected');
                selectRowEl = null;
                selectItem = undefined;
                footInputEl.value = '';
                this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_CANCEL_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
            });

            const baiduButton = new ButtonComponent(operateEl);
            baiduButton.setClass('i18n-button');
            baiduButton.setClass('i18n-button--primary');
            baiduButton.setClass('i18n-edit__operate-button-left');
            baiduButton.setButtonText('百度');
            if (!(this.i18n.settings.I18N_MODE_NIT && this.i18n.settings.I18N_NIT_API == 'BAIDU')) baiduButton.setClass('i18n--hidden');
            baiduButton.onClick(async () => {
                try {
                    const regex = /(['"`])(.*)(\1)/;
                    const itemValue = footInputEl.value;
                    const tString = itemValue.match(regex);
                    let temp = itemValue;
                    if (tString != null) {
                        const response = await this.i18n.api.baidu(tString[2]);
                        if ('trans_result' in response.json) temp = itemValue.replace(tString[2], response.json['trans_result'][0]['dst']);
                    }
                    if (selectRowEl != null && selectItem != undefined) {
                        const differences = diffWords(selectItem, temp);
                        let keyHighlightedHTML = "";
                        let valueHighlightedHTML = "";
                        differences.forEach((part: { added: any; removed: any; value: any; }) => {
                            if (part.added) { valueHighlightedHTML += `<span class='color__text--green'>${part.value}</span>` }
                            else if (part.removed) { keyHighlightedHTML += `<span class='color__text--red'>${part.value}</span>` }
                            else { keyHighlightedHTML += part.value; valueHighlightedHTML += part.value; }
                        });
                        footInputEl.value = temp;
                        selectRowEl.children[0].innerHTML = keyHighlightedHTML;
                        selectRowEl.children[1].innerHTML = valueHighlightedHTML;
                        translationJson.dict[selectItem] = temp;
                    }
                } catch (error) {
                    console.log(error);
                }
            });

            const mainButton = new ButtonComponent(operateEl);
            mainButton.setClass('i18n-button');
            mainButton.setClass('i18n-button--primary');
            mainButton.setClass('i18n-edit__operate-button-right');
            mainButton.setButtonText('插件');
            mainButton.setTooltip('打开main.js文件');
            mainButton.onClick(async () => {
                if (navigator.userAgent.match(/Win/i)) {
                    const command = `start "" "${path.join(this.i18n.selectTranslation.split('\\').slice(0, -2).join('\\'), 'main.js')}"`
                    exec(command, (error) => {
                        if (error) {
                            this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error));
                        } else {
                            this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true, '', 1000));
                        }
                    });
                }
                if (navigator.userAgent.match(/Mac/i)) {
                    const command = `open ${path.join(this.i18n.selectTranslation.split('\\').slice(0, -2).join('\\'), 'main.js')}`
                    exec(command, (error) => {
                        if (error) {
                            this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error));
                        } else {
                            this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true, '', 1000));
                        }
                    });
                }

            });

            const langButton = new ButtonComponent(operateEl);
            langButton.setClass('i18n-button');
            langButton.setClass('i18n-button--primary');
            langButton.setClass('i18n-edit__operate-button-right');
            langButton.setButtonText('译文');
            langButton.setTooltip('打开译文文件');
            langButton.onClick(async () => {
                if (navigator.userAgent.match(/Win/i)) {
                    const command = `start "" "${this.i18n.selectTranslation}"`
                    exec(command, (error) => {
                        if (error) {
                            this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error));
                        } else {
                            this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true, '', 1000));
                        }
                    });
                }
                if (navigator.userAgent.match(/Mac/i)) {
                    const command = `open ${this.i18n.selectTranslation}`
                    exec(command, (error) => {
                        if (error) {
                            this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error));
                        } else {
                            this.notices.push(NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true, '', 1000));
                        }
                    });
                }

            });

            const countButton = new ButtonComponent(operateEl);
            countButton.setClass('i18n-button');
            countButton.setClass('i18n-button--primary');
            countButton.setClass('i18n-edit__operate-button-right');
            countButton.setDisabled(true);
            countButton.setButtonText(`共${count.toString()}条数据`);
            countButton.setTooltip('当前译文数量');

            // ==============================
            // modifyEl
            // ==============================
            footInputEl.addEventListener('input', function () {
                if (selectRowEl != undefined && selectItem != undefined) {
                    const differences = diffWords(selectItem, footInputEl.value);
                    let keyHighlightedHTML = "";
                    let valueHighlightedHTML = "";
                    differences.forEach((part: { added: any; removed: any; value: any; }) => {
                        if (part.added) {
                            valueHighlightedHTML += `<span class='color__text--green'>${part.value}</span>`;
                        } else if (part.removed) {
                            keyHighlightedHTML += `<span class='color__text--red'>${part.value}</span>`;
                        } else { keyHighlightedHTML += part.value; valueHighlightedHTML += part.value; }
                    });
                    // 变更显示数据
                    selectRowEl.children[0].innerHTML = keyHighlightedHTML;
                    selectRowEl.children[1].innerHTML = valueHighlightedHTML;
                    // 变更 译文数据
                    translationJson.dict[selectItem] = footInputEl.value;
                    // 变更 字典数据
                    translationDict.filter(item => item.key === selectItem)[0].value = footInputEl.value;
                }
            });
        }
    }

    async onunload() {

        for (const notice of this.notices) { notice.noticeEl.remove(); }
        this.i18n.selectTranslation = ''
    }


    async onOpen() {
    }

    async onClose() {

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



