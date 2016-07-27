/*****************************************************************************
*			         CS 419 - Software Projects
*				 Oregon State University - Summer 2016
*     	           WEB 1: Real-Time Strategy Game
*
* Project Team: Xi
* Members: Brandon Gipson, Tom Dale, James Pool
*
* Filename: gameWaves.js
* Version: 0
* Description: Waves Class to track waves of units in games
*
*****************************************************************************/

var curWave = null;

function wave(){
    this.units = [];
    this.healthMod = 0;
    this.unitCount = 0;
    this.waveNumber = 0;
}

//function that spawns a random unit from unit list
function spawnUnit(wave) {
    
    //pick a random unit from count then dec count
    
    if (wave.unitCount > 0) {
        
        //pick a random unit availble 1-unitCount
        var choice = (Math.floor(Math.random() * wave.unitCount)+1);
        
    
        for (var i = 0; i < wave.units.length; i++){
            if (choice <= wave.units[i].count) {
                //remove a unit from that type
                wave.units[i].count--;
                //spawn that unit
        
                addUnit(wave.units[i].r, wave.units[i].g, wave.units[i].b, wave.healthMod);
                break;    
            
            }
            else {
                choice -= wave.units[i].count;
            }
        }
        //decrement total unit count
        wave.unitCount--;
    }
    else {
        
    }
}


//creates a wave to be used
function createWave(waveNumber){
    this.waveNumber = waveNumber;
    this.units = waveUnits[waveNumber];
    this.healthMod = 1 + ((0.1)*waveNumber);
    this.unitCount = 0;
    for (var i = 0; i < this.units.length; i++){
        this.unitCount += this.units[i].count;
    }
    return this;
}
createWave.prototype = Object.create(wave.prototype);


//wave unit information
var waveUnits = [];

//wave 0
waveUnits.push(
    [
        {count: 55, r: 0, g: 0, b: 0},
        {count: 15, r: 1, g: 0, b: 0},
        {count: 15, r: 0, g: 1, b: 0},
        {count: 15, r: 0, g: 0, b: 1}
    ]
);
//wave 1
waveUnits.push(
    [
        {count: 25, r: 0, g: 0, b: 0},
        {count: 25, r: 1, g: 0, b: 0},
        {count: 25, r: 0, g: 1, b: 0},
        {count: 25, r: 0, g: 0, b: 1}
    ]
);

waveUnits.push(
    [
        {count: 10, r: 0, g: 0, b: 0},
        {count: 20, r: 1, g: 0, b: 0},
        {count: 20, r: 0, g: 1, b: 0},
        {count: 20, r: 1, g: 0, b: 1},
        {count: 10, r: 2, g: 0, b: 0},
        {count: 10, r: 0, g: 2, b: 0},
        {count: 10, r: 0, g: 0, b: 2}
    ]
);

/*
waveUnits.push(
    [
        {count: , r: , g: , b: },
        {count: , r: , g: , b: },
        {count: , r: , g: , b: },
        {count: , r: , g: , b: },
        {count: , r: , g: , b: },
        {count: , r: , g: , b: }
    
    ]
);
*/