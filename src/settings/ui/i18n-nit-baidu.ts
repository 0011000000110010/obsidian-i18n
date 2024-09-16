import { Setting } from "obsidian";
import BaseSetting from "./base-setting";
import { LangBAIDU } from "src/data/types";
import { t } from "src/lang/inxdex";

const from_lang: LangBAIDU = {
    'auto': '自动检测',
    'zh': '中文',
    'cht': '繁体中文',
    'yue': '粤语',
    'wyw': '文言文',
    'en': '英语',
    'jp': '日语',
    'kor': '韩语',
    'fra': '法语',
    'spa': '西班牙语',
    'th': '泰语',
    'ara': '阿拉伯语',
    'ru': '俄语',
    'pt': '葡萄牙语',
    'de': '德语',
    'it': '意大利语',
    'el': '希腊语',
    'nl': '荷兰语',
    'pl': '波兰语',
    'bul': '保加利亚语',
    'est': '爱沙尼亚语',
    'dan': '丹麦语',
    'fin': '芬兰语',
    'cs': '捷克语',
    'rom': '罗马尼亚语',
    'slo': '斯洛文尼亚语',
    'swe': '瑞典语',
    'hu': '匈牙利语',
    'vie': '越南语'
};
const to_lang: LangBAIDU = JSON.parse(JSON.stringify(from_lang));
delete to_lang.auto

export default class I18nNitBaiDu extends BaseSetting {
    main(): void {
        const i18nNitBaiDu = new Setting(this.containerEl);
        i18nNitBaiDu.setName(t('SETTING_NIT_BAIDU'));
        i18nNitBaiDu.setDesc(t('SETTING_NIT_BAIDU_DESC'));
        if (!(this.settings.I18N_MODE_NIT)) i18nNitBaiDu.setClass('i18n_display-none');
        if (!(this.settings.I18N_NIT_API == 'BAIDU')) i18nNitBaiDu.setClass('i18n_display-none');
        // FROM
        i18nNitBaiDu.addDropdown(cb => cb
            .addOptions(from_lang)
            .setValue(this.settings.I18N_NIT_APIS.BAIDU.FROM)
            .onChange((value) => {
                this.settings.I18N_NIT_APIS.BAIDU.FROM = value
                this.i18n.saveSettings();
            })
        );
        // TO
        i18nNitBaiDu.addDropdown(cb => cb
            .addOptions(to_lang)
            .setValue(this.settings.I18N_NIT_APIS.BAIDU.TO)
            .onChange((value) => {
                this.settings.I18N_NIT_APIS.BAIDU.TO = value
                this.i18n.saveSettings();
            })
        );
        // APPID
        i18nNitBaiDu.addText(cb => cb
            .setValue(this.settings.I18N_NIT_APIS.BAIDU.APP_ID)
            .setPlaceholder('APPID')
            .onChange((value) => {
                this.settings.I18N_NIT_APIS.BAIDU.APP_ID = value
                this.i18n.saveSettings();
            })
        );
        // KEY
        i18nNitBaiDu.addText(cb => cb
            .setValue(this.settings.I18N_NIT_APIS.BAIDU.KEY)
            .setPlaceholder('KEY')
            .onChange((value) => {
                this.settings.I18N_NIT_APIS.BAIDU.KEY = value
                this.i18n.saveSettings();
            })
        );
    }
}