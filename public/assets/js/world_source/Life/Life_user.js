import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    Life_Genetic
} from './Life_Genetic.js'
import {
    BodySystem
} from './../Sarira/BodySystem.js'

import {
    MyMath
} from '/assets/js/utils/MyMath.js';
import config from '../../utils/config.js';

class Life_user extends Life_Genetic {
    constructor(options) {
        super(0, options, {
            photosynthesis: 0, // 광합성
            decomposer: 0, // 분해자(사체 분해)

            carnivore: 1, // 육식성
            herbivore: 1, // 초식성 , 둘 다 1일 경우 잡식성

            size: MyMath.random(.5, .6), // 크기
            shape: MyMath.random(0, 1), // 노이즈 모양
            shapeX: MyMath.random(0, 1), // 
            shapeY: MyMath.random(0, 1), // 

            growValue: MyMath.random(.2, .3), // 시간당 자라는 양
            growAge: MyMath.random(0, .2), // 성장이 멈추는 나이

            moveActivity: MyMath.random(.5, .6), // 1일 경우 활동적임 (움직임 많음 = 속도 빠름)
            // 노이즈 애니메이팅 효과에도 영향
            // 높을 수록 에너지 소모량 높음
            metabolismActivity: MyMath.random(.8, .9), // 대사 활동. 에너지 소모와 동시에 획득
            // 동물의 경우 소화 속도, 식물의 경우 광합성시 에너지 획득량
            // 분열 속도에 영향
            lifespan: MyMath.random(.6, .7),

            startNutrients: MyMath.random(0, 1), // 태어날 때 가지고 있는 양분

            divisionFreq: MyMath.random(.4, .5), // 번식(분열) 빈도
            divisionEnergy: MyMath.random(.6, .7), // 번식(분열)에 드는 에너지
            divisionAge: MyMath.random(.15, .2),

            attack: MyMath.random(0, .3), // 공격력
            defense: MyMath.random(0, .3), // 방어력
        }, new THREE.Vector3());

        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.angle = new THREE.Vector3();

        this.SetWindowSarira(options.Sarira_Material, options.standardMaterial, options.miniSariraThree);

        this.lifeName = undefined;
        this.lifespan = config.lifespan;

        this.eatPosition = new THREE.Vector3();

        this.sariraSpeed = .5;
    }

    init() {
        if (this.geneCode == null) return;

        this.velLimit = 1;

        this.size = 1.5;
        this.noiseSize = this.size * MyMath.map(this.geneCode.shapeX + this.geneCode.shapeY, 0, 2, .5, 1.5);
        this.lerpSize = this.size;
        
        this.sizeMax = 10;
        
        this.mass = this.size + this.noiseSize;
        
        this.shapeX = 32;
        this.shapeY = Math.floor(MyMath.map(this.geneCode.shapeY, 0, 1, 4, 32));

        this.noiseShape = this.noiseShape = MyMath.map(this.geneCode.shape, 0, 1, 0.1, 0.5);
        this.noiseSpeed = MyMath.map((this.geneCode.moveActivity + this.geneCode.metabolismActivity) * 0.5,
            0, 1, 0.05, 0.5);
       
        // document.addEventListener('keydown', 
        //     (evenet)=>{
        //         if(event.key=='1'){
        //             this.bodySystem.addFloatingPlastics(new THREE.Vector3(MyMath.random(-3,3),
        //                 MyMath.random(-3, 3), MyMath.random(-3, 3)))
        //         }
        //     })
    }


    update() {

        this.lifeMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.lifeMesh.rotation.set(this.angle.x, this.angle.y, this.angle.z);

        this.updateShaderMat();
        this.wrapParticles();
        this.updateMetabolism();
        this.userEat();

        this.add_MicroPlasticToBodySystem();

        this.bodySystem.update();
        this.bodySystem.setPosition(this.position);
        
        this.bodySystemWindow.update();
        this.bodySystemWindow.setPosition(this.position);
    }

    lifeGo(callback){
        if (this.age >= this.lifespan - 0.1 || this.energy < 0){
            this.die(callback);
        }
    }

    updateMetabolism(){
        
        if (this.lerpSize > this.size){
            this.size += 0.01;
            this.lifeMesh.scale.set(this.size + (this.shapeX * 0.01), 
                                    this.size + (this.shapeY * 0.01), 
                                    this.size);
            this.mass = this.size + this.noiseSize;
        } 
        else {
            if (this.clock.getElapsedTime() % this.metaTerm <= 0.05) { 
                this.growing();
                if (this.absorbMaxCount < 200) this.absorbMaxCount ++;
                
                // console.log("user grow" + this.size);
            }
        }
    }

    growing(){
        if (this.age <= this.growAge && this.lerpSize < this.sizeMax) { 
            const growValue = this.growValue;
            this.lerpSize += growValue;
            if (this.noiseSize < this.size * .3) {
                this.noiseSize += (growValue * .1);
                this.noiseShape += (growValue * .03);
            }
        }
    }

    stateMachine(otherLife) {
        this.findLife(otherLife);
    }

    findLife(otherLife){
        let distance = this.position.distanceTo(otherLife.position);
        this.sightRange = this.mass * 2;
        if (this.chaseTarget == null) {
            if (distance < this.sightRange && otherLife.index != this.index){
                this.chaseTarget = otherLife;
                // this.chaseTarget.lifeMesh.material.uniforms.glowColor.value = new THREE.Color(1,0,0);
                // console.log("user find life" + this.chaseTarget.index);
            }
        } 
        else {
            if (this.position.distanceTo(this.chaseTarget.position) > this.sightRange){
                // this.chaseTarget.lifeMesh.material.uniforms.glowColor.value = new THREE.Color(1,1,1);
                this.chaseTarget = null;
            }
        }

    }

    setEatPosition(){
        this.eatPosition = new THREE.Vector3(MyMath.random(0, this.size), MyMath.random(0, this.size), MyMath.random(0, this.size));
    }

    playEatMotion(){
        super.playEatMotion();
        if (this.chaseTarget != null){
            if (this.chaseTarget.isEaten == false && 
                this.position.distanceTo(this.chaseTarget.position) > this.size / 2){

                this.chaseTarget.isEaten = true;
                this.chaseTarget.playEatenMotion(new THREE.Vector3().copy(this.position).add(this.eatPosition), this.mass);
                
                // console.log(this.absorbedParticles.length)
                this.absorbedParticles.push(...this.chaseTarget.absorbedParticles);
                // console.log(this.absorbedParticles.length)

            }
        }
    }

    userEat(){
        if (this.chaseTarget != null && this.chaseTarget.isEaten == true){

            this.chaseTarget.position = new THREE.Vector3().copy(this.position).add(this.eatPosition);

            // if (this.chaseTarget.energy > 0){
            //     this.chaseTarget.energy -= this.digestionSpeed * 2;
            // } else {
            //     this.chaseTarget = null;
            // }

            if (this.chaseTarget.isDead == false){
                this.chaseTarget.energy = -1;
                // this.chaseTarget.die();

            } else {
                this.chaseTarget = null;
            }
        }
    }


    // ===============================================================================
    // ===============================================================================

    SetWindowSarira(microPlastic_Material, microPlastic_ConvexMaterial, miniSariraThree) {
        this.bodySystemWindow = new BodySystem(0, miniSariraThree, true);
        this.bodySystemWindow.createBuffer(microPlastic_Material);
        this.bodySystemWindow.createSarira(microPlastic_ConvexMaterial);
    }

    getSariraDataForServer() {
        //user
        let newPositionArray = [];
        // console.log(this.bodySystemWindow.sariraBuffer.bufferGeometry.attributes.position.array)
        let originalPositionArray = this.bodySystemWindow.sariraBuffer.bufferGeometry.attributes.position.array;

        // let d3Dataset = this.bodySystemWindow.sarira.getDataset()

        for (let i = 0; i <this.bodySystemWindow.sarira.getPlasticListLength()* 3; i+=3) {
 
            newPositionArray[i] = originalPositionArray[i]
            newPositionArray[i+1] = originalPositionArray[i+1]
            newPositionArray[i+2] = originalPositionArray[i+2]
        }

        let message = {
            vertices: newPositionArray,
            metaData: null
        }
        console.log(message);
        return message;
    }

    add_MicroPlasticToBodySystem() {
        //test for debugging
        // if(MyMath.random(0,100)>90){
        //     this.bodySystem.addFloatingPlastics(new THREE.Vector3(MyMath.random(-10, 10),
        //         MyMath.random(-10, 10), MyMath.random(-10, 10)))
        // }

        // if (this.isMakeSarira == true) console.log(this.absorbedParticles.length)

        if (this.isMakeSarira == true) {
            var send_pos = new THREE.Vector3().subVectors(this.sariraParticles[this.sariraParticles.length - 1].position, this.position);

            this.bodySystem.addFloatingPlastics(send_pos);
            this.bodySystemWindow.addFloatingPlastics(send_pos);

            this.sariraParticles[this.sariraParticles.length - 1].isActive = false;
            this.sariraParticles.splice(this.sariraParticles.length - 1, 1);

            this.isMakeSarira = false;
        }

        for (let j = 0; j < this.sariraParticles.length; j++) {
            this.sariraParticles[j].position = new THREE.Vector3().copy(this.position);
        }
    }

    // ===============================================================================
    // ===============================================================================

    setFoodChain() {
        let foodChainName = 'Final Consumer';

        return foodChainName;
    }

    setLifeType() {
        let type = 'Homo Sapiens';
        return type;
    }

    setName(name){
        this.lifeName = name;
    }
}

export {
    Life_user
}