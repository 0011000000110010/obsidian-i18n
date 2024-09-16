import { App, ButtonComponent, Modal, Setting } from 'obsidian';

// ==============================
//          侧边栏 对话框 转译
// ==============================
export class GitIssueModal extends Modal {
    onSubmit: () => void;

    title: string;
    body: string
    constructor(app: App, title: string, body: string, onSubmit: () => void) {
        super(app);
        this.title = title;
        this.body = body;
        this.onSubmit = onSubmit;
    }

    public async Main() {
        const { contentEl } = this;
        // this.contentEl.addClass('i');

        contentEl.createEl("h4", { text: "提交翻译文件" });
        contentEl.createEl("div", { text: "请再次确认您的提交" });
        contentEl.createEl("div", { text: "确保每一份努力都能有效贡献" });
        contentEl.createEl("div", { text: "避免无效内容占用宝贵资源哦" });

        const buttonBlock = new Setting(contentEl);
        const cancelButton = new ButtonComponent(buttonBlock.controlEl);
        cancelButton.setButtonText('取消');
        cancelButton.onClick(() => {
            this.close();
        });
        const submitButton = new ButtonComponent(buttonBlock.controlEl);
        submitButton.setButtonText('提交');
        submitButton.setCta();
        submitButton.onClick(() => {
            this.onSubmit();
        });
    }

    private reload() {
        this.close();
        this.open();
    }
    async onOpen() {
        await this.Main();
    }
    async onClose() {
        this.contentEl.empty();
    }
}