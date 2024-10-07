import * as fs from 'fs-extra';
import { ButtonComponent, ItemView, Notice, SearchComponent, WorkspaceLeaf } from "obsidian";
import I18N from "src/main";
import { Translation } from 'src/data/types';
import { NoticeError, NoticeOperationResult, NoticeSuccess } from 'src/utils';
import { t } from 'src/lang/inxdex';

// @ts-ignore
import { diffWords, diffJson, diffLines } from 'diff';

export const EONTRASTV_VIEW_TYPE = 'i18n-contrast-view'

export class ContrastView extends ItemView {
    private i18n: I18N;
    private notices: Notice[] = [];

    constructor(leaf: WorkspaceLeaf, i18n: I18N) {
        super(leaf);
        this.i18n = i18n;
        this.contentEl.style.setProperty('--i18n-color-primary', this.i18n.settings.I18N_COLOR);
    }

    async onload() {
        let localTranslationJson: Translation | undefined;
        let cloudTranslationJson: Translation | undefined;
        if (this.i18n.selectLocalContrastTranslation != '') localTranslationJson = fs.readJsonSync(this.i18n.selectLocalContrastTranslation);
        if (this.i18n.selectCloudContrastTranslation.id != '') cloudTranslationJson = await this.i18n.api.translation(this.i18n.selectCloudContrastTranslation.id, this.i18n.selectCloudContrastTranslation.version)
        // 对比器 DOM
        const editEl = this.contentEl;
        editEl.addClass('i18n-contrast__container');
        // 云端译文 DOM
        const cloudTranslationEl = editEl.createEl('div');
        cloudTranslationEl.addClass('i18n-contrast__cloud-translation');
        // 本地译文 DOM
        const localTranslationEl = editEl.createEl('div');
        localTranslationEl.addClass('i18n-contrast__local-translation');
        // cloudTranslationEl.addEventListener('scroll', () => { localTranslationEl.scrollTop = cloudTranslationEl.scrollTop; });
        // localTranslationEl.addEventListener('scroll', () => { cloudTranslationEl.scrollTop = localTranslationEl.scrollTop; });

        if (localTranslationJson != undefined && cloudTranslationJson != undefined) {
            const localTranslationList = JSON.stringify(localTranslationJson, null, 4).split('\n');
            const cloudTranslationList = JSON.stringify(cloudTranslationJson, null, 4).split('\n');
            cloudTranslationList.forEach((line, index) => {
                const lineEl = cloudTranslationEl.createEl('pre');
                if (!localTranslationList.includes(line)) lineEl.addClass('i18n-contrast__highlight-a');
                lineEl.addClass('i18n-contrast__pre');

                lineEl.innerHTML = line;
            });
            localTranslationList.forEach((line, index) => {
                const lineEl = localTranslationEl.createEl('pre');
                if (!cloudTranslationList.includes(line)) lineEl.addClass('i18n-contrast__highlight-b');
                lineEl.addClass('i18n-contrast__pre');
                lineEl.innerHTML = line;
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
        return EONTRASTV_VIEW_TYPE;
    }
    // 用于返回一个更加人性化的视图名称
    getDisplayText(): string {
        return '译文对比';
    }
    // 用于返回一个更加人性化的视图图标
    getIcon(): string {
        return 'i18n_translate';
    }
}



