// create a mesh of geometry and materials
function createMesh(boxGeo, textureImg, bumpImg) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textureImg);

    // specify a glossy surface material
    const material = new THREE.MeshPhongMaterial();

    material.map = texture;
    const bump = textureLoader.load(bumpImg);
    material.bumpMap = bump;

    // set the degree of influence of bump mapping
    material.bumpScale = 0.2;

    // weight the normals of each face by the area of the faces
    boxGeo.computeVertexNormals();

    const mesh = new THREE.Mesh(boxGeo, material);

    return mesh;
}

// drawing while rotating the box
function rendering() {
    box.rotation.y += 0.02;
    requestAnimationFrame(rendering);
    webGLRenderer.render(scene, camera);
}


// create a scene
const scene = new THREE.Scene();

// create a camera
//   param:
//     viewing angle
//     aspect ratio
//     near range position
//     long distance position
//     zoom value
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000, 0.5);

// create a render
const webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);

const box = createMesh(new THREE.BoxGeometry(12, 12, 12), "https://dl.dropbox.com/s/4o07z31a5tky2vl/brick.jpg?dl=0", "https://dl.dropbox.com/s/rize1izxeoiaff2/brick-bump.jpg?dl=0");

box.position.x = 0;
box.position.y = 0;
scene.add(box);

const textureLoader = new THREE.TextureLoader();
const floorTex = textureLoader.load("https://dl.dropbox.com/s/6us9v7yenlomj3t/stone.jpg?dl=0");
const base = new THREE.Mesh(new THREE.BoxGeometry(200, 100, 0.1, 30), new THREE.MeshPhongMaterial({
    color: 0x505050,
    map: floorTex
}));
base.position.y = -7.5;
base.rotation.x = -0.5 * Math.PI;
scene.add(base);

// set the position of the camera
camera.position.x = 15;
camera.position.y = 22;
camera.position.z = 28;

// aim the angle of view of the camera to the origin
camera.lookAt(new THREE.Vector3(0, 0, 0));

const ambiLight = new THREE.AmbientLight(0x888888);
scene.add(ambiLight);

const light = new THREE.SpotLight();
light.position.set(0, 30, 30);
light.intensity = 1.0;
scene.add(light);

// add the output destination of the renderer as an HTML element
document.getElementById("WebGL-div").appendChild(webGLRenderer.domElement);

// drawing of scene
rendering();
