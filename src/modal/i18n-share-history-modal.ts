import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'main';

// ==============================
//          历史提交记录
// ==============================
export class ShareHistoryModal extends Modal {
    i18n: I18N;
    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n
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
        titleSetting.setName('云端提交记录(保存一天)');

        const exitButton = new ButtonComponent(titleSetting.controlEl);
        exitButton.setButtonText('退出');
        // exitButton.setWarning();
        exitButton.onClick(() => { this.close() });
    }

    public async showMain() {
        for (const { name, type, number } of this.i18n.settings.I18N_SHARE_HISTORY) {
            const itemEl = new Setting(this.contentEl);
            itemEl.setClass('i18n__item');
            itemEl.nameEl.addClass('i18n__item-title');
            let label: { color: string; text: string; } = { color: '', text: '' };
            switch (type) {
                case 0:
                    label = { color: 'blue', text: '标记汉化' };
                    break;
                case 1:
                    label = { color: 'red', text: '请求翻译' };
                    break;
                case 2:
                    label = { color: 'green', text: '提交译文' };
                    break;
                case 3:
                    label = { color: 'orange', text: '提交修改' };
                    break;
                default:
                    label = { color: 'danger', text: '未知' };
                    break;
            }
            itemEl.nameEl.innerHTML = `
            <span class="i18n__item-state i18n__item-state--${label.color}">${label.text}</span>
            <span class="i18n__item-title">${name}</span>`;

            const viewButton = new ButtonComponent(itemEl.controlEl);
            viewButton.setClass('i18n_modal_item_button');
            viewButton.setButtonText('查看');
            viewButton.onClick(() => {
                viewButton.setDisabled(true);
                if (number != null) window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${number}`);
                viewButton.setDisabled(false);
            });
        }
    }
    async reloadShowData() {
        let scrollTop = 0;
        const modalElement: HTMLElement = this.contentEl;
        scrollTop = modalElement.scrollTop;
        modalElement.empty();
        await this.showMain();
        modalElement.scrollTo(0, scrollTop);
    }

    async onOpen() {
        await this.showHead();
        await this.showMain();
    }

    async onClose() {
        this.contentEl.empty();
    }
}