//Setup canvas for drawing
var canvas = document.getElementById("Main_Canvas");
var draw = canvas.getContext("2d");
draw.moveTo(0,0);
draw.lineTo(200,200);
draw.stroke();
