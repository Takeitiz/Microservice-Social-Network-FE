import { User } from "./user.model";

export class Comment {
    id: string;
    comment: string;
    userId: string;
    postId: string;
    createdTime: Date;
    updatedTime: Date;
    user?: User;

    constructor(id = '', comment = '', userId = '', postId = '', createdTime = new Date(), updatedTime = new Date()) {
        this.id = id;
        this.comment = comment;
        this.userId = userId;
        this.postId = postId;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
    }
}