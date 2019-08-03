import {
    Component,
    OnInit,
    Input,
    NgZone
} from "@angular/core";
import { Observable } from "rxjs";
import { changeStreamById } from '@customjs/index.js';

@Component({
    selector: "app-video-source",
    templateUrl: "./video-source.component.html",
    styleUrls: ["./video-source.component.css"]
})
export class VideoSourceComponent implements OnInit {

    @Input() streamId;
    @Input() feedName;
    @Input() streamingStatus;
    @Input() sourceImage;

    constructor() {
    }

    ngOnInit() {

    }
    changeStream(streamId) {
        changeStreamById(streamId);
    }
}
