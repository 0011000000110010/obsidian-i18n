import * as path from 'path'
import { createHash } from 'crypto'
import { RequestUrlParam, RequestUrlResponsePromise, requestUrl } from 'obsidian'

import I18N from "../main"
import { I18nSettings } from './settings/data'
import { NoticeError, NoticeOperationResult, NoticePrimary } from 'src/utils'
import { BAIDU_ERROR_CODE } from 'src/data/data'

export class API {
	i18n: I18N;
	settings: I18nSettings;

	constructor(i18n: I18N) {
		this.i18n = i18n;
		this.settings = this.i18n.settings;
	}

	public async version(version: string) {
		const RequestUrlParam: RequestUrlParam = {
			url: "https://gitee.com/zero--two/obsidian-i18n-translation/raw/master/version.json",
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			if (version !== response.json.version) {
				NoticePrimary('I18N', `发现新版本(${response.json.version})\n${response.json.content}`);
			}
		} catch (error) {
			NoticeError('I18N', `网络异常(无法获取最新版)\n${error}`);
		}
	}

	public async submitUrl() {
		const RequestUrlParam: RequestUrlParam = {
			url: "https://gitee.com/zero--two/obsidian-i18n-translation/raw/master/version.json",
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			return response.json.submit
		} catch (error) {
			NoticeError('I18N', `网络异常(如果没有自定义token则无法使用提交功能)\n${error}`);
			return undefined
		}
	}

	public async directory() {
		let res = [];
		const RequestUrlParam: RequestUrlParam = {
			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], 'directory.json'),
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			res = response.json;
		} catch (error) {
			NoticeError('网络', error);
		}
		return res
	}

	public async directoryTest() {
		let res = true;
		const RequestUrlParam: RequestUrlParam = {
			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], 'directory.json'),
			method: 'GET'
		};
		try {
			await requestUrl(RequestUrlParam);
		} catch (error) {
			res = false;
			console.log(error);
		}
		return res
	}

	public async ignore() {
		let resData = [];
		const RequestUrlParam: RequestUrlParam = {
			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], 'ignore.json'),
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			resData = response.json;
		} catch (error) {
			NoticeError('网络', error);
		}
		return resData;
	}

	public async ignoreTest() {
		let res = true;
		const RequestUrlParam: RequestUrlParam = {
			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], 'ignore.json'),
			method: 'GET'
		};
		try {
			await requestUrl(RequestUrlParam);
		} catch (error) {
			res = false;
		}
		return res;
	}

	public async translation(id: string, version: string) {
		let res;
		const RequestUrlParam: RequestUrlParam = {
			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], `plugins\\${id}\\${version}.json`),
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			res = response.json;
		} catch (error) {
			console.log(error)
		}
		return res;
	}

	public baidu(q: string): RequestUrlResponsePromise {
		const BAIDU = this.i18n.settings.I18N_NIT_APIS.BAIDU
		const md5 = createHash('md5');
		const from = BAIDU.FROM;
		const to = BAIDU.TO;
		const appid = BAIDU.APP_ID;
		const key = BAIDU.KEY;
		const salt = Math.round(Math.random() * 10);
		const sign = md5.update(`${appid}${q}${salt}${key}`).digest('hex');
		const RequestUrlParam: RequestUrlParam = {
			url: `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${q}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
			method: 'GET'
		};
		return requestUrl(RequestUrlParam);
	}

	public baiduTest() {
		const BAIDU = this.i18n.settings.I18N_NIT_APIS.BAIDU
		const md5 = createHash('md5');
		const from = BAIDU.FROM;
		const to = BAIDU.TO;
		const appid = BAIDU.APP_ID;
		const key = BAIDU.KEY;
		const salt = Math.round(Math.random() * 10);
		const sign = md5.update(`${appid}${'i18n'}${salt}${key}`).digest('hex');

		const RequestUrlParam: RequestUrlParam = {
			url: `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${'i18n'}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
			method: 'GET'
		};
		const response = requestUrl(RequestUrlParam);
		response.then((res) => {
			if (res.json.hasOwnProperty("error_code")) {
				const error_code = res.json.error_code;
				NoticeError('百度', `${error_code}\n${BAIDU_ERROR_CODE[error_code]}`);
			} else {
				NoticeOperationResult('百度', true);
			}
		}).catch((error) => {
			NoticeOperationResult('百度', false, error);
		});
	}

	public async openAI(plugin: string, q: string) {
		try {
			const RequestUrlParam: RequestUrlParam = {
				url: `${this.settings.I18N_NIT_OPENAI_URL}/v1/chat/completions`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.settings.I18N_NIT_OPENAI_KEY}`
				},
				body: JSON.stringify({
					model: this.settings.I18N_NIT_OPENAI_MODEL,
					messages: [
						{ role: 'user', content: this.settings.I18N_NIT_OPENAI_TIPS },
						{ role: 'user', content: q }
					],
					temperature: 0.7
				}),
			};
			const response = await requestUrl(RequestUrlParam);
			if (response.json && response.json.choices && response.json.choices.length > 0) {
				return response.json.choices[0].message;
			}
			return null;
		} catch (error) {
			NoticeError('错误', error);
			return null;
		}
	}

	public openAITest() {
		const RequestUrlParam: RequestUrlParam = {
			url: `${this.settings.I18N_NIT_OPENAI_URL}/v1/chat/completions`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.settings.I18N_NIT_OPENAI_KEY}`
			},
			body: JSON.stringify({
				model: this.settings.I18N_NIT_OPENAI_MODEL,
				messages: [
					{ role: 'user', content: 'i18n' }
				],
				temperature: 0.7
			}),
		};
		const response = requestUrl(RequestUrlParam);
		response.then(() => {
			NoticeOperationResult('OpenAI', true);
		}).catch((error) => {
			NoticeOperationResult('OpenAI', false, error);
		});
	}

	public async submite(title: string, body: string, label: string) {
		try {
			let token;
			if (this.settings.I18N_SUBMIT_URL != "") {
				token = this.settings.I18N_SUBMIT_URL;
			} else {
				if (this.i18n.tempSubmitUrl != undefined) {
					token = this.i18n.tempSubmitUrl;
				} else {
					NoticeOperationResult('提交', false, `令牌有误`);
				}
			}
			const RequestUrlParam: RequestUrlParam = {
				url: `https://gitee.com/api/v5/repos/zero--two/issues`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Charset': 'UTF-8'
				},
				body: JSON.stringify({
					access_token: token,
					repo: 'obsidian-i18n-translation',
					title: title,
					body: body,
					labels: label
				}),
			};
			// title长度191 body长度65535个字符 
			const response = await requestUrl(RequestUrlParam);
			// const response = await axios.post(`https://gitee.com/api/v5/repos/zero--two/issues`, {
			// 	access_token: token,
			// 	repo: 'obsidian-i18n-translation',
			// 	title: title,
			// 	body: body,
			// }, {
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		'Charset': 'UTF-8',
			// 	}
			// });

			if (response.json.number) return response.json.number;
			return null;
		} catch (error) {
			NoticeOperationResult('提交操作', false, `${error}`);
			return null;
		}
	}
	public async giteeGetIssue(owner: string, repo: string, number: string) {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/api/v5/repos/${owner}/${repo}/issues/${number}`,
			method: 'GET'
		};
		const response = await requestUrl(RequestUrlParam);
		return response.json;
	}
	public async giteeGetAllIssue(owner: string, repo: string) {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/api/v5/repos/${owner}/${repo}/issues`,
			method: 'GET'
		};
		const response = await requestUrl(RequestUrlParam);
		return response.json;
	}

}