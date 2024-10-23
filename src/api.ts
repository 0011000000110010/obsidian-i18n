// import * as path from 'path'
import { createHash } from 'crypto'
import { RequestUrlParam, requestUrl } from 'obsidian'

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

	public async getMark() {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/raw/master/translation/mark/${this.settings.I18N_LANGUAGE}.json`,
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			return { 'state': false, 'data': [] };
		}
	}

	public async baiduAPI(s: string) {
		const BAIDU = this.i18n.settings.I18N_NIT_APIS.BAIDU
		const md5 = createHash('md5');
		const from = BAIDU.FROM;
		const to = BAIDU.TO;
		const appid = BAIDU.APP_ID;
		const key = BAIDU.KEY;
		const salt = Math.round(Math.random() * 10);
		const sign = md5.update(`${appid}${s}${salt}${key}`).digest('hex');
		const RequestUrlParam: RequestUrlParam = {
			url: `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${s}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			if (response.json.hasOwnProperty("error_code")) {
				const error_code = response.json.error_code;
				NoticeError('百度', `${error_code}\n${BAIDU_ERROR_CODE[error_code]}`);
				return { 'state': false, 'data': '' };
			}
			return { 'state': true, 'data': response.json['trans_result'][0]['dst'] };
		} catch (error) {
			return { 'state': false, 'data': '' };
		}
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

	public async giteeGetToken() {
		const RequestUrlParam: RequestUrlParam = {
			url: "https://gitee.com/zero--two/obsidian-i18n-translation/raw/master/version.json",
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json.token };
		} catch (error) {
			NoticeError('I18N', `token获取失败(如果没有自定义token则无法使用提交功能)\n${error}`);
			return { 'state': false, 'data': {} };
		}
	}

	public async giteeGetDirectory() {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/raw/master/translation/directory/${this.settings.I18N_LANGUAGE}.json`,
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			return { 'state': false, 'data': {} };
		}

	}

	public async giteeGetSha(path: string) {
		try {
			const RequestUrlParam: RequestUrlParam = {
				url: `https://gitee.com/api/v5/repos/${this.i18n.settings.I18N_GITEE_OWNER}/${this.i18n.settings.I18N_GITEE_REPO}/contents/${path}`,
				method: 'GET',
				body: JSON.stringify({
					access_token: this.i18n.settings.I18N_ADMIN_TOKEN,
					owner: this.i18n.settings.I18N_GITEE_OWNER,
					repo: this.i18n.settings.I18N_GITEE_REPO,
					path: path
				}),
			};
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

	public async giteeGetIssue(number: string) {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/api/v5/repos/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/issues/${number}`,
			method: 'GET'
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

	public async giteePostIssue(title: string, body: string, label: string) {
		try {
			let token;
			if (this.settings.I18N_SHARE_TOKEN !== '') {
				token = this.settings.I18N_SHARE_TOKEN;
			} else {
				const tempToken = await this.giteeGetToken()
				console.log(tempToken);
				token = tempToken.state ? atob(tempToken.data) : '';
			}
			if (token === '') return;
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
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			NoticeOperationResult('提交操作', false, `${error}`);
			return { 'state': false, 'data': '' };
		}
	}

	public async giteePatchIssue(number: string, state: string) {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/api/v5/repos/${this.settings.I18N_GITEE_OWNER}/issues/${number}`,
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Charset': 'UTF-8'
			},
			body: JSON.stringify({
				access_token: this.i18n.settings.I18N_ADMIN_TOKEN,
				owner: this.i18n.settings.I18N_GITEE_OWNER,
				repo: this.i18n.settings.I18N_GITEE_REPO,
				number: number,
				state: state
			}),
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

	public async giteeGetAllIssue() {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/api/v5/repos/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/issues`,
			method: 'GET'
		};
		console.log(RequestUrlParam);
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

	public async giteeGetTranslation(id: string, version: string) {
		try {
			const RequestUrlParam: RequestUrlParam = {
				url: `https://gitee.com/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/raw/master/translation/dict/${id}/${this.settings.I18N_LANGUAGE}/${version}.json`,
				method: 'GET'
			};
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

	public async giteePostTranslation(path: string, content: string, message: string) {
		let access_token;
		if (this.settings.I18N_ADMIN_TOKEN != "") {
			access_token = this.settings.I18N_ADMIN_TOKEN;
		} else {
			NoticeOperationResult('审核面板', false, '未找到Token');
		}
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/api/v5/repos/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/contents/${path}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'charset': 'UTF-8'
			},
			body: JSON.stringify({
				access_token: access_token,
				content: content,
				message: message,
			}),
		};
		console.log(RequestUrlParam);
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

	public async giteePutTranslation(path: string, content: string, sha: string, message: string) {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/api/v5/repos/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/contents/${path}`,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Charset': 'UTF-8'
			},
			body: JSON.stringify({
				access_token: this.i18n.settings.I18N_ADMIN_TOKEN,
				owner: this.i18n.settings.I18N_GITEE_OWNER,
				repo: this.i18n.settings.I18N_GITEE_REPO,
				content: content,
				sha: sha,
				message: message
			})
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

	public async giteeGetContributor() {
		try {
			const RequestUrlParam: RequestUrlParam = {
				url: `https://gitee.com/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/raw/master/translation/contributor/${this.settings.I18N_LANGUAGE}.json`,
				method: 'GET'
			};
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

	public async giteePutContributor(path: string, content: string, sha: string, message: string) {
		const RequestUrlParam: RequestUrlParam = {
			url: `https://gitee.com/api/v5/repos/${this.settings.I18N_GITEE_OWNER}/${this.settings.I18N_GITEE_REPO}/contents/${path}`,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Charset': 'UTF-8'
			},
			body: JSON.stringify({
				access_token: this.i18n.settings.I18N_ADMIN_TOKEN,
				owner: this.i18n.settings.I18N_GITEE_OWNER,
				repo: this.i18n.settings.I18N_GITEE_REPO,
				content: content,
				sha: sha,
				message: message
			})
		};
		try {
			const response = await requestUrl(RequestUrlParam);
			return { 'state': true, 'data': response.json };
		} catch (error) {
			console.log(error)
			return { 'state': false, 'data': '' };
		}
	}

}