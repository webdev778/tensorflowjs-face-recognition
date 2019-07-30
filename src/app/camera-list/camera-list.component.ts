import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-camera-list',
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.css']
})
export class CameraListComponent implements OnInit {

  camera_list = ['Camera 01','Camera 02','Camera 03','Camera 04','Camera 05'];
  constructor() { }

  ngOnInit() {
  }

}
