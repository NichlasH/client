// Function to create cookie with a specific key. By creating cookies this way it's easier to seperate the values in the different cookies created.
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}
// Fuction that "reads" a cookie based on a "Key" parameter
function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

//"Deletes" the cookie by setting it to expire immediately
function deleteCookie(key) {
    var expires = new Date();
    expires.setTime(1);
    document.cookie = key + '=' + ';expires=' + expires.toUTCString();
}

//Submits and checks loginform in index.html trough the api. Sends username and password in JSON format to the server
$("#loginform").submit(function (e) {

    var Username = $('#userfrm').val();
    var Password = $('#passfrm').val();
    var user = {
        username: Username,
        password: Password
    };
    var url = "http://localhost:9998/api/login/"; // the script where you handle the form input.
    var data = JSON.stringify(user); //Converts  the data to a JSON format, so it's readable for the serverAPI

    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data, // serializes the form's elements.
        error: function (response) {
            alert("Something went wrong")


        },
        success: function (response) {
            //If reponse contains a userid the user exists and a cookie with the userid value will be stored, furthermore the user will be sent to game.html
            if (response.userid) {
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


//Loops trough the scores array, and for each found score it adds the corresponding tables to the object in score.html
$.get("http://localhost:9998/api/scores", function (data) {

    for (var i = 0; i < data.length && i < 10; ++i) {
        $('#score tr:last').after('<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + data[i].user.firstName + " " + data[i].user.lastName + " (" + data[i].user.username + ")" + '</td>' +
            '<td>' + data[i].score + '</td>' +

            '</tr>');
    }

});


//Loops trough the games array, and for each found game that the current user has hosted, it adds the corresponding tables to the object in game.html
$.get("http://localhost:9998/api/games/host/" + getCookie('userid') + "/", function (data) {

    for (var i = 0; i < data.length; ++i) {
        $('#deletetable tr:last').after('<tr>' +
            '<td >' + data[i].name + '</td>' +
            '<td>' + data[i].gameId + '</td>' +
                //adds a button to each created row, the button reads the game id of the game in the same row and sets it object id to that value
            '<td><button class="btndelete" id="' + data[i].gameId + '" name="deletebtn">Delete</button></td>' +


            '</tr>');
    }

// Jquery that handles what happens when you click the btndelete, mentioned above
    $(".btndelete").click(function (e) {
        // The game variable is set to the id of the button pressed, this is to make the code easier to read and understand
        var game = this.id;
        var url = "http://localhost:9998/api/games/" + game; // the script where you handle the form input.
        $.ajax({
            type: 'POST',
            url: url,
            dataType: "JSON",
            error: function (response) {
                alert("Something went wrong")

            },
            success: function (response) {
                //If the response from the serverAPI is "Game was deleted" an alert tells the user about the succes. Somewhat a workaround and a bad way of doing it since a change in the server response will stop it from working.
                if (response.message === "Game was deleted") {
                    alert("Game deleted");
                    location.reload();
                    d
                }
                else {
                    alert("Can't find that game.")
                }
            }
        });
    });
});


//Loops trough the games array, and for each found game that the current user was invited to, it adds the corresponding tables to the object in game.html


$.get("http://localhost:9998/api/games/opponent/" + getCookie('userid') + "/", function (data) {

    for (var i = 0; i < data.length; ++i) {
        $('#jointable tr:last').after('<tr>' +
            '<td>' + data[i].name + '</td>' +
            '<td>' + data[i].gameId + '</td>' +
                //adds a button to each created row, the button reads the game id of the game in the same row and sets it object id to that value
            '<td><button class= "btnjoin" id="' + data[i].gameId + '" name="joinbtn">Join</button></td>' +


            '</tr>');
    }
    //When clicking the join button a cookie with the id of the button pressed gets creataed and the user gets forwarded to "start.html"
    $(".btnjoin").click(function (e) {
//This cookie is created as a workaround for the struggle that is "Javascript Variables", the variable is set on the current page("join.html"), and can't be read on the start.html page if you leave it as a "normal" var..
        setCookie('joinId', this.id);

        window.location.href = 'start.html';


    });
});

//When click the "start" button of start.html the ajax call will post the set data to the server
$("#start").click(function (e) {
    var GameId = getCookie('joinId');
    //Should be renamed and created as a seperate movement or colour, none the less if you seek to expand and add a replay function.
    var OpponentControls = host_movements;
    var url = "http://localhost:9998/api/games/start"; // the script where you handle the form input.
    var data = '{"gameId": ' + GameId + ', "opponent": {"controls" : "' + OpponentControls + '"}}';
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data, // serializes the form's elements.
        error: function (response) {
            alert("Something went wrong")

        },
        success: function (response) {
            alert("game started");
            window.location.href = 'join.html';

        }
    });

});

//Loops trough the games array, and for each found user who doesn't share Id with the current user it adds the data to the option in game.html
$.get("http://localhost:9998/api/users/", function (data) {
    for (var i = 0; i < data.length; ++i) {
        if (getCookie('userid') != data[i].id && data[i].type == 1) {
            $('#frmOpponent')
                .append($('<option>', {value: data[i].id})
                    .text(data[i].firstName + " " + data[i].lastName + " (" + data[i].username + ")"));
        }
    }
});


//When click the "create" button of start.html the ajax call will post the set data to the server and a new game will be created
$("#create").click(function (e) {

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
    };
    var data = JSON.stringify(game);

    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data, // serializes the form's elements.
        error: function (response) {
            alert("Something went wrong")

        },
        success: function (response) {
            alert("game created");
            location.reload();

        }
    });
});

// / The "Logout" function. Deleletes the cookie when the dlcookie/logout button is pressed. This was just a fast way to create a logout, but is no way as safe as checking for tokens for example.
$("#dlcookie").click(function (e) {

    deleteCookie('userid');
});
















