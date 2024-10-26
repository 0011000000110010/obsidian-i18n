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
        this.titleEl.addClass('i18n-share-history__title-box');

        const titleSetting = new Setting(this.titleEl);
        titleSetting.setClass('i18n-share-history__title').setName('译文贡献榜单');
        // new ButtonComponent(titleSetting.controlEl).setButtonText('退出').onClick(() => { this.close() });
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
                const rowEl = tableEl.createEl('tr');
                rowEl.addClass('i18n-contributor__row');
                rowEl.addEventListener('click', () => { window.open(url) });
                const rankEl = rowEl.createEl('td');
                rankEl.addClass('i18n-contributor__rank');
                rankEl.textContent = rank.toString();
                rank++;
                const nameEl = rowEl.createEl('td');
                nameEl.addClass('i18n-contributor__name');
                nameEl.textContent = name;
                const translationEl = rowEl.createEl('td');
                translationEl.addClass('i18n-contributor__translation');
                translationEl.textContent = (translation + modification + erasure).toString();
                // const modificationEl = rowEl.createEl('td');
                // modificationEl.textContent = modification.toString();
                // modificationEl.addClass('i18n-contributor__modification');
                // const deleteEl = rowEl.createEl('td');
                // deleteEl.textContent = modification.toString();
                // deleteEl.addClass('i18n-contributor__delete');
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