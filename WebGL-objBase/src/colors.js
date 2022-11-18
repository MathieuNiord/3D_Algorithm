const Colors = {
    "black": [0, 0, 0],
    "white": [1.0, 1.0, 1.0],
    "red": [1.0, 0, 0],
    "green": [0, 1.0, 0],
    "blue": [0, 0, 1.0],
    "yellow": [1.0, 1.0, 0],
    "cyan": [0, 1.0, 1.0],
    "magenta": [1.0, 0, 1.0],
    "gray": [0.5, 0.5, 0.5],
    "darkgray": [0.25, 0.25, 0.25],
    "lightgray": [0.75, 0.75, 0.75],
    "orange": [1.0, 0.5, 0],
    "purple": [0.5, 0, 0.5],
    "brown": [0.5, 0.25, 0],
    "pink": [1.0, 0.75, 0.75],
    "lightblue": [0.75, 0.75, 1.0],
    "lightgreen": [0.75, 1.0, 0.75],
    "lightyellow": [1.0, 1.0, 0.75],
    "lightcyan": [0.75, 1.0, 1.0],
    "lightmagenta": [1.0, 0.75, 1.0],
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16)/255.0,
      parseInt(result[2], 16)/255.0,
      parseInt(result[3], 16)/255.0
     ] : [0.8, 0.4, 0.4];
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(colorArray) {
    return "#"
            + componentToHex(colorArray[0] * 250)
            + componentToHex(colorArray[1] * 250)
            + componentToHex(colorArray[2] * 250)
    ;
}