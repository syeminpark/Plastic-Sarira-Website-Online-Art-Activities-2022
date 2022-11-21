import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { Life } from './Life.js'
import { BodySystem } from './../Sarira/BodySystem.js'

import {MyMath} from '/assets/js/three/MyMath.js';

// 파티클 흡수하는 Life
class Life_Absorb extends Life {
    constructor(index, worldSize, setPos) {
        super(index, worldSize, setPos);

        this.setMicroPlastic();
    }

    setMicroPlastic() {
        this.absorbedParticles = [];
        this.sariraParticlesData = [];
        this.sariraParticles = [];

        this.absorbPlasticNum = (this.size + this.noiseSize) * 100;

        this.microPlastic_eat_maxAmount = Math.floor(MyMath.mapRange(this.mass, 0, 50, 30, 150));
        this.microPlastic_breath_maxAmount = Math.floor(MyMath.mapRange(this.mass, 0, 50, 30, 100));
    }

    update() {
        super.update();
        this.wrapParticles();
    }

    //안씀
    absorb(microPlastic) {
        const distance = this.position.distanceTo(microPlastic.position);
        const lifeSize = (this.size + this.noiseSize) * 1;
        let sariraPos = this.position;

        let force = new THREE.Vector3().subVectors(sariraPos, microPlastic.position);

        if (microPlastic.isEaten == false && this.absorbedParticles.length < this.microPlastic_maxAmount) {
            //아직 먹히지 않은 상태의 파티클 끌어당기기
            if (distance < lifeSize) {
                force.multiplyScalar(0.02);
                microPlastic.applyForce(force);
            }

            //파티클 먹고 파티클 상태 먹힌것으로 변경
            if (distance < this.size * 0.5) {
                microPlastic.data.setPassBy('life' + this.index);
                this.absorbedParticles.push(microPlastic);
                this.sariraParticlesData.push(microPlastic.data.getDataList());

                microPlastic.isEaten = true;
                this.isMakeSarira = true;
            }
        }
    }

    eat(microPlastic) {
        if (microPlastic.isEaten == false &&
            this.isDead == false && 
            this.absorbedParticles.length < this.microPlastic_eat_maxAmount) {

            const distance = this.position.distanceTo(microPlastic.position);
            const lifeSize = (this.size + this.noiseSize) * 1.5;

            //아직 먹히지 않은 상태의 파티클 끌어당기기
            if (distance < lifeSize && distance > this.size * 0.45) {

                let sariraPos = this.position;
                let force = new THREE.Vector3().subVectors(sariraPos, microPlastic.position);

                force.multiplyScalar(0.1);
                microPlastic.applyForce(force);
                microPlastic.velocity.multiplyScalar(0.9);
            }

            //파티클 먹고 파티클 흡수 상태로 변경
            else if (distance <= this.size * 0.45) {
                microPlastic.data.setAbsorbedBy(1);
                this.absorbedParticles.push(microPlastic);
                this.energy += 0.1;
                microPlastic.isEaten = true;
            }
        }
    }

    breath(microPlastic) {
        //아직 먹히지 않은 상태의 파티클 끌어당기기
        if (microPlastic.isEaten == false &&
            this.isDead == false && 
            this.absorbedParticles.length < this.microPlastic_breath_maxAmount) {

            const distance = this.position.distanceTo(microPlastic.position);
            const lifeSize = (this.size + this.noiseSize) * 1;

            if (distance < lifeSize && distance > this.size * 0.55) {
                let force = new THREE.Vector3().copy(this.position).sub(microPlastic.position);

                force.multiplyScalar(0.1);
                microPlastic.applyForce(force);
                microPlastic.velocity.multiplyScalar(0.9);
            }

            //파티클 먹고 파티클 흡수 상태로 변경
            else if (distance <= this.size * 0.55 && MyMath.random(0, 1) < 0.55) {
                microPlastic.data.setAbsorbedBy(1);
                this.absorbedParticles.push(microPlastic);
                microPlastic.isEaten = true;
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
            if (MyMath.random(0, 5) < this.sariraSpeed && distance < sariraSpace &&
                this.absorbedParticles[i].isSarira == false && this.absorbedParticles.length < this.absorbPlasticNum) {

                this.absorbedParticles[i].data.setPassBy('');

                this.absorbedParticles[i].isSarira = true;

                this.sariraParticles.push(this.absorbedParticles[i]);
                this.sariraParticlesData.push(this.absorbedParticles[i].data.getDataList());

                //if (sariraSpace < this.size) sariraSpace += 0.01;
                this.isMakeSarira = true;
            }
        }
    }
}

// 사리 만드는 Life
class Life_Sarira extends Life_Absorb {
    constructor(index, worldSize, Sarira_Material, Sarira_ConvexMaterial, setPos) {
        super(index, worldSize, setPos);

        // this.bodySystem = new BodySystem(this.index, this.world);
        // this.setSarira(Sarira_Material, Sarira_ConvexMaterial);
    }

    setSarira(microPlastic_Material, microPlastic_ConvexMaterial) {
        this.isMakeSarira = false;
        this.sariraPosition = new THREE.Vector3();
        this.sariraType = Math.floor(MyMath.random(1, 4));

        this.sariraSpeed = (this.size + this.noiseSize) * (1 / 10000);

        this.sarira_amount;
        this.toxicResistance;

        this.sarira_position;

        this.bodySystem.createBuffer(microPlastic_Material);
        this.bodySystem.createSarira(microPlastic_ConvexMaterial);
    }

    update(){
        super.update();

        this.add_MicroPlasticToSarira();
        this.sarira_position = _.cloneDeep(this.position);
        
        // this.bodySystem.update();
        // this.bodySystem.getLifePosition(this.sarira_position);
    }

    add_MicroPlasticToSarira() {
        if (this.isMakeSarira == true) {
            let data = this.sariraParticlesData[this.sariraParticlesData.length - 1];
            let send_pos = new THREE.Vector3().subVectors(this.sariraParticles[this.sariraParticlesData.length - 1].position, this.position);

            this.bodySystem.addFloatingPlastics(send_pos, data);

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

export {Life_Absorb, Life_Sarira}