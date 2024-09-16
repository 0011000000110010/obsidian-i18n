import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

// 忽略插件设置 
export default class I18nIgnore extends BaseSetting {
    main(): void {
        const i18nIgnore = new Setting(this.containerEl);
        i18nIgnore.setName("忽略插件");
        i18nIgnore.setDesc("忽略可能自带汉化的插件(需要云端翻译API支持)");
        i18nIgnore.addToggle(cb => cb
            .setValue(this.settings.I18N_IGNORE)
            .onChange(async () => {
                this.settings.I18N_IGNORE = !this.settings.I18N_IGNORE;
                this.i18n.saveSettings();
                
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