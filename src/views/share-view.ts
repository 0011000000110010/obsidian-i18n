import * as fs from 'fs-extra';
import { ButtonComponent, ItemView, PluginManifest, SearchComponent, WorkspaceLeaf } from "obsidian";
import { OBThemeManifest, Theme, Plugin, TranslationDirectory } from "src/data/types";
import I18N from "src/main";

import { compareTheme, comparePlugin, deflate, diff, isPlugin, isTheme } from 'src/utils';
import { AgreementConfirmModal } from 'src/modal/i18n-contributor-confirm-modal';

export const SHARE_VIEW_TYPE = 'i18n-share-view'

export class ShareView extends ItemView {
    private i18n: I18N;
    // 共享文件路径
    private path: string;
    // 共享类型 0:插件 1:主题
    private type: number;
    // 提交类型 0:标记汉化 1:提交译文 2:更新译文
    private submissionType: number;

    private pluginObj: PluginManifest;
    private themeObj: OBThemeManifest;

    private localJson: Plugin | Theme;
    private cloudJson: Plugin | Theme;

    private directory: TranslationDirectory = [];

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.i18n.notice.reload();
        this.type = this.i18n.shareType;
        this.path = this.i18n.sharePath;
        this.type === 0 ? this.pluginObj = this.i18n.shareObj as PluginManifest : this.themeObj = this.i18n.shareObj as OBThemeManifest;
    }

    async onload() {
        const contentEl = this.contentEl;
        contentEl.addClass('i18n-review__container');
        contentEl.parentElement?.getElementsByClassName('view-header')[0].remove();

        if (this.path !== '') this.localJson = fs.readJsonSync(this.path);
        // 插件类型和提交类型获取提交类型名称
        if (this.type === 0 && isPlugin(this.localJson)) {
            // 从Gitee获取插件目录
            this.directory = (await this.i18n.api.giteeGetFile(`translation/directory/${this.i18n.settings.I18N_LANGUAGE}.json`)).data;
            // 检查目录中是否存在指定的插件
            const pluginInDirectory = this.directory.find(plugin => plugin.id === this.pluginObj.id);

            // 如果插件存在于目录中并且本地有插件JSON文件
            if (this.localJson && pluginInDirectory) {
                // 如果本地插件版本存在于目录的翻译中
                if (this.localJson.manifest.pluginVersion in pluginInDirectory.translations) {
                    this.submissionType = 2;
                    this.cloudJson = (await this.i18n.api.giteeGetTranslation('translation', this.pluginObj.id, this.localJson.manifest.pluginVersion)).data;
                } else {
                    this.submissionType = 1;
                    this.cloudJson = (await this.i18n.api.giteeGetTranslation('translation', this.pluginObj.id, Object.keys(pluginInDirectory.translations).slice(-1)[0])).data;
                }
            } else if (this.localJson) {
                this.submissionType = 1;
                const translation: Plugin = {
                    manifest: {
                        translationVersion: 0,
                        pluginVersion: this.localJson.manifest.pluginVersion
                    },
                    description: {
                        original: this.localJson.description.original,
                        translation: this.localJson.description.translation
                    },
                    dict: {
                    }
                };
                this.cloudJson = translation;
            }
        }
        // 主题类型和提交类型获取提交类型名称
        if (this.type === 1 && isTheme(this.localJson)) {
            // 从Gitee获取主题目录
            this.directory = (await this.i18n.api.giteeGetFile(`theme/directory/${this.i18n.settings.I18N_LANGUAGE}.json`)).data;
            // 检查目录中是否存在主题的插件 
            const themeInDirectory = this.directory.find(plugin => plugin.id === this.themeObj.name);
            if (themeInDirectory && this.localJson) {
                if (this.localJson.manifest.pluginVersion in themeInDirectory.translations) {
                    this.submissionType = 2;
                    this.cloudJson = (await this.i18n.api.giteeGetTranslation('theme', this.themeObj.name, this.localJson.manifest.pluginVersion)).data;
                } else {
                    this.submissionType = 1;
                    this.cloudJson = (await this.i18n.api.giteeGetTranslation('theme', this.themeObj.name, Object.keys(themeInDirectory.translations).slice(-1)[0])).data;
                }
            } else if (this.localJson) {
                this.submissionType = 1;
                const translation: Theme = {
                    manifest: {
                        translationVersion: 0,
                        pluginVersion: this.localJson.manifest.pluginVersion
                    },
                    dict: {
                    }
                };
                this.cloudJson = translation;
            }
        }

        if (this.localJson != undefined && this.cloudJson !== undefined) {
            const submissionTypeName = this.getSubmissionTypeName();
            // ==============================
            // 描述行
            // ==============================
            if (this.type === 0 && isPlugin(this.localJson) && isPlugin(this.cloudJson)) {
                // 提交信息DOM
                const aEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                aEl.createEl('span', { text: '提交类型', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: submissionTypeName, cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
                aEl.createEl('span', { text: '源代码', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.localJson.description.original, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                const bEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                bEl.createEl('span', { text: '插件标识', cls: 'i18n-edit__label-wrap' });
                bEl.createEl('input', { value: this.pluginObj.id, cls: 'i18n-edit__plugin-version-input' }).disabled = true;
                bEl.createEl('span', { text: '旧描述', cls: 'i18n-edit__label-wrap' });
                bEl.createEl('input', { value: this.cloudJson.description.translation, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                const cEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                cEl.createEl('span', { text: '插件版本', cls: 'i18n-edit__label-wrap' });
                cEl.createEl('input', { value: this.localJson.manifest.pluginVersion, cls: ['i18n-input', 'i18n-edit__plugin-version-input'] }).disabled = true;
                cEl.createEl('span', { text: '新描述', cls: 'i18n-edit__label-wrap' });
                cEl.createEl('input', { value: this.localJson.description.translation, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
            }
            if (this.type === 1 && isTheme(this.localJson) && isTheme(this.cloudJson)) {
                const aEl = contentEl.createEl('div', { cls: ['i18n-edit__manifest'] });
                aEl.createEl('span', { text: '提交类型', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: submissionTypeName, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                aEl.createEl('span', { text: '主题标识', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.themeObj.name, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
                aEl.createEl('span', { text: '主题版本', cls: 'i18n-edit__label-wrap' });
                aEl.createEl('input', { value: this.localJson.manifest.pluginVersion, cls: ['i18n-input', 'i18n-edit__description-input'] }).disabled = true;
            }

            // [判断] 两个译文的区别
            let compare;
            if (this.type === 0 && isPlugin(this.cloudJson) && isPlugin(this.localJson)) compare = comparePlugin(this.cloudJson, this.localJson);
            if (this.type === 1 && isTheme(this.cloudJson) && isTheme(this.localJson)) compare = compareTheme(this.cloudJson, this.localJson);

            // ==============================
            // 数据行
            // ==============================
            const dictEl = contentEl.createEl('div', { cls: ['i18n-edit__dict'] });
            if (compare) {
                const tableEl = dictEl.createEl('table', { cls: ['i18n-edit__table'] });
                // [数据] 修改
                for (const key in compare.modified) {
                    const res = diff(compare.modified[key].oldValue, compare.modified[key].newValue);
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns-added'] });
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).createEl('span', { text: '修改', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-warning`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = key;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s2;
                }
                // [数据] 新增
                for (const key in compare.added) {
                    const res = diff(key, compare.added[key])
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).createEl('span', { text: '新增', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-success`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s2;
                }
                // [数据] 删除
                for (const key in compare.removed) {
                    const res = diff(key, compare.removed[key])
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).createEl('span', { text: '删除', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-danger`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s2;
                }
                // [数据] 初始
                for (const key in compare.unchanged) {
                    const res = diff(key, compare.unchanged[key]);
                    const rowEl = tableEl.createEl('tr', { cls: ['i18n-review__row', 'i18n-review__row-columns'] });
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).createEl('span', { text: '初始', cls: ['i18n-tag', `i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-info`, `is-${this.i18n.settings.I18N_TAG_SHAPE}`] })
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s1;
                    rowEl.createEl('td', { cls: ['i18n-review__cell'] }).innerHTML = res.s2;
                }
            }

            // ==============================
            // 操作行
            // ==============================
            const searchEl = contentEl.createEl('div', { cls: ['i18n-edit__search'] });
            // [搜索] 留言内容
            const messageInput = new SearchComponent(searchEl).onChange((value) => {

            });
            // @ts-ignore
            messageInput.setClass('i18n-edit__search-box');
            messageInput.inputEl.addClass('i18n-input', 'i18n-edit__search-input')

            // [按钮] 检查
            // new ButtonComponent(searchEl).setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
            //     .setButtonText('检查').onClick(() => {
            //         this.i18n.notice.result('共建云端', false, '功能未开放');
            //     });
            // [按钮] 标记汉化
            // new ButtonComponent(searchEl).setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
            //     .setButtonText('标记汉化').onClick(async () => {
            //         // this.i18n.notice.result('共建云端', false, '功能未开放');
            //         // const res = await this.i18n.api.giteePostIssue(`[${this.type}0][${this.i18n.settings.I18N_LANGUAGE}][${this.type === 0 ? this.pluginObj.id : this.themeObj.name}]`, deflate(JSON.stringify(this.localJson)), '');
            //         // if (res?.state) {
            //         //     if (this.i18n.settings.I18N_ADMIN_VERIFY && this.i18n.settings.I18N_ADMIN_MODE) {
            //         //         this.i18n.issue = res.data;
            //         //         this.i18n.activateAdminView();
            //         //     } else {
            //         //         window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${res.data.number}`);
            //         //     }
            //         //     if (messageInput.getValue()) { await this.i18n.api.giteePostIssueComments(res.data.number, messageInput.getValue()); }
            //         // }
            //     });
            // [按钮] 提交
            new ButtonComponent(searchEl).setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`).setClass('i18n-button--left')
                .setButtonText(submissionTypeName).onClick(() => {
                    new AgreementConfirmModal(this.app, this.i18n, async (result) => {
                        if (result === '我已仔细检查译文') {
                            const issues = await this.i18n.api.giteeGetAllIssue();
                            let cz;
                            if (issues.state) {
                                cz = issues.data.some((issue: { title: string; }) => issue.title === `[${this.type}${this.submissionType}][${this.i18n.settings.I18N_LANGUAGE}][${this.type === 0 ? this.pluginObj.id : this.themeObj.name}]`);
                            }
                            if (!cz) {
                                const res = await this.i18n.api.giteePostIssue(`[${this.type}${this.submissionType}][${this.i18n.settings.I18N_LANGUAGE}][${this.type === 0 ? this.pluginObj.id : this.themeObj.name}]`, deflate(JSON.stringify(this.localJson)), '');
                                if (res?.state) {
                                    if (this.i18n.settings.I18N_ADMIN_VERIFY && this.i18n.settings.I18N_ADMIN_MODE) {
                                        this.i18n.issue = res.data;
                                        this.i18n.activateAdminView();
                                    } else {
                                        window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${res.data.number}`);
                                    }
                                    if (messageInput.getValue()) { await this.i18n.api.giteePostIssueComments(res.data.number, messageInput.getValue()); }
                                }
                                this.i18n.notice.result('共建云端', true);
                            } else {
                                this.i18n.notice.result('共建云端', false, '同一类型只能存在一个提交');
                            }
                        } else {
                            this.i18n.notice.result('共建云端', false, '请输入 "我已仔细检查译文"');
                        }
                    }).open()
                });
        } else {
            contentEl.createEl('h1', { text: 'Oh~抱歉，您的数据走丢了', cls: ['i18n-empty'] });
        }
    }

    async onunload() {
        this.contentEl.empty();
    }

    getViewType(): string { return SHARE_VIEW_TYPE; }
    getDisplayText(): string { return '共建云端'; }
    getIcon(): string { return 'i18n_translate'; }



    private getTypeName(): string {
        let typeDescription = '';
        switch (this.type) {
            case 0:
                typeDescription = 'plugin';
                break;
            case 1:
                typeDescription = 'theme';
                break;
            default:
                typeDescription = '未知类型';
                break;
        }
        return typeDescription;
    }

    private getSubmissionTypeName(): string {
        let submissionDescription = '';
        switch (this.submissionType) {
            case 0:
                submissionDescription = '标记汉化';
                break;
            case 1:
                submissionDescription = `提交${this.type === 0 ? '插件' : '主题'}`;
                break;
            case 2:
                submissionDescription = `更新${this.type === 0 ? '插件' : '主题'}`;
                break;
            default:
                submissionDescription = '未知提交类型';
                break;
        }
        return submissionDescription;
    }
}