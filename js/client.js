console.log("TEST");

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
                window.location.href = 'game.html';

                            }
            else {
               alert("Wrong username or password, please try again.")
            }
        }
    });



    e.preventDefault(); // avoid to execute the actual submit of the form.
});



































$(document).ready(function () {


    var url = "http://localhost:9998/api/scores/"; // the script where you handle the form input.
    var display = {};

    $.ajax({
        url: url,
        type: 'GET',
        dataType: "JSONP",
        success: function () {
            console.log()
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
        }
    });
});



    $.get("http://localhost:9998/api/scores", function( data )  {
        //$( ".result" ).html( data );
        for (var i=0;i<data.length;++i)
        {
            $('#pending tr:last').after('<tr>' +
                '<td>' + (i+1) + '</td>' +
                '<td>' + data[i].user.firstName +" "+ data[i].user.lastName + '</td>' +
                '<td>' + data[i].score + '</td>' +

                '</tr>');
        }
console.log(data)

    });
















