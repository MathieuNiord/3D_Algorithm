/** @author Frejoux Gaetan, Niord Mathieu */

let doc = document;

let openMenuBtn = doc.getElementById('open_menu_btn');
let closeBtn = doc.getElementById('close_menu_btn');
let menu = doc.getElementById('menu__content');
let dropdowns = doc.getElementsByClassName('dropdown');

// Selectors / Mutators
let selects = doc.getElementsByClassName('selector');
let planeToggle = doc.getElementById('plane_checkbox');
let modelColorPicker = doc.getElementById('model_color');
let frostedMirrorModeCheckbox = doc.getElementById('frosted_checkbox');
let skyboxCheckBox = doc.getElementById('skybox_checkbox');

// Sliders
// ==========================================================
let fresnelSlider = doc.getElementById('fresnel_coeff');
let fresnelValue = doc.getElementById('fresnel_coeff_value');
let sigmaSlider = doc.getElementById('sigma_range_select');
let sigmaValue = doc.getElementById('sigma_value');
let samplingSlider = doc.getElementById('sampling_range_select');
let samplingValue = doc.getElementById('sampling_value');
let lightIntensitySlider = doc.getElementById('intensity_range_select');
let lightIntensityValue = doc.getElementById('intensity_value');

const controllerUpdatersConfig = [
    { slider: fresnelSlider,        numberInput: fresnelValue,          target: 'FRESNEL'           },
    { slider: sigmaSlider,          numberInput: sigmaValue,            target: 'SIGMA'             },
    { slider: samplingSlider,       numberInput: samplingValue,         target: 'SAMPLES'           },
    { slider: lightIntensitySlider, numberInput: lightIntensityValue,   target: 'LIGHT_INTENSITY'   }
];
// ==========================================================

// Gallery
let gallery = doc.getElementById('gallery');

// Loaders
const ObjectLoader = [ 'Bunny', 'Mustang', 'Porsche', 'Sphere' ]; // 3D Models
const ScenesLoader = IMAGES_FOLDERS; // Skybox Gallery

// Gallery of sykbox images loading
const IMAGES_SRC = SKYBOX_TEXTURES_URL;
const DEFAULT_IMAGE_PREVIEW = 'pos-z.jpg';
const DEFAULT_IMAGE_WIDTH = 48;
const DEFAULT_IMAGE_HEIGHT = 48;

/**
 * Returns the list of elements to show or hide based on the 'condition' property
 * @returns {Array} - The list of elements to show or hide
 */
const getShowableElements = () => [
    { field: doc.getElementById('color_picker'),            condition: (!CONTROLLER.isSampling && !CONTROLLER.isFrostedMirror)  }, // Color Picker
    { field: doc.getElementById('light_intensity'),         condition: !CONTROLLER.isFrostedMirror                              }, // Light Intensity
    { field: doc.getElementById('frosted_mirror_checkbox'), condition: CONTROLLER.isSampling || CONTROLLER.isFrostedMirror      }, // Plane
    { field: doc.getElementById('fresnel'),                 condition: CONTROLLER.isSampling                                    }, // Fresnel indice
    { field: doc.getElementById('sigma'),                   condition: CONTROLLER.isSampling || CONTROLLER.isFrostedMirror      }, // Sigma
    { field: doc.getElementById('N'),                       condition: CONTROLLER.isSampling || CONTROLLER.isFrostedMirror      }  // Sampling
];

/**
 * Open / Close a dropdow menu
 * @param {Event} evt - The on-click event
*/
function toggleDropdown(evt) {

    var header = evt.target;
    var icon = header.querySelector('span');
    var dropdown = header.closest('.dropdown');

    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        icon.classList.remove('up');
        icon.classList.add('down');
    }
    else {
        dropdown.classList.add('active');
        icon.classList.remove('down');
        icon.classList.add('up');
    }
}

/**
 * Update the value of the slider and the number input
 * @param {HTMLInputElement} slider - The slider
 * @param {HTMLInputElement} numberInput - The number input
 * @param {String} target - The target of the controller to update 
 */
function updateSliderValue(slider, numberInput, target) {
    let value = slider.value;
    numberInput.value = value;
    CONTROLLER.updateValue(target, value);
}

/**
 * Update the value of the number input and the slider
 * @param {HTMLInputElement} numberInput - The number input
 * @param {HTMLInputElement} slider - The slider
 * @param {String} target - The target of the controller to update
 */
function updateNumberInputValue(numberInput, slider, target) {
    let value = parseFloat(numberInput.value); // Get the value from the number input
    if (isNaN(value)) return; // If the value is not a number (empty case), then return
    // Clamp the value between the min and max values
    value = Math.min(
        Math.max(value, CONTROLLER.getMinValue(target)),
        CONTROLLER.getMaxValue(target)
    );
    // Update the value of the slider and the number input (to clamp the value)
    numberInput.value = value;
    slider.value = value;
    CONTROLLER.updateValue(target, value);
}

/**
 * Open the Menu
 */
function openMenu() {
    openMenuBtn.style.display = 'none';
    menu.style.display = 'block';
}

/**
 * Close the Menu
 */
function closeMenu() {
    openMenuBtn.style.display = 'block';
    menu.style.display = 'none';
}

/**
 * Hide/show fields that are not relevant to the current configuration
 */
function showFields() {
    getShowableElements().forEach(({ field, condition }) => {
        if (condition) field.style.display = 'block';
        else field.style.display = 'none';
    });
}

/**
 * Switch the skybox scene
 * @param {Event} evt - The on-click event
 * @param {String} Name - The name of the scene to switch to
 * @returns {void}
 */
function switchScene(evt, Name) {

    if (CONTROLLER.SCENE === Name
        || !CONTROLLER.isThereSkybox
        || !ScenesLoader.includes(Name)
    ) return;

    let selectedImg = evt.target;

    // Remove the active class from the previous image
    var activeImage = gallery.querySelector('img.active')
    activeImage.classList.remove('active');    
    // Active the current image (add the active class)
    selectedImg.classList.add('active');

    // Change the skybox scene
    CONTROLLER.setScene(Name);
    delete SKYBOX;
    SKYBOX = new cubemap();
}

/**
 * Change the color of the model
 * @param mode - The controller mode (lambert, reflection, refraction, cook-torrance, sampling)
 * @returns {void}
 */
function handleMode(mode) {
    // If the sampling mode was enabled and the fresnel was disabled,
    // then uncheck the checkbox
    if (CONTROLLER.isFrostedMirror) frostedMirrorModeCheckbox.checked = false;
    // Update the mode
    CONTROLLER.setConfiguration(mode);
    // If the sammpling mode is enabled in any way,
    // then change color to black
    if (CONTROLLER.isSampling || CONTROLLER.isFrostedMirror) {
        CONTROLLER.setColor('#000000');
        if (CONTROLLER.isFrostedMirror) CONTROLLER.setLightIntensity(1);
        else if (CONTROLLER.isSampling) CONTROLLER.setSamplesNumber(samplingSlider.value);
    }
    else CONTROLLER.setColor(modelColorPicker.value);
    if (!CONTROLLER.isFrostedMirror) CONTROLLER.setLightIntensity(lightIntensitySlider.value);
    if (!CONTROLLER.isSampling) CONTROLLER.setSamplesNumber(1);
    // Update fields
    showFields();
}

/**
 * Handle the change of the skybox checkbox
 * @param {Event} evt - The on-click event
 * @returns {void} 
 */
function toggleSkybox(evt) {
    let checked = evt.target.checked;
    CONTROLLER.isThereSkybox = checked;
    if (checked) {
        selects[1].querySelectorAll('option').forEach(option => {
            option.disabled = false; // Enabling modes inside the selector
        });
    }
    else {
        handleMode('LAMBERT'); // Resetting the mode to Lambert
        selects[1].querySelectorAll('option').forEach(option => {
            option.disabled = true; // Disabling modes inside the selector
        });
        selects[1].value = 'LAMBERT'; // Setting selected option to Lambert
    }
}

/**
 * Initialize the user interface (DOM interactions)
 */
function initUI() {

    // Init open and close buttons events
    openMenuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    // Create options for model selection based on the ObjectLoader array
    if (ObjectLoader) {
        ObjectLoader.forEach(function (ObjName) {
            var option = doc.createElement('option');
            option.value = ObjName;
            option.textContent = ObjName;
            option.setAttribute('onclick', 'CONTROLLER.setObject(' + ObjName.toUpperCase() + ');');
            selects[0].appendChild(option);
        });
    }

    if (ScenesLoader) {
        // Create images to add to the gallery of skybox images
        ScenesLoader.forEach(function (SceneName) {
            var img = doc.createElement('img'); // Create an image
            // Set the image source, listener and attributes,
            // If it's the default one, then add the active class
            img.src = IMAGES_SRC + SceneName + '/' + DEFAULT_IMAGE_PREVIEW;
            img.setAttribute('onclick', 'switchScene(event, \'' + SceneName + '\');');
            img.width = DEFAULT_IMAGE_WIDTH;
            img.height = DEFAULT_IMAGE_HEIGHT;
            if (SceneName === CONTROLLER.SCENE) img.classList.add('active');
            // Finally append the image to the gallery
            gallery.appendChild(img);
        });
    }

    // Reset color pickers to default value
    modelColorPicker.value = rgbToHex(CONTROLLER.COLOR);
    
    // Reset select menus
    for (var i = 0; i < selects.length; i++) {
        selects[i].selectedIndex = 0;
    }

    // Reset the plane checkbox
    planeToggle.checked = CONTROLLER.isTherePlane;
    planeToggle.addEventListener('input', function () {
        CONTROLLER.isTherePlane = this.checked;
    });

    // Reset the skybox checkbox
    skyboxCheckBox.checked = CONTROLLER.isThereSkybox;
    skyboxCheckBox.addEventListener('input', toggleSkybox);

    // Reset the frosted mirror checkbox
    frostedMirrorModeCheckbox.checked = CONTROLLER.isFrostedMirror;
    frostedMirrorModeCheckbox.addEventListener('input', function () {
        if (this.checked) handleMode('FROSTED');
        else handleMode('SAMPLING');
    });

    // Reset sliders and bind them to their target value
    controllerUpdatersConfig.forEach(function (config) {
        config.slider.value
        = config.numberInput.value
        = CONTROLLER.getValue(config.target);
        config.slider.addEventListener('input', (input) => updateSliderValue(input.target, config.numberInput, config.target));
        config.numberInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') 
                updateNumberInputValue(
                    event.target, 
                    config.slider, 
                    config.target
                );
        });
    });

    openMenu(); // Open the menu by default
}