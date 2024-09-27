import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'main';
import Url from 'src/url';
import { t } from 'src/lang/inxdex';
import { NoticeOperationResult } from 'src/utils';

// ==============================
//          首次运行向导
// ==============================
export class AgreementModal extends Modal {
    i18n: I18N;
    areement_1 = false;
    areement_2 = false;
    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n
    }

    public async Main() {
        // @ts-ignore
        // 外框
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n_areement_modal');
        // 头部
        const titleEl: HTMLElement = this.titleEl;
        titleEl.innerHTML = '使用协议(请仔细阅读)'

        // 内容
        const contentEl: HTMLElement = this.contentEl;
        contentEl.innerHTML = `
        <p class='i18n_areement_text'>请务必了解：插件翻译过程涉及直接修改原插件的源代码。尽管i18n工具会事先备份原始文件，但操作仍存在一定风险。</p>
        <p class='i18n_areement_text'>因此，我们强烈建议您在首次尝试翻译插件之前，先备份您的插件目录（通常位于.obsidian/plugins文件夹内），以确保数据安全。</p>
        `
        const areement_1 = new Setting(contentEl);
        areement_1.setClass('i18n_areement_item');
        areement_1.setName('我已知晓风险');
        areement_1.addButton(cb => cb
            .setClass('i18n_areement_check')
            .setIcon(this.areement_1 ? 'square-check-big' : 'square')
            .onClick(() => {
                this.areement_1 = !this.areement_1;
                cb.setIcon(this.areement_1 ? 'square-check-big' : 'square');
            })
        );
        const areement_2 = new Setting(contentEl);
        areement_2.setClass('i18n_areement_item');
        areement_2.setName('如果遇到翻译后插件失效，点击还原即可恢复正常');
        areement_2.addButton(cb => cb
            .setClass('i18n_areement_check')
            .setIcon(this.areement_2 ? 'square-check-big' : 'square')
            .onClick(() => {
                this.areement_2 = !this.areement_2;
                cb.setIcon(this.areement_2 ? 'square-check-big' : 'square');
            })
        );

        const agreement = new Setting(contentEl);
        agreement.setClass('i18n_areement_operate');
        const agreeButton = new ButtonComponent(agreement.controlEl);
        agreeButton.setButtonText('同意');
        agreeButton.setCta();
        agreeButton.onClick(async () => {
            if (this.areement_1 === true && this.areement_2 === true) {
                NoticeOperationResult('I18N协议', true);
                this.i18n.settings.I18N_AGREEMENT = true;
                this.i18n.saveSettings();
                // @ts-ignore
                await this.app.plugins.disablePlugin('i18n');
                // @ts-ignore
                await this.app.plugins.enablePlugin('i18n');
                // 关闭
                this.close();
            } else {
                NoticeOperationResult('I18N协议', false, '请勾选使用协议');
            }
        });
        const consentButton = new ButtonComponent(agreement.controlEl);
        consentButton.setButtonText('不同意');
        consentButton.onClick(() => { this.close(); });

    }

    async onOpen() { await this.Main() }
    async onClose() { this.contentEl.empty() }
}