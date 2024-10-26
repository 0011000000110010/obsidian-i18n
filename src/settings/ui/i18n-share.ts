import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";
import { AdminModal } from "src/modal/i18n-admin-modal";

// ==============================
//           共建云端
// ==============================
export default class I18nShare extends BaseSetting {
    main(): void {
        
        new Setting(this.containerEl).setName(t('SETTING_CLOUD_COLLABORATION_NAME')).setDesc(t('SETTING_CLOUD_COLLABORATION_DESC')).addButton(cb => {
            cb.setButtonText(this.settings.I18N_SHARE_MODE ? '关闭' : '开启')
            cb.onClick(async () => {
                this.settings.I18N_SHARE_MODE = !this.settings.I18N_SHARE_MODE;
                this.i18n.saveSettings();
                this.settingTab.shareDisplay();
            });
            cb.setClass('i18n-button');
            this.settings.I18N_SHARE_MODE ? cb.setClass('i18n-button--danger') : cb.setClass('i18n-button--primary');
        });

        new Setting(this.containerEl).setName(t('SETTING_CLOUD_COLLABORATION_TOKEN_NAME')).setDesc(t('SETTING_CLOUD_COLLABORATION_TOKEN_DESC')).addText(cb => cb
            .setValue(this.settings.I18N_SHARE_TOKEN)
            .setPlaceholder(t('SETTING_CLOUD_COLLABORATION_TOKEN_PLACEHOLDER'))
            .onChange((value) => {
                this.settings.I18N_SHARE_TOKEN = value
                this.i18n.saveSettings();
            })
        );
        // i18nShareTokenSetting.addToggle(cb => cb
        //     .setValue(this.settings.I18N_ADMIN_MODE)
        //     .onChange(() => {
        //         this.settings.I18N_ADMIN_MODE = !this.settings.I18N_ADMIN_MODE;
        //         this.i18n.saveSettings();
        //     })
        //     .toggleEl.addClass('i18n-checkbox')
        // );

        new Setting(this.containerEl).setName('Admin Token').setDesc('审核提交的译文').addText(cb => cb
            .setValue(this.settings.I18N_ADMIN_TOKEN)
            .setPlaceholder('管理员token')
            .onChange((value) => {
                this.settings.I18N_ADMIN_TOKEN = value
                this.i18n.saveSettings();
            })
        ).addToggle(cb => cb
            .setValue(this.settings.I18N_ADMIN_MODE)
            .onChange(() => {
                this.settings.I18N_ADMIN_MODE = !this.settings.I18N_ADMIN_MODE;
                this.i18n.saveSettings();
                if (this.settings.I18N_ADMIN_MODE) this.i18n.i18nReviewEl = this.i18n.addRibbonIcon('i18n-review', 'I18N审核', (evt: MouseEvent) => { new AdminModal(this.app, this.i18n).open() });
                if (!this.settings.I18N_ADMIN_MODE) this.i18n.i18nReviewEl.remove();

            })
            .toggleEl.addClass('i18n-checkbox')
        );
        // I18N_ADMIN_TOKEN

    }
}