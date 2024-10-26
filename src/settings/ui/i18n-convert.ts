import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

// 自动更新
export default class I18nConvertMode extends BaseSetting {
    main(): void {
        const i18nConvertMode = new Setting(this.containerEl);
        i18nConvertMode.setName("译文转换");
        i18nConvertMode.setDesc("将外部插件的译文格式转换为当前插件的译文格式(重启Obsidian生效)");
        i18nConvertMode.addToggle(cb => cb
            .setValue(this.settings.I18N_CONVERT_MODE)
            .onChange(() => {
                this.settings.I18N_CONVERT_MODE = !this.settings.I18N_CONVERT_MODE;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}