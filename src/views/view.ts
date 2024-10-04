import * as fs from 'fs-extra';
import { ButtonComponent, ItemView, Notice, WorkspaceLeaf } from "obsidian";
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
        this.i18n = i18n
    }

    onload(): void {

        const editEl = this.contentEl;
        let selectRowEl: HTMLTableRowElement | null = null;
        let selectItem: string | undefined;
        let translationJson: Translation | undefined;
        let count = 0;

        if (this.i18n.selectTranslation != '') translationJson = fs.readJsonSync(this.i18n.selectTranslation);
        if (translationJson != undefined) count = Object.keys(translationJson.dict).length;

        editEl.addClass('i18n-edit__container');

        const manifestEl = editEl.createEl('div');
        manifestEl.addClass('i18n-edit__manifest');

        const authorLabelEl = manifestEl.createEl('span');
        authorLabelEl.textContent = t('EDITOR_TITLE_AUTHOR');
        authorLabelEl.addClass('i18n-edit__label-wrap');

        const authorEl = manifestEl.createEl('input');
        authorEl.addClass('i18n-edit__author-input');

        const translationVersionLabelEl = manifestEl.createEl('span');
        translationVersionLabelEl.textContent = t('EDITOR_TITLE_TRANSLATION_VERSION');
        translationVersionLabelEl.addClass('i18n-edit__label-wrap');

        const translationVersionEl = manifestEl.createEl('input');
        translationVersionEl.addClass('i18n-edit__translation-version-input');

        const pluginVersionLabelEl = manifestEl.createEl('span');
        pluginVersionLabelEl.textContent = t('EDITOR_TITLE_PLUGIN_VERSION');
        pluginVersionLabelEl.addClass('i18n-edit__label-wrap');

        const pluginVersionEl = manifestEl.createEl('input');
        pluginVersionEl.addClass('i18n-edit__plugin-version-input');

        const descriptionEl = editEl.createEl('div');
        descriptionEl.addClass('i18n-edit__description');

        const descriptionLabelEl = descriptionEl.createEl('span');
        descriptionLabelEl.textContent = t('EDITOR_TITLE_DESCRIPTION');
        descriptionLabelEl.addClass('i18n-edit__label-wrap');

        const descriptionInputEl = descriptionEl.createEl('input');
        descriptionInputEl.addClass('i18n-edit__description-input');
        if (this.i18n.settings.I18N_MODE_NIT && this.i18n.settings.I18N_NIT_API == 'BAIDU' && translationJson != undefined) {
            const translationDescriptionButton = new ButtonComponent(descriptionEl);
            translationDescriptionButton.setButtonText('百度');
            translationDescriptionButton.setClass('i18n-edit__save-button');
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
        const dictEl = editEl.createEl('div');
        dictEl.addClass('i18n-edit__dict');

        const operateEl = editEl.createEl('div');
        operateEl.addClass('i18n-edit__operate');

        const footEl = editEl.createEl('div');
        footEl.addClass('i18n-edit__modify');
        const footInputEl = footEl.createEl('textarea');
        footInputEl.addClass('i18n-edit__modify-input');



        if (translationJson != undefined) {
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
            const saveTranslationButton = new ButtonComponent(manifestEl);
            saveTranslationButton.setButtonText(t('EDITOR_SAVE_TRANSLATION_BUTTON_TEXT'));
            // saveTranslationButton.setClass('i18n-button');
            // saveTranslationButton.setClass('i18n-button--primary');
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
                    // 为每个键值对创建一个新的<tr>（表格行）  
                    const rowEl = tableEl.createEl('tr');
                    rowEl.addClass('i18n-edit__table-row')
                    rowEl.onclick = (e) => {
                        if (selectRowEl != undefined) selectRowEl.removeClass('i18n-edit__selected');
                        selectRowEl = rowEl;
                        selectItem = key;
                        selectRowEl.addClass('i18n-edit__selected');
                        footInputEl.value = translationJson.dict[selectItem];
                    };
                    // 创建一个<td>（表格单元格）用于键  
                    const keyCellEl = rowEl.createEl('td');
                    keyCellEl.addClass('i18n-edit__table-key');

                    // 创建一个<td>（表格单元格）用于值  
                    const valueCellEl = rowEl.createEl('td');
                    valueCellEl.addClass('i18n-edit__table-value');

                    const differences = diffWords(key, translationJson.dict[key]);
                    let keyHighlightedHTML = "";
                    let valueHighlightedHTML = "";
                    differences.forEach((part: { added: any; removed: any; value: any; }) => {
                        if (part.added) { valueHighlightedHTML += `<span class='i18n_color_green'>${part.value}</span>` }
                        else if (part.removed) { keyHighlightedHTML += `<span class='i18n_color_red'>${part.value}</span>` }
                        else { keyHighlightedHTML += part.value; valueHighlightedHTML += part.value; }
                    });
                    keyCellEl.innerHTML = keyHighlightedHTML;
                    valueCellEl.innerHTML = valueHighlightedHTML;
                }
            }

            // ==============================
            // operateEl
            // ==============================
            const insertItemButton = new ButtonComponent(operateEl);
            insertItemButton.setButtonText(t('EDITOR_INSERT_ITEM_BUTTON_TEXT'));
            insertItemButton.setClass('i18n-edit__operate-button-left');
            insertItemButton.onClick(() => {
                if (selectRowEl == null) {
                    const tempKey = footInputEl.value;
                    // 变更显示数据
                    if (!translationJson.dict.hasOwnProperty(tempKey)) {
                        // 变更字典数据
                        translationJson.dict[tempKey] = tempKey;
                        // 为每个键值对创建一个新的<tr>（表格行）  
                        const rowEl = tableEl.createEl('tr');
                        rowEl.addClass('i18n-edit__table-row')
                        rowEl.onclick = (e) => {
                            if (selectRowEl != undefined) selectRowEl.removeClass('i18n-edit__selected');
                            // 变更 选中对象
                            selectRowEl = rowEl;
                            // 变更 选中对象
                            selectItem = tempKey;
                            selectRowEl.addClass('i18n-edit__selected');
                            // 变更 输入框数据
                            footInputEl.value = translationJson.dict[selectItem];
                        };
                        // 创建一个<td>（表格单元格）用于键  
                        const keyCellEl = rowEl.createEl('td');
                        keyCellEl.addClass('i18n-edit__table-key');
                        keyCellEl.textContent = tempKey;

                        // 创建一个<td>（表格单元格）用于值  
                        const valueCellEl = rowEl.createEl('td');
                        valueCellEl.addClass('i18n-edit__table-value');
                        valueCellEl.textContent = translationJson.dict[tempKey];
                        // 清除数据
                        footInputEl.value = '';
                        this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                        // 滚动到选中行
                        rowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        count = Object.keys(translationJson.dict).length;
                        countButton.setButtonText(count.toString());
                    } else {
                        this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_B')));
                    }
                } else {
                    this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_C')));
                }
            });

            const deleteItemButton = new ButtonComponent(operateEl);
            deleteItemButton.setButtonText(t('EDITOR_DELETE_ITEM_BUTTON_TEXT'));
            deleteItemButton.setClass('i18n-edit__operate-button-left');
            deleteItemButton.onClick(() => {
                if (selectRowEl != null && selectItem != undefined) {
                    // 清除 输入框 
                    footInputEl.value = '';
                    // 清除 显示数据
                    selectRowEl.remove();
                    // 清除 列表数据
                    delete (translationJson.dict[selectItem]);
                    // 清除 选中对象
                    selectRowEl = null;
                    // 清除 选中内容
                    selectItem = undefined;
                    count = Object.keys(translationJson.dict).length;
                    countButton.setButtonText(count.toString());
                    this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                } else {
                    this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_B')));
                }
            });

            const restoreItemButton = new ButtonComponent(operateEl);
            restoreItemButton.setButtonText(t('EDITOR_RESTORE_ITEM_BUTTON_TEXT'));
            restoreItemButton.setClass('i18n-edit__operate-button-left');
            restoreItemButton.onClick(() => {
                if (selectRowEl != undefined && selectItem != undefined) {
                    // 还原 显示数据
                    selectRowEl.children[0].textContent = selectItem;
                    selectRowEl.children[1].textContent = selectItem;
                    // 还原 字典数据
                    translationJson.dict[selectItem] = selectItem;
                    // 还原 输入框数据
                    footInputEl.value = selectItem;
                    this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                } else {
                    this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_B')));
                }
            });

            const cancelItemButton = new ButtonComponent(operateEl);
            cancelItemButton.setButtonText(t('EDITOR_CANCEL_ITEM_BUTTON_TEXT'));
            cancelItemButton.setClass('i18n-edit__operate-button-left');
            cancelItemButton.onClick(() => {
                if (selectRowEl != undefined && selectItem != undefined) selectRowEl.removeClass('i18n-edit__selected');
                selectRowEl = null;
                selectItem = undefined;
                footInputEl.value = '';
                this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_CANCEL_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
            });

            const baiduButton = new ButtonComponent(operateEl);
            baiduButton.setButtonText('百度');
            baiduButton.setClass('i18n-edit__operate-button-left');
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
                            if (part.added) { valueHighlightedHTML += `<span class='i18n_color_green'>${part.value}</span>` }
                            else if (part.removed) { keyHighlightedHTML += `<span class='i18n_color_red'>${part.value}</span>` }
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
            mainButton.setButtonText('插件');
            mainButton.setTooltip('打开main.js文件');
            mainButton.setClass('i18n-edit__operate-button-right');
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
            langButton.setButtonText('译文');
            langButton.setTooltip('打开译文文件');
            langButton.setClass('i18n-edit__operate-button-right');
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
            countButton.setButtonText(count.toString());
            countButton.setTooltip('当前译文数量');
            countButton.setClass('i18n-edit__operate-button-right');

            // const cs = new ButtonComponent(operateEl);
            // cs.setButtonText('测试');
            // cs.setClass('i18n-edit__operate-button-right');
            // cs.onClick(() => {
            //     const keysWithText = Object.keys(translationJson.dict).filter(key => key.includes("set"));
            //     const valuesWithText = Object.values(translationJson.dict).filter(value => value.includes("set"));
            //     console.log(keysWithText);
            //     console.log(valuesWithText);
            // });

            const helpButton = new ButtonComponent(operateEl);
            helpButton.setButtonText(t('EDITOR_HELP_BUTTON_TEXT'));
            helpButton.setWarning();
            helpButton.setClass('i18n-edit__operate-button-left');
            helpButton.onClick(() => {
                this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_HELP_BUTTON_NOTICE_CONTENT_A')));
            });

            // ==============================
            // footEl
            // ==============================
            footInputEl.addEventListener('input', function () {
                if (selectRowEl != undefined && selectItem != undefined) {
                    // const highlighted = highlightedHTML(selectRowEl.children[0].textContent as string, footInputEl.value);
                    const differences = diffWords(selectItem, footInputEl.value);
                    let keyHighlightedHTML = "";
                    let valueHighlightedHTML = "";
                    differences.forEach((part: { added: any; removed: any; value: any; }) => {
                        if (part.added) {
                            valueHighlightedHTML += `<span class='i18n_color_green'>${part.value}</span>`;
                        } else if (part.removed) {
                            keyHighlightedHTML += `<span class='i18n_color_red'>${part.value}</span>`;
                        } else {
                            keyHighlightedHTML += part.value;
                            valueHighlightedHTML += part.value;
                        }
                    });
                    // 变更显示数据
                    selectRowEl.children[0].innerHTML = keyHighlightedHTML;
                    selectRowEl.children[1].innerHTML = valueHighlightedHTML;
                    // 变更字典数据
                    translationJson.dict[selectItem] = footInputEl.value;
                }
            });
        }
    }

    async onunload() {
        for (const notice of this.notices) { notice.noticeEl.remove(); }
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



