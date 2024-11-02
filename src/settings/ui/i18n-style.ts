// import * as fs from 'fs-extra';
// import * as path from 'path';
import { BUTTON_SHAPE, BUTTON_TYPE, TAG_SHAPE, TAG_TYPE } from "src/data/data";
import BaseSetting from "../base-setting";
import { Setting } from "obsidian";

export default class I18nStyle extends BaseSetting {
    main(): void {
        // new Setting(this.containerEl).setName('主色').setDesc('为 Obsidian I18N 选择一个主题色。主题色将影响选中、按钮等元素的颜色。')
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_1)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_1 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_2)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_2 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_3)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_3 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_4)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_4 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_5)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_5 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )

        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY = value;
        //             this.i18n.saveSettings();
        //         })
        //     )

        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_1)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_1 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_2)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_2 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_3)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_3 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_4)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_4 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        //     .addColorPicker(cb => cb
        //         .setValue(this.settings.I18N_COLOR_PRIMARY_5)
        //         .onChange((value) => {
        //             document.documentElement.style.setProperty('--i18n-color-primary', value);
        //             this.settings.I18N_COLOR_PRIMARY_5 = value;
        //             this.i18n.saveSettings();
        //         })
        //     )
        // 标签
        new Setting(this.containerEl).setName('标签').setDesc('设置标签的样式以及形状。')
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
        new Setting(this.containerEl).setName('按钮').setDesc('设置按钮的样式以及形状。')
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