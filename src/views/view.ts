import { ItemView, WorkspaceLeaf } from "obsidian";
import { CustomFrame } from "./frame";

export const EDIT_VIEW_TYPE = 'i18n-edit-view'

export class EditView extends ItemView {
    private frame: CustomFrame;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.frame = new CustomFrame();
    }

    onload(): void {
        this.contentEl.empty();
        this.contentEl.addClass("custom-frames-view");
        this.frame.create(this.contentEl);
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