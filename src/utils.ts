import * as fs from 'fs-extra'
import { App, Notice, PluginManifest, WorkspaceLeaf } from 'obsidian';
import { State as state, Translation, ValidationOptions } from './data/types';
import { t } from './lang/inxdex';
import { deflateSync, inflateSync } from 'zlib';
import I18N from './main';

// ==============================
//            状态管理类
// ==============================
export class State {
	i18n: I18N;
	path: string;
	stateJson: state = { 'type': '', 'state': false, 'pluginVersion': '', 'translationVersion': 0 }
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
				const notice = new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}\n${text}`, duration)
				notice.noticeEl.addClass(`notice__${hasClass ? 'dark' : 'light'}--success`)
				this.addNotice(notice);
			}
			else {
				const notice = new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}`, duration)
				notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--success`);
				this.addNotice(notice);
			}
		} else {
			const notice = new Notice(`[${prefix}] ${t('PUBLIC_FAILURE')}\n${text}`, 10000)
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
		console.log(this.notices);
	}
}

export function generateTranslation(pluginVersion: string, manifestJSON: PluginManifest, mainStr: string, reLength: number, regexps: string[], flags: string): Translation {
	const description = manifestJSON.description;
	const translationJson: Translation = {
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

export function validateTranslation(json: Translation, options: ValidationOptions = { checkFormat: true, checkVersion: true, checkTranslations: true }): boolean {
	// 自定义检查：检查整体格式  
	if (options.checkFormat && (!('manifest' in json) || !('description' in json) || !('dict' in json))) {
		this.i18n.notice.result(t('SUBMITE_INSPECT_HEAD'), false, t('SUBMITE_INSPECT_NOTICE_A'));
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

// export function NoticePrimary(prefix: string, text: unknown, duration = 4000) {
// 	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
// 	const notice = new Notice(`[${prefix}] ${text}`, duration);
// 	notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--primary`);
// 	return notice;
// }
// export function NoticeSuccess(prefix: string, text: unknown, duration = 4000) {
// 	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
// 	const notice = new Notice(`[${prefix}] ${text}`, duration);
// 	notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--success`);
// 	return notice;
// }
// export function NoticeInfo(prefix: string, text: unknown, duration = 4000) {
// 	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
// 	const notice = new Notice(`[${prefix}] ${text}`, duration);
// 	notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--info`);
// 	return notice;
// }
// export function NoticeWarning(prefix: string, text: unknown, duration = 4000) {
// 	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
// 	const notice = new Notice(`[${prefix}] ${text}`, duration);
// 	notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--warning`);
// 	return notice;
// }
// export function NoticeError(prefix: string, text: unknown, duration = 10000) {
// 	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
// 	const notice = new Notice(`[${prefix}] ${text}`, duration);
// 	notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--error`);
// 	return notice;
// }
// export function NoticeOperationResult(prefix: string, isSuccess: boolean, text: unknown = "", duration = 4000): Notice {
// 	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
// 	if (isSuccess) {
// 		if (text != "") {
// 			const notice = new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}\n${text}`, duration)
// 			notice.noticeEl.addClass(`notice__${hasClass ? 'dark' : 'light'}--success`)
// 			// new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}\n${text}`, duration).noticeEl.addClass(`notice__${hasClass ? 'dark' : 'light'}_success`)
// 			return notice;
// 		}
// 		else {
// 			const notice = new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}`, duration)
// 			notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--success`);
// 			// new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}`, duration).noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}_success`); 
// 			return notice
// 		}
// 	} else {
// 		const notice = new Notice(`[${prefix}] ${t('PUBLIC_FAILURE')}\n${text}`, 10000)
// 		notice.noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}--error`);
// 		// new Notice(`[${prefix}] ${t('PUBLIC_FAILURE')}\n${text}`, 10000).noticeEl.addClass('notice__container', `notice__${hasClass ? 'dark' : 'light'}_error`);
// 		return notice
// 	}
// }

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

export const formatTimestamp = (timestamp: number) => {
	const date = new Date(timestamp);
	// const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	// const seconds = String(date.getSeconds()).padStart(2, '0');
	const formattedDate = `${month}月${day}日 ${hours}:${minutes}`;
	return formattedDate;
}
export const formatTimestamp_concise = (timestamp: number) => {
	const date = new Date(timestamp);
	const [year, month, day, hours, minutes] = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0'), String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')];
	return `${year}/${month}/${day} ${hours}:${minutes}`;
}
export const isValidTranslationFormat = (json: Translation | undefined) => {
	return (json !== undefined && 'manifest' in json && 'translationVersion' in json.manifest && 'pluginVersion' in json.manifest && 'description' in json && 'original' in json.description && 'translation' in json.description && 'dict' in json);
}

export const deflate = (str: string) => { return deflateSync(str).toString('base64'); }
export const inflate = (str: string) => { return inflateSync(Buffer.from(str, 'base64')).toString(); }


















// import { exec, execSync } from 'child_process';
// 选择目录
// const command = `powershell.exe -Command "& {Add-Type -AssemblyName System.Windows.Forms; $folderDialog = New-Object System.Windows.Forms.FolderBrowserDialog; $folderDialog.Description = '请选择文件夹'; $folderDialog.RootFolder = [System.Environment+SpecialFolder]::MyComputer; $result = $folderDialog.ShowDialog(); if ($result -eq [System.Windows.Forms.DialogResult]::OK) { Write-Output $folderDialog.SelectedPath } else { Write-Output '' }}"`
// 打开指定目录
// const command = `powershell.exe -Command "ii D:\\Game\\Steam"`
// ii /
// 异步执行
// exec(command, (error, file) => {
// 	console.log(error, file.toString())
// })

// 同步执行
// const filePath = execSync(command)
// console.log('选择的文件', filePath)
