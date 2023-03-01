## Jalon 3 - Algorithmique 3D 2
*Auteurs : Fréjoux Gaëtan, Niord Mathieu*

---
### **Objectifs du jalon**  

- [x] Visualisation de la sphère (ou d'un autre objet) miroir parfait, et rugueux (une option, sans Fresnel)
- [x] Avec une interface graphique pour contrôler les différents paramètres
- [x] Avoir la même visualisation mais en intégrant Fresnel et le calcul correct de l'intégration pour des microfacettes avec un indice de réfraction

Nous n'avons pas mis en place la distribution GGX.

---

### **I. Arborescence du projet**

.\
├── desktop.ini\
├── **glsl**\
│   ├── cubemap.[fs|vs]\
│   ├── obj.[fs|vs]\
│   ├── plane.[fs|vs]\
│   ├── skybox.[fs|vs]\
│   ├── wire.[fs|vs]\
├── **main.html**\
├── readme.md\
├── **res**\
│   ├── **obj**\
│   │   ├── bunny.obj\
│   │   ├── mustang.obj\
│   │   ├── porsche.obj\
│   │   └── sphere.obj\
│   └── **textures**\
│       └── skybox\
│           ├── museum/\
│           ├── ocean/\
│           └── yokohama/\
├── **src**\
│   ├── callbacks.js\
│   ├── colors.js\
│   ├── controller.js\
│   ├── glCourseBasis.js\
│   ├── glMatrix.js\
│   └── objLoader.js\
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
  - Modifier différents critères de l'objet affiché selon les différents modes qui vous sont proposés (**Lambert ou Sampling**)
  - Modifier la Skybox (environnement) ou la désactiver.

**c) Fonctionnalités Canvas**
| Action                                                   | Effet                                  |
| -------------------------------------------------------- | -------------------------------------- |
| **Clic gauche** + **Mouvements souris**                  | Rotation de la caméra autour du modèle |
| **Clic droit simple**                                    | Changement d'objet                     |
| **Mouse Wheel** ou **Shift + Clic gauche**               | Zoom                                   |
