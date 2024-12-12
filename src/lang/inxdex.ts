import { moment } from "obsidian";
import zh_cn from './locale/zh_cn';
// import zh_tw from './locale/zh_tw';
// import en_us from './locale/en_us';
// import ru_ru from './locale/ru_ru';
// import ja_jp from './locale/ja_jp';
// import fr_fr from './locale/fr_fr';

// obsidian-excalidraw-plugin
const localeMap: { [k: string]: Partial<typeof zh_cn> } = {
  'zh-cn': zh_cn,
  // 'zh-tw': zh_tw,
  // 'en-gb': en_us,
  // 'ru-ru': ru_ru,
  // 'ja-jp': ja_jp,
  // 'fr-fr': fr_fr,
};

const locale = localeMap[moment.locale()];
// moment.locale()

export function t(str: keyof typeof zh_cn): string {
  return (locale && locale[str]) || zh_cn[str];
}
