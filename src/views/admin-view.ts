import * as fs from 'fs-extra';
import * as path from 'path';
import { ButtonComponent, ItemView, SearchComponent, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Contributor, Plugin, Theme, TranslationDirectory } from 'src/data/types';
import { comparePlugin, compareTheme, diff, i18nOpen, inflate, isPlugin, isTheme, parseIssueTitle } from 'src/utils';

export const ADMIN_VIEW_TYPE = 'i18n-admin-view'

export class AdminView extends ItemView {
    private i18n: I18N;
    private id: string;
    private language: string;
    private type: string;
    private submissionType: string;

    issueJson: Plugin | Theme;
    cloudJson: Plugin | Theme;
    private updateTranslationObj: { type: string, key: string, value: string, el: HTMLTableRowElement, state: boolean }[] = [];

    private errorView = false;

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.i18n.notice.reload();
        if (this.i18n.issue) {
            this.issueJson = JSON.parse(inflate(this.i18n.issue.body)); // 这里可能报错
            const [submissionType, language, id] = parseIssueTitle(this.i18n.issue.title);
            this.id = id;
            this.language = language;
            this.type = submissionType[0];
            this.submissionType = submissionType[1];
        } else {
            this.errorView = true;
        }
    }

    async onload() {
        const contentEl = this.contentEl;
        contentEl.addClass('i18n-review__container');
        contentEl.parentElement?.getElementsByClassName('view-header')[0].remove();
        if (!this.errorView) {
            if (this.type === '0' && isPlugin(this.issueJson)) {
                if (this.submissionType === '0') {
                    // 标记汉化
                } else if (this.submissionType === '1') {
                    // 提交译文
                    const directory = (await this.i18n.api.giteeGetDirectoryAdmin('translation', this.language)).data;
                    const pluginInDirectory = directory.find((plugin: { id: string; }) => plugin.id === this.id);
                    if (pluginInDirectory) {
                        if (this.i18n.settings.I18N_NDT_URL === 'gitee') {
                            this.cloudJson = (await this.i18n.api.giteeGetTranslation('translation', this.id, Object.keys(pluginInDirectory.translations).slice(-1)[0])).data as Plugin;
                        } else if (this.i18n.settings.I18N_NDT_URL === 'github') {
                            this.cloudJson = (await this.i18n.api.githubGetTranslation('translation', this.id, Object.keys(pluginInDirectory.translations).slice(-1)[0])).data as Plugin;
                        }
                        // this.cloudJson = (await this.i18n.api.giteeGetTranslation('translation', this.id, Object.keys(pluginInDirectory.translations).slice(-1)[0])).data as Plugin;
                    } else {
                        const translation: Plugin = {
                            manifest: {
                                translationVersion: 0,
                                pluginVersion: this.issueJson.manifest.pluginVersion
                            },
                            description: {
                                original: this.issueJson.description.original,
                                translation: this.issueJson.description.translation
                            },
                            dict: {
                            }
                        };
                        this.cloudJson = translation;
                    }
                } else if (this.submissionType === '2') {
                    // 更新译文
                    this.cloudJson = (await this.i18n.api.giteeGetTranslation('translation', this.id, this.issueJson.manifest.pluginVersion)).data as Plugin;
                } else {
                    // 未知标记
                }
            }
            if (this.type === '1' && isTheme(this.issueJson)) {
                if (this.submissionType === '0') {
                    // 标记汉化
                } else if (this.submissionType === '1') {
                    // 提交译文
                    const directory = (await this.i18n.api.giteeGetDirectoryAdmin('theme', this.language)).data;
                    const pluginInDirectory = directory.find((plugin: { id: string; }) => plugin.id === this.id);
                    if (pluginInDirectory) {
                        if (this.i18n.settings.I18N_NDT_URL === 'gitee') {
                            this.cloudJson = (await this.i18n.api.giteeGetTranslation('theme', this.id, Object.keys(pluginInDirectory.translations).slice(-1)[0])).data;
                        } else if (this.i18n.settings.I18N_NDT_URL === 'github') {
                            this.cloudJson = (await this.i18n.api.githubGetTranslation('theme', this.id, Object.keys(pluginInDirectory.translations).slice(-1)[0])).data;
                        }
                        // this.cloudJson = (await this.i18n.api.giteeGetTranslation('theme', this.id, Object.keys(pluginInDirectory.translations).slice(-1)[0])).data;
                    } else {
                        const translation: Theme = {
                            manifest: {
                                translationVersion: 0,
                                pluginVersion: this.issueJson.manifest.pluginVersion
                            },
                            dict: {
                            }
                        };
                        this.cloudJson = translation;
                    }
                } else if (this.submissionType === '2') {
                    // 更新译文
                    this.cloudJson = (await this.i18n.api.giteeGetTranslation('theme', this.id, this.issueJson.manifest.pluginVersion)).data;
                } else {
                    // 未知标记
                }
            }
            let compare;
            if (this.type === '0' && isPlugin(this.issueJson) && isPlugin(this.cloudJson)) compare = comparePlugin(this.cloudJson, this.issueJson);
            if (this.type === '1' && isTheme(this.issueJson) && isTheme(this.cloudJson)) compare = compareTheme(this.cloudJson, this.issueJson);
            // ==============================
            // 描述行
            // ==============================
            if (this.type === '0' && isPlugin(this.issueJson) && isPlugin(this.cloudJson)) {
                const aEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                aEl.createEl('span', { text: '译文作者', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.i18n.issue.user.name, cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
                aEl.createEl('span', { text: '源代码', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.issueJson.description.original, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                const bEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                bEl.createEl('span', { text: '插件标识', cls: 'i18n-edit__label-wrap' });
                bEl.createEl('input', { value: this.id, cls: 'i18n-edit__plugin-version-input' }).disabled = true;
                bEl.createEl('span', { text: '旧描述', cls: 'i18n-edit__label-wrap' });
                bEl.createEl('input', { value: this.cloudJson.description.translation, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                const cEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                cEl.createEl('span', { text: '插件版本', cls: 'i18n-edit__label-wrap' });
                cEl.createEl('input', { value: this.issueJson.manifest.pluginVersion, cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
                cEl.createEl('span', { text: '新描述', cls: 'i18n-edit__label-wrap' });
                cEl.createEl('input', { value: this.issueJson.description.translation, cls: ['i18n-input', 'i18n-edit__description-input'] }, (el) => {
                    // @ts-ignore
                    el.addEventListener("input", () => { this.issueJson.description.translation = el.value })
                });
            }
            if (this.type === '1' && isTheme(this.issueJson) && isTheme(this.cloudJson)) {
                const aEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                aEl.createEl('span', { text: '译文作者', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.i18n.issue.user.name, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                aEl.createEl('span', { text: '主题标识', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.id, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                aEl.createEl('span', { text: '主题版本', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.issueJson.manifest.pluginVersion, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
            }

            // ==============================
            // 数据行
            // ==============================
            const dictEl = contentEl.createEl('div', { cls: ['i18n-edit__dict'] });
            if (compare && this.issueJson != undefined && this.cloudJson !== undefined) {
                const tableEl = dictEl.createEl('table', { cls: ['i18n-edit__table'] });
                // 改
                for (const key in compare.modified) {
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns-added'] });
                    const dictItem = { type: 'modified', key: key, value: compare.modified[key].newValue, el: rowEl, state: true }
                    this.updateTranslationObj.push(dictItem);
                    const res = diff(dictItem.key, dictItem.value);
                    const labelEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    labelEl.createEl('span', { text: '修改', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-warning`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    const keyCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'] });
                    keyCellEl.innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = compare.modified[key].oldValue;
                    const newValueCellEl = rowEl.createEl('td', { cls: ['i18n-review__cell'], attr: { 'contenteditable': 'true' } });
                    newValueCellEl.innerHTML = res.s2;
                    newValueCellEl.addEventListener('input', () => {
                        if (newValueCellEl.textContent) dictItem.value = newValueCellEl.textContent;
                        const res = diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                    });
                    newValueCellEl.addEventListener('blur', () => {
                        const res = diff(dictItem.key, dictItem.value)
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
                        const res = diff(dictItem.key, dictItem.value)
                        keyCellEl.innerHTML = res.s1;
                    });
                    valueCellEl.addEventListener('blur', () => {
                        const res = diff(dictItem.key, dictItem.value)
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
                    const res = diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = res.s1;
                    valueCellEl.innerHTML = res.s2;
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
                    const res = diff(dictItem.key, dictItem.value)
                    keyCellEl.innerHTML = res.s1;
                    valueCellEl.innerHTML = res.s2;
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
                    const res = diff(dictItem.key, dictItem.value);
                    keyCellEl.innerHTML = res.s1;
                    valueCellEl.innerHTML = res.s2;
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
            // [搜索] 大小写切换
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
            // [搜索] 向上
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
            // [搜索] 向下
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
            // [搜索] 数量
            const searchCountButton = new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText('0/0');
            // [功能] 下载
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText('测试').onClick(async () => {
                    const unchangedEntries = this.updateTranslationObj.filter(item => item.type === 'unchanged' && item.state === true).map(item => [item.key, item.value]);
                    const modifiedEntries = this.updateTranslationObj.filter(item => item.type === 'modified' && item.state === true).map(item => [item.key, item.value]);
                    const addedEntries = this.updateTranslationObj.filter(item => item.type === 'added' && item.state === true).map(item => [item.key, item.value]);
                    const falseRemovedEntries = this.updateTranslationObj.filter(item => item.type === 'removed' && item.state === false).map(item => [item.key, item.value]);
                    const allEntries = [...unchangedEntries, ...modifiedEntries, ...addedEntries, ...falseRemovedEntries];
                    this.issueJson.dict = Object.fromEntries(allEntries);

                    // @ts-ignore
                    const dir = path.join(path.normalize(this.app.vault.adapter.getBasePath()), '.obsidian', (this.type === '0' ? 'plugins' : 'themes'), this.id);
                    if (fs.pathExistsSync(dir)) {
                        fs.ensureDirSync(path.join(dir, 'lang'));
                        fs.writeJSONSync(path.join(dir, 'lang', `${this.language}.test.json`), this.issueJson, { spaces: 4 });
                        i18nOpen(this.i18n, path.join(dir, 'lang'));
                        this.i18n.notice.result('审核', true, `下载成功`);
                    } else {
                        this.i18n.notice.result('审核', false, `请确保 ${this.type === '0' ? '插件' : '主题'} [${this.id}] 已经安装`);
                    }
                });
            // [功能] 关闭
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-danger`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText('关闭').onClick(async () => {
                    this.closeIssue();
                });
            // [功能] 合并
            new ButtonComponent(searchEl)
                .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText('合并').onClick(async () => {
                    this.merge();
                });
        } else {
            contentEl.createEl('h1', { text: 'Oh~抱歉，您的数据走丢了', cls: ['i18n-empty'] });
        }
    }

    async onunload() {
        this.i18n.notice.reload();
        this.contentEl.empty();
    }

    /**
     * 关闭指定的 Issue。
     * 使用 giteePatchIssue 方法向 Gitee API 发起 PATCH 请求，将 Issue 的状态更改为 'closed'。
     * 如果请求成功，从 issues 列表中移除已关闭的 Issue 并刷新显示数据。
     * 如果请求失败，则显示错误信息。
     * @private
     * @async
     */
    private async closeIssue() {
        const res = await this.i18n.api.giteePatchIssue(this.i18n.issue.number, 'closed');
        if (res.state) {
            this.i18n.notice.result('审核', true);
            this.i18n.issues = this.i18n.issues.filter((item: { number: string; }) => item.number !== this.i18n.issue.number);
            this.i18n.admin.reloadShowData();
        } else {
            this.i18n.notice.result('审核', false, res.data);
        }
    }

    /**
     * 合并翻译更新，并与 Gitee 仓库进行交互。
     * 这个函数处理不同类型的翻译条目（修改、未修改、新增、假删除和真删除），
     * 更新本地的翻译 JSON 对象，并将更新推送到 Gitee。
     */
    private async merge() {
        const modifiedEntries = this.updateTranslationObj.filter(item => item.type === 'modified' && item.state === true).map(item => [item.key, item.value]);
        const unchangedEntries = this.updateTranslationObj.filter(item => item.type === 'unchanged' && item.state === true).map(item => [item.key, item.value]);
        const addedEntries = this.updateTranslationObj.filter(item => item.type === 'added' && item.state === true).map(item => [item.key, item.value]);
        const falseRemovedEntries = this.updateTranslationObj.filter(item => item.type === 'removed' && item.state === false).map(item => [item.key, item.value]);
        const trueRemovedEntries = this.updateTranslationObj.filter(item => item.type === 'removed' && item.state === true).map(item => [item.key, item.value]);
        const allEntries = [...unchangedEntries, ...modifiedEntries, ...addedEntries, ...falseRemovedEntries];
        this.issueJson.manifest.translationVersion = Date.now();
        this.issueJson.dict = Object.fromEntries(allEntries);

        const id = this.type === '0' ? 'translation' : 'theme';

        const directoryFile = await this.getContents(`${id}/directory/${this.language}.json`);
        if (!directoryFile.state) { this.i18n.notice.result('Gitee', false, '获取文件失败'); return; }
        const a = await this.i18n.api.giteeUpdateFileContent(`${id}/directory/${this.language}.json`, this.updateDirectory(directoryFile.count), directoryFile.sha, `#${this.i18n.issue.number} - 第1步: 写入目录`);
        if (!a.state) { this.i18n.notice.result('审核', false, `无法写入目录\n${a.data}\n请前往gitee手动还原后重试`); return; } else { this.i18n.notice.result('审核', true, `第1步: 写入目录\n请耐心等待审核流程运行完毕`); }
        await sleep(1000);

        const contributorFile = await this.getContents(`translation/contributor/${this.language}.json`);
        if (!contributorFile.state) { this.i18n.notice.result('Gitee', false, '获取文件失败'); return; }
        const b = await this.i18n.api.giteeUpdateFileContent(`translation/contributor/${this.language}.json`, this.updateContributor(contributorFile.count, modifiedEntries, addedEntries, trueRemovedEntries), contributorFile.sha, `#${this.i18n.issue.number} - 第2步: 写入贡献`);
        if (!b.state) { this.i18n.notice.result('审核', false, `无法写入贡献\n${b.data}\n请前往gitee手动还原后重试`); return; } else { this.i18n.notice.result('审核', true, `第2步: 写入目录\n请耐心等待审核流程运行完毕`); }
        await sleep(1000);

        if (this.submissionType === '1') {
            // 创建译文
            const c = await this.i18n.api.giteeCreateFileContent(`${id}/dict/${this.id}/${this.language}/${this.issueJson.manifest.pluginVersion}.json`, Buffer.from(JSON.stringify(this.issueJson, null, 4)).toString('base64'), `#${this.i18n.issue.number} - 第3步: 写入译文`);
            if (!c.state) { this.i18n.notice.result('审核', false, `无法写入译文\n${c.data}\n请前往gitee手动还原后重试`); return; } else { this.i18n.notice.result('审核', true, `第3步: 写入译文\n请耐心等待审核流程运行完毕`); }
        } else if (this.submissionType === '2') {
            const langFile = await this.getContents(`${id}/dict/${this.id}/${this.language}/${this.issueJson.manifest.pluginVersion}.json`);
            if (!langFile.state) { this.i18n.notice.result('Gitee', false, '获取文件失败'); return; }
            // 更新译文
            const c = await this.i18n.api.giteeUpdateFileContent(`${id}/dict/${this.id}/${this.language}/${this.issueJson.manifest.pluginVersion}.json`, Buffer.from(JSON.stringify(this.issueJson, null, 4)).toString('base64'), langFile.sha, `#${this.i18n.issue.number} - 第3步: 写入译文`);
            if (!c.state) { this.i18n.notice.result('审核', false, `无法写入译文\n${c.data}\n请前往gitee手动还原后重试`); return; } else { this.i18n.notice.result('审核', true, `第3步: 写入译文\n请耐心等待审核流程运行完毕`); }
        }
        await sleep(1000);

        const res = await this.i18n.api.giteePatchIssue(this.i18n.issue.number, 'closed');
        if (res.state) {
            this.i18n.notice.result('审核', true, `第4步: 关闭Issue`);
            this.i18n.issues = this.i18n.issues.filter((item: { number: string; }) => item.number !== this.i18n.issue.number);
            this.i18n.admin.reloadShowData();
        } else {
            this.i18n.notice.result('审核', false, `无法关闭Issue${res.data}\n请前往gitee手动关闭`);
        }
    }

    /**
     * 获取指定路径下的文件内容。
     * @param path 文件在Gitee仓库中的相对路径。
     * @returns 一个对象，包含文件的状态（是否存在）、文件内容的JSON解析数组以及文件的SHA值。
     */
    private async getContents(path: string) {
        const res = await this.i18n.api.giteeGetContents(path);
        const start = res.state;
        let sha = '';
        let count = [];
        if (start) {
            sha = res.data.sha;
            count = JSON.parse(Buffer.from(res.data.content, res.data.encoding).toString('utf8'));
        }
        return { state: start, count: count, sha: sha };
    }

    /**
     * 更新总目录
     * @param count - 总目录数据
     * @returns Base64编码的JSON字符串，表示更新后的总目录数据
     */
    private updateDirectory(count: TranslationDirectory) {
        // 查找现有项
        const existingItem = count.find(obj => obj.id === this.id);
        const translations = { ...(existingItem?.translations || {}), [this.issueJson.manifest.pluginVersion]: this.issueJson.manifest.translationVersion };
        if (!existingItem) {
            count.push({ id: this.id, translations });
        } else {
            existingItem.translations = translations;
        }
        return Buffer.from(JSON.stringify(count, null, 4)).toString('base64');
    }

    /**
     * 更新贡献者目录数据
     * @param count - 贡献者目录数据数组
     * @returns Base64 编码的 JSON 字符串，表示更新后的贡献者目录数据
     */
    private updateContributor(count: Contributor[], modifiedEntries: string[][], addedEntries: string[][], removedEntries: string[][]) {
        const contributorItem = count.find((obj: { login: string; }) => obj.login === this.i18n.issue.user.login);
        if (contributorItem) {
            contributorItem.translation += addedEntries.length;
            contributorItem.modification += modifiedEntries.length;
            contributorItem.erasure += removedEntries.length;
        } else {
            const newContributor = {
                "login": this.i18n.issue.user.login,
                "name": this.i18n.issue.user.name,
                "url": this.i18n.issue.user.html_url,
                "translation": addedEntries.length,
                "modification": modifiedEntries.length,
                "erasure": removedEntries.length
            };
            count.push(newContributor);
        }
        return Buffer.from(JSON.stringify(count, null, 4)).toString('base64');
    }

    getViewType(): string { return ADMIN_VIEW_TYPE; }
    getDisplayText(): string { return '审核面板'; }
    getIcon(): string { return 'i18n_translate'; }
}



