import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";
import { API_TYPES } from "src/data/data";
import { API } from '../../api';


// 自动更新
export default class I18nModeNIT extends BaseSetting {
    main(): void {
        const api = new API(this.i18n);

        const i18nModeNIT = new Setting(this.containerEl);
        i18nModeNIT.setName(`${t('设置_AI_标题')} ${this.settings.I18N_MODE_NIT ? '🟢' : '🔴'}`);
        i18nModeNIT.setDesc(t('设置_AI_描述'));
        i18nModeNIT.addButton(cb => {
            cb.setButtonText(this.settings.I18N_MODE_NIT ? t('设置_通用_关闭_文本') : t('设置_通用_开启_文本'));
            cb.onClick(async () => {
                this.settings.I18N_MODE_NIT = !this.settings.I18N_MODE_NIT;
                this.i18n.saveSettings();
                this.settingTab.nitDisplay();
            });
            cb.setClass('i18n-button');
            cb.setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            this.settings.I18N_MODE_NIT ? cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-danger`) : cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`);
        });

        const i18nNITAPI = new Setting(this.containerEl);
        i18nNITAPI.setName(t('设置_AI_接口服务_标题'));
        i18nNITAPI.setDesc(t('设置_AI_接口服务_描述'));
        i18nNITAPI.addDropdown(cb => cb
            .addOptions(API_TYPES)
            .setValue(this.settings.I18N_NIT_API)
            .onChange((value) => {
                this.settings.I18N_NIT_API = value;
                this.i18n.saveSettings();
                this.settingTab.nitDisplay();
            }).selectEl.addClass('i18n-select')
        );
        i18nNITAPI.addButton(cb => cb
            .setButtonText(t('设置_通用_测试_文本'))
            .onClick(async () => {
                switch (this.settings.I18N_NIT_API) {
                    case 'BAIDU':
                        if ((await api.baiduAPI('i18n')).state) this.i18n.notice.result('百度', true);
                        break
                    case 'OPENAI':
                        api.openAITest();
                        break
                    default:
                        break
                }
            })
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
        );

        const i18nModeNITInterval = new Setting(this.containerEl);
        i18nModeNITInterval.setName(t('设置_AI_请求间隔_标题'));
        i18nModeNITInterval.setDesc(t('设置_AI_请求间隔_描述'));
        i18nModeNITInterval.addSlider(cb => cb
            .setDynamicTooltip()
            .setLimits(0, 1000, 50)
            .setValue(this.settings.I18N_NIT_API_INTERVAL)
            .onChange((value) => {
                this.settings.I18N_NIT_API_INTERVAL = value
                this.i18n.saveSettings();
            })
        )
        new Setting(this.containerEl).setName(t('设置_云端_服务配置_标题')).setHeading();
    }
}