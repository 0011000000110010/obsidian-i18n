import * as path from 'path'
import { createHash } from 'crypto'
import { RequestUrlParam, RequestUrlResponsePromise, requestUrl } from 'obsidian'

import I18N from "../main"
import { I18nSettings } from '../settings/data'

export class API {
	i18n: I18N;
	settings: I18nSettings;

	constructor(i18n: I18N) {
		this.i18n = i18n;
		this.settings = this.i18n.settings;
	}

	/**
	 * 获取当前存在的所有网络译文
	 * @returns 
	 */
	public directory(): RequestUrlResponsePromise {
		const RequestUrlParam: RequestUrlParam = {
			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], 'directory.json'),
			method: 'GET'
		};
		return requestUrl(RequestUrlParam);
	}

	/**
	 * 获取译文内容
	 * @returns 
	 */
	public translation(id: string) {
		const RequestUrlParam: RequestUrlParam = {
			url: path.join(this.settings.I18N_NDT_APIS[this.settings.I18N_LANGUAGE], `plugins\\${id}.json`),
			method: 'GET'
		};
		return requestUrl(RequestUrlParam);
	}
	
	/**
	 * 百度API
	 * @param q 需要翻译的文本
	 * @returns 
	 */
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
}