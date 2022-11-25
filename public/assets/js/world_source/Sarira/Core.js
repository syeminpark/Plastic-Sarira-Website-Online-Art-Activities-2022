import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { Microplastic } from './Microplastic.js';

import {MyMath} from '/assets/js/three/MyMath.js';

class Core extends Microplastic {
    constructor(threeSystem,particleMaterial) {
        super(threeSystem,particleMaterial)
      
    
    }
    attract(floatingMicro) {
        // Calculate direction of force
        let force = new THREE.Vector3(0, 0, 0)
        force.subVectors(this.positionVector3, floatingMicro.getPositionVector());
        let distance =MyMath.constrain(force.length(),4,20)
        let G=1
        let strength = (G * this.mass * floatingMicro.mass / (distance * distance));
        // Get force vector --> magnitude * direction
        force.setLength(strength);
        return force;
    }
}

export {Core}