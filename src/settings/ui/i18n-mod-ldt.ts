import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

// 自动更新
export default class I18nModLDT extends BaseSetting {
    main(): void {
        const i18nModLDT = new Setting(this.containerEl);
        i18nModLDT.setClass('bold');
        i18nModLDT.setName("本地文件模式");
        i18nModLDT.setDesc("");
        i18nModLDT.addToggle(cb => cb
            .setValue(this.settings.I18N_MODE_LDT)
            .onChange(() => {
                this.settings.I18N_MODE_LDT = !this.settings.I18N_MODE_LDT;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}