import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'main';
import Url from 'src/url';

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
        this.contentEl.addClass("i18n_wizard_modal");

        this.img = this.contentEl.doc.createElement("img");
        this.img.addClass('i18n_wizard_modal_img');
        this.img.src = Url.I18N_ICON;
        this.contentEl.appendChild(this.img);

        this.title = this.contentEl.doc.createElement("p");
        this.title.addClass('i18n_wizard_modal_title');
        this.title.innerHTML = 'Obsidian-I18N';
        this.contentEl.appendChild(this.title);

        this.version = this.contentEl.doc.createElement("p");
        this.version.addClass('i18n_wizard_modal_version');
        this.version.innerHTML = `版本 ${this.i18n.manifest.version}`;
        this.contentEl.appendChild(this.version);

        const videoTutorial = new Setting(contentEl);
        videoTutorial.setName('官方视频教程');
        videoTutorial.setDesc('详尽演示Obsidian i18n操作，助力快速掌握');
        const videoTutorialButton = new ButtonComponent(videoTutorial.controlEl);
        videoTutorialButton.setButtonText('浏览');
        videoTutorialButton.setCta();
        videoTutorialButton.setTooltip('');
        videoTutorialButton.onClick(() => { window.open(Url.VIDEO_TUTORIAL) });

        const documentationTutorial = new Setting(contentEl);
        documentationTutorial.setName('官方文档教程');
        documentationTutorial.setDesc('Obsidian i18n的全面探索之旅指南');
        const documentationTutorialButton = new ButtonComponent(documentationTutorial.controlEl);
        documentationTutorialButton.setButtonText('浏览');
        documentationTutorialButton.setTooltip('');
        documentationTutorialButton.onClick(() => { window.open(Url.DOCUMENTATION_TUTORIAL) });

        const community = new Setting(contentEl);
        community.setName('官方Q群');
        community.setDesc('在官方群，您可发布需求、提交BUG、分享译文，并与其他用户就插件使用、翻译等话题交流互助。');
        const communityButton = new ButtonComponent(community.controlEl);
        communityButton.setButtonText('加入');
        communityButton.setTooltip('');
        communityButton.onClick(() => { window.open(Url.QQ_GROUP) });

    }

    async onOpen() { await this.Main() }
    async onClose() { this.contentEl.empty() }
}