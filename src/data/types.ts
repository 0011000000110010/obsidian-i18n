export interface State {
	type: string,
	state: boolean;
	pluginVersion: string;
	translationVersion: number;
}

export interface BAIDU {
	/** 源语言 */
	FROM: string,
	/** 目标语言 */
	TO: string,
	/** APPID */
	APP_ID: string,
	/** 密钥 */
	KEY: string
}

export interface LangBAIDU {
	/** 自动识别 */
	auto?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[code: string]: any,
}


// 贡献者目录类型
export interface Contributor {
	login: string;
	name: string;
	url: string;
	translation: number;
	modification: number;
	erasure: number;
}

// [目录] 译文条目（单个译文对象）  
export interface TranslationDirectoryItem {
	id: string;
	translations: Record<string, number>;
}

// [目录] 译文条目集合（译文目录）
export type TranslationDirectory = TranslationDirectoryItem[];

export interface OBThemeManifest {
	name: string;
	version: string;
	minAppVersion: string;
	author: string;
	authorUrl: string;
}


// [译文] 声明
export interface PluginManifest {
	translationVersion: number
	pluginVersion: string
}
// [译文] 描述
export interface PluginDescription {
	original: string,
	translation: string
}
// [译文] 译文
export interface Plugin {
	manifest: PluginManifest
	description: PluginDescription
	dict: Record<string, string>
}
// [主题] 主题描述
export interface ThemeManifest {
	translationVersion: number
	pluginVersion: string
}
// [译文] 主题译文
export interface Theme {
	manifest: ThemeManifest
	dict: Record<string, string>
}




export type Languages = {
	[key: string]: string;
};

export type ApiTypes = {
	[key: string]: string;
};

export type BaiduErrorCode = {
	[key: string]: string;
};

export interface ValidationOptions {
	checkFormat?: boolean;
	checkAuthor?: boolean;
	checkVersion?: boolean;
	checkTranslations?: boolean;
}

export interface SubmitMark {
	id: string;
	name: string;
	type: number;
	number: string;
}

export interface NameTranslationJSON {
	[key: string]: string;
}
// https://immersivetranslate.com/docs/js-sdk/
export interface PageRule {
	excludeMatches?: string | string[]; // 排除特定的网站。
	selectorMatches?: string | string[]; // 用选择器来匹配，而无需指定所有url
	excludeSelectorMatches?: string | string[]; // 排除规则，同上。

	// 指定翻译范围
	selectors?: string[]; // 仅翻译匹配到的元素
	excludeSelectors?: string[]; // 排除元素，不翻译匹配的元素
	excludeTags?: string | string[]; // 排除Tags，不翻译匹配的Tag

	// 追加翻译范围，而不是覆盖
	additionalSelectors?: string | string[]; // 追加翻译范围。在智能翻译的区域，追加翻译位置。
	additionalExcludeSelectors?: string | string[]; // 追加排除元素，让智能翻译不翻译特定位置。
	additionalExcludeTags?: string | string[]; // 追加排除Tags

	// 保持原样
	stayOriginalSelectors?: string | string[]; // 匹配的元素将保持原样。常用于论坛网站的标签。
	stayOriginalTags?: string | string[]; // 匹配到的Tag将保持原样，比如 `code`

	// 区域翻译
	atomicBlockSelectors?: string | string[]; // 区域选择器, 匹配的元素将被视为一个整体, 不会分段翻译
	atomicBlockTags?: string | string[]; // 区域Tag选择器,  同上

	// Block or Inline
	extraBlockSelectors?: string | string[]; // 额外的选择器，匹配的元素将作为 block 元素，独占一行。
	extraInlineSelectors?: string | string[]; // 额外的选择器，匹配的元素将作为 inline 元素。

	inlineTags?: string | string[]; // 匹配的 Tag 将作为 inline 元素
	preWhitespaceDetectedTags?: string | string[]; // 匹配的 Tag 将自动换行

	// 译文样式
	translationClasses?: string | string | string[]; // 为译文添加额外的 Class

	// 全局样式
	globalStyles?: Record<string, string>; // 修改页面样式，若译文导致页面错乱，这个很有用。
	globalAttributes?: Record<string, Record<string, string>>; // 修改页面元素的属性

	// 嵌入样式
	injectedCss?: string | string[]; // 嵌入CSS样式
	additionalInjectedCss?: string | string[]; // 追加CSS样式，而不是直接覆盖。

	// 上下文
	wrapperPrefix?: string; // 译文区域的前缀，默认为 smart，根据字数决定是否换行。
	wrapperSuffix?: string; // 译文区域的后缀

	// 译文换行字数
	blockMinTextCount?: number; // 将译文作为 block 的最小字符数，否则译文为 inline 元素。
	blockMinWordCount?: number; // 同上。如果希望它们始终换行, 可以都填0.

	// 内容可翻译的最小字数
	containerMinTextCount?: number; // 智能识别时，元素最少包含的字符数，才会被翻译，默认为18
	paragraphMinTextCount?: number; // 原文段落的最小字符数, 大于数字的内容将被翻译
	paragraphMinWordCount?: number; // 原文段落的最小单词数

	// 长段落强制换行字数
	lineBreakMaxTextCount?: number; // 开启翻译长段落时，强制进行分行的段落最大字符数。

	// 启动翻译的时机
	urlChangeDelay?: number; // 进入页面后，延迟多少毫秒开始翻译。为了等网页的初始化，目前默认为250ms

	// AI streaming 翻译
	aiRule?: {
		streamingSelector: string; //gpt 网页中标记正在翻译元素的选择器
		messageWrapperSelector: string; // 消息正文选择器
		streamingChange: boolean; //类 gpt 网页反复的消息是增量更新还是全量更新。gpt 是增量
	};
}

export type ImtConfig = {
	pageRule: {
		[key in keyof PageRule]: PageRule[key];
	};
};

