import * as fs from 'fs-extra'
import { Notice } from 'obsidian';
import { State as state, Translation } from './types';

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

/**
 * 根据插件查找需要翻译的字段
 * @param mainStr mian.js 的内容
 * @returns 
 */
export function generateTranslation(mainStr: string, regexs: RegExp[]): Translation {
	const translationJson: Translation = {
		"manifest": {
			"author": "",
			"version": "-1"
		},
		"dict": {}
	}
	for (const regex in regexs) {
		const temp_array = mainStr.match(regexs[regex]);
		if (temp_array != null)
			for (const i in temp_array)
				translationJson.dict[temp_array[i]] = ''
	}
	return translationJson
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
