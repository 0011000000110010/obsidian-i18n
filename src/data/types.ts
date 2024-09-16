export interface State {
	/** 状态 */
	state: boolean;
	/** 插件版本 */
	pluginVersion: string;
	/** 译文版本 */
	translationVersion: string;
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

export interface Translation {
	manifest: {
		id: string
		author: string
		version: string
		pluginVersion: string
	}
	description: {
		original: string
		translation: string
	}
	dict: Record<string, string>
}

export interface Manifest {
	id: string
	translations: Array<{
		author: string;
		translationVersion: string;
		pluginVersion: string;
	}>;
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

