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

/**
 * Draw paralellogram on the canvas based on the given 3 points
 */
function drawParalellogram(){
  points[3] = new createjs.Point(points[2].x - (points[1].x - points[0].x), points[2].y - (points[1].y - points[0].y));
  drawPoint(points[3].x, points[3].y);

  for(i=0; i<points.length-1; i++){
    drawLine(points[i], points[i+1]);
  }
  drawLine(points[3], points[0]);

  drawPoint(points[0].x + ((points[2].x - points[0].x) / 2), points[0].y + ((points[2].y - points[0].y) / 2), "gold", false);
  drawLine(points[0], points[2], "#ddd");
  drawLine(points[1], points[3], "#ddd");
}

/**
 * Draw a point in the canvas
 * @param {int} x - The x coordinate of the point
 * @param {int} y - The y coordinate of the point
 * @param {string} color - Point color, default to red
  * @param {boolean} isCorner - By default, set the point to be the corner point
 */
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

/**
 * Draw a line on the canvas
 * @param {Point} start - The initial coordinate in Point object
 * @param {Point} end - The end coordinate of the line in Point object
 * @param {string} color - Line color, default to blue
 */
function drawLine(start, end, color="blue"){
  var line = new createjs.Shape();
  line.graphics.beginStroke(color).moveTo(start.x, start.y).lineTo(end.x, end.y);
  stage.addChild(line);
  stage.update();
}

/* Reset canvas by removing all elements in the canvas and set the count pointer back to 0 */
function resetCanvas(){
  stage.removeAllChildren();
  stage.clear();
  pointCount = 0;
}
