import { App } from "obsidian";
import I18N from "./main";
import { I18NModal } from "./modal/i18n-modal";
import { WizardModal } from "./modal/i18n-wizard-modal";

const Commands = (app: App, i18n: I18N) => {
    i18n.addCommand({
        id: "i18n-translate",
        name: "打开翻译面板",
        callback: () => { new I18NModal(app, i18n).open() }
    });
    i18n.addCommand({
        id: "i18n-help",
        name: "打开帮助面板",
        callback: () => { new WizardModal(app, i18n).open() }
    });
}

export default Commands