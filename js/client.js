


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
                document.cookie= userid;

                window.location.href = 'game.html';


                            }
            else {
               alert("Wrong username or password, please try again.")
            }
        }
    });



    e.preventDefault(); // avoid to execute the actual submit of the form.
});


$("#deleteform").submit(function(e) {

    var game = $('#gamefrm').val();
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


var userid = document.cookie;

$.get("http://localhost:9998/api/games/opponent/"+ userid + "/", function( data )  {

    for (var i=0;i<data.length;++i)
    {
        $('#deletetable tr:last').after('<tr>' +
            '<td>' + data[i].name + '</td>' +
            '<td>' + data[i].gameId + '</td>' +
            '<td><button id="' +data[i].gameId + '" name="deletebtn">DELETE</button></td>' +



            '</tr>');
    }
    console.log(data)

});



$.get("http://localhost:9998/api/games/host/"+ userid + "/", function( data )  {

    for (var i=0;i<data.length;++i)
    {
        $('#jointable tr:last').after('<tr>' +
            '<td>' + data[i].name + '</td>' +
            '<td>' + data[i].gameId + '</td>' +
            '<td><button id="' +data[i].gameId + '" name="joinbtn">Join</button></td>' +



            '</tr>');
    }
    console.log(data)

});
$( document ).ready(function()
{
    $("#gamecontainer").fadeTo("slow",1);


});
$.get("http://localhost:9998/api/users/", function( data )  {
console.log(data)
    for (var i=0;i<data.length;++i)
    {
        $('#frmOpponent')
            .append($('<option>', { value : data[i].id })
                .text(data[i].firstName + " " + data[i].lastName + " (" + data[i].username + ")"));
    }
});



function ConvertFormToJSON(form){
    var array = jQuery("form").serializeArray();
    var json = {};

    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });
    console.log(json);
    return json;
}

// this is the id of the form
$("#Create").click(function(e) {

    var GameName = $('#frmGameName').val();
    var Opponent = $('#frmOpponent').val();
    var Host = document.cookie;
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
    document.cookie="2";
console.log(document.cookie);
})

















