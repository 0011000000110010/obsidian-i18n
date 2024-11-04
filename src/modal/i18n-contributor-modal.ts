import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'main';


// ==============================
//          历史提交记录
// ==============================
export class ContributorModal extends Modal {
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
        this.titleEl.parentElement?.addClass('i18n-contributor__title-box');
        this.contentEl.addClass('i18n-contributor__content');
        const titleSetting = new Setting(this.titleEl).setClass('i18n-contributor__title').setName('译文贡献榜单');
        new ButtonComponent(titleSetting.controlEl)
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`)
            .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('refresh-ccw')
            .onClick(() => { this.reloadShowData() });
    }

    public async showMain() {
        if (this.i18n.contributorCache === undefined) this.i18n.contributorCache = (await this.i18n.api.giteeGetContributor()).data;
        if (this.i18n.contributorCache !== undefined) {
            this.i18n.contributorCache.sort((a, b) => {
                const sumA = a.translation + a.modification + a.erasure;
                const sumB = b.translation + b.modification + b.erasure;
                return sumB - sumA;
            });
            const tableEl = this.contentEl.createEl('table');
            tableEl.addClass('i18n-contributor__table');
            let rank = 1;

            for (const { name, url, translation, modification, erasure } of this.i18n.contributorCache) {
                const rowEl = tableEl.createEl('tr', { cls: ['i18n-contributor__row'] });
                rowEl.addEventListener('click', () => { window.open(url) });
                const rankCls = (rank <= 3) ? `i18n-contributor__rank-${rank}` : 'i18n-contributor__rank-4';
                rowEl.createEl('td', { text: rank.toString(), cls: ['i18n-contributor__rank', rankCls] });
                rank++;
                rowEl.createEl('td', { text: name, cls: ['i18n-contributor__name'] });
                rowEl.createEl('td', { text: (translation + modification + erasure).toString(), cls: ['i18n-contributor__translation'] });
            }
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