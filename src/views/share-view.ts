import * as fs from 'fs-extra';
import { ItemView, Notice, PluginManifest, WorkspaceLeaf } from "obsidian";
import { Translation, TranslationDirectory, TranslationDirectoryItem } from "src/data/types";
import I18N from "src/main";

// @ts-ignore
import { diffWords } from 'diff';
import { deflate, formatTimestamp_concise } from 'src/utils';
import { AgreementConfirmModal } from 'src/modal/i18n-contributor-confirm-modal';

export const SHARE_VIEW_TYPE = 'i18n-share-view'

export class ShareView extends ItemView {
    private i18n: I18N;
    private notices: Notice[] = [];
    private PluginObj: PluginManifest;
    private translationDoc: string;
    private localTranslationJson: Translation | undefined = undefined;
    private cloudTranslationJson: TranslationDirectoryItem | undefined;
    // 已翻译行数
    private count = 0
    // 是否通过验证
    private verify = true;
    // 是否为更新提交
    private updateMark = false;

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.i18n.notice.reload();
        // this.contentEl.style.setProperty('--i18n-color-primary', this.i18n.settings.I18N_COLOR);
        this.PluginObj = this.i18n.sharePluginObj;
        this.translationDoc = this.i18n.shareTranslationDoc;
    }

    async onload() {
        if (this.translationDoc != '') {
            this.localTranslationJson = fs.readJsonSync(this.translationDoc);
            const directory: TranslationDirectory = (await this.i18n.api.giteeGetDirectory()).data;
            this.cloudTranslationJson = directory.find(plugin => plugin.id === this.PluginObj.id);
            if (this.cloudTranslationJson && this.localTranslationJson && this.localTranslationJson.manifest.pluginVersion in this.cloudTranslationJson.translations) this.updateMark = true;
        }
        // 提交译文
        if (this.localTranslationJson && !this.updateMark) {
            const editEl = this.contentEl;
            editEl.addClass('i18n-share__container');
            editEl.parentElement?.getElementsByClassName('view-header')[0].remove();
            // ==============================
            // headeEl
            // ==============================
            const manifestEl_1 = editEl.createEl('div');
            manifestEl_1.addClass('i18n-edit__manifest');
            manifestEl_1.createEl('span', { text: '译文版本', cls: 'i18n-edit__label-wrap' })
            manifestEl_1.createEl('input', { value: formatTimestamp_concise(this.localTranslationJson.manifest.translationVersion), cls: ['i18n-edit__plugin-version-input'] }).disabled = true
            manifestEl_1.createEl('span', { text: '旧描述', cls: 'i18n-edit__label-wrap' })
            manifestEl_1.createEl('input', { value: this.localTranslationJson.description.original, cls: ['i18n-edit__description-input'] }).disabled = true;

            const manifestEl = editEl.createEl('div', { cls: 'i18n-share__manifest' });
            manifestEl.createEl('span', { text: '插件版本', cls: 'i18n-edit__label-wrap' })
            manifestEl.createEl('input', { value: this.localTranslationJson.manifest.pluginVersion, cls: ['i18n-edit__plugin-version-input'] }).disabled = true;
            manifestEl.createEl('span', { text: '新描述', cls: 'i18n-share__label-wrap' })
            manifestEl.createEl('input', { value: this.localTranslationJson.description.translation, cls: ['i18n-edit__description-input'] }).disabled = true;
            manifestEl.createEl('button', { text: '提交译文', cls: ['i18n-button', `i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`, `is-${this.i18n.settings.I18N_BUTTON_SHAPE}`, 'i18n-button--left'] }, async (el) => {
                el.addEventListener("click", async () => {
                    new AgreementConfirmModal(this.app, this.i18n, async (result) => {
                        if (result === '我已仔细检查译文') {
                            if (this.verify) {
                                const res = await this.i18n.api.giteePostIssue(`[提交译文] ${this.PluginObj.id}`, deflate(JSON.stringify(this.localTranslationJson)), '提交译文');
                                if (res?.state) window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${res.data.number}`);
                                this.i18n.notice.result('提交译文', true);
                            } else {
                                this.i18n.notice.result('提交译文', false, '请检查后重试');
                            }
                        } else {
                            this.i18n.notice.result('更新译文', false, '请输入 "我已仔细检查译文"');
                        }
                    }).open()
                });
            })

            const untranslatedList = [];
            // ==============================
            // dictEl
            // ==============================
            const dictEl = editEl.createEl('div');
            dictEl.addClass('i18n-share__dict');
            const tableEl = dictEl.createEl('table');
            tableEl.addClass('i18n-share__table');
            for (const key in this.localTranslationJson.dict) {
                if (this.localTranslationJson.dict.hasOwnProperty(key)) {
                    if (key === this.localTranslationJson.dict[key]) untranslatedList.push(this.count);
                    const rowEl = tableEl.createEl('tr', { cls: 'i18n-share__table-row' });
                    rowEl.createEl('td', { text: this.count.toString(), cls: 'i18n-share__table-count' });
                    this.count += 1;
                    const keyCellEl = rowEl.createEl('td', { cls: 'i18n-share__table-key' });
                    const valueCellEl = rowEl.createEl('td', { cls: 'i18n-share__table-value' });
                    const differences = diffWords(key, this.localTranslationJson.dict[key]);
                    let keyHighlightedHTML = "";
                    let valueHighlightedHTML = "";
                    differences.forEach((part: { added: unknown; removed: unknown; value: unknown; }) => { if (part.added) { valueHighlightedHTML += `<span class='color__text--success'>${part.value}</span>` } else if (part.removed) { keyHighlightedHTML += `<span class='color__text--danger'>${part.value}</span>` } else { keyHighlightedHTML += part.value; valueHighlightedHTML += part.value; } });
                    keyCellEl.innerHTML = keyHighlightedHTML;
                    valueCellEl.innerHTML = valueHighlightedHTML;
                }
            }
            // ==============================
            // dictEl
            // ==============================
            if (this.localTranslationJson.description.original === this.localTranslationJson.description.translation) { editEl.createEl('div', { text: `[提示] 描述未翻译`, cls: 'i18n-share__tip-warning' }); }
            if (untranslatedList.length > 0) editEl.createEl('div', { text: `[提示] ${untranslatedList.join(',')} 行未翻译`, cls: 'i18n-share__tip-warning' });
            if (!this.localTranslationJson) { editEl.createEl('div', { text: `[提示] JSON格式有误，请检查后重试`, cls: 'i18n-share__tip-danger' }); this.verify = false }
            if ((untranslatedList.length * 2) >= Object.keys(this.localTranslationJson.dict).length) { editEl.createEl('div', { text: '[提示] 译文内容未超过50%', cls: 'i18n-share__tip-danger' }); this.verify = false }
        }
        // 更新译文
        if (this.localTranslationJson && this.updateMark) {
            // 从云端获取译文
            const tempCloudTranslationJson = await this.i18n.api.giteeGetTranslation(this.PluginObj.id, this.localTranslationJson.manifest.pluginVersion);
            // 主容器
            const editEl = this.contentEl;
            editEl.addClass('i18n-share-update__container');
            editEl.parentElement?.getElementsByClassName('view-header')[0].remove();
            // 操作行 El
            const operateEl = editEl.createEl('div', { cls: 'i18n-share-update__operate' });
            operateEl.createEl('button', { text: '更新译文', cls: ['i18n-button', `i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-success`, `is-${this.i18n.settings.I18N_BUTTON_SHAPE}`, 'i18n-button--left'] }, async (el) => {
                el.addEventListener("click", async () => {
                    new AgreementConfirmModal(this.app, this.i18n, async (result) => {
                        if (result === '我已仔细检查译文') {
                            if (this.verify) {
                                const res = await this.i18n.api.giteePostIssue(`[更新译文] ${this.PluginObj.id}`, deflate(JSON.stringify(this.localTranslationJson, null, 4)), '更新译文');
                                if (res?.state) window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${res.data.number}`);
                                this.i18n.notice.result('更新译文', true);
                            } else {
                                this.i18n.notice.result('更新译文', false, '请检查后重试');
                            }
                        } else {
                            this.i18n.notice.result('更新译文', false, '请输入 "我已仔细检查译文"');
                        }
                    }).open()
                });
            })
            // 对比器 El
            const contrastEl = editEl.createEl('div');
            contrastEl.addClass('i18n-share-update__contrast');
            // 云端译文 El
            const cloudTranslationEl = contrastEl.createEl('div');
            cloudTranslationEl.addClass('i18n-share-update__cloud-translation');
            // 本地译文 El
            const localTranslationEl = contrastEl.createEl('div');
            localTranslationEl.addClass('i18n-share-update__local-translation');
            cloudTranslationEl.addEventListener('scroll', () => { localTranslationEl.scrollTop = cloudTranslationEl.scrollTop; });
            localTranslationEl.addEventListener('scroll', () => { cloudTranslationEl.scrollTop = localTranslationEl.scrollTop; });

            if (this.localTranslationJson != undefined && tempCloudTranslationJson != undefined) {
                const localTranslationList = JSON.stringify(this.localTranslationJson, null, 4).split('\n');
                const cloudTranslationList = JSON.stringify(tempCloudTranslationJson.data, null, 4).split('\n');
                cloudTranslationList.forEach((line, index) => {
                    const lineEl = cloudTranslationEl.createEl('pre');
                    if (!localTranslationList.includes(line)) lineEl.addClass('i18n-share-update__highlight-a');
                    lineEl.addClass('i18n-share-update__pre');
                    lineEl.innerHTML = line;
                });
                localTranslationList.forEach((line, index) => {
                    const lineEl = localTranslationEl.createEl('pre');
                    if (!cloudTranslationList.includes(line)) lineEl.addClass('i18n-share-update__highlight-b');
                    lineEl.addClass('i18n-share-update__pre');
                    lineEl.innerHTML = line;
                });
            }
            // ==============================
            // dictEl
            // ============================== 
            if (JSON.stringify(this.localTranslationJson) === JSON.stringify(tempCloudTranslationJson.data)) { editEl.createEl('div', { text: `[提示] 内容同云端一致`, cls: 'i18n-share__tip-danger' }); this.verify = false }
            // if (this.localTranslationJson.manifest.translationVersion <= tempCloudTranslationJson.data.manifest.translationVersion) { editEl.createEl('div', { text: `[提示] 更新时间小于云端`, cls: 'i18n-share__tip-danger' }); this.verify = false }
        }
    }

    async onunload() {
        for (const notice of this.notices) { notice.noticeEl.remove(); }
    }
    async onOpen() { }
    async onClose() { this.contentEl.empty(); }
    focus(): void { this.focus(); this.onClose(); }
    getViewType(): string { return SHARE_VIEW_TYPE; }
    getDisplayText(): string { return '共建云端'; }
    getIcon(): string { return 'i18n_translate'; }
}