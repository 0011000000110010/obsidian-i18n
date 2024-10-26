import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";


export default class I18nAuthor extends BaseSetting {
    main(): void {
        const i18nAuthor = new Setting(this.containerEl);
        i18nAuthor.setName(t('SETTING_Author_NAME'));
        i18nAuthor.setDesc(t('SETTING_Author_DESC'));
        i18nAuthor.addText(cb => cb
            .setValue(this.settings.I18N_AUTHOR)
            .setPlaceholder(t('SETTING_Author_PLACEHOLDER'))
            .onChange((value) => {
                this.settings.I18N_AUTHOR = value;
                this.i18n.saveSettings();
            })
            // .inputEl.addClass('i18n-input')
        );
    }
}