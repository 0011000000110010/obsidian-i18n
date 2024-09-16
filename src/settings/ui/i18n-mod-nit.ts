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
        i18nModeNIT.setClass('bold');
        i18nModeNIT.setName("机器翻译模式");
        i18nModeNIT.addToggle(cb => cb
            .setValue(this.settings.I18N_MODE_NIT)
            .onChange(() => {
                this.settings.I18N_MODE_NIT = !this.settings.I18N_MODE_NIT;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );

        const i18nNITAPI = new Setting(this.containerEl);
        if (!(this.settings.I18N_MODE_NIT)) i18nNITAPI.setClass('i18n_display-none');
        i18nNITAPI.setName('接口');
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
            .setButtonText('测试')
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
        i18nModeNITInterval.setName('间隔');
        i18nModeNITInterval.setDesc('用于限制每次请求间隔(单位: 毫秒)');
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