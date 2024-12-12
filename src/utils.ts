import * as fs from 'fs-extra'
import { App, Notice, PluginManifest } from 'obsidian';
import { OBThemeManifest, State as state, Theme, Plugin, ValidationOptions } from './data/types';
import { t } from './lang/inxdex';
import { deflateSync, inflateSync } from 'zlib';
import I18N from './main';
import { exec } from 'child_process';
import { diffWords } from 'diff';

// ==============================
//            状态管理类
// ==============================
export class State {
	i18n: I18N;
	path: string;
	stateJson: state = { 'type': '0', 'state': false, 'pluginVersion': '', 'translationVersion': 0 }
	isStateDoc: boolean;
	stateObj: state;

	constructor(i18n: I18N, path: string) {
		this.path = path;
		this.isStateDoc = fs.pathExistsSync(this.path);
		this.stateObj = this.isStateDoc ? fs.readJsonSync(this.path) : undefined;
	}

	public getType(): string { return this.stateObj.type }
	public getState(): boolean { return this.stateObj.state }
	public getPluginVersion(): string { return this.stateObj.pluginVersion }
	public getTranslationVersion(): number { return this.stateObj.translationVersion }

	public setType(v: string) { this.stateObj.type = v; fs.outputJsonSync(this.path, this.stateObj); }
	public setState(v: boolean) { this.stateObj.state = v; fs.outputJsonSync(this.path, this.stateObj); }
	public setPluginVersion(v: string) { this.stateObj.pluginVersion = v; fs.outputJsonSync(this.path, this.stateObj); }
	public setTranslationVersion(v: number) { this.stateObj.translationVersion = v; fs.outputJsonSync(this.path, this.stateObj); }

	// 增
	public insert() {
		try {
			this.stateObj = this.stateJson;
			this.isStateDoc = true;
			fs.outputJsonSync(this.path, this.stateJson);
		} catch (e) {
			this.i18n.notice.result('新增状态文件', false, e);
		}
	}

	// 删
	public delete() {
		try {
			this.isStateDoc = false;
			fs.removeSync(this.path);
		} catch (e) {
			this.i18n.notice.result('删除状态文件', false, e);
		}
	}

	// 改
	public update(t: string, s: boolean, p: string, v: number) {
		const state: state = { 'type': t, 'state': s, 'pluginVersion': p, 'translationVersion': v };
		this.stateObj = state;
		try { fs.outputJsonSync(this.path, state); } catch (e) { this.i18n.notice.result('修改状态文件', false, e); }
	}

	// [重置]
	public reset() { try { fs.outputJsonSync(this.path, this.stateJson); console.log(this.stateJson) } catch (e) { this.i18n.notice.result('重置状态文件', false, e); } }
}

export class Notification {
	app: App;
	i18n: I18N;
	notices: Notice[] = [];
	constructor(app: App, i18n: I18N) {
		this.app = app;
		this.i18n = i18n;
	}
	primary(prefix: string, text: unknown, duration = 4000) {
		const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
		const notice = new Notice(`[${prefix}] ${text}`, duration)
		notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--primary`);
		this.addNotice(notice);
	}
	success(prefix: string, text: unknown, duration = 4000) {
		const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
		const notice = new Notice(`[${prefix}] ${text}`, duration)
		notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--success`);
		this.addNotice(notice);
	}
	info(prefix: string, text: unknown, duration = 4000) {
		const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
		const notice = new Notice(`[${prefix}] ${text}`, duration)
		notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--info`);
		this.addNotice(notice);
	}
	warning(prefix: string, text: unknown, duration = 4000) {
		const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
		const notice = new Notice(`[${prefix}] ${text}`, duration);
		notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--warning`);
		this.addNotice(notice);
	}
	error(prefix: string, text: unknown, duration = 10000) {
		const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
		const notice = new Notice(`[${prefix}] ${text}`, duration);
		notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--error`);
		this.addNotice(notice);
	}
	result(prefix: string, isSuccess: boolean, text: unknown = "", duration = 4000) {
		const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
		if (isSuccess) {
			if (text != "") {
				const notice = new Notice(`[${prefix}] ${t('通用_成功_文本')}\n${text}`, duration)
				notice.noticeEl.addClass(`notice__${hasClass ? 'dark' : 'light'}--success`)
				this.addNotice(notice);
			}
			else {
				const notice = new Notice(`[${prefix}] ${t('通用_成功_文本')}`, duration)
				notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--success`);
				this.addNotice(notice);
			}
		} else {
			const notice = new Notice(`[${prefix}] ${t('通用_失败_文本')}\n${text}`, 10000)
			notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--error`);
			this.addNotice(notice);
		}
	}
	reload() {
		// for (const notice of this.notices) { notice.noticeEl.remove(); }
		this.notices.forEach(notice => notice.noticeEl.remove());
		this.notices.length = 0;
	}

	private addNotice(notice: Notice) {
		if (this.notices.length >= 100) {
			this.notices[0].noticeEl.remove();
			this.notices.shift();
		}
		this.notices.push(notice);
	}
}

/**
 * 生成插件的翻译 JSON 对象。
 * @param pluginVersion - 插件的版本号。
 * @param manifestJSON - 插件的manifest.json对象。
 * @param mainStr - 插件的主要字符串内容。
 * @param reLength - 正则表达式匹配的最大长度。
 * @param regexps - 用于匹配字符串的正则表达式数组。
 * @param flags - 正则表达式的标记。
 * @returns 一个包含翻译信息的 Translation 对象。
 */
export function generatePlugin(pluginVersion: string, manifestJSON: PluginManifest, mainStr: string, reLength: number, regexps: string[], flags: string): Plugin {
	const description = manifestJSON.description;
	const translationJson: Plugin = {
		'manifest': {
			'translationVersion': Date.now(),
			'pluginVersion': pluginVersion
		},
		'description': {
			'original': description,
			'translation': description
		},
		'dict': {}
	}

	for (let i = 0; i < regexps.length; i++) {
		const temp_array = mainStr.match(new RegExp(regexps[i], flags));
		if (temp_array != null)
			for (const i in temp_array)
				if (temp_array[i].length <= reLength)
					translationJson.dict[temp_array[i]] = temp_array[i]
	}
	return translationJson
}
/**
 * 生成主题的翻译 JSON 对象。
 * @param themeManifest - 主题的manifest.json对象。
 * @param themeStr - 主题的主要字符串内容。
 * @returns 一个包含翻译信息的 Theme 对象。
 */
export function generateTheme(themeManifest: OBThemeManifest, themeStr: string): Theme {
	const themeJson: Theme = {
		'manifest': {
			'translationVersion': 0,
			'pluginVersion': themeManifest.version
		},
		'dict': {}
	}
	// 执行匹配
	const match = themeStr.match(/(?:\/\* @settings)([\s\S]*?)(?:\*\/)/);
	if (match) {
		// 正则表达式匹配 title 和 label 后面的内容
		const regex = /title:\s*([^\n]*)|description:\s*([^\n]*)/mg;
		// 使用 match 方法获取所有匹配项
		const matches = match[0].match(regex);
		// 打印每个匹配项的捕获组内容
		if (matches) {
			matches.forEach(match => {
				themeJson.dict[match] = match;
			});
		}
	} else {
		// 没有找到匹配的内容
		console.log('没有找到匹配的内容');
	}
	return themeJson
}
/**
 * 比较两个版本号的大小。
 * @param version1 - 第一个版本号字符串。
 * @param version2 - 第二个版本号字符串。
 * @returns 如果 version1 大于 version2 返回 1，如果 version1 小于 version2 返回 -1，如果相等返回 0。
 */
export function compareVersions(version1: string, version2: string): number {
	const v1 = version1.split('.').map(Number);
	const v2 = version2.split('.').map(Number);
	const len = Math.max(v1.length, v2.length);
	for (let i = 0; i < len; i++) {
		const num1 = v1[i] || 0;
		const num2 = v2[i] || 0;
		if (num1 > num2) { return 1; }
		else if (num1 < num2) { return -1; }
	}
	return 0;
}

export function validateTranslation(json: Plugin, options: ValidationOptions = { checkFormat: true, checkVersion: true, checkTranslations: true }): boolean {
	// 自定义检查：检查整体格式  
	if (options.checkFormat && (!('manifest' in json) || !('description' in json) || !('dict' in json))) {
		this.i18n.notice.result('译文检查', false, '译文字段缺失');
		return false
	}
	// 自定义检查：检查作者  
	// if (options.checkAuthor && (typeof json.manifest !== 'object' || json.manifest === null || typeof json.manifest.author !== 'string' || json.manifest.author === '')) {
	// 	NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), false, t('SUBMITE_INSPECT_NOTICE_B'));
	// 	return false
	// }
	// 自定义检查：检查版本号
	// if (options.checkVersion && (typeof json.manifest !== 'object' || json.manifest === null || !/^\d+(\.\d+){2}$/.test(json.manifest.version))) {
	// 	NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), false, t('SUBMITE_INSPECT_NOTICE_E'));
	// 	return false
	// }

	// 自定义检查：检查翻译  
	// let count = 0;
	// if (options.checkTranslations && json.dict) { Object.keys(json.dict).forEach(key => { if (key !== json.dict[key]) count++ }); }

	// if ((count * 2) >= Object.keys(json.dict).length) {
	// 	NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), true, t('SUBMITE_INSPECT_NOTICE_C'))
	// 	return true
	// } else {
	// 	NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), false, t('SUBMITE_INSPECT_NOTICE_D'))
	// 	return false
	// }
	return true;
}

/**
 * 格式化时间戳为更易读的中文日期和时间格式。
 * @param timestamp - 要格式化的时间戳，单位为毫秒。
 * @returns 返回格式化后的日期和时间字符串，格式为 "月日 日:时"。
 */
export const formatTimestamp = (timestamp: number) => {
	const date = new Date(timestamp);
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const formattedDate = `${month}月${day}日 ${hours}:${minutes}`;
	return formattedDate;
}
/**
 * 格式化时间戳为简洁的日期和时间格式。
 * @param timestamp - 要格式化的时间戳，单位为毫秒。
 * @returns 返回格式化后的日期和时间字符串，格式为 "年/月/日 时:分"。
 */
export const formatTimestamp_concise = (timestamp: number) => {
	const date = new Date(timestamp);
	const [year, month, day, hours, minutes] = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0'), String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')];
	return `${year}/${month}/${day} ${hours}:${minutes}`;
}
/**
 * 对比两个插件译文，返回它们之间的差异。
 * @param oldTranslation - 旧译文对象。
 * @param newTranslation - 新译文对象。
 * @returns 一个对象，包含未改变、新增、修改和删除的插件译文。
 */
export const comparePlugin = (oldTranslation: Plugin, newTranslation: Plugin) => {
	const unchanged: Record<string, string> = {};
	const added: Record<string, string> = {};
	const removed: Record<string, string> = {};
	const modified: Record<string, { oldValue: string; newValue: string }> = {};

	for (const [key, value] of Object.entries(newTranslation.dict)) {
		if (!(key in oldTranslation.dict)) {
			added[key] = value;
		} else if (oldTranslation.dict[key] !== value) {
			modified[key] = { oldValue: oldTranslation.dict[key], newValue: value };
		} else {
			unchanged[key] = value;
		}
	}

	for (const [key, value] of Object.entries(oldTranslation.dict)) {
		if (!(key in newTranslation.dict)) {
			removed[key] = value;
		}
	}

	return { unchanged, added, modified, removed };
}
/**
 * 对比两个主题译文，返回它们之间的差异。
 * @param oldTranslation - 旧译文对象。
 * @param newTranslation - 新译文对象。
 * @returns 一个对象，包含未改变、新增、修改和删除的主题译文。
 */
export const compareTheme = (oldTranslation: Theme, newTranslation: Theme) => {
	const unchanged: Record<string, string> = {};
	const added: Record<string, string> = {};
	const removed: Record<string, string> = {};
	const modified: Record<string, { oldValue: string; newValue: string }> = {};

	for (const [key, value] of Object.entries(newTranslation.dict)) {
		if (!(key in oldTranslation.dict)) {
			added[key] = value;
		} else if (oldTranslation.dict[key] !== value) {
			modified[key] = { oldValue: oldTranslation.dict[key], newValue: value };
		} else {
			unchanged[key] = value;
		}
	}

	for (const [key, value] of Object.entries(oldTranslation.dict)) {
		if (!(key in newTranslation.dict)) {
			removed[key] = value;
		}
	}

	return { unchanged, added, modified, removed };
}
/**
 * 验证插件翻译文件是否具有有效的格式。
 * @param json - 待验证的翻译对象。
 * @returns 如果插件翻译对象存在且所有必要的属性都存在，则返回 true，否则返回 false。
 */
export const isValidpluginTranslationFormat = (pluginJson: Plugin | undefined) => {
	// 检查基本存在性
	if (!pluginJson) return false;
	// 检查必要的顶层属性
	const hasManifest = 'manifest' in pluginJson;
	const hasDict = 'dict' in pluginJson;
	const hasDescription = 'description' in pluginJson;
	// 检查manifest中的属性
	const hasTranslationVersion = hasManifest && 'translationVersion' in pluginJson.manifest;
	const hasPluginVersion = hasManifest && 'pluginVersion' in pluginJson.manifest;
	// 检查description中的属性
	const hasOriginal = hasDescription && 'original' in pluginJson.description;
	const hasTranslation = hasDescription && 'translation' in pluginJson.description;
	// 如果所有必要的属性都存在，则返回 true
	return hasManifest && hasTranslationVersion && hasPluginVersion && hasDict && hasDescription && hasOriginal && hasTranslation;
};
/**
 * 验证主题翻译文件是否具有有效的格式。
 * @param themeJson - 待验证的主题翻译对象。
 * @returns 如果主题翻译对象存在且所有必要的属性都存在，则返回 true，否则返回 false。
 */
export const isValidThemeTranslationFormat = (themeJson: Theme | undefined) => {
	// 检查主题对象是否存在
	if (!themeJson) return false;
	// 检查必要的属性是否存在
	const hasThemeManifest = 'manifest' in themeJson;
	const hasThemeTranslationVersion = hasThemeManifest && 'translationVersion' in themeJson.manifest;
	const hasThemeVersion = hasThemeManifest && 'pluginVersion' in themeJson.manifest;
	const hasThemeDict = 'dict' in themeJson;
	// 如果所有必要的属性都存在，则返回 true
	return hasThemeManifest && hasThemeTranslationVersion && hasThemeVersion && hasThemeDict;
}
/**
 * 压缩字符串。
 * 使用 deflateSync 函数同步压缩字符串，并将其转换为 Base64 编码的字符串。
 * @param str - 待压缩的原始字符串。
 * @returns Base64 编码的压缩字符串。
 */
export const deflate = (str: string) => { return deflateSync(str).toString('base64'); }
/**
 * 解压缩字符串。
 * 使用 inflateSync 函数同步解压缩 Base64 编码的字符串。
 * @param str - 待解压缩的 Base64 编码的压缩字符串。
 * @returns 解压缩后的原始字符串。
 */
export const inflate = (str: string) => { return inflateSync(Buffer.from(str, 'base64')).toString(); }
/**
 * 打开文件或文件夹的操作系统命令。
 * @param i18n - 国际化对象，用于显示操作结果的通知。
 * @param dir - 要打开的文件夹路径。
 * @description 根据操作系统执行相应的命令来打开文件夹。在Windows上使用'start'命令，在Mac上使用'open'命令。
 * 如果操作成功，显示成功通知；如果失败，显示错误通知。
 */
export const i18nOpen = (i18n: I18N, dir: string) => {
	if (navigator.userAgent.match(/Win/i)) {
		exec(`start "" "${dir}"`, (error) => {
			if (error) {
				i18n.notice.result(t('功能_打开_前缀'), false, error);
			} else {
				i18n.notice.result(t('功能_打开_前缀'), true);
			}
		});
	}
	if (navigator.userAgent.match(/Mac/i)) {
		exec(`open ${dir}`, (error) => {
			if (error) {
				i18n.notice.result(t('功能_打开_前缀'), false, error);
			} else {
				i18n.notice.result(t('功能_打开_前缀'), true);
			}
		});
	}
}
/**
 * 计算两个字符串之间的差异，并以HTML格式高亮显示。
 * 
 * @param s1 - 原始字符串。
 * @param s2 - 比较的字符串。
 * @returns - 一个对象，包含两个字段：s1和s2，分别代表原始字符串和比较字符串的差异高亮HTML。
 */
export const diff = (s1: string, s2: string) => {
	const differences = diffWords(s1, s2);
	let keyHighlightedHTML = "";
	let valueHighlightedHTML = "";
	differences.forEach((part: { added: unknown; removed: unknown; value: unknown; }) => {
		if (part.added) { valueHighlightedHTML += `<span class='color__text--success'>${part.value}</span>` }
		else if (part.removed) { keyHighlightedHTML += `<span class='color__text--danger'>${part.value}</span>` }
		else { keyHighlightedHTML += part.value; valueHighlightedHTML += part.value; }
	});
	return { s1: keyHighlightedHTML, s2: valueHighlightedHTML };
}
/**
	 * 解析问题标题，提取其中的三个主要部分。
	 * 问题标题格式定义为三个方括号包裹的部分组成，各部分间可以有任意数量的空格。
	 * @param title 问题标题字符串。
	 * @returns 一个包含三个字符串的数组，分别对应标题中的三个部分。
	 *         如果标题不符合预期格式，则返回三个空字符串。
	 */
export const parseIssueTitle = (title: string): [string, string, string] => {
	const regex = /\[(.*?)\]\s*\[(.*?)\]\s*\[(.*?)\]/;
	const match = title.match(regex);
	return match ? [match[1], match[2], match[3]] : ['', '', ''];
}
/**
 * 类型守卫函数，用于判断给定的对象是否为 Plugin 类型。
 * 
 * @param issueJson 可能是 Plugin 或 Theme 类型的对象。
 * @returns 如果 issueJson 是 Plugin 类型，则返回 true；否则返回 false。
 */
export const isPlugin = (issueJson: Plugin | Theme): issueJson is Plugin => {
	return (issueJson as Plugin).description !== undefined;
}
/**
 * 类型守卫函数，用于判断给定的对象是否为 Theme 类型。
 * 
 * @param issueJson 可能是 Plugin 或 Theme 类型的对象。
 * @returns 如果 issueJson 是 Theme 类型，则返回 true；否则返回 false。
 */
export const isTheme = (issueJson: Plugin | Theme): issueJson is Theme => {
	return (issueJson as Theme).dict !== undefined && !(issueJson as Plugin).description;
}
// 恢复翻译
export const restoreTranslate = () => {
	const event = new KeyboardEvent('keydown', { key: 'a', keyCode: 65, which: 65, code: 'KeyA', altKey: true, bubbles: true, });
	document.dispatchEvent(event);
};
// 清除 Storage 存储的内容
export const clearStorage = async () => {
	const prefix = 'immersiveTranslate';
	const keys = Object.keys(window.localStorage).filter((v) => v.startsWith(prefix));
	keys.forEach((v) => { delete window.localStorage[v]; });
	const dbPrefix = 'immersive-translate';
	await window.indexedDB.databases().then((dbList) => { dbList?.filter((v) => v.name?.startsWith(dbPrefix))?.forEach((v) => { v.name && window.indexedDB.deleteDatabase(v.name); }); }).catch(() => { });
	const windowKey = 'mmersiveTranslate';
	const windowKeys = Object.keys(window).filter((v) => v.indexOf(windowKey) !== -1);
	// @ts-ignore
	windowKeys.forEach((v) => { typeof window[v] !== 'undefined' && delete window[v]; });
};
export const escapeSpecialChars = (str: string) => {
	return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
}
export const unescapeSpecialChars = (str: string) => {
	return str.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
}

export const ai = async (i18n: I18N, s: string) => {
	switch (i18n.settings.I18N_NIT_API) {
		case 'BAIDU':
			return await i18n.tapi.baiduAPI(s);
		case 'OPENAI':
			return await i18n.tapi.openAI(s);
	}
}