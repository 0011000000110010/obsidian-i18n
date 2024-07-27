import { Setting } from "obsidian";
import BaseSetting from "./base-setting";


export default class I18nEmail extends BaseSetting {
    main(): void {
        const I18nEmail = new Setting(this.containerEl);
        if(!this.settings.I18N_EMAIL_MODE) I18nEmail.setClass('display-none')
        I18nEmail.setName('邮箱');
        I18nEmail.setDesc('配置邮箱可在插件中一键向作者发送译文(暂时只支持QQ邮箱)');
        // 邮箱
        I18nEmail.addText(cb => cb
            .setValue(this.settings.I18N_EMAIL_EMAIL)
            .setPlaceholder('邮箱')
            .onChange((value) => {
                this.settings.I18N_EMAIL_EMAIL = value
                this.i18n.saveSettings();
            })
        );
        // 授权码
        I18nEmail.addText(cb => cb
            .setValue(this.settings.I18N_EMAIL_KEY)
            .setPlaceholder('授权码')
            .onChange((value) => {
                this.settings.I18N_EMAIL_KEY = value
                this.i18n.saveSettings();
            })
        );
    }
}