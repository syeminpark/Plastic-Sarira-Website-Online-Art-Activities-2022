import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {D3Dataset} from './D3Dataset.js';

import {MyMath} from '/assets/js/utils/MyMath.js';

class Particle {
  constructor(index, worldSize) {
    this.index = index;

    this.worldSize = worldSize;

    this.position = new THREE.Vector3(
      MyMath.random(-this.worldSize, this.worldSize),
      MyMath.random(-this.worldSize, this.worldSize),
      MyMath.random(-this.worldSize, this.worldSize)); 

    if (this.position.length() > this.worldSize) {
      this.position.setLength(this.worldSize);
    }

    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);

    this.initWrap();
    this.mass = MyMath.random(0, 1);

    this.velLimit = 0.1;
    this.wrapCenter = new THREE.Vector3(0, 0, 0);

    this.color = new THREE.Color('white');
    this.opacity = 1.0;

    this.isEaten = false;
    this.isActive = false;
  }

  setPos(newPos){
    this.position = newPos || new THREE.Vector3(
      MyMath.random(-this.worldSize, this.worldSize),
      MyMath.random(-this.worldSize, this.worldSize),
      MyMath.random(-this.worldSize, this.worldSize));

    if (this.position.length() > this.worldSize) this.position.setLength(this.worldSize);

    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);;
  }

  setColor(newColor){
    this.color = newColor;
  }

  applyForce(force) {
    this.acceleration.add(force);
    this.acceleration.multiplyScalar(this.mass);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    if (this.velocity.length() > this.velLimit) this.velocity.setLength(this.velLimit);
    this.acceleration.setLength(0);
  }

  initWrap(){
    this.wrapCenter = new THREE.Vector3(0, 0, 0);
    this.wrapSize = this.worldSize;
    this.velLimit = 0.1;
  }

  wrap() {
    const distance = this.wrapCenter.distanceTo(this.position);
    if (distance > this.wrapSize) {
      //this.velocity.multiplyScalar(-0.9999);
      const dir = new THREE.Vector3().subVectors(new THREE.Vector3().copy(this.wrapCenter), 
                                                 new THREE.Vector3().copy(this.position));
      dir.multiplyScalar(0.1);
      this.applyForce(dir);
    }
  }
}

class MicroPlastic_D3js extends Particle {
  constructor(index, worldSize) {
    super(index, worldSize);

    this.isSarira = false;
    this.toxicity = false;


    this.d3Data = new D3Dataset(this.index);
  }

  setD3PlasticData(plasticData){
    
    this.d3Data?.saveNode(plasticData.category, plasticData.subcategory, `#${plasticData.uniqueID}`);
  }

  setD3Life(userData){
    this.d3Data?.solidify(userData);
  }
}

export {Particle, MicroPlastic_D3js}