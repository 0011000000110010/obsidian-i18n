import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

// 自动更新
export default class I18nAutomaticUpdate extends BaseSetting {
    main(): void {
        const i18nAutomaticUpdate = new Setting(this.containerEl);
        i18nAutomaticUpdate.setName("自动更新");
        i18nAutomaticUpdate.setDesc("检测到插件版本更新后，自动更新翻译内容");
        i18nAutomaticUpdate.addToggle(cb => cb
            .setValue(this.settings.I18N_AUTOMATIC_UPDATE)
            .onChange(() => {
                this.settings.I18N_AUTOMATIC_UPDATE = !this.settings.I18N_AUTOMATIC_UPDATE;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}