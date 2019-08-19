function localFileVideoPlayer() {
	'use strict'
  var URL = window.URL || window.webkitURL
  var displayMessage = function (message, isError) {
    var element = document.querySelector('#message')
    element.innerHTML = message
    element.className = isError ? 'error' : 'info'
  }
  var playSelectedFile = function (event) {
    var file = this.files[0]
    var type = file.type
    var videoNode = document.getElementById('vidrecord')
    var canPlay = videoNode.canPlayType(type)
    if (canPlay === '') canPlay = 'no'
    var message = 'Can play type "' + type + '": ' + canPlay
    var isError = canPlay === 'no'
    //displayMessage(message, isError)

    if (isError) {
      return
    }

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
    var inputNode = document.getElementById('inputvideo')
    inputNode.addEventListener('change', playSelectedFile, false)
  }
  setTimeout(() => {
    var inputNode = document.getElementById('inputvideo')
    inputNode.addEventListener('change', playSelectedFile, false)
  }, 500);
  
}
