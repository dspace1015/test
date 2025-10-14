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
//Test making new geometry
function terrain(u,v,target){
  u*= Math.PI;
  v*= 2*Math.PI;
  let h = 0.1*Math.sin(10*u);
  let x = (h+1)*Math.cos(v)*Math.cos(u);
  let y = (h+1)*Math.sin(v)*Math.cos(u);
  let z = (h+1)*Math.sin(u);
  target.set( x, y, z );
}
const geometry = new ParametricGeometry(terrain, 50, 50);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 3;

//Main loop for project
function main() {
  Update();
  renderer.render( scene, camera );
}
function Update(){
  cube.rotation.x += 0.6/60;
  cube.rotation.y += 0.6/60;
}
renderer.setAnimationLoop( main );
