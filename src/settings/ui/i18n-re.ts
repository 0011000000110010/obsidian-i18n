import { Notice, Setting } from "obsidian"
import BaseSetting from "./base-setting"

export default class I18nRE extends BaseSetting {
    main(): void {
        // RE 模式
        const i18nREMode = new Setting(this.containerEl);
        i18nREMode.setName('模式');
        i18nREMode.setDesc('当前正在使用的匹配模式');
        i18nREMode.addText(cb => cb
            .setValue(this.settings.I18N_RE_MODE)
            .setDisabled(true)
        );
        i18nREMode.addButton(cb => cb
            .setButtonText(this.settings.I18N_RE_MODE_EDIT ? '隐藏' : '编辑')
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
            i18nREFlags.setName('标志');
            i18nREFlags.setDesc('正则表达式的flags');
            i18nREFlags.addText(cb => cb
                .setValue(this.settings.I18N_RE_FLAGS)
                .setPlaceholder('flags')
                .onChange((value) => {
                    this.settings.I18N_RE_FLAGS = value;
                    this.i18n.saveSettings();
                })
            );
            // RE 长度
            const i18nRELength = new Setting(this.containerEl);
            i18nRELength.setName('长度');
            i18nRELength.setDesc('re可以匹配到的最大长度');
            i18nRELength.addSlider(cb => cb
                .setDynamicTooltip()
                .setLimits(0, 1000, 25)
                .setValue(this.settings.I18N_RE_LENGTH)
                .onChange((value) => {
                    this.settings.I18N_RE_LENGTH = value
                    this.i18n.saveSettings();
                })
            )
            // 模式编辑
            let modeString = '';
            const i18nREModes = new Setting(this.containerEl);
            i18nREModes.setName('模式编辑');
            i18nREModes.setDesc('新增和删除正则表达式匹配模式');
            i18nREModes.addText(cb => cb
                .setPlaceholder('模式')
                .onChange((value) => {
                    modeString = value
                })
            );
            i18nREModes.addButton(cb => cb
                .setButtonText('添加')
                .onClick(() => {
                    if (modeString != '' && !this.settings.I18N_RE_MODES.includes(modeString)) {
                        this.settings.I18N_RE_MODES.push(modeString);
                        if (!this.settings.I18N_RE_DATAS.hasOwnProperty(modeString)) {
                            this.settings.I18N_RE_DATAS[modeString] = [];
                        }
                        this.i18n.saveSettings();
                        this.settingTab.display();
                    } else {
                        new Notice(`RE模式名称重复 无法添加`);
                    }
                })
            );
            i18nREModes.addButton(cb => cb
                .setButtonText(this.settings.I18N_RE_MODE_DISPLAY ? '隐藏' : '查看')
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
                                new Notice(`删除成功`);
                            } else {
                                new Notice(`只剩下一个了 无法删除`);
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
            i18nREDatas.setName('数据编辑');
            i18nREDatas.setDesc('新增和删除正则表达式模式数据');
            i18nREDatas.addText(cb => cb
                .setPlaceholder('RegExp')
                .onChange((value) => {
                    regexpString = value
                })
            );
            i18nREDatas.addButton(cb => cb
                .setButtonText('添加')
                .onClick(() => {
                    if (regexpString != '') {
                        this.settings.I18N_RE_DATAS[this.settings.I18N_RE_MODE].push(regexpString);
                        this.i18n.saveSettings();
                        this.settingTab.display();
                    }
                })
            );
            i18nREDatas.addButton(cb => cb
                .setButtonText(this.settings.I18N_RE_DATAS_DISPLAY ? '隐藏' : '查看')
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