import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

// 自动更新
export default class I18nEmailMode extends BaseSetting {
    main(): void {
        const i18nEmailMode = new Setting(this.containerEl);
        i18nEmailMode.setName("开启");
        i18nEmailMode.setDesc("是否开启提交译文功能");
        i18nEmailMode.addToggle(cb => cb
            .setValue(this.settings.I18N_EMAIL_MODE)
            .onChange(() => {
                this.settings.I18N_EMAIL_MODE = !this.settings.I18N_EMAIL_MODE;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
}