import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-camera-list',
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.css']
})
export class CameraListComponent implements OnInit {

  streamingStatus = ["ON","OFF"]
  feedName = ["Drone 1",'Recorded 1',"Drone 2",'Connected 1',"Drone GPR 1",'Drone 3',"Drone 4",'Drone 5']

  camera_list = ['Camera 01','Camera 02','Camera 03','Camera 04','Camera 05','Camera 01','Camera 02','Camera 03','Camera 04','Camera 05'];

  SourceImage = ['drone2','server','drone2','server','drone','drone2','drone2','drone'];

  constructor() { }

  ngOnInit() {
  }

}
