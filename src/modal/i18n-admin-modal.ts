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
        this.a();
    }
    public async a() {
        const res = await this.i18n.api.giteeGetAllIssue();
        if (res.state) {
            if (res.data.length > 0) {
                this.i18n.issuesList = res.data;
            } else {
                this.i18n.notice.result('获取', true, '暂时没有可审核任务');
            }
        } else {
            this.i18n.notice.result('获取', false, '获取失败,请检查网络后重试');
        }
    }

    public async showHead() {
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n-share-history__container');
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);
        this.titleEl.addClass('i18n-share-history__title-box');

        const titleSetting = new Setting(this.titleEl);
        titleSetting.setName('I18N审核').setClass('i18n-share-history__title');
        new ButtonComponent(titleSetting.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('refresh-ccw')
            .onClick(async () => {
                const res = await this.i18n.api.giteeGetAllIssue();
                if (res.state) {
                    if (res.data.length > 0) {
                        this.i18n.issuesList = res.data;
                    } else {
                        this.i18n.notice.result('获取', true, '暂时没有可审核任务');
                    }
                } else {
                    this.i18n.notice.result('获取', false, '获取失败,请检查网络后重试');
                }
                this.reloadShowData();
            });
        // new ButtonComponent(titleSetting.controlEl)
        //     .setClass('i18n-button')
        //     .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`)
        //     .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
        //     .setButtonText('退出').onClick(() => { this.close() });
    }

    public async showMain() {
        if (this.i18n.issuesList) {
            for (const issues of this.i18n.issuesList) {
                if (issues.title.includes('[提交译文]')) this.issue(issues, '提交译文')
                if (issues.title.includes('[更新译文]')) this.issue(issues, '更新译文')
            }
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
        let style = '';
        if (stateText === '提交译文') style = 'success'
        if (stateText === '更新译文') style = 'warning'
        itemEl.nameEl.innerHTML = `<span class="i18n-tag i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-${style} is-${this.i18n.settings.I18N_TAG_SHAPE}">${stateText}</span><span class="i18n__item-title"> ${issues.title.replace(`[${stateText}] `, "")}(${issues.user.name})</span>`;
        new ButtonComponent(itemEl.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`)
            .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            .setButtonText('审核')
            .onClick(() => { this.i18n.issuesObj = issues; this.i18n.activateAdminView(); });
        new ButtonComponent(itemEl.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            .setButtonText('查看')
            .onClick(() => { window.open(`https://gitee.com/${this.i18n.settings.I18N_GITEE_OWNER}/${this.i18n.settings.I18N_GITEE_REPO}/issues/${issues.number}`); });
    }
}