import * as fs from 'fs-extra'
import { Notice, PluginManifest } from 'obsidian';
import { State as state, Translation, ValidationOptions } from './data/types';
import { t } from './lang/inxdex';

// ==============================
//            状态管理类
// ==============================
export class State {
	path: string;
	stateJson: state = {
		'state': false,
		'pluginVersion': '',
		'translationVersion': ''
	}

	constructor(path: string) {
		this.path = path;
	}

	/**
	 * 判断状态文件是否存在
	 * @returns 返回状态文件是否存在
	 */
	public isState() {
		try {
			return fs.pathExistsSync(this.path);
		} catch (error) {
			new Notice(`⚠ ${error}`);
			console.error(`⚠ ${error}`);
		}
	}

	// 增
	public insert() {
		try {
			fs.outputJsonSync(this.path, this.stateJson);
		} catch (error) {
			new Notice(`⚠ ${error}`);
			console.error(`⚠ ${error}`);
		}
	}

	// 删
	public delete() {
		try {
			fs.removeSync(this.path);
		} catch (error) {
			new Notice(`⚠ ${error}`);
			console.error(`⚠ ${error}`);
		}
	}

	// 改
	public update(is_i18n: boolean, pluginVersion: string, translationVersion: string) {
		const state: state = {
			'state': is_i18n,
			'pluginVersion': pluginVersion,
			'translationVersion': translationVersion
		}
		try {
			fs.outputJsonSync(this.path, state);
		} catch (error) {
			new Notice(`⚠ ${error}`);
			console.error(`⚠ ${error}`);
		}
	}

	// 查
	public select() {
		try {
			return fs.readJsonSync(this.path);
		} catch (error) {
			new Notice(`⚠ ${error}`);
			console.error(`⚠ ${error}`);
		}
	}

	// [重置]
	public reset() {
		try {
			fs.outputJsonSync(this.path, this.stateJson);
		} catch (error) {
			new Notice(`⚠ ${error}`);
			console.error(`⚠ ${error}`);
		}
	}

	public state(): boolean {
		return this.select().state
	}

	public pluginVersion(): string {
		return this.select().pluginVersion
	}

	public translationVersion(): string {
		return this.select().translationVersion
	}
}

export function generateTranslation(id: string, author: string, version: string, pluginVersion: string, manifestJSON: PluginManifest, mainStr: string, reLength: number, regexps: string[], flags: string): Translation {
	const description = manifestJSON.description;
	const translationJson: Translation = {
		'manifest': {
			'id': id,
			'author': author == '' ? '' : author,
			'version': version,
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

export function validateTranslation(json: any, options: ValidationOptions = { checkFormat: true, checkAuthor: true, checkVersion: true, checkTranslations: true }): boolean {
	// 自定义检查：检查整体格式  
	if (options.checkFormat && (!('manifest' in json) || !('description' in json) || !('dict' in json))) {
		NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), false, t('SUBMITE_INSPECT_NOTICE_A'));
		return false
	}
	// 自定义检查：检查作者  
	if (options.checkAuthor && (typeof json.manifest !== 'object' || json.manifest === null || typeof json.manifest.author !== 'string' || json.manifest.author === '')) {
		NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), false, t('SUBMITE_INSPECT_NOTICE_B'));
		return false
	}
	// 自定义检查：检查版本号
	if (options.checkVersion && (typeof json.manifest !== 'object' || json.manifest === null || !/^\d+(\.\d+){2}$/.test(json.manifest.version))) {
		NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), false, t('SUBMITE_INSPECT_NOTICE_E'));
		return false
	}

	// 自定义检查：检查翻译  
	let count = 0;
	if (options.checkTranslations && json.dict) {
		Object.keys(json.dict).forEach(key => {
			if (key !== json.dict[key]) {
				count++;
			}
		});
	}

	if ((count * 2) >= Object.keys(json.dict).length) {
		NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), true, t('SUBMITE_INSPECT_NOTICE_C'))
		return true
	} else {
		NoticeOperationResult(t('SUBMITE_INSPECT_HEAD'), false, t('SUBMITE_INSPECT_NOTICE_D'))
		return false
	}
	return true;
}

export function NoticePrimary(prefix: string, text: unknown, duration = 4000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	const notice = new Notice(`[${prefix}] ${text}`, duration);
	notice.noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_primary`);
	return notice;
}
export function NoticeSuccess(prefix: string, text: unknown, duration = 4000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	const notice = new Notice(`[${prefix}] ${text}`, duration);
	notice.noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_success`);
	return notice;
}
export function NoticeInfo(prefix: string, text: unknown, duration = 4000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	const notice = new Notice(`[${prefix}] ${text}`, duration);
	notice.noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_info`);
	return notice;
}
export function NoticeWarning(prefix: string, text: unknown, duration = 4000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	const notice = new Notice(`[${prefix}] ${text}`, duration);
	notice.noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_warning`);
	return notice;
}
export function NoticeError(prefix: string, text: unknown, duration = 10000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	const notice = new Notice(`[${prefix}] ${text}`, duration);
	notice.noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_error`);
	return notice;
}
export function NoticeOperationResult(prefix: string, isSuccess: boolean, text: unknown = "", duration = 4000): Notice {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	if (isSuccess) {
		if (text != "") {
			const notice = new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}\n${text}`, duration)
			notice.noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_success`)
			// new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}\n${text}`, duration).noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_success`)
			return notice;
		}
		else {
			const notice = new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}`, duration)
			notice.noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_success`);
			// new Notice(`[${prefix}] ${t('PUBLIC_SUCCESS')}`, duration).noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_success`); 
			return notice
		}
	} else {
		const notice = new Notice(`[${prefix}] ${t('PUBLIC_FAILURE')}\n${text}`, 10000)
		notice.noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_error`);
		// new Notice(`[${prefix}] ${t('PUBLIC_FAILURE')}\n${text}`, 10000).noticeEl.addClass('i18n_notice', `i18n_notice_${hasClass ? 'dark' : 'light'}_error`);
		return notice
	}
}


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
