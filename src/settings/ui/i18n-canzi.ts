import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

export default class CanZi extends BaseSetting {
    main(): void {
        const i18nNITMode = new Setting(this.containerEl)
		i18nNITMode.setName('蚕子插件格式');
		i18nNITMode.addToggle(cb => cb
			.setValue(this.settings.CanZi)
			.onChange(() => {
				this.settings.CanZi = !this.settings.CanZi;
				this.i18n.saveSettings();
				this.settingTab.display();
			})
		);
    }
} 