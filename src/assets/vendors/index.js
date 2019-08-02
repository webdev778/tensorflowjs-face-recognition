// function getParameterByName(name, url) {
//   if (!url) {
//     url = window.location.href;
//     url = url.replace(":4200", "");
//     url = url + "?streamId=1";
//   }
//   name = name.replace(/[\[\]]/g, "\\$&");
//   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//     results = regex.exec(url);
//   if (!results) return null;
//   if (!results[2]) return '';
//   return decodeURIComponent(results[2].replace(/\+/g, " "));
// }

// $(document).ready(function () {
//   setTimeout(function () {
//     startJanusStream(getParameterByName('streamId'), 'stream');
//   }, 2000);
// });

// function changeStream(id) {
//   startJanusStream(getParameterByName('streamId', id), 'stream');
// }

// export function changeStreamById(id) {
//   console.log(`starting stream: ${id}`);
//   startJanusStream(getParameterByName('streamId', id), 'stream');
// }
