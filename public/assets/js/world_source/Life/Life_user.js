import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    Life_Genetic
} from './Life_Genetic.js'
import {
    BodySystem
} from './../Sarira/BodySystem.js'

import {
    MyMath
} from '/assets/js/three/MyMath.js';

class Life_user extends Life_Genetic {
    constructor(options) {
        super(0, options, {
            photosynthesis: 0, // 광합성
            decomposer: 0, // 분해자(사체 분해)

            carnivore: 1, // 육식성
            herbivore: 1, // 초식성 , 둘 다 1일 경우 잡식성

            size: MyMath.random(.5, .6), // 크기
            shape: MyMath.random(0, 1), // 노이즈 모양

            growValue: MyMath.random(.4, .5), // 시간당 자라는 양
            growAge: MyMath.random(0, .2), // 성장이 멈추는 나이

            moveActivity: MyMath.random(.5, .6), // 1일 경우 활동적임 (움직임 많음 = 속도 빠름)
            // 노이즈 애니메이팅 효과에도 영향
            // 높을 수록 에너지 소모량 높음
            metabolismActivity: MyMath.random(.4, .5), // 대사 활동. 에너지 소모와 동시에 획득
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

        // this.SetWindowSarira();
        // this.SetWindowSarira(options.Sarira_Material, options.Sarira_ConvexMaterial);

        this.lifeName = 'user';
        this.lifespan = 500;
    }

    init() {
        if (this.geneCode == null) return;

        this.velLimit = 1;

        this.size = MyMath.random(1, 3);
        this.noiseSize = MyMath.random(0, this.size * 0.5);

        this.sizeMax = MyMath.map(this.geneCode.size, 0, 1, 1, 50);
        this.noiseSizeMax = MyMath.map(this.geneCode.shape, 0, 1, this.sizeMax, 50);

        this.growAge = MyMath.map(this.geneCode.growAge, 0, 1, 0, this.lifespan);
        this.growValue = MyMath.map((this.geneCode.growValue + this.geneCode.size) * .5,
            0, 1, 0.1, 5);

        this.noiseSpeed = MyMath.map((this.geneCode.moveActivity + this.geneCode.metabolismActivity) * 0.5,
            0, 1, 0.05, 0.15);

            document.addEventListener('keydown', (evenet)=>{
                if(event.key=='1'){
                              this.bodySystem.addFloatingPlastics(new THREE.Vector3(MyMath.random(-3,3),
                        MyMath.random(-3, 3), MyMath.random(-3, 3)))
                }
            })
        }


    update() {
        super.gravity();

        this.lifeMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.lifeMesh.rotation.set(this.angle.x, this.angle.y, this.angle.z);
        this.updateShaderMat();
        this.wrapParticles();

        this.add_MicroPlasticToBodySystem();
        this.sarira_position = new THREE.Vector3().copy(this.position);

        this.bodySystem.update();
        this.bodySystem.setPosition(this.sarira_position);
        // this.bodySystemWindow.update();
    }

    lifeGo() {
        //super.lifeGo(deadAlert);
        super.lifeGo();
    }

    stateMachine() {

    }

    shaderCalculate(camPos) {
        if (this.lifeMesh.material.uniforms.viewVector.value) {
            this.lifeMesh.material.uniforms.viewVector.value =
                new THREE.Vector3().subVectors(camPos, this.position);
        }
    }

    SetWindowSarira(microPlastic_Material, microPlastic_ConvexMaterial) {
        this.bodySystemWindow = new BodySystem(0, false);
        this.bodySystemWindow.createBuffer(microPlastic_Material);
        this.bodySystemWindow.createSarira(microPlastic_ConvexMaterial);
        this.bodySystemWindow.createTerminal();
    }

    getSariraDataForServer() {
        //user
        let newPositionArray = [];
        let indexLength = 0;
        let originalPositionArray = this.bodySystem.sariraBuffer.bufferGeometry.attributes.position.array;

        for (let i = 1; i < 300; i++) {
            if (originalPositionArray[i * 3] == 0 && originalPositionArray[(i * 3) + 1] == 0 && originalPositionArray[(i * 3) + 2] == 0) {
                indexLength = i;
                break;
            }
        }
        for (let i = 0; i < indexLength * 3; i++) {
            newPositionArray[i] = originalPositionArray[i]
        }

        let message = {
            vertices: newPositionArray,
            metaData: null
        }
        console.log(message);
        return message;
    }

    add_MicroPlasticToBodySystem() {
        //function map_range(value, low1, high1, low2, high2) {
        //    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        //}
        
        //test for debugging
        // if(MyMath.random(0,100)>90){
        //     this.bodySystem.addFloatingPlastics(new THREE.Vector3(MyMath.random(-10, 10),
        //         MyMath.random(-10, 10), MyMath.random(-10, 10)))
               
          
        // }

        var age = 0 + (100 - 0) * (this.age - 0) / (this.lifespan - 0);
        if (this.isMakeSarira == true) {
            var data = this.sariraParticlesData[this.sariraParticlesData.length - 1];
            var send_pos = new THREE.Vector3().subVectors(this.sariraParticles[this.sariraParticlesData.length - 1].position, this.position);

            // this.bodySystemWindow.addFloatingPlastics(send_pos, data);
            // this.bodySystem.addFloatingPlastics(send_pos, data);

            //temp code to check if sarira generation works 
     
            this.isMakeSarira = false;
        }

        for (let j = 0; j < this.sariraParticles.length; j++) {
            this.sariraParticles[j].position = new THREE.Vector3().copy(this.position);
        }
    }

    // ===============================================================================
    // ===============================================================================

    setFoodChain() {
        let foodChainName = 'final Consumer';

        return foodChainName;
    }

    setLifeType() {
        let type = 'Homo Sapiens';

        return type;
    }
}

export {
    Life_user
}