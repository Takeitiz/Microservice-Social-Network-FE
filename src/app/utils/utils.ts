import { Observable } from "rxjs";
import { AppComponent } from "../app.component";
import { Content } from "../models/content.model";
import { UploadService } from "../services/upload.service";

export class Util {
    static uploadService: UploadService;

    static formatDate(date: Date): string {
        let values = date.toString().slice(0, 10).split('-');
        values.reverse();

        return [...values].join('/');
    }

    static getFullLinkContent(content: Content): string {
        return AppComponent.baseUrl + '/app-images/' + content.postId + '/' + content.linkContent;
    }

    static getCurrentUserAvatar(userId: string): string {
        let url = "";
        this.uploadService.fetchImage(userId).subscribe(data => {
            url = data;
        });
        return url;
    }

    static getTimeDiff(time: Date): string {
        let now = new Date();
        let date = new Date(time.valueOf());
        let diff = Math.round((now.getTime() - date.getTime()) / 60000);

        if (diff < 1) {
            return 'Just now';
        } else if (diff < 60) {
            return diff + ' minutes ago';
        } else if (diff < 1440) {
            let hour = diff < 120 ? 'hour' : 'hours';
            return Math.floor(diff / 60) + ' ' + hour + ' ago';
        }
        else if (diff < 10080) {
            let day = diff < 2880 ? 'day' : 'days';
            return Math.floor(diff / 1440) + ' ' + day + ' ago';
        }
        else {
            return Util.formatDate(date);
        }
    }
}