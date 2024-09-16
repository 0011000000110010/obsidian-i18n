import { Setting } from "obsidian";
import BaseSetting from "./base-setting";

export default class I18nNITOpenAI extends BaseSetting {
    main(): void {
        const i18nNITOpenAI = new Setting(this.containerEl);
        i18nNITOpenAI.setName('地址');
        i18nNITOpenAI.setDesc('使用openai进行翻译');
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
            .setPlaceholder('模型')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_MODEL = value
                this.i18n.saveSettings();
            })
        );

        const i18nAIOpenAITips = new Setting(this.containerEl);
        if (!(this.settings.I18N_MODE_NIT)) i18nAIOpenAITips.setClass('i18n_display-none');
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nAIOpenAITips.setClass('i18n_display-none');
        i18nAIOpenAITips.setName('提示');
        i18nAIOpenAITips.setDesc('即prompt，用于指导AI如何翻译，本插件提供默认提示词，如有需要可自行调整。');
        i18nAIOpenAITips.addTextArea(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_TIPS)
            .setPlaceholder('提示词')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_TIPS = value
                this.i18n.saveSettings();
            })
        );
    }
}