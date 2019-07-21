function information_init() {
    $('#info-panel-bottom').empty()
    $('#info-panel-bottom').append('<div class="tag-cloud"></div>')
    $('#info-panel-bottom').append('<div id="vehicle-panel"></div>')
    $('#info-panel-bottom').append('<div class="infobox  pos-absolute"></div > ')
}

$(document).ready(function () {

    var socket = io.connect('//' + document.domain + ':' + location.port);

    socket.on('connect', function (msg) {
        i = 1
        socket.emit('emit_labels', { data: 'Connection Established' })
        console.log('Socket connection estabilished')
    })

    $('.mode_select').click(function () {
        var selected_mode = $(this).data("mode");
        socket.emit('mode_change', { data: selected_mode })
    })

    socket.on('cnn_response', function (image) {
        $('#cnn-panel').empty()
        $('#cnn-panel').append('<img id="cnn-filter" src="' + `data:image/png;base64,${image.cnn}` + '"class= "img-fluid" width = 720px height = 428px> ')
    })

    socket.on('vehicle_response', function (image) {
        $('#info-panel-bottom').empty()
        $('#info-panel-bottom').append('<div class="tag-cloud"></div>')
        $('#info-panel-bottom').append('<div id="vehicle-panel"></div>')
        $('#vehicle-panel').empty()
        $('#vehicle-panel').append('<div class="thumb thumb--car"><img class="thumb-img thumb-img--car" src = "' + `data:image/png;base64,${image.licplate}` + '" alt = "car photo" ></div > ')
        $('#vehicle-panel').append('<div class="car-details">< div class= "license-plate" ><div class="thumb thumb--plate"><img class="thumb-img" src="' + `data:image/png;base64,${image.licplate}` + '" alt="license plate"></div><div class="label label--plate">Vehicle Number:</div><div class="detail detail--plate">' + image.vehicle_number + '</div></div><div class="car-status"><div class="btn btn-secondary btn--status disabled">Correct</div><div class="btn btn--status btn-danger">Stolen</div></div></div > ')
        // $('#vehicle-panel').append('<img id="lic-plate"src = "' + `data:image/png;base64,${image.licplate}` + '" class= "img-fluid" width = 100 % height=100 %> ')
    })


    socket.on('cropped_face', function (image) {
        $('#cropped-face').attr('src', `data:image/png;base64,${image.cropped_face}`);
    })

    socket.on('detections_list', function (message) {
        var delayInMilliseconds = 0;
        setTimeout(function () {
            if (i <= 20) {
                $('div.tag-cloud').append('<div class="tag-item"><div class= "detail detail--tag">' + message.object + '</div></div>')
                socket.emit('emit_labels', { data: 'Connection Established' })
                i = i + 1
            }
            else {
                $('div.tag-cloud').empty()
                socket.emit('emit_labels', { data: 'Connection Established' })
                i = 0
            }
        }, delayInMilliseconds);
    })

    socket.on('face_panel', function (message) {
        $('#info-panel-top').empty()
        $('#alert-panel-top').empty()
        $('#info-panel-top').append('<div class="person-info"><div class= "person-id"><div class="thumb thumb-pic"><img id="id-profile" class="thumb-img thumb-img--pic"src="static/img/woman.jpg" alt="Picture"></div><button class="id"><span class="icon-id"></span></button></div><div class="person-details"><div class="label label--person">Name:</div><div class="detail">' + message.first_name + ' ' + message.family_name + '</div><div class="label label--person">Country:</div><div class="detail">' + message.country + '</div><div class="label label--person">Passport Details:</div><div class="detail">' + message.passport + '</div></div></div > ')
        if (message.security_status == 1) {
            $('#info-panel-top').append('<a href="/analysis" class="btn btn-danger mt-2 mb-4 w-100" role="button">No Clearance</a > ')
            $('#alert-panel-top').append('<div class="rectangle rectangle--caution"><div class= "item-box--red"> <i class="fas fa-bomb"></i></div><div class="caution"><div class="caution__title">Caution</div><div class="caution__text">Security Alert</div></div></div> ')
        }
        else {
            $('#info-panel-top').append('<a href="/analysis" class="btn btn-success mt-2 mb-4 w-100" role = "button" > Security Cleared</a > ')
            $('#alert-panel-top').append('<div class="rectangle rectangle--alert" style="justify-content: left;padding:25px 17px 25px 17px;"><div class= "item-box--grey"> <i class="fas fa-shield-alt"></i></div ><div class="caution caution--grey"><div class="caution__title">Surveillance Mode ON</div><div class="caution__text">Process Ongoing...</div></div></div>')
        }
        $('#info-panel-top').append('<div class="person-info"><div class= "person-id" ><div class="thumb thumb-pic"><img id="cropped-face" class="thumb-img" src="static/img/driving.jpg" alt="Picture"></div></div> <div class="person-details"><div class="label label--person">Coordinates:</div><div class="detail">Searching...</div><div class="label label--person">Location:</div><div class="detail">Searching...</div></div></div > ')
        $('#cropped-face').attr('src', `data:image/png;base64,${message.cropped_face}`);
        $('#id-profile').attr('src', `data:image/png;base64,${message.cropped_face}`);
    })

    socket.on('face_name', function (message) {
        var delayInMilliseconds = 0;
        setTimeout(function () {
            if (i <= 10) {
                $('div.tag-cloud').append('<div class="tag-item"><div class= "detail detail--tag"> ' + message.detected_name + '</div></div>')
                socket.emit('emit_labels', { data: 'Connection Established' })
                i = i + 1
            }
            else {
                $('div.tag-cloud').empty()
                socket.emit('emit_labels', { data: 'Connection Established' })
                i = 0
            }
        }, delayInMilliseconds);
    })

});
