import { App } from "obsidian";
import I18N from "./main";
import { I18NPluginModal } from "./modal/i18n-plugin-modal";
import { WizardModal } from "./modal/i18n-wizard-modal";
import { t } from "./lang/inxdex";

const Commands = (app: App, i18n: I18N) => {
    i18n.addCommand({
        id: 'i18n-translate',
        name: t('命令_打开翻译面板'),
        callback: () => { new I18NPluginModal(app, i18n).open() }
    });
    i18n.addCommand({
        id: 'i18n-help',
        name: t('命令_打开帮助面板'),
        callback: () => { new WizardModal(app, i18n).open() }
    });
}

export default Commands