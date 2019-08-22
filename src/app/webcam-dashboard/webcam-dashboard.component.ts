import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";

import * as cocoSSD from "@tensorflow-models/coco-ssd";
import { User } from "../_models";
import { UserService } from "../_services";

import * as tf from "@tensorflow/tfjs";
import { DetectedObject } from "../object_detections";
import { DetectedFace } from "../face_detections";
import { faceRegister } from "../face_registry";
import { CustomerService } from "../customers/customer.service";
import { map } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import { FacedetectapiService } from "../facedetectapi.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

declare var faceapi: any;

const IMAGENET_CLASSES = {
  0: "AK47",
  1: "AR15_rifle",
  2: "Glock_9mm",
  3: "Humvee",
  4: "M4_rifle",
  5: "SigSauer_gun"
};

@Component({
  selector: "app-webcam-dashboard",
  templateUrl: "./webcam-dashboard.component.html",
  styleUrls: ["./webcam-dashboard.component.css"]
})
export class WebcamDashboardComponent implements OnInit {
  currentMode = 1;
  customers: any;
  timeNow: any;
  todayDate: any = new Date();

  // For the file uploading and kairo face detection
  fileToUpload: File = null;
  app_id: "55c1fb7b";
  app_key: "9df35162e820c9c7d6d99f234ce00144";

  // face_counter:number = 0;
  // todayDate = new Date();
  time =
    this.todayDate.getHours() +
    ":" +
    this.todayDate.getMinutes() +
    ":" +
    this.todayDate.getSeconds();

  // objectDetected1: DetectedObject = {
  //   objectDetected: "Person",
  //   timeFrame: 'Test'
  // };

  detected_faces: DetectedFace[] = [
    {
      firstName: "Target",
      lastName: "",
      photo: "./assets/img/placeholder1.jpg",
      gender: "Gender",
      dateOfBirth: "Date Of Birth",
      placeOfBirth: "Place of Birth",
      nationality: "Nationality",
      wantedStatus: 0,
      wantedBy: "Wanted by",
      charge: "Detecting..",
      timeStamp: "Time"
    },
    {
      firstName: "Target",
      lastName: "",
      photo: "./assets/img/placeholder1.jpg",
      gender: "Gender",
      dateOfBirth: "Date Of Birth",
      placeOfBirth: "Place of Birth",
      nationality: "Nationality",
      wantedStatus: 0,
      wantedBy: "Wanted by",
      charge: "Detecting..",
      timeStamp: "Time"
    },
    {
      firstName: "Target",
      lastName: "",
      photo: "./assets/img/placeholder1.jpg",
      gender: "Gender",
      dateOfBirth: "Date Of Birth",
      placeOfBirth: "Place of Birth",
      nationality: "Nationality",
      wantedStatus: 0,
      wantedBy: "Wanted by",
      charge: "Detecting..",
      timeStamp: "Time"
    },
    {
      firstName: "Target",
      lastName: "",
      photo: "./assets/img/placeholder1.jpg",
      gender: "Gender",
      dateOfBirth: "Date Of Birth",
      placeOfBirth: "Place of Birth",
      nationality: "Nationality",
      wantedStatus: 0,
      wantedBy: "Wanted by",
      charge: "Detecting..",
      timeStamp: "Time"
    }
  ];

  detected_objects: DetectedObject[] = [
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: "TimeStamp"
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    },
    {
      objectDetected: "Target",
      confidence: 0,
      timeFrame: this.time
    }
  ];

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
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    pob: "",
    nationality: "",
    wanted_by: "",
    charge: ""
  };
  photo: string = "./assets/img/placeholder1.jpg";
  private canvas: HTMLCanvasElement;
  interval: number = 0;
  labeledFaceDescriptors: any;
  faceMatcher: any;
  objectModel: any;
  weaponModel: any;
  tensor: any;

  constructor(
    private userService: UserService,
    private customerService: CustomerService,
    private http: HttpClient,
    private facedectapiservice: FacedetectapiService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.video_url = "";
  }
  ngOnInit() {
    this.webcam_init();
    this.predictWithCocoModel();
    this.predictWithWeaponModel();
    // this.loadAllUsers();
    this.trackFaceAndRecognize();
    // this.getCustomersList();
  }

  preprocessImage(image, modelName) {
    let tensor = tf
      .fromPixels(image)
      .resizeNearestNeighbor([128, 128])
      .toFloat(); //.sub(meanImageNetRGB)

    if (modelName == undefined) {
      return tensor.expandDims();
    } else if (modelName == "vgg") {
      let meanImageNetRGB = tf.tensor1d([123.68, 116.779, 103.939]);
      return tensor
        .sub(meanImageNetRGB)
        .reverse(2) // using the conventions from vgg16 documentation
        .expandDims();
      console.log("inside the vgg preProcessing:");
    } else if (modelName == "mobilenet") {
      let offset = tf.scalar(127.5);
      return tensor
        .sub(offset)
        .div(offset)
        .expandDims();
    } else if (modelName == "olga") {
      let offset = tf.scalar(127.5);
      return tensor //.resizeNearestNeighbor([128, 128])
        .mean(2)
        .toFloat()
        .expandDims(0)
        .expandDims(-1);
    } else {
      throw new Error("UnKnown Model error");
    }
  }

  public async trackFaceAndRecognize() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/assets/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/assets/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/assets/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/assets/models"),
      // faceapi.nets.mtcnn.loadFromUri('/assets/models')
      faceapi.nets.faceExpressionNet.loadFromUri("/assets/models")
    ]);
    console.log("faceapi all model loaded");

    this.labeledFaceDescriptors = await this.loadLabeledImages();
    console.log("all pattern loaded");

    const maxDescriptorDistance = 0.6;
    this.faceMatcher = new faceapi.FaceMatcher(
      this.labeledFaceDescriptors,
      maxDescriptorDistance
    );

    setInterval(() => {
      if (this.detectionMode === 1) this.detectFace(this.video);
    }, 100);
  }

  getFields(input, field) {
    var output = [];
    for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
    return output;
  }

  detectFace = async video => {
    console.log("detecting Face...");

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    const displaySize = { width: 640, height: 480 };

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    this.canvas
      .getContext("2d")
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    faceapi.draw.drawDetections(this.canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections)

    // find
    if (this.interval % 5 == 2) {
      const results = resizedDetections.map(d =>
        this.faceMatcher.findBestMatch(d.descriptor)
      );
      this.renderFaces(this.canvas, resizedDetections, results);
      this.interval = 0;

      //find details from database
      results.forEach((result, i) => {
        if (result.distance > 0.3) this.findDetail(result.toString());
      });

      /*
      console.log(results.length);
      if(results.length > 0)
        this.getCustomersList(results[0].label)
        */
    }
    this.interval++;
  };

  getCustomersList(query: string) {
    this.customerService
      .getQueryList(query)
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(customers => {
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
    });
  };

  findDetail(firstName: string) {
    let param = firstName.split(" ")[0];
    let detail = faceRegister.find(item => item.key === param);
    // this.detected_faces.splice(0, 3);
    var face_counter;

    if (detail) {
      this.detail = detail;
      var detail_first_name = this.detail.first_name;
      console.log("-------------Detail-------------");
      console.log(detail_first_name);
      this.photo = `/assets/img/${param}/1.jpg`;
      var last_element = this.detected_faces[this.detected_faces.length - 1];
      console.log("------------------last element------------------");
      console.log(last_element.firstName);

      // last_element.firstName !== detail_first_name && this.face_counter ! == 0

      if (face_counter == 0) {
        console.log("-----------------in the check------------------------");
        this.detected_faces.push({
          firstName: this.detail.first_name,
          lastName: this.detail.last_name,
          photo: this.photo,
          gender: this.detail.gender,
          dateOfBirth: this.detail.dob,
          placeOfBirth: this.detail.pob,
          nationality: this.detail.nationality,
          wantedStatus: this.detail.wanted_status,
          wantedBy: this.detail.wanted_by,
          charge: this.detail.charge,
          timeStamp: this.time
        });
        face_counter++;
      } else if (last_element.firstName !== detail_first_name) {
        this.detected_faces.push({
          firstName: this.detail.first_name,
          lastName: this.detail.last_name,
          photo: this.photo,
          gender: this.detail.gender,
          dateOfBirth: this.detail.dob,
          placeOfBirth: this.detail.pob,
          nationality: this.detail.nationality,
          wantedStatus: this.detail.wanted_status,
          wantedBy: this.detail.wanted_by,
          charge: this.detail.charge,
          timeStamp: this.time
        });
        face_counter++;
      }
    } else {
      //this.detail = {};
    }
    if (face_counter == 0) {
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

    console.log("find detail executed");
  }

  loadLabeledImages = () => {
    let labels = ["geibi", "ramadan", "qader", "alkhazarji", "carl",
                    "robles","utsumieva", "marwan", "alvarez", "duongtran",
                    "george", "oprah", "salah", "ronaldo", "trump", "kardashian"];

    console.log(labels);
    return Promise.all(
      labels.map(async label => {
        const descriptions = [];
        for (let i = 1; i <= 8; i++) {
          try {
            const img = await faceapi.fetchImage(
              `/assets/img/${label}/${i}.jpg`
            );
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
  };

  public async predictWithWeaponModel() {
    // // For COCO SDD Models
    // this.weaponModel = await cocoSSD.load("lite_mobilenet_v2");
    // Weapons model
    this.weaponModel = await tf.loadModel("./assets/models/olga/model.json");
    // this.tensor = this.preprocessImage(this.video,'olganet');
    console.log("weapons model loaded");
    // this.detectFrameForWeapon(this.video, this.weaponModel);
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

  webcam_init() {
    this.video = <HTMLVideoElement>document.getElementById("vidwebcam");
    this.canvas = <HTMLCanvasElement>document.getElementById("canvaswebcam");
    const displaySize = { width: 640, height: 480 };
    faceapi.matchDimensions(this.canvas, displaySize);

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
    //console.log("loadDetectFrame");
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.loadDetectFrame(video, model);
      });
    });
  };

  detectFrameForWeapon = (video, model) => {
    console.log("detectFrameForWeapon:");
    this.tensor = this.preprocessImage(this.video, "olga");
    let tensor = this.tensor;
    model
      .predict(tensor)
      .data()
      .then(predictions => {
        // console.log(prediction);
        let top5 = Array.from(predictions)
          .map(function(p, i) {
            return {
              score: p,
              class: IMAGENET_CLASSES[i]
            };
          })
          .sort(function(a: any, b: any) {
            return b.score - a.score;
          })
          .slice(0, 5);
        console.log(top5);

        const prediction: any = top5[0];

        const temp = this.detected_objects.findIndex(
          (item: any) => item.objectDetected === prediction.class
        );
        console.log("TEMP");
        console.log(temp);
        var today = new Date();
        var time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        if (temp === -1) {
          this.detected_objects.push({
            objectDetected: prediction.class,
            confidence: Math.round(prediction.score * 100),
            timeFrame: time
          });
        } else {
          this.detected_objects.splice(temp, 1);

          this.detected_objects.push({
            objectDetected: prediction.class,
            confidence: Math.round(prediction.score * 100),
            timeFrame: time
          });
        }

        // this.detected_objects = this.detected_objects.reduce((acc, current) => {
        //   const x = acc.find(item => item.objectDetected === current.objectDetected);
        //   if (!x) {
        //     return acc.concat([current]);
        //   } else {
        //     return acc;
        //   }
        // }, []);

        if (this.detected_objects.length > 20) {
          this.detected_objects.splice(0, this.detected_objects.length - 20);
        }

        console.log("detectFrameForWeapon executed");
        requestAnimationFrame(() => {
          if (this.detectionMode !== 2) return;
          setTimeout(() => {
            this.detectFrameForWeapon(video, model);
          }, 300);
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
        var time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        this.detected_objects.push({
          objectDetected: prediction.class,
          confidence: Math.round(prediction.score * 100),
          timeFrame: time
        });
      });

      this.detected_objects = this.detected_objects.reduce((acc, current) => {
        const x = acc.find(
          item => item.objectDetected === current.objectDetected
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      if (this.detected_objects.length > 20) {
        this.detected_objects.splice(0, this.detected_objects.length - 20);
      }

      requestAnimationFrame(() => {
        if (this.detectionMode !== 3) return;
        this.detectFrame(video, model);
      });
      console.log(predictions);
    });
  };

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
    this.predictionsStatus = false;
    this.webFeedStatus = false;
    this.detectionMode = 1;
    this.isVisible = 1;
    this.webcamPrediction = null;
    this.detectFace(this.video);
  }

  objectStatus: boolean = true;
  public onObjectButton() {
    console.log("model button clicked");
    this.faceStatus = false;
    this.objectStatus = true;
    this.weaponStatus = false;
    this.emotionsStatus = false;
    this.predictionsStatus = false;
    this.webFeedStatus = false;
    this.detectionMode = 3;
    this.isVisible = 1;
    this.webcamPrediction = null;
    this.detectFrame(this.video, this.objectModel);
  }

  weaponStatus: boolean = false;
  public onWeaponsButton() {
    console.log("model button clicked");
    this.faceStatus = false;
    this.objectStatus = false;
    this.weaponStatus = true;
    this.emotionsStatus = false;
    this.predictionsStatus = false;
    this.webFeedStatus = false;
    this.detectionMode = 2;
    this.isVisible = 1;
    this.webcamPrediction = null;
    this.canvas
      .getContext("2d")
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.detectFrameForWeapon(this.video, this.weaponModel);
  }

  emotionsStatus: boolean = false;
  public onEmotionsButton() {
    console.log("model button clicked");
    this.faceStatus = false;
    this.objectStatus = false;
    this.weaponStatus = false;
    this.emotionsStatus = true;
    this.predictionsStatus = false;
    this.webFeedStatus = false;
    this.detectionMode = 3;
    this.isVisible = 1;
    this.webcamPrediction = null;
    this.detectFrame(this.video, this.objectModel);
  }

  predictionsStatus: boolean = false;
  isVisible = 1;
  public onPredictionsButton() {
    console.log("prediction button clicked");
    this.faceStatus = false;
    this.objectStatus = false;
    this.weaponStatus = false;
    this.emotionsStatus = false;
    this.predictionsStatus = true;
    this.webFeedStatus = false;
    this.detectionMode = 5;
    this.isVisible = 0;
    this.webcamPrediction = null;
    this.detectFrame(this.video, this.objectModel);
  }

  webcamPrediction: string = null;
  webFeedStatus: boolean = false;
  complete_name = [];
  public onWebFeedButton() {
    console.log("web feed button clicked");
    this.faceStatus = false;
    this.objectStatus = false;
    this.weaponStatus = false;
    this.emotionsStatus = false;
    this.predictionsStatus = false;
    this.webFeedStatus = true;
    this.detectionMode = 3;
    this.isVisible = 1;

    //for getting image from the canvas

    console.log("check web image running");
    var canvas = document.createElement("canvas");
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(this.video, 0, 0, canvas.width, canvas.height);
    var imgData = canvas.toDataURL("image/jpeg");

    // Below two lines are used to see the image taken from the webcam in a new page
    // var w = window.open("about:blank", "image from canvas");
    // w.document.write("<img src='" + imgData + "' alt='from canvas'/>");

    var criminal_to_detect = {
      image: imgData,
      gallery_name: "criminals"
    };

    // uncomment below lines once everything is fine

    this.facedectapiservice
      .recognizeImage(criminal_to_detect)
      .subscribe(reponse => {
        this.webcamPrediction = reponse.images[0].transaction.subject_id;
        console.log("The predicted criminal is " + this.webcamPrediction);

        this.complete_name = this.getFirstandLastName(this.webcamPrediction);
        this.detected_faces.push({
          firstName: this.complete_name[0],
          lastName: this.complete_name[1],
          photo: "./assets/img/placeholder1.jpg",
          gender: "Gender",
          dateOfBirth: "Date Of Birth",
          placeOfBirth: "Place of Birth",
          nationality: "Nationality",
          wantedStatus: 0,
          wantedBy: "Wanted by",
          charge: "Detecting..",
          timeStamp: "Time"
        });
      });

    // uncomment above line if everything works

    // } while (this.webFeedStatus == true);
    console.log("exiting");
  }

  // Function for sleep

  // For the handling of files
  selectedFile = null;
  tcode: string = null;
  enroll_image_url: string = null;
  predict_image_url: string = null;
  predicted_criminal: string = null;
  full_name = [];
  image = null;
  subject_id = null;
  gallery_name = "criminals";

  new_criminal = null;

  detect_criminal = null;

  public fileEvent(event) {
    this.selectedFile = <File>event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = _event => {
      var imgURL = reader.result;
      this.selectedFile = imgURL;
    };

    // this.detected_faces.push({
    //   firstName: "Bhuwan",
    //   lastName: "Bhatt",
    //   photo: "./assets/img/placeholder1.jpg",
    //   gender: "Gender",
    //   dateOfBirth: "Date Of Birth",
    //   placeOfBirth: "Place of Birth",
    //   nationality: "Nationality",
    //   wantedStatus: 0,
    //   wantedBy: "Wanted by",
    //   charge: "Detecting..",
    //   timeStamp: "Time"
    // });
  }

  // Variables for sending to the api

  public onUpload() {
    console.log("the code :" + this.tcode);
    console.log("Enroll image url :" + this.enroll_image_url);
    console.log(this.selectedFile);

    this.image = this.selectedFile;
    this.subject_id = this.tcode;

    if (this.enroll_image_url == null) {
      this.new_criminal = {
        image: this.selectedFile,
        subject_id: this.subject_id,
        gallery_name: this.gallery_name
      };
    } else {
      this.new_criminal = {
        image: this.enroll_image_url,
        subject_id: this.subject_id,
        gallery_name: this.gallery_name
      };
    }

    // Enroll image using the api
    this.facedectapiservice
      .enrollImage(this.new_criminal)
      .subscribe(reponse => {
        console.log("the code :" + reponse);
        console.log(this.new_criminal);
      });

    console.log(this.selectedFile);
  }

  public onPredict() {
    this.predicted_criminal = null;
    console.log("for predition");
    console.log("the image url for prediction :" + this.predict_image_url);

    if (this.predict_image_url == null) {
      this.detect_criminal = {
        image: this.selectedFile,
        gallery_name: this.gallery_name
      };
    } else {
      this.detect_criminal = {
        image: this.predict_image_url,
        gallery_name: this.gallery_name
      };
    }

    this.facedectapiservice
      .recognizeImage(this.detect_criminal)
      .subscribe(reponse => {
        this.predicted_criminal = reponse.images[0].transaction.subject_id;

        this.full_name = this.getFirstandLastName(this.predicted_criminal);
        this.detected_faces.push({
          firstName: this.full_name[0],
          lastName: this.full_name[1],
          photo: "./assets/img/placeholder1.jpg",
          gender: "Gender",
          dateOfBirth: "Date Of Birth",
          placeOfBirth: "Place of Birth",
          nationality: "Nationality",
          wantedStatus: 0,
          wantedBy: "Wanted by",
          charge: "Detecting..",
          timeStamp: "Time"
        });
      });
  }

  public getFirstandLastName(fullname) {
    var splitted_criminal_name = fullname.split(" ");
    console.log("The splitted names are : " + splitted_criminal_name);
    var first_name = splitted_criminal_name[0];
    var last_name = "";
    var i = 0;
    for (i = 1; i < splitted_criminal_name.length; i++) {
      last_name += splitted_criminal_name[i] + " ";
    }

    console.log("Firstname and lastnames are :" + first_name + last_name);

    return [first_name, last_name];
  }

  public wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }
}
