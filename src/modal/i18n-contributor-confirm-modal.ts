import { App, Modal, Setting } from 'obsidian';
import I18N from 'main';

// ==============================
//          历史提交记录
// ==============================
export class AgreementConfirmModal extends Modal {
    i18n: I18N;
    name = '';
    onSubmit: any;
    constructor(app: App, i18n: I18N, onSubmit: (result: string) => void) {
        super(app);
        this.i18n = i18n;
        this.onSubmit = onSubmit;
    }

    public async showHead() {
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n-share-history__container');
        // 删除关闭按钮
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);
        this.titleEl.addClass('i18n-share-history__title-box');

        const titleSetting = new Setting(this.titleEl);
        titleSetting.setClass('i18n-share-history__title');
        titleSetting.setName('提交译文');
    }

    public async showMain() {
        new Setting(this.contentEl).setName('请输入').addText((text) => text.setValue('我已仔细检查译文').setDisabled(true));
        new Setting(this.contentEl).setName('请输入').addText((text) => text.onChange((value) => { this.name = value; }));
        const itemEl = new Setting(this.contentEl);
        itemEl.controlEl.createEl('button', { text: '确认', cls: ['i18n-button', `i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`, `is-${this.i18n.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
            el.addEventListener("click", () => {
                this.onSubmit(this.name);
                this.close();
            });
        });
        itemEl.controlEl.createEl('button', { text: '取消', cls: ['i18n-button', `i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`, `is-${this.i18n.settings.I18N_BUTTON_SHAPE}`] }, (el) => {
            el.addEventListener("click", () => {
                this.close();
            });
        });
    }

    async onOpen() {
        await this.showHead();
        await this.showMain();
    }

    async onClose() {
        this.contentEl.empty();
    }
}