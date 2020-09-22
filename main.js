
// create a scene, that will hold all our elements such as objects, cameras and lights.
var scene = new THREE.Scene();

// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// create a render and set the size
var webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMap.enabled = true;

var box = createMesh(new THREE.BoxGeometry(15, 15, 15), "https://dl.dropbox.com/s/nsz32l6hckd43oq/stone.jpg?dl=0", "https://dl.dropbox.com/s/0oujmkvq6igtlrc/stone-bump.jpg?dl=0");
box.rotation.y = 1.0;
box.position.x = 0;
scene.add(box);
console.log(box.geometry.faceVertexUvs);

var textureLoader = new THREE.TextureLoader();
var floorTex = textureLoader.load("https://dl.dropbox.com/s/u4y3epi732a08x4/floor-wood.jpg?dl=0");
var base = new THREE.Mesh(new THREE.BoxGeometry(200, 100, 0.1, 30), new THREE.MeshPhongMaterial({
    color: 0x3c3c3c,
    map: floorTex
}));
base.position.y = -7.5;
base.rotation.x = -0.5 * Math.PI;
scene.add(base);

// position and point the camera to the center of the scene
camera.position.x = 15;
camera.position.y = 22;
camera.position.z = 28;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var ambiLight = new THREE.AmbientLight(0x242424);
scene.add(ambiLight);

var light = new THREE.SpotLight();
light.position.set(0, 30, 30);
light.intensity = 1.2;
scene.add(light);

// add the output of the renderer to the html element
document.getElementById("WebGL-div").appendChild(webGLRenderer.domElement);


// call the render function
var step = 0;

// setup the control gui
var textureLoader = new THREE.TextureLoader();
var controls = new function () {
    this.bumpScale = 0.2;
    this.changeTexture = "weave";
    this.rotate = true;

    this.changeTexture = function (e) {
    var texture = textureLoader.load("https://dl.dropbox.com/s/nsz32l6hckd43oq/stone.jpg?dl=0");
        box.material.map = texture;

    var bump = textureLoader.load("https://dl.dropbox.com/s/0oujmkvq6igtlrc/stone-bump.jpg?dl=0");
        box.material.bumpMap = bump;
    };

    this.updateBump = function (e) {
        console.log(box.material.bumpScale);
        box.material.bumpScale = e;
    }
};


var gui = new dat.GUI();
gui.add(controls, "bumpScale", -2, 2).onChange(controls.updateBump);
gui.add(controls, "changeTexture", ['stone', 'weave']).onChange(controls.changeTexture);
gui.add(controls, "rotate");


render();

function createMesh(geom, imageFile, bump) {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(imageFile);
    geom.computeVertexNormals();
    var mat = new THREE.MeshPhongMaterial();
    mat.map = texture;

    if (bump) {
        var bump = textureLoader.load(bump);
        mat.bumpMap = bump;
        mat.bumpScale = 0.2;
        console.log('d');
    }


    // create a multimaterial
    var mesh = new THREE.Mesh(geom, mat);

    return mesh;
}

function render() {
    if (controls.rotate) {
        box.rotation.y += 0.01;
    }

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
}
