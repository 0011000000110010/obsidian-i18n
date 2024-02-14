import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nNitMode extends BaseSetting {
    main(): void {
        const i18nBatch = new Setting(this.containerEl)
        i18nBatch.setName(t('SETTING_BATCH'));
        i18nBatch.setDesc(t('SETTING_BATCH_DESC'));
        i18nBatch.addToggle(cb => cb
            .setValue(this.settings.I18N_BATCH)
            .onChange(() => {
                this.settings.I18N_BATCH = !this.settings.I18N_BATCH;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
    }
} 