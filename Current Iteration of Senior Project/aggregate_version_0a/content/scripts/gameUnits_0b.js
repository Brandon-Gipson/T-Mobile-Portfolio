/*****************************************************************************
*			         CS 419 - Software Projects
*				 Oregon State University - Summer 2016
*     	           WEB 1: Real-Time Strategy Game
*
* Project Team: Xi
* Members: Brandon Gipson, Tom Dale, James Pool
*
* Filename: gameUnits.js
* Version: 0b
* Description: Tower defense unit class and associated functions
*
*****************************************************************************/

/* List for current units in game */
var unitList = [];

/************************** Unit Superclass *********************************/
function unit() {
    // Movement variables
    this.x = 0;  // left point
    this.y = 0;  // top point
    this.speed = 1;  // Unit movement speed [pixels per frame]
    this.waypoint = 1;  // Waypoint 0 is starting location
    this.escape = false;  // Set to true if unit escapes
    this.value = 1;
    
    // Visual properties
    this.color = 'gray';
    this.height = 20;
    this.width = 20;
    
    // Unit health
    this.maxhealth = 10;
    this.health = 10;
}

/************************** Unit Superclass Methods *************************/
/* Set Health Function */
unit.prototype.setFullHealth = function(hp) {
    this.maxhealth = hp;
    this.health = hp;
};

/* Logic Function: Calculate unit movement */
unit.prototype.move = function() {
    ManhattanPath(this);  // Use Manhattan Pathing Algorithm
};

/* Rendering Function: Draws the unit with a health bar */
unit.prototype.draw = function() {
    // Calculate unit top-left point
    var Px = this.x - this.width/2;
    var Py = this.y - this.height/2;
    
    //--- Draw unit ---
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(Px, Py, this.width, this.height);
    
    //--- Draw health bar ---
    var Hx = Px + 1;  // Health bar left edge
    var Hy = Py + this.width / 3;  // Health bar upper edge
    var Hw = this.width - 2;  // Health bar width
    var Hh = this.height / 3;  // Health bar height
    var Hp = this.health / this.maxhealth;  // Health percentage
    
    // Health bar background
    ctx.fillStyle = '#DEDEDE';  // Light Gray
    ctx.fillRect(Hx, Hy, Hw, Hh);
    
    // Health bar contents
    if (Hp > 0.5) {  // Green (>50%) = #7EE319
        ctx.fillStyle = '#7EE319';
    }
    else if (Hp > 0.25) { // Yellow (>25%) = #D4BF24
        ctx.fillStyle = '#D4BF24';
    }
    else { // Red (>0%) = #FF4747
        ctx.fillStyle = '#FF4747';
    }
    ctx.fillRect(Hx, Hy, Hw * Hp, Hh);
    
    // Health bar outline
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'black';
    ctx.strokeRect(Hx, Hy, Hw, Hh);
};

/*********************** Unit Utility Functions *****************************/
var addUnit = function() {
    // Randomly select a new unit from availible units
    var newUnit;
    var newUnitType = Math.floor(Math.random() * unitTypeList.length);
    newUnit = new unitTypeList[newUnitType]();
    
    // Set initial waypoint
    newUnit.x = waypointList[0].x;
    newUnit.y = waypointList[0].y;
    
    unitList.push(newUnit);  // Add unit to unit list
};

var removeDead = function() {
    // Remove units from end to beginning
    for (var i = unitList.length - 1; i >= 0; i--) {
        if (unitList[i].escape) {  // Unit escapes
            hearts.current -= 1;  // Remove a heart
            unitList.splice(i,1);  // Remove unit
        }
        else if (unitList[i].health <= 0) {  // Unit is killed
            coins.amount += unitList[i].value;
            unitList.splice(i,1);  // Remove unit
        }
    }
};

/************************** Unit Subclasses *********************************/
// List of available units
var unitTypeList = [redBlock, greenBlock, blueBlock];

/* Red Block Unit */
function redBlock() {
    unit.call(this);  // Call unit superclass constructor
    // Set Red Block Parameters
    this.color = 'red';
    this.setFullHealth(50);
    this.height = 25;
    this.width = 25;
    this.speed = 0.8;
    this.value = 5;
}
redBlock.prototype = Object.create(unit.prototype);

/* Green Block Unit */
function greenBlock() {
    unit.call(this);  // Call unit superclass constructor
    // Set Green Block Parameters
    this.color = 'green';
    this.setFullHealth(15);
    this.height = 15;
    this.width = 15;
    this.speed = 2;
    this.value = 1;
}
greenBlock.prototype = Object.create(unit.prototype);

/* Blue Block Unit */
function blueBlock() {
    unit.call(this);  // Call unit superclass constructor
    // Set Blue Block Parameters
    this.color = 'blue';
    this.setFullHealth(30);
    this.speed = 1;
    this.value = 2;
}
blueBlock.prototype = Object.create(unit.prototype);




