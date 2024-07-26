/*
这是 ESBUILD 生成/绑定 的文件

如果你想查看源代码，请访问该插件的github存储库
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);

// src/main.ts
var import_obsidian4 = require("obsidian");
var path4 = __toESM(require("path"));
var fs3 = __toESM(require("fs"));

// src/settings/data.ts
var DEFAULT_SETTINGS = {
  settings: {
    plugins_path: ".obsidian\\plugins",
    language: "",
    log: false,
    i18n_ndt_mode: false,
    i18n_ndt_url: "https://raw.githubusercontent.com/zero-worlds/obsidian-i18n/main/i18n",
    i18n_nit_mode: false
  },
  languages: {}
};

// src/settings/ui/settings.ts
var import_obsidian2 = require("obsidian");

// src/api.ts
var import_obsidian = require("obsidian");
var path = __toESM(require("path"));
var Api = class {
  // [初始化] 变量
  constructor(i18n) {
    this.i18n = i18n;
  }
  getRequest(url) {
    const req = {
      url,
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    return req;
  }
  // 获取 网络文件 目录
  async getDirectory() {
    try {
      const request = this.getRequest(path.join(this.i18n.settings.i18n_web_url, "directory.json"));
      const data = await (0, import_obsidian.requestUrl)(request);
      return { code: true, text: data.text };
    } catch (e) {
      const error = this.error(e);
      console.error(error);
      return { code: false, text: error };
    }
  }
  // 获取 网络文件
  async getWeb(plugin, lang) {
    try {
      const request = this.getRequest(path.join(this.i18n.settings.i18n_web_url, `plugins/${plugin}/${lang}.json`));
      const data = await (0, import_obsidian.requestUrl)(request);
      return { code: true, text: data.text };
    } catch (e) {
      const error = this.error(e);
      console.error(error);
      return { code: false, text: error };
    }
  }
  error(error) {
    if (error == "Error: net::ERR_CONNECTION_REFUSED") {
      return "\u8BF7\u6C42\u5DF2\u88AB\u62D2\u7EDD";
    }
    if (error == "Error: net::ERR_ADDRESS_INVALID") {
      return "\u8BF7\u6C42\u5730\u5740\u65E0\u6548";
    }
    if (error == "Error: Request failed, status 400") {
      return "\u8BF7\u6C42\u5931\u8D25 \u72B6\u6001400";
    }
    if (error == "Error: Request failed, status 404") {
      return "\u8BF7\u6C42\u5931\u8D25 \u72B6\u6001404";
    }
    if (error == "Error: Request failed, status 414") {
      return "\u8BF7\u6C42\u5931\u8D25 \u72B6\u6001414";
    }
    if (error == "Error: Request failed, status 502") {
      return "\u8BF7\u6C42\u5931\u8D25 \u72B6\u6001502";
    }
    if (error == "Error: net::ERR_HTTP2_PROTOCOL_ERROR") {
      return "HTTP2 \u534F\u8BAE\u9519\u8BEF";
    }
    return `${error}`;
  }
};

// src/settings/ui/settings.ts
var I18nSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, i18n) {
    super(app, i18n);
    this.i18n = i18n;
    this.api = new Api(i18n);
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "[i18n] \u57FA\u7840\u8BBE\u7F6E" });
    new import_obsidian2.Setting(containerEl).setName("\u8DEF\u5F84").setDesc("[\u5FC5\u586B] \u9009\u62E9\u63D2\u4EF6\u6587\u4EF6\u5939\u8DEF\u5F84").addText(
      (cb) => cb.setPlaceholder("\u63D2\u4EF6\u8DEF\u5F84").setValue(this.i18n.settings.plugins_path).onChange(async (value) => {
        this.i18n.settings.plugins_path = value;
        await this.i18n.saveSettings();
        console.log(`[\u914D\u7F6E] plugins_path: ${this.i18n.settings.plugins_path}`);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\u8BED\u8A00").setDesc("\u9009\u62E9\u9700\u8981\u7FFB\u8BD1\u7684\u8BED\u8A00").addDropdown(
      (cb) => cb.addOptions(this.i18n.languages).setValue(this.i18n.settings.language).onChange(async (value) => {
        this.i18n.settings.language = value;
        await this.i18n.saveSettings();
        console.log(`[\u914D\u7F6E] language: ${this.i18n.settings.language}`);
      })
    );
    const log = new import_obsidian2.Setting(containerEl);
    log.setName("\u65E5\u5FD7");
    log.setDesc("\u662F\u5426\u5F00\u542F\u65E5\u5FD7\u8C03\u8BD5");
    log.addToggle(
      (cb) => cb.setValue(this.i18n.settings.log).onChange(() => {
        this.i18n.settings.log = !this.i18n.settings.log;
        this.i18n.saveSettings();
        console.log(`[\u914D\u7F6E] log: ${this.i18n.settings.log}`);
      })
    );
    containerEl.createEl("h2", { text: "[i18n] \u7F51\u7EDC\u6587\u4EF6" });
    const file_safemode = new import_obsidian2.Setting(containerEl);
    file_safemode.setName("\u5B89\u5168\u6A21\u5F0F");
    file_safemode.setDesc("\u5173\u95ED\u5B89\u5168\u6A21\u5F0F \u5C06\u4F1A\u4ECE\u7F51\u7EDC\u4E0B\u8F7D\u7FFB\u8BD1\u6587\u672C");
    file_safemode.addToggle(
      (cb) => cb.setValue(this.i18n.settings.i18n_web_safemode).onChange(() => {
        this.i18n.settings.i18n_web_safemode = !this.i18n.settings.i18n_web_safemode;
        this.i18n.saveSettings();
        console.log(`[\u914D\u7F6E] i18n_web_safemode: ${this.i18n.settings.i18n_web_safemode}`);
      })
    );
    const file_url = new import_obsidian2.Setting(containerEl);
    file_url.setName("\u7F51\u7EDC\u8DEF\u5F84");
    file_url.setDesc("\u4E0B\u8F7D\u7FFB\u8BD1\u6587\u672C\u7684\u7F51\u7EDC\u8DEF\u5F84 \u9ED8\u8BA4\u4E3AGitHub");
    file_url.addText(
      (cb) => cb.setPlaceholder("URL").setValue(this.i18n.settings.i18n_web_url).onChange((value) => {
        this.i18n.settings.i18n_web_url = value;
        this.i18n.saveSettings();
        console.log(`[\u914D\u7F6E] i18n_web_url: ${this.i18n.settings.i18n_web_url}`);
      })
    );
    const file_url_test = new import_obsidian2.Setting(containerEl);
    file_url_test.setName("\u6D4B\u8BD5");
    file_url_test.setDesc("\u4E0B\u8F7D\u7FFB\u8BD1\u6587\u672C\u7684\u7F51\u7EDC\u8DEF\u5F84 \u6D4B\u8BD5\u65F6\u5019\u8FDE\u63A5\u6B63\u5E38");
    file_url_test.addButton(
      (cb) => cb.setButtonText("\u6D4B\u8BD5").onClick(async (value) => {
        file_url_test.setDisabled(true);
        const code = await this.api.getDirectory();
        console.log(code.code);
        new import_obsidian2.Notice(`[\u7F51\u7EDC] ${code.code ? "\u8FDE\u63A5\u6210\u529F" : `\u8FDE\u63A5\u5931\u8D25(${code.text})`}`);
        file_url_test.setDisabled(false);
      })
    );
    containerEl.createEl("h2", { text: "[i18n] \u7FFB\u8BD1\u63A5\u53E3 (\u672A\u5B8C\u6210)" });
  }
};

// src/utils.ts
var path2 = __toESM(require("path"));
var fs = __toESM(require("fs"));
var I18NState = class {
  constructor(lang_path) {
    this.path = path2.join(lang_path, "/lang/state.json");
  }
  // flag配置 "a":追加写入，"w":写入，"r":读取
  // 判断文件是否存在
  is_state() {
    return fs.existsSync(this.path);
  }
  // [新增]
  insert() {
    const state = {
      "is_i18n": false,
      "i18n_version": "",
      "plugin_version": ""
    };
    const data = JSON.stringify(state);
    fs.writeFileSync(this.path, data, { encoding: "utf-8", flag: "w" });
    return this.is_state() ? true : false;
  }
  // [删除]
  delete() {
    if (!this.is_state()) {
      return false;
    }
    fs.unlinkSync(this.path);
    return this.is_state() ? false : true;
  }
  // [修改]
  update(is_i18n, i18n_version, plugin_version) {
    if (!this.is_state()) {
      return false;
    }
    const state = {
      "is_i18n": is_i18n,
      "i18n_version": i18n_version,
      "plugin_version": plugin_version
    };
    const data = JSON.stringify(state);
    fs.writeFileSync(this.path, data, { encoding: "utf-8", flag: "w" });
    const update_state = fs.readFileSync(this.path).toString();
    if (data == update_state) {
      return true;
    }
    if (!(data == update_state)) {
      return false;
    }
  }
  // [查询]
  select() {
    if (!this.is_state()) {
      return false;
    }
    const res = fs.readFileSync(this.path);
    return JSON.parse(res.toString());
  }
  // [重置]
  reset() {
    if (!this.is_state()) {
      return false;
    }
    const state = {
      "is_i18n": false,
      "i18n_version": "",
      "plugin_version": ""
    };
    const data = JSON.stringify(state);
    fs.writeFileSync(this.path, data, { encoding: "utf-8", flag: "w" });
    const update_state = fs.readFileSync(this.path).toString();
    if (data == update_state) {
      return true;
    }
    if (!(data == update_state)) {
      return false;
    }
  }
};
var State = class {
  constructor(path5) {
    this.path = path5;
  }
  /**
   * 判断状态文件是否存在
   * @returns 返回状态文件是否存在
   */
  is_state() {
    return fs.existsSync(this.path);
  }
  // 增
  insert() {
    const state = {
      "is_i18n": false,
      "translation_version": "",
      "plugin_version": ""
    };
    const data = JSON.stringify(state);
    fs.writeFileSync(this.path, data, { encoding: "utf-8", flag: "w" });
  }
  // 删
  delete() {
    fs.unlinkSync(this.path);
  }
  // 改
  update(is_i18n, translation_version, plugin_version) {
    const state = {
      "is_i18n": is_i18n,
      "translation_version": translation_version,
      "plugin_version": plugin_version
    };
    const data = JSON.stringify(state);
    fs.writeFileSync(this.path, data, { encoding: "utf-8", flag: "w" });
  }
  // 查
  select() {
    const res = fs.readFileSync(this.path);
    return JSON.parse(res.toString());
  }
  // [重置]
  reset() {
    const state = {
      "is_i18n": false,
      "translation_version": "",
      "plugin_version": ""
    };
    const data = JSON.stringify(state);
    fs.writeFileSync(this.path, data, { encoding: "utf-8", flag: "w" });
  }
};
var Console = class {
  constructor(is_log) {
    this.is_log = is_log;
  }
  log(message) {
    if (this.is_log) {
      console.log(message);
    }
  }
  debug(message) {
    if (this.is_log) {
      console.debug(message);
    }
  }
  info(message) {
    if (this.is_log) {
      console.info(message);
    }
  }
  warn(message) {
    if (this.is_log) {
      console.warn(message);
    }
  }
  error(message) {
    if (this.is_log) {
      console.error(message);
    }
  }
  table(tabularData) {
    if (this.is_log) {
      console.table(tabularData);
    }
  }
  group(message) {
    if (this.is_log) {
      console.group(message);
    }
  }
  groupCollapsed(message) {
    if (this.is_log) {
      console.groupCollapsed(message);
    }
  }
  groupEnd() {
    if (this.is_log) {
      console.groupEnd();
    }
  }
  clear() {
    console.clear();
  }
};

// src/main.ts
var import_child_process = require("child_process");

// src/i18n.ts
var import_obsidian3 = require("obsidian");
var fs2 = __toESM(require("fs"));
var path3 = __toESM(require("path"));
var LDT = class {
  /**
   * @description 本地插件翻译函数
   * @param plugin_path 插件路径
   * @param translation_path 译本路径
   */
  translation(plugin_path, translation_path) {
    fs2.copyFileSync(path3.join(plugin_path, "main.js"), path3.join(plugin_path, "duplicate.js"));
    const translation_string = fs2.readFileSync(translation_path).toString();
    const translation_object = JSON.parse(translation_string);
    console.log("\u5BF9\u7167\u8868");
    console.table(translation_object["dict"]);
    let res = fs2.readFileSync(path3.join(plugin_path, "main.js")).toString();
    for (const key in translation_object["dict"]) {
      res = res.replaceAll(key, translation_object["dict"][key]);
    }
    fs2.writeFileSync(path3.join(plugin_path, "main.js"), res, "utf-8");
    return translation_object;
  }
  /**
  * 还原函数
  * @param plugin_path 插件路径
  */
  restore(plugin_path) {
    fs2.unlinkSync(path3.join(plugin_path, "main.js"));
    fs2.renameSync(path3.join(plugin_path, "duplicate.js"), path3.join(plugin_path, "main.js"));
  }
};
var NDT = class {
  // 初始化
  constructor(i18n) {
    this.i18n = i18n;
  }
  // 请求地址
  RequestUrlParam(url) {
    const RequestUrlParam3 = {
      url,
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    return RequestUrlParam3;
  }
  // 获取 网络文件 目录
  async getDirectory() {
    try {
      const request = this.RequestUrlParam(path3.join(this.i18n.settings.i18n_ndt_url, "directory.json"));
      const data = await (0, import_obsidian3.requestUrl)(request);
      return { code: true, text: data.text };
    } catch (e) {
      const error = this.error(e);
      console.error(error);
      return { code: false, text: error };
    }
  }
  // 获取 网络文件
  async getWeb(plugin, lang) {
    try {
      const request = this.RequestUrlParam(path3.join(this.i18n.settings.i18n_ndt_url, `plugins\\${plugin}\\${lang}.json`));
      const data = await (0, import_obsidian3.requestUrl)(request);
      return { code: true, text: data.text };
    } catch (e) {
      const error = this.error(e);
      console.error(error);
      return { code: false, text: error };
    }
  }
  // 报错收集
  error(error) {
    if (error == "Error: net::ERR_CONNECTION_REFUSED") {
      return "\u8BF7\u6C42\u5DF2\u88AB\u62D2\u7EDD";
    }
    if (error == "Error: net::ERR_ADDRESS_INVALID") {
      return "\u8BF7\u6C42\u5730\u5740\u65E0\u6548";
    }
    if (error == "Error: Request failed, status 400") {
      return "\u8BF7\u6C42\u5931\u8D25 \u72B6\u6001400";
    }
    if (error == "Error: Request failed, status 404") {
      return "\u8BF7\u6C42\u5931\u8D25 \u72B6\u6001404";
    }
    if (error == "Error: Request failed, status 414") {
      return "\u8BF7\u6C42\u5931\u8D25 \u72B6\u6001414";
    }
    if (error == "Error: Request failed, status 502") {
      return "\u8BF7\u6C42\u5931\u8D25 \u72B6\u6001502";
    }
    if (error == "Error: net::ERR_HTTP2_PROTOCOL_ERROR") {
      return "HTTP2 \u534F\u8BAE\u9519\u8BEF";
    }
    return `${error}`;
  }
  // 下载方法
  static download() {
  }
  // 更新方法
  static update() {
  }
};
var NIT = class {
};

// src/main.ts
var I18N = class extends import_obsidian4.Plugin {
  // 生命周期函数在用户激活 Obsidian 插件时触发。这将是您设置插件大部分功能的地方。该方法在插件更新时也会被触发。
  async onload() {
    new import_obsidian4.Notice("[\u5F00\u542F]i18n");
    await this.loadSettings();
    this.settings = this.i18nSettings.settings;
    this.languages = this.i18nSettings.languages;
    this.addRibbonIcon("globe-2", "I18N", (evt) => {
      console.clear();
      new TranslateModal(this.app, this).open();
    });
    this.addSettingTab(new I18nSettingTab(this.app, this));
  }
  // 命周期函数在插件被禁用时触发。插件所调用的任何资源必须在这里得到释放，以防止在您的插件被禁用后对 Obsidian 的性能产生影响。
  async onunload() {
    new import_obsidian4.Notice("[\u5173\u95ED]i18n");
  }
  async loadSettings() {
    this.i18nSettings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.i18nSettings);
  }
};
var TranslateModal = class extends import_obsidian4.Modal {
  // ============================================================
  //                        初始化
  // ============================================================
  constructor(app, i18n) {
    super(app);
    // [本地][变量] 插件列表
    this.plugins = new Array();
    this.plugins1 = new Array();
    // [网络][变量] 网络连接状态
    this.web_mark = true;
    this.ndt_mark = true;
    console.log(this.app);
    console.log(this.app.plugins.manifests);
    console.log(this.app.vault.adapter.basePath);
    this.i18n = i18n;
    this.base_path = path4.normalize(this.app.vault.adapter.basePath);
    this.plugins_path = path4.join(this.base_path, this.i18n.settings.plugins_path);
    this.console = new Console(this.i18n.settings.log);
    this.api = new Api(this.i18n);
    this.LDTObj = new LDT();
    this.NDTObj = new NDT(this.i18n);
    this.NITObj = new NIT();
  }
  // ============================================================
  //                        初始化
  // ============================================================
  async init_plugins() {
    this.console.group("[\u521D\u59CB\u5316] \u63D2\u4EF6");
    const plugin_folders = fs3.readdirSync(this.plugins_path);
    for (let i = 0; i < plugin_folders.length; i++) {
      const plugin_path = path4.join(this.plugins_path, plugin_folders[i]);
      const manifest_path = path4.join(plugin_path, "manifest.json");
      const manifest = JSON.parse(fs3.readFileSync(manifest_path).toString());
      const plugin = {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        author: manifest.author,
        path: plugin_path
      };
      this.plugins.push(plugin);
    }
    this.console.log(`[\u63D2\u4EF6\u6570\u91CF] \u5171\u8BA1 ${this.plugins.length} \u4E2A\u63D2\u4EF6`);
    this.console.log("[\u63D2\u4EF6\u5217\u8868]");
    this.console.table(this.plugins);
    this.plugins1 = Object.values(this.app.plugins.manifests);
    this.console.log(`[\u63D2\u4EF6\u6570\u91CF] \u5171\u8BA1 ${this.plugins1.length} \u4E2A\u63D2\u4EF6`);
    this.console.log("[\u63D2\u4EF6\u5217\u8868]");
    this.console.table(this.plugins1);
    if (!this.i18n.settings.i18n_ndt_mode) {
      const data = await this.api.getDirectory();
      if (data.code) {
        this.directory = JSON.parse(data.text);
        this.console.log(typeof this.directory);
        this.console.log("[\u76EE\u5F55\u5217\u8868]");
        this.console.table(this.directory);
      } else {
        this.console.log("[\u76EE\u5F55\u5217\u8868]");
        this.web_mark = false;
        new import_obsidian4.Notice(`\u2757${data.text}`);
      }
    }
    if (this.i18n.settings.i18n_ndt_mode) {
      const data = await this.NDTObj.getDirectory();
      data.code ? this.directory = JSON.parse(data.text) : this.ndt_mark = false;
      if (!data.code)
        new import_obsidian4.Notice(`\u2757${data.text}`);
      this.console.log("[\u76EE\u5F55\u5217\u8868]");
      if (data.code)
        this.console.table(this.directory);
    }
    this.console.groupEnd();
  }
  // ============================================================
  //                        渲染
  // ============================================================
  async init_show() {
    this.console.groupCollapsed(`[\u521D\u59CB\u5316] \u6E32\u67D3`);
    const { contentEl } = this;
    const block = new import_obsidian4.Setting(contentEl);
    block.setName("\u8BED\u8A00");
    block.addDropdown(
      (cb) => cb.addOptions(this.i18n.languages).setValue(this.i18n.settings.language).onChange(async (value) => {
        this.i18n.settings.language = value;
        this.i18n.saveSettings();
        this.console.log(`[\u914D\u7F6E] language: ${this.i18n.settings.language}`);
        this.reload();
      })
    );
    const lang = this.i18n.settings.language;
    this.console.log(`[\u4E34\u65F6\u53D8\u91CF] \u7FFB\u8BD1\u8BED\u8A00 => ${lang}`);
    const i18n_web_safemode = this.i18n.settings.i18n_ndt_mode;
    this.console.log(`[\u4E34\u65F6\u53D8\u91CF] \u7F51\u7EDC\u6587\u4EF6\u6A21\u5F0F => ${i18n_web_safemode ? "\u5F00\u542F" : "\u5173\u95ED"}`);
    const i18n_api_safemode = this.i18n.settings.i18n_nit_mode;
    this.console.log(`[\u4E34\u65F6\u53D8\u91CF] \u7F51\u7EDC\u63A5\u53E3\u6A21\u5F0F => ${i18n_api_safemode ? "\u5F00\u542F" : "\u5173\u95ED"}`);
    for (const plugin of this.plugins) {
      this.console.groupCollapsed(`[${plugin.name}]`);
      const block2 = new import_obsidian4.Setting(contentEl);
      block2.setName(plugin.name);
      block2.descEl.createDiv({ text: "\u4F5C\u8005: " + plugin.author });
      block2.descEl.createDiv({ text: "\u7248\u672C: " + plugin.version });
      const lang_path = path4.join(plugin.path, `/lang`);
      const lang_file_path = path4.join(lang_path, `${lang}.json`);
      const is_lang_file = fs3.existsSync(lang_file_path);
      const i18nstate = new I18NState(plugin.path);
      const state = i18nstate.select();
      if (i18nstate.is_state() && state.is_i18n && plugin.version != state.plugin_version) {
        fs3.unlinkSync(path4.join(plugin.path, "main-copy.js"));
        i18nstate.update(false, "", plugin.version);
        new import_obsidian4.Notice(`\u{1F4AC}[${plugin.name}] \u63D2\u4EF6\u66F4\u65B0 \u7FFB\u8BD1\u8FD8\u539F`);
      }
      if (state.is_i18n) {
        this.console.log("[\u672C\u5730][\u72B6\u6001] \u{1F7E2}\u5DF2\u7FFB\u8BD1");
      } else {
        this.console.log("[\u672C\u5730][\u72B6\u6001] \u{1F534}\u672A\u7FFB\u8BD1");
      }
      if (i18n_web_safemode == false && this.web_mark && !is_lang_file) {
        if (plugin.name in this.directory) {
          const langs = this.directory[plugin.name];
          this.console.table("[\u7F51\u7EDC][\u76EE\u5F55]");
          this.console.table(langs);
          if (langs.includes(lang)) {
            this.console.log("[\u7F51\u7EDC][\u8BD1\u6587] \u{1F7E2} \u5B58\u5728");
            const cb = new import_obsidian4.ButtonComponent(block2.controlEl);
            cb.setCta();
            cb.setButtonText("\u4E0B\u8F7D");
            cb.onClick(async () => {
              new import_obsidian4.Notice("\u{1F4AC}[\u7F51\u7EDC] \u4E0B\u8F7D\u4E2D...");
              cb.setDisabled(true);
              const data = await this.api.getWeb(plugin.name, lang);
              if (data.code) {
                if (!fs3.existsSync(lang_path)) {
                  fs3.mkdirSync(lang_path);
                }
                this.console.log(data.text);
                fs3.writeFileSync(lang_file_path, data.text);
                this.reload();
              } else {
                new import_obsidian4.Notice(`\u2757${data.text}`);
              }
              cb.setDisabled(false);
              new import_obsidian4.Notice("\u{1F4AC}[\u7F51\u7EDC] \u4E0B\u8F7D\u5B8C\u6210");
            });
          } else {
            this.console.log("[\u7F51\u7EDC][\u8BD1\u6587] \u{1F534} \u4E0D\u5B58\u5728");
          }
        }
      }
      if (i18n_web_safemode == false && this.web_mark && is_lang_file) {
        const local_lang_text = fs3.readFileSync(lang_file_path);
        const data = await this.api.getWeb(plugin.name, lang);
        if (data.code) {
          const local_lang_json = JSON.parse(local_lang_text.toString());
          const web_lang_json = JSON.parse(data.text);
          if (local_lang_json["manifest"]["version"] != web_lang_json["manifest"]["version"]) {
            const cb = new import_obsidian4.ButtonComponent(block2.controlEl);
            cb.setCta();
            cb.setButtonText("\u66F4\u65B0");
            cb.onClick(() => {
              cb.setDisabled(true);
              this.console.log("[\u7F51\u7EDC] \u672C\u5730\u7248\u672C" + local_lang_json["manifest"]["version"]);
              this.console.log("[\u7F51\u7EDC] \u5728\u7EBF\u7248\u672C" + web_lang_json["manifest"]["version"]);
              this.console.log(`[\u672C\u5730] \u5F53\u524D\u7FFB\u8BD1\u72B6\u6001 ${state.is_i18n}`);
              if (state.is_i18n) {
                new import_obsidian4.Notice("\u{1F4AC}[\u7F51\u7EDC] \u8BF7\u5148\u8FDB\u884C\u8FD8\u539F");
              } else {
                new import_obsidian4.Notice("\u{1F4AC}[\u7F51\u7EDC] \u66F4\u65B0\u4E2D...");
                fs3.writeFileSync(lang_file_path, data.text);
                i18nstate.update(state.is_i18n, web_lang_json["manifest"]["version"], state.plugin_version);
                this.reload();
                new import_obsidian4.Notice("\u{1F4AC}[\u7F51\u7EDC] \u66F4\u65B0\u5B8C\u6210");
              }
              cb.setDisabled(false);
            });
          }
        } else {
          new import_obsidian4.Notice("\u{1F4AC}[\u7F51\u7EDC] \u7FFB\u8BD1\u6587\u4EF6 \u8BF7\u6C42\u5931\u8D25");
        }
      }
      if (!fs3.existsSync(lang_path)) {
        this.console.log("[\u672C\u5730][\u76EE\u5F55] \u{1F534}\u4E0D\u5B58\u5728");
        this.console.groupEnd();
        continue;
      } else {
        this.console.log("[\u672C\u5730][\u76EE\u5F55] \u{1F7E2}\u5B58\u5728");
      }
      if (!i18nstate.is_state()) {
        i18nstate.insert();
      }
      if (is_lang_file) {
        this.console.log("[\u672C\u5730][\u8BD1\u6587] \u{1F7E2}\u5B58\u5728");
        if (state.is_i18n) {
          const cb = new import_obsidian4.ButtonComponent(block2.controlEl);
          cb.setButtonText("\u8FD8\u539F");
          cb.setDisabled(false);
          cb.onClick(() => {
            cb.setDisabled(true);
            fs3.unlinkSync(path4.join(plugin.path, "main.js"));
            fs3.renameSync(path4.join(plugin.path, "main-copy.js"), path4.join(plugin.path, "main.js"));
            i18nstate.update(false, "", plugin.version);
            this.reload();
            new import_obsidian4.Notice("[\u8FD8\u539F] \u91CD\u542F Obsidian \u751F\u6548");
          });
        }
        if (!state.is_i18n) {
          const cb = new import_obsidian4.ButtonComponent(block2.controlEl);
          cb.setButtonText("\u7FFB\u8BD1");
          cb.setDisabled(false);
          cb.onClick(() => {
            cb.setDisabled(true);
            fs3.copyFileSync(path4.join(plugin.path, "main.js"), path4.join(plugin.path, "main-copy.js"));
            const lang2 = fs3.readFileSync(lang_file_path);
            const json_object = JSON.parse(lang2.toString());
            this.console.log("\u5BF9\u7167\u8868");
            this.console.table(json_object["dict"]);
            let res = fs3.readFileSync(path4.join(plugin.path, "main.js")).toString();
            for (const key in json_object["dict"]) {
              res = res.replaceAll(key, json_object["dict"][key]);
            }
            fs3.writeFileSync(path4.join(plugin.path, "main.js"), res, "utf-8");
            i18nstate.update(true, json_object["manifest"].version, plugin.version);
            this.reload();
            new import_obsidian4.Notice("[\u7FFB\u8BD1]\u91CD\u542F Obsidian \u751F\u6548");
          });
        }
      } else {
        this.console.log("[\u672C\u5730][\u8BD1\u6587] \u{1F534}\u4E0D\u5B58\u5728");
      }
      this.console.groupEnd();
    }
    for (const plugin of this.plugins1) {
      console.log(`[${plugin.name}]`);
      const plugin_path = path4.join(this.base_path, plugin.dir);
      const block2 = new import_obsidian4.Setting(contentEl);
      block2.setName(plugin.name);
      block2.descEl.createDiv({ text: "\u7248\u672C: " + plugin.version });
      const cb = new import_obsidian4.ExtraButtonComponent(block2.controlEl);
      cb.setIcon("folder-open");
      cb.setDisabled(false);
      cb.onClick(() => {
        const command = `powershell.exe -Command "ii ${plugin_path}"`;
        (0, import_child_process.exec)(command, (error, file) => {
          console.log(error, file.toString());
        });
      });
      const is_lang_dir = fs3.existsSync(path4.join(plugin_path, "lang")) ? true : false;
      console.log(`\u76EE\u5F55 ${is_lang_dir}`);
      if (!is_lang_dir)
        continue;
      const is_state_dir = fs3.existsSync(path4.join(plugin_path, "lang", "state.json")) ? true : false;
      console.log(`\u72B6\u6001\u6587\u4EF6 ${is_state_dir}`);
      const stateObj = new State(path4.join(plugin_path, "lang", "state.json"));
      const state = stateObj.select();
      if (!is_state_dir)
        stateObj.insert();
      if (state.is_i18n && plugin.version != state.plugin_version) {
        fs3.unlinkSync(path4.join(plugin_path, "duplicate.js"));
        stateObj.reset();
        new import_obsidian4.Notice(`\u{1F4AC}[${plugin.name}] \u63D2\u4EF6\u66F4\u65B0 \u7FFB\u8BD1\u8FD8\u539F`);
      }
      const a = "zh-cn";
      const is_lang = fs3.existsSync(path4.join(plugin_path, `lang\\${a}.json`)) ? true : false;
      let mark;
      if (i18n_api_safemode && this.ndt_mark)
        mark = plugin.name in this.directory;
      console.log(`\u6D4B\u8BD5 ${mark}`);
      const NDT_Button = new import_obsidian4.ButtonComponent(block2.controlEl);
      if (!i18n_api_safemode && this.ndt_mark && mark)
        NDT_Button.setClass("hider-ribbon");
      NDT_Button.setButtonText(!is_lang ? "\u4E0B\u8F7D" : "\u66F4\u65B0");
      NDT_Button.setCta();
      NDT_Button.setDisabled(false);
      NDT_Button.onClick(() => {
        if (!is_lang) {
          console.log("\u4E0B\u8F7D\u64CD\u4F5C");
        } else {
          console.log("\u66F4\u65B0\u64CD\u4F5C");
        }
      });
      const LDT_Button = new import_obsidian4.ButtonComponent(block2.controlEl);
      LDT_Button.setButtonText(!state.is_i18n ? "\u7FFB\u8BD1" : "\u8FD8\u539F");
      LDT_Button.setDisabled(false);
      LDT_Button.onClick(() => {
        LDT_Button.setDisabled(true);
        if (!state.is_i18n) {
          const a2 = "zh-cn";
          const translation_path = path4.join(this.base_path, plugin.dir, "lang", `${a2}.json`);
          const translation_object = this.LDTObj.translation(plugin_path, translation_path);
          stateObj.update(true, translation_object["manifest"].version, plugin.version);
          new import_obsidian4.Notice("[\u7FFB\u8BD1] \u91CD\u542F Obsidian \u751F\u6548");
        } else {
          this.LDTObj.restore(plugin_path);
          stateObj.reset();
          new import_obsidian4.Notice("[\u8FD8\u539F] \u91CD\u542F Obsidian \u751F\u6548");
        }
        this.reload();
      });
    }
    this.console.groupEnd();
  }
  // 内部 重载函数
  reload() {
    this.plugins = [];
    this.close();
    this.open();
  }
  removeDier(path5) {
    const data = fs3.readdirSync(path5);
    for (let i = 0; i < data.length; i++) {
      const url = path5 + "/" + data[i];
      const stat = fs3.statSync(url);
      if (stat.isDirectory()) {
        this.removeDier(url);
      } else {
        fs3.unlinkSync(url);
      }
    }
    fs3.rmdirSync(path5);
  }
  // [开启]
  async onOpen() {
    const { contentEl } = this;
    contentEl.setText("\u63D2\u4EF6\u5217\u8868");
    await this.init_plugins();
    await this.init_show();
  }
  // [关闭]
  async onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};

// main.ts
var main_default = I18N;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvbWFpbi50cyIsICJzcmMvc2V0dGluZ3MvZGF0YS50cyIsICJzcmMvc2V0dGluZ3MvdWkvc2V0dGluZ3MudHMiLCAic3JjL2FwaS50cyIsICJzcmMvdXRpbHMudHMiLCAic3JjL2kxOG4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCBJMThuIGZyb20gJy4vc3JjL21haW4nXHJcblxyXG5leHBvcnQgZGVmYXVsdCBJMThuXHJcbiIsICJpbXBvcnQgeyBBcHAsIEJ1dHRvbkNvbXBvbmVudCwgRXh0cmFCdXR0b25Db21wb25lbnQsIE1vZGFsLCBOb3RpY2UsIFBsdWdpbiwgU2V0dGluZywgYWRkSWNvbiB9IGZyb20gJ29ic2lkaWFuJztcclxuXHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXHJcblxyXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBJMThuUGx1Z2luU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzL2RhdGEnXHJcbmltcG9ydCB7IEkxOG5TZXR0aW5nVGFiIH0gZnJvbSAnLi9zZXR0aW5ncy91aS9zZXR0aW5ncyc7XHJcblxyXG5pbXBvcnQgeyBJMThOU3RhdGUsIENvbnNvbGUsIFN0YXRlIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCBBcGkgZnJvbSAnLi9hcGknO1xyXG5pbXBvcnQgeyBleGVjLCBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5cclxuaW1wb3J0IHsgTERULCBORFQsIE5JVCB9IGZyb20gJy4vaTE4bic7XHJcblxyXG5cclxuLy8gXHU4QkIwXHU0RjRGXHU5MUNEXHU1NDdEXHU1NDBEXHU4RkQ5XHU0RTlCXHU3QzdCXHU1NDhDXHU2M0E1XHU1M0UzXHVGRjAxXHJcblxyXG5pbnRlcmZhY2UgSVBsdWdpbiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdmVyc2lvbjogc3RyaW5nO1xyXG4gICAgYXV0aG9yOiBzdHJpbmc7XHJcblx0cGF0aDogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSURpcmVjdG9yeXtcclxuXHRwbHVnaW46c3RyaW5nLFxyXG5cdGxhbmd1YWdlczpBcnJheTxzdHJpbmc+XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUGx1Z2luMSB7XHJcblx0aWQ6c3RyaW5nO1xyXG5cdG5hbWU6c3RyaW5nO1xyXG5cdHZlcnNpb246c3RyaW5nO1xyXG5cdGRlc2NyaXB0aW9uOnN0cmluZztcclxuXHRhdXRob3I6c3RyaW5nO1xyXG5cdGF1dGhvclVybDpzdHJpbmc7XHJcblx0ZnVuZGluZ1VybDpzdHJpbmc7XHJcblx0aXNEZXNrdG9wT25seTpib29sZWFuO1xyXG5cdGRpcjpzdHJpbmc7XHJcblx0bWluQXBwVmVyc2lvbjpzdHJpbmc7XHJcblx0aGVscFVybDpzdHJpbmc7XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyAgICAgICAgICBbXHU1MTY1XHU1M0UzXSBJMThuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJMThOIGV4dGVuZHMgUGx1Z2luIHtcclxuXHQvLyBbXHU1M0Q4XHU5MUNGXSBcdTYwM0JcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcclxuXHRpMThuU2V0dGluZ3M6IEkxOG5QbHVnaW5TZXR0aW5ncztcclxuXHQvLyBbXHU1M0Q4XHU5MUNGXSBcdTU3RkFcdTc4NDBcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcclxuXHRzZXR0aW5nczogSTE4blBsdWdpblNldHRpbmdzWydzZXR0aW5ncyddO1xyXG5cdC8vIFtcdTUzRDhcdTkxQ0ZdIFx1OEJFRFx1OEEwMFx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxyXG5cdGxhbmd1YWdlczogSTE4blBsdWdpblNldHRpbmdzWydsYW5ndWFnZXMnXTtcclxuXHRcclxuXHQvLyBcdTc1MUZcdTU0N0RcdTU0NjhcdTY3MUZcdTUxRkRcdTY1NzBcdTU3MjhcdTc1MjhcdTYyMzdcdTZGQzBcdTZEM0IgT2JzaWRpYW4gXHU2M0QyXHU0RUY2XHU2NUY2XHU4OUU2XHU1M0QxXHUzMDAyXHU4RkQ5XHU1QzA2XHU2NjJGXHU2MEE4XHU4QkJFXHU3RjZFXHU2M0QyXHU0RUY2XHU1OTI3XHU5MEU4XHU1MjA2XHU1MjlGXHU4MEZEXHU3Njg0XHU1NzMwXHU2NUI5XHUzMDAyXHU4QkU1XHU2NUI5XHU2Q0Q1XHU1NzI4XHU2M0QyXHU0RUY2XHU2NkY0XHU2NUIwXHU2NUY2XHU0RTVGXHU0RjFBXHU4OEFCXHU4OUU2XHU1M0QxXHUzMDAyXHJcblx0YXN5bmMgb25sb2FkKCkge1xyXG5cdFx0Ly8gW1x1NTJBMFx1OEY3RF0gXHU2QjIyXHU4RkNFXHU4QkVEXHU1M0U1XHJcblx0XHRuZXcgTm90aWNlKCdbXHU1RjAwXHU1NDJGXWkxOG4nKTtcclxuXHJcblx0XHQvLyBbXHU1MjFEXHU1OUNCXHU1MzE2XVtcdTkxNERcdTdGNkVdXHJcblx0XHRhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG5cdFx0Ly8gW1x1NTIxRFx1NTlDQlx1NTMxNl1bXHU5MTREXHU3RjZFXSBcdTU3RkFcdTc4NDBcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSB0aGlzLmkxOG5TZXR0aW5ncy5zZXR0aW5ncztcclxuXHRcdC8vIFtcdTUyMURcdTU5Q0JcdTUzMTZdW1x1OTE0RFx1N0Y2RV0gXHU4QkVEXHU4QTAwXHJcblx0XHR0aGlzLmxhbmd1YWdlcyA9IHRoaXMuaTE4blNldHRpbmdzLmxhbmd1YWdlcztcclxuXHRcdFxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyAgICAgICAgW1x1NTI5Rlx1ODBGRFx1NTMzQV0gXHU3RkZCXHU4QkQxXHJcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdHRoaXMuYWRkUmliYm9uSWNvbignZ2xvYmUtMicsICdJMThOJywgKGV2dDogTW91c2VFdmVudCkgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmNsZWFyKCk7XHJcblx0XHRcdG5ldyBUcmFuc2xhdGVNb2RhbCh0aGlzLmFwcCwgdGhpcykub3BlbigpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyAgICAgICAgW1x1NzJCNlx1NjAwMVx1NjgwRl0gXHU2RDRCXHU4QkQ1XHJcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdC8vIGNvbnN0IHN0YXR1c0Jhckl0ZW1FbCA9IHRoaXMuYWRkU3RhdHVzQmFySXRlbSgpO1xyXG5cdFx0Ly8gc3RhdHVzQmFySXRlbUVsLnNldFRleHQoYFtcdThCRURcdThBMDBdIFx1N0I4MFx1NEY1M1x1NEUyRFx1NjU4N2ApO1xyXG5cdFx0XHJcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdC8vICAgICAgICBbXHU4QkJFXHU3RjZFXSBcdTRFM0JcdTk4NzVcdTk3NjJcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0dGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBJMThuU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cdH1cclxuXHJcblx0Ly8gXHU1NDdEXHU1NDY4XHU2NzFGXHU1MUZEXHU2NTcwXHU1NzI4XHU2M0QyXHU0RUY2XHU4OEFCXHU3OTgxXHU3NTI4XHU2NUY2XHU4OUU2XHU1M0QxXHUzMDAyXHU2M0QyXHU0RUY2XHU2MjQwXHU4QzAzXHU3NTI4XHU3Njg0XHU0RUZCXHU0RjU1XHU4RDQ0XHU2RTkwXHU1RkM1XHU5ODdCXHU1NzI4XHU4RkQ5XHU5MUNDXHU1Rjk3XHU1MjMwXHU5MUNBXHU2NTNFXHVGRjBDXHU0RUU1XHU5NjMyXHU2QjYyXHU1NzI4XHU2MEE4XHU3Njg0XHU2M0QyXHU0RUY2XHU4OEFCXHU3OTgxXHU3NTI4XHU1NDBFXHU1QkY5IE9ic2lkaWFuIFx1NzY4NFx1NjAyN1x1ODBGRFx1NEVBN1x1NzUxRlx1NUY3MVx1NTRDRFx1MzAwMlxyXG5cdGFzeW5jIG9udW5sb2FkKCkge1xyXG5cdFx0bmV3IE5vdGljZSgnW1x1NTE3M1x1OTVFRF1pMThuJyk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcblx0XHR0aGlzLmkxOG5TZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBzYXZlU2V0dGluZ3MoKSB7XHJcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuaTE4blNldHRpbmdzKTtcclxuXHR9XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBcclxuLy8gICAgICAgICAgICAgICAgICBcdTRGQTdcdThGQjlcdTY4MEYgXHU1QkY5XHU4QkREXHU2ODQ2IFx1N0ZGQlx1OEJEMVxyXG4vLyBcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmNsYXNzIFRyYW5zbGF0ZU1vZGFsIGV4dGVuZHMgTW9kYWwge1xyXG5cdC8vIFtcdTYzRDJcdTRFRjZdW1x1NTNEOFx1OTFDRl0gSTE4blx1NjNEMlx1NEVGNlxyXG5cdGkxOG46IEkxOE47XHJcblxyXG5cdC8vIFtcdTY3MkNcdTU3MzBdW1x1NTNEOFx1OTFDRl0gXHU5ODc5XHU3NkVFXHU3NkVFXHU1RjU1XHU4REVGXHU1Rjg0XHJcblx0YmFzZV9wYXRoOiBzdHJpbmc7XHJcblx0Ly8gW1x1NjcyQ1x1NTczMF1bXHU1M0Q4XHU5MUNGXSBcdTYzRDJcdTRFRjZcdTY1ODdcdTRFRjZcdTU5MzlcdThERUZcdTVGODRcclxuXHRwbHVnaW5zX3BhdGg6IHN0cmluZztcclxuXHQvLyBbXHU2NzJDXHU1NzMwXVtcdTUzRDhcdTkxQ0ZdIFx1NjNEMlx1NEVGNlx1NTIxN1x1ODg2OFxyXG5cdHBsdWdpbnMgPSBuZXcgQXJyYXk8SVBsdWdpbj4oKTtcclxuXHRwbHVnaW5zMSA9IG5ldyBBcnJheTxJUGx1Z2luMT4oKTtcclxuXHJcblx0Ly8gW1x1N0Y1MVx1N0VEQ11bXHU1M0Q4XHU5MUNGXSBcdTdGNTFcdTdFRENcdTY1ODdcdTRFRjZcdTc2RUVcdTVGNTVcclxuXHRkaXJlY3Rvcnk6IElEaXJlY3RvcnlbXTtcclxuXHQvLyBbXHU3RjUxXHU3RURDXVtcdTUzRDhcdTkxQ0ZdIFx1N0Y1MVx1N0VEQ1x1OEZERVx1NjNBNVx1NzJCNlx1NjAwMVxyXG5cdHdlYl9tYXJrID0gdHJ1ZTtcclxuXHRuZHRfbWFyayA9IHRydWU7XHJcblxyXG5cdC8vIFtcdTVERTVcdTUxNzddW1x1NTNEOFx1OTFDRl0gQVBJIFx1NURFNVx1NTE3N1xyXG5cdGFwaTogQXBpO1xyXG5cdC8vIFtcdTVERTVcdTUxNzddW1x1NTNEOFx1OTFDRl0gXHU2M0E3XHU1MjM2XHU1M0YwXHU4RjkzXHU1MUZBIFx1NURFNVx1NTE3N1xyXG5cdGNvbnNvbGU6IENvbnNvbGU7XHJcblxyXG5cdExEVE9iajpMRFQ7XHJcblx0TkRUT2JqOk5EVDtcclxuXHROSVRPYmo6TklUO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyAgICAgICAgICAgICAgICAgICAgICAgIFx1NTIxRFx1NTlDQlx1NTMxNlxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBpMThuOkkxOE4pIHtcclxuXHRcdHN1cGVyKGFwcCk7XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLmFwcClcclxuXHRcdC8vIFx1NjNEMlx1NEVGNlx1NTIxN1x1ODg2OFxyXG5cdFx0Y29uc29sZS5sb2codGhpcy5hcHAucGx1Z2lucy5tYW5pZmVzdHMpXHJcblx0XHQvLyBcdTVERTVcdTRGNUNcdTc2RUVcdTVGNTVcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuYmFzZVBhdGgpXHJcblxyXG5cdFx0Ly8gW1x1NTIxRFx1NTlDQlx1NTMxNl0gSTE4blx1NjNEMlx1NEVGNlxyXG5cdFx0dGhpcy5pMThuID0gaTE4bjtcclxuXHRcdC8vIFtcdTUyMURcdTU5Q0JcdTUzMTZdIFx1NURFNVx1NEY1Q1x1NzZFRVx1NUY1NVxyXG5cdFx0dGhpcy5iYXNlX3BhdGggPSBwYXRoLm5vcm1hbGl6ZSh0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmJhc2VQYXRoKTtcclxuXHRcdC8vIFtcdTUyMURcdTU5Q0JcdTUzMTZdIFx1NjNEMlx1NEVGNlx1NzZFRVx1NUY1NVxyXG5cdFx0dGhpcy5wbHVnaW5zX3BhdGggPSBwYXRoLmpvaW4odGhpcy5iYXNlX3BhdGgsIHRoaXMuaTE4bi5zZXR0aW5ncy5wbHVnaW5zX3BhdGgpO1xyXG5cclxuXHRcdC8vIFtcdTUyMURcdTU5Q0JcdTUzMTZdIFx1NURFNVx1NTE3N1x1N0M3QlxyXG5cdFx0dGhpcy5jb25zb2xlID0gbmV3IENvbnNvbGUodGhpcy5pMThuLnNldHRpbmdzLmxvZykgXHJcblx0XHR0aGlzLmFwaSA9IG5ldyBBcGkodGhpcy5pMThuKTtcclxuXHJcblx0XHR0aGlzLkxEVE9iaiA9IG5ldyBMRFQoKTtcclxuXHRcdHRoaXMuTkRUT2JqID0gbmV3IE5EVCh0aGlzLmkxOG4pO1xyXG5cdFx0dGhpcy5OSVRPYmogPSBuZXcgTklUKCk7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyAgICAgICAgICAgICAgICAgICAgICAgIFx1NTIxRFx1NTlDQlx1NTMxNlxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGFzeW5jIGluaXRfcGx1Z2lucygpe1xyXG5cdFx0dGhpcy5jb25zb2xlLmdyb3VwKCdbXHU1MjFEXHU1OUNCXHU1MzE2XSBcdTYzRDJcdTRFRjYnKTtcclxuXHRcdC8vIFx1NjNEMlx1NEVGNlx1NjU4N1x1NEVGNlx1NTkzOVxyXG5cdFx0Y29uc3QgcGx1Z2luX2ZvbGRlcnMgPSBmcy5yZWFkZGlyU3luYyh0aGlzLnBsdWdpbnNfcGF0aCk7XHJcblx0XHQvLyBcdTgzQjdcdTUzRDZcdTYyNDBcdTY3MDlcdTYzRDJcdTRFRjZcdTY1NzBcdTYzNkVcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGx1Z2luX2ZvbGRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Ly8gW1x1OERFRlx1NUY4NF0gXHU2M0QyXHU0RUY2XHU4REVGXHU1Rjg0XHJcblx0XHRcdGNvbnN0IHBsdWdpbl9wYXRoID0gcGF0aC5qb2luKHRoaXMucGx1Z2luc19wYXRoLCBwbHVnaW5fZm9sZGVyc1tpXSk7XHJcblx0XHRcdC8vIFtcdThERUZcdTVGODRdIFx1NjNEMlx1NEVGNlx1NjNDRlx1OEZGMFx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NFxyXG5cdFx0XHRjb25zdCBtYW5pZmVzdF9wYXRoID0gcGF0aC5qb2luKHBsdWdpbl9wYXRoLCAnbWFuaWZlc3QuanNvbicpO1xyXG5cclxuXHRcdFx0Ly8gW1x1ODNCN1x1NTNENl0gXHU2M0QyXHU0RUY2XHU2M0NGXHU4RkYwXHU2NTg3XHU0RUY2PEpzb24+XHJcblx0XHRcdGNvbnN0IG1hbmlmZXN0ID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMobWFuaWZlc3RfcGF0aCkudG9TdHJpbmcoKSk7XHJcblxyXG5cdFx0XHQvLyBbXHU0RTM0XHU2NUY2XSBcdTYzRDJcdTRFRjZcdTVCRjlcdThDNjFcclxuXHRcdFx0Y29uc3QgcGx1Z2luOiBJUGx1Z2luID0ge1xyXG5cdFx0XHRcdGlkOiBtYW5pZmVzdC5pZCxcclxuXHRcdFx0XHRuYW1lOiBtYW5pZmVzdC5uYW1lLFxyXG5cdFx0XHRcdHZlcnNpb246IG1hbmlmZXN0LnZlcnNpb24sXHJcblx0XHRcdFx0YXV0aG9yOiBtYW5pZmVzdC5hdXRob3IsXHJcblx0XHRcdFx0cGF0aDogcGx1Z2luX3BhdGhcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gW1x1NkRGQlx1NTJBMF0gXHU1QzA2XHU4M0I3XHU1M0Q2XHU1MjMwXHU2M0QyXHU0RUY2XHU1QkY5XHU4QzYxXHU2REZCXHU1MkEwXHU4MUYzXHU1QkY5XHU4QzYxXHU1MjE3XHU4ODY4XHJcblx0XHRcdHRoaXMucGx1Z2lucy5wdXNoKHBsdWdpbik7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jb25zb2xlLmxvZyhgW1x1NjNEMlx1NEVGNlx1NjU3MFx1OTFDRl0gXHU1MTcxXHU4QkExICR7dGhpcy5wbHVnaW5zLmxlbmd0aH0gXHU0RTJBXHU2M0QyXHU0RUY2YCk7XHJcblx0XHR0aGlzLmNvbnNvbGUubG9nKCdbXHU2M0QyXHU0RUY2XHU1MjE3XHU4ODY4XScpO1xyXG5cdFx0dGhpcy5jb25zb2xlLnRhYmxlKHRoaXMucGx1Z2lucyk7XHJcblxyXG5cdFx0Ly8gXHU4M0I3XHU1M0Q2XHU2M0QyXHU0RUY2XHU1QkY5XHU4QzYxXHU1RTc2XHU1QzA2XHU1MTc2XHU4RjZDXHU2MzYyXHU0RTNBXHU1MjE3XHU4ODY4XHJcblx0XHR0aGlzLnBsdWdpbnMxID0gT2JqZWN0LnZhbHVlcyh0aGlzLmFwcC5wbHVnaW5zLm1hbmlmZXN0cyk7XHJcblx0XHR0aGlzLmNvbnNvbGUubG9nKGBbXHU2M0QyXHU0RUY2XHU2NTcwXHU5MUNGXSBcdTUxNzFcdThCQTEgJHt0aGlzLnBsdWdpbnMxLmxlbmd0aH0gXHU0RTJBXHU2M0QyXHU0RUY2YCk7XHJcblx0XHR0aGlzLmNvbnNvbGUubG9nKCdbXHU2M0QyXHU0RUY2XHU1MjE3XHU4ODY4XScpO1xyXG5cdFx0dGhpcy5jb25zb2xlLnRhYmxlKHRoaXMucGx1Z2luczEpO1xyXG5cclxuXHRcdC8vIFx1NUY1M1x1NUI4OVx1NTE2OFx1NkEyMVx1NUYwRlx1NTE3M1x1OTVFRFx1NjVGNiBcdTgzQjdcdTUzRDZcclxuXHRcdGlmKCF0aGlzLmkxOG4uc2V0dGluZ3MuaTE4bl9uZHRfbW9kZSl7XHJcblx0XHRcdC8vIFx1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVxyXG5cdFx0XHRjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5hcGkuZ2V0RGlyZWN0b3J5KCk7XHJcblx0XHRcdC8vIFx1NTIyNFx1NjVBRFx1OEJGN1x1NkM0MlxyXG5cdFx0XHRpZihkYXRhLmNvZGUpe1xyXG5cdFx0XHRcdHRoaXMuZGlyZWN0b3J5ID0gSlNPTi5wYXJzZShkYXRhLnRleHQpO1xyXG5cdFx0XHRcdHRoaXMuY29uc29sZS5sb2codHlwZW9mKHRoaXMuZGlyZWN0b3J5KSk7XHJcblx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZygnW1x1NzZFRVx1NUY1NVx1NTIxN1x1ODg2OF0nKTtcclxuXHRcdFx0XHR0aGlzLmNvbnNvbGUudGFibGUodGhpcy5kaXJlY3RvcnkpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aGlzLmNvbnNvbGUubG9nKCdbXHU3NkVFXHU1RjU1XHU1MjE3XHU4ODY4XScpO1xyXG5cdFx0XHRcdC8vIFx1OEJGN1x1NkM0Mlx1NjgwN1x1OEJCMFx1NTkzMVx1OEQyNVxyXG5cdFx0XHRcdHRoaXMud2ViX21hcmsgPSBmYWxzZTtcclxuXHRcdFx0XHQvLyBcdThCRjdcdTZDNDJcdTU5MzFcdThEMjVcdThGRDRcdTU2REVcdTUxODVcdTVCQjlcclxuXHRcdFx0XHRuZXcgTm90aWNlKGBcdTI3NTcke2RhdGEudGV4dH1gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYodGhpcy5pMThuLnNldHRpbmdzLmkxOG5fbmR0X21vZGUpe1xyXG5cdFx0XHRjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5ORFRPYmouZ2V0RGlyZWN0b3J5KCk7XHJcblx0XHRcdGRhdGEuY29kZT8gdGhpcy5kaXJlY3RvcnkgPSBKU09OLnBhcnNlKGRhdGEudGV4dCkgOiB0aGlzLm5kdF9tYXJrID0gZmFsc2U7XHJcblx0XHRcdGlmKCFkYXRhLmNvZGUpIG5ldyBOb3RpY2UoYFx1Mjc1NyR7ZGF0YS50ZXh0fWApO1xyXG5cdFx0XHR0aGlzLmNvbnNvbGUubG9nKCdbXHU3NkVFXHU1RjU1XHU1MjE3XHU4ODY4XScpO1xyXG5cdFx0XHRpZihkYXRhLmNvZGUpIHRoaXMuY29uc29sZS50YWJsZSh0aGlzLmRpcmVjdG9yeSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jb25zb2xlLmdyb3VwRW5kKCk7XHJcblx0fVxyXG5cdFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICAgXHU2RTMyXHU2N0QzXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0YXN5bmMgaW5pdF9zaG93KCl7XHJcblx0XHQvLyBbXHU1QkY5XHU4QkREXHU2ODQ2XSBcdTdGRkJcdThCRDFcclxuXHRcdHRoaXMuY29uc29sZS5ncm91cENvbGxhcHNlZChgW1x1NTIxRFx1NTlDQlx1NTMxNl0gXHU2RTMyXHU2N0QzYCk7XHJcblxyXG5cdFx0Y29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XHJcblxyXG5cdFx0Y29uc3QgYmxvY2sgPSBuZXcgU2V0dGluZyhjb250ZW50RWwpO1xyXG5cdFx0YmxvY2suc2V0TmFtZSgnXHU4QkVEXHU4QTAwJylcclxuXHRcdC8vIFx1NjZGNFx1NjUzOVx1OEJFRFx1OEEwMFxyXG5cdFx0YmxvY2suYWRkRHJvcGRvd24oY2IgPT4gY2JcclxuXHRcdFx0LmFkZE9wdGlvbnModGhpcy5pMThuLmxhbmd1YWdlcylcclxuXHRcdFx0LnNldFZhbHVlKHRoaXMuaTE4bi5zZXR0aW5ncy5sYW5ndWFnZSlcclxuXHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSk9PntcclxuXHRcdFx0XHR0aGlzLmkxOG4uc2V0dGluZ3MubGFuZ3VhZ2UgPSB2YWx1ZTtcclxuXHRcdFx0XHR0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZyhgW1x1OTE0RFx1N0Y2RV0gbGFuZ3VhZ2U6ICR7dGhpcy5pMThuLnNldHRpbmdzLmxhbmd1YWdlfWApXHJcblx0XHRcdFx0Ly8gXHU5MUNEXHU4RjdEXHU5ODc1XHU5NzYyXHJcblx0XHRcdFx0dGhpcy5yZWxvYWQoKTtcclxuXHRcdFx0fSlcclxuXHRcdCk7XHJcblx0XHQvLyBbXHU0RTM0XHU2NUY2XHU1M0Q4XHU5MUNGXSBcdTdGRkJcdThCRDFcdThCRURcdThBMDBcclxuXHRcdGNvbnN0IGxhbmcgPSB0aGlzLmkxOG4uc2V0dGluZ3MubGFuZ3VhZ2U7XHJcblx0XHR0aGlzLmNvbnNvbGUubG9nKGBbXHU0RTM0XHU2NUY2XHU1M0Q4XHU5MUNGXSBcdTdGRkJcdThCRDFcdThCRURcdThBMDAgPT4gJHtsYW5nfWApO1xyXG5cdFx0Ly8gW1x1NEUzNFx1NjVGNlx1NTNEOFx1OTFDRl0gXHU3RjUxXHU3RURDXHU2NTg3XHU0RUY2IFx1NkEyMVx1NUYwRlxyXG5cdFx0Y29uc3QgaTE4bl93ZWJfc2FmZW1vZGUgPSB0aGlzLmkxOG4uc2V0dGluZ3MuaTE4bl9uZHRfbW9kZTtcclxuXHRcdHRoaXMuY29uc29sZS5sb2coYFtcdTRFMzRcdTY1RjZcdTUzRDhcdTkxQ0ZdIFx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNlx1NkEyMVx1NUYwRiA9PiAke2kxOG5fd2ViX3NhZmVtb2RlID8gJ1x1NUYwMFx1NTQyRic6ICdcdTUxNzNcdTk1RUQnfWApO1xyXG5cdFx0Ly8gW1x1NEUzNFx1NjVGNlx1NTNEOFx1OTFDRl0gQVBJIFx1NkEyMVx1NUYwRlxyXG5cdFx0Y29uc3QgaTE4bl9hcGlfc2FmZW1vZGUgPSB0aGlzLmkxOG4uc2V0dGluZ3MuaTE4bl9uaXRfbW9kZTtcclxuXHRcdHRoaXMuY29uc29sZS5sb2coYFtcdTRFMzRcdTY1RjZcdTUzRDhcdTkxQ0ZdIFx1N0Y1MVx1N0VEQ1x1NjNBNVx1NTNFM1x1NkEyMVx1NUYwRiA9PiAke2kxOG5fYXBpX3NhZmVtb2RlID8gJ1x1NUYwMFx1NTQyRic6ICdcdTUxNzNcdTk1RUQnfWApO1xyXG5cclxuXHRcdC8vIFx1NjVFN1x1NzI0OFx1NjNEMlx1NEVGNlxyXG5cdFx0Zm9yKGNvbnN0IHBsdWdpbiBvZiB0aGlzLnBsdWdpbnMpIHtcclxuXHRcdFx0dGhpcy5jb25zb2xlLmdyb3VwQ29sbGFwc2VkKGBbJHtwbHVnaW4ubmFtZX1dYCk7XHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyAgICAgICAgIFx1NTdGQVx1Nzg0MFx1NEZFMVx1NjA2RlxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gW1x1NkUzMlx1NjdEM10gXHU1NzU3XHU1MTQzXHU3RDIwXHJcblx0XHRcdGNvbnN0IGJsb2NrID0gbmV3IFNldHRpbmcoY29udGVudEVsKTtcclxuXHRcdFx0Ly8gW1x1NEZFMVx1NjA2Rl0gXHU1NDBEXHU3OUYwXHJcblx0XHRcdGJsb2NrLnNldE5hbWUocGx1Z2luLm5hbWUpO1xyXG5cdFx0XHQvLyBbXHU0RkUxXHU2MDZGXSBcdTRGNUNcdTgwMDVcclxuXHRcdFx0YmxvY2suZGVzY0VsLmNyZWF0ZURpdih7dGV4dDpcIlx1NEY1Q1x1ODAwNTogXCIgKyBwbHVnaW4uYXV0aG9yfSk7XHJcblx0XHRcdC8vIFtcdTRGRTFcdTYwNkZdIFx1NzI0OFx1NjcyQ1xyXG5cdFx0XHRibG9jay5kZXNjRWwuY3JlYXRlRGl2KHt0ZXh0OlwiXHU3MjQ4XHU2NzJDOiBcIiArIHBsdWdpbi52ZXJzaW9ufSk7XHJcblxyXG5cdFx0XHQvLyBbXHU0RTM0XHU2NUY2XHU1M0Q4XHU5MUNGXSBcdThCRURcdThBMDBcdTc2RUVcdTVGNTVcclxuXHRcdFx0Y29uc3QgbGFuZ19wYXRoID0gcGF0aC5qb2luKHBsdWdpbi5wYXRoLCBgL2xhbmdgKTtcclxuXHRcdFx0Ly8gdGhpcy5jb25zb2xlLmxvZyhgW1x1NEUzNFx1NjVGNlx1NTNEOFx1OTFDRl0gXHU2NzJDXHU1NzMwXHU3RkZCXHU4QkQxXHU2NTg3XHU0RUY2XHU3NkVFXHU1RjU1ID0+ICR7bGFuZ19wYXRofWApO1xyXG5cclxuXHRcdFx0Ly8gW1x1NEUzNFx1NjVGNlx1NTNEOFx1OTFDRl0gXHU3RkZCXHU4QkQxXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHJcblx0XHRcdGNvbnN0IGxhbmdfZmlsZV9wYXRoID0gcGF0aC5qb2luKGxhbmdfcGF0aCwgYCR7bGFuZ30uanNvbmApO1xyXG5cdFx0XHQvLyB0aGlzLmNvbnNvbGUubG9nKGBbXHU0RTM0XHU2NUY2XHU1M0Q4XHU5MUNGXSBcdTY3MkNcdTU3MzBcdTdGRkJcdThCRDFcdTY1ODdcdTRFRjZcdThERUZcdTVGODQgPT4gJHtsYW5nX2ZpbGVfcGF0aH1gKTtcclxuXHJcblx0XHRcdC8vIFtcdTRFMzRcdTY1RjZcdTUzRDhcdTkxQ0ZdIFx1NjcyQ1x1NTczMFx1N0ZGQlx1OEJEMVx1NjU4N1x1NEVGNlx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG5cdFx0XHRjb25zdCBpc19sYW5nX2ZpbGUgPSBmcy5leGlzdHNTeW5jKGxhbmdfZmlsZV9wYXRoKTtcclxuXHRcdFx0Ly8gdGhpcy5jb25zb2xlLmxvZyhgW1x1NEUzNFx1NjVGNlx1NTNEOFx1OTFDRl0gXHU2NzJDXHU1NzMwXHU3RkZCXHU4QkQxXHU2NTg3XHU0RUY2XHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4ID0+ICR7aXNfbGFuZ19maWxlfWApO1xyXG5cclxuXHRcdFx0Ly8gW1x1NEUzNFx1NjVGNlx1NTNEOFx1OTFDRl0gXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2IFx1NjRDRFx1NEY1Q1x1NTFGRFx1NjU3MFxyXG5cdFx0XHRjb25zdCBpMThuc3RhdGUgPSBuZXcgSTE4TlN0YXRlKHBsdWdpbi5wYXRoKTtcclxuXHJcblx0XHRcdC8vIFtcdTRFMzRcdTY1RjZcdTUzRDhcdTkxQ0ZdIFx1NzJCNlx1NjAwMVx1NjU4N1x1NEVGNiBcdTVGNTNcdTUyNERcdTcyQjZcdTYwMDFcclxuXHRcdFx0Y29uc3Qgc3RhdGUgPSBpMThuc3RhdGUuc2VsZWN0KCk7XHJcblxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gICAgICAgICAgICAgXHU2M0QyXHU0RUY2XHU2NkY0XHU2NUIwIFx1N0ZGQlx1OEJEMVx1OEZEOFx1NTM5RlxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gXHU1RjUzXHU2M0QyXHU0RUY2XHU3MjQ4XHU2NzJDXHU2NkY0XHU2NUIwIFx1NUU3Nlx1NEUxNCBcdTYzRDJcdTRFRjZcdTVERjJcdTdGRkJcdThCRDFcdTc2ODRcdTY1RjZcdTUwMTlcclxuXHRcdFx0Ly8gXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2XHU1QjU4XHU1NzI4IFx1NUU3Nlx1NEUxNCBcdTRFM0FcdTdGRkJcdThCRDFcdTcyQjZcdTYwMDEgXHU1RTc2XHU0RTE0IFx1NzI0OFx1NjcyQ1x1NURGMlx1N0VDRlx1NjZGNFx1NjVCMFx1NEU4NlxyXG5cdFx0XHRpZihpMThuc3RhdGUuaXNfc3RhdGUoKSAmJiBzdGF0ZS5pc19pMThuICYmIHBsdWdpbi52ZXJzaW9uICE9IHN0YXRlLnBsdWdpbl92ZXJzaW9uKXtcclxuXHRcdFx0XHQvLyAvLyBcdTUyMjBcdTk2NjRcdTdGRkJcdThCRDFcdThGQzdcdTc2ODRcdTY1ODdcdTRFRjZcclxuXHRcdFx0XHRmcy51bmxpbmtTeW5jKHBhdGguam9pbihwbHVnaW4ucGF0aCwgJ21haW4tY29weS5qcycpKTtcclxuXHRcdFx0XHQvLyAvLyBcdTY2RjRcdTY1QjBcdTdGRkJcdThCRDFcdTcyQjZcdTYwMDFcclxuXHRcdFx0XHRpMThuc3RhdGUudXBkYXRlKGZhbHNlLCAnJywgcGx1Z2luLnZlcnNpb24pO1xyXG5cdFx0XHRcdG5ldyBOb3RpY2UoYFx1RDgzRFx1RENBQ1ske3BsdWdpbi5uYW1lfV0gXHU2M0QyXHU0RUY2XHU2NkY0XHU2NUIwIFx1N0ZGQlx1OEJEMVx1OEZEOFx1NTM5RmApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gXHJcblx0XHRcdC8vICAgICAgICAgICAgICAgICAgICAgICAgXHU3RkZCXHU4QkQxXHU3MkI2XHU2MDAxXHJcblx0XHRcdC8vIFxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0aWYoc3RhdGUuaXNfaTE4bil7XHJcblx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZygnW1x1NjcyQ1x1NTczMF1bXHU3MkI2XHU2MDAxXSBcdUQ4M0RcdURGRTJcdTVERjJcdTdGRkJcdThCRDEnKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZygnW1x1NjcyQ1x1NTczMF1bXHU3MkI2XHU2MDAxXSBcdUQ4M0RcdUREMzRcdTY3MkFcdTdGRkJcdThCRDEnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdC8vIFxyXG5cdFx0XHQvLyAgICAgICAgICAgICAgICAgICAgICAgIFx1N0Y1MVx1N0VEQ1x1NjRDRFx1NEY1Q1xyXG5cdFx0XHQvLyBcclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdC8vIFx1NjhDMFx1NkQ0Qlx1NEUwQlx1OEY3RFxyXG5cdFx0XHRpZihpMThuX3dlYl9zYWZlbW9kZSA9PSBmYWxzZSAmJiB0aGlzLndlYl9tYXJrICYmICFpc19sYW5nX2ZpbGUpe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIFtcdTUyMjRcdTY1QURdIFx1N0Y1MVx1N0VEQ1x1NjYyRlx1NTQyNlx1OEZERVx1NjNBNVx1NjIxMFx1NTI5RiBcdTRFRTUgXHU3RjUxXHU3RURDXHU0RTJEXHU2NjJGXHU1NDI2XHU2MkU1XHU2NzA5XHU3RkZCXHU4QkQxXHU2NTg3XHU0RUY2XHJcblx0XHRcdFx0aWYocGx1Z2luLm5hbWUgaW4gdGhpcy5kaXJlY3Rvcnkpe1xyXG5cdFx0XHRcdFx0Y29uc3QgbGFuZ3MgPSB0aGlzLmRpcmVjdG9yeVtwbHVnaW4ubmFtZV07XHJcblx0XHRcdFx0XHR0aGlzLmNvbnNvbGUudGFibGUoJ1tcdTdGNTFcdTdFRENdW1x1NzZFRVx1NUY1NV0nKTtcclxuXHRcdFx0XHRcdHRoaXMuY29uc29sZS50YWJsZShsYW5ncyk7XHJcblxyXG5cdFx0XHRcdFx0aWYobGFuZ3MuaW5jbHVkZXMobGFuZykpe1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNvbnNvbGUubG9nKCdbXHU3RjUxXHU3RURDXVtcdThCRDFcdTY1ODddIFx1RDgzRFx1REZFMiBcdTVCNThcdTU3MjgnKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgY2IgPSBuZXcgQnV0dG9uQ29tcG9uZW50KGJsb2NrLmNvbnRyb2xFbCk7XHJcblx0XHRcdFx0XHRcdGNiLnNldEN0YSgpXHJcblx0XHRcdFx0XHRcdGNiLnNldEJ1dHRvblRleHQoJ1x1NEUwQlx1OEY3RCcpO1xyXG5cdFx0XHRcdFx0XHRjYi5vbkNsaWNrKGFzeW5jICgpPT57XHJcblx0XHRcdFx0XHRcdFx0bmV3IE5vdGljZSgnXHVEODNEXHVEQ0FDW1x1N0Y1MVx1N0VEQ10gXHU0RTBCXHU4RjdEXHU0RTJELi4uJyk7XHJcblx0XHRcdFx0XHRcdFx0Y2Iuc2V0RGlzYWJsZWQodHJ1ZSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHU4M0I3XHU1M0Q2XHU3RjUxXHU3RURDXHU0RTJEXHU3Njg0IFx1NjU3MFx1NjM2RVxyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmFwaS5nZXRXZWIocGx1Z2luLm5hbWUsIGxhbmcpO1xyXG5cdFx0XHRcdFx0XHRcdGlmKGRhdGEuY29kZSl7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTY3MDlMQU5HXHU2NTg3XHU0RUY2XHU1OTM5IFx1NkNBMVx1NjcwOVx1NUMzMVx1NTIxQlx1NUVGQVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWZzLmV4aXN0c1N5bmMobGFuZ19wYXRoKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLm1rZGlyU3luYyhsYW5nX3BhdGgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZyhkYXRhLnRleHQpXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdTRFMEJcdThGN0RcdTRGRERcdTVCNThcdTUyMzBcdTY3MkNcdTU3MzBcclxuXHRcdFx0XHRcdFx0XHRcdGZzLndyaXRlRmlsZVN5bmMobGFuZ19maWxlX3BhdGgsIGRhdGEudGV4dCk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdTUyMzdcdTY1QjBcdTY0Q0RcdTRGNUNcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMucmVsb2FkKClcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdG5ldyBOb3RpY2UoYFx1Mjc1NyR7ZGF0YS50ZXh0fWApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRjYi5zZXREaXNhYmxlZChmYWxzZSk7XHJcblx0XHRcdFx0XHRcdFx0bmV3IE5vdGljZSgnXHVEODNEXHVEQ0FDW1x1N0Y1MVx1N0VEQ10gXHU0RTBCXHU4RjdEXHU1QjhDXHU2MjEwJyk7XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZygnW1x1N0Y1MVx1N0VEQ11bXHU4QkQxXHU2NTg3XSBcdUQ4M0RcdUREMzQgXHU0RTBEXHU1QjU4XHU1NzI4Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBcdTY4QzBcdTZENEJcdTY2RjRcdTY1QjBcclxuXHRcdFx0aWYoaTE4bl93ZWJfc2FmZW1vZGUgPT0gZmFsc2UgJiYgdGhpcy53ZWJfbWFyayAmJiBpc19sYW5nX2ZpbGUpe1xyXG5cdFx0XHRcdC8vIFx1OEJGQlx1NTNENlx1NjcyQ1x1NTczMFx1N0ZGQlx1OEJEMVx1NjU4N1x1NEVGNlxyXG5cdFx0XHRcdGNvbnN0IGxvY2FsX2xhbmdfdGV4dCA9IGZzLnJlYWRGaWxlU3luYyhsYW5nX2ZpbGVfcGF0aCk7XHJcblx0XHRcdFx0Ly8gXHU4QkY3XHU2QzQyIFx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNlxyXG5cdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmFwaS5nZXRXZWIocGx1Z2luLm5hbWUsIGxhbmcpO1xyXG5cdFx0XHRcdGlmKGRhdGEuY29kZSl7XHJcblx0XHRcdFx0XHQvLyBcdTY3MkNcdTU3MzBcdThCRURcdThBMDBcdTY1ODdcdTRFRjYgXHU4RjZDIGpzb25cdTVCRjlcdThDNjFcclxuXHRcdFx0XHRcdGNvbnN0IGxvY2FsX2xhbmdfanNvbiA9IEpTT04ucGFyc2UobG9jYWxfbGFuZ190ZXh0LnRvU3RyaW5nKCkpO1xyXG5cdFx0XHRcdFx0Ly8gXHU3RjUxXHU3RURDXHU4QkVEXHU4QTAwXHU2NTg3XHU0RUY2IFx1OEY2QyBqc29uXHU1QkY5XHU4QzYxXHJcblx0XHRcdFx0XHRjb25zdCB3ZWJfbGFuZ19qc29uID0gSlNPTi5wYXJzZShkYXRhLnRleHQpO1xyXG5cdFx0XHRcdFx0Ly8gW1x1NTIyNFx1NjVBRF0gXHU2NzJDXHU1NzMwXHU2NjJGXHU1NDI2XHU5NzAwXHU4OTgxXHU2NkY0XHU2NUIwXHJcblx0XHRcdFx0XHRpZihsb2NhbF9sYW5nX2pzb25bJ21hbmlmZXN0J11bJ3ZlcnNpb24nXSAhPSB3ZWJfbGFuZ19qc29uWydtYW5pZmVzdCddWyd2ZXJzaW9uJ10pe1xyXG5cdFx0XHRcdFx0XHRjb25zdCBjYiA9IG5ldyBCdXR0b25Db21wb25lbnQoYmxvY2suY29udHJvbEVsKTtcclxuXHRcdFx0XHRcdFx0Y2Iuc2V0Q3RhKCk7XHJcblx0XHRcdFx0XHRcdGNiLnNldEJ1dHRvblRleHQoJ1x1NjZGNFx1NjVCMCcpO1xyXG5cdFx0XHRcdFx0XHRjYi5vbkNsaWNrKCgpPT57XHJcblx0XHRcdFx0XHRcdFx0Y2Iuc2V0RGlzYWJsZWQodHJ1ZSk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZygnW1x1N0Y1MVx1N0VEQ10gXHU2NzJDXHU1NzMwXHU3MjQ4XHU2NzJDJyArIChsb2NhbF9sYW5nX2pzb25bJ21hbmlmZXN0J11bJ3ZlcnNpb24nXSkpXHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZygnW1x1N0Y1MVx1N0VEQ10gXHU1NzI4XHU3RUJGXHU3MjQ4XHU2NzJDJyArICh3ZWJfbGFuZ19qc29uWydtYW5pZmVzdCddWyd2ZXJzaW9uJ10pKVxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY29uc29sZS5sb2coYFtcdTY3MkNcdTU3MzBdIFx1NUY1M1x1NTI0RFx1N0ZGQlx1OEJEMVx1NzJCNlx1NjAwMSAke3N0YXRlLmlzX2kxOG59YClcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHQvLyBcdTUyMjRcdTY1QURcdTdGRkJcdThCRDFcdTcyQjZcdTYwMDFcclxuXHRcdFx0XHRcdFx0XHRpZihzdGF0ZS5pc19pMThuKXtcclxuXHRcdFx0XHRcdFx0XHRcdG5ldyBOb3RpY2UoJ1x1RDgzRFx1RENBQ1tcdTdGNTFcdTdFRENdIFx1OEJGN1x1NTE0OFx1OEZEQlx1ODg0Q1x1OEZEOFx1NTM5RicpO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0bmV3IE5vdGljZSgnXHVEODNEXHVEQ0FDW1x1N0Y1MVx1N0VEQ10gXHU2NkY0XHU2NUIwXHU0RTJELi4uJyk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdTY2RjRcdTY1QjBcdTRGRERcdTVCNThcdTY1ODdcdTRFRjZcclxuXHRcdFx0XHRcdFx0XHRcdGZzLndyaXRlRmlsZVN5bmMobGFuZ19maWxlX3BhdGgsIGRhdGEudGV4dCk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdTY2RjRcdTY1QjBcdTcyQjZcdTYwMDFcdTY1ODdcdTRFRjZcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpMThuc3RhdGUudXBkYXRlKHN0YXRlLmlzX2kxOG4sIHdlYl9sYW5nX2pzb25bJ21hbmlmZXN0J11bJ3ZlcnNpb24nXSwgc3RhdGUucGx1Z2luX3ZlcnNpb24pO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHU1MjM3XHU2NUIwXHU2NENEXHU0RjVDXHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnJlbG9hZCgpXHJcblx0XHRcdFx0XHRcdFx0XHRuZXcgTm90aWNlKCdcdUQ4M0RcdURDQUNbXHU3RjUxXHU3RURDXSBcdTY2RjRcdTY1QjBcdTVCOENcdTYyMTAnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Y2Iuc2V0RGlzYWJsZWQoZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdG5ldyBOb3RpY2UoJ1x1RDgzRFx1RENBQ1tcdTdGNTFcdTdFRENdIFx1N0ZGQlx1OEJEMVx1NjU4N1x1NEVGNiBcdThCRjdcdTZDNDJcdTU5MzFcdThEMjUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyBcclxuXHRcdFx0Ly8gICAgICAgICAgICAgICAgICAgICAgICBcdTdGRkJcdThCRDFcdTY0Q0RcdTRGNUNcclxuXHRcdFx0Ly8gXHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyBcdTY4QzBcdTZENEIgXHU4QkVEXHU4QTAwXHU3NkVFXHU1RjU1IFx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG5cdFx0XHRpZighZnMuZXhpc3RzU3luYyhsYW5nX3BhdGgpKXtcclxuXHRcdFx0XHR0aGlzLmNvbnNvbGUubG9nKCdbXHU2NzJDXHU1NzMwXVtcdTc2RUVcdTVGNTVdIFx1RDgzRFx1REQzNFx1NEUwRFx1NUI1OFx1NTcyOCcpO1xyXG5cdFx0XHRcdHRoaXMuY29uc29sZS5ncm91cEVuZCgpO1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aGlzLmNvbnNvbGUubG9nKCdbXHU2NzJDXHU1NzMwXVtcdTc2RUVcdTVGNTVdIFx1RDgzRFx1REZFMlx1NUI1OFx1NTcyOCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBcdTY4QzBcdTZENEIgXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2IFx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOCBcdTZDQTFcdTY3MDlcdTUyMTlcdTUyMUJcdTVFRkFcdTRFMDBcdTRFMkFcdTlFRDhcdThCQTRcdTc2ODRcclxuXHRcdFx0aWYoIWkxOG5zdGF0ZS5pc19zdGF0ZSgpKXtcclxuXHRcdFx0XHQvLyBcdTVGNTNcdTcyQjZcdTYwMDFcdTY1ODdcdTRFRjZcdTRFMERcdTVCNThcdTU3MjhcdTc2ODRcdTY1RjZcdTUwMTlcdTY1QjBcdTVFRkFcdTcyQjZcdTYwMDFcdTY1ODdcdTRFRjZcclxuXHRcdFx0XHRpMThuc3RhdGUuaW5zZXJ0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFx1N0ZGQlx1OEJEMVx1NjU4N1x1NEVGNlxyXG5cdFx0XHRpZihpc19sYW5nX2ZpbGUpe1xyXG5cdFx0XHRcdHRoaXMuY29uc29sZS5sb2coJ1tcdTY3MkNcdTU3MzBdW1x1OEJEMVx1NjU4N10gXHVEODNEXHVERkUyXHU1QjU4XHU1NzI4JylcclxuXHRcdFx0XHQvLyBbXHU1MjI0XHU2NUFEXSBcdTdGRkJcdThCRDFcdTcyQjZcdTYwMDEgXHU1RjUzXHU1REYyXHU3RkZCXHU4QkQxXHU2NUY2XHU4RkRCXHU4ODRDIFx1OEZEOFx1NTM5Rlx1NjMwOVx1OTRBRVx1NkUzMlx1NjdEM1xyXG5cdFx0XHRcdGlmKHN0YXRlLmlzX2kxOG4pe1xyXG5cdFx0XHRcdFx0Y29uc3QgY2IgPSBuZXcgQnV0dG9uQ29tcG9uZW50KGJsb2NrLmNvbnRyb2xFbCk7XHJcblx0XHRcdFx0XHRjYi5zZXRCdXR0b25UZXh0KCdcdThGRDhcdTUzOUYnKTtcclxuXHRcdFx0XHRcdGNiLnNldERpc2FibGVkKGZhbHNlKTtcclxuXHRcdFx0XHRcdGNiLm9uQ2xpY2soKCk9PntcclxuXHRcdFx0XHRcdFx0Ly8gXHU2MzA5XHU5NEFFXHU0RTBEXHU1M0VGXHU1NzI4XHU4RkRCXHU4ODRDXHU3MEI5XHU1MUZCXHJcblx0XHRcdFx0XHRcdGNiLnNldERpc2FibGVkKHRydWUpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdTUyMjBcdTk2NjRcdTdGRkJcdThCRDFcdThGQzdcdTc2ODRcdTY1ODdcdTRFRjZcclxuXHRcdFx0XHRcdFx0ZnMudW5saW5rU3luYyhwYXRoLmpvaW4ocGx1Z2luLnBhdGgsICdtYWluLmpzJykpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Ly8gXHU1QzA2XHU1OTA3XHU0RUZEXHU2NTg3XHU0RUY2XHU2NkY0XHU2NTM5XHU1NDBEXHU3OUYwXHJcblx0XHRcdFx0XHRcdGZzLnJlbmFtZVN5bmMocGF0aC5qb2luKHBsdWdpbi5wYXRoLCAnbWFpbi1jb3B5LmpzJyksIHBhdGguam9pbihwbHVnaW4ucGF0aCwgJ21haW4uanMnKSk7XHJcblx0XHRcdFx0XHRcdC8vIFx1NjZGNFx1NjVCMFx1N0ZGQlx1OEJEMVx1NzJCNlx1NjAwMVxyXG5cdFx0XHRcdFx0XHRpMThuc3RhdGUudXBkYXRlKGZhbHNlLCAnJywgcGx1Z2luLnZlcnNpb24pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdTUyMzdcdTY1QjBcdTUyMTdcdTg4NjhcclxuXHRcdFx0XHRcdFx0dGhpcy5yZWxvYWQoKTtcclxuXHRcdFx0XHRcdFx0bmV3IE5vdGljZSgnW1x1OEZEOFx1NTM5Rl0gXHU5MUNEXHU1NDJGIE9ic2lkaWFuIFx1NzUxRlx1NjU0OCcpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBbXHU1MjI0XHU2NUFEXSBcdTdGRkJcdThCRDFcdTcyQjZcdTYwMDEgXHU1RjUzXHU2NzJBXHU3RkZCXHU4QkQxXHU2NUY2XHU4RkRCXHU4ODRDIFx1N0ZGQlx1OEJEMVx1NjMwOVx1OTRBRVx1NkUzMlx1NjdEM1xyXG5cdFx0XHRcdGlmKCFzdGF0ZS5pc19pMThuKXtcclxuXHRcdFx0XHRcdGNvbnN0IGNiID0gbmV3IEJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG5cdFx0XHRcdFx0Y2Iuc2V0QnV0dG9uVGV4dCgnXHU3RkZCXHU4QkQxJyk7XHJcblx0XHRcdFx0XHRjYi5zZXREaXNhYmxlZChmYWxzZSk7XHJcblx0XHRcdFx0XHRjYi5vbkNsaWNrKCgpPT57XHJcblx0XHRcdFx0XHRcdC8vIHRoaXMuY29uc29sZS5ncm91cENvbGxhcHNlZCgnW1x1N0ZGQlx1OEJEMV0nKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHU2MzA5XHU5NEFFXHU0RTBEXHU1M0VGXHU1NzI4XHU4RkRCXHU4ODRDXHU3MEI5XHU1MUZCXHJcblx0XHRcdFx0XHRcdGNiLnNldERpc2FibGVkKHRydWUpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdTUyMUJcdTVFRkFcdTY1ODdcdTRFRjZcdTU5MDdcdTRFRkRcclxuXHRcdFx0XHRcdFx0ZnMuY29weUZpbGVTeW5jKHBhdGguam9pbihwbHVnaW4ucGF0aCwgJ21haW4uanMnKSwgcGF0aC5qb2luKHBsdWdpbi5wYXRoLCAnbWFpbi1jb3B5LmpzJykpO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHU4QkVEXHU4QTAwXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHJcblx0XHRcdFx0XHRcdGNvbnN0IGxhbmcgPSBmcy5yZWFkRmlsZVN5bmMobGFuZ19maWxlX3BhdGgpO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBqc29uX29iamVjdCA9IEpTT04ucGFyc2UobGFuZy50b1N0cmluZygpKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jb25zb2xlLmxvZygnXHU1QkY5XHU3MTY3XHU4ODY4Jyk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY29uc29sZS50YWJsZShqc29uX29iamVjdFsnZGljdCddKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx1OEJGQlx1NTNENlx1NUU3Nlx1OEY2Q1x1NjM2Mlx1NEUzQVx1NUI1N1x1N0IyNlx1NEUzMlxyXG5cdFx0XHRcdFx0XHRsZXQgcmVzID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihwbHVnaW4ucGF0aCwgJ21haW4uanMnKSkudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHU1QkY5XHU3RkZCXHU4QkQxXHU4ODY4XHU4RkRCXHU4ODRDXHU5MDEwXHU2NzYxXHU3RkZCXHU4QkQxXHJcblx0XHRcdFx0XHRcdGZvcihjb25zdCBrZXkgaW4ganNvbl9vYmplY3RbJ2RpY3QnXSl7XHJcblx0XHRcdFx0XHRcdFx0cmVzID0gcmVzLnJlcGxhY2VBbGwoa2V5LCBqc29uX29iamVjdFsnZGljdCddW2tleV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx1NTE5OVx1NTE2NVxyXG5cdFx0XHRcdFx0XHRmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihwbHVnaW4ucGF0aCwgJ21haW4uanMnKSwgcmVzLCAndXRmLTgnKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx1NjZGNFx1NjVCMFx1N0ZGQlx1OEJEMVx1NzJCNlx1NjAwMVxyXG5cdFx0XHRcdFx0XHRpMThuc3RhdGUudXBkYXRlKHRydWUsIGpzb25fb2JqZWN0WydtYW5pZmVzdCddLnZlcnNpb24sIHBsdWdpbi52ZXJzaW9uKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIFx1NTIzN1x1NjVCMFx1NTIxN1x1ODg2OFxyXG5cdFx0XHRcdFx0XHR0aGlzLnJlbG9hZCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0bmV3IE5vdGljZSgnW1x1N0ZGQlx1OEJEMV1cdTkxQ0RcdTU0MkYgT2JzaWRpYW4gXHU3NTFGXHU2NTQ4Jyk7XHJcblx0XHRcdFx0XHRcdC8vIHRoaXMuY29uc29sZS5ncm91cEVuZCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQvLyBcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTY3MDlcclxuXHRcdFx0XHR0aGlzLmNvbnNvbGUubG9nKCdbXHU2NzJDXHU1NzMwXVtcdThCRDFcdTY1ODddIFx1RDgzRFx1REQzNFx1NEUwRFx1NUI1OFx1NTcyOCcpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1OTcwMFx1ODk4MVx1NTIyMFx1OTY2NFx1NTE4NVx1NUJCOVxyXG5cdFx0XHQvLyBpZihsYW5nX3BhdGgpe1xyXG5cdFx0XHQvLyBcdGNvbnN0IGNiID0gbmV3IEJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG5cdFx0XHQvLyBcdFx0Y2Iuc2V0QnV0dG9uVGV4dCgnXHU1MjIwXHU5NjY0Jyk7XHJcblx0XHRcdC8vIFx0XHRjYi5zZXRXYXJuaW5nKCk7XHJcblx0XHRcdC8vIFx0XHRjYi5zZXREaXNhYmxlZChmYWxzZSk7XHJcblx0XHRcdC8vIFx0XHRjYi5vbkNsaWNrKCgpPT57XHJcblx0XHRcdC8vIFx0XHRcdC8vIFx1NjMwOVx1OTRBRVx1NEUwRFx1NTNFRlx1NTcyOFx1OEZEQlx1ODg0Q1x1NzBCOVx1NTFGQlxyXG5cdFx0XHQvLyBcdFx0XHRjYi5zZXREaXNhYmxlZCh0cnVlKTtcclxuXHRcdFx0Ly8gXHRcdFx0Ly8gXHU1MjIwXHU5NjY0XHU3NkVFXHU1RjU1XHJcblx0XHRcdC8vIFx0XHRcdHRoaXMucmVtb3ZlRGllcihsYW5nX3BhdGgpO1xyXG5cdFx0XHQvLyBcdFx0XHRuZXcgTm90aWNlKCdbXHU1MjIwXHU5NjY0XSBcdTdGRkJcdThCRDFcdTUxODVcdTVCQjlcdTVERjJcdTZFMDVcdTdBN0EnKTtcclxuXHRcdFx0Ly8gXHRcdFx0Ly8gXHU1MjM3XHU2NUIwXHU1MjE3XHU4ODY4XHJcblx0XHRcdC8vIFx0XHRcdHRoaXMucmVsb2FkKCk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHQvLyBcdFx0fSk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIFtcdTYzRDJcdTRFRjZdXHJcblx0XHRcdHRoaXMuY29uc29sZS5ncm91cEVuZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFx1NjVCMFx1NzI0OFx1NjNEMlx1NEVGNlxyXG5cdFx0Zm9yKGNvbnN0IHBsdWdpbiBvZiB0aGlzLnBsdWdpbnMxKXtcclxuXHRcdFx0Y29uc29sZS5sb2coYFske3BsdWdpbi5uYW1lfV1gKTtcclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gXHU1MjFEXHU1OUNCXHU1MzE2XHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdC8vIFx1NjNEMlx1NEVGNlx1OERFRlx1NUY4NFxyXG5cdFx0XHRjb25zdCBwbHVnaW5fcGF0aCA9IHBhdGguam9pbih0aGlzLmJhc2VfcGF0aCwgcGx1Z2luLmRpcik7XHJcblxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyBcdTYzRDJcdTRFRjZcdTRFQ0JcdTdFQ0RcclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Y29uc3QgYmxvY2sgPSBuZXcgU2V0dGluZyhjb250ZW50RWwpO1xyXG5cdFx0XHRibG9jay5zZXROYW1lKHBsdWdpbi5uYW1lKTtcclxuXHRcdFx0YmxvY2suZGVzY0VsLmNyZWF0ZURpdih7dGV4dDpcIlx1NzI0OFx1NjcyQzogXCIgKyBwbHVnaW4udmVyc2lvbn0pO1xyXG5cclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gXHU2MjUzXHU1RjAwXHU2M0QyXHU0RUY2XHU3NkVFXHU1RjU1XHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdGNvbnN0IGNiID0gbmV3IEV4dHJhQnV0dG9uQ29tcG9uZW50KGJsb2NrLmNvbnRyb2xFbCk7XHJcblx0XHRcdGNiLnNldEljb24oXCJmb2xkZXItb3BlblwiKTtcclxuXHRcdFx0Y2Iuc2V0RGlzYWJsZWQoZmFsc2UpO1xyXG5cdFx0XHRjYi5vbkNsaWNrKCgpPT57XHJcblx0XHRcdFx0Ly8gXHU2MjUzXHU1RjAwXHU2MzA3XHU1QjlBXHU3NkVFXHU1RjU1XHJcblx0XHRcdFx0Y29uc3QgY29tbWFuZCA9IGBwb3dlcnNoZWxsLmV4ZSAtQ29tbWFuZCBcImlpICR7cGx1Z2luX3BhdGh9XCJgO1xyXG5cdFx0XHRcdGV4ZWMoY29tbWFuZCwgKGVycm9yLCBmaWxlKSA9PiB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvciwgZmlsZS50b1N0cmluZygpKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdC8vIFx1NkUwNVx1N0E3QVx1N0ZGQlx1OEJEMVx1NjU4N1x1NEVGNlxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyBjb25zdCBxayA9IG5ldyBFeHRyYUJ1dHRvbkNvbXBvbmVudChibG9jay5jb250cm9sRWwpO1xyXG5cdFx0XHQvLyBxay5zZXRJY29uKFwidHJhc2hcIik7XHJcblx0XHRcdC8vIHFrLnNldERpc2FibGVkKGZhbHNlKTtcclxuXHRcdFx0Ly8gcWsub25DbGljaygoKT0+e1xyXG5cdFx0XHQvLyBcdC8vIDEuIFx1NTIyMFx1OTY2NFx1OEJFRFx1OEEwMFx1NjU4N1x1NEVGNlx1NTkzOVxyXG5cdFx0XHQvLyBcdGZzLnVubGlua1N5bmMocGF0aC5qb2luKHBsdWdpbl9wYXRoLCAnbGFuZycpKTtcclxuXHRcdFx0Ly8gfSk7XHJcblxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyBcdTdGRkJcdThCRDFcdTY1ODdcdTRFRjZcdTU5MzlcclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Y29uc3QgaXNfbGFuZ19kaXIgPSBmcy5leGlzdHNTeW5jKHBhdGguam9pbihwbHVnaW5fcGF0aCwgJ2xhbmcnKSkgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBcdTc2RUVcdTVGNTUgJHtpc19sYW5nX2Rpcn1gKTtcclxuXHRcdFx0Ly8gXHU4REYzXHU4RkM3XHU1RkFBXHU3M0FGXHJcblx0XHRcdGlmKCFpc19sYW5nX2RpcikgY29udGludWU7XHJcblxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyBcdTcyQjZcdTYwMDFcdTY1ODdcdTRFRjZcclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gMS4gXHU1MjI0XHU2NUFEXHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2XHJcblx0XHRcdGNvbnN0IGlzX3N0YXRlX2RpciA9IGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHBsdWdpbl9wYXRoLCAnbGFuZycsICdzdGF0ZS5qc29uJykpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2ICR7aXNfc3RhdGVfZGlyfWApXHJcblx0XHRcdC8vIDIuIFx1NTIxQlx1NUVGQVx1NzJCNlx1NjAwMVx1NjU4N1x1NEVGNlx1NUJGOVx1OEM2MVxyXG5cdFx0XHRjb25zdCBzdGF0ZU9iaiA9IG5ldyBTdGF0ZShwYXRoLmpvaW4ocGx1Z2luX3BhdGgsICdsYW5nJywgJ3N0YXRlLmpzb24nKSk7XHJcblx0XHRcdGNvbnN0IHN0YXRlID0gc3RhdGVPYmouc2VsZWN0KCk7XHJcblx0XHRcdC8vIDMuIFx1NUY1M1x1NzJCNlx1NjAwMVx1NjU4N1x1NEVGNlx1NEUwRFx1NUI1OFx1NTcyOFx1NjVGNlx1NTIxQlx1NUVGQVx1NzJCNlx1NjAwMVx1NjU4N1x1NEVGNlxyXG5cdFx0XHRpZighaXNfc3RhdGVfZGlyKSBzdGF0ZU9iai5pbnNlcnQoKTtcclxuXHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdC8vIFx1NjNEMlx1NEVGNlx1NjZGNFx1NjVCMFxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyAxLiBcdTVGNTNcdTYzRDJcdTRFRjZcdTVERjJcdTdGRkJcdThCRDFcdTVFNzZcdTRFMTQgXHU2M0QyXHU0RUY2XHU3MjQ4XHU2NzJDXHU2NkY0XHU2NUIwXHJcblx0XHRcdGlmKHN0YXRlLmlzX2kxOG4gJiYgcGx1Z2luLnZlcnNpb24gIT0gc3RhdGUucGx1Z2luX3ZlcnNpb24pe1xyXG5cdFx0XHRcdC8vIDIuIFx1NTIyMFx1OTY2NFx1N0ZGQlx1OEJEMVx1OEZDN1x1NzY4NFx1NjU4N1x1NEVGNlxyXG5cdFx0XHRcdGZzLnVubGlua1N5bmMocGF0aC5qb2luKHBsdWdpbl9wYXRoLCAnZHVwbGljYXRlLmpzJykpO1xyXG5cdFx0XHRcdC8vIDMuIFx1NjZGNFx1NjVCMFx1N0ZGQlx1OEJEMVx1NzJCNlx1NjAwMVxyXG5cdFx0XHRcdHN0YXRlT2JqLnJlc2V0KCk7XHJcblx0XHRcdFx0bmV3IE5vdGljZShgXHVEODNEXHVEQ0FDWyR7cGx1Z2luLm5hbWV9XSBcdTYzRDJcdTRFRjZcdTY2RjRcdTY1QjAgXHU3RkZCXHU4QkQxXHU4RkQ4XHU1MzlGYCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdC8vICAgICBcdTdGNTFcdTdFRENcdTYzQTVcdTUzRTNcdTdGRkJcdThCRDFcclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdC8vICAgICBcdTdGNTFcdTdFRENcdTY1ODdcdTRFRjZcdTdGRkJcdThCRDFcclxuXHRcdFx0Ly8gPT09PT09PT09PT09PT09PT09PT1cclxuXHRcdFx0Ly8gXHU1MjI0XHU2NUFEXHU2NTg3XHU0RUY2XHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHJcblx0XHRcdGNvbnN0IGEgPSAnemgtY24nXHJcblx0XHRcdGNvbnN0IGlzX2xhbmcgPSBmcy5leGlzdHNTeW5jKHBhdGguam9pbihwbHVnaW5fcGF0aCwgYGxhbmdcXFxcJHthfS5qc29uYCkpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHQvLyBcdTUyMjRcdTY1QURcdTdGNTFcdTdFRENcdTRFMkRcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcdTY1ODdcdTRFRjZcclxuXHRcdFx0bGV0IG1hcms7XHJcblx0XHRcdGlmKGkxOG5fYXBpX3NhZmVtb2RlICYmIHRoaXMubmR0X21hcmspIG1hcmsgPSBwbHVnaW4ubmFtZSBpbiB0aGlzLmRpcmVjdG9yeTtcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKGBcdTZENEJcdThCRDUgJHttYXJrfWApXHJcblxyXG5cdFx0XHQvLyAxLiBcdTY2RjRcdTY1QjBcdTY0Q0RcdTRGNUNcclxuXHRcdFx0Y29uc3QgTkRUX0J1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQoYmxvY2suY29udHJvbEVsKTtcclxuXHRcdFx0Ly8gMi4gXHU1RjUzXHU3RjUxXHU3RURDXHU2NTg3XHU0RUY2XHU2QTIxXHU1RjBGXHU1RjAwXHU1NDJGXHU2NUY2IFx1NUU3Nlx1NEUxNCBcdTdGNTFcdTdFRENcdTY4MDdcdThCQjBcdTRFM0FUcnVlIFxyXG5cdFx0XHRpZighaTE4bl9hcGlfc2FmZW1vZGUgJiYgdGhpcy5uZHRfbWFyayAmJiBtYXJrKSBORFRfQnV0dG9uLnNldENsYXNzKCdoaWRlci1yaWJib24nKTtcclxuXHRcdFx0TkRUX0J1dHRvbi5zZXRCdXR0b25UZXh0KCFpc19sYW5nPydcdTRFMEJcdThGN0QnOidcdTY2RjRcdTY1QjAnKTtcclxuXHRcdFx0TkRUX0J1dHRvbi5zZXRDdGEoKTtcclxuXHRcdFx0TkRUX0J1dHRvbi5zZXREaXNhYmxlZChmYWxzZSk7XHJcblx0XHRcdE5EVF9CdXR0b24ub25DbGljaygoKT0+e1xyXG5cdFx0XHRcdGlmKCFpc19sYW5nKXtcclxuXHRcdFx0XHRcdC8vIDMuIFx1NEUwQlx1OEY3RFx1NjRDRFx1NEY1Q1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ1x1NEUwQlx1OEY3RFx1NjRDRFx1NEY1QycpXHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvLyA0LiBcdTY2RjRcdTY1QjBcdTY0Q0RcdTRGNUNcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdcdTY2RjRcdTY1QjBcdTY0Q0RcdTRGNUMnKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0XHQvLyAgICAgXHU2NzJDXHU1NzMwXHU2NTg3XHU0RUY2XHU3RkZCXHU4QkQxXHJcblx0XHRcdC8vID09PT09PT09PT09PT09PT09PT09XHJcblx0XHRcdGNvbnN0IExEVF9CdXR0b24gPSBuZXcgQnV0dG9uQ29tcG9uZW50KGJsb2NrLmNvbnRyb2xFbCk7XHJcblx0XHRcdC8vIGlmKCFpMThuX2FwaV9zYWZlbW9kZSkgTkRUX0J1dHRvbi5zZXRDbGFzcygnaGlkZXItcmliYm9uJyk7XHJcblx0XHRcdExEVF9CdXR0b24uc2V0QnV0dG9uVGV4dCghc3RhdGUuaXNfaTE4bj8nXHU3RkZCXHU4QkQxJzonXHU4RkQ4XHU1MzlGJyk7XHJcblx0XHRcdExEVF9CdXR0b24uc2V0RGlzYWJsZWQoZmFsc2UpO1xyXG5cdFx0XHRMRFRfQnV0dG9uLm9uQ2xpY2soKCk9PntcclxuXHRcdFx0XHQvLyBcdTYzMDlcdTk0QUVcdTRFMERcdTUzRUZcdTU3MjhcdThGREJcdTg4NENcdTcwQjlcdTUxRkJcclxuXHRcdFx0XHRMRFRfQnV0dG9uLnNldERpc2FibGVkKHRydWUpO1xyXG5cdFx0XHRcdGlmKCFzdGF0ZS5pc19pMThuKXtcclxuXHRcdFx0XHRcdC8vIFx1N0ZGQlx1OEJEMVx1NTFGRFx1NjU3MFxyXG5cdFx0XHRcdFx0Y29uc3QgYSA9ICd6aC1jbidcclxuXHRcdFx0XHRcdGNvbnN0IHRyYW5zbGF0aW9uX3BhdGggPSBwYXRoLmpvaW4odGhpcy5iYXNlX3BhdGgsIHBsdWdpbi5kaXIsICdsYW5nJywgYCR7YX0uanNvbmApO1xyXG5cdFx0XHRcdFx0Y29uc3QgdHJhbnNsYXRpb25fb2JqZWN0ID0gdGhpcy5MRFRPYmoudHJhbnNsYXRpb24ocGx1Z2luX3BhdGgsIHRyYW5zbGF0aW9uX3BhdGgpO1xyXG5cdFx0XHRcdFx0Ly8gXHU1MjM3XHU2NUIwXHU3MkI2XHU2MDAxXHU2NTg3XHU0RUY2XHJcblx0XHRcdFx0XHRzdGF0ZU9iai51cGRhdGUodHJ1ZSwgdHJhbnNsYXRpb25fb2JqZWN0WydtYW5pZmVzdCddLnZlcnNpb24sIHBsdWdpbi52ZXJzaW9uKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bmV3IE5vdGljZSgnW1x1N0ZGQlx1OEJEMV0gXHU5MUNEXHU1NDJGIE9ic2lkaWFuIFx1NzUxRlx1NjU0OCcpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0Ly8gXHU4RkQ4XHU1MzlGXHU1MUZEXHU2NTcwXHJcblx0XHRcdFx0XHR0aGlzLkxEVE9iai5yZXN0b3JlKHBsdWdpbl9wYXRoKTtcclxuXHRcdFx0XHRcdC8vIFx1NTIzN1x1NjVCMFx1NzJCNlx1NjAwMVx1NjU4N1x1NEVGNlxyXG5cdFx0XHRcdFx0c3RhdGVPYmoucmVzZXQoKVxyXG5cdFx0XHRcdFx0bmV3IE5vdGljZSgnW1x1OEZEOFx1NTM5Rl0gXHU5MUNEXHU1NDJGIE9ic2lkaWFuIFx1NzUxRlx1NjU0OCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBcdTUyMzdcdTY1QjBcdTUyMTdcdTg4NjhcclxuXHRcdFx0XHR0aGlzLnJlbG9hZCgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdC8vIFtcdTZFMzJcdTY3RDNdXHJcblx0XHR0aGlzLmNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuXHR9XHJcblx0XHJcblx0Ly8gXHU1MTg1XHU5MEU4IFx1OTFDRFx1OEY3RFx1NTFGRFx1NjU3MFxyXG5cdHByaXZhdGUgcmVsb2FkKCl7XHJcblx0XHR0aGlzLnBsdWdpbnMgPSBbXTtcclxuXHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdHRoaXMub3BlbigpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByZW1vdmVEaWVyKHBhdGg6IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGZzLnJlYWRkaXJTeW5jKHBhdGgpO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIC8vIFx1NjYyRlx1NjU4N1x1NEVGNlx1NjIxNlx1ODAwNVx1NjYyRlx1NzZFRVx1NUY1NSAgXHU2NjJGXHU2NTg3XHU0RUY2XHU3NkY0XHU2M0E1XHU1MjIwXHU5NjY0ICBcdTc2RUVcdTVGNTVcdTc2RjRcdTYzQTVcdTUyMjBcdTk2NjRcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHBhdGggKyBcIi9cIiArIGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmModXJsKTtcclxuICAgICAgICAgICAgICAgIGlmKHN0YXQuaXNEaXJlY3RvcnkoKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU3RUU3XHU3RUVEXHU2N0U1XHU2MjdFXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVEaWVyKHVybCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTY1ODdcdTRFRjZcdTUyMjBcdTk2NjRcclxuICAgICAgICAgICAgICAgICAgICBmcy51bmxpbmtTeW5jKHVybCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZzLnJtZGlyU3luYyhwYXRoKTsgICAgICBcclxuXHR9XHJcblxyXG5cdC8vIFtcdTVGMDBcdTU0MkZdXHJcblx0YXN5bmMgb25PcGVuKCkge1xyXG5cdFx0Y29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XHJcblxyXG5cdFx0Y29udGVudEVsLnNldFRleHQoJ1x1NjNEMlx1NEVGNlx1NTIxN1x1ODg2OCcpO1xyXG5cclxuXHRcdC8vIFtcdTUyMURcdTU5Q0JcdTUzMTZdIFx1NjNEMlx1NEVGNlx1NTIxN1x1ODg2OFxyXG5cdFx0YXdhaXQgdGhpcy5pbml0X3BsdWdpbnMoKTtcclxuXHRcdGF3YWl0IHRoaXMuaW5pdF9zaG93KCk7XHJcblx0fVxyXG5cdC8vIFtcdTUxNzNcdTk1RURdXHJcblx0YXN5bmMgb25DbG9zZSgpIHtcclxuXHRcdGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xyXG5cdFx0Y29udGVudEVsLmVtcHR5KCk7XHJcblx0fVxyXG59XHJcbiBcclxuXHJcblxyXG4iLCAiZXhwb3J0IGludGVyZmFjZSBJMThuUGx1Z2luU2V0dGluZ3Mge1xyXG5cdHNldHRpbmdzOiB7XHJcblx0XHQvLyBcdTYzRDJcdTRFRjZcdThERUZcdTVGODRcclxuXHRcdHBsdWdpbnNfcGF0aDogc3RyaW5nLFxyXG5cdFx0Ly8gXHU0RjdGXHU3NTI4XHU4QkVEXHU4QTAwXHJcblx0XHRsYW5ndWFnZTogc3RyaW5nLFxyXG5cdFx0Ly8gXHU2NUU1XHU1RkQ3XHJcblx0XHRsb2c6Ym9vbGVhbjtcclxuXHRcdC8vIFx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNiBcdTZBMjFcdTVGMEZcclxuXHRcdGkxOG5fbmR0X21vZGU6Ym9vbGVhbixcclxuXHRcdC8vIFx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNiBcdTRFMEJcdThGN0RcdTU3MzBcdTU3NDBcclxuXHRcdGkxOG5fbmR0X3VybDpzdHJpbmcsXHJcblx0XHQvLyBcdTdGNTFcdTdFRENBUEkgXHU2QTIxXHU1RjBGXHJcblx0XHRpMThuX25pdF9tb2RlOmJvb2xlYW4sXHJcblx0fSxcclxuXHRsYW5ndWFnZXM6UmVjb3JkPHN0cmluZywgc3RyaW5nPlxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogSTE4blBsdWdpblNldHRpbmdzID0ge1xyXG5cdHNldHRpbmdzOiB7XHJcblx0XHRwbHVnaW5zX3BhdGg6ICcub2JzaWRpYW5cXFxccGx1Z2lucycsXHJcblx0XHRsYW5ndWFnZTogJycsXHJcblx0XHRsb2c6ZmFsc2UsXHJcblx0XHRpMThuX25kdF9tb2RlOiBmYWxzZSxcclxuXHRcdGkxOG5fbmR0X3VybDogJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS96ZXJvLXdvcmxkcy9vYnNpZGlhbi1pMThuL21haW4vaTE4bicsXHJcblx0XHRpMThuX25pdF9tb2RlOiBmYWxzZVxyXG5cdH0sXHJcblx0bGFuZ3VhZ2VzOnt9XHJcbn1cclxuIiwgImltcG9ydCB7IEFwcCwgTm90aWNlLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuaW1wb3J0IEkxOE4gZnJvbSBcIi4uLy4uL21haW5cIjtcclxuaW1wb3J0IEFQSSBmcm9tICcuLi8uLi9hcGknO1xyXG5cclxuLy8gXHU4QkJFXHU3RjZFXHU3NTRDXHU5NzYyXHJcbmNsYXNzIEkxOG5TZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XHJcblx0Ly8gXHU4QkJFXHU3RjZFXHU1QkY5XHU1RTk0XHU3Njg0XHU1MUZEXHU2NTcwXHJcblx0aTE4bjogSTE4TjtcclxuXHJcblx0YXBpOiBBUEk7XHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIGkxOG46IEkxOE4pIHtcclxuXHRcdHN1cGVyKGFwcCwgaTE4bik7XHJcblx0XHR0aGlzLmkxOG4gPSBpMThuO1xyXG5cdFx0dGhpcy5hcGkgPSBuZXcgQVBJKGkxOG4pO1xyXG5cdH1cclxuXHJcblx0ZGlzcGxheSgpOiB2b2lkIHtcclxuXHRcdGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XHJcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gICAgICAgICBcdTU3RkFcdTc4NDBcdThCQkVcdTdGNkVcdTY4MDdcdTk4OThcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnW2kxOG5dIFx1NTdGQVx1Nzg0MFx1OEJCRVx1N0Y2RScgfSk7XHJcblxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyAgICAgICAgIFx1NjNEMlx1NEVGNlx1OERFRlx1NUY4NFxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1x1OERFRlx1NUY4NCcpXHJcblx0XHRcdC5zZXREZXNjKCdbXHU1RkM1XHU1ODZCXSBcdTkwMDlcdTYyRTlcdTYzRDJcdTRFRjZcdTY1ODdcdTRFRjZcdTU5MzlcdThERUZcdTVGODQnKVxyXG5cdFx0XHQuYWRkVGV4dChjYiA9PiBjYlxyXG5cdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignXHU2M0QyXHU0RUY2XHU4REVGXHU1Rjg0JylcclxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5pMThuLnNldHRpbmdzLnBsdWdpbnNfcGF0aClcclxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmkxOG4uc2V0dGluZ3MucGx1Z2luc19wYXRoID0gdmFsdWU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgW1x1OTE0RFx1N0Y2RV0gcGx1Z2luc19wYXRoOiAke3RoaXMuaTE4bi5zZXR0aW5ncy5wbHVnaW5zX3BhdGh9YClcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpO1xyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyAgICAgICAgIFx1N0ZGQlx1OEJEMVx1OEJFRFx1OEEwMFxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1x1OEJFRFx1OEEwMCcpXHJcblx0XHRcdC5zZXREZXNjKCdcdTkwMDlcdTYyRTlcdTk3MDBcdTg5ODFcdTdGRkJcdThCRDFcdTc2ODRcdThCRURcdThBMDAnKVxyXG5cdFx0XHQuYWRkRHJvcGRvd24oY2IgPT4gY2JcclxuXHRcdFx0XHQuYWRkT3B0aW9ucyh0aGlzLmkxOG4ubGFuZ3VhZ2VzKVxyXG5cdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLmkxOG4uc2V0dGluZ3MubGFuZ3VhZ2UpXHJcblx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSk9PntcclxuXHRcdFx0XHRcdHRoaXMuaTE4bi5zZXR0aW5ncy5sYW5ndWFnZSA9IHZhbHVlXHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgW1x1OTE0RFx1N0Y2RV0gbGFuZ3VhZ2U6ICR7dGhpcy5pMThuLnNldHRpbmdzLmxhbmd1YWdlfWApXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0KTtcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gICAgICAgICBcdTdGRkJcdThCRDFcdThCRURcdThBMDBcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Y29uc3QgbG9nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpO1xyXG5cdFx0bG9nLnNldE5hbWUoJ1x1NjVFNVx1NUZENycpO1xyXG5cdFx0bG9nLnNldERlc2MoJ1x1NjYyRlx1NTQyNlx1NUYwMFx1NTQyRlx1NjVFNVx1NUZEN1x1OEMwM1x1OEJENScpO1xyXG5cdFx0bG9nLmFkZFRvZ2dsZShjYiA9PiBjYlxyXG5cdFx0XHQuc2V0VmFsdWUodGhpcy5pMThuLnNldHRpbmdzLmxvZylcclxuXHRcdFx0Lm9uQ2hhbmdlKCgpPT57XHJcblx0XHRcdFx0dGhpcy5pMThuLnNldHRpbmdzLmxvZyA9ICF0aGlzLmkxOG4uc2V0dGluZ3MubG9nO1xyXG5cdFx0XHRcdHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgW1x1OTE0RFx1N0Y2RV0gbG9nOiAke3RoaXMuaTE4bi5zZXR0aW5ncy5sb2d9YClcclxuXHRcdFx0fSlcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gICAgICAgICBcdTdGNTFcdTdFRENcdTY1ODdcdTRFRjZcdTY4MDdcdTk4OThcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnW2kxOG5dIFx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNicgfSk7XHJcblxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyAgICAgICAgIFx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNlx1NUI4OVx1NTE2OFx1NkEyMVx1NUYwRlxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRjb25zdCBmaWxlX3NhZmVtb2RlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpO1xyXG5cdFx0ZmlsZV9zYWZlbW9kZS5zZXROYW1lKCdcdTVCODlcdTUxNjhcdTZBMjFcdTVGMEYnKTtcclxuXHRcdGZpbGVfc2FmZW1vZGUuc2V0RGVzYygnXHU1MTczXHU5NUVEXHU1Qjg5XHU1MTY4XHU2QTIxXHU1RjBGIFx1NUMwNlx1NEYxQVx1NEVDRVx1N0Y1MVx1N0VEQ1x1NEUwQlx1OEY3RFx1N0ZGQlx1OEJEMVx1NjU4N1x1NjcyQycpO1xyXG5cdFx0ZmlsZV9zYWZlbW9kZS5hZGRUb2dnbGUoY2IgPT4gY2JcclxuXHRcdFx0LnNldFZhbHVlKHRoaXMuaTE4bi5zZXR0aW5ncy5pMThuX3dlYl9zYWZlbW9kZSlcclxuXHRcdFx0Lm9uQ2hhbmdlKCgpPT57XHJcblx0XHRcdFx0dGhpcy5pMThuLnNldHRpbmdzLmkxOG5fd2ViX3NhZmVtb2RlID0gIXRoaXMuaTE4bi5zZXR0aW5ncy5pMThuX3dlYl9zYWZlbW9kZTtcclxuXHRcdFx0XHR0aGlzLmkxOG4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYFtcdTkxNERcdTdGNkVdIGkxOG5fd2ViX3NhZmVtb2RlOiAke3RoaXMuaTE4bi5zZXR0aW5ncy5pMThuX3dlYl9zYWZlbW9kZX1gKVxyXG5cdFx0XHR9KVxyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyAgICAgICAgIFx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNlx1OERFRlx1NUY4NFxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHRjb25zdCBmaWxlX3VybCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKTtcclxuXHRcdGZpbGVfdXJsLnNldE5hbWUoJ1x1N0Y1MVx1N0VEQ1x1OERFRlx1NUY4NCcpO1xyXG5cdFx0ZmlsZV91cmwuc2V0RGVzYygnXHU0RTBCXHU4RjdEXHU3RkZCXHU4QkQxXHU2NTg3XHU2NzJDXHU3Njg0XHU3RjUxXHU3RURDXHU4REVGXHU1Rjg0IFx1OUVEOFx1OEJBNFx1NEUzQUdpdEh1YicpO1xyXG5cdFx0ZmlsZV91cmwuYWRkVGV4dChjYiA9PiBjYlxyXG5cdFx0XHQuc2V0UGxhY2Vob2xkZXIoJ1VSTCcpXHJcblx0XHRcdC5zZXRWYWx1ZSh0aGlzLmkxOG4uc2V0dGluZ3MuaTE4bl93ZWJfdXJsKVxyXG5cdFx0XHQub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5pMThuLnNldHRpbmdzLmkxOG5fd2ViX3VybCA9IHZhbHVlO1xyXG5cdFx0XHRcdHRoaXMuaTE4bi5zYXZlU2V0dGluZ3MoKTtcdFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBbXHU5MTREXHU3RjZFXSBpMThuX3dlYl91cmw6ICR7dGhpcy5pMThuLnNldHRpbmdzLmkxOG5fd2ViX3VybH1gKVxyXG5cdFx0XHR9KVxyXG5cdFx0KTtcclxuXHJcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdC8vICAgICAgICAgXHU3RjUxXHU3RURDXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHU2RDRCXHU4QkQ1XHJcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRcdGNvbnN0IGZpbGVfdXJsX3Rlc3QgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbCk7XHJcblx0XHRmaWxlX3VybF90ZXN0LnNldE5hbWUoJ1x1NkQ0Qlx1OEJENScpO1xyXG5cdFx0ZmlsZV91cmxfdGVzdC5zZXREZXNjKCdcdTRFMEJcdThGN0RcdTdGRkJcdThCRDFcdTY1ODdcdTY3MkNcdTc2ODRcdTdGNTFcdTdFRENcdThERUZcdTVGODQgXHU2RDRCXHU4QkQ1XHU2NUY2XHU1MDE5XHU4RkRFXHU2M0E1XHU2QjYzXHU1RTM4Jyk7XHJcblx0XHRmaWxlX3VybF90ZXN0LmFkZEJ1dHRvbihjYiA9PiBjYlxyXG5cdFx0XHQuc2V0QnV0dG9uVGV4dCgnXHU2RDRCXHU4QkQ1JylcclxuXHRcdFx0Lm9uQ2xpY2soYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0ZmlsZV91cmxfdGVzdC5zZXREaXNhYmxlZCh0cnVlKTtcclxuXHRcdFx0XHRjb25zdCBjb2RlID0gYXdhaXQgdGhpcy5hcGkuZ2V0RGlyZWN0b3J5KCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coY29kZS5jb2RlKTtcclxuXHRcdFx0XHRuZXcgTm90aWNlKGBbXHU3RjUxXHU3RURDXSAke2NvZGUuY29kZSA/ICdcdThGREVcdTYzQTVcdTYyMTBcdTUyOUYnIDogYFx1OEZERVx1NjNBNVx1NTkzMVx1OEQyNSgke2NvZGUudGV4dH0pYH1gKTtcclxuXHRcdFx0XHQvLyBpZihjb2RlKXtcclxuXHRcdFx0XHQvLyBcdG5ldyBOb3RpY2UoJ1tcdTdGNTFcdTdFRENdIFx1OEZERVx1NjNBNVx1NjIxMFx1NTI5RicpO1xyXG5cdFx0XHRcdC8vIH1lbHNle1xyXG5cdFx0XHRcdC8vIFx0bmV3IE5vdGljZSgnW1x1N0Y1MVx1N0VEQ10gXHU4RkRFXHU2M0E1XHU1OTMxXHU4RDI1KFx1OEJGN1x1NjhDMFx1NjdFNVx1N0Y1MVx1N0VEQyknKTtcclxuXHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0ZmlsZV91cmxfdGVzdC5zZXREaXNhYmxlZChmYWxzZSk7XHJcblx0XHRcdH0pXHJcblx0XHQpO1xyXG5cclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gICAgICAgICBcdTdGNTFcdTdFRENBUElcdTY4MDdcdTk4OThcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnW2kxOG5dIFx1N0ZGQlx1OEJEMVx1NjNBNVx1NTNFMyAoXHU2NzJBXHU1QjhDXHU2MjEwKScgfSk7XHJcblxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyAgICAgICAgIFx1N0Y1MVx1N0VEQ0FQSVx1NUI4OVx1NTE2OFx1NkEyMVx1NUYwRlxyXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0XHQvLyBjb25zdCBhcGlfc2FmZW1vZGUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdC8vIGFwaV9zYWZlbW9kZS5zZXROYW1lKCdcdTVCODlcdTUxNjhcdTZBMjFcdTVGMEYnKTtcclxuXHRcdC8vIGFwaV9zYWZlbW9kZS5zZXREZXNjKCdcdTUxNzNcdTk1RURcdTVCODlcdTUxNjhcdTZBMjFcdTVGMEYgXHU1QzA2XHU0RjFBXHU0RUNFXHU3RjUxXHU3RURDQVBJXHU3RkZCXHU4QkQxXHU2NTg3XHU2NzJDJyk7XHJcblx0XHQvLyBhcGlfc2FmZW1vZGUuYWRkVG9nZ2xlKGNiID0+IGNiXHJcblx0XHQvLyBcdC5zZXRWYWx1ZSh0aGlzLmkxOG4uc2V0dGluZ3MuaTE4bl9hcGlfc2FmZW1vZGUpXHJcblx0XHQvLyBcdC5vbkNoYW5nZSgoKT0+e1xyXG5cdFx0Ly8gXHRcdHRoaXMuaTE4bi5zZXR0aW5ncy5pMThuX2FwaV9zYWZlbW9kZSA9ICF0aGlzLmkxOG4uc2V0dGluZ3MuaTE4bl9hcGlfc2FmZW1vZGU7XHJcblx0XHQvLyBcdFx0dGhpcy5pMThuLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0Ly8gXHRcdGNvbnNvbGUubG9nKGBbXHU5MTREXHU3RjZFXSBpMThuX3dlYl9zYWZlbW9kZTogJHt0aGlzLmkxOG4uc2V0dGluZ3MuaTE4bl9hcGlfc2FmZW1vZGV9YClcclxuXHRcdC8vIFx0fSlcclxuXHRcdC8vICk7XHJcblx0XHRcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gICAgICAgICBcdTc2N0VcdTVFQTZcdTdGRkJcdThCRDFBUElcclxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdFx0Ly8gY29uc3QgYmFpZHUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbCk7XHJcblx0XHQvLyBiYWlkdS5zZXROYW1lKCdcdTc2N0VcdTVFQTZBUEknKTtcclxuXHRcdC8vIGJhaWR1LnNldERlc2MoJycpO1xyXG5cdFx0Ly8gYmFpZHUuYWRkVGV4dCh0ZXh0ID0+IHRleHRcclxuXHRcdC8vIFx0LnNldFBsYWNlaG9sZGVyKCdBUEknKVxyXG5cdFx0Ly8gKTtcclxuXHRcdFxyXG5cdH1cclxufVxyXG5leHBvcnQgeyBJMThuU2V0dGluZ1RhYiB9O1xyXG5cclxuLy8gXHU2MzA5XHU5NEFFIC5hZGRCdXR0b25cclxuXHRcdC8vIFx1OTg5Q1x1ODI3Mlx1NjJGRVx1NTNENlx1NTY2OCAuYWRkQ29sb3JQaWNrZXJcdFxyXG5cdFx0Ly8gXHU0RTBCXHU2MkM5XHU4M0RDXHU1MzU1IC5hZGREcm9wZG93blxyXG5cdFx0Ly8gXHU5ODlEXHU1OTE2XHU2MzA5XHU5NEFFIC5hZGRFeHRyYUJ1dHRvblxyXG5cdFx0Ly8gXHU2NUY2XHU1MjNCXHU2ODNDXHU1RjBGIC5hZGRNb21lbnRGb3JtYXRcclxuXHRcdC8vIFx1OEZEQlx1NUVBNlx1Njc2MSAuYWRkUHJvZ3Jlc3NCYXJcclxuXHRcdC8vIFx1NjQxQ1x1N0QyMiAuYWRkU2VhcmNoXHJcblx0XHQvLyBcdTZFRDFcdTU3NTcgLmFkZFNsaWRlclxyXG5cdFx0Ly8gXHU2NTg3XHU2NzJDIC5hZGRUZXh0XHJcblx0XHQvLyBcdTY1ODdcdTY3MkNcdTUzM0FcdTU3REYgLmFkZFRleHRBcmVhXHJcblx0XHQvLyBcdTUyMDdcdTYzNjIgLmFkZFRvZ2dsZSIsICJpbXBvcnQgeyBSZXF1ZXN0VXJsUGFyYW0sIHJlcXVlc3RVcmwgfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuaW1wb3J0IEkxOE4gZnJvbSBcIi4vbWFpblwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBpIHtcclxuXHRpMThuOiBJMThOO1xyXG5cdC8vIFtcdTUyMURcdTU5Q0JcdTUzMTZdIFx1NTNEOFx1OTFDRlxyXG5cdGNvbnN0cnVjdG9yKGkxOG46STE4Tikge1xyXG5cdFx0Ly8gW1x1NTIxRFx1NTlDQlx1NTMxNl0gSTE4blx1NjNEMlx1NEVGNlxyXG5cdFx0dGhpcy5pMThuID0gaTE4bjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0UmVxdWVzdCh1cmw6IHN0cmluZyl7XHJcblx0XHRjb25zdCByZXE6IFJlcXVlc3RVcmxQYXJhbSA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdGhlYWRlcnM6IHtcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cclxuXHRcdH07XHJcblx0XHRyZXR1cm4gcmVxXHJcblx0fVxyXG5cclxuXHQvLyBcdTgzQjdcdTUzRDYgXHU3RjUxXHU3RURDXHU2NTg3XHU0RUY2IFx1NzZFRVx1NUY1NVxyXG4gICAgYXN5bmMgZ2V0RGlyZWN0b3J5KCl7XHJcblx0XHR0cnl7XHJcblx0XHRcdGNvbnN0IHJlcXVlc3QgPSB0aGlzLmdldFJlcXVlc3QocGF0aC5qb2luKHRoaXMuaTE4bi5zZXR0aW5ncy5pMThuX3dlYl91cmwsICdkaXJlY3RvcnkuanNvbicpKTtcclxuXHRcdFx0Ly8gXHU4RkQ5XHU2ODM3XHU1QzMxXHU1M0VGXHU0RUU1XHU3NkY0XHU2M0E1XHU4M0I3XHU1M0Q2XHU0RTg2XHJcblx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCByZXF1ZXN0VXJsKHJlcXVlc3QpO1xyXG5cdFx0XHQvLyBbc3RhdHVzXSBbaGVhZGVyc10gW2FycmF5QnVmZmVyXSBbanNvbl0gW3RleHRdXHJcblx0XHRcdHJldHVybiB7Y29kZTogdHJ1ZSwgdGV4dDogZGF0YS50ZXh0fTtcclxuXHRcdH1jYXRjaChlKXtcclxuXHRcdFx0Y29uc3QgZXJyb3IgPSB0aGlzLmVycm9yKGUpXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG5cdFx0XHRyZXR1cm4ge2NvZGU6IGZhbHNlLCB0ZXh0OiBlcnJvcn07XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8vIFx1ODNCN1x1NTNENiBcdTdGNTFcdTdFRENcdTY1ODdcdTRFRjZcclxuXHRhc3luYyBnZXRXZWIocGx1Z2luOiBzdHJpbmcgLGxhbmc6IHN0cmluZyl7XHJcblx0XHR0cnl7XHJcblx0XHRcdGNvbnN0IHJlcXVlc3QgPSB0aGlzLmdldFJlcXVlc3QocGF0aC5qb2luKHRoaXMuaTE4bi5zZXR0aW5ncy5pMThuX3dlYl91cmwsIGBwbHVnaW5zLyR7cGx1Z2lufS8ke2xhbmd9Lmpzb25gKSk7XHJcblx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCByZXF1ZXN0VXJsKHJlcXVlc3QpO1xyXG5cdFx0XHRyZXR1cm4ge2NvZGU6IHRydWUsIHRleHQ6IGRhdGEudGV4dH07XHJcblx0XHR9Y2F0Y2goZSl7XHJcblx0XHRcdGNvbnN0IGVycm9yID0gdGhpcy5lcnJvcihlKVxyXG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcclxuXHRcdFx0cmV0dXJuIHtjb2RlOiBmYWxzZSwgdGV4dDogZXJyb3J9O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBlcnJvcihlcnJvcjogc3RyaW5nKSA6IHN0cmluZ3tcclxuXHRcdGlmKGVycm9yID09ICdFcnJvcjogbmV0OjpFUlJfQ09OTkVDVElPTl9SRUZVU0VEJyl7XHJcblx0XHRcdHJldHVybiAnXHU4QkY3XHU2QzQyXHU1REYyXHU4OEFCXHU2MkQyXHU3RUREJ1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVycm9yID09ICdFcnJvcjogbmV0OjpFUlJfQUREUkVTU19JTlZBTElEJykge1xyXG5cdFx0XHRyZXR1cm4gJ1x1OEJGN1x1NkM0Mlx1NTczMFx1NTc0MFx1NjVFMFx1NjU0OCdcclxuXHRcdH1cclxuXHRcdGlmIChlcnJvciA9PSAnRXJyb3I6IFJlcXVlc3QgZmFpbGVkLCBzdGF0dXMgNDAwJykge1xyXG5cdFx0XHRyZXR1cm4gJ1x1OEJGN1x1NkM0Mlx1NTkzMVx1OEQyNSBcdTcyQjZcdTYwMDE0MDAnXHJcblx0XHR9XHJcblx0XHRpZihlcnJvciA9PSAnRXJyb3I6IFJlcXVlc3QgZmFpbGVkLCBzdGF0dXMgNDA0Jyl7XHJcblx0XHRcdHJldHVybiAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1IFx1NzJCNlx1NjAwMTQwNCdcclxuXHRcdH1cclxuXHRcdGlmKGVycm9yID09ICdFcnJvcjogUmVxdWVzdCBmYWlsZWQsIHN0YXR1cyA0MTQnKXtcclxuXHRcdFx0cmV0dXJuICdcdThCRjdcdTZDNDJcdTU5MzFcdThEMjUgXHU3MkI2XHU2MDAxNDE0J1xyXG5cdFx0fVxyXG5cdFx0aWYoZXJyb3IgPT0gJ0Vycm9yOiBSZXF1ZXN0IGZhaWxlZCwgc3RhdHVzIDUwMicpe1xyXG5cdFx0XHRyZXR1cm4gJ1x1OEJGN1x1NkM0Mlx1NTkzMVx1OEQyNSBcdTcyQjZcdTYwMDE1MDInXHJcblx0XHR9XHJcblx0XHRpZihlcnJvciA9PSAnRXJyb3I6IG5ldDo6RVJSX0hUVFAyX1BST1RPQ09MX0VSUk9SJyl7XHJcblx0XHRcdHJldHVybiAnSFRUUDIgXHU1MzRGXHU4QkFFXHU5NTE5XHU4QkVGJ1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGAke2Vycm9yfWBcclxuXHR9XHJcbn0iLCAiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVdGlscyB7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJMThOU3RhdGV7XHJcblx0cGF0aDpzdHJpbmc7XHJcblx0Y29uc3RydWN0b3IobGFuZ19wYXRoOnN0cmluZyl7XHJcblx0XHR0aGlzLnBhdGggPSBwYXRoLmpvaW4obGFuZ19wYXRoLCAnL2xhbmcvc3RhdGUuanNvbicpO1xyXG5cdH1cclxuXHQvLyBmbGFnXHU5MTREXHU3RjZFIFwiYVwiOlx1OEZGRFx1NTJBMFx1NTE5OVx1NTE2NVx1RkYwQ1wid1wiOlx1NTE5OVx1NTE2NVx1RkYwQ1wiclwiOlx1OEJGQlx1NTNENlxyXG5cdC8vIFx1NTIyNFx1NjVBRFx1NjU4N1x1NEVGNlx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG5cdGlzX3N0YXRlKCl7XHJcblx0XHRyZXR1cm4gZnMuZXhpc3RzU3luYyh0aGlzLnBhdGgpO1xyXG5cdH1cclxuXHJcblx0Ly8gW1x1NjVCMFx1NTg5RV1cclxuXHRpbnNlcnQoKXtcclxuXHRcdGNvbnN0IHN0YXRlID0ge1xyXG5cdFx0XHQnaXNfaTE4bic6ZmFsc2UsXHJcblx0XHRcdCdpMThuX3ZlcnNpb24nOicnLFxyXG5cdFx0XHQncGx1Z2luX3ZlcnNpb24nOicnXHJcblx0XHR9XHJcblx0XHQvLyBcdThGNkNcdTY1ODdcdTY3MkNcclxuXHRcdGNvbnN0IGRhdGEgPSBKU09OLnN0cmluZ2lmeShzdGF0ZSk7XHJcblx0XHRmcy53cml0ZUZpbGVTeW5jKHRoaXMucGF0aCwgZGF0YSwge2VuY29kaW5nOid1dGYtOCcsIGZsYWc6J3cnfSk7XHJcblx0XHRyZXR1cm4gdGhpcy5pc19zdGF0ZSgpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0Ly8gW1x1NTIyMFx1OTY2NF1cclxuXHRkZWxldGUoKXtcclxuXHRcdGlmKCF0aGlzLmlzX3N0YXRlKCkpe1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRmcy51bmxpbmtTeW5jKHRoaXMucGF0aCk7XHJcblx0XHQvLyBbXHU2NUU1XHU1RkQ3XVxyXG5cdFx0cmV0dXJuIHRoaXMuaXNfc3RhdGUoKSA/IGZhbHNlIDogdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8vIFtcdTRGRUVcdTY1MzldXHJcblx0dXBkYXRlKGlzX2kxOG46IGJvb2xlYW4sIGkxOG5fdmVyc2lvbjogc3RyaW5nLCBwbHVnaW5fdmVyc2lvbjogc3RyaW5nKXtcclxuXHRcdGlmKCF0aGlzLmlzX3N0YXRlKCkpe1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCBzdGF0ZSA9IHtcclxuXHRcdFx0J2lzX2kxOG4nOiBpc19pMThuLFxyXG5cdFx0XHQnaTE4bl92ZXJzaW9uJzppMThuX3ZlcnNpb24sXHJcblx0XHRcdCdwbHVnaW5fdmVyc2lvbic6cGx1Z2luX3ZlcnNpb25cclxuXHRcdH1cclxuXHRcdGNvbnN0IGRhdGEgPSBKU09OLnN0cmluZ2lmeShzdGF0ZSk7XHJcblx0XHRmcy53cml0ZUZpbGVTeW5jKHRoaXMucGF0aCwgZGF0YSwge2VuY29kaW5nOid1dGYtOCcsIGZsYWc6J3cnfSk7XHJcblxyXG5cdFx0Y29uc3QgdXBkYXRlX3N0YXRlID0gZnMucmVhZEZpbGVTeW5jKHRoaXMucGF0aCkudG9TdHJpbmcoKTtcclxuXHRcdGlmKGRhdGEgPT0gdXBkYXRlX3N0YXRlKXtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRpZighKGRhdGEgPT0gdXBkYXRlX3N0YXRlKSl7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFtcdTY3RTVcdThCRTJdXHJcblx0c2VsZWN0KCl7XHJcblx0XHRpZighdGhpcy5pc19zdGF0ZSgpKXtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgcmVzID0gZnMucmVhZEZpbGVTeW5jKHRoaXMucGF0aCk7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShyZXMudG9TdHJpbmcoKSk7XHJcblx0fVxyXG5cclxuXHQvLyBbXHU5MUNEXHU3RjZFXVxyXG5cdHJlc2V0KCl7XHJcblx0XHRpZighdGhpcy5pc19zdGF0ZSgpKXtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3Qgc3RhdGUgPSB7XHJcblx0XHRcdCdpc19pMThuJzpmYWxzZSxcclxuXHRcdFx0J2kxOG5fdmVyc2lvbic6JycsXHJcblx0XHRcdCdwbHVnaW5fdmVyc2lvbic6JydcclxuXHRcdH1cclxuXHRcdC8vIFx1OEY2Q1x1NjU4N1x1NjcyQ1xyXG5cdFx0Y29uc3QgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHN0YXRlKTtcclxuXHRcdGZzLndyaXRlRmlsZVN5bmModGhpcy5wYXRoLCBkYXRhLCB7ZW5jb2Rpbmc6J3V0Zi04JywgZmxhZzondyd9KTtcclxuXHRcdC8vIFtcdTY1RTVcdTVGRDddXHJcblx0XHRjb25zdCB1cGRhdGVfc3RhdGUgPSBmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRoKS50b1N0cmluZygpO1xyXG5cdFx0aWYoZGF0YSA9PSB1cGRhdGVfc3RhdGUpe1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGlmKCEoZGF0YSA9PSB1cGRhdGVfc3RhdGUpKXtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLy8gXHU2M0E1XHU1M0UzXHJcbmludGVyZmFjZSBJU3RhdGUge1xyXG5cdGlzX2kxOG46IGJvb2xlYW47XHJcblx0dHJhbnNsYXRpb25fdmVyc2lvbjogc3RyaW5nO1xyXG5cdHBsdWdpbl92ZXJzaW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyAgICAgICAgICAgIFx1NzJCNlx1NjAwMVx1N0JBMVx1NzQwNlx1N0M3QlxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuZXhwb3J0IGNsYXNzIFN0YXRle1xyXG5cdHBhdGg6c3RyaW5nO1xyXG5cdGNvbnN0cnVjdG9yKHBhdGg6c3RyaW5nKXtcclxuXHRcdHRoaXMucGF0aCA9IHBhdGg7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBcdTUyMjRcdTY1QURcdTcyQjZcdTYwMDFcdTY1ODdcdTRFRjZcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuXHQgKiBAcmV0dXJucyBcdThGRDRcdTU2REVcdTcyQjZcdTYwMDFcdTY1ODdcdTRFRjZcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuXHQgKi9cclxuXHRwdWJsaWMgaXNfc3RhdGUoKXtcclxuXHRcdHJldHVybiBmcy5leGlzdHNTeW5jKHRoaXMucGF0aCk7XHJcblx0fVxyXG5cclxuXHQvLyBcdTU4OUVcclxuXHRwdWJsaWMgaW5zZXJ0KCl7XHJcblx0XHRjb25zdCBzdGF0ZTpJU3RhdGUgPSB7XHJcblx0XHRcdCdpc19pMThuJzpmYWxzZSxcclxuXHRcdFx0J3RyYW5zbGF0aW9uX3ZlcnNpb24nOicnLFxyXG5cdFx0XHQncGx1Z2luX3ZlcnNpb24nOicnXHJcblx0XHR9XHJcblx0XHRjb25zdCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoc3RhdGUpO1xyXG5cdFx0ZnMud3JpdGVGaWxlU3luYyh0aGlzLnBhdGgsIGRhdGEsIHtlbmNvZGluZzondXRmLTgnLCBmbGFnOid3J30pO1xyXG5cdH1cclxuXHJcblx0Ly8gXHU1MjIwXHJcblx0cHVibGljIGRlbGV0ZSgpe1xyXG5cdFx0ZnMudW5saW5rU3luYyh0aGlzLnBhdGgpO1xyXG5cdH1cclxuXHJcblx0Ly8gXHU2NTM5XHJcblx0cHVibGljIHVwZGF0ZShpc19pMThuOiBib29sZWFuLCB0cmFuc2xhdGlvbl92ZXJzaW9uOiBzdHJpbmcsIHBsdWdpbl92ZXJzaW9uOiBzdHJpbmcpe1xyXG5cdFx0Y29uc3Qgc3RhdGU6SVN0YXRlID0ge1xyXG5cdFx0XHQnaXNfaTE4bic6IGlzX2kxOG4sXHJcblx0XHRcdCd0cmFuc2xhdGlvbl92ZXJzaW9uJzp0cmFuc2xhdGlvbl92ZXJzaW9uLFxyXG5cdFx0XHQncGx1Z2luX3ZlcnNpb24nOnBsdWdpbl92ZXJzaW9uXHJcblx0XHR9XHJcblx0XHRjb25zdCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoc3RhdGUpO1xyXG5cdFx0ZnMud3JpdGVGaWxlU3luYyh0aGlzLnBhdGgsIGRhdGEsIHtlbmNvZGluZzondXRmLTgnLCBmbGFnOid3J30pO1xyXG5cdH1cclxuXHJcblx0Ly8gXHU2N0U1XHJcblx0cHVibGljIHNlbGVjdCgpe1xyXG5cdFx0Y29uc3QgcmVzID0gZnMucmVhZEZpbGVTeW5jKHRoaXMucGF0aCk7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShyZXMudG9TdHJpbmcoKSk7XHJcblx0fVxyXG5cclxuXHQvLyBbXHU5MUNEXHU3RjZFXVxyXG5cdHJlc2V0KCl7XHJcblx0XHRjb25zdCBzdGF0ZTpJU3RhdGUgPSB7XHJcblx0XHRcdCdpc19pMThuJzpmYWxzZSxcclxuXHRcdFx0J3RyYW5zbGF0aW9uX3ZlcnNpb24nOicnLFxyXG5cdFx0XHQncGx1Z2luX3ZlcnNpb24nOicnXHJcblx0XHR9XHJcblx0XHQvLyBcdThGNkNcdTY1ODdcdTY3MkNcclxuXHRcdGNvbnN0IGRhdGEgPSBKU09OLnN0cmluZ2lmeShzdGF0ZSk7XHJcblx0XHRmcy53cml0ZUZpbGVTeW5jKHRoaXMucGF0aCwgZGF0YSwge2VuY29kaW5nOid1dGYtOCcsIGZsYWc6J3cnfSk7XHJcblx0fVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gICAgICAgICAgICBcdTcyQjZcdTYwMDFcdTdCQTFcdTc0MDZcdTdDN0JcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmV4cG9ydCBjbGFzcyBDb25zb2xle1xyXG5cdGlzX2xvZzpib29sZWFuO1xyXG5cdGNvbnN0cnVjdG9yKGlzX2xvZzpib29sZWFuKXtcclxuXHRcdHRoaXMuaXNfbG9nID0gaXNfbG9nO1xyXG5cdH1cclxuXHJcblx0bG9nKG1lc3NhZ2U/OnVua25vd24pe1xyXG5cdFx0aWYodGhpcy5pc19sb2cpe1xyXG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZGVidWcobWVzc2FnZTpzdHJpbmcpe1xyXG5cdFx0aWYodGhpcy5pc19sb2cpe1xyXG5cdFx0XHRjb25zb2xlLmRlYnVnKG1lc3NhZ2UpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpbmZvKG1lc3NhZ2U6c3RyaW5nKXtcclxuXHRcdGlmKHRoaXMuaXNfbG9nKXtcclxuXHRcdFx0Y29uc29sZS5pbmZvKG1lc3NhZ2UpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR3YXJuKG1lc3NhZ2U6c3RyaW5nKXtcclxuXHRcdGlmKHRoaXMuaXNfbG9nKXtcclxuXHRcdFx0Y29uc29sZS53YXJuKG1lc3NhZ2UpXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGVycm9yKG1lc3NhZ2U6c3RyaW5nKXtcclxuXHRcdGlmKHRoaXMuaXNfbG9nKXtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihtZXNzYWdlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGFibGUodGFidWxhckRhdGE6IHVua25vd24pe1xyXG5cdFx0aWYodGhpcy5pc19sb2cpe1xyXG5cdFx0XHRjb25zb2xlLnRhYmxlKHRhYnVsYXJEYXRhKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z3JvdXAobWVzc2FnZTogdW5rbm93bil7XHJcblx0XHRpZih0aGlzLmlzX2xvZyl7XHJcblx0XHRcdGNvbnNvbGUuZ3JvdXAobWVzc2FnZSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdyb3VwQ29sbGFwc2VkKG1lc3NhZ2U6IHVua25vd24pe1xyXG5cdFx0aWYodGhpcy5pc19sb2cpe1xyXG5cdFx0XHRjb25zb2xlLmdyb3VwQ29sbGFwc2VkKG1lc3NhZ2UpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRncm91cEVuZCgpe1xyXG5cdFx0aWYodGhpcy5pc19sb2cpe1xyXG5cdFx0XHRjb25zb2xlLmdyb3VwRW5kKClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsZWFyKCl7XHJcblx0XHRjb25zb2xlLmNsZWFyKClcclxuXHR9XHJcbn1cclxuXHJcbi8vIGltcG9ydCB7IGV4ZWMsIGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcbi8vIFx1OTAwOVx1NjJFOVx1NzZFRVx1NUY1NVxyXG4vLyBjb25zdCBjb21tYW5kID0gYHBvd2Vyc2hlbGwuZXhlIC1Db21tYW5kIFwiJiB7QWRkLVR5cGUgLUFzc2VtYmx5TmFtZSBTeXN0ZW0uV2luZG93cy5Gb3JtczsgJGZvbGRlckRpYWxvZyA9IE5ldy1PYmplY3QgU3lzdGVtLldpbmRvd3MuRm9ybXMuRm9sZGVyQnJvd3NlckRpYWxvZzsgJGZvbGRlckRpYWxvZy5EZXNjcmlwdGlvbiA9ICdcdThCRjdcdTkwMDlcdTYyRTlcdTY1ODdcdTRFRjZcdTU5MzknOyAkZm9sZGVyRGlhbG9nLlJvb3RGb2xkZXIgPSBbU3lzdGVtLkVudmlyb25tZW50K1NwZWNpYWxGb2xkZXJdOjpNeUNvbXB1dGVyOyAkcmVzdWx0ID0gJGZvbGRlckRpYWxvZy5TaG93RGlhbG9nKCk7IGlmICgkcmVzdWx0IC1lcSBbU3lzdGVtLldpbmRvd3MuRm9ybXMuRGlhbG9nUmVzdWx0XTo6T0spIHsgV3JpdGUtT3V0cHV0ICRmb2xkZXJEaWFsb2cuU2VsZWN0ZWRQYXRoIH0gZWxzZSB7IFdyaXRlLU91dHB1dCAnJyB9fVwiYFxyXG4vLyBcdTYyNTNcdTVGMDBcdTYzMDdcdTVCOUFcdTc2RUVcdTVGNTVcclxuLy8gY29uc3QgY29tbWFuZCA9IGBwb3dlcnNoZWxsLmV4ZSAtQ29tbWFuZCBcImlpIEQ6XFxcXEdhbWVcXFxcU3RlYW1cImBcclxuLy8gaWkgL1xyXG4vLyBcdTVGMDJcdTZCNjVcdTYyNjdcdTg4NENcclxuLy8gZXhlYyhjb21tYW5kLCAoZXJyb3IsIGZpbGUpID0+IHtcclxuLy8gXHRjb25zb2xlLmxvZyhlcnJvciwgZmlsZS50b1N0cmluZygpKVxyXG4vLyB9KVxyXG5cclxuLy8gXHU1NDBDXHU2QjY1XHU2MjY3XHU4ODRDXHJcbi8vIGNvbnN0IGZpbGVQYXRoID0gZXhlY1N5bmMoY29tbWFuZClcclxuLy8gY29uc29sZS5sb2coJ1x1OTAwOVx1NjJFOVx1NzY4NFx1NjU4N1x1NEVGNicsIGZpbGVQYXRoKVxyXG4iLCAiaW1wb3J0IHsgUmVxdWVzdFVybFBhcmFtLCByZXF1ZXN0VXJsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJ1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgSTE4TiBmcm9tIFwiLi9tYWluXCI7XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gICAgICAgICBcdTY3MkNcdTU3MzBcdTY1ODdcdTRFRjZcdTdGRkJcdThCRDEoTG9jYWwgRG9jdW1lbnQgVHJhbnNsYXRpb24pXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5leHBvcnQgY2xhc3MgTERUIHtcclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gXHU2NzJDXHU1NzMwXHU2M0QyXHU0RUY2XHU3RkZCXHU4QkQxXHU1MUZEXHU2NTcwXHJcblx0ICogQHBhcmFtIHBsdWdpbl9wYXRoIFx1NjNEMlx1NEVGNlx1OERFRlx1NUY4NFxyXG5cdCAqIEBwYXJhbSB0cmFuc2xhdGlvbl9wYXRoIFx1OEJEMVx1NjcyQ1x1OERFRlx1NUY4NFxyXG5cdCAqLyBcclxuICAgIHB1YmxpYyB0cmFuc2xhdGlvbihwbHVnaW5fcGF0aDpzdHJpbmcsIHRyYW5zbGF0aW9uX3BhdGg6c3RyaW5nKXtcclxuICAgICAgICAvLyBcdTUyMUJcdTVFRkFcdTY1ODdcdTRFRjZcdTU5MDdcdTRFRkQgXHU1RjUzXHU2NTg3XHU0RUY2XHU1QjU4XHU1NzI4XHU2NUY2XHU3NkY0XHU2M0E1XHU4OTg2XHU3NkQ2XHJcblx0XHRmcy5jb3B5RmlsZVN5bmMocGF0aC5qb2luKHBsdWdpbl9wYXRoLCAnbWFpbi5qcycpLCBwYXRoLmpvaW4ocGx1Z2luX3BhdGgsICdkdXBsaWNhdGUuanMnKSk7XHJcblxyXG5cdFx0Ly8gXHU4QkVEXHU4QTAwXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHJcblx0XHRjb25zdCB0cmFuc2xhdGlvbl9zdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmModHJhbnNsYXRpb25fcGF0aCkudG9TdHJpbmcoKTtcclxuXHRcdGNvbnN0IHRyYW5zbGF0aW9uX29iamVjdCA9IEpTT04ucGFyc2UodHJhbnNsYXRpb25fc3RyaW5nKTtcclxuXHRcdGNvbnNvbGUubG9nKCdcdTVCRjlcdTcxNjdcdTg4NjgnKTtcclxuXHRcdGNvbnNvbGUudGFibGUodHJhbnNsYXRpb25fb2JqZWN0WydkaWN0J10pO1xyXG5cclxuXHRcdC8vIFx1OEJGQlx1NTNENlx1NUU3Nlx1OEY2Q1x1NjM2Mlx1NEUzQVx1NUI1N1x1N0IyNlx1NEUzMlxyXG5cdFx0bGV0IHJlcyA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4ocGx1Z2luX3BhdGgsICdtYWluLmpzJykpLnRvU3RyaW5nKCk7XHJcblx0XHQvLyBcdTVCRjlcdTdGRkJcdThCRDFcdTg4NjhcdThGREJcdTg4NENcdTkwMTBcdTY3NjFcdTdGRkJcdThCRDFcclxuXHRcdGZvcihjb25zdCBrZXkgaW4gdHJhbnNsYXRpb25fb2JqZWN0WydkaWN0J10pe1xyXG5cdFx0XHRyZXMgPSByZXMucmVwbGFjZUFsbChrZXksIHRyYW5zbGF0aW9uX29iamVjdFsnZGljdCddW2tleV0pO1xyXG5cdFx0fVxyXG5cdFx0Ly8gXHU1MTk5XHU1MTY1XHJcblx0XHRmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihwbHVnaW5fcGF0aCwgJ21haW4uanMnKSwgcmVzLCAndXRmLTgnKTtcclxuXHRcdHJldHVybiB0cmFuc2xhdGlvbl9vYmplY3RcclxuICAgIH1cclxuICAgIC8qKlxyXG5cdCAqIFx1OEZEOFx1NTM5Rlx1NTFGRFx1NjU3MFxyXG5cdCAqIEBwYXJhbSBwbHVnaW5fcGF0aCBcdTYzRDJcdTRFRjZcdThERUZcdTVGODRcclxuXHQgKi9cclxuICAgIHB1YmxpYyByZXN0b3JlKHBsdWdpbl9wYXRoOnN0cmluZyl7XHJcblx0XHQvLyBcdTUyMjBcdTk2NjRcdTdGRkJcdThCRDFcdThGQzdcdTc2ODRcdTY1ODdcdTRFRjZcclxuXHRcdGZzLnVubGlua1N5bmMocGF0aC5qb2luKHBsdWdpbl9wYXRoLCAnbWFpbi5qcycpKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHQvLyBcdTVDMDZcdTU5MDdcdTRFRkRcdTY1ODdcdTRFRjZcdTY2RjRcdTY1MzlcdTU0MERcdTc5RjBcclxuXHRcdGZzLnJlbmFtZVN5bmMocGF0aC5qb2luKHBsdWdpbl9wYXRoLCAnZHVwbGljYXRlLmpzJyksIHBhdGguam9pbihwbHVnaW5fcGF0aCwgJ21haW4uanMnKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyAgICAgICAgIFx1N0Y1MVx1N0VEQ1x1NjU4N1x1NEVGNlx1N0ZGQlx1OEJEMShOZXR3b3JrIERvY3VtZW50IFRyYW5zbGF0aW9uKVxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuZXhwb3J0IGNsYXNzIE5EVCB7XHJcblx0aTE4bjogSTE4TjtcclxuXHQvLyBcdTUyMURcdTU5Q0JcdTUzMTZcclxuXHRjb25zdHJ1Y3RvcihpMThuOkkxOE4pIHtcclxuXHRcdHRoaXMuaTE4biA9IGkxOG47XHJcblx0fVxyXG5cclxuXHQvLyBcdThCRjdcdTZDNDJcdTU3MzBcdTU3NDBcclxuXHRwcml2YXRlIFJlcXVlc3RVcmxQYXJhbSh1cmw6IHN0cmluZyl7XHJcblx0XHRjb25zdCBSZXF1ZXN0VXJsUGFyYW06IFJlcXVlc3RVcmxQYXJhbSA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdGhlYWRlcnM6IHtcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cclxuXHRcdH07XHJcblx0XHRyZXR1cm4gUmVxdWVzdFVybFBhcmFtXHJcblx0fVxyXG5cclxuXHQvLyBcdTgzQjdcdTUzRDYgXHU3RjUxXHU3RURDXHU2NTg3XHU0RUY2IFx1NzZFRVx1NUY1NVxyXG4gICAgYXN5bmMgZ2V0RGlyZWN0b3J5KCl7XHJcblx0XHR0cnl7XHJcblx0XHRcdGNvbnN0IHJlcXVlc3QgPSB0aGlzLlJlcXVlc3RVcmxQYXJhbShwYXRoLmpvaW4odGhpcy5pMThuLnNldHRpbmdzLmkxOG5fbmR0X3VybCwgJ2RpcmVjdG9yeS5qc29uJykpO1xyXG5cdFx0XHQvLyBcdThGRDlcdTY4MzdcdTVDMzFcdTUzRUZcdTRFRTVcdTc2RjRcdTYzQTVcdTgzQjdcdTUzRDZcdTRFODZcclxuXHRcdFx0Y29uc3QgZGF0YSA9IGF3YWl0IHJlcXVlc3RVcmwocmVxdWVzdCk7XHJcblx0XHRcdC8vIFtzdGF0dXNdIFtoZWFkZXJzXSBbYXJyYXlCdWZmZXJdIFtqc29uXSBbdGV4dF1cclxuXHRcdFx0cmV0dXJuIHtjb2RlOiB0cnVlLCB0ZXh0OiBkYXRhLnRleHR9O1xyXG5cdFx0fWNhdGNoKGUpe1xyXG5cdFx0XHRjb25zdCBlcnJvciA9IHRoaXMuZXJyb3IoZSlcclxuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XHJcblx0XHRcdHJldHVybiB7Y29kZTogZmFsc2UsIHRleHQ6IGVycm9yfTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFx1ODNCN1x1NTNENiBcdTdGNTFcdTdFRENcdTY1ODdcdTRFRjZcclxuXHRhc3luYyBnZXRXZWIocGx1Z2luOiBzdHJpbmcgLGxhbmc6IHN0cmluZyl7XHJcblx0XHR0cnl7XHJcblx0XHRcdC8vIFx1OEJGN1x1NkM0Mlx1NTczMFx1NTc0MFxyXG5cdFx0XHRjb25zdCByZXF1ZXN0ID0gdGhpcy5SZXF1ZXN0VXJsUGFyYW0ocGF0aC5qb2luKHRoaXMuaTE4bi5zZXR0aW5ncy5pMThuX25kdF91cmwsIGBwbHVnaW5zXFxcXCR7cGx1Z2lufVxcXFwke2xhbmd9Lmpzb25gKSk7XHJcblx0XHRcdC8vIFx1OEJGN1x1NkM0Mlx1NTIzMFx1NzY4NFx1NjU3MFx1NjM2RVxyXG5cdFx0XHRjb25zdCBkYXRhID0gYXdhaXQgcmVxdWVzdFVybChyZXF1ZXN0KTtcclxuXHRcdFx0Ly8gXHU4RkQ0XHU1NkRFXHJcblx0XHRcdHJldHVybiB7Y29kZTogdHJ1ZSwgdGV4dDogZGF0YS50ZXh0fTtcclxuXHRcdH1jYXRjaChlKXtcclxuXHRcdFx0Y29uc3QgZXJyb3IgPSB0aGlzLmVycm9yKGUpXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG5cdFx0XHRyZXR1cm4ge2NvZGU6IGZhbHNlLCB0ZXh0OiBlcnJvcn07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBcdTYyQTVcdTk1MTlcdTY1MzZcdTk2QzZcclxuXHRwcml2YXRlIGVycm9yKGVycm9yOiBzdHJpbmcpIDogc3RyaW5ne1xyXG5cdFx0aWYoZXJyb3IgPT0gJ0Vycm9yOiBuZXQ6OkVSUl9DT05ORUNUSU9OX1JFRlVTRUQnKXtcclxuXHRcdFx0cmV0dXJuICdcdThCRjdcdTZDNDJcdTVERjJcdTg4QUJcdTYyRDJcdTdFREQnXHJcblx0XHR9XHJcblx0XHRpZiAoZXJyb3IgPT0gJ0Vycm9yOiBuZXQ6OkVSUl9BRERSRVNTX0lOVkFMSUQnKSB7XHJcblx0XHRcdHJldHVybiAnXHU4QkY3XHU2QzQyXHU1NzMwXHU1NzQwXHU2NUUwXHU2NTQ4J1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVycm9yID09ICdFcnJvcjogUmVxdWVzdCBmYWlsZWQsIHN0YXR1cyA0MDAnKSB7XHJcblx0XHRcdHJldHVybiAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1IFx1NzJCNlx1NjAwMTQwMCdcclxuXHRcdH1cclxuXHRcdGlmKGVycm9yID09ICdFcnJvcjogUmVxdWVzdCBmYWlsZWQsIHN0YXR1cyA0MDQnKXtcclxuXHRcdFx0cmV0dXJuICdcdThCRjdcdTZDNDJcdTU5MzFcdThEMjUgXHU3MkI2XHU2MDAxNDA0J1xyXG5cdFx0fVxyXG5cdFx0aWYoZXJyb3IgPT0gJ0Vycm9yOiBSZXF1ZXN0IGZhaWxlZCwgc3RhdHVzIDQxNCcpe1xyXG5cdFx0XHRyZXR1cm4gJ1x1OEJGN1x1NkM0Mlx1NTkzMVx1OEQyNSBcdTcyQjZcdTYwMDE0MTQnXHJcblx0XHR9XHJcblx0XHRpZihlcnJvciA9PSAnRXJyb3I6IFJlcXVlc3QgZmFpbGVkLCBzdGF0dXMgNTAyJyl7XHJcblx0XHRcdHJldHVybiAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1IFx1NzJCNlx1NjAwMTUwMidcclxuXHRcdH1cclxuXHRcdGlmKGVycm9yID09ICdFcnJvcjogbmV0OjpFUlJfSFRUUDJfUFJPVE9DT0xfRVJST1InKXtcclxuXHRcdFx0cmV0dXJuICdIVFRQMiBcdTUzNEZcdThCQUVcdTk1MTlcdThCRUYnXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYCR7ZXJyb3J9YFxyXG5cdH1cclxuXHJcblx0Ly8gXHU0RTBCXHU4RjdEXHU2NUI5XHU2Q0Q1XHJcblx0c3RhdGljIGRvd25sb2FkKCl7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gXHU2NkY0XHU2NUIwXHU2NUI5XHU2Q0Q1XHJcblx0c3RhdGljIHVwZGF0ZSgpe1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyAgICAgICAgIFx1N0Y1MVx1N0VEQ1x1NjNBNVx1NTNFM1x1N0ZGQlx1OEJEMShOZXR3b3JrIEludGVyZmFjZSBUcmFuc2xhdGlvbilcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbmV4cG9ydCBjbGFzcyBOSVQge1xyXG59XHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ0FBLElBQUFBLG1CQUFvRztBQUVwRyxJQUFBQyxRQUFzQjtBQUN0QixJQUFBQyxNQUFvQjs7O0FDZWIsSUFBTSxtQkFBdUM7QUFBQSxFQUNuRCxVQUFVO0FBQUEsSUFDVCxjQUFjO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixLQUFJO0FBQUEsSUFDSixlQUFlO0FBQUEsSUFDZixjQUFjO0FBQUEsSUFDZCxlQUFl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QUssT0FBTztBQUFBLE1BQ2IsQ0FBQztBQUFBLElBQ0Y7QUFFQSxTQUFLLFFBQVEsU0FBUztBQUFBLEVBQ3ZCO0FBQUE7QUFBQSxFQUdRLFNBQVE7QUFDZixTQUFLLFVBQVUsQ0FBQztBQUNoQixTQUFLLE1BQU07QUFDWCxTQUFLLEtBQUs7QUFBQSxFQUNYO0FBQUEsRUFFUSxXQUFXQyxPQUFhO0FBQ3pCLFVBQU0sT0FBVSxnQkFBWUEsS0FBSTtBQUNoQyxhQUFRLElBQUksR0FBRyxJQUFJLEtBQUssUUFBUSxLQUFJO0FBRTVCLFlBQU0sTUFBTUEsUUFBTyxNQUFNLEtBQUssQ0FBQztBQUMvQixZQUFNLE9BQVUsYUFBUyxHQUFHO0FBQzVCLFVBQUcsS0FBSyxZQUFZLEdBQUU7QUFFbEIsYUFBSyxXQUFXLEdBQUc7QUFBQSxNQUN2QixPQUFLO0FBRUQsUUFBRyxlQUFXLEdBQUc7QUFBQSxNQUNyQjtBQUFBLElBQ1I7QUFDQSxJQUFHLGNBQVVBLEtBQUk7QUFBQSxFQUN4QjtBQUFBO0FBQUEsRUFHQSxNQUFNLFNBQVM7QUFDZCxVQUFNLEVBQUUsVUFBVSxJQUFJO0FBRXRCLGNBQVUsUUFBUSwwQkFBTTtBQUd4QixVQUFNLEtBQUssYUFBYTtBQUN4QixVQUFNLEtBQUssVUFBVTtBQUFBLEVBQ3RCO0FBQUE7QUFBQSxFQUVBLE1BQU0sVUFBVTtBQUNmLFVBQU0sRUFBRSxVQUFVLElBQUk7QUFDdEIsY0FBVSxNQUFNO0FBQUEsRUFDakI7QUFDRDs7O0FEeHJCQSxJQUFPLGVBQVE7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJwYXRoIiwgImZzIiwgImltcG9ydF9vYnNpZGlhbiIsICJwYXRoIiwgInBhdGgiLCAiaW1wb3J0X29ic2lkaWFuIiwgImZzIiwgInBhdGgiLCAiUmVxdWVzdFVybFBhcmFtIiwgImJsb2NrIiwgImxhbmciLCAiYSIsICJwYXRoIl0KfQo=
