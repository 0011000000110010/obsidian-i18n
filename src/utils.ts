import * as fs from 'fs-extra'
import { Notice, PluginManifest } from 'obsidian';
import { State as state, Translation } from './data/types';


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
		"manifest": {
			"id": id,
			"author": author == "" ? "无名氏" : author,
			"version": version,
			"pluginVersion": pluginVersion
		},
		"description": {
			"original": description,
			"translation": description
		},
		"dict": {}
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

export function PNotice(prefix: string, text: any) {
	new Notice(`[${prefix}] ${text}`);
}

export function NoticeSuccess(prefix: string, text: any, duration = 4000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	new Notice(`[${prefix}] ${text}`, duration).noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_success`);
}
export function NoticeInfo(prefix: string, text: any, duration = 4000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	new Notice(`[${prefix}] ${text}`, duration).noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_info`);
}
export function NoticeWarning(prefix: string, text: any, duration = 4000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	new Notice(`[${prefix}] ${text}`, duration).noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_warning`);
}
export function NoticeError(prefix: string, text: any, duration = 10000) {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	new Notice(`[${prefix}] ${text}`, duration).noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_error`);
}
export function NoticeOperationResult(prefix: string, isSuccess: boolean, text: any = "") {
	const hasClass = document.body ? document.body.classList.contains('theme-dark') : false;
	if (isSuccess) {
		if (text != "") { new Notice(`[${prefix}] 成功\n${text}`, 4000).noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_success`); }
		else { new Notice(`[${prefix}] 成功`, 4000).noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_success`); }
	} else {
		new Notice(`[${prefix}] 失败\n${text}`, 10000).noticeEl.addClass(`i18n_notice_${hasClass ? 'dark' : 'light'}_error`);
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
