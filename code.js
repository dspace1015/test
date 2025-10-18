import * as THREE from 'three';
//Import addon for parametric surfaces
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
//Import Three js object loader 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//create the scene
const scene = new THREE.Scene();
//Define the camera
let fov = 60;
let near = 0.1;
let far = 1000;
let aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
//Define renderer and properties
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//defining texuter loader
const loader = new THREE.TextureLoader();

//Loading textures:
const Earth_tex = loader.load("models/2k_earth_daymap.jpg");
//Defining critical functions:
function RotateM(M,axis,ang){
  if(axis=="x"){
    return [M[0],M[1]*Math.cos(ang)-M[2]*Math.sin(ang),M[2]*Math.cos(ang)+M[1]*Math.sin(ang),M[3],
            M[4],M[5]*Math.cos(ang)-M[6]*Math.sin(ang),M[6]*Math.cos(ang)+M[5]*Math.sin(ang),M[7],
            M[8],M[9]*Math.cos(ang)-M[10]*Math.sin(ang),M[10]*Math.cos(ang)+M[9]*Math.sin(ang),M[11],
            M[12],M[13],M[14],M[15]];
  }
}
//Defining the terrain function
function terrain(u,v,target){
  u*= 2*Math.PI;
  v = 1-v;
  v*= Math.PI;
  //Calculates position of vertex off of u,v
  let x = Math.cos(u)*Math.sin(v);
  let z = -Math.sin(u)*Math.sin(v);
  let y = Math.cos(v);
  //Height function defined in terms of x,y,z
  let h = 0.01*Math.sin(Math.PI*x*3)+0.01*Math.cos(Math.PI*z*10)+0.01*Math.cos(Math.PI*y*15+2);
  //Scaling by height
  x = (1+h)*x;
  y = (1+h)*y;
  z = (1+h)*z;
  target.set( x, y, z );
}
//Define geometry and Create Earth object
const geometry = new ParametricGeometry(terrain, 500, 500);
const material = new THREE.MeshBasicMaterial({map: Earth_tex},{side:THREE.BackSide});
const Earth = new THREE.Mesh( geometry, material );
scene.add( Earth );

//Set camera position
camera.position.z = 3;
//set up key press listeners and mouse event listeners
let pressedKeys = {};
let mouse = {x:0,y:0,d:false};
let mouseOld = {x:0,y:0,d:false};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }
window.onmousemove = function(e) { mouse.x = e.clientX; mouse.y = e.clientY; }
window.onmouseup = function(e){ mouse.d = false;}
window.onmousedown = function(e){ mouse.d = true;}

//Setup time keeping
let OldTime = new Date().getTime()/1000;
let Time = OldTime;
let dt = 0;
//Main loop for project
function main() {
  Time = new Date().getTime()/1000;
  dt = Time - OldTime;
  OldTime = Time;
  Update();
  renderer.render( scene, camera );
}
function Update(){
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  if(mouse.d){
    camera.rotation.x += Math.PI*(mouse.y - mouseOld.y)/window.innerHeight;
    camera.rotation.y += Math.PI*(mouse.x - mouseOld.x)/window.innerHeight;
  }
  console.log(camera.matrixWorld);
  mouseOld.x = mouse.x;
  mouseOld.y = mouse.y;
  mouseOld.d = mouse.d;
}
renderer.setAnimationLoop( main );
