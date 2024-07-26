import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { mode } from "src/data/data";

export default class I18nMode extends BaseSetting {
    main(): void {
        const i18nLanguage = new Setting(this.containerEl);
        i18nLanguage.setName("模式");
        i18nLanguage.setDesc("更改插件的模式");
        i18nLanguage.addDropdown(cb => cb
            .addOptions(mode)
            .setValue(this.settings.I18N_MODE)
            .onChange(async (value) => {
                this.settings.I18N_MODE = value;
                await this.i18n.saveSettings();
            })
        );
    }
}