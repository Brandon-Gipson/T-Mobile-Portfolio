/*****************************************************************************
*			         CS 419 - Software Projects
*				 Oregon State University - Summer 2016
*     	           WEB 1: Real-Time Strategy Game
*
* Project Team: Xi
* Members: Brandon Gipson, Tom Dale, James Pool
*
* Filename: gameLogic.js
* Version: -
* Description: Tower defense game logic loops
*
*****************************************************************************/

var game_field = document.getElementById('game_field');
var ctx = game_field.getContext('2d');
ctx.shadowBlur = "black";
ctx.shadowBlur = 20;
var frameRate = 30;
var delay = 25;  // Unit Delay <<TEST>>

var renderLoop = function() {
    ctx.beginPath();
    ctx.clearRect(0,0,game_field.width,game_field.height);  //Clear game field+
    //Test to draw tower placing toggle
    newTowerButton.draw();
    // Draw Health
    hearts.draw();
    // Draw Coins
    coins.draw();
    // Draw Units
    for (var i = 0; i < unitList.length; i++) {
        unitList[i].draw();
    }
    // Draw Towers
    for (var i = 0; i < towerList.length; i++) {
        towerList[i].draw();
        // Fire Laser!
        if (towerList[i].target != null) {
            towerList[i].drawLaser();
        }
    }
    if(newTowerButton.press) {
        newTowerButton.drawOutline();
    }
    requestAnimationFrame(renderLoop);  // Loop graphics rendering
};

var logicLoop = function() {
    // Add units to game <<TEST>>
    if (delay < 0) {
        addUnit();
        delay = 25;  // Reset delay
    }
    delay--;
    
    // Replace Hearts
    if (hearts.current <= 0) {
        hearts.current = 5;
    }
    
    // Move units through game field
    for (var i = 0; i < unitList.length; i++) {
        unitList[i].move();
    }
    
    // Have each tower attack if able
    for (var i = 0; i < towerList.length; i++) {
        towerList[i].attack(unitList);
    }
    
    removeDead();  // Remove killed units
    removeTowers();  // Remove obsolete towers
    setTimeout(logicLoop, 1000/frameRate);
};

window.onload = function() {
    loadPath();
    hearts.updateCurrent(5);
    hearts.updateMax(5);
    coins.update(200);
    // Debug waypoint list
    //console.log("Waypoint Lenght: " + waypointList.length);
    //for (var i = 0; i < waypointList.length; i++) {
    //    console.log("Waypoint " + i + ": (" + waypointList[i].x + ", " + waypointList[i].y + ")");
    //}

    setTimeout(logicLoop, 1000/frameRate);
    requestAnimationFrame(renderLoop);  // Start graphics rendering
};