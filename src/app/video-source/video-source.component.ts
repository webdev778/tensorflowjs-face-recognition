// import { Component, OnInit } from '@angular/core';

import {
    Component,
    OnInit,
    ViewChild,
    Input,
    ElementRef,
    NgZone
} from "@angular/core";
import { Observable } from "rxjs";
import { changeStreamById } from '@customjs/index.js';

declare let RTCPeerConnection: any;
// declare var changeStream:any;

@Component({
    selector: "app-video-source",
    inputs: ["videoName"],
    templateUrl: "./video-source.component.html",
    styleUrls: ["./video-source.component.css"]
})
export class VideoSourceComponent implements OnInit {
    callActive: boolean = false;
    pc: any;
    localStream: any;

    senderId: string;
    video_url: string;
    @ViewChild("me", { static: false }) me: any;
    @ViewChild("remote", { static: false }) remote: any;
    @Input() videoName: string;
    @Input() streamId;

    constructor() {
        this.video_url = this.videoName;
        console.log("video URL: ", this.video_url);
    }

    ngOnInit() {
        this.setupWebRtc();
    }

    public ngOnDestroy() {
        this.pc.close();
        let tracks = this.localStream.getTracks();
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }
        this.callActive = false;
    }

    setupWebRtc() {
        this.senderId = this.guid();
        var channelName = "/webrtc";
        try {
            this.pc = new RTCPeerConnection(
                {
                    iceServers: [
                        { urls: "stun:stun.services.mozilla.com" },
                        { urls: "stun:stun.l.google.com:19302" }
                    ]
                },
                { optional: [] }
            );
        } catch (error) {
            console.log(error);
            this.pc = new RTCPeerConnection(
                {
                    iceServers: [
                        { urls: "stun:stun.services.mozilla.com" },
                        { urls: "stun:stun.l.google.com:19302" }
                    ]
                },
                { optional: [] }
            );
        }

        this.pc.ontrack = event =>
            (this.remote.nativeElement.srcObject = event.streams[0]); // use ontrack
        this.showMe();
    }

    showMe() {
        // navigator.mediaDevices
        //   .getUserMedia({ audio: true, video: true })
        //   .then(stream => {
        //     if(this && this.me)
        //       this.me.nativeElement.srcObject = stream
        //   })
        //   .then(stream => {
        //     this.pc.addStream(stream);
        //     this.localStream = stream;
        //   });
    }

    guid() {
        return (
            this.s4() +
            this.s4() +
            "-" +
            this.s4() +
            "-" +
            this.s4() +
            "-" +
            this.s4() +
            "-" +
            this.s4() +
            this.s4() +
            this.s4()
        );
    }
    s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    changeStream(streamId) {
        changeStreamById(streamId);
    }
}
