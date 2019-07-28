import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";

import * as cocoSSD from "@tensorflow-models/coco-ssd";
import { User } from "../_models";
import { UserService } from "../_services";
import { model } from "@tensorflow/tfjs";

declare var faceapi: any;

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
  public loadingState: number = 0;

  public clickNumber: number = 0;
  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.video_url = "";
  }
  ngOnInit() {
    this.webcam_init();
    this.predictWithCocoModel();
    this.loadAllUsers();
    this.initModel();
  }

  public async initModel() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/assets/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/assets/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/assets/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/assets/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/assets/models")
    ]);
    console.log("faceapi all model loaded");
    this.detectFace(this.video);
  }

  detectFace = video => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const displaySize = { width: 640, height: 480 };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const labeledFaceDescriptors = await this.loadLabeledImages();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      const results = resizedDetections.map(d =>
        faceMatcher.findBestMatch(d.descriptor)
      );
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        //const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
        // drawBox.draw(canvas)
        const ctx = canvas.getContext("2d");
        // Font options.
        const font = "16px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";
        // Draw the rectangle of rect
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        // Draw the label background.
        ctx.fillStyle = "#00FFFF";
        const textWidth = ctx.measureText(result.toString()).width;
        const textHeight = parseInt(font, 10); // base 10
        const { x, y } = box;
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
        ctx.fillStyle = "#000000";
        ctx.fillText(result.toString(), x, y);
      }, 100);
    });
  };

  loadLabeledImages() {
    const labels = ["haris"];
    return Promise.all(
      labels.map(async label => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`/assets/img/${label}/${i}.jpg`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
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

  loadDetectFrame = (video, model) => {
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };
  detectFrame = (video, model) => {
    console.log("detect image");
    if (this.video == null || this.loadingState == 1) return;
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);

      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };
  async onDoubleClick(vID) {
    var pvTag = document.getElementById("def-video");
    var videTag = document.createElement("video");
    var sourceTag = document.createElement("source");
    var movieName = vID;
    var canvasTag = document.createElement("canvas");
    // source tag attribute
    sourceTag.setAttribute("src", movieName);
    sourceTag.setAttribute("type", "video/mp4");

    // canvas tag attribute
    canvasTag.setAttribute("_ngcontent-lfq-c1", "");
    canvasTag.setAttribute("id", "canvas");
    canvasTag.setAttribute("width", "640");
    canvasTag.setAttribute("height", "480");
    canvasTag.setAttribute("style", "position: relative; top:-480px");

    // video tag attribute
    videTag.setAttribute("_ngcontent-lfq-c1", "");
    videTag.setAttribute("autoplay", "true");
    videTag.setAttribute("loop", "true");
    videTag.setAttribute("width", "640");
    videTag.setAttribute("height", "480");
    videTag.setAttribute("id", "vid");
    videTag.appendChild(sourceTag);
    this.loadingState = 1;
    if (pvTag.childNodes.length != 0) {
      await pvTag.removeChild(pvTag.childNodes[1]);
      await pvTag.removeChild(pvTag.childNodes[0]);
    }
    await pvTag.appendChild(videTag);
    await pvTag.appendChild(canvasTag);
    await this.getVideoTag();
    const model = await cocoSSD.load("lite_mobilenet_v2");
    await this.loadDetectFrame(this.video, model);
  }

  getVideoTag() {
    this.video = <HTMLVideoElement>document.getElementById("vid");
  }

  detectSwitchState() {
    this.loadingState ^= 1;
  }

  renderPredictions = predictions => {
    console.log("renderpreditions: ");
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");

    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    if (this.video == null) return;
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
