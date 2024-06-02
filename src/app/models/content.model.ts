export class Content {
    id: string;
    textContent: string;
    linkContent: string;
    type: number;
    postId: string;

    constructor(id = '', textContent = '', linkContent = '', type = 0, postId = '') {
        this.id = id;
        this.textContent = textContent;
        this.linkContent = linkContent;
        this.type = type;
        this.postId = postId;
    }
}