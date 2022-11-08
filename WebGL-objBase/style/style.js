var doc = document;

var openMenuBtn = doc.getElementById('open-button');
var closeBtn = doc.getElementById('close-button');
var dropdowns = doc.getElementsByClassName('dropdown');

// Selectors / Mutators
var selects = doc.getElementsByClassName('selector'); 
var skyboxCheckBox = doc.getElementById('skybox_checkbox');
var fresnelSlider = doc.getElementById('fresnel_coeff');
var fresnelValue = doc.getElementById('fresnel_coeff_value');

// Object loading
var ObjectLoader = [ 'Bunny', 'Mustang', 'Porsche', 'Sphere', 'Cube' ];

function switchDropdown(evt) {

    var span = evt.target;
    var icon = span.querySelector('span');
    var dropdown = span.closest('.dropdown');

    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        // replace the text content of icon (<span>) with "⌄"
        icon.textContent = 'v';
    }
    else {
        dropdown.classList.add('active');
        // replace the text content of icon (<span>) with "⌃"
        icon.textContent = 'A';
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

    if (SKYBOX_SCENE !== Name) {
        
        // Deactive all images (remove the active class)
        images = document.getElementById('gallery').querySelectorAll('img');
        images.forEach(function (img) {
            img.classList.remove('active');
        });

        // Active the current image (add the active class)
        var img = evt.target;
        img.classList.add('active');

        // Change the skybox scene
        SKYBOX_SCENE = Name;
        delete SKYBOX;
        SKYBOX = new cubemaps();
    }
}

function initUI() {
    
    // Add options for model selection
    ObjectLoader.forEach(function (ObjName) {
        var option = doc.createElement('option');
        option.value = ObjName;
        option.textContent = ObjName;
        option.setAttribute('onclick', 'switchObject(' + ObjName.toUpperCase() + ');');
        selects[0].appendChild(option);
    });

    // Reset select menus
    for (var i = 0; i < selects.length; i++) {
        selects[i].selectedIndex = 0;
    }

    // Reset checkboxes (set to isThereSkybox)
    console.log(isThereSkybox);
    skyboxCheckBox.checked = isThereSkybox;

    // Reset slider
    fresnelSlider.value = FRESNEL_INDICE;
    fresnelValue.innerText = FRESNEL_INDICE;
    fresnelSlider.addEventListener('input', updateValue);
}