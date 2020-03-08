let NONA = {};

NONA.init = function () {
    NONA.scene = new THREE.Scene();
    NONA.scene.background = new THREE.Color(0xffffff);

    NONA.camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        5000
    );

    NONA.camera.position.x = 0;
    NONA.camera.position.y = 0;
    NONA.camera.position.z = 0;

    controls = new THREE.OrbitControls(NONA.camera);
    // controls.addEventListener("change", NONA.renderer);

    hlight = new THREE.AmbientLight(0x404040, 5);
    NONA.scene.add(hlight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 5);
    directionalLight.castShadow = false;
    NONA.scene.add(directionalLight);

    NONA.renderer = new THREE.WebGLRenderer({ antialias: true });
    NONA.renderer.setSize(window.innerWidth, window.innerHeight);
    NONA.renderer.gammaOutput = true;
    NONA.renderer.gammaFactor = 2.2;
    document.body.appendChild(NONA.renderer.domElement);
}

NONA.initScene = function () {
    NONA.scene = new THREE.Scene();
    NONA.scene.background = new THREE.Color(0xffffff);

    NONA.camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        5000
    );

    NONA.camera.position.x = 0;
    NONA.camera.position.y = 0;
    NONA.camera.position.z = 0;

    controls = new THREE.OrbitControls(NONA.camera);
    // controls.addEventListener("change", NONA.renderer);

    hlight = new THREE.AmbientLight(0x404040, 5);
    NONA.scene.add(hlight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 5);
    directionalLight.castShadow = false;
    NONA.scene.add(directionalLight);

    NONA.renderer = new THREE.WebGLRenderer({ antialias: true });
    NONA.renderer.setSize(window.innerWidth, window.innerHeight);
    NONA.renderer.gammaOutput = true;
    NONA.renderer.gammaFactor = 2.2;
    document.body.appendChild(NONA.renderer.domElement);
}
// Load a Model, with a Weight and Height in Meters
NONA.loadModel = function (model, weight, height) {
    let loader = new THREE.GLTFLoader();
    loader.load("static/models/" + model, function (gltf) {
        model = gltf.scene.children[0];
        // TODO: Account for Weight
        // TODO: Scale Model based on Height
        model.scale.set(1, 1, 1);
        // Lower Model by Height / 2 to Center Camera at Mid-Height
        model.position.set(0, - (height / 2), 0);

        // Remove Old Model from Scene
        if (NONA.currentModel) {
            NONA.scene.remove(NONA.currentModel);
        }

        NONA.currentModel = gltf.scene
        NONA.scene.add(NONA.currentModel);
        NONA.animate();
    });
}

NONA.animate = function () {
    NONA.renderer.render(NONA.scene, NONA.camera);
    requestAnimationFrame(NONA.animate);
}