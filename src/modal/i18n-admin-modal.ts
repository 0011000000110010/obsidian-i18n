import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'src/main';
import { parseIssueTitle } from 'src/utils';

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
                this.i18n.issues = res.data;
                this.i18n.notice.result('获取', true, `${this.i18n.issues.length}条待审核内容`);
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
            .setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            .setIcon('refresh-ccw').onClick(async () => {
                const res = await this.i18n.api.giteeGetAllIssue();
                if (res.state) {
                    if (res.data.length > 0) {
                        this.i18n.issues = res.data;
                    } else {
                        this.i18n.notice.result('获取', true, '暂时没有可审核任务');
                    }
                } else {
                    this.i18n.notice.result('获取', false, '获取失败,请检查网络后重试');
                }
                this.reloadShowData();
            });
    }

    public async showMain() {
        if (this.i18n.issues) {
            for (const issues of this.i18n.issues) {
                if (this.isRandomContentFormat(issues.title)) this.issue(issues);
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

    private issue = (issue: any) => {
        const title = issue.title;
        const [type, language, id] = parseIssueTitle(title);
        const itemEl = new Setting(this.contentEl);
        itemEl.setClass('i18n__item');
        itemEl.nameEl.addClass('i18n__item-title');

        let typeCss = '';
        if (type[0] === '0') typeCss = 'primary'
        if (type[0] === '1') typeCss = 'danger'
        let typeName = '';
        if (type[0] === '0') typeName = '插件'
        if (type[0] === '1') typeName = '主题'
        let submissionTypeCss = ''
        if (type[1] === '0') submissionTypeCss = 'primary';
        if (type[1] === '1') submissionTypeCss = 'success';
        if (type[1] === '2') submissionTypeCss = 'warning';
        let submissionTypeName = ''
        if (type[1] === '0') submissionTypeName = '标记汉化';
        if (type[1] === '1') submissionTypeName = `提交${type[0] === '0' ? '插件' : '主题'}`;
        if (type[1] === '2') submissionTypeName = `更新${type[0] === '0' ? '插件' : '主题'}`;

        itemEl.nameEl.innerHTML = `<span class="i18n-tag i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-${typeCss} is-${this.i18n.settings.I18N_TAG_SHAPE}">${typeName}</span>
        <span class="i18n-tag i18n-tag--${this.i18n.settings.I18N_TAG_TYPE}-${submissionTypeCss} is-${this.i18n.settings.I18N_TAG_SHAPE}">${submissionTypeName}</span>
        <span class="i18n__item-title"> ${id}[${language}](${issue.user.name})</span>`;

        new ButtonComponent(itemEl.controlEl).setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-primary`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            .setButtonText('审核')
            .onClick(() => {
                this.i18n.issue = issue;
                this.i18n.activateAdminView();
            });
        new ButtonComponent(itemEl.controlEl).setClass('i18n-button').setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`).setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
            .setButtonText(`查看[${issue.comments}]`)
            .onClick(() => { window.open(`https://gitee.com/zero--two/obsidian-i18n-translation/issues/${issue.number}`); });
    }
    /**
     * 检查给定的字符串是否符合随机内容格式。
     * 该格式定义为三个方括号包裹的部分组成，各部分间可以有任意数量的空格。
     * @param str 要检查的字符串。
     * @returns 如果字符串符合格式返回 `true`，否则返回 `false`。
     */
    private isRandomContentFormat = (str: string) => {
        const regex = /^\[.*?\]\s*\[.*?\]\s*\[.*?\]$/;
        return regex.test(str);
    }

}