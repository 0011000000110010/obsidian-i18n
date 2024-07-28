import { ItemView, WorkspaceLeaf } from "obsidian";

export const EDIT_VIEW_TYPE = 'i18n-edit-view'

export class EditView extends ItemView {
    private frame: HTMLIFrameElement;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    onload(): void {
        this.frame = this.contentEl.doc.createElement("iframe");
        this.frame.src = 'https://0011000000110010.github.io/obsidian-i18n-edit/'
        this.frame.addClass('edit');
        this.contentEl.appendChild(this.frame);
    }

    focus(): void {
        this.frame.focus();
    }

    getViewType(): string {
        return EDIT_VIEW_TYPE;
    }

    getDisplayText(): string {
        return '译文编辑';
    }

    getIcon(): string {
        return 'globe-2';
    }
}