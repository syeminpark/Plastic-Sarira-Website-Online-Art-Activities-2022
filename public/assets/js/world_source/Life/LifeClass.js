import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    Life
} from './Life.js'
import {
    BodySystem
} from './../Sarira/BodySystem.js'

import {
    MyMath
} from '/assets/js/utils/MyMath.js';

// 파티클 흡수하는 Life
class Life_Absorb extends Life {
    constructor(index, world, setPos) {
        super(index, world, setPos);

        this.setMicroPlastic();
    }

    setMicroPlastic() {
        this.absorbedParticles = [];
        this.sariraParticles = [];

        // this.absorbPlasticInSec = Math.floor(MyMath.random(1, 10));
        // this.absorbPlasticInLife = Math.floor(MyMath.random(10, 100));

        // this.microPlastic_eat_minAmount = Math.floor(this.absorbPlasticInSec * 0.7);
        // this.microPlastic_breath_minAmount = Math.floor(this.absorbPlasticInSec * 0.3);

        // this.microPlastic_eat_maxAmount = Math.floor(this.absorbPlasticInLife * 0.7);
        // this.microPlastic_breath_maxAmount = Math.floor(this.absorbPlasticInLife * 0.3);

        // this.absorbParticleCount = 0;

        // this.isMakeSarira = false;

        // ==========================================================

        this.eatParticles = [];
        this.breathParticles = [];

        this.eatPosition = new THREE.Vector3(MyMath.random(-this.size/2, this.size/2), 
                                             MyMath.random(-this.size/2, this.size/2), 
                                             MyMath.random(-this.size/2, this.size/2));
        this.breathPosition = new THREE.Vector3(MyMath.random(-this.size/2, this.size/2), 
                                             MyMath.random(-this.size/2, this.size/2), 
                                             MyMath.random(-this.size/2, this.size/2));
    
        this.eatCount = Math.floor(MyMath.random(1, 10));
        this.breathCount = Math.floor(MyMath.random(1, 10));

        this.eatSize = MyMath.random(5, this.size);
        this.breathSize = MyMath.random(5, this.size);
    }

    update() {
        super.update();
        this.wrapParticles();
    }

    eat(microPlastic) {
        if (this.isDead == false && 
            this.eatParticles.length < this.eatCount &&
            microPlastic.isEaten == false && microPlastic.isActive == true) {

                const eatPos = new THREE.Vector3().addVectors(new THREE.Vector3().copy(this.position), 
                                                              this.eatPosition);
                const distance = eatPos.distanceTo(microPlastic.position);

                if (distance < this.mass){
                    this.eatParticles.push(microPlastic);
                }
            }        
    }

    eatWrap(){
        for (let i = 0; i < this.eatParticles.length; i++) {
            const eatP = this.eatParticles[i];
            
            // const eatPos = new THREE.Vector3().addVectors(new THREE.Vector3().copy(this.position), 
            //                                               this.eatPosition);
            const eatPos = new THREE.Vector3().copy(this.position);
            const dir = new THREE.Vector3().subVectors(eatPos, eatP.position);


            if (dir.length() > this.mass){
                dir.setLength(this.mass);
                eatP.position = new THREE.Vector3().addVectors(eatPos, dir);                
            }
            else if (dir.length() <= this.mass && dir.length() > this.size){
                dir.multiplyScalar(0.1);
                eatP.applyForce(dir);
            }
            else {
                if (eatP.isEaten == false){
                    eatP.isEaten = true;
                    eatP.wrapCenter = eatPos;
                    eatP.wrapSize = this.size;
                    eatP.velLimit = 0.25;
                }
                // dir.multiplyScalar(0.1);
                eatP.applyForce(dir);
                eatP.velocity.multiplyScalar(0.99);
            }
        }
    }

    breath(microPlastic) {
        // //아직 먹히지 않은 상태의 파티클 끌어당기기
        // const distance = this.position.distanceTo(microPlastic.position);
        // const lifeSize = (this.size + this.noiseSize) * 1;

        // if (microPlastic.isEaten == false && microPlastic.isActive == true && this.isDead == false){
        //     if (distance < lifeSize && distance > this.size * 0.55) {
        //         let force = new THREE.Vector3().copy(this.position).sub(microPlastic.position);

        //         force.multiplyScalar(0.1);
        //         microPlastic.applyForce(force);
        //         microPlastic.velocity.multiplyScalar(0.9);
        //     }

        //     if (this.absorbedParticles.length < this.microPlastic_breath_maxAmount) {
        
        //         if (distance <= this.size * 0.55 && MyMath.random(0, 1) < 0.55) {
        //             this.absorbedParticles.push(microPlastic);                  
        //             microPlastic.isEaten = true;
        //         }
        //     }
        // }
    }

    breathWrap(){

    }

    wrapParticles() {
        // let sariraPos = new THREE.Vector3().copy(this.position);
        // let sariraSpace = this.size * 0.3;

        // //흡수된 파티클 몸안에 가둠
        // for (let i = 0; i < this.absorbedParticles.length; i++) {
        //     const p =  this.absorbedParticles[i];
        //     p.wrapCenter = this.position;
        //     p.wrapSize = this.size;
        //     p.velLimit = 0.25;

        //     let distance = this.position.distanceTo(p.position);
        //     // const force = new THREE.Vector3().subVectors(sariraPos, p.position);
        //     // const wrapPos = new THREE.Vector3().addVectors(sariraPos, force.setLength(this.size * 0.6));

        //     // force.multiplyScalar(((distance * distance * distance) / 900));
        //     // p.applyForce(force);
        //     // if (distance > this.size) p.position = wrapPos;

        //     //그중에서 일정 확률로 몇몇 파티클이 사리가 되도록 함   
        //     if (distance < sariraSpace &&
        //         p.isSarira == false && 
        //         this.absorbedParticles.length < this.absorbPlasticInSec) {
                
        //         p.isSarira = true;

        //         this.sariraParticles.push(this.absorbedParticles[i]);            
        //         this.absorbedParticles.splice(i, 1);

        //         if (sariraSpace < this.size) sariraSpace += 0.01;
        //         this.isMakeSarira = true;
        //     }
        // }

        this.eatWrap();
        this.breathWrap();
    }

    setD3jsData(){

    }
}

// 사리 만드는 Life
class Life_Sarira extends Life_Absorb {
    constructor(index, world, Sarira_Material, standardMaterial, setPos) {
        super(index, world, setPos);

        this.bodySystem = new BodySystem(this.index, this.worldThree);
        this.setSarira(Sarira_Material, standardMaterial);
    }

    setSarira(microPlastic_Material,  standardMaterial) {
        this.isMakeSarira = false;
        this.sariraPosition = new THREE.Vector3();
        this.sariraType = Math.floor(MyMath.random(1, 4));

        this.sariraSpeed = (this.size + this.noiseSize) * (1 / 10000);

        this.sarira_amount;
        this.toxicResistance;

        this.sarira_position;

        this.bodySystem.createBuffer(microPlastic_Material);
        this.bodySystem.createSarira(standardMaterial);
    }

    update() {
        super.update();

        this.add_MicroPlasticToSarira();
        this.sarira_position = new THREE.Vector3().copy(this.position);

        this.bodySystem.update();
        this.bodySystem.setPosition(this.sarira_position);
    }

    add_MicroPlasticToSarira() {
        if (this.isMakeSarira == true) {
            let send_pos = new THREE.Vector3().subVectors(this.sariraParticles[this.sariraParticles.length - 1].position, this.position);
            // console.log(data)
            // this.bodySystem.addFloatingPlastics(send_pos, data);
            this.bodySystem.addFloatingPlastics(send_pos);

            this.sariraParticles[this.sariraParticles.length - 1].isActive = false;
            this.sariraParticles.splice(this.sariraParticles.length - 1, 1);

            this.isMakeSarira = false;
        }
        for (let j = 0; j < this.sariraParticles.length; j++) {
            this.sariraParticles[j].position = new THREE.Vector3().copy(this.position);
        }
    }

    make_sarira() {
        const sariraSize = this.size / 5;
        if (this.sariraType == 1) {
            let sariraGeometry = new THREE.SphereGeometry(
                sariraSize,
                Math.floor(MyMath.random(3, 5)),
                Math.floor(MyMath.random(2, 5)));
        } else if (this.sariraType == 2) {
            let sariraGeometry = new THREE.TetrahedronGeometry(
                sariraSize,
                Math.floor(MyMath.random(0, 5)));
        } else {
            let sariraGeometry = new THREE.CircleGeometry(
                sariraSize,
                Math.floor(MyMath.random(0, 24)),
                0,
                MyMath.random(0, 6.3));
        }

        let sariraMaterial = new THREE.MeshBasicMaterial({
            transparent: false,
            opacity: 0.5,
        });
        this.sarira = new THREE.Mesh(sariraGeometry, sariraMaterial);
        this.sarira.rotation.set(this.angle.x, this.angle.y, this.angle.z);

        this.lifeMesh.add(this.sarira);
    }
}

export {
    Life_Absorb,
    Life_Sarira
}