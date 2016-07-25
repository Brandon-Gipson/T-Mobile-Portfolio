/*****************************************************************************
*			         CS 419 - Software Projects
*				 Oregon State University - Summer 2016
*     	           WEB 1: Real-Time Strategy Game
*
* Project Team: Xi
* Members: Brandon Gipson, Tom Dale, James Pool
*
* Filename: gameColors.js
* Version: 0a
* Description: Color selection for units based on attribute points
*
*****************************************************************************/

var maxPoints = 3;  // Maximum number of points allowed

/*****************************************************************************
*                               getColor
* 
* Description: Calculates the RGB Hex color for an object based on the passed
*       point values. Gradient from white to black. It calculates the HSL value
*       then has it converted to RGB.
* Input: R - Red point value
*        G - Green point value
*        B - Blue point value
* Returns: Hex Color as string
* 
* Referance: http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
*****************************************************************************/
function getColor(R, G, B) {
    /* Verify input parameter range */
    R = limitColor(R);
    G = limitColor(G);
    B = limitColor(B);
    
    /*--- Calculate HSL Color ---*/
    /* Calculate min and max */
    var min = Math.min(R,G,B);
    var max = Math.max(R,G,B);
    
    /* Calculate Luminace */
    var Lum = 1 - (min + max) / (2 * maxPoints);  // Decimal form
    
    /* Calculate Saturation */
    var Sat = 0;
    if (max != 0) {  // Catch divide by zero
        if (Lum < 0.5) {
            Sat = (max - min) / (max + min);
        }
        else {
            Sat = (max - min) / (2.0 * maxPoints - max - min);
        }
    }
    
    /* Calculate Hue */
    var Hue = 0;
    if ((max - min) != 0) {  // Catch divide by zero
        if (max == R) {  // Red is max
            Hue = (G-B) / (max-min);
        }
        else if (max == G) {  // Green is max
            Hue = (B-R) / (max-min) + 2;
        }
        else {  // Blue is max
            Hue = (R-G) / (max-min) + 4;
        }
    }
    Hue *= 60;  // Convert to degrees
    if (Hue < 0) {  // Fix negative values
        Hue += 360;
    }
    
    /*--- Convert HSL to RGB ---*/
    [R,G,B] = hslToRgb(Hue / 360, Sat, Lum);  // Convert to RGB Color [0 .. 255]
    return rgbToHex(R,G,B);  // Return color string
}

/*****************************************************************************
* Limit Color Function: Limits color points to [0 .. maxPoints]
*****************************************************************************/
function limitColor(X) {
    if (X > maxPoints) {
        X = maxPoints;
    }
    else if (X < 0) {
        X = 0;
    }
    return X;
}


/*****************************************************************************
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 * 
 * Code from: http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
*****************************************************************************/
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/*****************************************************************************
 * Converts RGB integers [0 .. 255] to HEX string
 * 
 * Code from: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
*****************************************************************************/
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}