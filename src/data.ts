export const api = {
    'BAIDU': '百度',
}

export const languages = {
    "zh-cn": "简体中文",
    "zh-tw": "繁體中文",
    "en": "English",
    "ru": "Русский",
    'custom ': "自定义"
}

export const regexs = [
    /Notice\(\s*(.+?)\s*\)/gs,
    /.setText\(\s*(['"`])(.+?)\1\s*\)/gs,
    /.setButtonText\(\s*(['"`])(.+?)\1\s*\)/gs,
    /.setName\(\s*(['"`])(.+?)\1\s*\)/gs,
    /.setDesc\(\s*(['"`])(.+?)\1\s*\)/gs,
    /.setPlaceholder\(\s*(['"`])(.+?)\1\s*\)/gs,
    /.setTooltip\(\s*(['"`])(.+?)\1\s*\)/gs,
    /.appendText\(\s*(['"`])(.+?)\1\s*\)/gs,
    /.createEl\((['"`])([\w:-]+)\1,\s*\{\s*text:\s*(['"`])(.+?)\3\s*\}\s*\)/gs,
    /.innerText\s*=\s*(['"`]).*?\1/gs
]

export const regexs_1 = [
    /Notice\(\s*(.+?)\s*\)/g,
    /.setText\(\s*(['"`])(.+?)\1\s*\)/g,
    /.setButtonText\(\s*(['"`])(.+?)\1\s*\)/g,
    /.setName\(\s*(['"`])(.+?)\1\s*\)/g,
    /.setDesc\(\s*(['"`])(.+?)\1\s*\)/g,
    /.setPlaceholder\(\s*(['"`])(.+?)\1\s*\)/g,
    /.setTooltip\(\s*(['"`])(.+?)\1\s*\)/g,
    /.appendText\(\s*(['"`])(.+?)\1\s*\)/g,
    /.innerText\s*=\s*(['"`]).*?\1/g
]
