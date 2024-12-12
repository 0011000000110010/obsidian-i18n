import { BAIDU, PageRule } from '../data/types';

export interface I18nSettings {
	// ==============================
	//         基础设置
	// ==============================
	// 是否同意
	I18N_AGREEMENT: boolean;
	// 首次向导
	I18N_WIZARD: boolean;
	// UUID
	I18N_UUID: string;
	// 翻译语言
	I18N_LANGUAGE: string;
	// 主题色
	I18N_COLOR: string;
	// 签名
	I18N_AUTHOR: string;
	// 译文编辑
	I18N_EDIT_MODE: boolean;
	// 打开设置
	I18N_OPEN_SETTINGS: boolean;
	// 检查更新
	I18N_CHECK_UPDATES: boolean;
	// 网络文件配置
	I18N_SEARCH_TEXT: string;
	// 排序
	I18N_SORT: string;
	// 类型
	I18N_TYPE: string;

	I18N_MODE: number;

	I18N_NOTICE: boolean;

	I18N_START_TIME: boolean;



	// ==============================
	//         本地模式
	// ==============================
	I18N_MODE_LDT: boolean;
	// 词典重载
	I18N_AUTOMATIC_UPDATE: boolean;
	// 增量提取
	I18N_INCREMENTAL_EXTRACTION: boolean;
	// 名称翻译
	I18N_NAME_TRANSLATION: boolean;
	// 名称翻译 前缀
	I18N_NAME_TRANSLATION_PREFIX: string;
	// 名称翻译 后缀
	I18N_NAME_TRANSLATION_SUFFIX: string;
	I18N_STYLE_SETTINGS: string;

	// ==============================
	//         云端模式
	// ==============================
	I18N_MODE_NDT: boolean;
	// 忽略插件
	I18N_IGNORE: boolean;
	I18N_NDT_URL: string;

	// ==============================
	//         机器翻译
	// ==============================
	I18N_MODE_NIT: boolean;
	I18N_NIT_API: string;
	I18N_NIT_API_INTERVAL: number;
	I18N_NIT_APIS: { BAIDU: BAIDU };
	I18N_NIT_OPENAI_URL: string;
	I18N_NIT_OPENAI_KEY: string;
	I18N_NIT_OPENAI_MODEL: string;
	I18N_NIT_OPENAI_TIPS: string;

	// ==============================
	//         沉浸翻译
	// ==============================
	I18N_MODE_IMT: boolean;
	I18N_IMT_CONFIG: PageRule;

	// ==============================
	//         共建云端
	// ==============================
	// 译文提交
	I18N_SHARE_MODE: boolean;
	// 提交token
	I18N_SHARE_TOKEN: string;

	I18N_ADMIN_MODE: boolean;
	I18N_ADMIN_VERIFY: boolean;
	I18N_ADMIN_TOKEN: string;

	// ==============================
	//         正则匹配
	// ==============================
	I18N_RE_TEMP: string;
	I18N_RE_TEMP_MODE: boolean;
	I18N_RE_MODE: string;
	I18N_RE_FLAGS: string;
	I18N_RE_LENGTH: number;
	I18N_RE_MODE_EDIT: boolean,
	I18N_RE_MODE_DISPLAY: boolean;
	I18N_RE_DATAS_DISPLAY: boolean;
	I18N_RE_MODES: string[];
	I18N_RE_DATAS: Record<string, string[]>;

	// ==============================
	//         Styles
	// ==============================
	I18N_TAG_TYPE: string;
	I18N_TAG_SHAPE: string;
	I18N_BUTTON_TYPE: string;
	I18N_BUTTON_SHAPE: string;
}

export const DEFAULT_SETTINGS: I18nSettings = {
	// ==============================
	//         基础设置
	// ==============================
	// 同意
	I18N_AGREEMENT: false,
	// 首次向导
	I18N_WIZARD: true,
	// UUID
	I18N_UUID: '',
	// 翻译语言
	I18N_LANGUAGE: 'zh-cn',
	// 主题色
	I18N_COLOR: '#409EFF',
	// 签名
	I18N_AUTHOR: '',
	// 译文编辑
	I18N_EDIT_MODE: true,
	// 打开设置
	I18N_OPEN_SETTINGS: true,
	// 检查更新
	I18N_CHECK_UPDATES: true,
	// 网络文件配置
	I18N_SEARCH_TEXT: '',
	// 排序
	I18N_SORT: '0',
	// 类型
	I18N_TYPE: '0',

	I18N_MODE: 0,

	I18N_NOTICE: true,

	I18N_START_TIME: true,

	// ==============================
	//         本地模式
	// ==============================
	I18N_MODE_LDT: true,
	// 自动更新
	I18N_AUTOMATIC_UPDATE: false,
	// 增量提取
	I18N_INCREMENTAL_EXTRACTION: false,
	// 名称翻译
	I18N_NAME_TRANSLATION: false,
	// 名称翻译 前缀
	I18N_NAME_TRANSLATION_PREFIX: '[',
	// 名称翻译 后缀
	I18N_NAME_TRANSLATION_SUFFIX: ']',

	I18N_STYLE_SETTINGS: 'obsidian-style-settings',

	// ==============================
	//         云端模式
	// ==============================
	I18N_MODE_NDT: true,
	// 忽略插件
	I18N_IGNORE: false,
	I18N_NDT_URL: 'gitee',

	// ==============================
	//         机器翻译
	// ==============================
	I18N_MODE_NIT: false,
	I18N_NIT_API: 'BAIDU',
	I18N_NIT_API_INTERVAL: 500,
	I18N_NIT_APIS: {
		BAIDU: { FROM: 'auto', TO: 'zh', APP_ID: '', KEY: '' }
	},
	I18N_NIT_OPENAI_URL: 'https://api.openai.com',
	I18N_NIT_OPENAI_KEY: '',
	I18N_NIT_OPENAI_MODEL: 'gpt-3.5-turbo',
	I18N_NIT_OPENAI_TIPS: '你是一个翻译工作者，你将进行obsidian笔记软件的插件翻译，本次翻译的插件名称为: ${plugin}，请结合插件名称以及软件翻译的标准进行后续工作，因为大多数文本长度较短，请以符合中文习惯的方式翻译。接下来我会提交给你很多英文文本，请将其翻译为简体中文，并且只返回给我翻译后的内容',

	// ==============================
	//         沉浸翻译
	// ==============================
	I18N_MODE_IMT: false,
	I18N_IMT_CONFIG: {
		selectors: [
			"*"
		],
		excludeSelectors: [
			".modal .i18n__container"
		],
		excludeTags: [],
		additionalSelectors: [],
		additionalExcludeSelectors: [],
		additionalExcludeTags: [],
		stayOriginalSelectors: [],
		stayOriginalTags: [],
		atomicBlockSelectors: [],
		atomicBlockTags: []
	},

	// ==============================
	//         共建云端
	// ==============================
	// 模式开关
	I18N_SHARE_MODE: true,
	// 提交token
	I18N_SHARE_TOKEN: '',

	I18N_ADMIN_MODE: false,
	I18N_ADMIN_VERIFY: false,
	I18N_ADMIN_TOKEN: '',


	// ==============================
	//         正则匹配
	// ==============================
	I18N_RE_TEMP_MODE: true,
	I18N_RE_TEMP: '',
	I18N_RE_MODE: '默认',
	I18N_RE_FLAGS: 'gs',
	I18N_RE_LENGTH: 300,
	I18N_RE_MODE_EDIT: false,
	I18N_RE_MODE_DISPLAY: false,
	I18N_RE_DATAS_DISPLAY: false,
	I18N_RE_MODES: ['默认'],
	I18N_RE_DATAS: {
		'默认': [
			"Notice\\(\\s*(.+?)\\s*\\)",
			".log\\(\\s*(.+?)\\s*\\)",
			".error\\(\\s*(.+?)\\s*\\)",
			"t\\s*=\\s*:\\s*(['\"`])(.+?)\\1",
			".textContent\\s*=\\s*:\\s*(['\"`])(.+?)\\1",
			"name\\s*:\\s*(['\"`])(.+?)\\1",
			"description\\s*:\\s*(['\"`])(.+?)\\1",
			"selection\\s*:\\s*(['\"`])(.+?)\\1",
			"annotation\\s*:\\s*(['\"`])(.+?)\\1",
			"link\\s*:\\s*(['\"`])(.+?)\\1",
			"text\\s*:\\s*(['\"`])(.+?)\\1",
			"search\\s*:\\s*(['\"`])(.+?)\\1",
			"speech\\s*:\\s*(['\"`])(.+?)\\1",
			"page\\s*:\\s*(['\"`])(.+?)\\1",
			"settings\\s*:\\s*(['\"`])(.+?)\\1",
			".setText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setButtonText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setName\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setDesc\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setPlaceholder\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setTooltip\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".appendText\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".setTitle\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".addHeading\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".renderMarkdown\\(\\s*(['\"`])(.+?)\\1\\s*\\)",
			".innerText\\s*=\\s*(['\"`]).*?\\1"
		]
	},

	// ==============================
	//         Styles
	// ==============================
	I18N_TAG_TYPE: 'light',
	I18N_TAG_SHAPE: 'square',
	I18N_BUTTON_TYPE: 'default',
	I18N_BUTTON_SHAPE: 'square',
}
