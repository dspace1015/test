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
//Test making new geometry, defining surface function
function terrain(u,v,target){
  u*= 2*Math.PI;
  v*= Math.PI;
  let x = Math.cos(u)*Math.sin(v);
  let y = Math.sin(u)*Math.sin(v);
  let z = Math.cos(v);
  let h = 0.05*Math.sin(Math.PI*x*3)+0.05*Math.cos(Math.PI*y*10)+0.05*Math.cos(Math.PI*z*15+2);
  x = (1+h)*x;
  y = (1+h)*y;
  z = (1+h)*z;
  target.set( x, y, z );
}
const geometry = new ParametricGeometry(terrain, 500, 500);
const material = new THREE.MeshBasicMaterial({map: Earth_tex},{side:THREE.BackSide});
const Earth = new THREE.Mesh( geometry, material );
scene.add( Earth );
camera.position.z = 3;

//Main loop for project
function main() {
  Update();
  renderer.render( scene, camera );
}
function Update(){
  Earth.rotation.x += 0.6/60;
  Earth.rotation.y += 0.6/60;
}
renderer.setAnimationLoop( main );
