// import * as fs from 'fs-extra';
// import * as path from 'path';
import { BUTTON_SHAPE, BUTTON_TYPE, TAG_SHAPE, TAG_TYPE } from "src/data/data";
import BaseSetting from "../base-setting";
import { Setting } from "obsidian";
import { t } from "src/lang/inxdex";

export default class I18nStyle extends BaseSetting {
    main(): void {
        // 标签
        new Setting(this.containerEl).setName(t('设置_主题_标签_标题')).setDesc(t('设置_主题_标签_描述'))
            .addDropdown(cb => cb
                .addOptions(TAG_TYPE)
                .setValue(this.settings.I18N_TAG_TYPE)
                .onChange(async (value) => {
                    this.settings.I18N_TAG_TYPE = value;
                    await this.i18n.saveSettings();
                }).selectEl.addClass('i18n-select')
            )
            .addDropdown(cb => cb
                .addOptions(TAG_SHAPE)
                .setValue(this.settings.I18N_TAG_SHAPE)
                .onChange(async (value) => {
                    this.settings.I18N_TAG_SHAPE = value;
                    await this.i18n.saveSettings();
                }).selectEl.addClass('i18n-select')
            );
        // 按钮
        new Setting(this.containerEl).setName(t('设置_主题_按钮_标题')).setDesc(t('设置_主题_按钮_描述'))
            .addDropdown(cb => cb
                .addOptions(BUTTON_TYPE)
                .setValue(this.settings.I18N_BUTTON_TYPE)
                .onChange(async (value) => {
                    this.settings.I18N_BUTTON_TYPE = value;
                    await this.i18n.saveSettings();
                }).selectEl.addClass('i18n-select')
            )
            .addDropdown(cb => cb
                .addOptions(BUTTON_SHAPE)
                .setValue(this.settings.I18N_BUTTON_SHAPE)
                .onChange(async (value) => {
                    this.settings.I18N_BUTTON_SHAPE = value;
                    await this.i18n.saveSettings();
                }).selectEl.addClass('i18n-select')
            );
    }
}