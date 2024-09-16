import { ApiTypes, BaiduErrorCode, Languages } from "./types"

export const LANGUAGES: Languages = {
    "zh-cn": "简体中文",
    "zh-tw": "繁體中文",
    "en": "English",
    "ru": "Русский",
    'custom ': "自定义"
}

export const API_TYPES: ApiTypes = {
    'BAIDU': '百度',
    'OPENAI': 'OpenAI'
}

export const BAIDU_ERROR_CODE: BaiduErrorCode = {
    "52000": "成功",
    "52001": "请求超时",
    "52002": "系统错误",
    "52003": "未授权用户",
    "54000": "必填参数为空",
    "54001": "签名错误",
    "54003": "访问频率受限",
    "54004": "账户余额不足",
    "54005": "长query请求频繁",
    "58000": "客户端IP非法",
    "58001": "译文语言方向不支持",
    "58002": "服务当前已关闭",
    "58003": "此IP已被封禁",
    "90107": "认证未通过或未生效",
    "20003": "请求内容存在安全风险 "
}

export const I18N_SORT = {
    '0': '正序',
    '1': '倒序'
}
export const I18N_TYPE = {
    '0': '全部',
    '1': '提取',
    '2': '翻译',
    '3': '还原'
}