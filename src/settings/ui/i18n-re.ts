import { Notice, Setting } from "obsidian"
import BaseSetting from "./base-setting"
import { t } from "src/lang/inxdex";
import { NoticeError, NoticeOperationResult } from "src/utils";

export default class I18nRE extends BaseSetting {
    main(): void {
        // RE 模式
        const i18nREMode = new Setting(this.containerEl);
        i18nREMode.setName(t('SETTING_RE_MODE_NAME'));
        i18nREMode.setDesc(t('SETTING_RE_MODE_DESC'));
        i18nREMode.addText(cb => cb
            .setValue(this.settings.I18N_RE_MODE)
            .setDisabled(true)
        );
        i18nREMode.addButton(cb => cb
            .setButtonText(this.settings.I18N_RE_MODE_EDIT ? t('SETTING_PUBLIC_HIDE') : t('SETTING_PUBLIC_SHOW'))
            .onClick(() => {
                this.settings.I18N_RE_MODE_EDIT = !this.settings.I18N_RE_MODE_EDIT;
                this.i18n.saveSettings();
                this.settingTab.display();
            })
        );

        // 编辑模式
        if (this.settings.I18N_RE_MODE_EDIT) {
            // RE 标志
            const i18nREFlags = new Setting(this.containerEl);
            i18nREFlags.setName(t('SETTING_RE_FLAGS_NAME'));
            i18nREFlags.setDesc(t('SETTING_RE_FLAGS_DESC'));
            i18nREFlags.addText(cb => cb
                .setValue(this.settings.I18N_RE_FLAGS)
                .setPlaceholder(t('SETTING_RE_FLAGS_PLACEHOLDER'))
                .onChange((value) => {
                    this.settings.I18N_RE_FLAGS = value;
                    this.i18n.saveSettings();
                })
            );
            // RE 长度
            const i18nRELength = new Setting(this.containerEl);
            i18nRELength.setName(t('SETTING_RE_LENGTH_NAME'));
            i18nRELength.setDesc(t('SETTING_RE_LENGTH_DESC'));
            i18nRELength.addSlider(cb => cb
                .setDynamicTooltip()
                .setLimits(0, 3000, 100)
                .setValue(this.settings.I18N_RE_LENGTH)
                .onChange((value) => {
                    this.settings.I18N_RE_LENGTH = value
                    this.i18n.saveSettings();
                })
            )
            // 模式编辑
            let modeString = '';
            const i18nREModes = new Setting(this.containerEl);
            i18nREModes.setName(t('SETTING_RE_EDIT_MODE_NAME'));
            i18nREModes.setDesc(t('SETTING_RE_EDIT_MODE_DESC'));
            i18nREModes.addText(cb => cb
                .setPlaceholder(t('SETTING_RE_EDIT_MODE_PLACEHOLDER'))
                .onChange((value) => {
                    modeString = value
                })
            );
            i18nREModes.addButton(cb => cb
                .setButtonText(t('SETTING_RE_EDIT_INSERT_BUTTON_TEXT'))
                .onClick(() => {
                    if (modeString != '' && !this.settings.I18N_RE_MODES.includes(modeString)) {
                        this.settings.I18N_RE_MODES.push(modeString);
                        if (!this.settings.I18N_RE_DATAS.hasOwnProperty(modeString)) {
                            this.settings.I18N_RE_DATAS[modeString] = [];
                        }
                        this.i18n.saveSettings();
                        this.settingTab.display();
                    } else {
                        NoticeError(t('SETTING_PUBLIC_RE'), t('SETTING_RE_EDIT_INSERT_BUTTON_CONTENT_A'));
                    }
                })
            );
            i18nREModes.addButton(cb => cb
                .setButtonText(this.settings.I18N_RE_MODE_DISPLAY ? t('SETTING_PUBLIC_HIDE') : t('SETTING_PUBLIC_SHOW'))
                .onClick(() => {
                    this.settings.I18N_RE_MODE_DISPLAY = !this.settings.I18N_RE_MODE_DISPLAY;
                    this.i18n.saveSettings();
                    this.settingTab.display();
                })
            );
            if (this.settings.I18N_RE_MODE_DISPLAY) {
                for (let i = 0; i < this.settings.I18N_RE_MODES.length; i++) {
                    const i18nREModeItem = new Setting(this.containerEl);
                    i18nREModeItem.setName(this.settings.I18N_RE_MODES[i]);
                    if (this.settings.I18N_RE_MODE != this.settings.I18N_RE_MODES[i]) {
                        i18nREModeItem.addButton(cb => cb
                            .setIcon('check')
                            .onClick(() => {
                                this.settings.I18N_RE_MODE = this.settings.I18N_RE_MODES[i];
                                this.i18n.saveSettings();
                                this.settingTab.display();
                            })
                        )
                    }
                    i18nREModeItem.addButton(cb => cb
                        .setIcon('trash')
                        .onClick(() => {
                            if (this.settings.I18N_RE_MODES.length > 1) {
                                delete this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODES[i]];
                                const a = this.settings.I18N_RE_MODES[i]
                                const b = this.settings.I18N_RE_MODE
                                console.log(a == b);
                                if (this.settings.I18N_RE_MODES[i] == this.settings.I18N_RE_MODE) {
                                    this.settings.I18N_RE_MODE = this.settings.I18N_RE_MODES[0]
                                }
                                this.settings.I18N_RE_MODES.splice(i, 1);
                                NoticeOperationResult(t('SETTING_PUBLIC_RE'), true);
                            } else {
                                NoticeOperationResult(t('SETTING_PUBLIC_RE'), false, t('SETTING_RE_EDIT_DELETE_BUTTON_CONTENT_A'));
                            }
                            this.i18n.saveSettings();
                            this.settingTab.display();
                        })
                    )

                }
            }

            // 数据编辑
            let regexpString = '';
            const i18nREDatas = new Setting(this.containerEl);
            i18nREDatas.setName(t('SETTING_RE_EDIT_ITEM_NAME'));
            i18nREDatas.setDesc(t('SETTING_RE_EDIT_ITEM_DESC'));
            i18nREDatas.addText(cb => cb
                .setPlaceholder(t('SETTING_RE_EDIT_ITEM_PLACEHOLDER'))
                .onChange((value) => {
                    regexpString = value
                })
            );
            i18nREDatas.addButton(cb => cb
                .setButtonText(t('SETTING_RE_EDIT_ITEM_INSERT_BUTTON_TEXT'))
                .onClick(() => {
                    if (regexpString != '') {
                        this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].push(regexpString);
                        this.i18n.saveSettings();
                        this.settingTab.display();
                    }
                })
            );
            i18nREDatas.addButton(cb => cb
                .setButtonText(this.settings.I18N_RE_DATAS_DISPLAY ? t('SETTING_PUBLIC_HIDE') : t('SETTING_PUBLIC_SHOW'))
                .onClick(() => {
                    this.settings.I18N_RE_DATAS_DISPLAY = !this.settings.I18N_RE_DATAS_DISPLAY;
                    this.i18n.saveSettings();
                    this.settingTab.display();
                })
            );
            if (this.settings.I18N_RE_DATAS_DISPLAY) {
                for (let i = 0; i < this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].length; i++) {
                    const i18nREDatasItem = new Setting(this.containerEl);
                    i18nREDatasItem.setName(this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE][i]);
                    i18nREDatasItem.addButton(cb => cb
                        .setIcon('trash')
                        .onClick(() => {
                            this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].splice(i, 1);
                            this.i18n.saveSettings();
                            this.settingTab.display();
                        })
                    )
                }
            }
        }
    }
} 