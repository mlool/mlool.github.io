var color = $(".selected").css("background-color");
var lineThickness = $("#thickness").val();
var $canvas = $("canvas");
var context = $canvas[0].getContext("2d");
var lastEvent;
var mouseDown = false;

//When clicking on control list items
$(".controls").on("click", "li", function() {
  //Deselect sibling elements
  $(this).siblings().removeClass("selected");
  //Select clicked element
  $(this).addClass("selected");
  //cache current color
  color = $(this).css("background-color");
});

//When "New Color" is pressed
$("#revealColorSelect").click(function() {
  //Show color select or hide the color select
  changeColor();
  $("#colorSelect").toggle();
});

//update the new color span
function changeColor() {
  var r = $("#red").val();
  var g = $("#green").val();
  var b = $("#blue").val();
  $("#newColor").css("background-color", "rgb(" + r + "," + g + ", " + b + ")");
}

//When color sliders change
$("#colorSelect input[type=range]").change(changeColor);

$("#thickness").change(function() {
    lineThickness = $("#thickness").val();
});

//When "Add Color" is pressed
$("#addNewColor").click(function() {
  //Append the color to the controls ul
  var $newColor = $("<li></li>");
  $newColor.css("background-color", $("#newColor").css("background-color"));
  $(".controls ul").append($newColor);
  //Select the new color
  $newColor.click();
});

//On mouse events on the canvas
$canvas.mousedown(function(e) {
  lastEvent = e;
  mouseDown = true;
}).mousemove(function(e) {
  //Draw lines
  if (mouseDown) {
    context.beginPath();
    context.moveTo(lastEvent.offsetX, lastEvent.offsetY);
    context.lineTo(e.offsetX, e.offsetY);
    context.strokeStyle = color;
    context.lineWidth = lineThickness;
    context.stroke();
    lastEvent = e;
  }
}).mouseup(function() {
  mouseDown = false;
}).mouseleave(function() {
  $canvas.mouseup();
});

$("#clearCanvas").click(function() {
    context.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
});

$("#clearCanvas").hover(function() {
  $("#clearCanvas").css("background-color", "#324292");
}, function() {
  $("#clearCanvas").css("background-color", "#4054b5");
});

$("#revealColorSelect").hover(function() {
  $("#revealColorSelect").css("background-color", "#324292");
}, function() {
  $("#revealColorSelect").css("background-color", "#4054b5");
});

$("#addNewColor").hover(function() {
  $("#addNewColor").css("background-color", "#324292");
}, function() {
  $("#addNewColor").css("background-color", "#4054b5");
});