import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

export default class I18nRequestTranslationMode extends BaseSetting {
    main(): void {
        const I18nRequestTranslationMode = new Setting(this.containerEl);
        I18nRequestTranslationMode.setName("译文求译");
        I18nRequestTranslationMode.setDesc("向插件作者发送邮件，请求对未翻译的插件进行翻译");
        I18nRequestTranslationMode.addToggle(cb => cb
            .setValue(this.settings.I18N_REQUEST_REANSLATION_MODE)
            .onChange(() => {
                this.settings.I18N_REQUEST_REANSLATION_MODE = !this.settings.I18N_REQUEST_REANSLATION_MODE;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}