import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

export default class I18n extends BaseSetting {
    main(): void {
        const I18n = new Setting(this.containerEl);
        console.log(I18n)
    }
} 