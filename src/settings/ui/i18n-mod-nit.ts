import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";
import { API_TYPES } from "src/data/data";
import { API } from '../../api';
import { NoticeOperationResult } from "src/utils";


// 自动更新
export default class I18nModeNIT extends BaseSetting {
    main(): void {
        const api = new API(this.i18n);

        const i18nModeNIT = new Setting(this.containerEl);
        // i18nModeNIT.setHeading();
        i18nModeNIT.setName(t('SETTING_NIT_NAME'));
        i18nModeNIT.setDesc('是否开启机器翻译模式');
        i18nModeNIT.addButton(cb => {
            cb.setButtonText(this.settings.I18N_MODE_NIT ? '关闭' : '开启');
            cb.onClick(async () => {
                this.settings.I18N_MODE_NIT = !this.settings.I18N_MODE_NIT;
                this.i18n.saveSettings();
                this.settingTab.nitDisplay();
            });
            cb.setClass('i18n-button');
            this.settings.I18N_MODE_NIT ? cb.setClass('i18n-button--danger') : cb.setClass('i18n-button--primary');
        });

        const i18nNITAPI = new Setting(this.containerEl);
        i18nNITAPI.setName(t('SETTING_NIT_APIS_NAME'));
        i18nNITAPI.setDesc(t('SETTING_NIT_APIS_DESC'));
        i18nNITAPI.addDropdown(cb => cb
            .addOptions(API_TYPES)
            .setValue(this.settings.I18N_NIT_API)
            .onChange((value) => {
                this.settings.I18N_NIT_API = value;
                this.i18n.saveSettings();
                this.settingTab.nitDisplay();
            })
        );
        i18nNITAPI.addButton(cb => cb
            .setButtonText(t('SETTING_NIT_TEST_BUTTON_TEXT'))
            .onClick(async () => {
                switch (this.settings.I18N_NIT_API) {
                    case 'BAIDU':
                        if ((await api.baiduAPI('i18n')).state) NoticeOperationResult('百度', true);
                        break
                    case 'OPENAI':
                        api.openAITest();
                        break
                    default:
                        break
                }
            })
            .setClass('i18n-button')
            .setClass('i18n-button--primary')
        );

        const i18nModeNITInterval = new Setting(this.containerEl);
        i18nModeNITInterval.setName(t('SETTING_NIT_INTERVAL_NAME'));
        i18nModeNITInterval.setDesc(t('SETTING_NIT_INTERVAL_DESC'));
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