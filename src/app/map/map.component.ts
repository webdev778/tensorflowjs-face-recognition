import { Component, OnInit } from '@angular/core';

// import { ViewChild } from '@angular/core';
// import {} from 'googlemaps';

// import OlMap from 'ol/Map';
// import OlXYZ from 'ol/source/XYZ';
// import OlTileLayer from 'ol/layer/Tile';
// import OlView from 'ol/View';

// import { fromLonLat } from 'ol/proj';

declare var ol: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  latitude: number = 18.5204;
  longitude: number = 73.8567;

  map: any;

  ngOnInit() {
    var mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: 'EPSG:4326',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });


    this.map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false
        }
      }).extend([mousePositionControl]),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([44.3614,33.3128]),
        zoom: 8
      })
    });

    this.map.on('click', function (args) {
      console.log(args.coordinate);
      var lonlat = ol.proj.transform(args.coordinate, 'EPSG:3857', 'EPSG:4326');
      console.log(lonlat);

      var lon = lonlat[0];
      var lat = lonlat[1];
      alert(`lat: ${lat} long: ${lon}`);
    });
  }

  setCenter() {
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.setZoom(8);
  }
}

  // map: OlMap;
  // source: OlXYZ;
  // layer: OlTileLayer;
  // view: OlView;

  // ngOnInit() {
  //   this.source = new OlXYZ({
  //     url: 'http://tile.osm.org/{z}/{x}/{y}.png'
  //   });

  //   this.layer = new OlTileLayer({
  //     source: this.source
  //   });

  //   this.view = new OlView({
  //     center: fromLonLat([55.27,25.20]),
  //     zoom: 3
  //   });

  //   this.map = new OlMap({
  //     target: 'map',
  //     layers: [this.layer],
  //     view: this.view
  //   });
  // }

//   @ViewChild('gmap',{ read: true, static: false }) gmapElement: any;
//   map: google.maps.Map

//   ngOnInit(): void {
//     const mapProperties = {
//          center: new google.maps.LatLng(35.2271, -80.8431),
//          zoom: 15,
//          mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//     this.map = new google.maps.Map(this.gmapElement.nativeElement,mapProperties);
//  }
// }
