import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";
import { API_TYPES } from "src/data/data";
import { API } from '../../api';


// 自动更新
export default class I18nModeNIT extends BaseSetting {
    main(): void {
        const api = new API(this.i18n);

        const i18nModeNIT = new Setting(this.containerEl);
        i18nModeNIT.setClass('i18n_bold');
        i18nModeNIT.setName(`🤖 ${t('SETTING_NIT_NAME')}`);
        i18nModeNIT.addToggle(cb => cb
            .setValue(this.settings.I18N_MODE_NIT)
            .onChange(async () => {
                this.settings.I18N_MODE_NIT = !this.settings.I18N_MODE_NIT;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );

        const i18nNITAPI = new Setting(this.containerEl);
        if (!(this.settings.I18N_MODE_NIT)) i18nNITAPI.setClass('i18n_display-none');
        i18nNITAPI.setName(t('SETTING_NIT_APIS_NAME'));
        i18nNITAPI.setDesc(t('SETTING_NIT_APIS_DESC'));
        i18nNITAPI.addDropdown(cb => cb
            .addOptions(API_TYPES)
            .setValue(this.settings.I18N_NIT_API)
            .onChange((value) => {
                this.settings.I18N_NIT_API = value;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );
        i18nNITAPI.addButton(cb => cb
            .setButtonText(t('SETTING_NIT_TEST_BUTTON_TEXT'))
            .onClick(() => {
                switch (this.settings.I18N_NIT_API) {
                    case 'BAIDU':
                        api.baiduTest();
                        break
                    case 'OPENAI':
                        api.openAITest();
                        break
                    default:
                        break
                }
            })
        );

        const i18nModeNITInterval = new Setting(this.containerEl);
        i18nModeNITInterval.setName(t('SETTING_NIT_INTERVAL_NAME'));
        i18nModeNITInterval.setDesc(t('SETTING_NIT_INTERVAL_DESC'));
        if (!(this.settings.I18N_MODE_NIT)) i18nModeNITInterval.setClass('i18n_display-none');
        i18nModeNITInterval.addSlider(cb => cb
            .setDynamicTooltip()
            .setLimits(0, 1000, 50)
            .setValue(this.settings.I18N_NIT_API_INTERVAL)
            .onChange((value) => {
                this.settings.I18N_NIT_API_INTERVAL = value
                this.i18n.saveSettings();
            })
        )
    }
}