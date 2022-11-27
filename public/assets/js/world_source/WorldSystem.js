import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    MicroPlastic_D3js
} from './../world_source/Particle/ParticleClass.js';
import {
    Life_Genetic
} from './../world_source/Life/Life_Genetic.js';
import {
    Life_user
} from './../world_source/Life/Life_user.js';
import {
    MyMath
} from '/assets/js/utils/MyMath.js';
import {
    createParticleMaterial,
    createPointMaterial,
    createConvexMaterial,
    createStandardMaterial,
} from '../rendering/material.js';

import {
    WorldThree
} from '../rendering/SpecificThree.js';
import config from '../utils/config.js';
import Waste_plastic_dataset from '../utils/waste_plastic_dataset.js';

//세계
class WorldSystem {
    constructor(_pagelayer) {
        this.pagelayer = _pagelayer
        this.worldThree = new WorldThree(this.pagelayer.singleRenderer, 'world', false);

        this.worldSize = config.worldSize
        this.maxParticleCount = config.maxParticleCount
        this.initialWastePlasticCount = config.initialMaxPlasticCount
        this.plasticScale = config.plasticScale
        this.offsetRange = config.plasticOffsetRange

        //흐름(속력+방향)
        this.velMin = config.velMin
        this.enterDom = undefined

        this.pointsMaterial = createPointMaterial()
        this.convexMaterial = createConvexMaterial();
        this.standardMaterial=createStandardMaterial()

        this.initialCameraPosition = config.worldCameraPositon
        this.particleAppearence = undefined
    }

    //해당 페이지 재접속시 다시 실행
    setup(worldDom, enterDom,miniSariraThree ) {

        //활성화된 파티클 개수 초과로 인해 세상에 들어가지 않은 오브젝트들은 이 배열에 들어간다
        //이후 이 배열에 들어있는 오브젝트들을 checkWorldForInput()의 인자로 넘기면 된다. 
        this.rejectedObject = []

        this.worldThree.setup(worldDom)
        this.worldThree.setCameraPosition(...this.initialCameraPosition)
        this.worldThree.updateSize()
        this.enterDom = enterDom

        //파티클, 라이프 초기화
        this.createParticle();
        this.createLife(miniSariraThree);
    }

    importPLY(addToslider,reorganize){
        let randomSource = Waste_plastic_dataset.getRandomBatchPLY(this.initialWastePlasticCount)
        for (let i = 0; i < this.initialWastePlasticCount; i++) {
            this.worldThree.import(randomSource[i], this.createPlastic, addToslider,reorganize)
        }
    }

    animate = () => {
        if (this.particleAppearence != undefined) {
            this.worldThree.render()
            this.worldThree.update()

            this.updateParticles();

        }
        if (this.valid()) {
            // this.worldThree.render()
            // this.worldThree.update()
            // this.updateParticles();
        
            this.updateLifes();
        }
    }

    valid() {
        //if user has clicked the enter button 
        if (this.enterDom != undefined) {
            if (this.enterDom.classList.contains('m-inactive')) {
                return false
            } else {
                return true
            }
        }
    }

    //=====================================================================================
    //=====================================================================================

    createLife(miniSariraThree) {
        //생물 개체수 시작값
        const minNum = Math.floor(this.worldSize * 0.1);

        //생물 개체수 최댓값
        this.maxNum = Math.floor(this.worldSize * 0.3);

        this.lifeNum = 1 + minNum;

        let options = {
            world: this.worldThree,
            miniSariraThree: miniSariraThree,
            Sarira_Material: this.pointsMaterial,
            Sarira_ConvexMaterial: this.convexMaterial,
            standardMaterial:this.standardMaterial
        }
        //console.log(options);

        this.lifes = [];
        this.life_user = new Life_user(options);
        this.lifes.push(this.life_user);

        for (let i = 1; i < this.lifeNum; i++) {
            this.lifes.push(new Life_Genetic(i, options));
        }
    }


    createParticle() {
        //생성
        this.particles = [];
        let particlePositions = [];
        let material = createParticleMaterial();

        for (let i = 0; i < this.maxParticleCount; i++) {
            let p = new MicroPlastic_D3js(i, this.worldSize);
            // 랜덤 위치 파티클 생성
            // if (i < this.maxParticleCount * 0.1) {
            //     p.setPos();
            //     p.isActive = true;
            // }

            this.particles.push(p);
            particlePositions.push(p.position);
        }

        let geometry = new THREE.BufferGeometry().setFromPoints(particlePositions);
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.maxParticleCount * 3), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.maxParticleCount * 3), 3));
        geometry.setDrawRange(0, this.maxParticleCount);

        this.particleAppearence = new THREE.Points(geometry, material);
        this.particleAppearence.frustumCulled = false
        this.particleAppearence.position.set(0, 0, 0);
        // 카메라에 일부 mesh 안잡히는 문제 https://discourse.threejs.org/t/zooming-in-camera-make-some-meshes-not-visible/3872/6
        this.particleAppearence.traverse(function (object) {
            object.frustumCulled = false;
        });
        this.worldThree.addToGroup(this.particleAppearence);
    }

    createPlastic = (beach, index, bufferGeometry) => {

        let finalPositions = [];
        let finalColors = [];

        let plasticOffsetPosition = new THREE.Vector3(
            MyMath.random(-this.worldSize * this.offsetRange, this.worldSize * this.offsetRange),
            MyMath.random(-this.worldSize * this.offsetRange, this.worldSize * this.offsetRange),
            MyMath.random(-this.worldSize * this.offsetRange, this.worldSize * this.offsetRange));

        let plasticRotation = new THREE.Vector3(
            Math.PI * MyMath.random(0, 2),
            Math.PI * MyMath.random(0, 2),
            Math.PI * MyMath.random(0, 2));

        let positions = new Float32Array(bufferGeometry.attributes.position.count);
        for (let i = 0; i < positions.length * 3; i += 3) {
            let newPos = new THREE.Vector3(
                bufferGeometry.attributes.position.array[i + 0],
                bufferGeometry.attributes.position.array[i + 1],
                bufferGeometry.attributes.position.array[i + 2]);

            newPos.multiplyScalar(this.plasticScale);

            let quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), plasticRotation.z);
            newPos.applyQuaternion(quaternion);
            newPos.add(plasticOffsetPosition);

            finalPositions.push(newPos);
        }

        let colors = new Float32Array(bufferGeometry.attributes.color.count);
        for (let i = 0; i < colors.length * 3; i += 3) {
            finalColors.push(
                new THREE.Color(
                    bufferGeometry.attributes.color.array[i + 0],
                    bufferGeometry.attributes.color.array[i + 1],
                    bufferGeometry.attributes.color.array[i + 2]));
        }
        let object = {
            positions: finalPositions,
            colors: finalColors,
            beach: beach,
            index: index,
        }

        return this.checkWorldForInput(object)
    }

    checkWorldForInput(object) {
        let activableParticles = []

        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].isActive == false) {
                activableParticles.push(this.particles[i]);
            }
        }

        if (activableParticles.length >= object.positions.length &&
            activableParticles.length > 0 && object.positions.length > 0) {

            for (let i = 0; i < object.positions.length; i++) {
                activableParticles[i].isActive = true;
                activableParticles[i].setPos(object.positions[i]);
                activableParticles[i].setColor(object.colors[i]);
                activableParticles[i].setD3PlasticData({type:"Waste Plastic", type:object.beach, area:object.index});
            }
            return true
      
        } else {
            this.rejectedObject.push(object)
        }

    }

    //=====================================================================================
    //=====================================================================================


    updateParticles() {

        let particlePositionAttributes = this.particleAppearence.geometry.getAttribute('position').array;
        let particleColorAttributes = this.particleAppearence.geometry.getAttribute('color').array;

        for (let i = 0; i < particlePositionAttributes.length; i += 3) {
            const index = i / 3;

            particlePositionAttributes[i + 0] = this.particles[index].position.x;
            particlePositionAttributes[i + 1] = this.particles[index].position.y;
            particlePositionAttributes[i + 2] = this.particles[index].position.z;


            if (this.particles[index].isActive == false) {
                this.particles[index].setPos(new THREE.Vector3(0, this.worldSize - 1, 0));
                continue;
            }
            if (this.valid()) {

            let flow = new THREE.Vector3(
                MyMath.random(-this.velMin, this.velMin),
                MyMath.random(-this.velMin, this.velMin),
                MyMath.random(-this.velMin, this.velMin));

            this.particles[index].applyForce(flow);
            this.particles[index].wrap();

            this.lifes.forEach(life => {
                life.breath(this.particles[index]);
                if (life.energy < life.hungryValue) life.eat(this.particles[index]);
            });

            this.life_user.eat(this.particles[index]);
            this.life_user.breath(this.particles[index]);
        }
        }
        this.particleAppearence.geometry.attributes.position.needsUpdate = true;


        for (let i = 0; i < particleColorAttributes.length; i += 3) {
            const index = i / 3;

            particleColorAttributes[i + 0] = this.particles[index].color.r;
            particleColorAttributes[i + 1] = this.particles[index].color.g;
            particleColorAttributes[i + 2] = this.particles[index].color.b;


            if (this.particles[index].isActive == false) {
                this.particles[index].setColor(new THREE.Color(0, 0, 0));
                continue;
            }

            //파티클이 사리가 됐으면 색을 검정색으로 바꿈 (안보이게)

        }
        this.particleAppearence.geometry.attributes.color.needsUpdate = true;

        //console.log(this.particleAppearence.geometry);
    }

    updateLifes() {
        for (let i = 0; i < this.lifes.length; i++) {

            this.lifes[i].lifeGo();

            if (this.lifes[i].isDead == true) {
                this.lifes.splice(i, 1);
                continue;
            }

            // if (this.lifes.length < this.maxNum && this.lifes[i].index != 0) {
            //     this.lifes[i].division(this.lifes, this);
            // }

            this.lifes[i].update();
            this.lifes[i].updateTestText(); // 디버깅용

            for (let j = 0; j < this.lifes.length; j++) {
                this.lifes[i].stateMachine(this.lifes[j]);
                this.lifes[i].pushOtherLife(this.lifes[j]);
            }
        }
    }
    getSariraData() {
        return this.life_user.getSariraDataForServer()
    }
}

export {
    WorldSystem
}