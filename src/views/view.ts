import * as fs from 'fs-extra';
import { ButtonComponent, ItemView, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Translation } from 'src/data/types';
import { NoticeError, NoticeOperationResult, NoticeSuccess } from 'src/utils';
import { t } from 'src/lang/inxdex';
import { exec } from 'child_process';
import * as path from 'path';

export const EDIT_VIEW_TYPE = 'i18n-edit-view'

export class EditView extends ItemView {
    private frame: HTMLIFrameElement;
    private i18n: I18N;

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n
    }

    onload(): void {
        // 外边框 
        const editEl = this.contentEl;
        editEl.addClass('i18n_edit');

        const headeEl = editEl.createEl('div');
        headeEl.addClass('i18n_edit_head');

        const headeOneEl = headeEl.createEl('div');
        headeOneEl.addClass('i18n_edit_head_one');

        const tipHeadeAuthorEl = headeOneEl.createEl('span');
        tipHeadeAuthorEl.textContent = t('EDITOR_TITLE_AUTHOR');
        tipHeadeAuthorEl.addClass('i18n_edit_head_tip');

        const headeAuthorEl = headeOneEl.createEl('input');
        // headeAuthorEl.placeholder = '请输入作者'
        headeAuthorEl.addClass('i18n_edit_head_author');

        const tipTranslationVersionEl = headeOneEl.createEl('span');
        tipTranslationVersionEl.textContent = t('EDITOR_TITLE_TRANSLATION_VERSION');
        tipTranslationVersionEl.addClass('i18n_edit_head_tip');

        const headeTranslationVersionEl = headeOneEl.createEl('input');
        headeTranslationVersionEl.addClass('i18n_edit_head_translation_version');

        const tipPluginVersionEl = headeOneEl.createEl('span');
        tipPluginVersionEl.textContent = t('EDITOR_TITLE_PLUGIN_VERSION');
        tipPluginVersionEl.addClass('i18n_edit_head_tip');

        const headePluginVersionEl = headeOneEl.createEl('input');
        headePluginVersionEl.addClass('i18n_edit_head_plugin_version');

        const headeTwoEl = headeEl.createEl('div');
        headeTwoEl.addClass('i18n_edit_head_two');

        const tipHeadeDescriptionEl = headeTwoEl.createEl('span');
        tipHeadeDescriptionEl.textContent = t('EDITOR_TITLE_DESCRIPTION');
        tipHeadeDescriptionEl.addClass('i18n_edit_head_tip');

        const headeDescriptionEl = headeTwoEl.createEl('input');
        headeDescriptionEl.addClass('i18n_edit_head_description');

        const dataEl = editEl.createEl('div');
        dataEl.addClass('i18n_edit_data');

        const operateEl = editEl.createEl('div');
        operateEl.addClass('i18n_edit_operate');

        const footEl = editEl.createEl('div');
        footEl.addClass('i18n_edit_foot');
        const footInputEl = footEl.createEl('textarea');
        footInputEl.addClass('i18n_edit_foot_input');
        let selectRowEl: HTMLTableRowElement | null = null;

        let translationJson: Translation | undefined;
        if (this.i18n.selectTranslation != '') translationJson = fs.readJsonSync(this.i18n.selectTranslation);

        if (translationJson != undefined) {
            // ==============================
            // headeEl
            // ==============================
            headeAuthorEl.value = translationJson.manifest.author;
            headeAuthorEl.addEventListener('input', () => { translationJson.manifest.author = headeAuthorEl.value });
            headeTranslationVersionEl.value = translationJson.manifest.version;
            headeTranslationVersionEl.addEventListener('input', () => { translationJson.manifest.version = headeTranslationVersionEl.value });
            headePluginVersionEl.value = translationJson.manifest.pluginVersion;
            headePluginVersionEl.addEventListener('input', () => { translationJson.manifest.pluginVersion = headePluginVersionEl.value });
            headeDescriptionEl.value = translationJson.description.translation;
            headeDescriptionEl.addEventListener('input', () => { translationJson.description.translation = headeDescriptionEl.value });
            const saveTranslationButton = new ButtonComponent(headeOneEl);
            saveTranslationButton.setButtonText(t('EDITOR_SAVE_TRANSLATION_BUTTON_TEXT'));
            saveTranslationButton.setCta();
            saveTranslationButton.setClass('i18n_edit_head_save');
            saveTranslationButton.onClick(() => {
                try {
                    fs.writeJsonSync(this.i18n.selectTranslation, translationJson, { spaces: 4 });
                    this.i18n.detachEditView();
                    NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true);
                } catch (error) {
                    NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error);
                }
            });

            // ==============================
            // dataEl
            // ==============================
            const tableEl = dataEl.createEl('table');
            tableEl.addClass('i18n_edit_data_table');
            for (const key in translationJson.dict) {
                if (translationJson.dict.hasOwnProperty(key)) {
                    // 为每个键值对创建一个新的<tr>（表格行）  
                    const rowEl = tableEl.createEl('tr');
                    rowEl.addClass('i18n_edit_data_table_row')
                    rowEl.onclick = (e) => {
                        if (selectRowEl != undefined) selectRowEl.removeClass('selected');
                        selectRowEl = rowEl;
                        selectRowEl.addClass('selected');
                        footInputEl.value = translationJson.dict[selectRowEl.children[0].textContent as string];
                    };
                    // 创建一个<td>（表格单元格）用于键  
                    const keyCellEl = rowEl.createEl('td');
                    keyCellEl.addClass('i18n_edit_data_table_key');
                    keyCellEl.textContent = key;

                    // 创建一个<td>（表格单元格）用于值  
                    const valueCellEl = rowEl.createEl('td');
                    valueCellEl.addClass('i18n_edit_data_table_value');
                    valueCellEl.textContent = translationJson.dict[key];
                }
            }

            // ==============================
            // operateEl
            // ==============================
            const cancelItemButton = new ButtonComponent(operateEl);
            cancelItemButton.setButtonText(t('EDITOR_CANCEL_ITEM_BUTTON_TEXT'));
            cancelItemButton.setClass('i18n_edit_operate_button');
            cancelItemButton.onClick(() => {
                if (selectRowEl != undefined) selectRowEl.removeClass('selected');
                selectRowEl = null;
                footInputEl.value = '';
                NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_CANCEL_ITEM_BUTTON_NOTICE_CONTENT_A'));
            });

            const deleteItemButton = new ButtonComponent(operateEl);
            deleteItemButton.setButtonText(t('EDITOR_DELETE_ITEM_BUTTON_TEXT'));
            deleteItemButton.setClass('i18n_edit_operate_button');
            deleteItemButton.onClick(() => {
                if (selectRowEl != null) {
                    // 清除 输入框 
                    footInputEl.value = '';
                    // 清除 显示数据
                    selectRowEl.remove();
                    // 清除 列表数据
                    delete (translationJson.dict[selectRowEl.children[0].textContent as string]);
                    // 清除 选中对象
                    selectRowEl = null;
                    NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'));
                } else {
                    NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_B'));
                }
            });

            const insertItemButton = new ButtonComponent(operateEl);
            insertItemButton.setButtonText(t('EDITOR_INSERT_ITEM_BUTTON_TEXT'));
            insertItemButton.setClass('i18n_edit_operate_button');
            insertItemButton.onClick(() => {
                if (selectRowEl == null) {
                    const tempKey = footInputEl.value;
                    // 变更显示数据
                    if (!translationJson.dict.hasOwnProperty(tempKey)) {
                        // 变更字典数据
                        translationJson.dict[tempKey] = tempKey;
                        // 为每个键值对创建一个新的<tr>（表格行）  
                        const rowEl = tableEl.createEl('tr');
                        rowEl.addClass('i18n_edit_data_table_row')
                        rowEl.onclick = (e) => {
                            if (selectRowEl != undefined) selectRowEl.removeClass('selected');
                            selectRowEl = rowEl;
                            selectRowEl.addClass('selected');
                            footInputEl.value = translationJson.dict[selectRowEl.children[0].textContent as string];
                        };
                        // 创建一个<td>（表格单元格）用于键  
                        const keyCellEl = rowEl.createEl('td');
                        keyCellEl.addClass('i18n_edit_data_table_key');
                        keyCellEl.textContent = tempKey;

                        // 创建一个<td>（表格单元格）用于值  
                        const valueCellEl = rowEl.createEl('td');
                        valueCellEl.addClass('i18n_edit_data_table_value');
                        valueCellEl.textContent = translationJson.dict[tempKey];
                        // 清除数据
                        footInputEl.value = '';
                        NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_A'));
                    } else {
                        NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_B'));
                    }
                } else {
                    NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_C'));
                }
            });

            const baiduButton = new ButtonComponent(operateEl);
            baiduButton.setButtonText('百度');
            baiduButton.setClass('i18n_edit_operate_button');
            if (!(this.i18n.settings.I18N_MODE_NIT && this.i18n.settings.I18N_NIT_API == 'BAIDU')) baiduButton.setClass('i18n_display-none');
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
                    if (selectRowEl != null) {
                        footInputEl.value = temp;
                        selectRowEl.children[1].textContent = temp;
                        translationJson.dict[selectRowEl.children[0].textContent as string] = temp;
                    }
                } catch (error) {
                    console.log();
                }
            });

            const mainButton = new ButtonComponent(operateEl);
            mainButton.setButtonText('Main.JS');
            mainButton.setClass('i18n_edit_operate_button');
            mainButton.onClick(async () => {
                if (navigator.userAgent.match(/Win/i)) {
                    const command = `start ${path.join(this.i18n.selectTranslation.split('\\').slice(0, -2).join('\\'), 'main.js')}`
                    exec(command, (error) => {
                        if (error) {
                            NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error);
                        } else {
                            NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true);
                        }
                    });
                }
                if (navigator.userAgent.match(/Mac/i)) {
                    const command = `open ${path.join(this.i18n.selectTranslation.split('\\').slice(0, -2).join('\\'), 'main.js')}`
                    exec(command, (error) => {
                        if (error) {
                            NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error);
                        } else {
                            NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true);
                        }
                    });
                }

            });

            const langButton = new ButtonComponent(operateEl);
            langButton.setButtonText('译文');
            langButton.setClass('i18n_edit_operate_button');
            langButton.onClick(async () => {
                if (navigator.userAgent.match(/Win/i)) {
                    const command = `start ${this.i18n.selectTranslation}`
                    exec(command, (error) => {
                        if (error) {
                            NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error);
                        } else {
                            NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true);
                        }
                    });
                }
                if (navigator.userAgent.match(/Mac/i)) {
                    const command = `open ${this.i18n.selectTranslation}`
                    exec(command, (error) => {
                        if (error) {
                            NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), false, error);
                        } else {
                            NoticeOperationResult(t('EDITOR_PUBLIC_HEAD'), true);
                        }
                    });
                }

            });

            const helpButton = new ButtonComponent(operateEl);
            helpButton.setButtonText(t('EDITOR_HELP_BUTTON_TEXT'));
            helpButton.setWarning();
            helpButton.setClass('i18n_edit_operate_button');
            helpButton.onClick(() => {
                NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_HELP_BUTTON_NOTICE_CONTENT_A'));
            });

            // ==============================
            // footEl
            // ==============================
            footInputEl.addEventListener('input', function () {
                if (selectRowEl != undefined) {
                    // 变更显示数据
                    selectRowEl.children[1].textContent = footInputEl.value;
                    // 变更字典数据
                    translationJson.dict[selectRowEl.children[0].textContent as string] = footInputEl.value;
                }
            });
        }

        // const 测试El = editEl.createEl('div');
        // 测试El.addClass('aaaaa');

        // const 输出 = fs.readFileSync(this.i18n.selectTranslation, 'utf8');

        // const preEl = 测试El.createEl('pre');
        // const codeEl = preEl.createEl('code');
    }

    focus(): void {
        this.frame.focus();
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



