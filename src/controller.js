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

// Light
const DEFAULT_LIGHT = {
    pos: [ 0.0, 0.0, 0.0 ],
    color: [ 1.0, 1.0, 1.0 ],
    minIntensity: 0.0,
    maxIntensity: 50.0,
    defaultIntensity: 4.0
};

// Fresnel
const DEFAULT_FRESNEL = {
    min: 1.0, max: 2.0,
    default: FRESNEL_INDICES.ICE
};

// Sigma
const DEFAULT_SIGMA = {
    min: 0.0, max: 0.5,
    default: 0.5
};

// Samples
const DEFAULT_SAMPLES = {
    min: 1, max: 100,
    default: 1
};

class controller {

    constructor() {
        this.OBJECT             = null;
        this.COLOR              = DEFAULT_OBJ_COLOR;
        this.SCENE              = DEFAULT_SCENE;
        this.FRESNEL_INDICE     = DEFAULT_FRESNEL.default;
        this.SIGMA              = DEFAULT_SIGMA.default;
        this.SAMPLES_NUMBER     = DEFAULT_SAMPLES.default;
        this.isJalon3           = false;
    }

    // Environment

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

    // Configurations
    setDefault() { this.isJalon3 = false; }
    setJalon3() { this.isJalon3 = true; }

    // Options

    setFresnel(fresnel) {
        this.FRESNEL_INDICE =
            (fresnel >= DEFAULT_FRESNEL.min && fresnel <= DEFAULT_FRESNEL.max) ? fresnel : this.FRESNEL_INDICE;
    }

    setSigma(sigma) {
        this.SIGMA =
            (sigma >= DEFAULT_SIGMA.min && sigma <= DEFAULT_SIGMA.max) ? sigma : this.SIGMA;
    }
    
    setSamplesNumber(nbSamples) {
        this.SAMPLES_NUMBER =
            (nbSamples >= DEFAULT_SAMPLES.min && nbSamples <= DEFAULT_SAMPLES.max) ? nbSamples : this.SAMPLES_NUMBER;
    }

    updateValue(target, value) {
        switch (target) {
            case "FRESNEL": this.setFresnel(value); break;
            case "SIGMA": this.setSigma(value); break;
            case "SAMPLES": this.setSamplesNumber(value); break;
        }
    }

    getValue(target) {
        switch (target) {
            case "FRESNEL": return this.FRESNEL_INDICE;
            case "SIGMA": return this.SIGMA;
            case "SAMPLES": return this.SAMPLES_NUMBER;
        }
    }

    getMinValue(target) {
        switch (target) {
            case "FRESNEL": return DEFAULT_FRESNEL.min;
            case "SIGMA": return DEFAULT_SIGMA.min;
            case "SAMPLES": return DEFAULT_SAMPLES.min;
        }
    }

    getMaxValue(target) {
        switch (target) {
            case "FRESNEL": return DEFAULT_FRESNEL.max;
            case "SIGMA": return DEFAULT_SIGMA.max;
            case "SAMPLES": return DEFAULT_SAMPLES.max;
        }
    }

}

var CONTROLLER = new controller();