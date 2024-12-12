import * as fs from 'fs-extra';
import * as path from 'path';
import { ButtonComponent, ItemView, SearchComponent, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Plugin, Theme } from 'src/data/types';
import { diff, formatTimestamp_concise, i18nOpen, isPlugin, isTheme } from 'src/utils';
import { t } from 'src/lang/inxdex';

export const EDIT_VIEW_TYPE = 'i18n-edit-view'

export class EditorView extends ItemView {
    private i18n: I18N;
    private type: string;
    private path: string;
    private stats: fs.Stats;

    private translationJson: Plugin | Theme;
    private translationDict: { key: string, value: string, el: HTMLTableRowElement }[] = [];

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.path = this.i18n.editorPath;
        this.type = this.i18n.editorType;
        if (this.i18n.editorState) {
            const a = this.i18n.editorState.getType();
            this.i18n.editorState.setType(a === '0' || a === '1' ? a : '0');
        }
    }

    async onload() {
        this.i18n.notice.reload();
        const contentEl = this.contentEl;
        contentEl.parentElement?.getElementsByClassName('view-header')[0].remove();
        contentEl.addClass('i18n-edit__container');

        if (this.type !== '' && this.path !== '') {
            this.translationJson = fs.readJsonSync(this.path);
            this.stats = fs.statSync(this.path);
        }

        if (this.type !== '' && this.path !== '' && this.translationJson !== undefined) {
            // ==============================
            // 描述行
            // ==============================
            if (this.type === 'plugin' && isPlugin(this.translationJson)) {
                const manifestEl_1 = contentEl.createEl('div');
                manifestEl_1.addClass('i18n-edit__manifest');
                manifestEl_1.createEl('span', { text: t('编辑器_行_修改日期'), cls: ['i18n-edit__label-wrap'] });
                manifestEl_1.createEl('input', { value: formatTimestamp_concise(this.stats.mtimeMs), cls: ['i18n-edit__plugin-version-input'] }).disabled = true;
                manifestEl_1.createEl('span', { text: t('编辑器_行_源代码'), cls: ['i18n-edit__label-wrap'] });
                manifestEl_1.createEl('input', { value: this.translationJson.description.original, cls: ['i18n-edit__description-input'] }).disabled = true;

                const manifestEl_2 = contentEl.createEl('div');
                manifestEl_2.addClass('i18n-edit__manifest');
                manifestEl_2.createEl('span', { text: t('编辑器_行_插件版本'), cls: ['i18n-edit__label-wrap'] });
                const versionEl = manifestEl_2.createEl('input', { value: this.translationJson.manifest.pluginVersion, cls: ['i18n-edit__plugin-version-input'] });
                versionEl.addEventListener('input', () => { this.translationJson.manifest.pluginVersion = versionEl.value });
                manifestEl_2.createEl('span', { text: t('编辑器_行_新描述'), cls: ['i18n-edit__label-wrap'] });
                const descriptionInputEl = manifestEl_2.createEl('input', { value: this.translationJson.description.translation, cls: ['i18n-edit__description-input'] })
                // @ts-ignore
                descriptionInputEl.addEventListener('input', () => { this.translationJson.description.translation = descriptionInputEl.value });
            }
            if (this.type === 'theme' && isTheme(this.translationJson)) {
                const aEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                aEl.createEl('span', { text: t('编辑器_行_修改日期'), cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: formatTimestamp_concise(this.stats.mtimeMs), cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                aEl.createEl('span', { text: t('编辑器_行_主题版本'), cls: 'i18n-edit__label-wrap' });
                const versionEl = aEl.createEl('input', { value: this.translationJson.manifest.pluginVersion, cls: ['i18n-input', 'i18n-edit__description-input'] })
                versionEl.addEventListener('input', () => { this.translationJson.manifest.pluginVersion = versionEl.value });
                aEl.createEl('span', { text: t('编辑器_行_文件大小'), cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: `${(this.stats.size / 1024 / 1024).toFixed(2)}M`, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
            }

            // ==============================
            // 数据行
            // ==============================
            const dictEl = contentEl.createEl('div', { cls: ['i18n-edit__dict'] });
            const tableEl = dictEl.createEl('table', { cls: ['i18n-edit__table'] });
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
                        const res = diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                    });
                    valueCellEl.addEventListener('blur', () => {
                        const res = diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                        valueCellEl.innerHTML = res.s2;
                    });
                    if (this.i18n.settings.I18N_MODE_NIT) rowEl.createEl('td').createEl('button', { text: t('编辑器_通用_AI_按钮'), cls: ['i18n-basic-button', 'i18n-basic-button--primary'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            const regex = /(['"`])(.*)(\1)/;
                            if (this.i18n.settings.I18N_NIT_API == 'BAIDU') {
                                const tempArray = dictItem.key.match(regex);
                                if (tempArray != null) {
                                    const response = await this.i18n.api.baiduAPI(tempArray[2]);
                                    const newKey = response.state ? dictItem.key.replace(tempArray[2], response.data) : dictItem.key;
                                    const res = diff(dictItem.key, newKey)
                                    dictItem.value = newKey;
                                    keyCellEl.innerHTML = res.s1;
                                    valueCellEl.innerHTML = res.s2;
                                    this.i18n.notice.success(t('编辑器_通知_前缀'), t('编辑器_AI_通知一'));
                                }
                            }
                            if (this.i18n.settings.I18N_NIT_API == 'OPENAI') {
                                const tempArray = dictItem.key.match(regex);
                                if (tempArray != null) {
                                    const response = await this.i18n.api.openAI('', tempArray[2]);
                                    let newValue = ''
                                    if ('content' in response) { newValue = key.replace(tempArray[2], response.content); } else { newValue = key; }
                                    const res = diff(dictItem.key, newValue)
                                    dictItem.value = newValue;
                                    keyCellEl.innerHTML = res.s1;
                                    valueCellEl.innerHTML = res.s2;
                                    this.i18n.notice.success(t('编辑器_通知_前缀'), t('编辑器_AI_通知一'));
                                }
                            }
                        })
                    });
                    rowEl.createEl('td').createEl('button', { text: t('编辑器_通用_还原_按钮'), cls: ['i18n-basic-button', 'i18n-basic-button--warning'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            dictItem.value = dictItem.key;
                            keyCellEl.textContent = dictItem.key;
                            valueCellEl.textContent = dictItem.key;
                            this.i18n.notice.success(t('编辑器_通知_前缀'), t('编辑器_还原_通知一'), 1000);
                        })
                    });
                    rowEl.createEl('td').createEl('button', { text: t('编辑器_通用_删除_按钮'), cls: ['i18n-basic-button', 'i18n-basic-button--danger'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            rowEl.remove();
                            this.translationDict = this.translationDict.filter(item => item.key !== dictItem.key);
                            this.i18n.notice.success(t('编辑器_通知_前缀'), t('编辑器_删除_通知一'), 1000);
                        })
                    });
                    const res = diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = res.s1;
                    valueCellEl.innerHTML = res.s2;
                }
            }

            // ==============================
            // 操作行
            // ==============================
            const searchEl = contentEl.createEl('div', { cls: ['i18n-edit__search'] });
            const operateEl = contentEl.createEl('div', { cls: ['i18n-edit__operate'] });
            let matchingItems: { key: string; value: string; el: HTMLTableRowElement; }[];
            let selectSearchCount = 0;
            let isSearch = false;
            let Aa = false;
            // 搜索栏
            const searchInput = new SearchComponent(searchEl);
            searchInput.onChange((value) => {
                matchingItems = Aa ? this.translationDict.filter(item => item.key.includes(value) || item.value.includes(value)) : this.translationDict.filter(item => item.key.toLowerCase().includes(value.toLowerCase()) || item.value.toLowerCase().includes(value.toLowerCase()));
                if (matchingItems.length > 0 && value !== '') {
                    isSearch = true;
                    searchCountButton.setButtonText(`${selectSearchCount + 1}/${matchingItems.length}`);
                    selectSearchCount = 0;
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
            searchInput.inputEl.addClass('i18n-edit__search-input');

            const AaButton = new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setIcon('a-large-small').setTooltip(t('编辑器_大小_按钮_提示')).onClick(() => {
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
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setIcon('arrow-up').setTooltip(t('编辑器_上个_按钮_提示')).onClick(() => {
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
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setIcon('arrow-down').setTooltip(t('编辑器_下个_按钮_提示')).onClick(() => {
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
            const searchCountButton = new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText('0/0').setTooltip(t('编辑器_数量_按钮_提示'));

            const insertItemInput = new SearchComponent(operateEl);
            insertItemInput.inputEl.parentElement?.addClass('i18n-edit__operate-input');
            // insertItemInput.onChange((value) => { });
            // 插入 按钮
            const insertItemButton = new ButtonComponent(operateEl);
            insertItemButton.setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
            insertItemButton.setButtonText(t('编辑器_新增_按钮')).setTooltip(t('编辑器_新增_按钮_提示'))
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
                        const res = diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                    });
                    valueCellEl.addEventListener('blur', () => {
                        const res = diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                        valueCellEl.innerHTML = res.s2;
                    });
                    if (this.i18n.settings.I18N_MODE_NIT) rowEl.createEl('td').createEl('button', { text: 'AI', cls: ['i18n-basic-button', 'i18n-basic-button--primary'] }, async (el: { addEventListener: (arg0: string, arg1: () => Promise<void>) => void; }) => {
                        el.addEventListener('click', async () => {
                            const regex = /(['"`])(.*)(\1)/;
                            if (this.i18n.settings.I18N_NIT_API == 'BAIDU') {
                                const tempArray = dictItem.key.match(regex);
                                if (tempArray != null) {
                                    const response = await this.i18n.api.baiduAPI(tempArray[2]);
                                    const newKey = response.state ? dictItem.key.replace(tempArray[2], response.data) : dictItem.key;
                                    const res = diff(dictItem.key, newKey)
                                    dictItem.value = newKey;
                                    keyCellEl.innerHTML = res.s1;
                                    valueCellEl.innerHTML = res.s2;
                                    this.i18n.notice.success('译文编辑器', '翻译成功');
                                }
                            }
                            if (this.i18n.settings.I18N_NIT_API == 'OPENAI') {
                                const tempArray = dictItem.key.match(regex);
                                if (tempArray != null) {
                                    const response = await this.i18n.api.openAI('', tempArray[2]);
                                    let newValue = ''
                                    if ('content' in response) { newValue = key.replace(tempArray[2], response.content); } else { newValue = key; }
                                    const res = diff(dictItem.key, newValue)
                                    dictItem.value = newValue;
                                    keyCellEl.innerHTML = res.s1;
                                    valueCellEl.innerHTML = res.s2;
                                    this.i18n.notice.success('译文编辑器', '翻译成功');
                                }
                            }
                        })
                    });
                    rowEl.createEl('td').createEl('button', { text: '还原', cls: ['i18n-basic-button', 'i18n-basic-button--warning'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            dictItem.value = dictItem.key;
                            keyCellEl.textContent = dictItem.key;
                            valueCellEl.textContent = dictItem.key;
                            this.i18n.notice.success(t('编辑器_通知_前缀'), t('编辑器_还原_通知一'));
                        })
                    });
                    rowEl.createEl('td').createEl('button', { text: '删除', cls: ['i18n-basic-button', 'i18n-basic-button--danger'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            rowEl.remove();
                            this.translationDict = this.translationDict.filter(item => item.key !== dictItem.key);
                            this.i18n.notice.success(t('编辑器_通知_前缀'), t('编辑器_删除_通知一'), 1000);
                        })
                    });
                    const res = diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = res.s1;
                    valueCellEl.innerHTML = res.s2;
                    rowEl.scrollIntoView({ behavior: 'auto', block: 'center' });
                    this.i18n.notice.success(t('编辑器_通知_前缀'), t('编辑器_新增_通知一'), 1000);
                } else {
                    this.i18n.notice.error(t('编辑器_通知_前缀'), t('编辑器_新增_通知二'));
                }
            });
            // 删除 按钮
            new ButtonComponent(operateEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-danger`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText(t('编辑器_删除_按钮')).setTooltip(t('编辑器_删除_按钮_提示')).onClick(() => {
                    const originalLength = this.translationDict.length;
                    this.translationDict = this.translationDict.filter(item => {
                        const shouldRemove = item.key === item.value;
                        if (shouldRemove) item.el.remove();
                        return !shouldRemove;
                    });
                    const deletedCount = originalLength - this.translationDict.length;
                    this.i18n.notice.success(t('编辑器_通知_前缀'), `共删除${deletedCount}项未翻译内容`);
                });

            // 源码DOM 
            new ButtonComponent(operateEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-warning`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText(t('编辑器_源码_按钮')).setTooltip(t('编辑器_源码_按钮_提示')).onClick(async () => {
                    if (this.i18n.editorType === 'plugin') {
                        i18nOpen(this.i18n, path.join(this.path.split('\\').slice(0, -2).join('\\'), 'main.js'));
                    } else if (this.i18n.editorType === 'theme') {
                        i18nOpen(this.i18n, path.join(this.path.split('\\').slice(0, -2).join('\\'), 'theme.css'));
                    }
                });

            // 译文DOM
            new ButtonComponent(operateEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-warning`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText(t('编辑器_译文_按钮')).setTooltip(t('编辑器_译文_按钮_提示')).onClick(async () => {
                    i18nOpen(this.i18n, path.join(this.path));
                });

            // 保存DOM
            new ButtonComponent(operateEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText(t('编辑器_保存_按钮')).setTooltip(t('编辑器_保存_按钮_提示')).onClick(async () => {
                    try {
                        const dict: { [key: string]: string } = {};
                        this.translationDict.forEach(item => { dict[item.key] = item.value; })
                        this.translationJson.dict = dict;
                        console.log(this.translationJson.dict)
                        fs.writeJsonSync(this.path, this.translationJson, { spaces: 4 });
                        this.i18n.notice.result(t('编辑器_通知_前缀'), true, '');
                    } catch (error) {
                        this.i18n.notice.result(t('编辑器_通知_前缀'), false, error);
                    }
                });

            // 检查是否更新
            const update = new ButtonComponent(operateEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText(this.i18n.editorState.getType() === '0' ? '检查更新' : '不检查更新').setTooltip(t('编辑器_保存_按钮_提示')).onClick(async () => {
                    this.i18n.editorState.setType(this.i18n.editorState.getType() === '0' ? '1' : '0');
                    update.setButtonText(this.i18n.editorState.getType() === '0' ? '检查更新' : '不检查更新');
                });

        } else {
            contentEl.createEl('h1', { text: 'Oh~抱歉，您的数据走丢了', cls: ['i18n-empty'] });
        }
    }

    async onunload() {
        this.i18n.notice.reload();
        this.path = ''
        this.contentEl.empty();
        this.i18n.detachEditorView();
    }

    getViewType(): string { return EDIT_VIEW_TYPE; }
    getDisplayText(): string { return t('编辑器_通用_名称'); }
    getIcon(): string { return 'i18n_translate'; }
}



