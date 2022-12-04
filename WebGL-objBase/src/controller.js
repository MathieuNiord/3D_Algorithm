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
const DEFAULT_SIGMA     = { min: 0.0, max: 0.5, default: 1.0 };

class controller {

    constructor() {
        this.currentObject = null;
        this.currentColor = DEFAULT_COLOR;
        this.currentScene = DEFAULT_SCENE;
        this.isTherePlane = false;
        this.isThereSkybox = true;
        this.isMirroring = false;
        this.isTransmitting = false;
        this.isCookTorrance = false;
        this.FRESNEL_INDICE = DEFAULT_FRESNEL.default;
        this.SIGMA = DEFAULT_SIGMA.default;
    }

    setObject(object) {
        this.currentObject =
            (object !== this.currentObject) ? object : this.currentObject;
    }

    setScene(scene) {
        this.currentScene =
            (scene !== this.currentScene) ? scene : this.currentScene;
    }

    setColor(color) {
        let newColor = hexToRgb(color);
        this.currentColor =
            (newColor !== this.currentColor) ? newColor : this.currentColor;
    }

    setFresnel(fresnel) {
        this.FRESNEL_INDICE =
            (fresnel >= DEFAULT_FRESNEL.min && fresnel <= DEFAULT_FRESNEL.max) ? fresnel : this.FRESNEL_INDICE;
    }

    setSigma(sigma) {
        console.log("set sigma" + sigma);
        this.SIGMA =
            (sigma >= DEFAULT_SIGMA.min && sigma <= DEFAULT_SIGMA.max) ? sigma : this.SIGMA;
    }

    updateValue(target, value) {
        console.log("update value" + value);
        switch (target) {
            case "FRESNEL": this.setFresnel(value); break;
            case "SIGMA": this.setSigma(value); break;
        }
    }

}

var CONTROLLER = new controller();