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



