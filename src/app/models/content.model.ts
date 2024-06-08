export class Content {
    id: string;
    textContent: string;
    linkContent: string;
    image_id: string;
    type: number;
    postId: string;

    constructor(id = '', textContent = '', linkContent = '', image_id = '', type = 0, postId = '') {
        this.image_id = image_id;
        this.id = id;
        this.textContent = textContent;
        this.linkContent = linkContent;
        this.type = type;
        this.postId = postId;
    }
}