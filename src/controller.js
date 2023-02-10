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

const DEFAULT_SCENE = 'museum';
const DEFAULT_OBJ_COLOR = [0.0, 0.0, 0.0];

// Refractive index
const DEFAULT_FRESNEL = {
    min: 1.0, max: 2.0,
    default: FRESNEL_INDICES.ICE
};

// Roughness
const DEFAULT_SIGMA = {
    min: 0.0001, max: 0.5,
    default: 0.5
};

// Sampling
const DEFAULT_SAMPLES = {
    min: 1, max: 100,
    default: 1
};

// Light
const DEFAULT_LIGHT = {
    min: 5.0, max: 15.0,
    default: 5.0
};

class controller {

    constructor() {
        this.OBJECT             = null;
        this.COLOR              = DEFAULT_OBJ_COLOR;
        this.SCENE              = DEFAULT_SCENE;
        this.isThereSkybox      = true;
        this.FRESNEL_INDICE     = DEFAULT_FRESNEL.default;
        this.SIGMA              = DEFAULT_SIGMA.default;
        this.SAMPLES_NUMBER     = DEFAULT_SAMPLES.default;
        this.LIGHT_INTENSITY    = DEFAULT_LIGHT.default;
        this.isSampling         = false;
        this.isFrostedMirror    = false;
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
    
    setDefault() { 
        this.isSampling = this.isFrostedMirror = false;
    }

    setSampling() {
        this.isSampling = true;
        this.isFrostedMirror = false;
    }
    
    setFrostedMirror() {
        this.isFrostedMirror = true;
        this.isSampling = false;
    }

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

    setLightIntensity(intensity) {
        this.LIGHT_INTENSITY = intensity < 0 ? this.LIGHT_INTENSITY : intensity;
    }

    updateValue(target, value) {
        switch (target) {
            case "FRESNEL": this.setFresnel(value); break;
            case "SIGMA": this.setSigma(value); break;
            case "SAMPLES": this.setSamplesNumber(value); break;
            case "LIGHT_INTENSITY": this.setLightIntensity(value); break;
        }
        console.log("Update " + target + " to " + value)
    }

    getValue(target) {
        switch (target) {
            case "FRESNEL": return this.FRESNEL_INDICE;
            case "SIGMA": return this.SIGMA;
            case "SAMPLES": return this.SAMPLES_NUMBER;
            case "LIGHT_INTENSITY": return this.LIGHT_INTENSITY;
        }
    }

    getMinValue(target) {
        switch (target) {
            case "FRESNEL": return DEFAULT_FRESNEL.min;
            case "SIGMA": return DEFAULT_SIGMA.min;
            case "SAMPLES": return DEFAULT_SAMPLES.min;
            case "LIGHT_INTENSITY": return DEFAULT_LIGHT.min;
        }
    }

    getMaxValue(target) {
        switch (target) {
            case "FRESNEL": return DEFAULT_FRESNEL.max;
            case "SIGMA": return DEFAULT_SIGMA.max;
            case "SAMPLES": return DEFAULT_SAMPLES.max;
            case "LIGHT_INTENSITY": return DEFAULT_LIGHT.max;
        }
    }

}

var CONTROLLER = new controller();