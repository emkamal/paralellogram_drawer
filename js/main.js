// Canvas initiazation
canvas = document.getElementById("mainCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var stage = new createjs.Stage("mainCanvas");
stage.enableMouseOver(10);
stage.mouseMoveOutside = true;
createjs.Touch.enable(stage);

update = true;
pointCount = 0; // corner point counter
points = []; // corner points in Point object
var lineContainer = new createjs.Container();

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
function drawParalellogram(isRedraw=false){
  lineContainer.removeAllChildren();
  points[3] = new createjs.Point(points[2].x - (points[1].x - points[0].x), points[2].y - (points[1].y - points[0].y));
  if(!isRedraw){
    drawPoint(points[3].x, points[3].y);
    drawPoint(points[0].x + ((points[2].x - points[0].x) / 2), points[0].y + ((points[2].y - points[0].y) / 2), "gold", false);
  }


  for(i=0; i<points.length-1; i++){
    drawLine(points[i], points[i+1], "sideline"+i);
  }
  drawLine(points[3], points[0], "sideline3");


  drawLine(points[0], points[2], "crossline1", "#ddd");
  drawLine(points[1], points[3], "crossline2", "#ddd");

  createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
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
    point.name = "corner"+pointCount;
    point.id = pointCount;
    pointCount += 1;

    point.on("mousedown", function (evt) {
			this.parent.addChild(this);
			this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
		});

    point.on("pressmove", function (evt) {
      console.log("this.id: "+this.name);
      thisPrevX = this.x;
      thisPrevY = this.y;
			this.x = evt.stageX + this.offset.x;
			this.y = evt.stageY + this.offset.y;
      deltaX = this.x - thisPrevX;
      deltaY = this.y - thisPrevY;
			// indicate that the stage should be updated on the next tick:
			update = true;
      // reDrawParalellogram(evt, this.id);

      var affectedPointId = 0;
      switch (this.id) {
        case 0: affectedPointId = 1;break;
        case 1: affectedPointId = 0;break;
        case 2: affectedPointId = 3;break;
        case 3: affectedPointId = 2;break;
        default: affectedPointId = 0;
      }
      affectedPoint = stage.getChildByName("corner"+affectedPointId);
      affectedPoint.x = affectedPoint.x + deltaX;
      affectedPoint.y = affectedPoint.y + deltaY;
      setPoints();
      centerPoint = stage.getChildByName("center");

      centerPoint.x = points[0].x + ((points[2].x - points[0].x) / 2);
      centerPoint.y = points[0].y + ((points[2].y - points[0].y) / 2);

      drawParalellogram(true);

		});
  }
  else{
    point.name = "center";
  }

  stage.addChild(point);
  stage.update();
}

function setPoints(){
  pointObjects = [];
  for(var i=0; i<4; i++){
    pointObjects[i] = stage.getChildByName("corner"+i);
    points[i] = new createjs.Point(pointObjects[i].x, pointObjects[i].y);
  }
}





/**
 * Draw a line on the canvas
 * @param {Point} start - The initial coordinate in Point object
 * @param {Point} end - The end coordinate of the line in Point object
 * @param {string} color - Line color, default to blue
 */
function drawLine(start, end, name, color="blue"){
  var line = new createjs.Shape();
  line.graphics.beginStroke(color).moveTo(start.x, start.y).lineTo(end.x, end.y);
  line.name = name;
  lineContainer.addChild(line);
  stage.addChild(lineContainer);
  stage.update();
}

/* Reset canvas by removing all elements in the canvas and set the count pointer back to 0 */
function resetCanvas(){
  stage.removeAllChildren();
  stage.clear();
  points = [];
  pointCount = 0;
}
