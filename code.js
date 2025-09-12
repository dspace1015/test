//Setup canvas for drawing
var canvas = document.getElementById("Main_Canvas");
var draw = canvas.getContext("2d");
function drawLine(x1,y1,x2,y2,color){
  draw.strockStyle = color
  draw.beginPath();
  draw.moveTo(x1,y1);
  draw.lineTo(x2,y2);
  draw.stroke();
}
drawLine(0,0,200,200,"Red");
