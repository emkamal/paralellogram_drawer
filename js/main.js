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
    drawPoint()

    if(pointCount == 3){

      drawParalellogram();
    }
  }
  else{
    resetCanvas();
    drawPoint();
  }
});

function drawPoint(){
  var point = new createjs.Shape();
  point.graphics.beginStroke("red").beginFill("rgba(255,255,255,0.5)").drawCircle(0, 0, 11);
  point.x = pointsX[pointCount] = event.clientX;
  point.y = pointsY[pointCount] = event.clientY;
  point.cursor = "pointer";
  pointCount += 1;
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
var point = new createjs.Shape();
  point.graphics.beginStroke("red").beginFill("rgba(255,255,255,0.5)").drawCircle(0, 0, 11);
  point.x = pointsX[pointCount];
  point.y = pointsY[pointCount];
  point.cursor = "pointer";
  pointCount += 1;
  stage.addChild(point);
  stage.update();
  var i=0;
  for(i=0; i<pointsX.length; i++){
    line = drawLine(pointsX[i], pointsY[i], pointsX[i+1], pointsY[i+1]);
    stage.addChild(line);
  }
  console.log(pointsX[i]);
  console.log(pointsY[i]);
  line = drawLine(pointsX[pointsX.length-1], pointsY[pointsX.length-1], pointsX[0], pointsY[0]);
  stage.addChild(line);
  stage.update();
}

function drawLine(startX, startY, endX, endY){
  var line = new createjs.Shape();
  line.graphics.beginFill("blue").beginStroke("blue").moveTo(startX, startY).lineTo(endX, endY);
  return line;
}

function resetCanvas(){
  stage.removeAllChildren();
  stage.clear();
  pointCount = 0;
}
