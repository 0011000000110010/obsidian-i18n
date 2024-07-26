/** 状态 */
export interface State {
	/** 状态 */
	state: boolean;
	/** 插件版本 */
	pluginVersion: string;
	/** 译文版本 */
	translationVersion: string;
}

/** 百度API */
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

/** 百度语言类型 */
export interface LangBAIDU {
	/** 自动识别 */
	auto?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[code: string]: any,
}

/** 译文类型 */
export interface Translation {
	/** 基础信息 */
	manifest: {
		author: string
		version: string
	},
	/** 翻译字典 */
	dict: Record<string, string>
}
