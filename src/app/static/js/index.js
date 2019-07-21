
$(document).ready(function() {

/* display loading animation whenever a icon is pressed */

   $(".nav .nav-icon").click(function(e) {

     /* button active */

     $(this).addClass('nav-icon--active');
     $(this).siblings().not(this).removeClass('nav-icon--active')

    $(".thumb-img--middle").fadeOut(400, function() {
            $('.thumb-img--middle').attr('src','./img/animation.gif');
        }).fadeIn(400);
});


  /* camera card button active */


  $(".card-header").click(function(e) {
    // camera card active and arrow up
     $(this).parent().addClass('active').find('.arrow').addClass('fa-chevron-up');

    // camera card active and arrow down
     $(this).parent().siblings().not(this).removeClass('active').find('.arrow').removeClass('fa-chevron-up').addClass('fa-chevron-down');

     //collapse one item at a time
     $('.collapse').collapse('hide');
  })

  /* show the name of the file on the drag-drop*/
  var applyFiles = function() {
    if (this.files.length <= 0) {
      $('.filanme').html('Select a file or drag a file into this area.');
    } else {
      $('.filename').empty();

      for (var i = 0; i < this.files.length; ++i) {
        $('.filename').append($('<li>').html(this.files[i].name));
      }
    }
  }

  /* event triggered when a file is uploaded */
    $('input[type="file"]').each(function() {
    applyFiles.call(this);
  }).change(function() {
    applyFiles.call(this);
  });
});

var $message_container = $("<div></div>");
var $message_container_icon = "<table><tr><td><img src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzZweCIgaGVpZ2h0PSIzNnB4IiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU0ICg3NjQ4MCkgLSBodHRwczovL3NrZXRjaGFwcC5jb20gLS0+CiAgICA8dGl0bGU+Q29tYmluZWQgU2hhcGU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRGVza3RvcC0tLS1Qb3BVcC1NZXNzYWdlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAwLjAwMDAwMCwgLTc2Mi4wMDAwMDApIiBmaWxsPSIjNzE3Qjk2IiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzAuMDAwMDAwLCA3MzIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iYS1jaGVjayIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCAzMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTcuNTM0NTg2MSwxNi45NjU2NzA5IEMxNy42MTc1MTc5LDE5LjkzNzA3NzcgMjIuNjczNDY3MiwyMC44MDI2NzY2IDIzLjU4NjczMzYsMjEuOTAxMzM4MyBDMjQuNSwyMyAyMSwyMy41IDE5LjUsMjcgQzE4LDMwLjUgMTkuNSwzNCAxNy41LDM0IEMxNS41LDM0IDExLjYzNzMzNDgsMzQuMDQ0NTAyOSAxMSwzNCBDOS4yOTc3NTI3OSwzNC4xMTkwNDY4IDEuMjM3NDg5MTYsMzMuNTQ2MTkwNCAwLjM3NzA3ODc0NSwzMC40OTA5ODkxIEMtMi4zMjAxMTIxMywxOS42OTgyNDU0IDEwLjMzMTUzNTMsMjMuMDI0MDUzMSAxMC40NzEwODg1LDE3LjAxNDY5MDIgTDEwLjQ5NDE4LDE3LjAxNDY5MDIgQzkuNDkwMjAwNSwxNS45NzY3ODIxIDguNzk3NDU0NjYsMTQuNjc5NzcyMSA4LjU4NjYxODk2LDEzLjkxMDQ2OTYgQzguNDU0MDkzNjcsMTMuNDMzMjgyIDguMzYwMjIxNTksMTIuOTE5MDc5OCA4LjI5Njk3MDg4LDEyLjUzNzQyOTcgQzcuODc1Mjk5NSwxMi4zMzI4NDkzIDcuNTU1MDMwMDUsMTEuOTg5MjE0MiA3LjM3NTMxNzcyLDExLjU1NjU0NDEgQzcuMTI2ODMyOCwxMC45Mjk3OTc2IDYuOTkyODAxNTQsOS41ODYyNjkzNCA2Ljk4OTI4NzYxLDkuNTI3MjQ2MTQgQzYuODgyODY1NzgsOC40NzEzMzA5NSA3LjI1NDMzODE5LDcuODU1MDg4NjQgNy4yOTI0ODk0MSw3LjgxNTU3MzEgQzYuODUzMjQ4MzksMy40OTMzNzM2IDguMjM5MjQyMDYsMi42NDE1Mzg2NiA5LjE2MzQwNTE4LDIuNDg4NDc4NDggQzkuNDkyMjA4NDYsMi40MzI0NTY0NSA5Ljk4OTE3ODMsMi4zMTI0MDkyNSAxMC4yMDkwNDk4LDIuMDY0MzExNjkgQzEwLjcyNzYwNTIsMS40OTYwODgyNyAxMC45NTg1MjA1LDAuODYzODM5NjY0IDExLjg1MTA1ODIsMC45MTQzNTk1MjggQzEyLjE4MDM2MzUsMC45MzI4NjY4MDYgMTIuNjE4MDk4NiwwLjgyMjgyMzUzNiAxMi44NjU1Nzk1LDAuNjAxMjM2NDA4IEMxMy4xNzkzMjMxLDAuMzIxMTI2MjY4IDEzLjYxMjU0MDIsMCAxMy45NTc0MDcyLDAgQzE0LjMwNDc4NDEsMCAxNC43NzUxNDg1LDAuMzMyMTMwNTk1IDE1LjEyMDUxNzQsMC42MTkyNDM0ODggQzE1LjM3MTUxMjMsMC44Mjk4MjYyOSAxNS44MjAyOTExLDAuOTMyODY2ODA2IDE2LjE0ODA5MDQsMC45MTQzNTk1MjggQzE3LjA0MTEzMDIsMC44NjQzMzk4NjEgMTcuMjcyMDQ1NSwxLjQ5NjA4ODI3IDE3Ljc5MDYwMDksMi4wNjQzMTE2OSBDMTguMDA5OTcwNCwyLjMxMTkwOTA1IDE4LjUwNzQ0MjIsMi40MzI5NTY2NCAxOC44MzYyNDU1LDIuNDg4NDc4NDggQzE5Ljc2MDQwODYsMi42NDE1Mzg2NiAyMS4xNDQ4OTYzLDMuNDkzMzczNiAyMC43MDgxNjUyLDcuODEzMDcyMTIgQzIwLjc0MTI5NjYsNy44NDg1ODYwOCAyMS4xMjAyOTg4LDguNDYyMzI3NDEgMjEuMDEwODY1LDkuNTI4NzQ2NzMgQzIxLjAwNzM1MTEsOS41ODcyNjk3NCAyMC44NzI4MTc5LDEwLjkzMDI5NzggMjAuNjI0MzMyOSwxMS41NTcwNDQzIEMyMC40NDk2NDA1LDExLjk4OTcxNDQgMjAuMTI0ODUzMiwxMi4zMzMzNDk1IDE5LjcwMjY3OTgsMTIuNTM3OTI5OSBDMTkuNjQxOTM5LDEyLjkxOTU4IDE5LjU0NjA1OSwxMy40Mjg3ODAyIDE5LjQxMzUzMzcsMTMuOTEwOTY5OCBDMTkuMjA5MjIzOSwxNC42NjI3NjU0IDE4LjUyNzAxOTgsMTUuOTMyNzY0OCAxNy41MzQ1ODYxLDE2Ljk2NTY3MDkgWiBNMjYuMTM4MjA3OSwzNiBMMjAuODg5MDQwNywzMC43NTA4MzI4IEwyMy4wNjMxMjQ2LDI4LjU3Njc0OSBMMjYuMTM4MjA3OSwzMS42NTE4MzIyIEwzMy44MjU5MTYxLDIzLjk2NDEyNCBMMzYsMjYuMTM4MjA3OSBMMjYuMTM4MjA3OSwzNiBaIiBpZD0iQ29tYmluZWQtU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+'></td><td><div class='col-md-6 flash-message-container'></div></td></tr></table>"
$('body').append($message_container);

// define the default options
var $options = {
  'bgColor' : '#d1d3d6',
  'duration' : 4000,
  'ftColor' : '#545556',
  'vPosition' : 'bottom',
  'hPosition' : 'left',
  'fadeIn' : 400,
  'fadeOut' : 400,
  'clickable' : true,
  'autohide' : true
};


function flash(message, options = null){
  var type = typeof options;
  if (options !== null && type === 'object') {
    $.extend($options, options)
  }
//Message container div css
  msg_container_css = {
    "position": "fixed",
    "margin-left" : '7px',
    "z-index" : '50',
  };
  msg_container_css[$options.vPosition] = "3px";
  msg_container_css[$options.hPosition] = "5px";
  $message_container.css(msg_container_css);


// define the message div
var $message = $("<div></div>");

//Message div css
  msg_css = {
    'margin-bottom': '70px',
    'text-align' : 'right',
    'margin-top' : '10px',
    'padding' : '28px',
    'border' : '1px solid #dcdcdc',
    'border-radius': '5px',
    'float': 'right',
    'clear': 'right',
    'background-color': $options.bgColor,
    'color' : $options.ftColor,
    'font-family': "Arial, Helvetica, sans-serif",
  };
  $message.append($message_container_icon);
  $message.css(msg_css);
//Adding text to message
//  $message.append(message);

//Appeding message div to message container div
  $message_container.append($message).children(':last').hide().fadeIn($options.fadeIn);
  $('.flash-message-container').text(message);
//Check if message is clickable to enable message click hide action
  if ($options.clickable) {
    $message.on('click', function(){
      $(this).fadeOut($options.fadeOut);
    });
  }

//Check if message is enabled to autohide
  if ($options.autohide) {
    setTimeout(function(){
      $message.fadeOut($options.fadeOut);
    },$options.duration);
  }


};
