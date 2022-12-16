## Jalon 2 - Algorithmique 3D 2
*Auteurs : Fréjoux Gaëtan, Niord Mathieu*

---
### **Objectifs du jalon**

- [x] La visualisation interactive d'objets 3D (avec un choix parmi plusieurs objets)
- [x] Le développement du modèle de Cook et Torrance pour la réflection lumineuse
- [x] Une source de lumière positionnée en 0,0,0 (à la place de l'observateur, donc)
- [x] Une interface javascript permettant de jouer sur les paramètres
    - [x] Rugosité (sigma)
    - [x] ni (pour la réflexion Fresnel)
    - [x] Kd (pour la couleur de l'objet)
    - [x] Eventuellement la position de la source (avec la souris).
- [x] ~~L'éclairement provenant d'une éventuelle carte d'environnement sera complètement ignoré~~

---
---

### **I. Arborescence du projet**

.\
├── desktop.ini\
├── **glsl**\
│   ├── cubemap.[fs|vs]\
│   ├── obj.[fs|vs]\
│   ├── plane.[fs|vs]\
│   ├── skybox.[fs|vs]\
│   ├── wire.[fs|vs]\
├── **main.html**\
├── readme.md\
├── **res**\
│   ├── **obj**\
│   │   ├── bunny.obj\
│   │   ├── mustang.obj\
│   │   ├── porsche.obj\
│   │   └── sphere.obj\
│   └── **textures**\
│       └── skybox\
│           ├── museum/\
│           ├── ocean/\
│           └── yokohama/\
├── **src**\
│   ├── callbacks.js\
│   ├── colors.js\
│   ├── controller.js\
│   ├── glCourseBasis.js\
│   ├── glMatrix.js\
│   └── objLoader.js\
└── **style**\
    ├── main.css\
    └── style.js

---
### **II. Développement**

Ce projet a été développé à l'aide des technologies suivantes :
- **WebGL**
- **Javascript**
- **HTML**
- **CSS**.

---
### **III. Manuel utilisateur**

**a) Exécution**\
Lancer le fichier **main.html** pour lancer le programme.

**b) Fonctionnalités Menu**\
Un menu apparaît en haut à droite de la fenêtre, il vous permettra de :
  - Sélectionner l'objet à afficher ;
  - Modifier la couleur de l'objet affiché ;
  - Modifier différents critères de l'objet affiché selon les différents modes qui vous sont proposés (**mirroir parfait, transmission, Cook-Torrance**).
  - Modifier la Skybox (environnement) ou la désactiver.

**c) Fonctionnalités Canvas**
| Action | Effet |
| ------ | ------ |
| **Clic gauche** + **Mouvements souris** | Rotation de la caméra autour du modèle |
| **Clic droit simple** | Changement d'objet |
| **Mouse Wheel** ou **Shift + Clic gauche** | Zoom |
| **Cook & Torrance actif** + **Ctrl + Mouvements souris** | Déplacement de la source de lumière |
