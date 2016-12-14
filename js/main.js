// Get elements
canvas = document.getElementById("mainCanvas");
resetButton = document.getElementById("resetCanvas");
var info_point = [];
info_point[0] = document.getElementById("point1");
info_point[1] = document.getElementById("point2");
info_point[2] = document.getElementById("point3");
info_point[3] = document.getElementById("point4");
info_area = document.getElementById("area");

// Canvas initialization
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
window.onresize = function(event) {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
};
var stage = new createjs.Stage("mainCanvas");
stage.enableMouseOver(10);
stage.mouseMoveOutside = true;
createjs.Touch.enable(stage);

update = true; // to update tick
pointCount = 0; // corner point counter
points = []; // corner points in Point object
var lineContainer = new createjs.Container(); // to contain all the paralellogram lines

resetButton.addEventListener("click",resetCanvas);
canvas.addEventListener("click", function(event){
  if(pointCount < 3){
    drawPoint(event.clientX, event.clientY);
    if(pointCount == 3){
      drawParalellogram();
    }
  }
});

/**
 * Draw a point in the canvas
 * @param {int} x - The x coordinate of the point
 * @param {int} y - The y coordinate of the point
 * @param {string} color - Point color, default to red
  * @param {boolean} isCorner - By default, set the point to be the corner point
 */
function drawPoint(x, y, color="red", isCorner=true){

  // point initialization
  var point = new createjs.Shape();
  point.graphics.beginStroke(color).beginFill("rgba(255,255,255,0.5)").drawCircle(0, 0, 11);
  point.x = x; point.y = y;
  isCorner ? point.cursor = "pointer" : point.cursor = "move";

  // set parent point and offset on mousedown
  point.on("mousedown", function (evt) {
    this.parent.addChild(this);
    this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
  });

  if(isCorner){
    points[pointCount] = new createjs.Point(x, y); // save the new Point coordinate to the points array
    point.name = "corner"+pointCount; point.id = pointCount;

    info_point[pointCount].innerHTML = `Point ${pointCount+1}: (${x},${y})`;
    info_point[pointCount].className = 'active';

    pointCount += 1;

    // point drag and drop even handler
    point.on("pressmove", function (evt) {
      // save current location to temporary variable
      thisPrevX = this.x;
      thisPrevY = this.y;

      // set new location for the point
			this.x = evt.stageX + this.offset.x;
      this.y = evt.stageY + this.offset.y;

      // count the difference between the old and new location to be used later on
      deltaX = this.x - thisPrevX;
      deltaY = this.y - thisPrevY;

			// indicate that the stage should be updated on the next tick:
			update = true;

      // set te affected point, the adjacent point will move according to the corresponding point
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

      setPoints(); // set all new point locations to the points array

      // set new center point
      centerPoint = stage.getChildByName("center");
      centerPoint.x = points[0].x + ((points[2].x - points[0].x) / 2);
      centerPoint.y = points[0].y + ((points[2].y - points[0].y) / 2);

      // write the new location points on the info bar
      info_point[point.id].innerHTML = `Point ${point.id}: (${this.x},${this.y})`;
      info_point[affectedPointId].innerHTML = `Point ${affectedPointId}: (${affectedPoint.x},${affectedPoint.y})`;

      drawParalellogram(true); // redraw the paralellogram based on the location of all the points

		});
  }
  else{
    point.name = "center";

    point.on("pressmove", function (evt) {
      // save current location to temporary variable
      thisPrevX = this.x;
      thisPrevY = this.y;

      // set new location for the point
			this.x = evt.stageX + this.offset.x;
      this.y = evt.stageY + this.offset.y;

      // count the difference between the old and new location to be used later on
      deltaX = this.x - thisPrevX;
      deltaY = this.y - thisPrevY;

			// indicate that the stage should be updated on the next tick:
			update = true;

      // set new coordinate for all four points
      for(var i=0; i < 4; i++){
        affectedPoint = stage.getChildByName("corner"+i);
        affectedPoint.x = affectedPoint.x + deltaX;
        affectedPoint.y = affectedPoint.y + deltaY;
        info_point[i].innerHTML = `Point ${i}: (${affectedPoint.x},${affectedPoint.y})`;
      }

      setPoints();// set all new point locations to the points array

      drawParalellogram(true); // redraw the paralellogram based on the location of all the points

		});
  }

  stage.addChild(point); // put the point on stage
  stage.update(); // update the stage canvas
}

 /**
  * Draw paralellogram on the canvas based on the given 3 points
  * @param {boolean} isRedraw - There are a little bit of different when firing this on the first time and when fireing it to redraw the paralellogram after some drag and drop event
  */
function drawParalellogram(isRedraw=false){
  // remove all existing lines on the paralellogram to be redrawed
  lineContainer.removeAllChildren();

  // set the coordinate for the fourth point of the paralellogram to be drawed
  points[3] = new createjs.Point(points[2].x - (points[1].x - points[0].x), points[2].y - (points[1].y - points[0].y));


  if(!isRedraw){
    // draw the 4th point
    drawPoint(points[3].x, points[3].y);
    // draw the center point
    drawPoint(points[0].x + ((points[2].x - points[0].x) / 2), points[0].y + ((points[2].y - points[0].y) / 2), "gold", false);
  }

  // draw all four side lines of the paralellogram
  for(i=0; i<points.length-1; i++){
    drawLine(points[i], points[i+1], "sideline"+i);
  }
  drawLine(points[3], points[0], "sideline3");

  // draw two crossing lines inside the paralellogram
  drawLine(points[0], points[2], "crossline1", "#ddd");
  drawLine(points[1], points[3], "crossline2", "#ddd");

  // show paralellogram are on the infobar
  info_area.innerHTML = 'Area: '+calculateArea();
  info_area.className = 'active';

  // heartbeat broadcast at a set interval
  createjs.Ticker.addEventListener("tick", tick);
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

/**
 * Calculate the area of the paralellogram
 */
function calculateArea(){
  // get all points
  pointObjects = [];
  for(var i=0; i<4; i++){
    pointObjects[i] = stage.getChildByName("corner"+i);
    points[i] = new createjs.Point(pointObjects[i].x, pointObjects[i].y);
  }

  // pythagoras to get height
  heightX = Math.abs(points[0].x - points[3].x);
  heightY = Math.abs(points[0].y - points[3].y);
  height = Math.sqrt(Math.pow(heightX, 2) + Math.pow(heightY, 2));

  // pythagoras to get width
  widthX = Math.abs(points[2].x - points[3].x);
  widthY = Math.abs(points[2].y - points[3].y);
  width = Math.sqrt(Math.pow(widthX, 2) + Math.pow(widthY, 2));

  return Math.round(width * height);
}

/**
 * Save new coordinates of all the points after movement
 */
function setPoints(){
  pointObjects = [];
  for(var i=0; i<4; i++){
    pointObjects[i] = stage.getChildByName("corner"+i);
    points[i] = new createjs.Point(pointObjects[i].x, pointObjects[i].y);
  }
}

/* Reset canvas by removing all elements in the canvas and set the count pointer back to 0 */
function resetCanvas(){
  stage.removeAllChildren();
  stage.clear();
  points = [];
  pointCount = 0;

  for(var i = 0; i < 4; i++){
    info_point[i].innerHTML = "";
    info_point[i].className = "";
  }

  info_area.innerHTML = "";
  info_area.className = "";
}

/**
 * Centralized heartbeat broadcast
 * @param {Event} event - The current event
 */
function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
}
