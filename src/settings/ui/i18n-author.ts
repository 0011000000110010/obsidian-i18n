import { Setting } from "obsidian";
import BaseSetting from "./base-setting";


export default class I18nAuthor extends BaseSetting {
    main(): void {
        const i18nAuthor = new Setting(this.containerEl);
        i18nAuthor.setName('译文签名');
        i18nAuthor.setDesc('生成译文时自动添加作者签名');
        i18nAuthor.addText(cb => cb
            .setValue(this.settings.I18N_AUTHOR)
            .setPlaceholder('签名')
            .onChange((value) => {
                this.settings.I18N_AUTHOR = value;
                this.i18n.saveSettings();
            })
        );
    }
}