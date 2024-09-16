import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

// 自动更新
export default class I18nModNDT extends BaseSetting {
    main(): void {
        const i18nModNDT = new Setting(this.containerEl);
        i18nModNDT.setClass('bold');
        i18nModNDT.setName("云端文件模式");
        i18nModNDT.setDesc("");
        i18nModNDT.addToggle(cb => cb
            .setValue(this.settings.I18N_MODE_NDT)
            .onChange(async () => {
                this.settings.I18N_MODE_NDT = !this.settings.I18N_MODE_NDT;
                await this.i18n.saveSettings();
                const id = this.i18n.manifest.id;
                // @ts-ignore
                const settings = this.app.setting;
                // @ts-ignore
                await this.app.plugins.disablePlugin(id);
                // @ts-ignore
                await this.app.plugins.enablePlugin(id);
                settings.close();
            })
        );
    }
}