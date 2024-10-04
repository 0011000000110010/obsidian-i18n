import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";
import { LANGUAGES } from 'src/data/data'


// 自动更新
export default class I18nModNDT extends BaseSetting {
    main(): void {
        const i18nModNDT = new Setting(this.containerEl);
        i18nModNDT.setName(`${t('SETTING_NDT_NAME')}`);
        i18nModNDT.setDesc('是否开启云端文件模式。');
        i18nModNDT.addButton(cb => {
            cb.setButtonText(this.settings.I18N_MODE_NDT ? '关闭' : '开启');
            cb.onClick(async () => {
                this.settings.I18N_MODE_NDT = !this.settings.I18N_MODE_NDT;
                await this.i18n.saveSettings();
                await this.i18n.ignoreCache();
                await this.i18n.directoryCache();
                this.settingTab.ndtDisplay();
            });
            cb.setClass('i18n-button');
            this.settings.I18N_MODE_NDT ? cb.setClass('i18n-button--danger') : cb.setClass('i18n-button--primary');
        });

        const i18nIgnore = new Setting(this.containerEl);
        i18nIgnore.setName(t('SETTING_NDT_IGNORE_NAME'));
        i18nIgnore.setDesc(t('SETTING_NDT_IGNORE_DESC'));
        i18nIgnore.addToggle(cb => cb
            .setValue(this.settings.I18N_IGNORE)
            .onChange(async () => {
                this.settings.I18N_IGNORE = !this.settings.I18N_IGNORE;
                this.i18n.saveSettings();
                await this.i18n.ignoreCache();
                this.settingTab.ndtDisplay();
            })
            .toggleEl.addClass('i18n-checkbox')
        );

        let temp_ndt_lang = '';
        let temp_ndt_url = '';

        const i18nNdtApis = new Setting(this.containerEl);
        // if (!(this.settings.I18N_MODE_NDT)) i18nNdtApis.setClass('i18n--hidden');
        i18nNdtApis.setName(t('SETTING_NDT_APIS_NAME'));
        i18nNdtApis.setDesc(t('SETTING_NDT_APIS_DESC'));
        i18nNdtApis.addDropdown(cb => cb
            .addOptions(LANGUAGES)
            .setValue('')
            .onChange(async (value) => {
                temp_ndt_lang = value;
            })
        );
        i18nNdtApis.addText(cb => cb
            .setPlaceholder('URL')
            .onChange((value) => {
                temp_ndt_url = value
            })
        );
        i18nNdtApis.addButton(cb => cb
            .setButtonText(t('SETTING_NDT_APIS_INSERT_BUTTON'))
            .onClick(() => {
                if (temp_ndt_lang != '' && temp_ndt_url != '') {
                    this.settings.I18N_NDT_APIS[temp_ndt_lang] = temp_ndt_url;
                    this.i18n.saveSettings();
                    this.settingTab.ndtDisplay();
                }
            })
            .setClass('i18n-button')
            .setClass('i18n-button--primary')
        );
        i18nNdtApis.addButton(cb => cb
            .setButtonText(this.settings.I18N_NDT_APIS_DISPLAY ? t('SETTING_PUBLIC_HIDE') : t('SETTING_PUBLIC_SHOW'))
            .onClick(() => {
                this.settings.I18N_NDT_APIS_DISPLAY = !this.settings.I18N_NDT_APIS_DISPLAY;
                this.i18n.saveSettings();
                this.settingTab.ndtDisplay();
            })
            .setClass('i18n-button')
            .setClass('i18n-button--primary')
        );
        if (this.settings.I18N_NDT_APIS_DISPLAY) {
            for (const key in this.settings.I18N_NDT_APIS) {
                const i18nNDTURL = new Setting(this.containerEl);
                i18nNDTURL.setName(key);
                i18nNDTURL.setDesc(this.settings.I18N_NDT_APIS[key]);
                i18nNDTURL.addButton(cb => cb
                    .setIcon('trash')
                    .onClick(() => {
                        delete this.settings.I18N_NDT_APIS[key];
                        this.i18n.saveSettings();
                        this.settingTab.ndtDisplay();
                    })
                )
            }
        }
    }
}