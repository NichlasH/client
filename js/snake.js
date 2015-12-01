/**
 * Created by NH on 11-11-2015.
 */

/* property of snake.pixelfabrikken.net */
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

var canvas = document.getElementById('grid');
var ctx = canvas.getContext("2d");

var numMoves = 0;
var canvas_size = canvas.height + 1;
var tile_size = 20;
var startX = canvas.width / 2;
var startY = canvas.height / 2 - tile_size;
var color;
var host_movements = '';

// Current x, y
var cx = startX;
var cy = startY;

// Creating grid
for (var x = 0.5; x < canvas_size; x += tile_size) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas_size);
}

for (var y = 0.5; y < canvas_size; y += tile_size) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas_size, y);
}

ctx.strokeStyle = "#ddd";
ctx.stroke();

ctx.fillStyle = "#98fb98";
ctx.fillRect(startX, startY, tile_size, tile_size);

function drawLeft() {
    if (cx < tile_size) {
        $("#notification").text("If it weren't for me, you would've died just now.").fadeTo('slow', 1).fadeTo('slow', 0);
        $("#grid").effect("highlight", 400);
        return false;
    }
    // Looking up the color of the future tile. If taken, error out.
    var currentLeft = ctx.getImageData(cx - tile_size, cy, tile_size, tile_size).data;
    var hexCurrentLeft = "#" + ("000000" + rgbToHex(currentLeft[0], currentLeft[1], currentLeft[2])).slice(-6);
    if (hexCurrentLeft == "#98fb98") {
        return false;
    }
    ctx.fillRect(cx - tile_size, cy, tile_size, tile_size);
    cx = cx - tile_size;
    numMoves = numMoves + 1;
    host_movements += "a";

    var direction = $("<div class='arrowLeft'></div>").hide();
    $('#movements .arrows').append(direction);
    direction.fadeIn(200);

    var tileUp = ctx.getImageData(cx, cy - tile_size, tile_size, tile_size).data;
    var hexTileUp = "#" + ("000000" + rgbToHex(tileUp[0], tileUp[1], tileUp[2])).slice(-6);
    var tileDown = ctx.getImageData(cx, cy + tile_size, tile_size, tile_size).data;
    var hexTileDown = "#" + ("000000" + rgbToHex(tileDown[0], tileDown[1], tileDown[2])).slice(-6);
    var tileLeft = ctx.getImageData(cx - tile_size, cy, tile_size, tile_size).data;
    var hexTileLeft = "#" + ("000000" + rgbToHex(tileLeft[0], tileLeft[1], tileLeft[2])).slice(-6);

    if (hexTileUp == "#98fb98" && hexTileDown == "#98fb98" && hexTileLeft == "#98fb98") {
        alert("YOU BE DEAD");
    }
}

function drawUp() {
    if (cy < tile_size) {

        $("#notification").text("If it weren't for me, you would've died just now.").fadeTo('slow', 1).fadeTo('slow', 0);

        $("#grid").effect("highlight", 400);
        return false;
    }
    // Looking up the color of the future tile. If red, error out.
    var p = ctx.getImageData(cx, cy - tile_size, tile_size, tile_size).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    if (hex == "#98fb98") {
        return false;
    }
    ctx.fillRect(cx, cy - tile_size, tile_size, tile_size);
    cy = cy - tile_size;
    numMoves += 1;
    host_movements += "w";

    var direction = $("<div class='arrowUp'></div>").hide();
    $('#movements .arrows').append(direction);
    direction.fadeIn(200);

}

function drawRight() {
    if (cx > (canvas_size - tile_size * 2)) {
        $("#notification").text("If it weren't for me, you would've died just now.").fadeTo('slow', 1).fadeTo('slow', 0);
        $("#grid").effect("highlight", 400);
        return false;
    }
    // Looking up the color of the future tile. If red, error out.
    var p = ctx.getImageData(cx + tile_size, cy, tile_size, tile_size).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    if (hex == "#98fb98") {
        return false;
    }
    ctx.fillRect(cx + tile_size, cy, tile_size, tile_size);
    cx = cx + tile_size;
    numMoves += 1;
    host_movements += "d";
    var direction = $("<div class='arrowRight'></div>").hide();
    $('#movements .arrows').append(direction);
    direction.fadeIn(200);
}

function drawDown() {
    if (cy > (canvas_size - tile_size * 2)) {
        $("#notification").text("If it weren't for me, you would've died just now.").fadeTo('slow', 1).fadeTo('slow', 0);
        $("#grid").effect("highlight", 400);
        return false;
    }
    var p = ctx.getImageData(cx, cy + tile_size, tile_size, tile_size).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    if (hex == "#98fb98") {

        return false;
    }
    ctx.fillRect(cx, cy + tile_size, tile_size, tile_size);
    cy = cy + tile_size;
    numMoves += 1;
    host_movements += "s";


    var direction = $("<div class='arrowDown'></div>").hide();
    $('#movements .arrows').append(direction);
    direction.fadeIn(200);


}

$(document).bind("keydown", function (e) {

    switch (e.keyCode) {
        //left
        case 37:
            drawLeft();
            break;

        //up
        case 38:
            drawUp();
            break;

        //right
        case 39:
            drawRight();
            break;

        //down
        case 40:
            drawDown();
            break;
    }

    $("#movements span").text("(" + numMoves + ")");


});