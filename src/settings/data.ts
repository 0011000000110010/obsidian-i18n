import { BAIDU } from '../data/types';

export interface I18nSettings {
	I18N_UUID: string;
	I18N_WIZARD: boolean;
	// 翻译语言
	I18N_LANGUAGE: string;

	I18N_MODE_LDT: boolean,
	I18N_MODE_NDT: boolean,
	I18N_MODE_NIT: boolean,

	// 签名
	I18N_AUTHOR: string;
	// 自动更新
	I18N_AUTOMATIC_UPDATE: boolean;
	// 译文编辑
	I18N_EDIT_MODE: boolean;
	// 打开设置
	I18N_OPEN_SETTINGS: boolean;
	// 译文提交
	I18N_SUBMIT_TRANSLATION_MODE: boolean;
	// 译文求译
	I18N_REQUEST_TRANSLATION_MODE: boolean;
	// 忽略插件
	I18N_IGNORE: boolean;

	// 匹配配置
	I18N_RE_MODE: string;
	I18N_RE_FLAGS: string;
	I18N_RE_LENGTH: number;
	I18N_RE_MODE_EDIT: boolean,
	I18N_RE_MODE_DISPLAY: boolean;
	I18N_RE_DATAS_DISPLAY: boolean;
	I18N_RE_MODES: string[];
	I18N_RE_DATAS: Record<string, string[]>;

	I18N_NIT_API: string;
	I18N_NIT_API_INTERVAL: number,

	I18N_NDT_APIS_DISPLAY: boolean;
	I18N_NDT_APIS: Record<string, string>;
	I18N_NIT_APIS: {
		BAIDU: BAIDU
	};

	I18N_NIT_OPENAI_URL: string,
	I18N_NIT_OPENAI_KEY: string,
	I18N_NIT_OPENAI_MODEL: string,
	I18N_NIT_OPENAI_TIPS: string,

	I18N_SEARCH_TEXT: string,
	I18N_SORT: string;
	I18N_TYPE: string;
}

export const DEFAULT_SETTINGS: I18nSettings = {
	I18N_UUID: '',
	I18N_WIZARD: true,
	I18N_LANGUAGE: 'zh-cn',

	I18N_MODE_LDT: true,
	I18N_MODE_NDT: false,
	I18N_MODE_NIT: false,
	// 签字
	I18N_AUTHOR: '',
	// 自动更新
	I18N_AUTOMATIC_UPDATE: false,
	// 译文编辑
	I18N_EDIT_MODE: true,
	// 打开设置
	I18N_OPEN_SETTINGS: false,
	// 译文提交
	I18N_SUBMIT_TRANSLATION_MODE: true,
	// 译文求译
	I18N_REQUEST_TRANSLATION_MODE: false,
	// 忽略插件
	I18N_IGNORE: true,

	// 匹配模式配置
	I18N_RE_MODE: '默认',
	I18N_RE_FLAGS: 'gs',
	I18N_RE_LENGTH: 300,
	I18N_RE_MODE_EDIT: false,
	I18N_RE_MODE_DISPLAY: false,
	I18N_RE_DATAS_DISPLAY: false,
	I18N_RE_MODES: ['默认'],
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

	// 网络文件配置
	I18N_NDT_APIS_DISPLAY: false,
	I18N_NDT_APIS: {
		"zh-cn": "https://gitee.com/zero--two/obsidian-i18n-translation/raw/master/zh-cn/"
	},

	// 网络接口配置
	I18N_NIT_API: 'BAIDU',
	I18N_NIT_API_INTERVAL: 500,
	I18N_NIT_APIS: {
		BAIDU: {
			FROM: 'auto',
			TO: 'zh',
			APP_ID: '',
			KEY: ''
		}
	},

	I18N_NIT_OPENAI_URL: 'https://api.openai.com',
	I18N_NIT_OPENAI_KEY: '',
	I18N_NIT_OPENAI_MODEL: 'gpt-3.5-turbo',
	I18N_NIT_OPENAI_TIPS: '你是一个翻译工作者，你将进行obsidian笔记软件的插件翻译，本次翻译的插件名称为: ${plugin}，请结合插件名称以及软件翻译的标准进行后续工作，因为大多数文本长度较短，请以符合中文习惯的方式翻译。接下来我会提交给你很多英文文本，请将其翻译为简体中文，并且只返回给我翻译后的内容',

	I18N_SEARCH_TEXT: '',
	I18N_SORT: '0',
	I18N_TYPE: '0'
}
