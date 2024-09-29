import * as fs from 'fs-extra';
import { App, ButtonComponent, Modal, PluginManifest, Setting } from 'obsidian';
import { API } from 'src/api';
import { Manifest, SubmitMark, Translation } from 'src/data/types';
import { t } from 'src/lang/inxdex';
import I18N from 'src/main';
import { NoticeOperationResult, validateTranslation } from 'src/utils';

// ==============================
//          侧边栏 对话框 转译
// ==============================
export class I18NSubmiteModal extends Modal {
    i18n: I18N;
    api: API;
    plugin: PluginManifest;
    langDoc: string;
    constructor(app: App, i18n: I18N, plugin: PluginManifest, langDoc: string) {
        super(app);
        this.plugin = plugin;
        this.api = i18n.api;
        this.langDoc = langDoc;
        this.i18n = i18n;
    }

    public async Main() {
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n_git');
        // 删除关闭按钮
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);
        this.titleEl.addClass('i18n_git_title');
        // 请求网络译文
        const directory: Manifest[] = await this.api.directory();
        const isLangDoc = fs.pathExistsSync(this.langDoc);
        // 本地文件
        let localTranslationJson: Translation;
        // 网络目录是否存在这个插件
        let pluginMark;
        // 是否存在相同插件的译文版本
        let pluginVersionMark;
        // 是否存在相同译文的作者
        let translationAuthorMark;
        // 是否存在相同译文的译文版本
        let translationVersionMark;
        if (isLangDoc) {
            localTranslationJson = await fs.readJsonSync(this.langDoc);
            pluginMark = directory.find(plugin => plugin.id === localTranslationJson.manifest.id);
            if (pluginMark !== undefined) {
                translationAuthorMark = pluginMark.translations.find(translation =>
                    translation.author === localTranslationJson.manifest.author
                );
                pluginVersionMark = pluginMark.translations.find(translation =>
                    translation.pluginVersion === localTranslationJson.manifest.pluginVersion
                );
                translationVersionMark = pluginMark.translations.find(translation =>
                    translation.translationVersion === localTranslationJson.manifest.version
                );
            }
        }

        const title = new Setting(this.titleEl);
        title.setName(t('SUBMITE_TITLE_NAME'));
        title.setDesc(t('SUBMITE_TITLE_DESC'));
        title.setClass('i18n_git_item');

        // 本地行
        if (isLangDoc) {
            const localTranslation = new Setting(this.contentEl);
            localTranslation.setClass('i18n_git_item');
            localTranslation.setName(t('SUBMITE_LOCAL_TRANSLATION_NAME'));
            const localAuthor = new ButtonComponent(localTranslation.controlEl);
            // @ts-ignore
            localAuthor.setButtonText(`${t('SUBMITE_PUBLIC_AUTHOR')}[${localTranslationJson.manifest.author}]`);
            localAuthor.onClick(() => { });
            const localpluginVersion = new ButtonComponent(localTranslation.controlEl);
            // @ts-ignore
            localpluginVersion.setButtonText(`${t('SUBMITE_PUBLIC_PLUGIN_VERSION')}[${localTranslationJson.manifest.pluginVersion}]`);
            localpluginVersion.onClick(() => { });
            const localTranslationVersion = new ButtonComponent(localTranslation.controlEl);
            // @ts-ignore
            localTranslationVersion.setButtonText(`${t('SUBMITE_PUBLIC_TRANSLATION_VERSION')}[${localTranslationJson.manifest.version}]`);
            localTranslationVersion.onClick(() => { });
        }
        // 云端行
        if (isLangDoc && pluginMark !== undefined && pluginVersionMark !== undefined) {
            const cloudTranslation = new Setting(this.contentEl);
            cloudTranslation.setClass('i18n_git_item');
            cloudTranslation.setName(t('SUBMITE_CLOUD_TRANSLATION_NAME'));
            const cloudAuthor = new ButtonComponent(cloudTranslation.controlEl);
            cloudAuthor.setButtonText(`${t('SUBMITE_PUBLIC_AUTHOR')}[${pluginVersionMark.author}]`);
            cloudAuthor.onClick(() => { });
            const cloudpluginVersion = new ButtonComponent(cloudTranslation.controlEl);
            cloudpluginVersion.setButtonText(`${t('SUBMITE_PUBLIC_PLUGIN_VERSION')}[${pluginVersionMark.pluginVersion}]`);
            cloudpluginVersion.onClick(() => { });
            const cloudTranslationVersion = new ButtonComponent(cloudTranslation.controlEl);
            cloudTranslationVersion.setButtonText(`${t('SUBMITE_PUBLIC_TRANSLATION_VERSION')}[${pluginVersionMark.translationVersion}]`);
            cloudTranslationVersion.onClick(() => { });
        }
        // 操作行
        const operate = new Setting(this.contentEl);
        operate.setClass('i18n_git_item');
        const cancelButton = new ButtonComponent(operate.controlEl);
        cancelButton.setButtonText(t('SUBMITE_OPERATE_CANCEL_BUTTON_TEXT'));
        cancelButton.onClick(() => { this.close() });

        if (!isLangDoc) {
            const titleJson = {
                "id": this.plugin.id,
                "name": this.plugin.name,
                "version": this.plugin.version,
                "description": this.plugin.description,
                "author": this.plugin.author
            }
            const temp = directory.find(plugin => plugin.id === this.plugin.id);
            if ((temp === undefined) || (temp !== undefined && temp.translations.find(translation => translation.pluginVersion === this.plugin.version) === undefined)) {
                // 请求翻译
                const requestTranslationButton = new ButtonComponent(operate.controlEl);
                requestTranslationButton.setButtonText(t('SUBMITE_OPERATE_REQUEST_BUTTON_TEXT'));
                requestTranslationButton.setCta();
                requestTranslationButton.onClick(async () => {
                    try {

                        if (this.containsObject(this.i18n.settings.I18N_SUBMIT_LIST, { 'id': this.plugin.id, 'type': 1 })) {
                            const url = await this.api.submite(`[${t('SUBMITE_OPERATE_REQUEST_BUTTON_NOTICE_HEAD')}] ${this.plugin.id}`, JSON.stringify(titleJson));
                            if (url != null) window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${url}`);
                            NoticeOperationResult(t('SUBMITE_OPERATE_REQUEST_BUTTON_NOTICE_HEAD'), true);
                            this.i18n.settings.I18N_SUBMIT_LIST.push({ 'id': this.plugin.id, 'type': 1 });
                            this.i18n.saveSettings();
                            this.close();
                        } else {
                            NoticeOperationResult(t('SUBMITE_OPERATE_REQUEST_BUTTON_NOTICE_HEAD'), false, '您已经提交过了,请耐心等待审核');
                        }
                    } catch (error) {
                        NoticeOperationResult(t('SUBMITE_OPERATE_REQUEST_BUTTON_NOTICE_HEAD'), false, error);
                    }

                });
            }
            // 标记汉化
            const markTranslationButton = new ButtonComponent(operate.controlEl);
            markTranslationButton.setButtonText(t('SUBMITE_OPERATE_MARK_BUTTON_TEXT'));
            markTranslationButton.setCta();
            markTranslationButton.onClick(async () => {
                try {
                    if (this.containsObject(this.i18n.settings.I18N_SUBMIT_LIST, { 'id': this.plugin.id, 'type': 2 })) {
                        const url = await this.api.submite(`[${t('SUBMITE_OPERATE_MARK_BUTTON_NOTICE_HEAD')}] ${this.plugin.id}`, JSON.stringify(titleJson));
                        if (url != null) window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${url}`);
                        this.i18n.settings.I18N_SUBMIT_LIST.push({ 'id': this.plugin.id, 'type': 2 });
                        this.i18n.saveSettings();
                        this.close();
                        NoticeOperationResult(t('SUBMITE_OPERATE_MARK_BUTTON_NOTICE_HEAD'), true);
                    } else {
                        NoticeOperationResult(t('SUBMITE_OPERATE_MARK_BUTTON_NOTICE_HEAD'), false, '您已经提交过了,请耐心等待审核');
                    }
                } catch (error) {
                    NoticeOperationResult(t('SUBMITE_OPERATE_MARK_BUTTON_NOTICE_HEAD'), false, error);
                    console.log(error)
                }

            });
        }
        if (isLangDoc && pluginVersionMark !== undefined && (translationAuthorMark === undefined || translationVersionMark === undefined)) {
            // 更新译文
            const updateTranslationButton = new ButtonComponent(operate.controlEl);
            updateTranslationButton.setButtonText(t('SUBMITE_OPERATE_UPDATE_BUTTON_TEXT'));
            updateTranslationButton.setCta();
            updateTranslationButton.onClick(async () => {
                try {
                    if (this.containsObject(this.i18n.settings.I18N_SUBMIT_LIST, { 'id': this.plugin.id, 'type': 3 })) {
                        if (validateTranslation(localTranslationJson)) {
                            const url = await this.api.submite(`[${t('SUBMITE_OPERATE_UPDATE_BUTTON_NOTICE_HEAD')}] ${JSON.stringify(localTranslationJson.manifest)}`, JSON.stringify(localTranslationJson));
                            if (url != null) window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${url}`);
                            this.i18n.settings.I18N_SUBMIT_LIST.push({ 'id': this.plugin.id, 'type': 3 });
                            this.i18n.saveSettings();
                            this.close();
                            NoticeOperationResult(t('SUBMITE_OPERATE_UPDATE_BUTTON_NOTICE_HEAD'), true);
                        }
                    } else {
                        NoticeOperationResult(t('SUBMITE_OPERATE_UPDATE_BUTTON_NOTICE_HEAD'), false, '您已经提交过了,请耐心等待审核');
                    }
                } catch (error) {
                    NoticeOperationResult(t('SUBMITE_OPERATE_UPDATE_BUTTON_NOTICE_HEAD'), false, error);
                }
            });
        }
        if (isLangDoc && (pluginMark === undefined || pluginVersionMark === undefined)) {
            // 提交译文
            const submitTranslationButton = new ButtonComponent(operate.controlEl);
            submitTranslationButton.setButtonText(t('SUBMITE_OPERATE_SUBMITE_BUTTON_TEXT'));
            submitTranslationButton.setCta();
            submitTranslationButton.onClick(async () => {
                try {
                    if (this.containsObject(this.i18n.settings.I18N_SUBMIT_LIST, { 'id': this.plugin.id, 'type': 4 })) {
                        if (validateTranslation(localTranslationJson)) {
                            const url = await this.api.submite(`[${t('SUBMITE_OPERATE_SUBMITE_BUTTON_NOTICE_HEAD')}] ${JSON.stringify(localTranslationJson.manifest)}`, JSON.stringify(localTranslationJson));
                            if (url != null) window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${url}`);
                            this.i18n.settings.I18N_SUBMIT_LIST.push({ 'id': this.plugin.id, 'type': 4 });
                            this.i18n.saveSettings();
                            this.close();
                            NoticeOperationResult(t('SUBMITE_OPERATE_SUBMITE_BUTTON_NOTICE_HEAD'), true);
                        }
                    } else {
                        NoticeOperationResult(t('SUBMITE_OPERATE_UPDATE_BUTTON_NOTICE_HEAD'), false, '您已经提交过了,请耐心等待审核');
                    }
                } catch (error) {
                    NoticeOperationResult(t('SUBMITE_OPERATE_SUBMITE_BUTTON_NOTICE_HEAD'), false, error)
                }
            });
        }
    }
    containsObject(arr: SubmitMark[], obj: SubmitMark): boolean {
        for (const item of arr) if (item.id === obj.id && item.type === obj.type) return false;
        return true;
    }

    async onOpen() {
        await this.Main();
    }
    async onClose() {
        this.contentEl.empty();
    }
}