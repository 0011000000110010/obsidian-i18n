import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { t } from "src/lang/inxdex";

// 编辑器模式
export default class I18nEditMode extends BaseSetting {
    main(): void {
        const i18nEditMode = new Setting(this.containerEl);
        i18nEditMode.setName(t('SETTING_EDITOR_NAME'));
        i18nEditMode.setDesc(t('SETTING_EDITOR_DESC'));
        i18nEditMode.addToggle(cb => cb
            .setValue(this.settings.I18N_EDIT_MODE)
            .onChange(() => {
                this.settings.I18N_EDIT_MODE = !this.settings.I18N_EDIT_MODE;
                this.i18n.saveSettings();
                this.settingTab.basisDisplay();
            })
            .toggleEl.addClass('i18n-checkbox')
        );
        // const i18nTranslationEdit = new Setting(this.containerEl);
        // if (!(this.settings.I18N_EDIT_MODE)) i18nTranslationEdit.setClass('i18n--hidden');
        // i18nTranslationEdit.addText(cb => cb
        //     .setPlaceholder('编辑器地址')
        //     .onChange((value) => {
        //         console.log(value);
        //     })
        // )
        // i18nTranslationEdit.setName('译文编辑器');
        // i18nTranslationEdit.setDesc('使用什么编辑器打开译文文件(默认: 插件编辑器)');
        // i18nTranslationEdit.addButton(cb => cb
        //     .setButtonText('选择')
        //     .onClick(() => {
        //         const input = document.createElement('input');
        //         input.type = 'file';
        //         input.style.display = 'none';
        //         input.addEventListener('change', function (event) {
        //             // @ts-ignore
        //             const file = event.target != null ? event.target.files[0] : '';
        //             console.log(file.path);
        //         });
        //         input.click();
        //         // this.settings.I18N_EDIT_MODE = !this.settings.I18N_EDIT_MODE;
        //         // this.i18n.saveSettings();
        //         // this.settingTab.display();
        //     })
        // );

        // const i18nMainEdit = new Setting(this.containerEl);
        // if (!(this.settings.I18N_EDIT_MODE)) i18nMainEdit.setClass('i18n--hidden');
        // i18nMainEdit.addText(cb => cb
        //     .setValue(this.settings.I18N_EDIT_MAIN_PATH)
        //     .setPlaceholder('编辑器地址')
        //     .onChange((value) => {
        //         this.settings.I18N_EDIT_MAIN_PATH = value;
        //         this.i18n.saveSettings();
        //         this.settingTab.display();
        //     })
        // )
        // i18nMainEdit.setName('Main.JS编辑器');
        // i18nMainEdit.setDesc('使用什么编辑器打开Main.JS文件(默认: 文本编辑器)');
        // i18nMainEdit.addButton(cb => cb
        //     .setButtonText('选择')
        //     .onClick(() => {
        //         let tempPath = '';
        //         const input = document.createElement('input');
        //         input.type = 'file';
        //         input.style.display = 'none';
        //         input.addEventListener('change', function (event) {
        //             // @ts-ignore
        //             const file = event.target != null ? event.target.files[0] : '';
        //             tempPath = file.path;
        //             // console.log(file.path);
        //         });
        //         input.click();

        //         this.settings.I18N_EDIT_MAIN_PATH = tempPath;
        //         this.i18n.saveSettings();
        //         this.settingTab.display();
        //     })
        // );
    }
}