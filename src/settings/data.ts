import { BAIDU } from '../data/types';

export interface I18nSettings {
	// 翻译语言
	I18N_LANGUAGE: string;
	// 模式选择
	I18N_MODE: string;
	// 自动更新
	I18N_AUTOMATIC_UPDATE: boolean;

	// 一键
	I18N_BATCH: boolean;
	// 签名
	I18N_AUTHOR: string;
	// 译文编辑
	I18N_EDIT_MODE: boolean;
	// 译文转换
	I18N_CONVERT_MODE: boolean;
	// 译文提交
	I18N_SUBMIT_REANSLATION_MODE: boolean;
	// 译文求译
	I18N_REQUEST_REANSLATION_MODE: boolean;


	I18N_LDT_MODE: boolean;
	I18N_NDT_MODE: boolean;
	I18N_NIT_API: string;

	I18N_NDT_APIS_DISPLAY: boolean;
	I18N_NDT_APIS: Record<string, string>;

	I18N_NIT_MODE: boolean;
	I18N_NIT_APIS: {
		BAIDU: BAIDU
	};

	// 邮箱配置
	I18N_EMAIL_EMAIL: string;
	I18N_EMAIL_KEY: string;

	// 匹配配置
	I18N_RE_MODE: string;
	I18N_RE_FLAGS: string;
	I18N_RE_MODE_DISPLAY: boolean;
	I18N_RE_MODES: string[];
	I18N_RE_DATAS_DISPLAY: boolean;
	I18N_RE_DATAS: Record<string, string[]>;

}

export const DEFAULT_SETTINGS: I18nSettings = {
	I18N_LANGUAGE: 'zh-cn',
	I18N_MODE: 'ldt',
	I18N_AUTOMATIC_UPDATE: false,
	I18N_BATCH: false,
	I18N_AUTHOR: '',
	I18N_LDT_MODE: true,

	// 译文编辑
	I18N_EDIT_MODE: false,
	// 译文转换
	I18N_CONVERT_MODE: false,
	// 译文提交
	I18N_SUBMIT_REANSLATION_MODE: false,
	// 译文求译
	I18N_REQUEST_REANSLATION_MODE: false,

	// 匹配模式配置
	I18N_RE_MODE: '默认',
	I18N_RE_FLAGS: 'gs',
	I18N_RE_MODES: ['默认'],
	I18N_RE_MODE_DISPLAY: false,
	I18N_RE_DATAS: {
		'默认': ["Notice\\(\\s*(.+?)\\s*\\)/gs",
			".setText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setButtonText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setName\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setDesc\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setPlaceholder\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setTooltip\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".appendText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".createEl\\((['\"`])([\\w:-]+)\\1,\\s*\\{\\s*text:\\s*(['\"`])(.+?)\\3\\s*\\}\\s*\\)",
			".innerText\\s*=\\s*(['\"`]).*?\\1"
		]
	},
	I18N_RE_DATAS_DISPLAY: false,

	// 网络文件配置
	I18N_NDT_MODE: false,
	I18N_NDT_APIS_DISPLAY: false,
	I18N_NDT_APIS: {
		"zh-cn": "https://gitee.com/zero--two/obsidian-i18n-translation/raw/master/zh-cn/"
	},

	// 网络接口配置
	I18N_NIT_MODE: false,
	I18N_NIT_API: 'BAIDU',
	I18N_NIT_APIS: {
		BAIDU: {
			FROM: 'auto',
			TO: 'zh',
			APP_ID: '',
			KEY: ''
		}
	},

	// 邮箱地址配置
	I18N_EMAIL_EMAIL: '',
	I18N_EMAIL_KEY: '',
}
