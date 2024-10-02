import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'main';

// ==============================
//          首次运行向导
// ==============================
export class SubmiteHistoryModal extends Modal {
    i18n: I18N;
    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n
    }

    public async showHead() {
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n_submite_history_modal');
        // 删除关闭按钮
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);
        this.titleEl.addClass('i18n_submite_history_title');

        const title = new Setting(this.titleEl);
        title.setClass('i18n_submite_history_title_name');
        title.setName('云端提交记录(保存一天)');

        const exitButton = new ButtonComponent(title.controlEl);
        exitButton.setButtonText('退出');
        // exitButton.setWarning();
        exitButton.onClick(() => { this.close() });
    }

    public async showMain() {
        for (const { id, name, type, number } of this.i18n.settings.I18N_SUBMIT_HISTORY) {
            const itemEl = new Setting(this.contentEl);
            itemEl.setClass('i18n_modal_item');
            itemEl.nameEl.addClass('i18n_modal_item_title');
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
            <span class="i18n_modal_item_state i18n_modal_item_state_${label.color}">${label.text}</span>
            <span class="i18n_modal_item_title">${name}</span>`;
            // const date = new Date(time);
            // const year = date.getFullYear();
            // const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，加1，并确保两位数  
            // const day = String(date.getDate()).padStart(2, '0'); // 确保两位数  
            // const hour = String(date.getHours()).padStart(2, '0'); // 确保两位数  
            // const minute = String(date.getMinutes()).padStart(2, '0'); // 确保两位数  
            // const second = String(date.getSeconds()).padStart(2, '0'); // 确保两位数 
            // itemEl.descEl.textContent = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            // if ((time + 3600000) < Date.now()) {
            //     const button = new ButtonComponent(itemEl.controlEl);
            //     button.setClass('i18n_modal_item_button');
            //     button.setButtonText('删除');
            //     button.onClick(() => {
            //         button1.setDisabled(true);
            //         this.i18n.settings.I18N_SUBMIT_HISTORY = this.i18n.settings.I18N_SUBMIT_HISTORY.filter(item => !(item.id === id && item.type === type));
            //         this.i18n.saveSettings();
            //         this.reloadShowData();
            //         // this.onClose()
            //         // this.onOpen()

            //     });
            // }
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