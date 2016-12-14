canvas = document.getElementById("mainCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

var stage = new createjs.Stage("mainCanvas");
stage.enableMouseOver(10);

var pointCount = 0;
var pointsX = [];
var pointsY = [];

document.getElementById("resetCanvas").addEventListener("click",resetCanvas());
canvas.addEventListener("click", function(){
  if(pointCount < 3){
    drawPoint(event.clientX, event.clientY, "red");
    if(pointCount == 3){
      drawParalellogram();
    }
  }
  else{
    resetCanvas();
    drawPoint(event.clientX, event.clientY, "red");
  }
});

function drawPoint(x, y, color, isCorner=true){
  var point = new createjs.Shape();
  point.graphics.beginStroke(color).beginFill("rgba(255,255,255,0.5)").drawCircle(0, 0, 11);
  point.x = x;
  point.y = y;
  point.cursor = "pointer";

  if(isCorner){
    pointsX[pointCount] = x;
    pointsY[pointCount] = y;
    pointCount += 1;
  }

  stage.addChild(point);
  stage.update();
}
function calculateEndPoint(pointsX, pointsY){
  endY = pointsY[2] - (pointsY[1]-pointsY[0]);
  endX = pointsX[2] - (pointsX[1]-pointsX[0]);
  pointsX[pointCount] = endX;
  pointsY[pointCount] = endY;
}
function drawParalellogram(){
  calculateEndPoint(pointsX,pointsY)
  // pointsX[pointCount] = 0
  // pointsY[pointCount] = pointsY[pointCount-1];
  drawPoint(pointsX[pointCount], pointsY[pointCount], "red");

  var i=0;
  for(i=0; i<pointsX.length; i++){
    line = drawLine(pointsX[i], pointsY[i], pointsX[i+1], pointsY[i+1]);
    stage.addChild(line);
  }

  line = drawLine(pointsX[pointsX.length-1], pointsY[pointsX.length-1], pointsX[0], pointsY[0]);
  stage.addChild(line);
  stage.update();

  drawPoint(pointsX[0] + ((pointsX[2] - pointsX[0]) / 2), pointsY[0] + ((pointsY[2] - pointsY[0]) / 2), "yellow", false);

  line = drawLine(pointsX[0], pointsY[0], pointsX[2], pointsY[2], "#ccc");
  stage.addChild(line);
  line = drawLine(pointsX[1], pointsY[1], pointsX[3], pointsY[3], "#ccc");
  stage.addChild(line);
  stage.update();
}

function drawLine(startX, startY, endX, endY, color="blue"){
  var line = new createjs.Shape();
  line.graphics.beginStroke(color).moveTo(startX, startY).lineTo(endX, endY);
  return line;
}

function resetCanvas(){
  stage.removeAllChildren();
  stage.clear();
  pointCount = 0;
}
