var tabWrapper, clickedTab, activeTab;

function initVars() {
    tabWrapper = document.getElementsByClassName("tabpane").item(0);
    clickedTab = document.getElementsByClassName("tab_link active").item(0);
    activeTab = document.getElementsByClassName("tab active").item(0);
    activeTab.style.display = "block";
}

function openTab(evt, tabName) {

    activeTab.style.display = "none"; // Hide the previous active tab
    activeTab = document.getElementById(tabName); // Set the new active tab
    activeTab.className = activeTab.className.replace(" active", ""); // Remove the class "active" from the previous active tab
    clickedTab.className = clickedTab.className.replace(" active", ""); // Remove the class "active" from the previous clicked tab
    clickedTab = evt.currentTarget; // Update the clicked tab

    activeTab.style.display = "block"; // Show the new tab

    // Add an "active" class to the button that opened the tab and set the new clicked tab
    activeTab.className += " active";
    clickedTab.className += " active";
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