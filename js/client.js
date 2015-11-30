function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function deleteCookie(key) {
    var expires = new Date();
    expires.setTime(1);
    document.cookie = key + '=' + ';expires=' + expires.toUTCString();
}

$("#loginform").submit(function(e) {

    var Username = $('#userfrm').val();
    var Password = $('#passfrm').val();
    var user = {
        username: Username,
        password: Password
    };
    var url = "http://localhost:9998/api/login/"; // the script where you handle the form input.
    var data = JSON.stringify(user);

    console.log(data);
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data, // serializes the form's elements.
        error: function(response) {
            alert("Something went wrong")

        },
        success: function(response)
        {
            console.log(response.message); // show response
            if(response.userid) {
                userid = response.userid;

                setCookie('userid', response.userid);
                window.location.href = 'game.html';


            }
            else {
                alert("Wrong username or password, please try again.")
            }
        }
    });



    e.preventDefault(); // avoid to execute the actual submit of the form.
});







$.get("http://localhost:9998/api/scores",   function( data )  {

    for (var i=0;i<data.length && i < 10 ;++i)
    {
        $('#score tr:last').after('<tr>' +
            '<td>' + (i+1) + '</td>' +
            '<td>' + data[i].user.firstName +" "+ data[i].user.lastName + '</td>' +
            '<td>' + data[i].score + '</td>' +

            '</tr>');
    }

});


var userid = getCookie('userid');

$.get("http://localhost:9998/api/games/host/"+ userid + "/", function( data )  {

    for (var i=0;i<data.length;++i)
    {
        $('#deletetable tr:last').after('<tr>' +
            '<td >' + data[i].name + '</td>' +
            '<td>' + data[i].gameId + '</td>' +
            '<td><button class="btndelete" id="' +data[i].gameId + '" name="deletebtn">Delete</button></td>' +



            '</tr>');
    }
    $(".btndelete").click(function(e) {
        var game = this.id;
        var url = "http://localhost:9998/api/games/" + game; // the script where you handle the form input.
        console.log(url);
        $.ajax({
            type: 'POST',
            url: url,
            dataType: "JSON",
            error: function(response) {
                alert("Something went wrong")

            },
            success: function(response)
            {
                console.log(response.message); // show response
                if(response.message === "Game was deleted") {
                    alert("Game deleted")

                }
                else {
                    alert("Can't find that game.")
                }
            }
        });
    });
});






$.get("http://localhost:9998/api/games/opponent/"+ userid + "/", function( data )  {

    for (var i=0;i<data.length;++i)
    {
        $('#jointable tr:last').after('<tr>' +
            '<td>' + data[i].name + '</td>' +
            '<td>' + data[i].gameId + '</td>' +
            '<td><button class= "btnjoin" id="' +data[i].gameId + '" name="joinbtn">Join</button></td>' +



            '</tr>');
    }
    $(".btnjoin").click(function(e) {

        setCookie('joinId',this.id);

        window.location.href = 'start.html';



    });})

$("#start").click(function(e) {
    var GameId = getCookie('joinId');
    var Host = document.cookie;
    var OpponentControls = host_movements;
    var url = "http://localhost:9998/api/games/start"; // the script where you handle the form input.
    var data = '{"gameId": ' + GameId + ', "opponent": {"controls" : "'+ OpponentControls + '"}}';

    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data, // serializes the form's elements.
        error: function(response) {
            alert("Something went wrong")

        },
        success: function(response)
        {
            alert("game started")
            console.log(response.message); // show response

        }
    });})



$( document ).ready(function()
{
    $("#gamecontainer").fadeTo("slow",1);


});
$.get("http://localhost:9998/api/users/", function( data )  {
    console.log(data)
    for (var i=0;i<data.length;++i) {
        if (getCookie('userid') != data[i].id) {
            $('#frmOpponent')
                .append($('<option>', {value: data[i].id})
                    .text(data[i].firstName + " " + data[i].lastName + " (" + data[i].username + ")"));
        }
    }
});



// this is the id of the form
$("#create").click(function(e) {

    var GameName = $('#frmGameName').val();
    var Opponent = $('#frmOpponent').val();
    var Host = getCookie('userid');
    var HostControls = host_movements;
    var url = "http://localhost:9998/api/games/"; // the script where you handle the form input.
    var game =
    {
        name: GameName,
        opponent: {id: Opponent},
        host: {id: Host, controls: HostControls}
    }
    var data= JSON.stringify(game); 
    console.log(data);
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data, // serializes the form's elements.
        error: function(response) {
            alert("Something went wrong")

        },
        success: function(response)
        {
            alert("game created")
            console.log(response.message); // show response

        }
    });})

$("#dlcookie").click(function(e) {
    var now = new Date();
    var time = now.getTime();
    var expireTime = 1;
    now.setTime(expireTime);
    deleteCookie('userid');
})
















