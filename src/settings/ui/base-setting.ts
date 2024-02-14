import I18N from 'src/main';
import { I18nSettingTab } from '.';
import { I18nSettings } from '../data';

export default abstract class BaseSetting {
  protected settingTab:I18nSettingTab;
  protected i18n: I18N;
  protected settings: I18nSettings;
  protected containerEl: HTMLElement;

  constructor(obj: I18nSettingTab) {
    this.settingTab = obj;
    this.i18n = obj.i18n;
    this.settings = obj.i18n.settings;
    this.containerEl = obj.containerEl;
  }
  
  public abstract main(): void;
  public display(): void { this.main() }
}