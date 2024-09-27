import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nNITOpenAI extends BaseSetting {
    main(): void {
        const i18nNITOpenAI = new Setting(this.containerEl);
        i18nNITOpenAI.setName(t('SETTING_NIT_OPENAI_NAME'));
        i18nNITOpenAI.setDesc(t('SETTING_NIT_OPENAI_DESC'));
        if (!(this.settings.I18N_MODE_NIT)) i18nNITOpenAI.setClass('i18n_display-none');
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nNITOpenAI.setClass('i18n_display-none');
        i18nNITOpenAI.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_URL)
            .setPlaceholder('https://api.openai.com')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_URL = value
                this.i18n.saveSettings();
            })
        );
        i18nNITOpenAI.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_KEY)
            .setPlaceholder('KEY')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_KEY = value
                this.i18n.saveSettings();
            })
        );
        i18nNITOpenAI.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_MODEL)
            .setPlaceholder('Model')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_MODEL = value
                this.i18n.saveSettings();
            })
        );

        const i18nAIOpenAITips = new Setting(this.containerEl);
        if (!(this.settings.I18N_MODE_NIT)) i18nAIOpenAITips.setClass('i18n_display-none');
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nAIOpenAITips.setClass('i18n_display-none');
        i18nAIOpenAITips.setName(t('SETTING_NIT_OPENAI_TIP_NAME'));
        i18nAIOpenAITips.setDesc(t('SETTING_NIT_OPENAI_TIP_DESC'));
        i18nAIOpenAITips.addTextArea(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_TIPS)
            .setPlaceholder(t('SETTING_NIT_OPENAI_TIP_PLACEHOLDER'))
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_TIPS = value
                this.i18n.saveSettings();
            })
        );
    }
}