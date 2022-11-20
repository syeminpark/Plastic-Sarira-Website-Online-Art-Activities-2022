import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { Life_Sarira } from './LifeClass.js'

import {MyMath} from '/assets/js/three/MyMath.js';

class Life_EatOther extends Life_Sarira {
    constructor(index, worldSize, Sarira_Material, Sarira_ConvexMaterial, setPos){
        super(index, worldSize, Sarira_Material, Sarira_ConvexMaterial, setPos);
        //this.options = options;

        this.state = 0;
        this.sightRange = this.mass * 1.25;
        this.chaseTarget = null;
        this.isEaten = false;
        this.digestionSpeed = MyMath.random(1, 3);
    }

    // ===============================================================================
    // ===============================================================================

    findLife(otherLife){
        let result = false;
        let distance = this.position.distanceTo(otherLife.position);
        if (distance < this.sightRange && this.mass > otherLife.mass * 2 && otherLife.isEaten == false) {
            result = true;
            this.chaseTarget = otherLife;
            //console.log("find life");
        } 
        else {
            result = false;
            this.chaseTarget = null;
        }

        return result;
    }

    stateMachine(otherLife){
        // super.setTestText(
        //     `Life ${this.index}`);

        // 유한 상태 기계
        switch (this.state) {
            case 0: //idle
                this.normalMove(otherLife);
                break;
            case 1: //chase
                this.chaseLife();
                break;
            case 2:
                this.eatLife();
            default:
                break;
        }
    }

    normalMove(otherLife){
        if (this.findLife(otherLife)){
            this.state = 1;
            return;
        }

        this.lifeMesh.material.uniforms.glowColor.value = new THREE.Color(1,1,1);
        
        this.randomWalk();
    }

    chaseLife(){
        if (this.chaseTarget == undefined || this.chaseLife.isEaten == true){
            this.state = 0;
            return;
        } 
        
        this.lifeMesh.material.uniforms.glowColor.value = new THREE.Color(1,0,0);
        this.chaseTarget.lifeMesh.material.uniforms.glowColor.value = new THREE.Color(0,1,0);

        let dir = new THREE.Vector3();
        dir.copy(this.chaseTarget.position).sub(new THREE.Vector3().copy(this.position));
        let distance = dir.length();

        if (distance > this.sightRange * 2){
            this.state = 0;
            return;
        } 

        dir.normalize();
        dir.multiplyScalar(0.001);
        this.applyForce(dir);
        
        if (distance < (this.size + this.chaseTarget.size) * 0.5){
            this.state = 2;
        } 

        // super.setTestText(
        //     `Life ${this.index} 
        //     chase Target = ${this.chaseTarget?.index}`);
    }
    
    eatLife(){
        if (this.chaseTarget == undefined){
            this.state = 0;
            return;
        }

        if (this.chaseTarget.isDead == false){
            //console.log(this.index + " eat " + this.chaseTarget.index);

            this.lifeMesh.material.uniforms.glowColor.value = new THREE.Color(0,0,1);

            this.chaseTarget.isEaten = true;
            this.chaseTarget.wrapCenter = new THREE.Vector3().copy(this.position);

            let wrapSize = this.size * 0.25;
            this.chaseTarget.wrapSize = wrapSize;
            if (this.chaseTarget.energy > 0){
                this.energy ++;
                this.chaseTarget.energy -= this.digestionSpeed;
                if (wrapSize > 0){
                    wrapSize *= 0.9;
                }
            }
        } 
        else {
            this.chaseTarget = undefined;
        }
    }
}

export {Life_EatOther}