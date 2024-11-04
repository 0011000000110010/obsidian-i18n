import * as fs from 'fs-extra';
import * as path from 'path';
import { ButtonComponent, ItemView, SearchComponent, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Translation } from 'src/data/types';
import { compareTranslation, i18nOpen, inflate } from 'src/utils';

// @ts-ignore
import { diffWords } from 'diff';

export const ADMIN_VIEW_TYPE = 'i18n-admin-view'

export class AdminView extends ItemView {
    private i18n: I18N;
    private issueTranslationJson: Translation;
    private cloudTranslationJson: Translation;
    private submitTranslationObj: { key: string, value: string, el: HTMLTableRowElement, state: boolean }[] = [];
    private updateTranslationObj: { type: string, key: string, value: string, el: HTMLTableRowElement, state: boolean }[] = [];

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.i18n.notice.reload();
    }

    async onload() {
        // 编辑器DOM
        const reviewEl = this.contentEl;
        reviewEl.addClass('i18n-review__container');
        reviewEl.parentElement?.getElementsByClassName('view-header')[0].remove();
        // 提交译文
        if (this.i18n.issuesObj.title.includes("[提交译文] ")) {
            this.issueTranslationJson = JSON.parse(inflate(this.i18n.issuesObj.body));

            const originalManifestEl = reviewEl.createEl('div', { cls: ['i18n-edit__manifest'] });
            const translationManifestEl = reviewEl.createEl('div', { cls: ['i18n-edit__manifest'] });

            originalManifestEl.createEl('span', { text: '插件标识', cls: 'i18n-edit__label-wrap' });
            originalManifestEl.createEl('input', { value: this.i18n.issuesObj.title.replace("[提交译文] ", ""), cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
            originalManifestEl.createEl('span', { text: '旧描述', cls: 'i18n-edit__label-wrap' });
            originalManifestEl.createEl('input', { value: this.issueTranslationJson.description.original, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;

            translationManifestEl.createEl('span', { text: '插件版本', cls: 'i18n-edit__label-wrap' });
            translationManifestEl.createEl('input', { value: this.issueTranslationJson.manifest.pluginVersion, cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
            translationManifestEl.createEl('span', { text: '新描述', cls: 'i18n-edit__label-wrap' });
            translationManifestEl.createEl('input', { value: this.issueTranslationJson.description.original, cls: ['i18n-input', 'i18n-edit__description-input'] }, (el) => {
                el.addEventListener("input", () => { this.issueTranslationJson.description.translation = el.value })
            });

            const dictEl = reviewEl.createEl('div', { cls: ['i18n-edit__dict'] });
            const searchEl = reviewEl.createEl('div', { cls: ['i18n-edit__search'] });

            if (this.issueTranslationJson != undefined) {
                // ==============================
                // dictEl
                // ==============================
                const tableEl = dictEl.createEl('table');
                tableEl.addClass('i18n-edit__table');
                for (const key in this.issueTranslationJson.dict) {
                    if (this.issueTranslationJson.dict.hasOwnProperty(key)) {
                        const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                        const dictItem = { key: key, value: this.issueTranslationJson.dict[key], el: rowEl, state: true }
                        this.submitTranslationObj.push(dictItem);
                        const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                        labelEl.createEl('span', { text: '新增', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-success`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                        const keyCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                        const valueCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'], attr: { 'contenteditable': 'true' } });
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
                        const operateEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                        operateEl.createEl('button', { text: dictItem.state ? '否决' : '批准', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                            el.addEventListener('click', async () => {
                                el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                                dictItem.state = !dictItem.state;
                                el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                                el.textContent = dictItem.state ? '否决' : '批准';
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
                // [搜索] 搜索栏
                const searchInput = new SearchComponent(searchEl).onChange((value) => {
                    // 获取 匹配项
                    matchingItems = Aa ? this.submitTranslationObj.filter(item => item.key.includes(value) || item.value.includes(value)) : this.submitTranslationObj.filter(item => item.key.toLowerCase().includes(value.toLowerCase()) || item.value.toLowerCase().includes(value.toLowerCase()));
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
                // [搜索] 大小写切换
                const AaButton = new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
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
                // [搜索] 向上
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
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
                // [搜索] 向下
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setIcon('arrow-down').onClick(() => {
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
                // [搜索] 数量
                const searchCountButton = new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setButtonText('0/0');
                // [功能] 测试
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setButtonText('测试').onClick(async () => {
                        // @ts-ignore
                        const dir = path.join(this.app.vault.adapter.getBasePath(), this.i18n.manifest.dir, 'Admin');
                        // @ts-ignore
                        const doc = path.join(this.app.vault.adapter.getBasePath(), this.i18n.manifest.dir, 'Admin', `${this.i18n.issuesObj.title}.json`);
                        this.issueTranslationJson.dict = Object.fromEntries(this.submitTranslationObj.filter(item => item.state === true).map(item => [item.key, item.value]));
                        fs.ensureDirSync(dir);
                        fs.writeJSONSync(doc, this.issueTranslationJson, { spaces: 4 });
                        i18nOpen(this.i18n, dir);
                    });
                // [功能] 关闭
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-danger`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setButtonText('关闭').onClick(async () => {
                        const res = await this.i18n.api.giteePatchIssue(this.i18n.issuesObj.number, 'closed')
                        if (res.state) {
                            this.i18n.notice.result('驳回', true);
                            this.i18n.issuesList = this.i18n.issuesList.filter((item: { number: string; }) => item.number !== this.i18n.issuesObj.number);
                            this.i18n.admin.reloadShowData();
                        } else {
                            this.i18n.notice.result('驳回', false, res.data);
                        }
                    });
                // [功能] 合并
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setButtonText('合并').onClick(async () => {
                        try {
                            // 更新翻译版本和字典  
                            this.issueTranslationJson.dict = Object.fromEntries(this.submitTranslationObj.filter(item => item.state === true).map(item => [item.key, item.value]));
                            this.issueTranslationJson.manifest.translationVersion = Date.now();
                            // 构建译文路径和内容 
                            const translationID = this.i18n.issuesObj.title.replace("[提交译文] ", "");
                            const translationPath = `translation/dict/${translationID}/${this.i18n.settings.I18N_LANGUAGE}/${this.issueTranslationJson.manifest.pluginVersion}.json`;
                            const translationContent = Buffer.from(JSON.stringify(this.issueTranslationJson, null, 4)).toString('base64');

                            // 构建目录路径和内容 
                            const directoryPath = `translation/directory/${this.i18n.settings.I18N_LANGUAGE}.json`;
                            const directorySha = await this.i18n.api.giteeGetSha(directoryPath);
                            if (!directorySha.state) { this.i18n.notice.result('合并', false, `无法获取译文目录\n${directorySha.data}`); return; }
                            const directoryContent = JSON.parse(Buffer.from(directorySha.data.content, 'base64').toString('utf8'));

                            // 更新或创建目录项
                            const existingItem = directoryContent.find((obj: { id: string; }) => obj.id === translationID);
                            const translations = { ...(existingItem?.translations || {}), [this.issueTranslationJson.manifest.pluginVersion]: this.issueTranslationJson.manifest.translationVersion };
                            if (!existingItem) { directoryContent.push({ id: translationID, translations }); } else { existingItem.translations = translations; }
                            const updatedDirectoryContent = Buffer.from(JSON.stringify(directoryContent, null, 4)).toString('base64');

                            // 构建贡献名单路径和内容 
                            const contributorPath = `translation/contributor/${this.i18n.settings.I18N_LANGUAGE}.json`;
                            const contributorSha = await this.i18n.api.giteeGetSha(contributorPath);
                            if (!contributorSha.state) { this.i18n.notice.result('合并', false, `无法获取贡献者目录\n${contributorSha.data}`); return; }
                            const contributorContent = JSON.parse(Buffer.from(contributorSha.data.content, 'base64').toString('utf8'));
                            // 更新贡献名单
                            const contributorItem = contributorContent.find((obj: { login: string; }) => obj.login === this.i18n.issuesObj.user.login);
                            if (contributorItem) {
                                contributorItem.translation += Object.keys(this.issueTranslationJson.dict).length;
                            } else {
                                const newContributor = {
                                    "login": this.i18n.issuesObj.user.login,
                                    "name": this.i18n.issuesObj.user.name,
                                    "url": this.i18n.issuesObj.user.html_url,
                                    "translation": Object.keys(this.issueTranslationJson.dict).length,
                                    "modification": 0,
                                    "erasure": 0
                                };
                                contributorContent.push(newContributor);
                            }
                            const updatedContributorContent = Buffer.from(JSON.stringify(contributorContent, null, 4)).toString('base64');

                            // 执行写入操作 
                            const giteePutTranslationRes = await this.i18n.api.giteePutTranslation(directoryPath, updatedDirectoryContent, directorySha.data.sha, `写入目录 ${translationID}`);
                            if (!giteePutTranslationRes.state) { this.i18n.notice.result('合并', false, `无法写入目录\n${giteePutTranslationRes.data}`); return; } else { this.i18n.notice.result('批准', true, `1/4 写入目录 ${translationID}\n请耐心等待审核流程运行完毕`); }
                            await sleep(1000);
                            const giteePutContributorRes = await this.i18n.api.giteePutContributor(contributorPath, updatedContributorContent, contributorSha.data.sha, `写入贡献 ${this.i18n.issuesObj.user.name}`);
                            if (!giteePutContributorRes.state) { this.i18n.notice.result('合并', false, `无法写入贡献\n请前往gitee删除写入目录内容\n${giteePutContributorRes.data}`); return; } else { this.i18n.notice.result('批准', true, `2/4 写入贡献 ${this.i18n.issuesObj.user.name}\n请耐心等待审核流程运行完毕`); }
                            await sleep(1000);
                            const giteePostTranslationRes = await this.i18n.api.giteePostTranslation(translationPath, translationContent, `提交译文 ${translationID}`);
                            if (!giteePostTranslationRes.state) { this.i18n.notice.result('合并', false, `无法写入译文\n请前往gitee删除写入目录、写入贡献内容\n${giteePostTranslationRes.data}`); return; } else { this.i18n.notice.result('批准', true, `3/4 写入译文 ${translationID}\n请耐心等待审核流程运行完毕`); }
                            await sleep(1000);
                            const giteePatchIssueRes = await this.i18n.api.giteePatchIssue(this.i18n.issuesObj.number, 'closed');
                            if (!giteePatchIssueRes.state) { this.i18n.notice.result('合并', false, `无法关闭 issue\n请前往gitee手动关闭此issue\n${giteePatchIssueRes.data}`); return; } else { this.i18n.notice.result('批准', true, `4/4 关闭 issue`); }
                            this.i18n.notice.result('合并', true);
                            this.i18n.issuesList = this.i18n.issuesList.filter((item: { number: string; }) => item.number !== this.i18n.issuesObj.number);
                            this.i18n.admin.reloadShowData();
                        } catch (error) {
                            this.i18n.notice.result('合并', false, error);
                        }
                    });
            }
        }
        // 更新译文
        if (this.i18n.issuesObj.title.includes("[更新译文] ")) {
            const id = this.i18n.issuesObj.title.replace("[更新译文] ", "");
            // [译文] 提交
            this.issueTranslationJson = JSON.parse(inflate(this.i18n.issuesObj.body));
            // [译文] 云端 
            this.cloudTranslationJson = (await this.i18n.api.giteeGetTranslation(id, this.issueTranslationJson.manifest.pluginVersion)).data;
            // [对比] 提交 和 云端
            const compare = compareTranslation(this.cloudTranslationJson, this.issueTranslationJson);

            const cEl = reviewEl.createEl('div', { cls: ['i18n-edit__manifest'] });
            const originalManifestEl = reviewEl.createEl('div', { cls: ['i18n-edit__manifest'] });
            const translationManifestEl = reviewEl.createEl('div', { cls: ['i18n-edit__manifest'] });

            cEl.createEl('span', { text: '译文作者', cls: 'i18n-edit__label-wrap' });
            cEl.createEl('input', { value: this.i18n.issuesObj.user.login, cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
            cEl.createEl('span', { text: '源代码', cls: 'i18n-edit__label-wrap' });
            cEl.createEl('input', { value: this.issueTranslationJson.description.original, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;

            originalManifestEl.createEl('span', { text: '插件标识', cls: 'i18n-edit__label-wrap' });
            originalManifestEl.createEl('input', { value: id, cls: 'i18n-edit__plugin-version-input' }).disabled = true;
            originalManifestEl.createEl('span', { text: '旧描述', cls: 'i18n-edit__label-wrap' });
            originalManifestEl.createEl('input', { value: this.cloudTranslationJson.description.translation, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;

            translationManifestEl.createEl('span', { text: '插件版本', cls: 'i18n-edit__label-wrap' });
            translationManifestEl.createEl('input', { value: this.issueTranslationJson.manifest.pluginVersion, cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
            translationManifestEl.createEl('span', { text: '新描述', cls: 'i18n-edit__label-wrap' });
            translationManifestEl.createEl('input', { value: this.issueTranslationJson.description.translation, cls: ['i18n-input', 'i18n-edit__description-input'] }, (el) => {
                el.addEventListener("input", () => { this.issueTranslationJson.description.translation = el.value })
            });

            // 字典DOM
            const dictEl = reviewEl.createEl('div');
            dictEl.addClass('i18n-edit__dict');
            // 搜索DOM
            const searchEl = reviewEl.createEl('div');
            searchEl.addClass('i18n-edit__search');

            if (this.issueTranslationJson != undefined) {
                // ==============================
                // dictEl
                // ==============================
                const tableEl = dictEl.createEl('table');
                tableEl.addClass('i18n-edit__table');
                // 改
                for (const key in compare.modified) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns-added'] });
                    const dictItem = { type: 'modified', key: key, value: compare.modified[key].newValue, el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);
                    const diff = this.diff(dictItem.key, dictItem.value);
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '修改', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-warning`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    const keyCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    keyCellEl.innerHTML = diff.s1;
                    const oldValueCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    oldValueCellEl.innerHTML = compare.modified[key].oldValue;
                    const newValueCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'], attr: { 'contenteditable': 'true' } });
                    newValueCellEl.innerHTML = diff.s2;
                    newValueCellEl.addEventListener('input', () => {
                        if (newValueCellEl.textContent) dictItem.value = newValueCellEl.textContent;
                        const res = this.diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                    });
                    newValueCellEl.addEventListener('blur', () => {
                        const res = this.diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                        newValueCellEl.innerHTML = res.s2;
                    });
                    const operateCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    operateCellEl.createEl('button', { text: dictItem.state ? '否决' : '批准', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            dictItem.state = !dictItem.state;
                            el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            el.textContent = dictItem.state ? '否决' : '批准';
                        })
                    });
                }
                // 增
                for (const key in compare.added) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    const dictItem = { type: 'added', key: key, value: compare.added[key], el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '新增', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-success`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    const keyCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    const valueCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'], attr: { 'contenteditable': 'true' } });
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
                    const operateEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    operateEl.createEl('button', { text: dictItem.state ? '否决' : '批准', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            dictItem.state = !dictItem.state;
                            el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            el.textContent = dictItem.state ? '否决' : '批准';
                        })
                    });
                    const diff = this.diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = diff.s1;
                    valueCellEl.innerHTML = diff.s2;
                }
                // 删
                for (const key in compare.removed) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    const dictItem = { type: 'removed', key: key, value: compare.removed[key], el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '删除', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-danger`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    const keyCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    const valueCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    const operateEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    operateEl.createEl('button', { text: dictItem.state ? '否决' : '批准', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            dictItem.state = !dictItem.state;
                            el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            el.textContent = dictItem.state ? '否决' : '批准';
                        })
                    });
                    const diff = this.diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = diff.s1;
                    valueCellEl.innerHTML = diff.s2;
                }
                // 初始
                for (const key in compare.unchanged) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    const dictItem = { type: 'unchanged', key: key, value: compare.unchanged[key], el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '初始', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-info`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    const keyCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    const valueCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    const operateEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    operateEl.createEl('button', { text: dictItem.state ? '否决' : '批准', cls: ['i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success'] }, async (el) => {
                        el.addEventListener('click', async () => {
                            el.removeClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            dictItem.state = !dictItem.state;
                            el.addClass('i18n-basic-button', dictItem.state ? 'i18n-basic-button--danger' : 'i18n-basic-button--success');
                            el.textContent = dictItem.state ? '否决' : '批准';
                        })
                    });
                    const diff = this.diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = diff.s1;
                    valueCellEl.innerHTML = diff.s2;
                }
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
                // [搜索] 大小写切换
                const AaButton = new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
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
                // [搜索] 向上
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
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
                // [搜索] 向下
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setIcon('arrow-down').onClick(() => {
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
                // [搜索] 数量
                const searchCountButton = new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setButtonText('0/0');
                // [功能] 下载
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setButtonText('测试').onClick(async () => {
                        // @ts-ignore
                        const dir = path.join(this.app.vault.adapter.getBasePath(), this.i18n.manifest.dir, 'Admin');
                        // @ts-ignore
                        const doc = path.join(this.app.vault.adapter.getBasePath(), this.i18n.manifest.dir, 'Admin', `${this.i18n.issuesObj.title}.json`);
                        const unchangedEntries = this.updateTranslationObj.filter(item => item.type === 'unchanged' && item.state === true).map(item => [item.key, item.value]);
                        const modifiedEntries = this.updateTranslationObj.filter(item => item.type === 'modified' && item.state === true).map(item => [item.key, item.value]);
                        const addedEntries = this.updateTranslationObj.filter(item => item.type === 'added' && item.state === true).map(item => [item.key, item.value]);
                        const falseRemovedEntries = this.updateTranslationObj.filter(item => item.type === 'removed' && item.state === false).map(item => [item.key, item.value]);
                        const allEntries = [...unchangedEntries, ...modifiedEntries, ...addedEntries, ...falseRemovedEntries];
                        this.issueTranslationJson.dict = Object.fromEntries(allEntries);
                        fs.ensureDirSync(dir);
                        fs.writeJSONSync(doc, this.issueTranslationJson, { spaces: 4 });
                        i18nOpen(this.i18n, dir);
                    });
                // [功能] 关闭
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-danger`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setButtonText('关闭').onClick(async () => {
                        const res = await this.i18n.api.giteePatchIssue(this.i18n.issuesObj.number, 'closed')
                        if (res.state) {
                            this.i18n.notice.result('驳回', true);
                            this.i18n.issuesList = this.i18n.issuesList.filter((item: { number: string; }) => item.number !== this.i18n.issuesObj.number);
                            this.i18n.admin.reloadShowData();
                        } else {
                            this.i18n.notice.result('驳回', false, res.data);
                        }
                    });
                // [功能] 合并
                new ButtonComponent(searchEl)
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`)
                    .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                    .setClass('i18n-button--left')
                    .setButtonText('合并').onClick(async () => {
                        try {
                            // 更新翻译版本和字典  
                            const modifiedEntries = this.updateTranslationObj.filter(item => item.type === 'modified' && item.state === true).map(item => [item.key, item.value]);
                            const unchangedEntries = this.updateTranslationObj.filter(item => item.type === 'unchanged' && item.state === true).map(item => [item.key, item.value]);
                            const addedEntries = this.updateTranslationObj.filter(item => item.type === 'added' && item.state === true).map(item => [item.key, item.value]);
                            const falseRemovedEntries = this.updateTranslationObj.filter(item => item.type === 'removed' && item.state === false).map(item => [item.key, item.value]);
                            const trueRemovedEntries = this.updateTranslationObj.filter(item => item.type === 'removed' && item.state === true).map(item => [item.key, item.value]);
                            const allEntries = [...unchangedEntries, ...modifiedEntries, ...addedEntries, ...falseRemovedEntries];
                            this.issueTranslationJson.dict = Object.fromEntries(allEntries);
                            this.issueTranslationJson.manifest.translationVersion = Date.now();

                            const translationPath = `translation/dict/${id}/${this.i18n.settings.I18N_LANGUAGE}/${this.issueTranslationJson.manifest.pluginVersion}.json`;
                            const translationSha = await this.i18n.api.giteeGetSha(translationPath);

                            if (!translationSha.state) { this.i18n.notice.result('合并', false, `无法获取译文文件\n${translationSha.data}`); return; }
                            const updateTranslationContent = Buffer.from(JSON.stringify(this.issueTranslationJson, null, 4)).toString('base64');

                            // 构建贡献名单路径和内容 
                            const contributorPath = `translation/contributor/${this.i18n.settings.I18N_LANGUAGE}.json`;
                            const contributorSha = await this.i18n.api.giteeGetSha(contributorPath);
                            if (!contributorSha.state) { this.i18n.notice.result('合并', false, `无法获取贡献者目录\n${contributorSha.data}`); return; }
                            const contributorContent = JSON.parse(Buffer.from(contributorSha.data.content, 'base64').toString('utf8'));
                            // 更新贡献名单
                            const contributorItem = contributorContent.find((obj: { login: string; }) => obj.login === this.i18n.issuesObj.user.login);
                            if (contributorItem) {
                                if (addedEntries.length > 0) contributorItem.translation += addedEntries.length;
                                if (modifiedEntries.length > 0) contributorItem.modification += modifiedEntries.length
                                if (trueRemovedEntries.length > 0) contributorItem.erasure += trueRemovedEntries.length
                            } else {
                                const newContributor = {
                                    "login": this.i18n.issuesObj.user.login,
                                    "name": this.i18n.issuesObj.user.name,
                                    "url": this.i18n.issuesObj.user.html_url,
                                    "translation": addedEntries.length,
                                    "modification": modifiedEntries.length,
                                    "erasure": trueRemovedEntries.length
                                };
                                contributorContent.push(newContributor);
                            }
                            const updatedContributorContent = Buffer.from(JSON.stringify(contributorContent, null, 4)).toString('base64');
                            // 开始执行API
                            const giteePutContributorRes = await this.i18n.api.giteePutContributor(contributorPath, updatedContributorContent, contributorSha.data.sha, `写入贡献 ${this.i18n.issuesObj.user.name}`);
                            if (!giteePutContributorRes.state) { this.i18n.notice.result('合并', false, `无法写入贡献\n${giteePutContributorRes.data}`); return; } else { this.i18n.notice.result('批准', true, `1/3 写入贡献 ${this.i18n.issuesObj.user.name}\n请耐心等待审核流程运行完毕`); }
                            await sleep(1000);
                            const giteePostTranslationRes = await this.i18n.api.giteePutTranslation(translationPath, updateTranslationContent, translationSha.data.sha, `更新译文 ${id}`);
                            if (!giteePostTranslationRes.state) { this.i18n.notice.result('合并', false, `无法写入译文\n请前往gitee删除写入贡献内容\n${giteePostTranslationRes.data}`); return; } else { this.i18n.notice.result('批准', true, `2/3 写入译文 ${id}\n请耐心等待审核流程运行完毕`); }
                            await sleep(1000);
                            const giteePatchIssueRes = await this.i18n.api.giteePatchIssue(this.i18n.issuesObj.number, 'closed');
                            if (!giteePatchIssueRes.state) { this.i18n.notice.result('合并', false, `无法关闭 issue\n请前往gitee手动关闭此issue\n${giteePatchIssueRes.data}`); return; } else { this.i18n.notice.result('批准', true, `3/3 关闭 issue`); }
                            this.i18n.notice.result('合并', true);
                            this.i18n.issuesList = this.i18n.issuesList.filter((item: { number: string; }) => item.number !== this.i18n.issuesObj.number);
                            this.i18n.admin.reloadShowData();
                        } catch (error) {
                            this.i18n.notice.result('合并', false, error);
                        }
                    });
            }
        }
    }

    async onunload() { this.i18n.notice.reload() }

    async showData() { }

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

    async onOpen() { }
    async onClose() { this.contentEl.empty(); }
    focus(): void { this.focus(); this.onClose(); }
    getViewType(): string { return ADMIN_VIEW_TYPE; }
    getDisplayText(): string { return '审核面板'; }
    getIcon(): string { return 'i18n_translate'; }
}



