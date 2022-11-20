import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { Microplastic } from './Microplastic.js';

import '/assets/js/three/MyMath.js';

class Core extends Microplastic {
    constructor(threeSystem,particleMaterial) {
        super(threeSystem,particleMaterial)
        
        this.microType = "Polypropylene"; // polypropylene was identified in baby
        this.absorbedBy = "Inheritance"
        this.dateRetrieved = "When You Were A Fetus"
        this.madeIn = 1951
        this.originalFormList = ["Syringe", "Chip Bag", "Specimen Bottle", "Car Battery Case", "Instrument Panel", "Rug", "Crisp Bag", "Lunch Box", "Packing Tape", "Tobacco Package", "Beach Slipper", "Tote Bag", "Vacuum Cleaner", "Car Bumper", "Door Trim"]
        this.passedByList = ["Mom"]

        this.density = 0.92
        this.tensileStrength = 5440

    }
    initialize(positionList) {
        super.initialize(positionList,this.density, this.tensileStrength)
      
    }

    initializePassDataList() {
        this.originalForm = this.originalFormList[Math.round(MyMath.random(0, this.originalFormList.length - 1))]
        this.madeIn = JSON.stringify(Math.round(MyMath.random(this.madeIn, 2021)));
        this.passDataList = [this.originalForm, this.madeIn, this.microType, this.passedByList, this.absorbedBy, this.dateRetrieved]
    }

    attract(floatingMicro) {
        // Calculate direction of force
        let force = new THREE.Vector3(0, 0, 0)
        force.subVectors(this.positionVector3, floatingMicro.getPositionVector());
        // Distance between objects

        let distance = MyMath.constrain(force.length(), 5, 20);
        // Calculate gravitional force magnitude

        //!!! mass is the same
        let strength = ( 2*this.mass*floatingMicro.getMass()) / (distance * distance);
        // Get force vector --> magnitude * direction
        force.setLength(strength);
        return force;
    }
}

export {Core}