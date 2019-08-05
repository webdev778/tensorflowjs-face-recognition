import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import * as cocoSSD from "@tensorflow-models/coco-ssd";
import { User } from "../_models";
import { UserService } from "../_services";

import * as tf from '@tensorflow/tfjs';
import { DetectedObject } from '../object_detections';
import { DetectedFace } from '../face_detections';
import { faceRegister } from '../face_registry';
import { CustomerService } from '../customers/customer.service';
import { map } from 'rxjs/operators';

declare var faceapi: any;
declare var localFileVideoPlayer:any;

@Component({
  selector: 'app-recorded-source',
  templateUrl: './recorded-source.component.html',
  styleUrls: ['./recorded-source.component.css']
})
export class RecordedSourceComponent implements OnInit {
  currentMode = 3;
  customers: any;
  timeNow: any;
  todayDate: any= new Date();
  face_counter:number = 0;
  // todayDate = new Date();
  time = this.todayDate.getHours() + ":" + this.todayDate.getMinutes() + ":" + this.todayDate.getSeconds();

  // objectDetected1: DetectedObject = {
  //   objectDetected: "Person",
  //   timeFrame: 'Test'
  // };

  detected_faces:DetectedFace[]=[{firstName: 'Target',
    lastName:'',
    photo:'./assets/img/placeholder1.jpg',
    gender:'Gender',
    dateOfBirth:'Date Of Birth',
    placeOfBirth:'Place of Birth',
    nationality:'Nationality',
    wantedStatus:0,
    wantedBy:'Wanted by',
    charge:'Detecting..',
    timeStamp:'Time'},{firstName: 'Target',
    lastName:'',
    photo:'./assets/img/placeholder1.jpg',
    gender:'Gender',
    dateOfBirth:'Date Of Birth',
    placeOfBirth:'Place of Birth',
    nationality:'Nationality',
    wantedStatus:0,
    wantedBy:'Wanted by',
    charge:'Detecting..',
    timeStamp:'Time'},{firstName: 'Target',
    lastName:'',
    photo:'./assets/img/placeholder1.jpg',
    gender:'Gender',
    dateOfBirth:'Date Of Birth',
    placeOfBirth:'Place of Birth',
    nationality:'Nationality',
    wantedStatus:0,
    wantedBy:'Wanted by',
    charge:'Detecting..',
    timeStamp:'Time'},{firstName: 'Target',
    lastName:'',
    photo:'./assets/img/placeholder1.jpg',
    gender:'Gender',
    dateOfBirth:'Date Of Birth',
    placeOfBirth:'Place of Birth',
    nationality:'Nationality',
    wantedStatus:0,
    wantedBy:'Wanted by',
    charge:'Detecting..',
    timeStamp:'Time'}];

  detected_objects: DetectedObject[] = [{
    objectDetected: "Target",
    confidence:0,
    timeFrame: "TimeStamp"
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  },{
    objectDetected: "Target",
    confidence:0,
    timeFrame: this.time
  }]

  // detected_objects:DetectedObject[] = []

  // title = "TF-ObjectDetection";
  private video: HTMLVideoElement;
  public video_url: string;
  currentUser: User;
  users: User[] = [];
  object_detections = [];
  public convertState: number = 0;
  detectionMode: number = 3; // 1: Face, 2: Vehicle, 3: Object, 4: Emotions
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
  photo: string = "./assets/img/placeholder1.jpg";
  private canvas: HTMLCanvasElement;
  interval: number = 0;
  labeledFaceDescriptors: any;
  faceMatcher: any;
  objectModel: any;


  constructor(private userService: UserService, private customerService: CustomerService) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.video_url = "";
  }
  ngOnInit() {
    localFileVideoPlayer();
    this.webcam_init();
    this.predictWithCocoModel();
    // this.loadAllUsers();
    this.trackFaceAndRecognize();
    // this.getCustomersList();
  }

  public async trackFaceAndRecognize() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models'),
      // faceapi.nets.mtcnn.loadFromUri('/assets/models')
      faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
    ]);
    console.log("faceapi all model loaded");

    this.labeledFaceDescriptors = await this.loadLabeledImages();
    console.log('all pattern loaded');

    const maxDescriptorDistance = 0.6
    this.faceMatcher = new faceapi.FaceMatcher(this.labeledFaceDescriptors, maxDescriptorDistance);

    setInterval(() => {
      if (this.detectionMode === 1)
        this.detectFace(this.video)
    }, 100);
  }

  detectFace = async (video) => {
    console.log('detecting Face...')

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
    const displaySize = { width: 640, height: 480 };

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    faceapi.draw.drawDetections(this.canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections)

    // find
    if (this.interval % 5 == 2) {
      const results = resizedDetections.map(d => this.faceMatcher.findBestMatch(d.descriptor));
      this.renderFaces(this.canvas, resizedDetections, results);
      this.interval = 0;

      //find details from database
      results.forEach((result, i) => {
        if(result.distance > 0.3)
        this.findDetail(result.toString())
      });

      /*
      console.log(results.length);
      if(results.length > 0)
        this.getCustomersList(results[0].label)
        */
    }
    this.interval ++;
  }

  getCustomersList(query: string) {
    this.customerService.getQueryList(query).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(customers => {
      this.customers = customers;
    });
  }

  renderFaces = (canvas, resizedDetections, results) => {
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      // const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      // drawBox.draw(canvas)
      // console.log(result.distance);
      if (result.label === "unknown") return;

      const ctx = canvas.getContext("2d");
      // Font options.
      const font = "16px sans-serif";
      ctx.font = font;
      ctx.textBaseline = "top";
      // Draw the rectangle of rect
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 5;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      // Draw the label background.
      ctx.fillStyle = "#FF0000";
      const textWidth = ctx.measureText(result.toString()).width;
      const textHeight = parseInt(font, 10); // base 10
      const { x, y } = box;
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      ctx.fillStyle = "#000000";
      ctx.fillText(result.toString(), x, y);
    })
  }

  findDetail(firstName: string) {

    let param = firstName.split(" ")[0];
    let detail = faceRegister.find(item => (item.key === param));
    // this.detected_faces.splice(0, 3);
    var face_counter;
    
    if (detail) {
      this.detail = detail;
      var detail_first_name = this.detail.first_name
      console.log('-------------Detail-------------')
      console.log(detail_first_name)
      this.photo = `/assets/img/${param}/1.jpg`;
      var last_element = this.detected_faces[this.detected_faces.length - 1];
      console.log('------------------last element------------------')
      console.log(last_element.firstName)

      // last_element.firstName !== detail_first_name && this.face_counter ! == 0

      if (face_counter == 0){

        console.log('-----------------in the check------------------------')
        this.detected_faces.push({firstName: this.detail.first_name,
          lastName:this.detail.last_name,
          photo:this.photo,
          gender:this.detail.gender,
          dateOfBirth:this.detail.dob,
          placeOfBirth:this.detail.pob,
          nationality:this.detail.nationality,
          wantedStatus:this.detail.wanted_status,
          wantedBy:this.detail.wanted_by,
          charge:this.detail.charge,
          timeStamp:this.time});
          face_counter ++;
      }else if (last_element.firstName !== detail_first_name){
        this.detected_faces.push({firstName: this.detail.first_name,
          lastName:this.detail.last_name,
          photo:this.photo,
          gender:this.detail.gender,
          dateOfBirth:this.detail.dob,
          placeOfBirth:this.detail.pob,
          nationality:this.detail.nationality,
          wantedStatus:this.detail.wanted_status,
          wantedBy:this.detail.wanted_by,
          charge:this.detail.charge,
          timeStamp:this.time});
          face_counter ++;
      }
      
    } else {
      //this.detail = {};
    }
    if (face_counter == 0)
      {
        this.detected_faces.splice(0, 3);
      }

      // this.detected_faces = this.detected_faces.reduce((acc, current) => {
      //   const x = acc.find(item => item.firstName === current.firstName);
      //   if (!x) {
      //     return acc.concat([current]);
      //   } else {
      //     return acc;
      //   }
      // }, []);

    console.log('find detail executed')
  }

  loadLabeledImages = () => {
    const labels = ['geibi', 'ramadan','qader','alkhazarji','carl'];
    return Promise.all(
      labels.map(async label => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          try {
            const img = await faceapi.fetchImage(`/assets/img/${label}/${i}.jpg`);
            const detections = await faceapi
              // .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (detections) descriptions.push(detections.descriptor);
          } catch (e) {
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
    this.objectModel = await cocoSSD.load("lite_mobilenet_v2");
    // Weapons model
    // this.objectModel = await tf.loadModel('./assets/models/tfjs_weapons/model.json');
    console.log("weapons model loaded");
    this.detectFrame(this.video, this.objectModel);
    // setInterval(() => {
    //   if(this.detectionMode === 3)
    //     this.detectFrame(this.video, model);
    // }, 200);
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
    this.video = <HTMLVideoElement>document.getElementById("vidrecord");
    this.canvas = <HTMLCanvasElement>document.getElementById("canvasrecord");
    const displaySize = { width: 640, height: 480 };
    faceapi.matchDimensions(this.canvas, displaySize);
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
    console.log("detectFrame :");
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);

      predictions.forEach(prediction => {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.detected_objects.push({
          objectDetected: prediction.class,
          confidence:Math.round(prediction.score*100),
          timeFrame: time
        });
      });

      this.detected_objects = this.detected_objects.reduce((acc, current) => {
        const x = acc.find(item => item.objectDetected === current.objectDetected);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);


      if (this.detected_objects.length >20)
      {
        this.detected_objects.splice(0, this.detected_objects.length-20);
      }

      requestAnimationFrame(() => {
        if (this.detectionMode !== 3) return;
        this.detectFrame(video, model);
      });
      console.log(predictions);
    });
    // this.detected_objects.reverse();
  };
  // async onDoubleClick(vID) {
  //   var pvTag = document.getElementById("def-video");
  //   var videTag = document.createElement("video");
  //   var sourceTag = document.createElement("source");
  //   var movieName = vID;
  //   var canvasTag = document.createElement("canvas");
  //   // source tag attribute
  //   sourceTag.setAttribute("src", movieName);
  //   sourceTag.setAttribute("type", "video/mp4");

  //   // canvas tag attribute
  //   canvasTag.setAttribute("_ngcontent-lfq-c1", "");
  //   canvasTag.setAttribute("id", "canvas");
  //   canvasTag.setAttribute("width", "640");
  //   canvasTag.setAttribute("height", "480");
  //   canvasTag.setAttribute("style", "position: relative; top:-480px");
  //   // video tag attribute
  //   videTag.setAttribute("autoplay", "true");
  //   videTag.setAttribute("loop", "true");
  //   videTag.setAttribute("width", "640");
  //   videTag.setAttribute("height", "480");
  //   videTag.setAttribute("id", "vid");
  //   videTag.appendChild(sourceTag);
  //   this.convertState = 1;
  //   if (pvTag.childNodes.length != 0) {
  //     await pvTag.removeChild(pvTag.childNodes[1]);
  //     await pvTag.removeChild(pvTag.childNodes[0]);
  //   }

  //   await pvTag.appendChild(videTag);
  //   await pvTag.appendChild(canvasTag);
  //   await this.getVideoTag();
  //   const model = await cocoSSD.load("lite_mobilenet_v2");
  //   await this.loadDetectFrame(this.video, model);
  // }
  // getVideoTag() {
  //   this.video = <HTMLVideoElement>document.getElementById("vid");
  // }

  renderPredictions = predictions => {
    //console.log("renderpredictions : ");

    const ctx = this.canvas.getContext("2d");

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    // ctx.drawImage(this.video, 0, 0, 640, 480);

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

  faceStatus: boolean = false;
  public onFaceButton() {
    console.log("model button clicked");
    this.faceStatus = true;
    this.objectStatus = false;
    this.weaponStatus = false;
    this.emotionsStatus = false;
    this.detectionMode = 1;
    this.detectFace(this.video)
  }

  objectStatus: boolean = true;
  public onObjectButton() {
    console.log("model button clicked");
    this.faceStatus = false;
    this.objectStatus = true;
    this.weaponStatus = false;
    this.emotionsStatus = false;
    this.detectionMode = 3;
    this.detectFrame(this.video, this.objectModel);
  }

  weaponStatus:boolean = false;
  public onWeaponsButton() {
    console.log("model button clicked");
    this.faceStatus = false;
    this.objectStatus = false;
    this.weaponStatus = true;
    this.emotionsStatus = false;
    this.detectionMode = 3;
    this.detectFrame(this.video, this.objectModel);
  }

  emotionsStatus:boolean = false;
  public onEmotionsButton() {
    console.log("model button clicked");
    this.faceStatus = false;
    this.objectStatus = false;
    this.weaponStatus = false;
    this.emotionsStatus = true;
    this.detectionMode = 3;
    this.detectFrame(this.video, this.objectModel);
  }
}
