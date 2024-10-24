// import * as fs from 'fs-extra';
import { ButtonComponent, ItemView, Notice, SearchComponent, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Translation } from 'src/data/types';
import { formatTimestamp_concise, inflate, NoticeError, NoticeOperationResult, NoticeSuccess } from 'src/utils';
import { t } from 'src/lang/inxdex';
// @ts-ignore
import { diffWords } from 'diff';

export const ADMIN_VIEW_TYPE = 'i18n-admin-view'

export class AdminView extends ItemView {
    private i18n: I18N;
    private notices: Notice[] = [];
    private translationJson: Translation;
    private translationDict: { key: string, value: string, el: HTMLTableRowElement }[] = [];

    private cloudTranslationJson: Translation;

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.contentEl.style.setProperty('--i18n-color-primary', this.i18n.settings.I18N_COLOR);
    }

    async onload() {
        if (this.i18n.issuesObj.title.includes("[提交译文]")) {
            this.translationJson = JSON.parse(inflate(this.i18n.issuesObj.body));
            // 编辑器DOM
            const editEl = this.contentEl;
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
            // 插件版本标签
            const pluginVersionLabelEl = manifestEl.createEl('span');
            pluginVersionLabelEl.textContent = '插件版本';
            pluginVersionLabelEl.addClass('i18n-edit__label-wrap');
            // 插件版本DOM
            const pluginVersionEl = manifestEl.createEl('input');
            pluginVersionEl.addClass('i18n-edit__plugin-version-input');
            // 描述标签
            const descriptionLabelEl = manifestEl.createEl('span');
            descriptionLabelEl.textContent = '新描述';
            descriptionLabelEl.addClass('i18n-edit__label-wrap');
            // 描述DOM
            const descriptionInputEl = manifestEl.createEl('input');
            descriptionInputEl.addClass('i18n-edit__description-input');

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
                // ==============================
                // headeEl
                // ==============================
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
                        operateEl.addClass('i18n-edit__table-operate');
                        operateEl.createEl('button', { text: '还原', cls: ['i18n-edit__operate-operate-button'] }, async (el) => {
                            el.addEventListener('click', async () => {
                                dictItem.value = dictItem.key;
                                keyCellEl.textContent = dictItem.key;
                                valueCellEl.textContent = dictItem.key;
                                this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                            })
                        });
                        operateEl.createEl('button', { text: '删除', cls: ['i18n-edit__operate-operate-button'] }, async (el) => {
                            el.addEventListener('click', async () => {
                                rowEl.remove();
                                this.translationDict = this.translationDict.filter(item => item.key !== dictItem.key);
                                this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
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
                const searchInput = new SearchComponent(searchEl).onChange((value) => {
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

                const AaButton = new ButtonComponent(searchEl).setClass('i18n-button').setClass('i18n-button--primary').setClass('i18n-edit__search-button').setIcon('a-large-small').onClick(() => {
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
                new ButtonComponent(searchEl).setClass('i18n-button').setClass('i18n-button--primary').setClass('i18n-edit__search-button').setIcon('arrow-up').onClick(() => {
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
                new ButtonComponent(searchEl).setClass('i18n-button').setClass('i18n-button--primary').setClass('i18n-edit__search-button').setIcon('arrow-down').onClick(() => {
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
                const searchCountButton = new ButtonComponent(searchEl).setClass('i18n-button').setClass('i18n-button--primary').setClass('i18n-edit__search-button').setButtonText('0/0');
                // ==============================
                // operateEl
                // ==============================
                const insertItemInput = new SearchComponent(operateEl);
                insertItemInput.inputEl.parentElement?.addClass('i18n-edit__operate-input');
                // [按钮] 新增
                new ButtonComponent(operateEl).setClass('i18n-button').setClass('i18n-button--primary').setClass('i18n-edit__operate-button').setButtonText(t('EDITOR_INSERT_ITEM_BUTTON_TEXT')).onClick(() => {
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
                        operateEl.addClass('i18n-edit__table-operate');
                        operateEl.createEl('button', { text: '还原', cls: ['i18n-edit__operate-operate-button'] }, async (el) => {
                            el.addEventListener('click', async () => {
                                dictItem.value = dictItem.key;
                                keyCellEl.textContent = dictItem.key;
                                valueCellEl.textContent = dictItem.key;
                                this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_RESTORE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                            })
                        });
                        operateEl.createEl('button', { text: '删除', cls: ['i18n-edit__operate-operate-button'] }, async (el) => {
                            el.addEventListener('click', async () => {
                                rowEl.remove();
                                this.translationDict = this.translationDict.filter(item => item.key !== dictItem.key);
                                this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_DELETE_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                            })
                        });
                        const diff = this.diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = diff.s1;
                        valueCellEl.innerHTML = diff.s2;
                        rowEl.scrollIntoView({ behavior: 'auto', block: 'center' });
                        this.notices.push(NoticeSuccess(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_A'), 1000));
                    } else {
                        this.notices.push(NoticeError(t('EDITOR_PUBLIC_HEAD'), t('EDITOR_INSERT_ITEM_BUTTON_NOTICE_CONTENT_B')));
                    }
                });
                // [按钮] 驳回
                new ButtonComponent(operateEl).setClass('i18n-button').setClass('i18n-button--success').setClass('i18n-edit__save-button').setClass('i18n-edit__operate-button').setButtonText('驳回').onClick(async () => {
                    (await this.i18n.api.giteePatchIssue(this.i18n.issuesObj.number, 'closed')).state ? this.notices.push(NoticeOperationResult('审核', true, '', 1000)) : this.notices.push(NoticeOperationResult('审核', false));
                });
                // [按钮] 批准
                new ButtonComponent(operateEl).setClass('i18n-button').setClass('i18n-button--success').setClass('i18n-edit__save-button').setClass('i18n-edit__operate-button').setButtonText('批准').onClick(async () => {
                    try {
                        // 更新翻译版本和字典  
                        this.translationJson.dict = Object.fromEntries(this.translationDict.map(item => [item.key, item.value]));

                        // 构建译文路径和内容 
                        const translationID = this.i18n.issuesObj.title.replace("[提交译文] ", "");
                        const translationPath = `translation/dict/${translationID}/${this.i18n.settings.I18N_LANGUAGE}/${this.translationJson.manifest.pluginVersion}.json`;
                        const translationContent = Buffer.from(JSON.stringify(this.translationJson, null, 4)).toString('base64');

                        // 构建目录路径和内容 
                        const directoryPath = `translation/directory/${this.i18n.settings.I18N_LANGUAGE}.json`;
                        const directorySha = await this.i18n.api.giteeGetSha(directoryPath);
                        const directoryContent = JSON.parse(Buffer.from(directorySha.data.content, 'base64').toString('utf8'));
                        // 更新或创建目录项
                        const existingItem = directoryContent.find((obj: { id: any; }) => obj.id === translationID);
                        const translations = { ...(existingItem?.translations || {}), [this.translationJson.manifest.pluginVersion]: this.translationJson.manifest.translationVersion };
                        if (!existingItem) { directoryContent.push({ id: translationID, translations }); } else { existingItem.translations = translations; }
                        // 构建并更新目录内容 
                        const updatedDirectoryContent = Buffer.from(JSON.stringify(directoryContent, null, 4)).toString('base64');

                        // 构建贡献名单路径和内容 
                        const contributorPath = `translation/contributor/${this.i18n.settings.I18N_LANGUAGE}.json`;
                        const contributorSha = await this.i18n.api.giteeGetSha(contributorPath);
                        const contributorContent = JSON.parse(Buffer.from(contributorSha.data.content, 'base64').toString('utf8'));
                        // 更新贡献名单
                        const contributorItem = contributorContent.find((obj: { login: any; }) => obj.login === this.i18n.issuesObj.user.login);
                        if (contributorItem) {
                            contributorItem.translation += Object.keys(this.translationJson.dict).length;
                        } else {
                            const newContributor = {
                                "login": this.i18n.issuesObj.user.login,
                                "name": this.i18n.issuesObj.user.name,
                                "url": this.i18n.issuesObj.user.html_url,
                                "translation": Object.keys(this.translationJson.dict).length,
                                "modification": 0,
                                "erasure": 0
                            };
                            contributorContent.push(newContributor);
                        }
                        const updatedContributorContent = Buffer.from(JSON.stringify(contributorContent, null, 4)).toString('base64');
                        
                        // 执行写入操作  
                        await Promise.all([
                            this.i18n.api.giteePostTranslation(translationPath, translationContent, `提交译文 ${translationID}`),
                            this.i18n.api.giteePutTranslation(directoryPath, updatedDirectoryContent, directorySha.data.sha, `写入目录 ${translationID}`),
                            this.i18n.api.giteePutContributor(contributorPath, updatedContributorContent, contributorSha.data.sha, `写入贡献 ${this.i18n.issuesObj.user.name}`),
                            this.i18n.api.giteePatchIssue(this.i18n.issuesObj.number, 'closed'),
                        ]);
                        this.notices.push(NoticeOperationResult('审核', true, '', 1000));
                    } catch (error) {
                        console.log(error)
                        this.notices.push(NoticeOperationResult('审核', false, error));
                    }
                });
            }
        }
        if (this.i18n.issuesObj.title.includes("[更新译文]")) {

        }
    }

    async onunload() { for (const notice of this.notices) { notice.noticeEl.remove(); } }

    async showData() { }

    diff(s1: string, s2: string) {
        const differences = diffWords(s1, s2);
        let keyHighlightedHTML = "";
        let valueHighlightedHTML = "";
        differences.forEach((part: { added: unknown; removed: unknown; value: unknown; }) => {
            if (part.added) { valueHighlightedHTML += `<span class='color__text--green'>${part.value}</span>` }
            else if (part.removed) { keyHighlightedHTML += `<span class='color__text--red'>${part.value}</span>` }
            else { keyHighlightedHTML += part.value; valueHighlightedHTML += part.value; }
        });
        return { s1: keyHighlightedHTML, s2: valueHighlightedHTML };
    }

    async onOpen() { }
    async onClose() { this.contentEl.empty(); }
    focus(): void { this.focus(); this.onClose(); }
    getViewType(): string { return ADMIN_VIEW_TYPE; }
    getDisplayText(): string { return '审核面板'; }
    getIcon(): string { return 'i18n_translate'; }
}



