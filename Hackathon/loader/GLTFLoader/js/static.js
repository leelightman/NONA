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

function createCarouselIndicator(){
  const carousel_indicators = document.createElement('ol');
  carousel_indicators.className="carousel-indicators";

  const item1 = document.createElement('li');
  item1.className="item1 active";
  const item2 = document.createElement('li');
  item2.className="item2";
  const item3 = document.createElement('li');
  item3.className="item3";
  const item4 = document.createElement('li');
  item4.className="item4";

  carousel_indicators.appendChild(item1);
  carousel_indicators.appendChild(item2);
  carousel_indicators.appendChild(item3);
  carousel_indicators.appendChild(item4);

  return carousel_indicators;
}
function createImg(img_file){
  const img = document.createElement('img');
  img.setAttribute("src",img_file);
  img.setAttribute("style","min-height:400px");

  return img;
}
function createItem(isActive, filename){
  const item = document.createElement('div');
  if(isActive){
    item.className="item active";
  }else{item.className="item";}

  //renderer_chair = createRenderer(filename);
  //item.appendChild(renderer_chair.domElement);
  item.appendChild(createImg(filename));
  return item;
}

function createLeft(){
  const left = document.createElement('a');
  left.className="left carousel-control";
  left.setAttribute("href","#myCarousel");
  left.setAttribute("role","button");
  left.setAttribute("data-slide","prev");

  const icon_prev = document.createElement('span');
  icon_prev.className="glyphicon glyphicon-chevron-left";
  icon_prev.setAttribute("area_hidden", true);
  const prev = document.createElement('span');
  prev.className="sr-only";
  var text = document.createTextNode("Previous");
  prev.appendChild(text);

  left.appendChild(icon_prev);
  left.appendChild(prev);

  return left;
}

function createRight(){
  const right = document.createElement('a');
  right.className="right carousel-control";
  right.setAttribute("href","#myCarousel");
  right.setAttribute("role","button");
  right.setAttribute("data-slide","next");

  const icon_next = document.createElement('span');
  icon_next.className="glyphicon glyphicon-chevron-right";
  icon_next.setAttribute("area_hidden", true);
  const next = document.createElement('span');
  next.className="sr-only";
  text = document.createTextNode("Next");
  next.appendChild(text);

  right.appendChild(icon_next);
  right.appendChild(next);

  return right;
}
function createCarousel(){
  
  // create mycarousel
  const myCarousel = document.createElement('div');
  myCarousel.className="col-md-8 renderer carousel slide";
  myCarousel.id="myCarousel";

  // create inner
  const carousel_inner = document.createElement('div');
  carousel_inner.className="carousel-inner";
  carousel_inner.setAttribute("role","listbox");
  carousel_inner.appendChild(createItem(true,"img/1.png"));
  carousel_inner.appendChild(createItem(false,"img/2.png"));
  carousel_inner.appendChild(createItem(false,"img/3.png"));
  carousel_inner.appendChild(createItem(false,"img/4.png"));
  carousel_inner.appendChild(createItem(false,"img/5.png"));
  //carousel_inner.appendChild(createItem(true,"models/chair.glb"));
  //carousel_inner.appendChild(createItem(false,"models/chair.glb"));
  //carousel_inner.appendChild(createItem(false,"models/chair.glb"));


  // attach indicator and inner wrapper
  myCarousel.appendChild(createCarouselIndicator());
  myCarousel.appendChild(carousel_inner);
  myCarousel.appendChild(createLeft());
  myCarousel.appendChild(createRight());

  return myCarousel;

}
function init() {
  
  // create container
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.className="container";

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
  const renderer_div = createCarousel();

  row.appendChild(renderer_div);
  row.appendChild(right_col);
  container.appendChild(row);
  
}
function animate() {
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
init();
