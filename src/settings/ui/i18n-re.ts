import { Setting } from "obsidian"
import BaseSetting from "../base-setting"
import { t } from "src/lang/inxdex";

export default class I18nRE extends BaseSetting {
    main(): void {
        const i18nIgnore = new Setting(this.containerEl);
        i18nIgnore.setName(t('设置_正则_临时正则_标题'));
        i18nIgnore.setDesc(t('设置_正则_临时正则_描述'));
        i18nIgnore.addToggle(cb => cb
            .setValue(this.settings.I18N_RE_TEMP_MODE)
            .onChange(async () => {
                this.settings.I18N_RE_TEMP_MODE = !this.settings.I18N_RE_TEMP_MODE;
                this.i18n.saveSettings();
            })
            .toggleEl.addClass('i18n-checkbox')
        );
        // RE 模式
        const i18nREMode = new Setting(this.containerEl);
        i18nREMode.setName(t('设置_正则_正则模式_标题'));
        i18nREMode.setDesc(t('设置_正则_正则模式_描述'));
        i18nREMode.addText(cb => cb
            .setValue(this.settings.I18N_RE_MODE)
            .setDisabled(true)
            .inputEl.addClass('i18n-input')
        );

        // RE 标志
        const i18nREFlags = new Setting(this.containerEl);
        i18nREFlags.setName(t('设置_正则_正则标志_标题'));
        i18nREFlags.setDesc(t('设置_正则_正则标志_描述'));
        i18nREFlags.addText(cb => cb
            .setValue(this.settings.I18N_RE_FLAGS)
            .setPlaceholder(t('设置_正则_正则标志_占位符'))
            .onChange((value) => {
                this.settings.I18N_RE_FLAGS = value;
                this.i18n.saveSettings();
            }).inputEl.addClass('i18n-input')
        );
        // RE 长度
        const i18nRELength = new Setting(this.containerEl);
        i18nRELength.setName(t('设置_正则_匹配长度_标题'));
        i18nRELength.setDesc(t('设置_正则_匹配长度_描述'));
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
        i18nREModes.setName(t('设置_正则_模式编辑_标题'));
        i18nREModes.setDesc(t('设置_正则_模式编辑_描述'));
        i18nREModes.addText(cb => cb
            .setPlaceholder(t('设置_正则_模式编辑_占位符'))
            .onChange((value) => {
                modeString = value
            }).inputEl.addClass('i18n-input')
        );
        i18nREModes.addButton(cb => cb
            .setButtonText(t('设置_通用_添加_文本'))
            .onClick(() => {
                if (modeString != '' && !this.settings.I18N_RE_MODES.includes(modeString)) {
                    this.settings.I18N_RE_MODES.push(modeString);
                    if (!this.settings.I18N_RE_DATAS.hasOwnProperty(modeString)) {
                        this.settings.I18N_RE_DATAS[modeString] = [];
                    }
                    this.i18n.saveSettings();
                    this.settingTab.reDisplay();
                } else {
                    this.i18n.notice.error(t('设置_正则_通知_前缀'), t('设置_正则_模式编辑_通知一'));
                }
            })
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)

        );
        i18nREModes.addButton(cb => cb
            .setButtonText(this.settings.I18N_RE_MODE_DISPLAY ? t('设置_通用_隐藏_文本') : t('设置_通用_显示_文本'))
            .onClick(() => {
                this.settings.I18N_RE_MODE_DISPLAY = !this.settings.I18N_RE_MODE_DISPLAY;
                this.i18n.saveSettings();
                this.settingTab.reDisplay();
            })
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
        );
        if (this.settings.I18N_RE_MODE_DISPLAY) {
            for (let i = 0; i < this.settings.I18N_RE_MODES.length; i++) {
                const i18nREModeItem = new Setting(this.containerEl);
                i18nREModeItem.setName(this.settings.I18N_RE_MODES[i]);
                if (this.settings.I18N_RE_MODE != this.settings.I18N_RE_MODES[i]) {
                    i18nREModeItem.addButton(cb => cb
                        .setClass('i18n-button')
                        .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`)
                        .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
                        .setIcon('check')
                        .onClick(() => {
                            this.settings.I18N_RE_MODE = this.settings.I18N_RE_MODES[i];
                            this.i18n.saveSettings();
                            this.settingTab.reDisplay();
                        })
                    )
                }
                i18nREModeItem.addButton(cb => cb
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-danger`)
                    .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
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
                            this.i18n.notice.result(t('设置_正则_通知_前缀'), true);
                        } else {
                            this.i18n.notice.result(t('设置_正则_通知_前缀'), false, t('设置_正则_数据编辑_通知一'));
                        }
                        this.i18n.saveSettings();
                        this.settingTab.reDisplay();
                    })
                )

            }
        }

        // 数据编辑
        let regexpString = '';
        const i18nREDatas = new Setting(this.containerEl);
        i18nREDatas.setName(t('设置_正则_数据编辑_标题'));
        i18nREDatas.setDesc(t('设置_正则_数据编辑_描述'));
        i18nREDatas.addText(cb => cb
            .setPlaceholder(t('设置_正则_数据编辑_占位符'))
            .onChange((value) => {
                regexpString = value
            }).inputEl.addClass('i18n-input')
        );
        i18nREDatas.addButton(cb => cb
            .setButtonText(t('设置_通用_添加_文本'))
            .onClick(() => {
                if (regexpString != '') {
                    this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].push(regexpString);
                    this.i18n.saveSettings();
                    this.settingTab.reDisplay();
                }
            })
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
        );
        i18nREDatas.addButton(cb => cb
            .setButtonText(this.settings.I18N_RE_DATAS_DISPLAY ? t('设置_通用_隐藏_文本') : t('设置_通用_显示_文本'))
            .onClick(() => {
                this.settings.I18N_RE_DATAS_DISPLAY = !this.settings.I18N_RE_DATAS_DISPLAY;
                this.i18n.saveSettings();
                this.settingTab.reDisplay();
            })
            .setClass('i18n-button')
            .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-primary`)
            .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
        );
        if (this.settings.I18N_RE_DATAS_DISPLAY) {
            for (let i = 0; i < this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].length; i++) {
                const i18nREDatasItem = new Setting(this.containerEl);
                i18nREDatasItem.setName(this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE][i]);
                i18nREDatasItem.addButton(cb => cb
                    .setClass('i18n-button')
                    .setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-danger`)
                    .setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
                    .setIcon('trash')
                    .onClick(() => {
                        this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].splice(i, 1);
                        this.i18n.saveSettings();
                        this.settingTab.reDisplay();
                    })
                )
            }
        }

    }
} 