var doc = document;

var openMenuBtn = doc.getElementById('open-button');
var closeBtn = doc.getElementById('close-button');
var dropdowns = doc.getElementsByClassName('dropdown');

// Selectors / Mutators
var selects = doc.getElementsByClassName('selector');
var planeToggle = doc.getElementById('plane_checkbox');
var colorPicker = doc.getElementById('color_picker');
var skyboxCheckBox = doc.getElementById('skybox_checkbox');
var fresnelSlider = doc.getElementById('fresnel_coeff');
var fresnelValue = doc.getElementById('fresnel_coeff_value');
var gallery = doc.getElementById('gallery');

// Object loading
var ObjectLoader = [ 'Bunny', 'Mustang', 'Porsche', 'Sphere' ];

// Gallery of sykbox images loading
var DEFAULT_COLOR = MODEL_COLOR;
var DEFAULT_SKYBOX = SKYBOX_SCENE;
var ScenesLoader = IMAGES_FOLDERS;
var IMAGES_SRC = SKYBOX_TEXTURES_URL;
var IMAGE_NAME = 'pos-z.jpg';
var IMAGE_DEFAULT_WIDTH = 48;
var IMAGE_DEFAULT_HEIGHT = 48;

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

function updateValue() {
    let value = this.value;
    fresnelValue.innerText = value;
    FRESNEL_INDICE = value;
}

function openMenu(evt) {
    var btn = evt.target;
    var menu = document.getElementById('menu__content');
    btn.style.display = 'none';
    menu.style.display = 'block';
}

function closeMenu() {
    var btn = document.getElementById('open-button');
    var menu = document.getElementById('menu__content');
    btn.style.display = 'block';
    menu.style.display = 'none';
}

function showFresnel() {
    var fresnel = document.getElementById('fresnel');
    fresnel.style.display = isTransmitting ? 'block' : 'none';
}

// Switch the object to display
function switchObject(Object) {
    if (OBJ1 !== Object) OBJ1 = Object;
}

// Switch the scene (skybox)
function switchScene(evt, Name) {

    if (SKYBOX_SCENE === Name
        || !isThereSkybox
        || !ScenesLoader.includes(Name)
    ) return;

    let selectedImg = evt.target;

    // Remove the active class from the previous image
    var activeImage = gallery.querySelector('img.active')
    activeImage.classList.remove('active');    
    // Active the current image (add the active class)
    selectedImg.classList.add('active');

    // Change the skybox scene
    SKYBOX_SCENE = Name;
    delete SKYBOX;
    SKYBOX = new cubemaps();
}

function initUI() {

    // Create options for model selection based on the ObjectLoader array
    ObjectLoader.forEach(function (ObjName) {
        var option = doc.createElement('option');
        option.value = ObjName;
        option.textContent = ObjName;
        option.setAttribute('onclick', 'switchObject(' + ObjName.toUpperCase() + ');');
        selects[0].appendChild(option);
    });

    // Create images to add to the gallery of skybox images
    ScenesLoader.forEach(function (SceneName) {
        var img = doc.createElement('img'); // Create an image
        // Set the image source, listener and attributes,
        // If it's the default one, then add the active class
        img.src = IMAGES_SRC + SceneName + '/' + IMAGE_NAME;
        img.setAttribute('onclick', 'switchScene(event, \'' + SceneName + '\');');
        img.width = IMAGE_DEFAULT_WIDTH;
        img.height = IMAGE_DEFAULT_HEIGHT;
        if (SceneName === DEFAULT_SKYBOX) img.classList.add('active');
        // Finally append the image to the gallery
        gallery.appendChild(img);
    });

    // Reset color picker to default value
    colorPicker.value = rgbToHex(DEFAULT_COLOR);
    console.log(DEFAULT_COLOR);
    console.log(rgbToHex(DEFAULT_COLOR));
    console.log (colorPicker.value);
    
    // Reset select menus
    for (var i = 0; i < selects.length; i++) {
        selects[i].selectedIndex = 0;
    }

    // Reset the plane checkbox
    planeToggle.checked = isTherePlane;
    planeToggle.addEventListener('change', function () {
        isTherePlane = this.checked;
    });

    // Reset the skybox checkbox
    skyboxCheckBox.checked = isThereSkybox;
    skyboxCheckBox.addEventListener('change', function () {
        isThereSkybox = this.checked;
    });

    // Reset slider and link it to the fresnel value
    fresnelSlider.value = FRESNEL_INDICE;
    fresnelValue.innerText = FRESNEL_INDICE;
    fresnelSlider.addEventListener('input', updateValue);
}