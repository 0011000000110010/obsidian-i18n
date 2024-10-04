import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

export default class I18nNITOpenAI extends BaseSetting {
    main(): void {
        const i18nNITOpenAIUrl = new Setting(this.containerEl);
        i18nNITOpenAIUrl.setName('接口');
        i18nNITOpenAIUrl.setDesc('默认为https://api.openai.com。\n即ChatGPT官方地址，使用官方key则无需修改。\n如果使用第三方服务，请参考对应服务商的文档说明。');
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nNITOpenAIUrl.setClass('i18n--hidden');
        i18nNITOpenAIUrl.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_URL)
            .setPlaceholder('https://api.openai.com')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_URL = value
                this.i18n.saveSettings();
            })
        );

        const i18nNITOpenAIKey = new Setting(this.containerEl);
        i18nNITOpenAIKey.setName('KEY');
        i18nNITOpenAIKey.setDesc('即api key。\n请参考对应服务商的文档说明');
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nNITOpenAIKey.setClass('i18n--hidden');
        i18nNITOpenAIKey.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_KEY)
            .setPlaceholder('KEY')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_KEY = value
                this.i18n.saveSettings();
            })
        );

        const i18nNITOpenAIModel = new Setting(this.containerEl);
        i18nNITOpenAIModel.setName('模型');
        i18nNITOpenAIModel.setDesc('即model。\n填写你需要使用的模型，注意此处模型名称为api对应的模型名\n（部分服务商的日常名称与api名称不一样），请查询对应服务商的文档。');
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nNITOpenAIModel.setClass('i18n--hidden');
        i18nNITOpenAIModel.addText(cb => cb
            .setValue(this.settings.I18N_NIT_OPENAI_MODEL)
            .setPlaceholder('Model')
            .onChange((value) => {
                this.settings.I18N_NIT_OPENAI_MODEL = value
                this.i18n.saveSettings();
            })
        );

        const i18nAIOpenAITips = new Setting(this.containerEl);
        // if (!(this.settings.I18N_MODE_NIT)) i18nAIOpenAITips.setClass('i18n--hidden');
        if (!(this.settings.I18N_NIT_API == 'OPENAI')) i18nAIOpenAITips.setClass('i18n--hidden');
        i18nAIOpenAITips.setName(t('SETTING_NIT_OPENAI_TIP_NAME'));
        i18nAIOpenAITips.setDesc('即prompt，用于指导AI如何翻译，本插件提供默认提示词，如有需要可自行调整。');
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