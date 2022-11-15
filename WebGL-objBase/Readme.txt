Projet réalisé par Fréjoux Gaëtan et Niord Mathieu

Nous avons répondu à l'ensemble du sujet.
Nous avons ajouté la possibilité de choisir plusieurs textures sur la cubemap ainsi que plusieurs type d'objets.

Nous avons 4 modes de shaders :
 - Une couleur
 - La réflexion
 - La transmission avec en paramètre (nI)
 - La transmission et la réflexion avec en paramètre (nI)

Arborescence du projet : 
.
└── WebGL-objBase
    ├── Readme.txt
    ├── callbacks.js
    ├── colors.js
    ├── desktop.ini
    ├── favicon.ico
    ├── glCourseBasis.js
    ├── glMatrix.js
    ├── glsl
    │   ├── cubemaps.fs
    │   ├── cubemaps.vs
    │   ├── obj.fs
    │   ├── obj.vs
    │   ├── plane.fs
    │   ├── plane.vs
    │   ├── skybox.fs
    │   ├── skybox.vs
    │   ├── wire.fs
    │   └── wire.vs
    ├── main.html
    ├── obj
    │   ├── bunny.obj
    │   ├── mustang.obj
    │   ├── porsche.obj
    │   └── sphere.obj
    ├── objLoader.js
    ├── res
    │   └── textures
    │       └── skybox
    │           ├── museum..
    │           └── ocean..
    └── style
        ├── main.css
        └── style.js