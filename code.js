//Setup canvas for drawing
var canvas = document.getElementById("Main_Canvas");
var draw = canvas.getContext("2d");
function drawLine(x1,y1,x2,y2,color,width){
  draw.strokeStyle = color;
  draw.lineWidth = width;
  draw.moveTo(x1,y1);
  draw.lineTo(x2,y2);
  draw.stroke();
}
drawLine(0,0,700,500,"red",3);
drawLine(0,500,700,0,"green",3);
document.addEventListener('keydown', function(event) {
    if (event.key === 'w') { 
        event.preventDefault();
        drawLine(350,0,350,500,"Blue",3);
        
    }
