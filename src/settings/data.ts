import { BAIDU } from '../types';

export interface I18nSettings {
	/**
	 * 基础 翻译语言
	 * @default zh-cn
	 */
	I18N_LANGUAGE: string,
	I18N_BATCH: boolean;
	I18N_LDT_MODE: boolean,
	I18N_LDT_GENERATE: boolean,
	I18N_NDT_MODE: boolean,
	I18N_NIT_API: string,
	I18N_NDT_APIS: Record<string, string>
	I18N_NIT_MODE: boolean,
	I18N_NIT_APIS: {
		BAIDU: BAIDU
	}
}

export const DEFAULT_SETTINGS: I18nSettings = {
	I18N_LANGUAGE: 'zh-cn',
	I18N_BATCH: false,
	I18N_LDT_MODE: true,
	I18N_LDT_GENERATE: false,
	I18N_NDT_MODE: false,
	I18N_NDT_APIS: {
		"zh-cn": "https://raw.githubusercontent.com/0011000000110010/obsidian-i18n/main/lang/zh-cn"
	},
	I18N_NIT_MODE: false,
	I18N_NIT_API: 'BAIDU',
	I18N_NIT_APIS: {
		BAIDU: {
			FROM: 'auto',
			TO: 'zh',
			APP_ID: '',
			KEY: ''
		}
	}
}
