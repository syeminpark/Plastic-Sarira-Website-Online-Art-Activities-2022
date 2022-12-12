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

        this.eatTarget = undefined;
        this.breathInOutTiming = MyMath.random(100, 500);

        this.eatPosition = new THREE.Vector3(MyMath.random(-this.size/2, this.size/2), 
                                             MyMath.random(-this.size/2, this.size/2), 
                                             MyMath.random(-this.size/2, this.size/2));
        this.breathPosition = new THREE.Vector3(MyMath.random(-this.size/2, this.size/2), 
                                             MyMath.random(-this.size/2, this.size/2), 
                                             MyMath.random(-this.size/2, this.size/2));
    
        this.eatCount = Math.floor(MyMath.random(5, 12));
        this.breathCount = Math.floor(MyMath.random(5, 12));

        this.eatSize = MyMath.random(1, this.size/2);
        this.breathSize = MyMath.random(1, this.size/2);

        // this.eatPower = MyMath.random(0.001, 0.01);
        this.breathPower = MyMath.random(0.001, 0.01);
    }

    update() {
        super.update();
    }


    eat(microPlastic) {

        const particleSpeed = 0.000005;

        // 1. 먹을 타겟 찾기
        if (this.eatTarget == undefined &&
            MyMath.random(0, 1) < 0.1 &&
            this.eatParticles.length < this.eatCount &&
            microPlastic.isEaten == false && microPlastic.isActive == true) {

            const eatPos = new THREE.Vector3().addVectors(new THREE.Vector3().copy(this.position), 
                                                          this.eatPosition);
            const distance = eatPos.distanceTo(microPlastic.position);

            if (distance < this.mass * 1.5 && distance >= this.eatSize){
                
                this.eatTarget = microPlastic;
            }     
            // if (this.index == 0) console.log("find target");       
        }        

        // 2. 타겟 먹기
        else if (this.eatTarget != undefined){

            const eatPos = new THREE.Vector3().addVectors(new THREE.Vector3().copy(this.position), 
                                                          this.eatPosition);
            const dir = new THREE.Vector3().subVectors(eatPos, this.eatTarget.position);
            const distance = dir.length();

            if (distance > this.mass * 2){
                this.eatTarget = undefined;
            }
            else if (distance <= this.mass * 2 && distance > this.eatSize){
                dir.multiplyScalar(particleSpeed);
                this.eatTarget.applyForce(dir);
                this.eatTarget.velocity.multiplyScalar(0.1);
            } else if (distance <= this.eatSize) {
                this.eatParticles.push(this.eatTarget);
                this.eatTarget = undefined;
            }
            if (this.index == 0) console.log("eat target");       
        }

        // 3. 타겟 가두기
        else if (this.eatParticles.length > 0){
            for (let i = 0; i < this.eatParticles.length; i++) {
                const eatP = this.eatParticles[i];
                
                const eatPos = new THREE.Vector3().addVectors(new THREE.Vector3().copy(this.position), 
                                                            this.eatPosition);
                const dir = new THREE.Vector3().subVectors(eatPos, eatP.position);
                const distance = dir.length();

                dir.multiplyScalar(particleSpeed);

                if (eatP.isEaten == false && distance <= this.eatSize){
                    eatP.isEaten = true;
                    eatP.wrapSize = this.eatSize;
                    eatP.velLimit = 0.025;
                } 

                if (eatP.isActive == true){
                    eatP.wrapCenter = eatPos;

                    if (distance <= this.eatSize && eatP.velLimit > 0.05){
                        eatP.velLimit = 0.025;
                    } else if (distance > this.eatSize && eatP.velLimit < 0.05){
                        eatP.velLimit = 0.1;
                        eatP.velocity.multiplyScalar(0.1);
                    }
                }
                if (this.index == 0) console.log("wrap target");       
            }
        }

        // 4. 일정 시간 지나면 일부 파티클 내보내기 (배출, 배설)
        else if (this.eatParticles.length >= this.eatCount * 0.75 && MyMath.random(0, 1) < 0.001){
            this.eatParticles[length-1].wrapCenter = new THREE.Vector3(0,0,0);
            this.eatParticles[length-1].wrapSize = this.wrapSize;
            this.eatParticles[length-1].velLimit = 0.1;
            this.eatParticles[length-1].isEaten = false;
            this.eatParticles.pop();
            if (this.index == 0) console.log("out target");       
        }
    }        

    breath(microPlastic) {
        if (this.isDead == false && 
            this.breathParticles.length < this.breathCount &&
            microPlastic.isEaten == false && microPlastic.isActive == true) {

            const breathPos = new THREE.Vector3().addVectors(new THREE.Vector3().copy(this.position), 
                                                            this.breathPosition);
            const distance = breathPos.distanceTo(microPlastic.position);

            if (distance < this.mass){
                microPlastic.setColor(new THREE.Color(0,0,1));
                this.breathParticles.push(microPlastic);
            }
        }

        this.breathWrap();
    }

    breathWrap(){
        for (let i = 0; i < this.breathParticles.length; i++) {
            const breathP = this.breathParticles[i];
            
            const breathPos = new THREE.Vector3().addVectors(new THREE.Vector3().copy(this.position), 
                                                          this.breathPosition);
            const dir = new THREE.Vector3().subVectors(breathPos, breathP.position);

            if (breathP.isEaten == false){
                if (dir.length() < this.mass * 1.5){
                    dir.multiplyScalar(0.01);
                    breathP.applyForce(dir);
                } 
                else if (dir.length() < this.breathSize){
                    breathP.isEaten = true;
                    breathP.wrapCenter = breathPos;
                    breathP.wrapSize = this.breathSize;
                    breathP.velLimit = 0.0025;
                }
            } else {
                if (dir.length() > this.mass){
                    // breathP.position = new THREE.Vector3().subVectors(breathPos, dir);
                }
                else if (dir.length() <= this.mass && dir.length() > this.breathSize) {
                    
                    breathP.acceleration.multiplyScalar(0);
                    
                    // 내쉬고 들이쉬기
                    if (this.clock.getElapsedTime() % 600 > this.breathInOutTiming) dir.multiplyScalar(-1);
                    else dir.multiplyScalar(1);

                    dir.multiplyScalar(0.001);
                    breathP.applyForce(dir);
                    breathP.velocity.multiplyScalar(0.1);
                }
            }
        }
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