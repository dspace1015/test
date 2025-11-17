import * as THREE from 'three';
//Import addon for parametric surfaces
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
//Import Three js object loader 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//create the scene
const scene = new THREE.Scene();
let R_Earth = 6378009;
//Define the camera
let fov = 60;
let near = 0.1;
let far = 1e15;
let aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
let camPitch = 0;
let camYaw = 0;
let camD = 3*R_Earth;
let camM = new THREE.Matrix4();
let camM2= new THREE.Matrix4();

//Define renderer and properties, logarithmic depth buffer so we can render extremely far and close objects
const renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//defining texuter loader
const loader = new THREE.TextureLoader();

//Loading textures:
const Earth_tex = loader.load("models/2k_earth_daymap.jpg");
//Defining critical variables:
let Planets = [];
let Ships = [];

//Defining critical functions:
function AddPlanet(mass,radius,rotVel){
  //M is mass
  Planets += {M:mass,R:radius,rotV:rotVel};
}
function OrbitToPosition(a,e,i,node,arg,v){
  let x = a*(1-e**2)/(1+e*cos(v));
  let z = -x*sin(v);
  x = x*cos(v);
  let y = 0;
  x,y,z = x*cos(arg)+z*sin(arg),y,z*cos(arg)-x*sin(arg);
  x,y,z = x,y*cos(i)+z*sin(i),z*cos(i)-y*sin(i);
  x,y,z = x*cos(node)+z*sin(node),y,z*cos(node)-x*sin(node);
  return {x:x,y:y,z:z};
}
function OrbitToVelocity(GM,a,e,i,node,arg,v){
  let x = a*(1-e**2);
  let z = -Math.sqrt(M*x)*(1+e*Math.cos(v))/x;
  x = E*Math.sqrt(M(1-(Math.cos(v))**2)/x);
  if(v%(2*Math.PI)>Math.PI){
    x = -x;
  }
  let y = 0;
  x,y,z = x*cos(arg)+z*sin(arg),y,z*cos(arg)-x*sin(arg);
  x,y,z = x,y*cos(i)+z*sin(i),z*cos(i)-y*sin(i);
  x,y,z = x*cos(node)+z*sin(node),y,z*cos(node)-x*sin(node);
  return {x:x,y:y,z:z};
}
//Defining the terrain function
function terrain(u,v,target){
  u*= 2*Math.PI;
  v = 1-v;
  v*= Math.PI;
  //Calculates position of vertex off of u,v
  let x = -Math.cos(u)*Math.sin(v);
  let z = Math.sin(u)*Math.sin(v);
  let y = Math.cos(v);
  //Height function defined in terms of x,y,z
  let h = 0.01*Math.sin(Math.PI*x*3)+0.01*Math.cos(Math.PI*z*10)+0.01*Math.cos(Math.PI*y*15+2);
  h *= 100000000;
  //Scaling by height
  x = (R_Earth+h)*x;
  y = (R_Earth+h)*y;
  z = (R_Earth+h)*z;
  target.set( x, y, z );
}
//Define geometry and Create Earth object

const Earth_g = new ParametricGeometry(terrain, 160, 80);
const Earth_m = new THREE.MeshBasicMaterial({map: Earth_tex},{side:THREE.BackSide});
const Earth = new THREE.Mesh( Earth_g, Earth_m );
scene.add( Earth );

//set up key press listeners and mouse event listeners
let pressedKeys = {};
let mouse = {x:0,y:0,d:false};
let mouseOld = {x:0,y:0,d:false};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }
window.onmousemove = function(e) { mouse.x = e.clientX; mouse.y = e.clientY; }
window.onmouseup = function(e){ mouse.d = false;}
window.onmousedown = function(e){ mouse.d = true;}
window.onwheel = function(e){camD *= Math.exp(0.2*Math.sign(e.deltaY));}

//Setup time keeping
let OldTime = new Date().getTime()/1000;
let Time = OldTime;
let dt = 0;

//Main loop for project
function main() {
  Time = new Date().getTime()/1000;
  dt = Time - OldTime;
  OldTime = Time;
  UpdatePhysics();
  UpdateScene();
  renderer.render( scene, camera );
}
function UpdatePhysics(){
  //Nothing much to see yet...
  //Earth.rotation.y += 0.1*dt;
}
function UpdateScene(){
  //Resize the window so that the scene is always centered:
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if(mouse.d){
    //Changes the camera angle if the mouse is pressed.
    camPitch += -Math.PI*(mouse.y - mouseOld.y)/window.innerHeight;
    camYaw += -Math.PI*(mouse.x - mouseOld.x)/window.innerHeight;
  }
  //Sorry to use matricies, but its the only way I know of that lets us have no up in space, so this is just preparing for that.
  //I know quaternions could work too, but matricies give you more power for orientation in my opinion.
  //Initialises camM matrix with no rotation
  camM.identity();
  //Makes a new rotation matrix and applies the rotation to camM
  camM2.makeRotationY(camYaw);
  camM.multiply(camM2);
  //One more rotation
  camM2.makeRotationX(camPitch);
  camM.multiply(camM2);
  //set the camera rotation to the matrix camM and its position accordingly
  camera.rotation.setFromRotationMatrix(camM);
  camera.position.set(camD*camM.elements[8],camD*camM.elements[9],camD*camM.elements[10]);
  //Updates the old mouse position so they are ready for the next frame.
  mouseOld.x = mouse.x;
  mouseOld.y = mouse.y;
  mouseOld.d = mouse.d;
}
renderer.setAnimationLoop( main );
