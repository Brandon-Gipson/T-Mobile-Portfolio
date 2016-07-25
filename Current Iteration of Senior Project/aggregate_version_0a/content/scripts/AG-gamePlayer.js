/*****************************************************************************
*			         CS 419 - Software Projects
*				 Oregon State University - Summer 2016
*     	           WEB 1: Real-Time Strategy Game
*
* Project Team: Xi
* Members: Brandon Gipson, Tom Dale, James Pool
*
* Filename: gamePlayer.js
* Version: 0
* Description: Player class to hold game parameters
*
*****************************************************************************/

function Player() {
    
    //player parameters
    this.maxhealth = 5;
    this.health = 5;
    this.waveNumber = 0;
    this.coins = 500;
    this.towerList = [];
    
};


//function to save player parameters to database
Player.prototype.saveGame = function(){
  
};

//function to load player parameters from database
Player.prototype.loadGame = function() {

};

//function that will load in the player params to the game
function loadPlayer() {
    var player = new Player;
    towerList = player.towerList;
    hearts.updateCurrent(player.health);
    hearts.updateMax(player.maxhealth);
    coins.update(player.coins);
}