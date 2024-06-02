export class React {
    id: string;
    type: number;
    userId: string;
    postId: string;

    constructor(id = '', type = 0, userId = '', postId = '') {
        this.id = id;
        this.type = type;
        this.userId = userId;
        this.postId = postId;
    }
}