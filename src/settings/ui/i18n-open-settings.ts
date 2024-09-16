import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

// 打开设置
export default class I18nOpenSettings extends BaseSetting {
    main(): void {
        const i18nOpenSettings = new Setting(this.containerEl);
        i18nOpenSettings.setName("打开设置");
        i18nOpenSettings.setDesc("启用后插件页面中会显示设置跳转按钮");
        i18nOpenSettings.addToggle(cb => cb
            .setValue(this.settings.I18N_OPEN_SETTINGS)
            .onChange(() => {
                this.settings.I18N_OPEN_SETTINGS = !this.settings.I18N_OPEN_SETTINGS;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}