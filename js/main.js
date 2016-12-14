// Canvas initiazation
canvas = document.getElementById("mainCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var stage = new createjs.Stage("mainCanvas");
stage.enableMouseOver(10);

pointCount = 0; // corner point counter
points = []; // corner points in Point object

document.getElementById("resetCanvas").addEventListener("click",resetCanvas());
canvas.addEventListener("click", function(){
  if(pointCount < 3){
    drawPoint(event.clientX, event.clientY);
    if(pointCount == 3){
      drawParalellogram();
    }
  }
  else{
    resetCanvas();
    drawPoint(event.clientX, event.clientY);
  }
});

function drawParalellogram(){
  points[3] = new createjs.Point(points[2].x - (points[1].x - points[0].x), points[2].y - (points[1].y - points[0].y));
  drawPoint(points[3].x, points[3].y);

  for(i=0; i<points.length-1; i++){
    drawLine(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
  }
  drawLine(points[3].x, points[3].y, points[0].x, points[0].y);

  drawPoint(points[0].x + ((points[2].x - points[0].x) / 2), points[0].y + ((points[2].y - points[0].y) / 2), "gold", false);
  drawLine(points[0].x, points[0].y, points[2].x, points[2].y, "#ddd");
  drawLine(points[1].x, points[1].y, points[3].x, points[3].y, "#ddd");
}

function drawPoint(x, y, color="red", isCorner=true){
  var point = new createjs.Shape();
  point.graphics.beginStroke(color).beginFill("rgba(255,255,255,0.5)").drawCircle(0, 0, 11);
  point.x = x;
  point.y = y;
  isCorner ? point.cursor = "pointer" : point.cursor = "move";

  if(isCorner){
    points[pointCount] = new createjs.Point(x, y);
    pointCount += 1;
  }

  stage.addChild(point);
  stage.update();
}

function drawLine(startX, startY, endX, endY, color="blue"){
  var line = new createjs.Shape();
  line.graphics.beginStroke(color).moveTo(startX, startY).lineTo(endX, endY);
  stage.addChild(line);
  stage.update();
}

function resetCanvas(){
  stage.removeAllChildren();
  stage.clear();
  pointCount = 0;
}
