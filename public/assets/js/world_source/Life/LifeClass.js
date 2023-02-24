import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    Life, Life_noShader, Life_newShader
} from './Life.js'
import {
    BodySystem
} from './../Sarira/BodySystem.js'

import {
    MyMath
} from '/assets/js/utils/MyMath.js';

// 파티클 흡수하는 Life
class Life_Absorb extends Life_newShader {
    constructor(index, world, setPos) {
        super(index, world, setPos);

        this.setMicroPlastic();
    }

    setMicroPlastic() {
        this.absorbedParticles = [];
        this.sariraParticles = [];

        this.sariraCount = 0;
        this.sariraSpeed = MyMath.random(0.001, .5);
        this.microPlastic_breath_maxAmount = Math.floor(MyMath.random(10, 30));

        this.isMakeSarira = false;

        this.absorbMaxCount = this.mass;
    }

    update() {
        super.update();
        this.wrapParticles();
    }

    //안씀
    // absorb(microPlastic) {
    //     const distance = this.position.distanceTo(microPlastic.position);
    //     const lifeSize = (this.size + this.noiseSize) * 1;
    //     let sariraPos = this.position;

    //     let force = new THREE.Vector3().subVectors(sariraPos, microPlastic.position);

    //     if (microPlastic.isEaten == false && this.absorbedParticles.length < this.microPlastic_maxAmount) {
    //         //아직 먹히지 않은 상태의 파티클 끌어당기기
    //         if (distance < lifeSize) {
    //             force.multiplyScalar(0.02);
    //             microPlastic.applyForce(force);
    //         }

    //         //파티클 먹고 파티클 상태 먹힌것으로 변경
    //         if (distance < this.size * 0.5) {
    //             microPlastic.data.setPassBy('life' + this.index);
    //             this.absorbedParticles.push(microPlastic);

    //             microPlastic.isEaten = true;
    //             this.isMakeSarira = true;
    //         }
    //     }
    // }

    eat(microPlastic) {
        if (this.isEatMotionPlaying == false) return;
        
        // if (this.index == 0) console.log("eat");

        const lifeSize = (this.size + this.noiseSize) * 0.9;
        const distance = this.position.distanceTo(microPlastic.position);
        if (distance > this.mass > 2) return;

        if (microPlastic.isEaten == false && microPlastic.isActive == true && this.isDead == false){
            //아직 먹히지 않은 상태의 파티클 끌어당기기
            if (distance < lifeSize && distance > this.size * 0.45) {

                let sariraPos = this.position;
                let force = new THREE.Vector3().subVectors(sariraPos, microPlastic.position);

                force.multiplyScalar(0.1);
                microPlastic.applyForce(force);
                microPlastic.velocity.multiplyScalar(0.9);
               
                //  microPlastic.setD3PlasticDataInLife(this.index, this.setD3jsData());
            }

            //파티클 먹고 파티클 흡수 상태로 변경
            if (distance <= this.size * 0.45) {
                this.absorbedParticles.push(microPlastic);
                microPlastic.isEaten = true;
            }
        }
    }

    breath(microPlastic) {
        //아직 먹히지 않은 상태의 파티클 끌어당기기
        const lifeSize = (this.size + this.noiseSize) * 1;
        const distance = this.position.distanceTo(microPlastic.position);
        if (distance > this.mass > 2) return;

        if (microPlastic.isEaten == false && microPlastic.isActive == true && this.isDead == false && 
            this.absorbedParticles.length <= this.absorbMaxCount * 2){
            if (distance < lifeSize && distance > this.size * 0.55) {
                let force = new THREE.Vector3().copy(this.position).sub(microPlastic.position);

                force.multiplyScalar(0.1);
                microPlastic.applyForce(force);
                microPlastic.velocity.multiplyScalar(0.9);
             
                //  microPlastic.setD3PlasticDataInLife(this.index, this.setD3jsData());
            }

            if (this.absorbedParticles.length < this.microPlastic_breath_maxAmount) {
        
                //파티클 먹고 파티클 흡수 상태로 변경
                if (distance <= this.size * 0.55 && MyMath.random(0, 1) < 0.55) {
                    // microPlastic.data.setAbsorbedBy(1);
                    this.absorbedParticles.push(microPlastic);                   
                    microPlastic.isEaten = true;
                }
            }
        }
    }

    wrapParticles() {
        let sariraPos = new THREE.Vector3().copy(this.position);
        let sariraSpace = this.size * 0.3;

        //흡수된 파티클 몸안에 가둠
        for (let i = 0; i < this.absorbedParticles.length; i++) {
            this.absorbedParticles[i].wrapCenter = this.position;
            this.absorbedParticles[i].wrapSize = this.size * 0.7;
            this.absorbedParticles[i].velLimit = 0.25;

            let distance = this.position.distanceTo(this.absorbedParticles[i].position);
            const force = new THREE.Vector3().subVectors(sariraPos, this.absorbedParticles[i].position);
            const wrapPos = new THREE.Vector3().addVectors(sariraPos, force.setLength(this.size * 0.6));

            //if (distance < this.size*0.7) force.multiplyScalar(((distance*distance*distance)/150));
            force.multiplyScalar(((distance * distance * distance) / 900));
            this.absorbedParticles[i].applyForce(force);
            if (distance > this.size) this.absorbedParticles[i].position = wrapPos;

            //그중에서 일정 확률로 몇몇 파티클이 사리가 되도록 함   
            if (MyMath.random(0, 100) < this.sariraSpeed && 
                distance < sariraSpace &&
                this.absorbedParticles[i].isSarira == false &&
                this.sariraCount < 100) {

                this.absorbedParticles[i].isSarira = true;

                this.sariraParticles.push(this.absorbedParticles[i]);               
                this.absorbedParticles.splice(i, 1);

                if (sariraSpace < this.size) sariraSpace += 0.01;
                this.isMakeSarira = true;
                this.sariraCount ++;
            }
        }
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