import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

export default class I18nColor extends BaseSetting {
    main(): void {
        const i18nLanguage = new Setting(this.containerEl);
        i18nLanguage.setName('主题');
        i18nLanguage.setDesc('为 Obsidian I18N 选择一个主题色。主题色将影响选中、按钮等元素的颜色。');
        i18nLanguage.addColorPicker(cb => cb
            .setValue(this.settings.I18N_COLOR)
            .onChange((value) => {
                document.documentElement.style.setProperty('--i18n-color-primary', value);
                this.settings.I18N_COLOR = value;
                this.i18n.saveSettings();
            })
        );
        // 409EFF
    }
}