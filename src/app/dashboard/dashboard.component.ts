import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";

import * as cocoSSD from "@tensorflow-models/coco-ssd";
import { User } from "../_models";
import { UserService } from "../_services";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  title = "TF-ObjectDetection";
  private video: HTMLVideoElement;
  public video_url: string;
  currentUser: User;
  users: User[] = [];

  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.video_url = "";
  }
  ngOnInit() {
    this.webcam_init();
    this.predictWithCocoModel();
    this.loadAllUsers();
  }

  public async predictWithCocoModel() {
    const model = await cocoSSD.load("lite_mobilenet_v2");
    this.detectFrame(this.video, model);
    console.log("model loaded");
  }

  deleteUser(id: number) {
    this.userService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.loadAllUsers();
      });
  }

  private loadAllUsers() {
    this.userService
      .getAll()
      .pipe(first())
      .subscribe(users => {
        this.users = users;
      });
  }

  webcam_init() {
    this.video = <HTMLVideoElement>document.getElementById("vid");

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "user"
        }
      })
      .then(stream => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          this.video.play();
        };
      });
  }

  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };
  onDoubleClick(vID) {
    var vTag = document.getElementById("vid");
    var movieName = "./assets/videos/" + vID;
    var sourceTag = null;
    console.log(vTag.childNodes);
    if (vTag.childNodes.length != 0) {
      vTag.removeChild(vTag.childNodes[0]);
    }
    sourceTag = document.createElement("source");
    sourceTag.setAttribute("src", movieName);
    sourceTag.setAttribute("type", "video/mp4");
    vTag.appendChild(sourceTag);
    vTag.setAttribute("autoplay", "true");
    vTag.setAttribute("loop", "true");
    sourceTag = null;
    vTag = null;
  }

  renderPredictions = predictions => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");

    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(this.video, 0, 0, 640, 480);

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };
}
