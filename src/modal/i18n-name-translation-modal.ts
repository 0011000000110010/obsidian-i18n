import * as path from 'path';
import * as fs from 'fs-extra';
import { App, ButtonComponent, Modal, Setting, TextComponent } from 'obsidian';
import I18N from 'main';

export class NameTranslationModal extends Modal {
    i18n: I18N;
    constructor(app: App, i18n: I18N) {
        super(app);
        this.i18n = i18n;
        this.i18n.originalPluginsManifests.forEach(manifest => { if (manifest.name && !(manifest.name in this.i18n.nameTranslationJSON) && manifest.id != 'i18n') { this.i18n.nameTranslationJSON[manifest.name] = ''; } });
        // @ts-ignore
        fs.writeJSONSync(path.join(path.normalize(this.app.vault.adapter.getBasePath()), path.join(this.i18n.manifest.dir, 'name.json')), this.i18n.nameTranslationJSON, { spaces: 4 });
    }

    public async showHead() {
        this.contentEl.addClass('i18n__item-box');
        //@ts-ignore
        const modalEl: HTMLElement = this.contentEl.parentElement;
        modalEl.addClass('i18n-name__container');
        modalEl.removeChild(modalEl.getElementsByClassName('modal-close-button')[0]);
        this.titleEl.addClass('i18n-share-history__title-box');

        const titleSetting = new Setting(this.titleEl);
        titleSetting.setClass('i18n-share-history__title');
        titleSetting.setName('插件列表');

        const exitButton = new ButtonComponent(titleSetting.controlEl);
        exitButton.setClass('i18n-button');
        exitButton.setClass('i18n-button--primary');
        exitButton.setButtonText('退出');
        exitButton.onClick(() => { this.close() });
    }

    public async showMain() {
        for (const key in this.i18n.nameTranslationJSON) {
            // ====================
            // 插件介绍头部
            // ====================
            const itemEl = new Setting(this.contentEl);
            itemEl.setClass('i18n__item');
            itemEl.nameEl.addClass('i18n__item-title');
            itemEl.infoEl.remove();

            const keyInput = new TextComponent(itemEl.controlEl);
            keyInput.inputEl.addClass('i18n-name__input-auto')
            keyInput.setValue(key);
            keyInput.setDisabled(true);

            const valueInput = new TextComponent(itemEl.controlEl);
            valueInput.inputEl.addClass('i18n-name__input-auto')
            valueInput.setValue(this.i18n.nameTranslationJSON[key])
            valueInput.onChange((value) => {
                this.i18n.nameTranslationJSON[key] = value;
                // @ts-ignore
                fs.writeJSONSync(path.join(this.app.vault.adapter.getBasePath(), path.join(this.i18n.manifest.dir, 'name.json')), this.i18n.nameTranslationJSON, { spaces: 4 });
                this.i18n.reloadPluginsName();
            });
        }
    }

    async reloadShowData() {
        let scrollTop = 0;
        const modalElement: HTMLElement = this.contentEl;
        scrollTop = modalElement.scrollTop;
        modalElement.empty();
        await this.showMain();
        modalElement.scrollTo(0, scrollTop);
    }

    async onOpen() {
        await this.showHead();
        await this.showMain();
    }

    async onClose() {
        this.contentEl.empty();
    }
}