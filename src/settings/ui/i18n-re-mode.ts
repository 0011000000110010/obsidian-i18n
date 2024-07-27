import { Setting } from "obsidian"
import BaseSetting from "./base-setting"
import { t } from "src/lang/inxdex";

export default class I18nREMode extends BaseSetting {
    main(): void {
        const i18nNITAPI = new Setting(this.containerEl);
        i18nNITAPI.setName('模式');
        i18nNITAPI.setDesc('RE模式');
        i18nNITAPI.addText(cb => cb
            .setValue(this.settings.I18N_RE_MODE)
            .setDisabled(true)
        );
    }
} 