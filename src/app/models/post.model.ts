import { Comment } from './comment.model';
import { Content } from './content.model';
import { React } from './react.model';
import { User } from './user.model';

export class Post {
    id: string
    caption: string;
    userId: string;
    sharePostId?: string;
    createdTime: Date;
    updatedTime: Date;

    contents?: Content[];
    reacts?: React[];
    comments?: Comment[];
    user?: User;

    constructor(id = '', caption = '', userId = '', createdTime = new Date(), updatedTime = new Date()) {
        this.id = id;
        this.caption = caption;
        this.userId = userId;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
    }
}