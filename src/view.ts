// import { ButtonComponent, ItemView, Setting, TextAreaComponent, TextComponent, WorkspaceLeaf } from 'obsidian';
// import { I18nSettings } from './settings/data';
// export const TableControlsViewType = 'advanced-tables-toolbar';

// export class TableControlsView extends ItemView {
//     private readonly settings: I18nSettings;

//     constructor(leaf: WorkspaceLeaf, settings: I18nSettings) {
//         super(leaf);
//         this.settings = settings;
//     }
//     public load(): void {
//         super.load();
//         this.draw();
//     }

//     public getViewType(): string {
//         return 'TableControlsViewType';
//     }

//     public getDisplayText(): string {
//         return 'Advanced Tables';
//     }

//     public getIcon(): string {
//         return 'spreadsheet';
//     }

//     private readonly draw = (): void => {
//         const container = this.containerEl.children[1];
//         const { contentEl } = this;
//         this.contentEl.setText('测试');
//         new Setting(contentEl);
        
//         // const block1 = new Setting(contentEl);
//         // block1.setName('测试');
//         // const block2 = new Setting(contentEl);
//         // block2.setName('测试');

//         const rootEl = document.createElement('div');
//         rootEl.addClass("advanced-tables-buttons");
        
//         const a1 = new TextAreaComponent(contentEl);
//         a1.setValue('测试');

//         const a2 = new TextAreaComponent(contentEl);
//         a2.setValue('测试');

        
//         const block3 = new Setting(rootEl);
//         block3.setName('测试');
//         const block = new Setting(rootEl);
//         block.setName('测试');
        



//         container.empty();
//         container.appendChild(rootEl);
//     };

// }
