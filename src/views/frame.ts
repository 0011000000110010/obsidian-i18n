import { Platform } from "obsidian";

export class CustomFrame {
    private frame: HTMLIFrameElement | any;

    create(parent: HTMLElement): void {
        // 判断是否桌面应用 
        // if (Platform.isDesktopApp) {
        //     const frameDoc = parent.doc;
        //     this.frame = frameDoc.createElement("webview");
        //     this.frame.allowpopups = true;
        //     this.frame.addClass("custom-edit-view");
        //     parent.appendChild(this.frame);

        //     this.frame.addEventListener("dom-ready", () => {
        //         this.frame.setZoomFactor(1);
        //         // this.frame.executeJavaScript(this.data.customJs)
        //     });
        //     this.frame.addEventListener("destroyed", () => {
        //         if (frameDoc != parent.doc) {
        //             this.frame.detach();
        //             this.create(parent);
        //         }
        //     });
        // } else {
        //     console.log('走的iframe');
        //     this.frame = parent.doc.createElement("iframe");
        //     parent.appendChild(this.frame);
        //     this.frame.setAttribute("sandbox", "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads");
        //     this.frame.setAttribute("allow", "encrypted-media; fullscreen; oversized-images; picture-in-picture; sync-xhr; geolocation;");
        // }
        // this.frame = parent.doc.createElement("iframe");
        // parent.appendChild(this.frame);
        // const src = './a.html';
        // this.frame.setAttribute("src", src);
        // console.log(this.frame)

        const frameDoc = parent.doc;
        this.frame = frameDoc.createElement("webview");
        this.frame.allowpopups = true;
        this.frame.addClass("custom-edit-view");
        parent.appendChild(this.frame);

        this.frame.addEventListener("dom-ready", () => {
            this.frame.setZoomFactor(1);
            // this.frame.executeJavaScript(this.data.customJs)
        });
        this.frame.addEventListener("destroyed", () => {
            if (frameDoc != parent.doc) {
                this.frame.detach();
                this.create(parent);
            }
        });

        const src = 'file://./a.html';
        this.frame.setAttribute("src", src);

        
    }

    refresh(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.location.reload();
        } else {
            this.frame.reload();
        }
    }

    return(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.open(this.data.url);
        } else {
            this.frame.loadURL(this.data.url);
        }
    }

    goBack(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.history.back();
        } else {
            this.frame.goBack();
        }
    }

    goForward(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.history.forward();
        } else {
            this.frame.goForward();
        }
    }

    toggleDevTools(): void {
        if (!(this.frame instanceof HTMLIFrameElement)) {
            if (!this.frame.isDevToolsOpened()) {
                this.frame.openDevTools();
            } else {
                this.frame.closeDevTools();
            }
        }
    }

    getCurrentUrl(): string {
        return this.frame instanceof HTMLIFrameElement ? this.frame.contentWindow.location.href : this.frame.getURL();
    }

    focus(): void {
        if (this.frame instanceof HTMLIFrameElement) {
            this.frame.contentWindow.focus();
        } else {
            this.frame.focus();
        }
    }
}