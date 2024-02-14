interface Color {
    [code: string]: string,
}

const color: Color = {
    'blue': '#409EFF',
    'green': '#67C23A',
    'grey': '#5B5B5B', // 灰色
    'yellow': '#E6A23C',
    'red': '#F56C6C'
}

/**
 * 文字颜色样式
 * @param text 文本内容
 * @param type 颜色类型
 */
export function print(text: string, type = 'blue') {
    console.log(
        `%c${text}`,
        `color: ${color[type]};`
    )
}

/**
 * 背景颜色样式
 * @param text 文本内容
 * @param type 颜色类型
 */
export function back(text: string, type = 'blue') {
    console.log(
        `%c ${text} `,
        `padding: 2px; border-radius: 2px; color: #fff; background:${color[type]};`
    )
}

/**
 * 背景颜色带边框样式
 * @param text 文本内容
 * @param type 颜色类型
 */
export function border(text: string, type = 'blue') {
    console.log(
        `%c ${text} `,
        `padding: 2px; border: 1px solid ${color[type]}; border-radius: 2px; color: ${color[color[type]]};`,
    )
}

/**
 * 带标题的 背景颜色带边框样式
 * @param title 标题内容
 * @param text 文本内容
 * @param type 颜色类型
 */
export function lgo1(title: string, text: string, type = 'blue') {
    console.log(
        `%c ${title} %c ${text}`,
        `padding: 2px; border: 1px solid ${color[type]}; border-radius: 2px 0 0 2px; color: #fff; background:${color[type]};`,
        `padding: 2px; border: 1px solid ${color[type]}; border-radius: 0 2px 2px 0; color: ${color[type]};`,
    )
}

/**
 * 带标题的 双不同颜色样式
 * @param title 
 * @param text 
 * @param titleType 
 * @param textType 
 */
export function lgo2(title: string, text: string, titleType = 'blue', textType = 'red') {
    console.log(`%c ${title} %c ${text} %c`,
        `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: ${color[titleType]};`,
        `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: ${color[textType]};`,
        'background:transparent'
    );
}

/**
 * 
 * @param title 插件名称
 * @param text 版本号
 */
export function logLanguage(title: string, text: string) {
    console.log(`%c ${title} %c ${text} `,
        `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: ${color['grey']};`,
        `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: ${color['red']};`,
    );
}

/**
 * 
 * @param name 插件名称
 * @param version 版本号
 */
export function logVersion(name: string, version: string) {
    console.log(`%c ${name} %c v${version} `,
        `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: ${color['grey']};`,
        `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: ${color['blue']};`,
    );
}

/**
 * 
 * @param ldt 本地译文模式状态
 * @param ndt 网络译文模式状态
 * @param nit 网络接口模式状态
 */
export function logMode(ldt: boolean, ndt: boolean, nit: boolean) {
    console.log(`[${new Date().toLocaleTimeString()}][info][i18n]\n` +
        `%c 本地文件模式 %c ${ldt ? 'on' : 'off'} %c %c 网络文件模式 %c ${ndt ? 'on' : 'off'} %c %c 网络接口模式 %c ${nit ? 'on' : 'off'} `,
        `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: ${color['grey']}; `,
        `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: ${ldt ? color['green'] : color['red']}; `,
        '',
        `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: ${color['grey']}; `,
        `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: ${ndt ? color['green'] : color['red']}; `,
        '',
        `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: ${color['grey']};`,
        `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: ${nit ? color['green'] : color['red']}; `,
    );
}

/**
 * 
 * @param name 插件名称
 * @param isLangDir 译文目录状态
 * @param isStateDoc 状态文件状态
 * @param isLangDoc 译文文件状态
 */
export function logState(name: string, isLangDir: boolean, isStateDoc: boolean, isLangDoc: boolean) {
    console.log(`[${new Date().toLocaleTimeString()}][info][i18n]\n%c ${name} %c %c 目录 %c %c 状态 %c %c 译文 `,
        `padding: 2px; border-radius: 2px; color: #fff; background: ${color['grey']};`,
        '',
        `padding: 2px; border-radius: 2px; color: #fff; background: ${isLangDir ? color['green'] : color['red']};`,
        '',
        `padding: 2px; border-radius: 2px; color: #fff; background: ${isStateDoc ? color['green'] : color['red']};`,
        '',
        `padding: 2px; border-radius: 2px; color: #fff; background: ${isLangDoc ? color['green'] : color['red']};`,
    );
}
