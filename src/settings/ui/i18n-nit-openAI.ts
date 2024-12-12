import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";

export default class I18nNITOpenAI extends BaseSetting {
    main(): void {
        const i18nNITOpenAIUrl = new Setting(this.containerEl);
        i18nNITOpenAIUrl.setName(t('设置_AI_OPENAI_接口_标题'));
        i18nNITOpenAIUrl.setDesc(t('设置_AI_OPENAI_接口_描述'));
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nNITOpenAIUrl.setClass('i18n--hidden');
        i18nNITOpenAIUrl.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_URL)
            .setPlaceholder('https://api.openai.com')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_URL = value
                this.i18n.saveSettings();
            }).inputEl.addClass('i18n-input')
        );

        const i18nNITOpenAIKey = new Setting(this.containerEl);
        i18nNITOpenAIKey.setName(t('设置_AI_OPENAI_KEY_标题'));
        i18nNITOpenAIKey.setDesc(t('设置_AI_OPENAI_KEY_描述'));
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nNITOpenAIKey.setClass('i18n--hidden');
        i18nNITOpenAIKey.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_KEY)
            .setPlaceholder('KEY')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_KEY = value
                this.i18n.saveSettings();
            }).inputEl.addClass('i18n-input')
        );

        const i18nNITOpenAIModel = new Setting(this.containerEl);
        i18nNITOpenAIModel.setName(t('设置_AI_OPENAI_模型_标题'));
        i18nNITOpenAIModel.setDesc(t('设置_AI_OPENAI_模型_描述'));
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nNITOpenAIModel.setClass('i18n--hidden');
        i18nNITOpenAIModel.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_MODEL)
            .setPlaceholder('Model')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_MODEL = value
                this.i18n.saveSettings();
            }).inputEl.addClass('i18n-input')
        );

        const i18nAIOpenAITips = new Setting(this.containerEl);
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nAIOpenAITips.setClass('i18n--hidden');
        i18nAIOpenAITips.setName(t('设置_AI_OPENAI_提示_标题'));
        i18nAIOpenAITips.setDesc(t('设置_AI_OPENAI_提示_描述'));
        i18nAIOpenAITips.addTextArea(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_TIPS)
            .setPlaceholder(t('设置_AI_OPENAI_提示_占位符'))
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_TIPS = value
                this.i18n.saveSettings();
            }).inputEl.addClass('i18n-input')
        );
    }
}