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

function updateValue(evt) {
    var slider = evt.target;
    var value = slider.value;
    var output = document.getElementById('fresnel_coeff_value');
    output.textContent = value;
}

function openMenu(evt) {
    var btn = evt.target;
    var menu = document.getElementById('menu__content');
    btn.style.display = 'none';
    menu.style.display = 'block';
}

function closeMenu() {
    var btn = document.getElementsByClassName('open-button')[0];
    var menu = document.getElementById('menu__content');
    btn.style.display = 'block';
    menu.style.display = 'none';
}

function showFresnel(value) {
    console.log(value);
    var fresnel = document.getElementById('fresnel');
    fresnel.style.display = (value == 2) ? 'block' : 'none';
}

// Switch the object to display
function switchObject(Object) {
    if (OBJ1 !== Object) OBJ1 = Object;
    console.log(Object);
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