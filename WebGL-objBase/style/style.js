// Open a tab on click
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Switch the object to display
function switchObject(Object) {
    if (OBJ1 !== Object) OBJ1 = Object;
}

// Switch the scene (skybox)
function switchScene(Name) {
    if (SKYBOX_SCENE !== Name) {
        SKYBOX_SCENE = Name;
        delete SKYBOX;
        SKYBOX = new cubemaps();
    }
}

function initAll() {
    document.getElementById("defaultOpen").click();
}