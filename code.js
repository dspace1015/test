//Setup canvas for drawing
var canvas = document.getElementById("Main_Canvas");
var draw = canvas.getContext("2d");
var gl = canvas.getContext("webgl")
function drawLine(x1,y1,x2,y2,color,width){
  draw.beginPath();
  draw.strokeStyle = color;
  draw.lineWidth = width;
  draw.moveTo(x1,y1);
  draw.lineTo(x2,y2);
  draw.stroke();
}
if(!gl){
  alert("Error, your browser does not support webgl. Try downloading the newest version of your browser or if this worked before try again later");
}
drawLine(0,0,700,500,"#ff0000",3);
drawLine(0,500,700,0,"#000000",3);
gl.clearColor(1,0,0,1);

