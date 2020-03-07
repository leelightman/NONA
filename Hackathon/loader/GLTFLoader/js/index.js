let scene, camera, renderer;

function createButton(innerText){
  const button = document.createElement('a');
  button.className="btn btn-lg btn-block btn-default";
  button.role="button";
  button.href="#";
  var text = document.createTextNode(innerText);
  button.appendChild(text);
  return button;
}

function createRenderer(filename){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa9a9a9);

  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.rotation.y = 45/180*Math.PI;
  camera.position.x = 250;
  camera.position.y = 350;
  camera.position.z = 50;

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', renderer);

  hlight = new THREE.AmbientLight (0x404040,5);
  scene.add(hlight);

  directionalLight = new THREE.DirectionalLight(0xffffff,5);
  directionalLight.position.set(0,5,0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  let loader = new THREE.GLTFLoader();
  loader.load(filename, function(gltf){
	  model = gltf.scene.children[0];
	  model.scale.set(0.4,0.4,0.4);
	  scene.add(gltf.scene);
	  animate();
  });

  return renderer;
}
function init() {
  
  // create container
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.className="container";

  //const h1 = document.createElement('h1');
  //h1.className="font-weight-light text-center text-lg-left mt-4 mb-0";
  //var t = document.createTextNode("Page Heading");
  //h1.appendChild(t);
  //container.appendChild(h1);

  const row = document.createElement('div');
  row.className = "row";

  const right_col = document.createElement('div');
  right_col.className="col-md-4";

  // buttons
  right_col.appendChild(createButton("Style"));
  right_col.appendChild(createButton("Genre"));
  right_col.appendChild(createButton("Test"));
  right_col.appendChild(createButton("Test"));
  right_col.appendChild(createButton("Test"));
  right_col.appendChild(createButton("Test"));
  right_col.appendChild(createButton("Style"));


  // create renderer renderer
  renderer_chair = createRenderer('models/chair.glb');
  const renderer_div = document.createElement('div');
  renderer_div.className="col-md-8 renderer carousel slide";
  renderer_div.id="carouselExampleIndicators";
  renderer_div.appendChild(renderer_chair.domElement);

  row.appendChild(renderer_div);
  row.appendChild(right_col);
  container.appendChild(row);
  
}
function animate() {
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
init();
