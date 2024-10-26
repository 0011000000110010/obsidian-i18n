import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'src/main';

// ==============================
//         审核界面
// ==============================
export class AdminModal extends Modal {
    i18n: I18N;

    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n;
    }

    public async showHead() {
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n-share-history__container');
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);
        this.titleEl.addClass('i18n-share-history__title-box');

        const titleSetting = new Setting(this.titleEl);
        titleSetting.setName('I18N审核').setClass('i18n-share-history__title');
        new ButtonComponent(titleSetting.controlEl).setButtonText('获取').onClick(async () => { this.i18n.issuesList = await this.i18n.api.giteeGetAllIssue(); console.log(this.i18n.issuesList); this.reloadShowData() });
        new ButtonComponent(titleSetting.controlEl).setButtonText('退出').onClick(() => { this.close() });
    }

    public async showMain() {
        for (const issues of this.i18n.issuesList.data) {
            if (issues.title.includes('[提交译文]')) this.issue(issues, '提交译文')
            if (issues.title.includes('[更新译文]')) this.issue(issues, '更新译文')
        }
    }

    async onOpen() { await this.showHead(); await this.showMain(); }

    async onClose() { this.contentEl.empty(); }

    async reloadShowData() {
        let scrollTop = 0;
        const modalElement: HTMLElement = this.contentEl;
        scrollTop = modalElement.scrollTop;
        modalElement.empty();
        await this.showMain();
        modalElement.scrollTo(0, scrollTop);
    }

    issue = (issues: any, stateText: string) => {
        const itemEl = new Setting(this.contentEl);
        itemEl.setClass('i18n__item');
        itemEl.nameEl.addClass('i18n__item-title');
        itemEl.nameEl.innerHTML = `<span class="i18n__item-state i18n__item-state--red">${stateText}</span><span class="i18n__item-title"> ${issues.title.replace("[${stateText}] ", "")}</span>`;
        new ButtonComponent(itemEl.controlEl).setClass('i18n_modal_item_button').setButtonText('审核').onClick(() => { this.i18n.issuesObj = issues; this.i18n.activateAdminView(); });
        new ButtonComponent(itemEl.controlEl).setClass('i18n_modal_item_button').setButtonText('查看').onClick(() => { window.open(`https://gitee.com/${this.i18n.settings.I18N_GITEE_OWNER}/${this.i18n.settings.I18N_GITEE_REPO}/issues/${issues.number}`); });
    }
}