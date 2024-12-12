import { Setting } from "obsidian";
import BaseSetting from "../base-setting";
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
        const i18nNitBaiDuFrom = new Setting(this.containerEl);
        if (!(this.settings.I18N_NIT_API == 'BAIDU')) i18nNitBaiDuFrom.setClass('i18n--hidden');
        i18nNitBaiDuFrom.setName(t('设置_AI_百度_原始语言_标题'));
        i18nNitBaiDuFrom.setDesc(t('设置_AI_百度_原始语言_描述'));
        i18nNitBaiDuFrom.addDropdown(cb => cb
            .addOptions(from_lang)
            .setValue(this.settings.I18N_NIT_APIS.BAIDU.FROM)
            .onChange((value) => {
                this.settings.I18N_NIT_APIS.BAIDU.FROM = value
                this.i18n.saveSettings();
            }).selectEl.addClass('i18n-select')
        );

        const i18nNitBaiDuTo = new Setting(this.containerEl);
        if (!(this.settings.I18N_NIT_API == 'BAIDU')) i18nNitBaiDuTo.setClass('i18n--hidden');
        i18nNitBaiDuTo.setName(t('设置_AI_百度_目标语言_标题'));
        i18nNitBaiDuTo.setDesc(t('设置_AI_百度_目标语言_描述'));
        i18nNitBaiDuTo.addDropdown(cb => cb
            .addOptions(to_lang)
            .setValue(this.settings.I18N_NIT_APIS.BAIDU.TO)
            .onChange((value) => {
                this.settings.I18N_NIT_APIS.BAIDU.TO = value
                this.i18n.saveSettings();
            }).selectEl.addClass('i18n-select')
        );

        const i18nNitBaiDuAppID = new Setting(this.containerEl);
        if (!(this.settings.I18N_NIT_API == 'BAIDU')) i18nNitBaiDuAppID.setClass('i18n--hidden');
        i18nNitBaiDuAppID.setName(t('设置_AI_百度_标识_标题'));
        i18nNitBaiDuAppID.setDesc(t('设置_AI_百度_标识_描述'));
        i18nNitBaiDuAppID.addText(cb => cb
            .setValue(this.settings.I18N_NIT_APIS.BAIDU.APP_ID)
            .setPlaceholder('APPID')
            .onChange((value) => {
                this.settings.I18N_NIT_APIS.BAIDU.APP_ID = value
                this.i18n.saveSettings();
            }).inputEl.addClass('i18n-input')
        );

        const i18nNitBaiDuAppIDKey = new Setting(this.containerEl);
        if (!(this.settings.I18N_NIT_API == 'BAIDU')) i18nNitBaiDuAppIDKey.setClass('i18n--hidden');
        i18nNitBaiDuAppIDKey.setName(t('设置_AI_百度_密钥_标题'));
        i18nNitBaiDuAppIDKey.setDesc(t('设置_AI_百度_密钥_描述'));
        i18nNitBaiDuAppIDKey.addText(cb => cb
            .setValue(this.settings.I18N_NIT_APIS.BAIDU.KEY)
            .setPlaceholder('KEY')
            .onChange((value) => {
                this.settings.I18N_NIT_APIS.BAIDU.KEY = value
                this.i18n.saveSettings();
            }).inputEl.addClass('i18n-input')
        );
    }
}