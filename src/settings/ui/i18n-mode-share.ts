import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";
import { AdminModal } from "src/modal/i18n-admin-modal";

// ==============================
//           共建云端
// ==============================
export default class I18nShare extends BaseSetting {
    main(): void {
        new Setting(this.containerEl)
            .setName(t('设置_共享_标题'))
            .setDesc(t('设置_共享_描述'))

        new Setting(this.containerEl)
            .setName(t('设置_共享_贡献者_标题'))
            .setDesc(t('设置_共享_贡献者_描述'))
            .addText(cb => cb
                .setValue(this.settings.I18N_SHARE_TOKEN)
                .setPlaceholder(t('设置_共享_贡献者_提示'))
                .onChange((value) => {
                    this.settings.I18N_SHARE_TOKEN = value
                    this.i18n.saveSettings();
                }).inputEl.addClass('i18n-input')
            ).addToggle(cb => cb
                .setValue(this.settings.I18N_SHARE_MODE)
                .onChange(() => {
                    this.settings.I18N_SHARE_MODE = !this.settings.I18N_SHARE_MODE;
                    this.i18n.saveSettings();
                    this.settingTab.shareDisplay();
                })
                .toggleEl.addClass('i18n-checkbox')
            );

        new Setting(this.containerEl)
            .setName(`${t('设置_共享_管理员_标题')} (${this.settings.I18N_ADMIN_VERIFY ? '已验证' : '未验证'})`)
            .setDesc(t('设置_共享_管理员_描述'))
            .addButton(cb => cb.setButtonText('验证')
                .setClass('i18n-button')
                .setClass(`i18n-button--${this.i18n.settings.I18N_BUTTON_TYPE}-info`)
                .setClass(`is-${this.i18n.settings.I18N_BUTTON_SHAPE}`)
                .onClick(async () => {
                    if (!this.settings.I18N_ADMIN_VERIFY) {
                        const user = await this.i18n.api.giteeUser();
                        const check = await this.i18n.api.checkUser(user.data.login);
                        if (check.state) {
                            this.settings.I18N_ADMIN_VERIFY = !this.settings.I18N_ADMIN_VERIFY;
                            this.i18n.saveSettings();
                            this.settingTab.shareDisplay();
                            this.i18n.notice.result('共建云端', true, '验证成功');
                        } else {
                            this.i18n.notice.result('共建云端', false, '验证失败');
                        }
                    } else {
                        this.i18n.notice.result('共建云端', true, '您已验证,无需重复验证');
                    }
                }).setClass(this.i18n.settings.I18N_ADMIN_VERIFY ? 'i18n--hidden' : 'i18n--none')
            )
            .addText(cb => cb
                .setValue(this.settings.I18N_ADMIN_TOKEN)
                .setPlaceholder(t('设置_共享_管理员_提示'))
                .onChange((value) => {
                    this.settings.I18N_ADMIN_TOKEN = value;
                    this.i18n.saveSettings();
                }).inputEl.addClass('i18n-input')
            )
            .addToggle(cb => cb
                .setValue(this.settings.I18N_ADMIN_MODE)
                .onChange(() => {
                    if (this.settings.I18N_ADMIN_VERIFY) {
                        this.settings.I18N_ADMIN_MODE = !this.settings.I18N_ADMIN_MODE;
                        this.i18n.saveSettings();
                        if (this.settings.I18N_ADMIN_MODE) {
                            this.i18n.i18nReviewEl = this.i18n.addRibbonIcon('i18n-review', 'I18N审核', (evt: MouseEvent) => { new AdminModal(this.app, this.i18n).open() });
                        } else {
                            this.i18n.i18nReviewEl.remove();
                        }
                    } else {
                        this.i18n.notice.result('共建云端', false, '您尚未验证,请先验证');
                        this.settingTab.shareDisplay();
                    }
                })
                .toggleEl.addClass('i18n-checkbox')
            );
    }
}