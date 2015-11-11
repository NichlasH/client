console.log("TEST");

$("#loginform").submit(function(e) {

    var Username = $('#userfrm').val();
    var Password = $('#passfrm').val();

    var url = "http://localhost:9998/api/login/"; // the script where you handle the form input.
    var data = '{"username": "' + Username + '", "password": "'+ Password +'"}';

    console.log(data);
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data, // serializes the form's elements.
        error: function(response) {
            $(".info").text("Unfortunately the server is not responding").fadeTo(1000, 1).fadeTo(2000, 0);
           //for test purposes
            window.location.href = 'game.html';
        },
        success: function(response)
        {
            console.log(response.message); // show response
            if(response.userid) {
                window.location.href = 'game.html';

                            }
            else {
                $(".info").text("Wrong username or password. Please try again.").fadeTo(1000, 1).fadeTo(2000, 0);

                //document.location = '/login.php?info=Wrong username or password. Please try again.';
            }
        }
    });



    e.preventDefault(); // avoid to execute the actual submit of the form.
});



