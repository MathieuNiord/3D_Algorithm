const DEFAULT_SCENE = 'yokohama';
const DEFAULT_COLOR = [0.8, 0.4, 0.4];

const FRESNEL_INDICES = {
	"AIR": 1.0,
	"GLASS": 1.5,
	"DIAMOND": 2.42,
	"ICE": 1.31,
	"OIL": 1.46,
	"WATER": 1.33,
	"STEEL": 2.0,
}

const DEFAULT_FRESNEL   = { min: 1.0, max: 2.0, default: FRESNEL_INDICES.AIR };
const DEFAULT_SIGMA     = { min: 0.0, max: 0.5, default: 0.5 };
const DEFAULT_LIGHT     = { pos: [ 0.0, 0.0, 0.0 ] };

class controller {

    constructor() {
        this.OBJECT = null;
        this.COLOR = DEFAULT_COLOR;
        this.SCENE = DEFAULT_SCENE;
        this.LIGHT_POSITION = DEFAULT_LIGHT.pos;
        this.FRESNEL_INDICE = DEFAULT_FRESNEL.default;
        this.SIGMA = DEFAULT_SIGMA.default;
        this.isTherePlane = false;
        this.isThereSkybox = true;
        this.isMirroring = false;
        this.isTransmitting = false;
        this.isCookTorrance = false;
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

    setFresnel(fresnel) {
        this.FRESNEL_INDICE =
            (fresnel >= DEFAULT_FRESNEL.min && fresnel <= DEFAULT_FRESNEL.max) ? fresnel : this.FRESNEL_INDICE;
    }

    setSigma(sigma) {
        this.SIGMA =
            (sigma >= DEFAULT_SIGMA.min && sigma <= DEFAULT_SIGMA.max) ? sigma : this.SIGMA;
    }

    updateValue(target, value) {
        console.log("update value" + value);
        switch (target) {
            case "FRESNEL": this.setFresnel(value); break;
            case "SIGMA": this.setSigma(value); break;
            case "LIGHT_POS_X": this.setLightPosition([value, this.LIGHT_POSITION[1], this.LIGHT_POSITION[2]]); break;
            case "LIGHT_POS_Y": this.setLightPosition([this.LIGHT_POSITION[0], value, this.LIGHT_POSITION[2]]); break;
            case "LIGHT_POS_Z": this.setLightPosition([this.LIGHT_POSITION[0], this.LIGHT_POSITION[1], value]); break;
        }
    }

}

var CONTROLLER = new controller();