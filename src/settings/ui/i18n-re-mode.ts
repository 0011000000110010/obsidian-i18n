import { Setting } from "obsidian"
import BaseSetting from "./base-setting"

export default class I18nREMode extends BaseSetting {
    main(): void {
        const i18nNITAPI = new Setting(this.containerEl);
        i18nNITAPI.setName('模式');
        i18nNITAPI.setDesc('当前正在使用的匹配模式');
        i18nNITAPI.addText(cb => cb
            .setValue(this.settings.I18N_RE_MODE)
            .setDisabled(true)
        );
    }
} 