import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'main';
import Url from 'src/url';
import { t } from 'src/lang/inxdex';

// ==============================
//          首次运行向导
// ==============================
export class WizardModal extends Modal {
    i18n: I18N;
    frame: HTMLIFrameElement;
    img: HTMLImageElement;
    html: HTMLElement;
    title: HTMLParagraphElement;
    version: HTMLParagraphElement;
    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n
    }

    public async Main() {
        const { contentEl } = this;
        // @ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n-wizard__container');
        this.contentEl.addClass("i18n-wizard__box");

        this.img = this.contentEl.doc.createElement("img"); 
        this.img.addClass('i18n-wizard__img');
        this.img.src = Url.I18N_ICON;
        this.contentEl.appendChild(this.img);

        this.title = this.contentEl.doc.createElement("p");
        this.title.addClass('i18n-wizard__title');
        this.title.innerHTML = 'Obsidian-I18N';
        this.contentEl.appendChild(this.title);

        this.version = this.contentEl.doc.createElement("p");
        this.version.addClass('i18n-wizard__version');
        this.version.innerHTML = `版本 ${this.i18n.manifest.version}`;
        this.contentEl.appendChild(this.version);

        const videoTutorial = new Setting(contentEl);
        videoTutorial.setName(t('WIZARD_VIDEO_TUTORIAL_TITLE_NAME'));
        videoTutorial.setDesc(t('WIZARD_VIDEO_TUTORIAL_TITLE_DESC'));
        const videoTutorialButton = new ButtonComponent(videoTutorial.controlEl);
        videoTutorialButton.setButtonText(t('WIZARD_VIDEO_TUTORIAL_BUTTON_TEXT'));
        videoTutorialButton.setCta();
        videoTutorialButton.setTooltip('');
        videoTutorialButton.onClick(() => { window.open(Url.VIDEO_TUTORIAL) });


        const documentationTutorial = new Setting(contentEl);
        documentationTutorial.setName(t('WIZARD_DOCUMENTATION_TUTORIAL_TITLE_NAME'));
        documentationTutorial.setDesc(t('WIZARD_DOCUMENTATION_TUTORIAL_TITLE_DESC'));
        const documentationTutorialButton = new ButtonComponent(documentationTutorial.controlEl);
        documentationTutorialButton.setButtonText(t('WIZARD_DOCUMENTATION_TUTORIAL_BUTTON_TEXT'));
        documentationTutorialButton.setTooltip('');
        documentationTutorialButton.onClick(() => { window.open(Url.DOCUMENTATION_TUTORIAL) });

        const qq = new Setting(contentEl);
        qq.setName(t('WIZARD_QQ_TITLE_NAME'));
        qq.setDesc(t('WIZARD_QQ_TITLE_DESC'));
        const qqButton = new ButtonComponent(qq.controlEl);
        qqButton.setButtonText(t('WIZARD_QQ_TEXT'));
        qqButton.setTooltip('');
        qqButton.onClick(() => { window.open(Url.QQ_GROUP) });

    }

    async onOpen() { await this.Main() }
    async onClose() { this.contentEl.empty() }
}