import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import BasicThree from '../three/basicThree.js';

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
} from '/assets/js/three/MyMath.js';
import {
    createParticleMaterial,
    createPointMaterial,
    createConvexMaterial
} from './../three/material.js';

import {
    WorldThree
} from '../three/SpecificThree.js';
//세계
class WorldSystem {
    constructor(_pagelayer) {
        this.pagelayer = _pagelayer
        this.worldThree = new WorldThree(this.pagelayer.singleRenderer, 'world', false);

        this.worldSize = 300;
        this.maxParticleCount = 10000;
        //흐름(속력+방향)
        this.velMin = 0.001;
        this.enterDom = undefined

        this.pointsMaterial=createPointMaterial()
        this.convexMaterial=createConvexMaterial();
        
    }

    //해당 페이지 재접속시 다시 실행
    setup(worldDom, enterDom) {


        this.worldThree.setup(worldDom)
        this.worldThree.setCameraPosition(0, 0, 40)
        this.worldThree.updateSize()
        this.enterDom = enterDom



        //파티클, 라이프 초기화
        this.createParticle();

        this.createLife();

        // 파티클, 라이프 그리기
        this.drawParticles();

        //   플라스틱 넣기        
          this.createPlastic();


    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if (this.isValid()) {

            this.worldThree.update()

            if (this.fileLoaded == true) {
                this.addPlastic();
            }

            this.updateParticles();
            this.updateLifes();

            //
            this.worldThree.render()
        }
    }


    isValid() {
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

    createParticle() {
        //생성
        this.particles = [];
        this.particlePositions = [];

        for (let i = 0; i < this.maxParticleCount; i++) {
            let p = new MicroPlastic_D3js(i, this.worldSize);

            // 랜덤 위치 파티클 생성
            if (i < this.maxParticleCount * 0.1) {
                p.setPos();
                p.isActive = true;
            }

            this.particles.push(p);
            this.particlePositions.push(p.position);
        }
    }

    drawParticles() {
        // let geometry = new THREE.BufferGeometry();
        let geometry = new THREE.BufferGeometry().setFromPoints(this.particlePositions);
        let material = createParticleMaterial(0.7);

        // geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( this.maxParticleCount * 3 ), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.maxParticleCount * 3), 3));
        geometry.setDrawRange(0, this.maxParticleCount);

        this.particleAppearence = new THREE.Points(geometry, material);
        this.particleAppearence.position.set(0, 0, 0);
        //console.log(this.particleAppearence.geometry);

        // 카메라에 일부 mesh 안잡히는 문제 https://discourse.threejs.org/t/zooming-in-camera-make-some-meshes-not-visible/3872/6
        this.particleAppearence.traverse(function (object) {
            object.frustumCulled = false;
        });

        this.particlePositionAttributes = this.particleAppearence.geometry.getAttribute('position').array;
        this.particleColorAttributes = this.particleAppearence.geometry.getAttribute('color').array;

        this.worldThree.addToGroup(this.particleAppearence);
    }

    createLife() {
        //생물 개체수 시작값
        const minNum = Math.floor(this.worldSize * 0.1);

        //생물 개체수 최댓값
        this.maxNum = Math.floor(this.worldSize * 0.3);

        this.lifeNum = 1 + minNum;

        let options = {
            world: this.worldThree,
            Sarira_Material: this.pointsMaterial,
            Sarira_ConvexMaterial: this.convexMaterial
        }
        //console.log(options);

        this.lifes = [];
        this.life_user = new Life_user(options);
        this.lifes.push(this.life_user);

        for (let i = 1; i < this.lifeNum; i++) {
            this.lifes.push(new Life_Genetic(i, options));
        }
    }

    createPlastic() {
        this.fileList = [];
        this.fileList.push('assets/3dmodel/plasticTest.json');

        this.fileData;

        this.fileIndex = 0;
        this.fileLoaded = false;

        // ==========================

        this.plasticData;
        this.canAddPlastic = false;

        // 폐 플라스틱 위치, 기울기 (world 랜덤한 곳에 랜덤한 각도로 배치될 수 있도록)
        // 각각의 파티클들의 위치를 지정하는 것이기 때문에 한번에 위치, 각도 지정을 할 수 없어 값을 미리 생성해놓은 후 곱하는 식
        this.plasticOffsetPosition = new THREE.Vector3(
            MyMath.random(-this.worldSize * 0.4, this.worldSize * 0.4),
            MyMath.random(-this.worldSize * 0.4, this.worldSize * 0.4),
            MyMath.random(0, this.worldSize * 0.4));

        this.plasticRotation = new THREE.Vector3(
            Math.PI * MyMath.random(0, 2),
            Math.PI * MyMath.random(0, 2),
            Math.PI * MyMath.random(0, 2));

        this.plasticScale = 3;

        // 파티클 정보 배열
        this.plasticPositions = [];
        this.plasticColors = [];
        this.activableParticles = [];

        this.loadFile();
    }

    loadFile() {
        readTextFile(
            this.fileList[this.fileIndex],

            function (text) {
                this.fileData = JSON.parse(text);
                console.log(this.fileData);
                console.log("file loaded");

                // 임시
                this.plasticData = {
                    type: 'polyethylene',
                    area: 'Bangameori'
                };

                var positions = new Float32Array(this.fileData.count);
                var colors = new Float32Array(this.fileData.count);

                for (let i = 0; i < positions.length; i += 3) {
                    let newPos = new THREE.Vector3(
                        this.fileData.position[i + 0],
                        this.fileData.position[i + 1],
                        this.fileData.position[i + 2]);
                    //console.log(newPos);

                    newPos.multiplyScalar(this.plasticScale);

                    let quaternion = new THREE.Quaternion();
                    quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), this.plasticRotation.z);
                    newPos.applyQuaternion(quaternion);

                    newPos.add(this.plasticOffsetPosition);
                    //console.log(newPos);

                    this.plasticPositions.push(newPos);
                }
                for (let i = 0; i < colors.length; i += 3) {
                    this.plasticColors.push(
                        new THREE.Color(
                            this.fileData.color[i + 0],
                            this.fileData.color[i + 1],
                            this.fileData.color[i + 2]));
                }

                this.fileLoaded = true;
                if (this.fileIndex < this.fileList.length) this.fileIndex++;
            },

            this
        );
    }

    addPlastic() {
        // 1. 파일 로드
        // 2. 생성할 플라스틱 파티클 갯수 확인
        // 3. isActive == false 인 파티클 갯수 확인
        // 4. 2, 3번 비교하여 2번 < 3번 이면 isActive == false인 파티클에만 위치, 색상 적용

        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].isActive == false) {
                this.activableParticles.push(this.particles[i]);
            }
        }

        if (this.activableParticles.length >= this.plasticPositions.length &&
            this.activableParticles.length > 0 && this.plasticPositions.length > 0) {

            this.canAddPlastic = true;
            console.log("activable Particle = " + this.activableParticles.length);
            console.log("plastic Particle = " + this.plasticPositions.length);
            console.log("add plastic");
        }

        if (this.canAddPlastic == true) {
            for (let i = 0; i < this.plasticPositions.length; i++) {
                this.activableParticles[i].isActive = true;
                this.activableParticles[i].setPos(this.plasticPositions[i]);
                this.activableParticles[i].setColor(this.plasticColors[i]);
                this.activableParticles[i].setD3PlasticData(this.plasticData.type, this.plasticData.area, i);
            }

            this.plasticPositions = [];
            this.plasticColors = [];
            this.activableParticles = [];
            this.canAddPlastic = false;

            this.fileLoaded = false;
        }
    }

    //=====================================================================================
    //=====================================================================================


    updateParticles() {
        for (let i = 0; i < this.particlePositionAttributes.length; i += 3) {
            const index = i / 3;

            this.particlePositionAttributes[i + 0] = this.particles[index].position.x;
            this.particlePositionAttributes[i + 1] = this.particles[index].position.y;
            this.particlePositionAttributes[i + 2] = this.particles[index].position.z;

            if (this.particles[index].isActive == false) {
                this.particles[index].setPos(new THREE.Vector3(0, this.worldSize - 1, 0));
                continue;
            }

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
        this.particleAppearence.geometry.attributes.position.needsUpdate = true;

        for (let i = 0; i < this.particleColorAttributes.length; i += 3) {
            const index = i / 3;

            this.particleColorAttributes[i + 0] = this.particles[index].color.r;
            this.particleColorAttributes[i + 1] = this.particles[index].color.g;
            this.particleColorAttributes[i + 2] = this.particles[index].color.b;

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

            if (this.lifes.length < this.maxNum && this.lifes[i].index != 0) {
                this.lifes[i].division(this.lifes, this);
            }

            this.lifes[i].update();
            this.lifes[i].updateTestText(); // 디버깅용

            for (let j = 0; j < this.lifes.length; j++) {
                this.lifes[i].stateMachine(this.lifes[j]);
                this.lifes[i].pushOtherLife(this.lifes[j]);
            }
        }
    }
}

// json 읽는 메소드
// https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
function readTextFile(file, callback, thisObj) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            // .call 붙인 이유 - class에서 사용하는 this.를 콜백에선 다른 것으로 인식. 
            // 때문에 this가 나타내는 객체를 지정해줌.
            // class에서 사용하지 않을 경우 null
            callback.call(thisObj, rawFile.responseText);
        }
    }
    rawFile.send(null);
}

export {
    WorldSystem
}