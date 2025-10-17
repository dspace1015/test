import * as THREE from 'three';
//Import addon for parametric surfaces
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
//Import Three js object loader 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//create the scene
const scene = new THREE.Scene();
//Define the camera
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
//Define renderer and properties
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//defining texuter loader
const loader = new THREE.TextureLoader();

//Loading textures:
const Earth_tex = loader.load("models/2k_earth_daymap.jpg");

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

//Setup time keeping
let Time = new Date().getTime()/1000;
let dt = 0;
//Main loop for project
function main() {
  dt = Time - Date().getTime()/1000;
  Time = Date().getTime()/1000
  Update();
  renderer.render( scene, camera );
}
function Update(){
  Earth.rotation.x += 0.06*dt;
  Earth.rotation.y += 0.6*dt;
}
renderer.setAnimationLoop( main );
