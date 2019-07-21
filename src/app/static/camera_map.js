// create a layer with the OSM source
var layer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// create an interaction to add to the map that isn't there by default
var interaction = new ol.interaction.DragRotateAndZoom();

// create a control to add to the map that isn't there by default
var control = new ol.control.FullScreen();

// center on london, transforming to map projection
var center = ol.proj.fromLonLat([55.27,25.20]);
// var center = ol.proj.transform([-1.812, 52.443], 'EPSG:4326', 'EPSG:3857');

// an overlay to position at the center
var overlay = new ol.Overlay({
    position: center,
    element: document.getElementById('overlay')
});

// view, starting at the center
var view = new ol.View({
    center: center,
    zoom: 6
});

// finally, the map with our custom interactions, controls and overlays
var map = new ol.Map({
    target: 'map',
    layers: [layer],
    interactions: [interaction],
    controls: [control],
    overlays: [overlay],
    view: view
});



// var map = new ol.Map({
//     target: 'map',
//     layers: [
//       new ol.layer.Tile({
//         source: new ol.source.OSM()
//       })
//     ],
//     view: new ol.View({
//       center: ol.proj.fromLonLat([37.41, 8.82]),
//       zoom: 4
//     })
//   });


// import Feature from 'ol/Feature.js';
// import Geolocation from 'ol/Geolocation.js';
// import Map from 'ol/Map.js';
// import View from 'ol/View.js';
// import Point from 'ol/geom/Point.js';

// import {
//     Tile as TileLayer,
//     Vector as VectorLayer
// } from 'ol/layer.js';
// import {
//     OSM,
//     Vector as VectorSource
// } from 'ol/source.js';
// import {
//     Circle as CircleStyle,
//     Fill,
//     Stroke,
//     Style
// } from 'ol/style.js';

// var view = new View({
//     center: [0, 0],
//     zoom: 2
// });

// var map = new Map({
//     layers: [
//         new TileLayer({
//             source: new OSM()
//         })
//     ],
//     target: 'map',
//     view: view
// });

// var geolocation = new Geolocation({
//     // enableHighAccuracy must be set to true to have the heading value.
//     trackingOptions: {
//         enableHighAccuracy: true
//     },
//     projection: view.getProjection()
// });

// function el(id) {
//     return document.getElementById(id);
// }

// // el('track').addEventListener('change', function () {
// //     geolocation.setTracking(this.checked);
// // });

// geolocation.setTracking(true);

// // update the HTML page when the position changes.
// geolocation.on('change', function () {
//     el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
//     el('altitude').innerText = geolocation.getAltitude() + ' [m]';
//     el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
//     el('heading').innerText = geolocation.getHeading() + ' [rad]';
//     el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
// });

// // handle geolocation error.
// geolocation.on('error', function (error) {
//     var info = document.getElementById('info');
//     info.innerHTML = error.message;
//     info.style.display = '';
// });

// var accuracyFeature = new Feature();
// geolocation.on('change:accuracyGeometry', function () {
//     accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
// });

// var positionFeature = new Feature();
// positionFeature.setStyle(new Style({
//     image: new CircleStyle({
//         radius: 6,
//         fill: new Fill({
//             color: '#3399CC'
//         }),
//         stroke: new Stroke({
//             color: '#fff',
//             width: 2
//         })
//     })
// }));

// geolocation.on('change:position', function () {
//     var coordinates = geolocation.getPosition();
//     positionFeature.setGeometry(coordinates ?
//         new Point(coordinates) : null);
// });

// new VectorLayer({
//     map: map,
//     source: new VectorSource({
//         features: [accuracyFeature, positionFeature]
//     })
// });