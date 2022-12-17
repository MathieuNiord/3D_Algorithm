/** @author Frejoux Gaetan, Niord Mathieu */

const FRESNEL_INDICES = {
	"AIR": 1.0,
	"GLASS": 1.5,
	"DIAMOND": 2.42,
	"ICE": 1.31,
	"OIL": 1.46,
	"WATER": 1.33,
	"STEEL": 2.0,
}

const DEFAULT_SCENE = 'yokohama';
const DEFAULT_OBJ_COLOR = [0.8, 0.4, 0.4];
const DEFAULT_FRESNEL = { min: 1.0, max: 2.0, default: FRESNEL_INDICES.AIR };
const DEFAULT_SIGMA = { min: 0.0, max: 0.5, default: 0.5 };
const DEFAULT_LIGHT = { pos: [ 0.0, 0.0, 0.0 ], color: [ 1.0, 1.0, 1.0 ] };
const DEFAULT_LIGHT_INTENSITY = { min: 0.0, max: 50.0, default: 1.0 };

class controller {

    constructor() {
        this.OBJECT             = null;
        this.COLOR              = DEFAULT_OBJ_COLOR;
        this.SCENE              = DEFAULT_SCENE;
        this.FRESNEL_INDICE     = DEFAULT_FRESNEL.default;
        this.SIGMA              = DEFAULT_SIGMA.default;
        this.LIGHT_POSITION     = DEFAULT_LIGHT.pos;
        this.LIGHT_COLOR        = DEFAULT_LIGHT.color;
        this.LIGHT_INTENSITY    = DEFAULT_LIGHT_INTENSITY.default;
        this.isTherePlane       = false;
        this.isThereSkybox      = true;
        this.isMirroring        = false;
        this.isTransmitting   = false;
        this.isCookTorrance   = false;
    }

    setObject(object) {
        this.OBJECT =
            (object !== this.OBJECT) ? object : this.OBJECT;
    }

    setScene(scene) {
        this.SCENE =
            (scene !== this.SCENE) ? scene : this.SCENE;
    }

    setColor(color) {
        let newColor = hexToRgb(color);
        this.COLOR =
            (newColor !== this.COLOR) ? newColor : this.COLOR;
    }

    setLightPosition(position) {
        this.LIGHT_POSITION =
            (position !== this.LIGHT_POSITION) ? position : this.LIGHT_POSITION;
    }

    setLightColor(color) {
        let newColor = hexToRgb(color);
        this.LIGHT_COLOR =
            (newColor !== this.LIGHT_COLOR) ? newColor : this.LIGHT_COLOR;
    }

    setLightIntensity(intensity) {
        this.LIGHT_INTENSITY =
            (intensity >= DEFAULT_LIGHT_INTENSITY.min && intensity <= DEFAULT_LIGHT_INTENSITY.max) ? intensity : this.LIGHT_INTENSITY;
    }

    setFresnel(fresnel) {
        this.FRESNEL_INDICE =
            (fresnel >= DEFAULT_FRESNEL.min && fresnel <= DEFAULT_FRESNEL.max) ? fresnel : this.FRESNEL_INDICE;
    }

    setSigma(sigma) {
        this.SIGMA =
            (sigma >= DEFAULT_SIGMA.min && sigma <= DEFAULT_SIGMA.max) ? sigma : this.SIGMA;
    }

    updateValue(target, value) {
        switch (target) {
            case "FRESNEL": this.setFresnel(value); break;
            case "SIGMA": this.setSigma(value); break;
            case "INTENSITY": this.setLightIntensity(value); break;
        }
    }

    getValue(target) {
        switch (target) {
            case "FRESNEL": return this.FRESNEL_INDICE;
            case "SIGMA": return this.SIGMA;
            case "INTENSITY": return this.LIGHT_INTENSITY;
        }
    }

}

var CONTROLLER = new controller();