/*****************************************************************************
*			         CS 419 - Software Projects
*				 Oregon State University - Summer 2016
*     	           WEB 1: Real-Time Strategy Game
*
* Project Team: Xi
* Members: Brandon Gipson, Tom Dale, James Pool
*
* Filename: gameTowers.js
* Version: 0b
* Description: Tower defense tower class and associated functions
*
*****************************************************************************/

/* List for current units in game */
var towerList = [];

/************************* Tower Superclass *********************************/
function tower(x,y) {
    // Placement variables
    this.x = x; // left point
    this.y = y;  // top point
    this.cost = 1;
    
    // Visual Properties
    this.towerColor = 'gray';
    this.width = 40;
    this.height = 40;
    this.centerX = this.x + (this.width / 2);
    this.centerY = this.y + (this.height / 2);
    
    // Tower Attack Attributes
    this.laserColor = 'gray';
    this.laserWidth = 1;
    this.damage = 1;
    this.fireRateMax = 3;      //value you trigger when tower shoots
    this.fireRateCount = 0;    //counter used to know when to fire
    this.range = 100;
    this.removeTower = false;  // Set to true have tower removed
    this.target = null;
  
    // Tower Upgrade Gems
    this.slot1 = {
        color: "gray",
    };
    this.slot2 = {
        color: "gray"
    };
    this.slot3 = {
        color: "gray",
    };
}

/************************* Tower Superclass Methods *************************/
/* Clear designated gem slot (set to gray) */
tower.prototype.clearGem = function(slotNumber) {
    if(slotNumber == 1) {
        this.slot1.color = "gray";
    }
    
    if(slotNumber == 2) {
        this.slot2.color = "gray";
    }
    
    if(slotNumber == 3) {
        this.slot3.color = "gray";
    }
};

/* Set designated gem slot (gemColor is a string) */
tower.prototype.updateGem = function(gemColor, slotNumber) {
    if(slotNumber == 1) {
        this.slot1.color = gemColor;
    }
    
    if(slotNumber == 2) {
        this.slot2.color = gemColor;
    }
    
    if(slotNumber == 3) {
        this.slot3.color = gemColor;
    }
};

/* Rendering Function: Draws the tower and gems onto the canvas */
tower.prototype.draw = function() {
    //The tower image is created below
    ctx.fillStyle=this.towerColor;
    ctx.fillRect(this.x, this.y, this.height, this.width);
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'black';
    ctx.strokeRect(this.x, this.y, this.height, this.width);
    
    //These draw the various gems in their slots
    ctx.fillStyle = this.slot1.color;
    ctx.fillRect(this.x + 16, this.y + 9, 10, 10);
    ctx.fillStyle=this.slot2.color;
    ctx.fillRect(this.x + 8, this.y + 22, 10, 10);
    ctx.fillStyle=this.slot3.color;
    ctx.fillRect(this.x + 22, this.y + 22, 10, 10);
};
  
/* Rendering Function: Draws the laser from tower to the enemy */
tower.prototype.drawLaser = function() {
    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(this.target.x, this.target.y);
    ctx.strokeStyle = this.laserColor;
    ctx.lineWidth = this.laserWidth;
    ctx.stroke();
}
  
/* Logic Function: Deals damage to a targeted unit */
tower.prototype.shoot = function(){
    //do damage to unit
    this.target.health = this.target.health - this.damage;
    
    //set to 0 for logic loop to know to clean up unit remove from towers target
    if (this.target.health <= 0) {
        this.target.health = 0;
        this.target = null;
    }
};
  
/* Logic Function: Target unit and attack if unit is in range */
tower.prototype.attack = function(unitList){
    var tower = this;
    //check range of current target first
    
    //check if even fires based on rate of fire before runs any code
    //if count less than max increment
    if (tower.fireRateCount < tower.fireRateMax) {
        tower.fireRateCount++;
    }
    
    //check if in range then shoot
    else {
    
        if (tower.target != null) {
            var distSq = Math.pow((tower.x - tower.target.x), 2) + Math.pow((tower.y - tower.target.y), 2);
            //if not in range anymore remove target (range less than distance)
            if (Math.pow(tower.range, 2) < distSq){
                tower.target = null;
            }
        }
        
        //if doesnt have a target find one
        if (tower.target == null) {
            for (var i = 0; i < unitList.length; i++){
                //calculate distance from tower x.y to unit x.y
                distSq = Math.pow((tower.x - unitList[i].x), 2) + Math.pow((tower.y - unitList[i].y), 2);
                //check if within tower range
                if (Math.pow(tower.range, 2) > distSq){
                    //set the unit as the towers target
                    tower.target = unitList[i];
                    break;
                }
            }
        }
        
        //if the unit was in range, or found a new target shoot
        if (tower.target != null){
            tower.fireRateCount = 0;
            tower.shoot();
        }
    }
};

/********************** Tower Utility Functions *****************************/
/* Places a tower at specified (x, y) and adds to tower list */
var placeTower = function(x, y, type) {
    var newTower;
    type = type || 0;  // If no type is provided, default to 0
    newTower = new towerTypeList[type](x,y);  // Create new tower of base type
    towerList.push(newTower);  // Add new tower to tower list
    coins.amount -= newTower.cost;  // Subtract tower cost
};

/* Removes a tower and refunds some resources [NEED TO DO] */
var removeTowers = function() {
     for (var i = towerList.length - 1; i >= 0; i--) {
         if (towerList[i].removeTower) {
             towerList.splice(i,1);
         }
     }
};

/************************* Tower Subclasses *********************************/
// List of available towers
var towerTypeList = [baseTower];

/* Base Tower */
function baseTower(x,y) {
    tower.call(this, x, y);  // Call tower superclass constructor
    this.towerColor = 'gray';
    this.laserColor = 'red';
    this.damage = 2;
    this.cost = 100;
}
baseTower.prototype = Object.create(tower.prototype);