import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";
import { DOWNLOAD } from "src/data/data";


// 自动更新
export default class I18nModNDT extends BaseSetting {
    main(): void {
        const i18nModNDT = new Setting(this.containerEl);
        i18nModNDT.setName(`${t('设置_云端_标题')} ${this.settings.I18N_MODE_NDT ? '🟢' : '🔴'}`);
        i18nModNDT.setDesc(t('设置_云端_描述'));
        i18nModNDT.addButton(cb => {
            cb.setButtonText(this.settings.I18N_MODE_NDT ? t('设置_通用_关闭_文本') : t('设置_通用_开启_文本'));
            cb.onClick(async () => {
                this.settings.I18N_MODE_NDT = !this.settings.I18N_MODE_NDT;
                this.settingTab.ndtDisplay();
                await this.i18n.saveSettings();
                await this.i18n.ignoreCache();
                await this.i18n.themeDirectoryCache();
                await this.i18n.pliginDirectoryCache();
            });
            cb.setClass('i18n-button');
            cb.setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            this.settings.I18N_MODE_NDT ? cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-danger`) : cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`);
        });

        const i18nIgnore = new Setting(this.containerEl);
        i18nIgnore.setName(t('设置_云端_标记汉化_标题'));
        i18nIgnore.setDesc(t('设置_云端_标记汉化_描述'));
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

        const i18nNdtApi = new Setting(this.containerEl);
        i18nNdtApi.setName(t('设置_云端_云端接口_标题'));
        i18nNdtApi.setDesc(t('设置_云端_云端接口_描述'));
        i18nNdtApi.addDropdown(cb => cb
            .addOptions(DOWNLOAD)
            .setValue(this.settings.I18N_NDT_URL)
            .onChange(async (value) => {
                this.settings.I18N_NDT_URL = value;
                await this.i18n.saveSettings();
            }).selectEl.addClass('i18n-select')
        );
        // i18nNdtApi.addText(cb => cb
        //     .setPlaceholder('owner')
        //     .setValue(this.settings.I18N_GITEE_OWNER)
        //     .onChange((value) => {
        //         this.settings.I18N_GITEE_OWNER = value;
        //     }).inputEl.addClass('i18n-input')
        // );
        // i18nNdtApi.addText(cb => cb
        //     .setPlaceholder('repo')
        //     .setValue(this.settings.I18N_GITEE_REPO)
        //     .onChange((value) => {
        //         this.settings.I18N_GITEE_REPO = value;
        //     }).inputEl.addClass('i18n-input')
        // );
    }
}