// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
var divRoot = $("#affdex_elements")[0];
var width = 640;
var height = 480;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();

//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function () {
  console.log('The detector reports initialized')
  log('#logs', "The detector reports initialized");
  //Display canvas instead of video feed because we want to draw the feature points on it
  $("#face_video_canvas").css("display", "block");
  $("#face_video").css("display", "none");

});

function log(node_name, msg) {
  $(node_name).append("<span>" + msg + "</span><br />")
}

//function executes when Start button is pushed.
function onStart() {
  if (detector && !detector.isRunning) {
    $("#logs").html("");
    detector.start();
  }
  log('#logs', "Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
  log('#logs', "Clicked the stop button");
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
  }
};

//function executes when the Reset button is pushed.
function onReset() {
  log('#logs', "Clicked the reset button");
  if (detector && detector.isRunning) {
    detector.reset();
    $('#results').html("");
  }
};

//Add a callback to notify when camera access is allowed
detector.addEventListener("onWebcamConnectSuccess", function () {
  log('#logs', "Webcam access allowed");
  console.log('Webcam access allowed')
});

//Add a callback to notify when camera access is denied
detector.addEventListener("onWebcamConnectFailure", function () {
  log('#logs', "webcam denied");
  console.log("Webcam access denied");
});

//Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", function () {
  log('#logs', "The detector reports stopped");
  console.log('The detector reports stopped')
  $("#results").html("");
});

detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
  
  $('#results').html("");
  console.log('onImageResultsSuccess')
  $('#emotions-panel-top').empty()
  $('#emotions-panel-top').append('<div class="data-box"><i class="fas fa-tachometer-alt"></i><div class="data-info">Timestamp:<span class="highlight">' + timestamp.toFixed(2) + '</span></div></div>')
  $('#emotions-panel-top').append('<div class="data-box mb-4"><i class="fas fa-user"></i><div class="data-info">Number of faces found:<span class="highlight">' + faces.length + '</span></div></div>')
  $('#emotions-panel-top').append('<div class="appearance-tab"><div class="tab-item tab-item--emotion">Appearance</div></div>')

  if (faces.length > 0) {
    $('#info-panel-top').empty()
    appearance = JSON.parse(JSON.stringify(faces[0].appearance))
    emotions = JSON.parse(JSON.stringify(faces[0].emotions, function (key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    }))
    expressions = JSON.parse(JSON.stringify(faces[0].expressions, function (key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    }))

    $('#info-panel-top').append('<div id = "tags" class="tag-cloud"></div>')
    $('#tags').append('<div class="tag-item"><div class="detail detail--tag">Gender</div>'+ (appearance.gender == "Unknown" ? "<div class='percentage percentage--grey tx_red'>" + appearance.gender + " </div></div> " : '<div class="percentage percentage--grey tx_green"> ' + appearance.gender + '  </div></div> '))
    $('#tags').append('<div class="tag-item"><div class="detail detail--tag">Glasses</div>'+ (appearance.glasses == "No" ? "<div class='percentage percentage--grey tx_red'>" + appearance.glasses + " </div></div> " : '<div class="percentage percentage--grey tx_green"> ' + appearance.glasses + '  </div></div> '))
    $('#tags').append('<div class="tag-item"><div class="detail detail--tag">Age</div>'+ (appearance.age == "Unknown" ? "<div class='percentage percentage--grey tx_red'>" + appearance.age + " </div></div> " : '<div class="percentage percentage--grey tx_green"> ' + appearance.age + '  </div></div> '))
    $('#tags').append('<div class="tag-item"><div class="detail detail--tag">Ethnicity</div>'+ (appearance.ethnicity == "Unknown" ? "<div class='percentage percentage--grey tx_red'>" + appearance.ethnicity + " </div></div> " : '<div class="percentage percentage--grey tx_green"> ' + appearance.ethnicity + '  </div></div> '))

    $('.tab').empty()
    $('#emotions-tab').empty()
    $('#info-panel-bottom').empty()
    $('#about').empty()
    // $('.emotions-header').empty()
    $('.tab').append('<div class="tab-item tab-item--emotion">Emotions</div>')
    $('#info-panel-bottom').append('<div id = "emotions-tags" class="tag-cloud"></div>')
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Joy</div>'+ (emotions.joy > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.joy + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.joy + '  </div></div> '))
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Sadness</div>'+ (emotions.sadness > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.sadness + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.sadness + '  </div></div> '))
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Disgust</div>'+ (emotions.disgust > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.disgust + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.disgust + '  </div></div> '))
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Contempt</div>'+ (emotions.contempt > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.contempt + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.contempt + '  </div></div> '))
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Anger</div>'+ (emotions.anger > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.anger + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.anger + '  </div></div> '))
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Fear</div>'+ (emotions.fear > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.fear + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.fear + '  </div></div> '))
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Surprise</div>'+ (emotions.surprise > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.surprise + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.surprise + '  </div></div> '))
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Valence</div>'+ (emotions.valence > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.valence + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.valence + '  </div></div> '))
    $('#emotions-tags').append('<div class="tag-item"><div class="detail detail--tag">Engagement</div>'+ (emotions.engagement > 0 ? "<div class='percentage percentage--grey tx_green'>" + emotions.engagement + " </div></div> " : '<div class="percentage percentage--grey tx_red"> ' + emotions.engagement + '  </div></div> '))

    $('#alert-panel-top').empty()
    $('#alert-panel-top').append('<div class="tab"><div class="tab-item tab-item--emotion">Expressions</div></div>')
    // $('#expression-panel').empty()
    $('#cnn-panel').empty()
    $('#cnn-panel').append('<div id = "expression-tags" class="tag-cloud"></div>')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">smile</div><div class="percentage percentage--grey">' + expressions.smile + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">innerBrowRaise</div><div class="percentage percentage--grey">' + expressions.innerBrowRaise + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">browRaise</div><div class="percentage percentage--grey">' + expressions.browRaise + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">browFurrow</div><div class="percentage percentage--grey">' + expressions.browFurrow + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">noseWrinkle</div><div class="percentage percentage--grey">' + expressions.noseWrinkle + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">upperLipRaise</div><div class="percentage percentage--grey">' + expressions.upperLipRaise + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">lipCornerDepressor</div><div class="percentage percentage--grey">' + expressions.lipCornerDepressor + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">chinRaise</div><div class="percentage percentage--grey">' + expressions.chinRaise + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">lipPucker</div><div class="percentage percentage--grey">' + expressions.lipPucker + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">lipPress</div><div class="percentage percentage--grey">' + expressions.lipPress + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">lipSuck</div><div class="percentage percentage--grey">' + expressions.lipSuck + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">mouthOpen</div><div class="percentage percentage--grey">' + expressions.mouthOpen + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">smirk</div><div class="percentage percentage--grey">' + expressions.smirk + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">eyeClosure</div><div class="percentage percentage--grey">' + expressions.eyeClosure + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">attention</div><div class="percentage percentage--grey">' + expressions.attention + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">lidTighten</div><div class="percentage percentage--grey">' + expressions.lidTighten + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">jawDrop</div><div class="percentage percentage--grey">' + expressions.jawDrop + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">dimpler</div><div class="percentage percentage--grey">' + expressions.dimpler + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">eyeWiden</div><div class="percentage percentage--grey">' + expressions.eyeWiden + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">cheekRaise</div><div class="percentage percentage--grey">' + expressions.cheekRaise + '</div></div> ')
    $('#expression-tags').append('<div class="tag-item"><div class="detail detail--tag">lipStretch</div><div class="percentage percentage--grey">' + expressions.lipStretch + '</div></div> ')

    if ($('#face_video_canvas')[0] != null)
      drawFeaturePoints(image, faces[0].featurePoints);
  }
});

//Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints) {
  var contxt = $('#face_video_canvas')[0].getContext('2d');

  var hRatio = contxt.canvas.width / img.width;
  var vRatio = contxt.canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);

  contxt.strokeStyle = "#FFFFFF";
  for (var id in featurePoints) {
    contxt.beginPath();
    contxt.arc(featurePoints[id].x,
      featurePoints[id].y, 2, 0, 2 * Math.PI);
    contxt.stroke();

  }
}
