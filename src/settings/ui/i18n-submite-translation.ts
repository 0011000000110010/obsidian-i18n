import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

export default class I18nSubmiteTranslationMode extends BaseSetting {
    main(): void {
        const i18nSubmiteTranslationMode = new Setting(this.containerEl);
        i18nSubmiteTranslationMode.setName("译文提交");
        i18nSubmiteTranslationMode.setDesc("一键发送译文至作者(请勿滥用)");
        i18nSubmiteTranslationMode.addToggle(cb => cb
            .setValue(this.settings.I18N_SUBMIT_TRANSLATION_MODE)
            .onChange(() => {
                this.settings.I18N_SUBMIT_TRANSLATION_MODE = !this.settings.I18N_SUBMIT_TRANSLATION_MODE;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}