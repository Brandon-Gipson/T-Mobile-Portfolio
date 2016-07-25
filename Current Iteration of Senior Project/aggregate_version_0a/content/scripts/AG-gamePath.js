/*****************************************************************************
*			         CS 419 - Software Projects
*				 Oregon State University - Summer 2016
*     	           WEB 1: Real-Time Strategy Game
*
* Project Team: Xi
* Members: Brandon Gipson, Tom Dale, James Pool
*
* Filename: gamePath.js
* Version: -
* Description: Tower defense game path logic
*
*****************************************************************************/

// Array storing function from: 
// http://stackoverflow.com/questions/7030229/storing-coordinates-in-array-in-javascript

var waypointList = [];  // Create empty list

// Function to add additional waypoints
function addWaypoint(xVal, yVal ,array) {
    array.push({x: xVal, y: yVal});
}

function loadPath() {
    // Path points for 'DefaultBackground.png'
    addWaypoint(0, 455, waypointList);  // Starting Location
    addWaypoint(255, 455, waypointList);
    addWaypoint(255, 155, waypointList);
    addWaypoint(875, 155, waypointList);
    addWaypoint(875, 455, waypointList);
    addWaypoint(1120, 455, waypointList);  // End Point
};

// Manhattan Path Algorithm - Pauses at waypoint if would pass
function ManhattanPath(u) {
    // Setup pathing variables
    var xWay = waypointList[u.waypoint].x;
    var yWay = waypointList[u.waypoint].y;
    var xDist = Math.abs(xWay - u.x);
    var yDist = Math.abs(yWay - u.y);
    var xDir = (xWay - u.x) > 0 ? 1 : -1;
    var yDir = (yWay - u.y) > 0 ? 1 : -1;
    
    // Debug Lines
    //console.log("Waypoint " + u.waypoint + ": (" + xWay + ", " + yWay + ") - Unit: (" + u.x + ", " + u.y + ")");
    //console.log("Distance: (" + xDist + ", " + yDist + ") - Direction: (" + xDir + ", " + yDir + ")");
    
    // Check if waypoint is reached
    if ((xDist <= 0) && (yDist <= 0)) {
        //console.log("Next waypoint ... ");
        u.waypoint++;  // Move to next waypoint
        if (u.waypoint == waypointList.length) { // Check if unit reached end
            u.escape = true;
            return;
        }
    }
    
    // Move unit towards waypoint
    if (xDist >= yDist) {
        u.x += u.speed * xDir; // Move in x direction
        if ((xWay * xDir) < (u.x * xDir)) {  // Check if passed waypoint
            u.x = xWay;
        }
    }
    else {  // xDist < yDist
        u.y += u.speed * yDir; // Move in y direction
        if ((yWay * yDir) < (u.y * yDir)) {  // Check if passed waypoint
            u.y = yWay;
        }
    }
}