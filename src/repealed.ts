

// ==============================
// 获取插件目录(已废除)
// ==============================

// [本地][变量] 插件文件夹路径
// plugins_path: string;
// [初始化] 插件目录
// this.plugins_path = path.join(this.base_path, this.i18n.settings.plugins_path);
// ==============================
		//         插件路径
		// ==============================
		// const plugins = new Setting(containerEl);
		// plugins.setName('路径')
		// plugins.setDesc('[必填] 选择插件文件夹路径')
		// plugins.addText(cb => cb
		// 	.setPlaceholder('插件路径')
		// 	.setValue(this.i18n.settings.plugins_path)
		// 	.onChange(async (value) => {
		// 		this.i18n.settings.plugins_path = value;
		// 		await this.i18n.saveSettings();
		// 		console.log(`[配置] plugins_path: ${this.i18n.settings.plugins_path}`)
		// 	})
		// );


// ==============================
// 获取插件列表(已废除)
// ==============================

// interface IPlugin {
//     id: string;
//     name: string;
//     version: string;
//     author: string;
// 	path: string;
// }
// // 插件文件夹
// const plugin_folders = fs.readdirSync(this.plugins_path);
// // 获取所有插件数据
// for (let i = 0; i < plugin_folders.length; i++) {
//     // [路径] 插件路径
//     const plugin_path = path.join(this.plugins_path, plugin_folders[i]);
//     // [路径] 插件描述文件路径
//     const manifest_path = path.join(plugin_path, 'manifest.json');

//     // [获取] 插件描述文件<Json>
//     const manifest = JSON.parse(fs.readFileSync(manifest_path).toString());

//     // [临时] 插件对象
//     const plugin: IPlugin = {
//         id: manifest.id,
//         name: manifest.name,
//         version: manifest.version,
//         author: manifest.author,
//         path: plugin_path
//     }

//     // [添加] 将获取到插件对象添加至对象列表
//     this.plugins.push(plugin);
// }

// this.console.log(`[插件数量] 共计 ${this.plugins.length} 个插件`);
// this.console.log('[插件列表]');
// this.console.table(this.plugins);


// ==============================
// 获取译文目录(已废除)
// ==============================
// // 当安全模式关闭时 获取
// if(!this.i18n.settings.i18n_ndt_mode){
//     // 获取数据
//     const data = await this.api.getDirectory();
//     // 判断请求
//     if(data.code){
//         this.directory = JSON.parse(data.text);
//         this.console.log(typeof(this.directory));
//         this.console.log('[目录列表]');
//         this.console.table(this.directory);
//     }else{
//         this.console.log('[目录列表]');
//         // 请求标记失败
//         this.web_mark = false;
//         // 请求失败返回内容
//         new Notice(`❗${data.text}`);
//     }
// }


// ==============================
// 主逻辑(已废除)
// ==============================
		// // 旧版插件
		// for(const plugin of this.plugins) {
		// 	console.groupCollapsed(`[${plugin.name}]`);
		// 	// ============================================================
		// 	//         基础信息
		// 	// ============================================================
		// 	// [渲染] 块元素
		// 	const block = new Setting(contentEl);
		// 	// [信息] 名称
		// 	block.setName(plugin.name);
		// 	// [信息] 作者
		// 	block.descEl.createDiv({text:"作者: " + plugin.author});
		// 	// [信息] 版本
		// 	block.descEl.createDiv({text:"版本: " + plugin.version});

		// 	// [临时变量] 语言目录
		// 	const lang_path = path.join(plugin.path, `/lang`);
		// 	// console.log(`[临时变量] 本地翻译文件目录 => ${lang_path}`);

		// 	// [临时变量] 翻译文件路径
		// 	const lang_file_path = path.join(lang_path, `${lang}.json`);
		// 	// console.log(`[临时变量] 本地翻译文件路径 => ${lang_file_path}`);

		// 	// [临时变量] 本地翻译文件是否存在
		// 	const is_lang_file = fs.existsSync(lang_file_path);
		// 	// console.log(`[临时变量] 本地翻译文件是否存在 => ${is_lang_file}`);

		// 	// [临时变量] 状态文件 操作函数
		// 	const i18nstate = new I18NState(plugin.path);

		// 	// [临时变量] 状态文件 当前状态
		// 	const state = i18nstate.select();

		// 	// ============================================================
		// 	//             插件更新 翻译还原
		// 	// ============================================================
		// 	// 当插件版本更新 并且 插件已翻译的时候
		// 	// 状态文件存在 并且 为翻译状态 并且 版本已经更新了
		// 	if(i18nstate.is_state() && state.is_i18n && plugin.version != state.plugin_version){
		// 		// // 删除翻译过的文件
		// 		fs.unlinkSync(path.join(plugin.path, 'main-copy.js'));
		// 		// // 更新翻译状态
		// 		i18nstate.update(false, '', plugin.version);
		// 		new Notice(`💬[${plugin.name}] 插件更新 翻译还原`);
		// 	}

		// 	// ============================================================
		// 	// 
		// 	//                        翻译状态
		// 	// 
		// 	// ============================================================
		// 	if(state.is_i18n){
		// 		console.log('[本地][状态] 🟢已翻译');
		// 	}else{
		// 		console.log('[本地][状态] 🔴未翻译');
		// 	}

		// 	// ============================================================
		// 	// 
		// 	//                        网络操作
		// 	// 
		// 	// ============================================================
		// 	// 检测下载
		// 	if(i18n_web_safemode == false && this.web_mark && !is_lang_file){
				
		// 		// [判断] 网络是否连接成功 以 网络中是否拥有翻译文件
		// 		if(plugin.name in this.directory){
		// 			const langs = this.directory[plugin.name];
		// 			console.table('[网络][目录]');
		// 			console.table(langs);

		// 			if(langs.includes(lang)){
		// 				console.log('[网络][译文] 🟢 存在');
		// 				const cb = new ButtonComponent(block.controlEl);
		// 				cb.setCta()
		// 				cb.setButtonText('下载');
		// 				cb.onClick(async ()=>{
		// 					new Notice('💬[网络] 下载中...');
		// 					cb.setDisabled(true);
		// 					// 获取网络中的 数据
		// 					const data = await this.api.getWeb(plugin.name, lang);
		// 					if(data.code){
		// 						// 判断是否有LANG文件夹 没有就创建
		// 						if(!fs.existsSync(lang_path)){
		// 							fs.mkdirSync(lang_path);
		// 						}
		// 						console.log(data.text)
		// 						// 下载保存到本地
		// 						fs.writeFileSync(lang_file_path, data.text);
		// 						// 刷新操作
		// 						this.reload()
		// 					}else{
		// 						new Notice(`❗${data.text}`);
		// 					}
		// 					cb.setDisabled(false);
		// 					new Notice('💬[网络] 下载完成');
		// 				})
		// 			}else{
		// 				console.log('[网络][译文] 🔴 不存在');
		// 			}
		// 		}
		// 	}
			
		// 	// 检测更新
		// 	if(i18n_web_safemode == false && this.web_mark && is_lang_file){
		// 		// 读取本地翻译文件
		// 		const local_lang_text = fs.readFileSync(lang_file_path);
		// 		// 请求 网络文件
		// 		const data = await this.api.getWeb(plugin.name, lang);
		// 		if(data.code){
		// 			// 本地语言文件 转 json对象
		// 			const local_lang_json = JSON.parse(local_lang_text.toString());
		// 			// 网络语言文件 转 json对象
		// 			const web_lang_json = JSON.parse(data.text);
		// 			// [判断] 本地是否需要更新
		// 			if(local_lang_json['manifest']['version'] != web_lang_json['manifest']['version']){
		// 				const cb = new ButtonComponent(block.controlEl);
		// 				cb.setCta();
		// 				cb.setButtonText('更新');
		// 				cb.onClick(()=>{
		// 					cb.setDisabled(true);
		// 					console.log('[网络] 本地版本' + (local_lang_json['manifest']['version']))
		// 					console.log('[网络] 在线版本' + (web_lang_json['manifest']['version']))
		// 					console.log(`[本地] 当前翻译状态 ${state.is_i18n}`)
							
		// 					// 判断翻译状态
		// 					if(state.is_i18n){
		// 						new Notice('💬[网络] 请先进行还原');
		// 					}else{
		// 						new Notice('💬[网络] 更新中...');
		// 						// 更新保存文件
		// 						fs.writeFileSync(lang_file_path, data.text);
		// 						// 更新状态文件

		// 						i18nstate.update(state.is_i18n, web_lang_json['manifest']['version'], state.plugin_version);
		// 						// 刷新操作
		// 						this.reload()
		// 						new Notice('💬[网络] 更新完成');
		// 					}
		// 					cb.setDisabled(false);
		// 				});
		// 			}
		// 		}else{
		// 			new Notice('💬[网络] 翻译文件 请求失败');
		// 		}
		// 	}

		// 	// ============================================================
		// 	// 
		// 	//                        翻译操作
		// 	// 
		// 	// ============================================================
		// 	// 检测 语言目录 是否存在
		// 	if(!fs.existsSync(lang_path)){
		// 		console.log('[本地][目录] 🔴不存在');
		// 		console.groupEnd();
		// 		continue;
		// 	}else{
		// 		console.log('[本地][目录] 🟢存在');
		// 	}
			
		// 	// 检测 状态文件 是否存在 没有则创建一个默认的
		// 	if(!i18nstate.is_state()){
		// 		// 当状态文件不存在的时候新建状态文件
		// 		i18nstate.insert();
		// 	}

		// 	// 检查是否存在翻译文件
		// 	if(is_lang_file){
		// 		console.log('[本地][译文] 🟢存在')
		// 		// [判断] 翻译状态 当已翻译时进行 还原按钮渲染
		// 		if(state.is_i18n){
		// 			const cb = new ButtonComponent(block.controlEl);
		// 			cb.setButtonText('还原');
		// 			cb.setDisabled(false);
		// 			cb.onClick(()=>{
		// 				// 按钮不可在进行点击
		// 				cb.setDisabled(true);
		// 				// 删除翻译过的文件
		// 				fs.unlinkSync(path.join(plugin.path, 'main.js'));
						
		// 				// 将备份文件更改名称
		// 				fs.renameSync(path.join(plugin.path, 'main-copy.js'), path.join(plugin.path, 'main.js'));
		// 				// 更新翻译状态
		// 				i18nstate.update(false, '', plugin.version);
		// 				// 刷新列表
		// 				this.reload();
		// 				new Notice('[还原] 重启 Obsidian 生效');
		// 			});
		// 		}

		// 		// [判断] 翻译状态 当未翻译时进行 翻译按钮渲染
		// 		if(!state.is_i18n){
		// 			const cb = new ButtonComponent(block.controlEl);
		// 			cb.setButtonText('翻译');
		// 			cb.setDisabled(false);
		// 			cb.onClick(()=>{
		// 				// console.groupCollapsed('[翻译]');
		// 				// 按钮不可在进行点击
		// 				cb.setDisabled(true);
		// 				// 创建文件备份
		// 				fs.copyFileSync(path.join(plugin.path, 'main.js'), path.join(plugin.path, 'main-copy.js'));

		// 				// 语言文件路径
		// 				const lang = fs.readFileSync(lang_file_path);
		// 				const json_object = JSON.parse(lang.toString());
		// 				console.log('对照表');
		// 				console.table(json_object['dict']);

		// 				// 读取并转换为字符串
		// 				let res = fs.readFileSync(path.join(plugin.path, 'main.js')).toString();
		// 				// 对翻译表进行逐条翻译
		// 				for(const key in json_object['dict']){
		// 					res = res.replaceAll(key, json_object['dict'][key]);
		// 				}
		// 				// 写入
		// 				fs.writeFileSync(path.join(plugin.path, 'main.js'), res, 'utf-8');

		// 				// 更新翻译状态
		// 				i18nstate.update(true, json_object['manifest'].version, plugin.version);
						
		// 				// 刷新列表
		// 				this.reload();

		// 				new Notice('[翻译]重启 Obsidian 生效');
		// 				// console.groupEnd();
		// 			});
		// 		}
		// 	}else{
		// 		// 判断是否有
		// 		console.log('[本地][译文] 🔴不存在')
		// 	}

		// 	// 检查是否需要删除内容
		// 	// if(lang_path){
		// 	// 	const cb = new ButtonComponent(block.controlEl);
		// 	// 		cb.setButtonText('删除');
		// 	// 		cb.setWarning();
		// 	// 		cb.setDisabled(false);
		// 	// 		cb.onClick(()=>{
		// 	// 			// 按钮不可在进行点击
		// 	// 			cb.setDisabled(true);
		// 	// 			// 删除目录
		// 	// 			this.removeDier(lang_path);
		// 	// 			new Notice('[删除] 翻译内容已清空');
		// 	// 			// 刷新列表
		// 	// 			this.reload();
						
		// 	// 		});
		// 	// }

		// 	// [插件]
		// 	console.groupEnd();
		// }


// ==============================
// API(已废除)
// ==============================
		// import { RequestUrlParam, requestUrl } from "obsidian";
		// import * as path from "path";
		
		// import I18N from "./main";
		
		// export default class Api {
		// 	i18n: I18N;
		// 	// [初始化] 变量
		// 	constructor(i18n:I18N) {
		// 		// [初始化] I18n插件
		// 		this.i18n = i18n;
		// 	}
		
		// 	private getRequest(url: string){
		// 		const req: RequestUrlParam = {
		// 			url: url,
		// 			method: 'GET',
		// 			headers: {"Content-Type": "application/json"}
		// 		};
		// 		return req
		// 	}
		
		// 	// 获取 网络文件 目录
		// 	async getDirectory(){
		// 		try{
		// 			const request = this.getRequest(path.join(this.i18n.settings.i18n_web_url, 'directory.json'));
		// 			// 这样就可以直接获取了
		// 			const data = await requestUrl(request);
		// 			// [status] [headers] [arrayBuffer] [json] [text]
		// 			return {code: true, text: data.text};
		// 		}catch(e){
		// 			const error = this.error(e)
		// 			console.error(error);
		// 			return {code: false, text: error};
		// 		}
		// 	}
			
		// 	// 获取 网络文件
		// 	async getWeb(plugin: string ,lang: string){
		// 		try{
		// 			const request = this.getRequest(path.join(this.i18n.settings.i18n_web_url, `plugins/${plugin}/${lang}.json`));
		// 			const data = await requestUrl(request);
		// 			return {code: true, text: data.text};
		// 		}catch(e){
		// 			const error = this.error(e)
		// 			console.error(error);
		// 			return {code: false, text: error};
		// 		}
		// 	}
		
		// 	private error(error: string) : string{
		// 		if(error == 'Error: net::ERR_CONNECTION_REFUSED'){
		// 			return '请求已被拒绝'
		// 		}
		// 		if (error == 'Error: net::ERR_ADDRESS_INVALID') {
		// 			return '请求地址无效'
		// 		}
		// 		if (error == 'Error: Request failed, status 400') {
		// 			return '请求失败 状态400'
		// 		}
		// 		if(error == 'Error: Request failed, status 404'){
		// 			return '请求失败 状态404'
		// 		}
		// 		if(error == 'Error: Request failed, status 414'){
		// 			return '请求失败 状态414'
		// 		}
		// 		if(error == 'Error: Request failed, status 502'){
		// 			return '请求失败 状态502'
		// 		}
		// 		if(error == 'Error: net::ERR_HTTP2_PROTOCOL_ERROR'){
		// 			return 'HTTP2 协议错误'
		// 		}
		// 		return `${error}`
		// 	}
		// }


// 删除本插件自身
// const this_index = this.plugins.findIndex(item => item.id == 'obsidian-i18n');
// if (this_index !== -1) this.plugins.splice(this_index, 1);  


// async onClose() {
// 	const { contentEl } = this;
// 	this.contentEl.empty();
// }


// // 错误代码
// private ErrorCode: { [key: string]: string } = {
// 	'Error: net::ERR_CONNECTION_REFUSED': '请求已被拒绝',
// 	'Error: net::ERR_ADDRESS_INVALID': '请求地址无效',
// 	'Error: Request failed, status 400': '请求失败 状态400',
// 	'Error: Request failed, status 404': '请求失败 状态404',
// 	'Error: Request failed, status 414': '请求失败 状态414',
// 	'Error: Request failed, status 502': '请求失败 状态502',
// 	'Error: net::ERR_HTTP2_PROTOCOL_ERROR': 'HTTP2 协议错误'
// }

// /**
//  * GET请求
//  * @param url 请求地址
//  * @returns 
//  */
// private async GET(url: string): Promise<{ code: boolean; text: string; }> {
// 	try {
// 		const request = this.GETParam(url);
// 		const data = await requestUrl(request);
// 		return { code: true, text: data.text };
// 	} catch (e) {
// 		const error = this.error(e)
// 		console.error(error);
// 		return { code: false, text: error };
// 	}
// }

// // 报错收集
// private error(error: string): string {
// 	for (const e in this.ErrorCode) {
// 		if (error == e) {
// 			return this.ErrorCode[e];
// 		}
// 	}
// 	return `${error}`
// }



// interface test {
// 	manifest: {
// 		author: string
// 		version: string
// 	},
// 	dict: Record<string, string>
// }

// export class FsI18n {
// 	i18n: I18N;
// 	language: string;
// 	constructor(i18n: I18N) {

// 		this.i18n = i18n;
// 		this.language = this.i18n.SETTINGS.I18N_LANGUAGE;
// 	}
// 	// 生成

// 	// 删除
// 	public delete(dir: string) {
// 	}

// 	// 翻译
// 	public translator(dir: string): string {
// 		fs.copySync(path.join(dir, 'main.js'), path.join(dir, 'duplicate.js'));

// 		const translationJson = fs.readJsonSync(path.join(dir, 'lang', `${this.i18n.SETTINGS.I18N_LANGUAGE}.json`))
// 		// const translation_string = fs.readFileSync(path.join(dir, 'lang', `${this.i18n.SETTINGS.I18N_LANGUAGE}.json`)).toString();
// 		// const translation_object = JSON.parse(translation_string);
// 		console.log(translationJson)

// 		// 读取并转换为字符串
// 		const res = fs.readFileSync(path.join(dir, 'main.js')).toString();
// 		// 对翻译表进行逐条翻译
// 		for (const key in translationJson.dict) res.replaceAll(key, translationJson.dict[key]);

// 		fs.writeJsonSync(path.join(dir, 'main.js'), res);
// 		// 写入
// 		// fs.writeFileSync(path.join(dir, 'main.js'), res, 'utf-8');
// 		return ''
// 	}
// 	// 还原
// 	public restore(plugin_dir: string): undefined {
// 	}
// 	// 下载
// 	// 更新

// }

// // ==============================
// //         本地文件翻译(Local Document Translation)
// // ==============================
// export class LDT {
// 	i18n: I18N;
// 	language: string;

// 	constructor(i18n: I18N) {
// 		this.i18n = i18n;
// 		this.language = this.i18n.SETTINGS.I18N_LANGUAGE;
// 	}

// 	/**
// 	 * 根据 译文 对插件进行翻译
// 	 * @param plugin_dir 插件目录
// 	 * @returns string 返回译文的版本号
// 	 */
// 	public translator(plugin_dir: string): string {
// 		// 创建文件备份 当文件存在时直接覆盖
// 		fs.copyFileSync(path.join(plugin_dir, 'main.js'), path.join(plugin_dir, 'duplicate.js'));
// 		// 语言文件路径
// 		const translation_string = fs.readFileSync(path.join(plugin_dir, 'lang', `${this.i18n.SETTINGS.I18N_LANGUAGE}.json`)).toString();
// 		const translation_object = JSON.parse(translation_string);

// 		// 读取并转换为字符串
// 		let res = fs.readFileSync(path.join(plugin_dir, 'main.js')).toString();
// 		// 对翻译表进行逐条翻译
// 		for (const key in translation_object['dict']) {
// 			res = res.replaceAll(key, translation_object['dict'][key]);
// 			console.table(key, translation_object['dict'][key]);
// 		}
// 		// 写入
// 		fs.writeFileSync(path.join(plugin_dir, 'main.js'), res, 'utf-8');

// 		return translation_object['manifest'].version;
// 	}

// 	/**
// 	 * 对已翻译过的插件进行还原
// 	 * @param plugin_dir 插件目录
// 	 * @returns undefined
// 	 */
// 	public restore(plugin_dir: string): undefined {
// 		// 删除翻译过的文件
// 		fs.unlinkSync(path.join(plugin_dir, 'main.js'));
// 		// 将备份文件更改名称
// 		fs.renameSync(path.join(plugin_dir, 'duplicate.js'), path.join(plugin_dir, 'main.js'));
// 	}

// 	/**
// 	 * 根据 MAIN.JS 生成译文
// 	 * @param plugin_dir 插件目录
// 	 * @returns object
// 	 */
// 	public generate_translation(plugin_dir: string): test {
// 		const regexs = [
// 			/(.setButtonText)\(('|")(.+?)('|")\)/g,
// 			/(.setName)\(('|")(.+?)('|")\)/g,
// 			/(.setDesc)\(('|")(.+?)('|")\)/g,
// 			/(.setPlaceholder)\(('|")(.+?)('|")\)/g,
// 			/(.setTooltip)\(('|")(.+?)('|")\)/g,
// 			/(.setTitle)\(('|")(.+?)('|")\)/g
// 		]
// 		const mian_string = fs.readFileSync(path.join(plugin_dir, 'main.js')).toString();

// 		const translation_object: test = {
// 			"manifest": {
// 				"author": "",
// 				"version": "-1"
// 			},
// 			"dict": {}
// 		}
// 		for (const regex in regexs) {
// 			const temp_array = mian_string.match(regexs[regex]);
// 			if (temp_array != null) for (const i in temp_array) translation_object['dict'][temp_array[i]] = ''
// 		}
// 		return translation_object
// 	}

// 	/**
// 	 * 生成 没有翻译的 译文
// 	 * @param plugin_dir 插件目录
// 	 * @returns undefined
// 	 */
// 	public generate(plugin_dir: string): undefined {
// 		const translation_string = JSON.stringify(this.generate_translation(plugin_dir));
// 		const lang_dir = path.join(plugin_dir, 'lang');
// 		if (!fs.existsSync(lang_dir)) fs.mkdirSync(lang_dir);
// 		fs.writeFileSync(path.join(lang_dir, `${this.language}.json`), translation_string);
// 	}
// }

// // ==============================
// //         网络文件翻译(Network Document Translation)
// // ==============================
// export class NDT {
// 	i18n: I18N;
// 	settings: I18nSettings;
// 	// 初始化
// 	constructor(i18n: I18N) {
// 		this.i18n = i18n;
// 		this.settings = this.i18n.SETTINGS;
// 	}

// 	// 获取 目录
// 	public Directory(): RequestUrlResponsePromise {
// 		const RequestUrlParam: RequestUrlParam = {
// 			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], 'directory.json'),
// 			method: 'GET'
// 		};
// 		return requestUrl(RequestUrlParam);
// 	}

// 	// 获取 译文
// 	public Translation(id: string) {
// 		const RequestUrlParam: RequestUrlParam = {
// 			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], `plugins\\${id}.json`),
// 			method: 'GET'
// 		};
// 		return requestUrl(RequestUrlParam);
// 	}

// 	/**
// 	 * [网络文件翻译] 下载函数
// 	 */
// 	public async download(plugin_dir: string, text: string) {
// 		const lang_dir = path.join(plugin_dir, 'lang');
// 		// 判断是否有LANG文件夹 没有就创建
// 		if (!fs.existsSync(lang_dir)) fs.mkdirSync(lang_dir);
// 		fs.writeFileSync(path.join(lang_dir, `${this.settings.I18N_LANGUAGE}.json`), text);
// 	}

// 	/**
// 	 * [网络文件翻译] 更新函数
// 	 */
// 	public async update(plugin_dir: string, text: string) {
// 		fs.writeFileSync(path.join(plugin_dir, 'lang', `${this.settings.I18N_LANGUAGE}.json`), text);
// 	}
// }

// // ==============================
// //         网络接口翻译(Network Interface Translation)
// // ==============================
// export class NIT {
// 	i18n: I18N;
// 	ldt: LDT;

// 	constructor(i18n: I18N) {
// 		this.i18n = i18n;
// 		this.ldt = new LDT(i18n);
// 	}

// 	public baidu(q: string): RequestUrlResponsePromise {
// 		const BAIDU = this.i18n.SETTINGS.I18N_NIT_APIS.BAIDU
// 		const md5 = createHash('md5');
// 		const from = BAIDU.FROM;
// 		const to = BAIDU.TO;
// 		const appid = BAIDU.APP_ID;
// 		const key = BAIDU.KEY;
// 		const salt = Math.round(Math.random() * 10);
// 		const sign = md5.update(`${appid}${q}${salt}${key}`).digest('hex');
// 		const RequestUrlParam: RequestUrlParam = {
// 			url: `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${q}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
// 			method: 'GET'
// 		};
// 		return requestUrl(RequestUrlParam);
// 	}

// 	public async generate(plugin_dir: string) {

// 	}
// }

// export class I18NState {
// 	path: string;
// 	constructor(lang_path: string) {
// 		this.path = path.join(lang_path, '/lang/state.json');
// 	}
// 	// flag配置 "a":追加写入，"w":写入，"r":读取
// 	// 判断文件是否存在
// 	is_state() {
// 		return fs.existsSync(this.path);
// 	}

// 	// [新增]
// 	insert() {
// 		const state = {
// 			'is_i18n': false,
// 			'i18n_version': '',
// 			'plugin_version': ''
// 		}
// 		// 转文本
// 		const data = JSON.stringify(state);
// 		fs.writeFileSync(this.path, data, { encoding: 'utf-8', flag: 'w' });
// 		return this.is_state() ? true : false;
// 	}

// 	// [删除]
// 	delete() {
// 		if (!this.is_state()) {
// 			return false;
// 		}
// 		fs.unlinkSync(this.path);
// 		// [日志]
// 		return this.is_state() ? false : true;
// 	}

// 	// [修改]
// 	update(is_i18n: boolean, i18n_version: string, plugin_version: string) {
// 		if (!this.is_state()) {
// 			return false;
// 		}
// 		const state = {
// 			'is_i18n': is_i18n,
// 			'i18n_version': i18n_version,
// 			'plugin_version': plugin_version
// 		}
// 		const data = JSON.stringify(state);
// 		fs.writeFileSync(this.path, data, { encoding: 'utf-8', flag: 'w' });

// 		const update_state = fs.readFileSync(this.path).toString();
// 		if (data == update_state) {
// 			return true;
// 		}
// 		if (!(data == update_state)) {
// 			return false;
// 		}
// 	}

// 	// [查询]
// 	select() {
// 		if (!this.is_state()) {
// 			return false;
// 		}
// 		const res = fs.readFileSync(this.path);
// 		return JSON.parse(res.toString());
// 	}

// 	// [重置]
// 	reset() {
// 		if (!this.is_state()) {
// 			return false;
// 		}
// 		const state = {
// 			'is_i18n': false,
// 			'i18n_version': '',
// 			'plugin_version': ''
// 		}
// 		// 转文本
// 		const data = JSON.stringify(state);
// 		fs.writeFileSync(this.path, data, { encoding: 'utf-8', flag: 'w' });
// 		// [日志]
// 		const update_state = fs.readFileSync(this.path).toString();
// 		if (data == update_state) {
// 			return true;
// 		}
// 		if (!(data == update_state)) {
// 			return false;
// 		}
// 	}
// }

// ====================
// 打开插件函数
// ====================
// export const DirDoc = (modal: I18NModal) => {

//     const pluginDir = path.join(modal.basePath, plugin.dir ?? '');
//     const langDir = path.join(pluginDir, 'lang');
//     const langDoc = path.join(pluginDir, 'lang', `${modal.settings.I18N_LANGUAGE}.json`);
//     const stateDoc = path.join(pluginDir, 'lang', 'state.json');
//     const isLangDir = fs.pathExistsSync(langDir);
//     const isLangDoc = fs.pathExistsSync(langDoc);
//     let isStateDoc = fs.pathExistsSync(stateDoc);
//     const mainDoc = path.join(pluginDir, 'main.js');
//     const duplicateDoc = path.join(pluginDir, 'duplicate.js');

//     const canziLangDoc = path.join(pluginDir, 'lang', `${modal.settings.I18N_LANGUAGE}.canzi.txt`);
//     const isCanziLangDoc = fs.pathExistsSync(canziLangDoc);
//     return {
//         "pluginDir": pluginDir,
//         "langDir": langDir,
//         "langDoc": langDoc,
//         "stateDoc": stateDoc,
//         "isLangDir": isLangDir,
//         "isLangDoc": isLangDoc,
//         "isStateDoc": isStateDoc,
//         "mainDoc": mainDoc,
//         "duplicateDoc": duplicateDoc,
//         "canziLangDoc": canziLangDoc,
//         "isCanziLangDoc": isCanziLangDoc,
//     }
// };