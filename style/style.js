/** @author Frejoux Gaetan, Niord Mathieu */

var doc = document;

var openMenuBtn = doc.getElementById('open_menu_btn');
var closeBtn = doc.getElementById('close_menu_btn');
var menu = doc.getElementById('menu__content');
var dropdowns = doc.getElementsByClassName('dropdown');

// Selectors / Mutators
var selects = doc.getElementsByClassName('selector');
var planeToggle = doc.getElementById('plane_checkbox');
var modelColorPicker = doc.getElementById('model_color');
var frostedMirrorModeCheckbox = doc.getElementById('frosted_checkbox');
var skyboxCheckBox = doc.getElementById('skybox_checkbox');

// Sliders
// ==========================================================
var fresnelSlider = doc.getElementById('fresnel_coeff');
var fresnelValue = doc.getElementById('fresnel_coeff_value');
var sigmaSlider = doc.getElementById('sigma_range_select');
var sigmaValue = doc.getElementById('sigma_value');
var samplingSlider = doc.getElementById('sampling_range_select');
var samplingValue = doc.getElementById('sampling_value');
var lightIntensitySlider = doc.getElementById('intensity_range_select');
var lightIntensityValue = doc.getElementById('intensity_value');
const controllerUpdatersConfig = [
    { slider: fresnelSlider,    numberInput: fresnelValue,    target: 'FRESNEL'   },
    { slider: sigmaSlider,      numberInput: sigmaValue,      target: 'SIGMA'     },
    { slider: samplingSlider,   numberInput: samplingValue,   target: 'SAMPLES'   },
    { slider: lightIntensitySlider, numberInput: lightIntensityValue, target: 'LIGHT_INTENSITY' }
];
// ==========================================================

// Gallery
var gallery = doc.getElementById('gallery');

// Loaders
const ObjectLoader = [ 'Bunny', 'Mustang', 'Porsche', 'Sphere' ]; // 3D Models
const ScenesLoader = IMAGES_FOLDERS; // Skybox Gallery

// Gallery of sykbox images loading
const IMAGES_SRC = SKYBOX_TEXTURES_URL;
const DEFAULT_IMAGE_PREVIEW = 'pos-z.jpg';
const DEFAULT_IMAGE_WIDTH = 48;
const DEFAULT_IMAGE_HEIGHT = 48;

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
 * Show the Fresnel and Sigma part
 */
function showSliders() {

    var Fresnel = doc.getElementById('fresnel');
    var Sigma = doc.getElementById('sigma');
    var N = doc.getElementById('N');
    var FrostedCheckbox = doc.getElementById('frosted_mirror_checkbox');

    // Setting up the displayable elements
    Fresnel.style.display
        = Sigma.style.display
        = N.style.display
        = FrostedCheckbox.style.display
        = (CONTROLLER.isSampling || CONTROLLER.isFrostedMirror ? 'block' : 'none');
}

/**
 * Switch the skybox scene
 * @param {Event} evt - The on-click event
 * @param {String} Name - The name of the scene to switch to
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
    planeToggle.addEventListener('change', function () {
        CONTROLLER.isTherePlane = this.checked;
    });

    // Reset the frosted mirror checkbox
    frostedMirrorModeCheckbox.checked = CONTROLLER.isFrostedMirror;
    frostedMirrorModeCheckbox.addEventListener('change', function () {
        CONTROLLER.isFrostedMirror = this.checked;
        CONTROLLER.isSampling = !this.checked;
    });

    // Reset the skybox checkbox
    skyboxCheckBox.checked = CONTROLLER.isThereSkybox;
    skyboxCheckBox.addEventListener('change', function () {
        CONTROLLER.isThereSkybox = this.checked;
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
                    config.target);
        });
    });

    openMenu(); // Open the menu by default
}