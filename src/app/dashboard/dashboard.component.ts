import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import * as cocoSSD from "@tensorflow-models/coco-ssd";
import { User } from "../_models";
import { UserService } from "../_services";

import * as tf from '@tensorflow/tfjs';

declare var faceapi: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  // title = "TF-ObjectDetection";
  private video: HTMLVideoElement;
  public video_url: string;
  currentUser: User;
  users: User[] = [];
  public convertState: number = 0;
  detectionMode: number = 1; // 1: Face, 2: Vehicle, 3: Object, 4: Emotions
  detail: any = {
    "first_name": "",
    "last_name": "",
    "gender": "",
    "dob": "",
    "pob": "",
    "nationality": "",
    "wanted_by": "",
    "charge": ""
  };
  photo: string = "./assets/img/placeholder.jpg";


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

  detectFace = async video => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const displaySize = { width: 640, height: 480 };
    faceapi.matchDimensions(canvas, displaySize);
    const labeledFaceDescriptors = await this.loadLabeledImages();
    console.log('all pattern loaded');
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    setInterval(async () => {
      if (this.detectionMode !== 1) return;
      // const labeledFaceDescriptors = await this.loadLabeledImages()
      // const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
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

        //find details from database
        this.findDetail(result.toString())
      }, 100);
    });
  };

  findDetail(firstName: string) {
    const wantedList = [
      {
        "key": "geibi",
        "first_name": "GEIBI",
        "last_name": "KASSIM",
        "gender": "male",
        "dob": "1966-07-01",
        "pob": "Nagaf, Iraq",
        "nationality": "Iraq",
        "wanted_by": "Belgium",
        "charge": ""
      },
      {
        "key": "ramadan",
        "first_name": "RAMADAN",
        "last_name": "RAMADAN TAHER",
        "gender": "male",
        "dob": "1987-08-26",
        "pob": "Shikhan, Iraq",
        "nationality": "Iraq",
        "wanted_by": "Sweden",
        "charge": ""
      },
      {
        "key": "qader",
        "first_name": "QADER",
        "last_name": "GARMIAN",
        "gender": "male",
        "dob": "1997-08-27",
        "pob": "Nagaf, Iraq",
        "nationality": "Iraq",
        "wanted_by": "Sweden",
        "charge": ""
      },
      {
        "key": "alaswadi",
        "first_name": "ALASWADI",
        "last_name": "AHMAD",
        "gender": "male",
        "dob": "1985",
        "pob": "Iraq",
        "nationality": "Iraq",
        "wanted_by": "Iraq",
        "charge": ""
      }]
      let param = firstName.split(" ")[0];
      let detail = wantedList.find(item => (item.key === param))
      console.log('param:', param);
      console.log('detail:', detail);
      if(detail){
        console.log('detail', detail);
        this.detail = detail;
        this.photo = `/assets/img/${param}/1.jpg`;
      }else{
        //this.detail = {};
      }
      console.log('find detail executed')
  }

  loadLabeledImages() {
    const labels = [
      // "alejandro",
      // "alexis",
      // "bhadreshkumar",
      // "haris",
      // "rafael",
      // "robert",
      // "santiago",
      // "yaser",
      // iraqi wanted list,
      "geibi",
      "ramadan",
      "qader",
      "alaswadi"
    ];
    return Promise.all(
      labels.map(async label => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          try{
            const img = await faceapi.fetchImage(`/assets/img/${label}/${i}.jpg`);
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (detections) descriptions.push(detections.descriptor);
          }catch(e){
            //console.log(e);
            continue;
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }

  public async predictWithCocoModel() {
    // For COCO SDD Models
    // const model = await cocoSSD.load("lite_mobilenet_v2");
    const model = await tf.loadModel('/assets/model.json');
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
    this.video = <HTMLVideoElement>document.getElementById("remotevideo");

    // navigator.mediaDevices
    //   .getUserMedia({
    //     audio: false,
    //     video: {
    //       facingMode: "user"
    //     }
    //   })
    //   .then(stream => {
    //     this.video.srcObject = stream;
    //     this.video.onloadedmetadata = () => {
    //       this.video.play();
    //     };
    //   });
  }

  loadDetectFrame = (video, model) => {
    //console.log("loadDetectFrame");
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.loadDetectFrame(video, model);
      });
    });
  };

  detectFrame = (video, model) => {
    if (this.video == null || this.convertState == 1) return;
    //console.log("detectFrame :");
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
    videTag.setAttribute("autoplay", "true");
    videTag.setAttribute("loop", "true");
    videTag.setAttribute("width", "640");
    videTag.setAttribute("height", "480");
    videTag.setAttribute("id", "vid");
    videTag.appendChild(sourceTag);
    this.convertState = 1;
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

  renderPredictions = predictions => {
    //console.log("renderpredictions : ");

    if (this.detectionMode !== 3) return;
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

  public onFaceButton() {
    console.log("model button clicked");
    this.detectionMode = 1;
  }

  public onObjectButton() {
    console.log("model button clicked");
    this.detectionMode = 3;
  }
}
