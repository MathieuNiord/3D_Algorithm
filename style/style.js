var doc = document;

var openMenuBtn = doc.getElementById('open_menu_btn');
var closeBtn = doc.getElementById('close_menu_btn');
var menu = doc.getElementById('menu__content');
var dropdowns = doc.getElementsByClassName('dropdown');

// Selectors / Mutators
var selects = doc.getElementsByClassName('selector');
var planeToggle = doc.getElementById('plane_checkbox');
var colorPicker = doc.getElementById('color_picker');
var skyboxCheckBox = doc.getElementById('skybox_checkbox');

// Sliders
// ==========================================================
var fresnelSlider = doc.getElementById('fresnel_coeff');
var fresnelValue = doc.getElementById('fresnel_coeff_value');

var sigmaSlider = doc.getElementById('sigma_range_select');
var sigmaValue = doc.getElementById('sigma_value');

var lightPosSliderX = doc.getElementById('light_x');
var lightPosValueX = doc.getElementById('light_x_value');
var lightPosSliderY = doc.getElementById('light_y');
var lightPosValueY = doc.getElementById('light_y_value');
var lightPosSliderZ = doc.getElementById('light_z');
var lightPosValueZ = doc.getElementById('light_z_value');
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
 * Update a value from an input range (UI and shaders)
 */
function updateValue(input, target) {
    let slider = input.target;
    let value = slider.value;
    // Get nearest span of class value_display
    let valueDisplay = slider.nextElementSibling;
    // Update the value of the span
    valueDisplay.innerHTML = value;
    // Update the value of the shader
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
function showFresnelAndSigma() {
    var fresnel = document.getElementById('fresnel');
    var sigma = document.getElementById('sigma');
    fresnel.style.display = CONTROLLER.isTransmitting ? 'block' : 'none';
    sigma.style.display = CONTROLLER.isCookTorrance ? 'block' : 'none';
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

    // Reset color picker to default value
    colorPicker.value = rgbToHex(CONTROLLER.COLOR);
    
    // Reset select menus
    for (var i = 0; i < selects.length; i++) {
        selects[i].selectedIndex = 0;
    }

    // Reset the plane checkbox
    planeToggle.checked = CONTROLLER.isTherePlane;
    planeToggle.addEventListener('change', function () {
        CONTROLLER.isTherePlane = this.checked;
    });

    // Reset the skybox checkbox
    skyboxCheckBox.checked = CONTROLLER.isThereSkybox;
    skyboxCheckBox.addEventListener('change', function () {
        CONTROLLER.isThereSkybox = this.checked;
    });

    // Reset slider and bind it to the fresnel value
    fresnelSlider.value = CONTROLLER.FRESNEL_INDICE;
    fresnelValue.innerText = CONTROLLER.FRESNEL_INDICE;
    fresnelSlider.addEventListener('input', (input) => updateValue(input, 'FRESNEL'));

    // Reset slider and bind it to the sigma value
    sigmaSlider.value = CONTROLLER.SIGMA;
    sigmaValue.innerText = CONTROLLER.SIGMA;
    sigmaSlider.addEventListener('input', (input) => updateValue(input, 'SIGMA'));

}