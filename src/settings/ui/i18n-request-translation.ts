import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

export default class I18nRequestTranslationMode extends BaseSetting {
    main(): void {
        const I18nRequestTranslationMode = new Setting(this.containerEl);
        I18nRequestTranslationMode.setName("请求翻译");
        I18nRequestTranslationMode.setDesc("请求对未翻译的插件进行翻译(请勿滥用)");
        I18nRequestTranslationMode.addToggle(cb => cb
            .setValue(this.settings.I18N_REQUEST_TRANSLATION_MODE)
            .onChange(() => {
                this.settings.I18N_REQUEST_TRANSLATION_MODE = !this.settings.I18N_REQUEST_TRANSLATION_MODE;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}