import { App, ButtonComponent, Modal, Setting } from 'obsidian';
import I18N from 'main';
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
        modalEl.addClass('i18n-areement__container');
        // 头部
        const titleEl: HTMLElement = this.titleEl;
        titleEl.innerHTML = '使用协议(请仔细阅读)'

        // 内容
        const contentEl: HTMLElement = this.contentEl;
        contentEl.innerHTML = `
        <p class='i18n-agreement__text'>1. 插件翻译过程涉及直接修改原插件的源代码。尽管i18n工具会事先备份原始文件，但操作仍存在一定风险。</p>
        <p class='i18n-agreement__text'>2. 强烈建议在首次尝试翻译插件之前，先备份您的插件目录。通常，插件目录位于 .obsidian/plugins 文件夹内。备份可以确保您的数据安全。</p>
        <p class='i18n-agreement__text'>3. 在进行翻译时，请耐心等待。直到翻译成功或明确得知失败结果后，再继续您的后续操作。</p>
        <p class='i18n-agreement__text'>4. 若在使用本插件进行翻译后，发现原插件的某些功能受到影响而失效，请卸载重新安装原插件，随后再次检验功能是否恢复正常。若问题依旧存在，再去原插件作者项目地址提交issues，避免因本插件导致原插件失效，去打扰原作者。(重要！重要！重要！)</p>
        `
        const areement_1 = new Setting(contentEl);
        areement_1.setClass('i18n-agreement__item');
        areement_1.setName('我已知晓风险');
        areement_1.addButton(cb => cb
            .setClass('i18n-agreement__check-button')
            .setIcon(this.areement_1 ? 'square-check-big' : 'square')
            .onClick(() => {
                this.areement_1 = !this.areement_1;
                cb.setIcon(this.areement_1 ? 'square-check-big' : 'square');
            })
        );
        const areement_2 = new Setting(contentEl);
        areement_2.setClass('i18n-agreement__item');
        areement_2.setName('如果遇到翻译后插件失效，点击还原即可恢复正常');
        areement_2.addButton(cb => cb
            .setClass('i18n-agreement__check-button')
            .setIcon(this.areement_2 ? 'square-check-big' : 'square')
            .onClick(() => {
                this.areement_2 = !this.areement_2;
                cb.setIcon(this.areement_2 ? 'square-check-big' : 'square');
            })
        );

        const agreement = new Setting(contentEl);
        agreement.setClass('i18n-agreement__operate');
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
        consentButton.onClick(async () => {
            // @ts-ignore
            await this.app.plugins.disablePlugin('i18n');
            // this.i18n.onload();
            // await this.app.plugins.display();
            // await this.app.plugins.refresh();
            this.close();
        });

    }
    async onOpen() { await this.Main() }
    async onClose() { this.contentEl.empty() }
}