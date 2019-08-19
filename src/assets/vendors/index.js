function getParameterByName(name, streamId) {
    var url = window.location.href;

    if (!streamId) streamId = 1;
    url = window.location.href;
    url = url.replace(":4200", "");
    url = url + "?streamId="+streamId;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function() {
    setTimeout(function() {
        startJanusStream(getParameterByName('streamId'), 'stream');
    }, 2000);
});

// function changeStream(id) {
//   startJanusStream(getParameterByName('streamId', id), 'stream');
// }


function changeStreamById(id) {
    startJanusStream(getParameterByName('streamId', id), 'stream');
    console.log(`starting stream: ${id}`);
}