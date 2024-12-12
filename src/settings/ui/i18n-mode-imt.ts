import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
import { t } from "src/lang/inxdex";

// 自动更新
export default class I18nModIMT extends BaseSetting {
    main(): void {
        const i18nModIMT = new Setting(this.containerEl);
        i18nModIMT.setName(`${t('设置_沉浸_标题')} ${this.settings.I18N_MODE_IMT ? '🟢' : '🔴'}`);
        i18nModIMT.setDesc(t('设置_沉浸_描述'));
        i18nModIMT.addButton(cb => cb
            .setButtonText('重启')
            .onClick(() => {
                document.location.reload();
            }).buttonEl.addClasses(['i18n-button', `i18n-button--${this.settings.I18N_BUTTON_TYPE}-warning`, `is-${this.settings.I18N_BUTTON_SHAPE}`])
        );
        i18nModIMT.addButton(cb => {
            cb.setButtonText(this.settings.I18N_MODE_IMT ? t('设置_通用_关闭_文本') : t('设置_通用_开启_文本'));
            cb.onClick(() => {
                this.settings.I18N_MODE_IMT = !this.settings.I18N_MODE_IMT;
                if (!this.settings.I18N_MODE_IMT) document.location.reload();
                this.i18n.saveSettings();
                this.settingTab.imtDisplay();
                this.settings.I18N_MODE_IMT ? this.i18n.activateIMT() : this.i18n.enableIMT();
            })
            cb.setClass('i18n-button');
            cb.setClass(`is-${this.settings.I18N_BUTTON_SHAPE}`)
            this.settings.I18N_MODE_IMT ? cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-danger`) : cb.setClass(`i18n-button--${this.settings.I18N_BUTTON_TYPE}-success`);
        });

        new Setting(this.containerEl).setName('指定翻译范围').setHeading();
        const selectors = new Setting(this.containerEl);
        selectors.setName('匹配元素');
        selectors.setDesc('修改后请重启沉浸式翻译功能');
        selectors.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.selectors ? this.settings.I18N_IMT_CONFIG.selectors.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.selectors = v.split(',');
                await this.i18n.saveSettings();
                window.immersiveTranslateConfig = { 'pageRule': this.settings.I18N_IMT_CONFIG };
                console.log(window.immersiveTranslateConfig);
            })
        );
        const excludeSelectors = new Setting(this.containerEl);
        excludeSelectors.setName('排除元素');
        excludeSelectors.setDesc('仅翻译匹配到的元素');
        excludeSelectors.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.excludeSelectors ? this.settings.I18N_IMT_CONFIG.excludeSelectors.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.excludeSelectors = v.split(',');
                await this.i18n.saveSettings();
                window.immersiveTranslateConfig = { 'pageRule': this.settings.I18N_IMT_CONFIG };
                console.log(window.immersiveTranslateConfig);
            })
        );
        const excludeTags = new Setting(this.containerEl);
        excludeTags.setName('排除Tags');
        excludeTags.setDesc('排除Tags，不翻译匹配的Tag');
        excludeTags.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.excludeTags ? this.settings.I18N_IMT_CONFIG.excludeTags.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.excludeTags = v.split(',');
                await this.i18n.saveSettings();
            })
        );

        new Setting(this.containerEl).setName('追加翻译范围').setHeading();
        const additionalSelectors = new Setting(this.containerEl);
        additionalSelectors.setName('追加翻译范围');
        additionalSelectors.setDesc('追加翻译范围。在智能翻译的区域，追加翻译位置。');
        additionalSelectors.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.additionalSelectors ? this.settings.I18N_IMT_CONFIG.additionalSelectors.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.additionalSelectors = v.split(',');
                await this.i18n.saveSettings();
            })
        );
        const additionalExcludeSelectors = new Setting(this.containerEl);
        additionalExcludeSelectors.setName('追加排除元素');
        additionalExcludeSelectors.setDesc('追加排除元素，让智能翻译不翻译特定位置。');
        additionalExcludeSelectors.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.additionalExcludeSelectors ? this.settings.I18N_IMT_CONFIG.additionalExcludeSelectors.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.additionalExcludeSelectors = v.split(',');
                await this.i18n.saveSettings();
            })
        );
        const additionalExcludeTags = new Setting(this.containerEl);
        additionalExcludeTags.setName('追加排除Tags');
        additionalExcludeTags.setDesc('追加排除Tags');
        additionalExcludeTags.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.additionalExcludeTags ? this.settings.I18N_IMT_CONFIG.additionalExcludeTags.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.additionalExcludeTags = v.split(',');
                await this.i18n.saveSettings();
            })
        );

        new Setting(this.containerEl).setName('保持原样').setHeading();
        const stayOriginalSelectors = new Setting(this.containerEl);
        stayOriginalSelectors.setName('匹配的元素将保持原样');
        stayOriginalSelectors.setDesc('匹配的元素将保持原样。常用于论坛网站的标签。');
        stayOriginalSelectors.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.stayOriginalSelectors ? this.settings.I18N_IMT_CONFIG.stayOriginalSelectors.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.stayOriginalSelectors = v.split(',');
                await this.i18n.saveSettings();
            })
        );
        const stayOriginalTags = new Setting(this.containerEl);
        stayOriginalTags.setName('匹配到的Tag将保持原样');
        stayOriginalTags.setDesc('匹配到的Tag将保持原样，比如 `code`');
        stayOriginalTags.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.stayOriginalTags ? this.settings.I18N_IMT_CONFIG.stayOriginalTags.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.stayOriginalTags = v.split(',');
                await this.i18n.saveSettings();
            })
        );
        new Setting(this.containerEl).setName('区域翻译').setHeading();
        const atomicBlockSelectors = new Setting(this.containerEl);
        atomicBlockSelectors.setName('区域选择器');
        atomicBlockSelectors.setDesc('匹配的元素将被视为一个整体, 不会分段翻译');
        atomicBlockSelectors.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.atomicBlockSelectors ? this.settings.I18N_IMT_CONFIG.atomicBlockSelectors.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.atomicBlockSelectors = v.split(',');
                await this.i18n.saveSettings();
            })
        );
        const atomicBlockTags = new Setting(this.containerEl);
        atomicBlockTags.setName('区域Tag选择器');
        atomicBlockTags.setDesc('匹配的元素将被视为一个整体, 不会分段翻译');
        atomicBlockTags.addTextArea(cb => cb
            .setValue(this.settings.I18N_IMT_CONFIG.atomicBlockTags ? this.settings.I18N_IMT_CONFIG.atomicBlockTags.toString() : '')
            .onChange(async (v) => {
                this.settings.I18N_IMT_CONFIG.atomicBlockTags = v.split(',');
                await this.i18n.saveSettings();
            })
        );

    }
}