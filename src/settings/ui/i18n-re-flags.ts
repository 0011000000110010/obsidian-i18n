import { Setting } from "obsidian"
import BaseSetting from "./base-setting"
import { t } from "src/lang/inxdex";

export default class I18nREFlags extends BaseSetting {
    main(): void {
        const i18nREFlags = new Setting(this.containerEl);
        i18nREFlags.setName('标志');
        i18nREFlags.setDesc('正则表达式的flags');
        i18nREFlags.addText(cb => cb
            .setValue(this.settings.I18N_RE_FLAGS)
            .setPlaceholder('flags')
            .onChange((value) => {
                this.settings.I18N_RE_FLAGS = value;
                this.i18n.saveSettings();
            })
        );
    }
}