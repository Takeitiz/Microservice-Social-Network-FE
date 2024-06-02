export class Friendship {
    id: string;
    userId: string;
    friendId: string;
    status: number;

    constructor(id = '', userId = '', friendId = '', status = 0) {
        this.id = id;
        this.userId = userId;
        this.friendId = friendId;
        this.status = status;
    }
}