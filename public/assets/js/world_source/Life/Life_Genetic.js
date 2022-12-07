import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { Life_EatOther } from './Life_EatOther.js'

import {MyMath} from '/assets/js/utils/MyMath.js';
// import {createLifeNoiseMaterial} from '/assets/js/rendering/material.js';

class Life_Genetic extends Life_EatOther {
    constructor(index, options, geneCode, setPos){
        super(index, options.world, options.Sarira_Material,options.standardMaterial, setPos);
        //    super(index, options.world, options.Sarira_Material,options.Sarira_ConvexMaterial, setPos);
        this.options = options;

        this.geneCode = geneCode || {
            photosynthesis : Math.round(MyMath.random(0, 1)), // 광합성
            decomposer : Math.round(MyMath.random(0, 1)), // 분해자(사체 분해)

            carnivore : Math.round(MyMath.random(0, 1)), // 육식성
            herbivore : Math.round(MyMath.random(0, 1)), // 초식성 , 둘 다 1일 경우 잡식성

            size : MyMath.random(0, 1), // 크기
            shape : MyMath.random(0, 1), // 노이즈 모양

            shapeX: MyMath.random(0, 1), // 
            shapeY: MyMath.random(0, 1), // 

            growValue : MyMath.random(0, 1), // 시간당 자라는 양
            growAge : MyMath.random(0, 1), // 성장이 멈추는 나이
            
            moveActivity : MyMath.random(0, 1), // 1일 경우 활동적임 (움직임 많음 = 속도 빠름)
                                                // 노이즈 애니메이팅 효과에도 영향
                                                // 높을 수록 에너지 소모량 높음
            metabolismActivity : MyMath.random(0, 1), // 대사 활동. 에너지 소모와 동시에 획득
                                                      // 동물의 경우 소화 속도, 식물의 경우 광합성시 에너지 획득량
                                                      // 분열 속도에 영향
            lifespan : MyMath.random(0, 1),

            startNutrients : MyMath.random(0, 1), // 태어날 때 가지고 있는 양분

            divisionFreq : MyMath.random(0, 1), // 번식(분열) 빈도
            divisionEnergy : MyMath.random(0, 1), // 번식(분열)에 드는 에너지
            divisionAge : MyMath.random(0, 1),

            attack : MyMath.random(0, 1), // 공격력
            defense : MyMath.random(0, 1), // 방어력
        };

        this.init();
        this.initMetabolism();
        this.setMicroPlastic();

        this.mass = this.size + this.noiseSize;

        this.initWrap();

        this.setDisplay();

        this.initTestText();
    }

    // 초기 설정
    init(){
        if (this.geneCode == null) return;

        this.moveSpeed = MyMath.map(this.geneCode.moveActivity, 0, 1., 0.00001, 0.001);
        this.velLimitMax = MyMath.map(this.geneCode.moveActivity, 0, 1., 0, .01);
        this.velLimit = this.velLimitMax * .2;

        this.size = 1;
        this.noiseSize = MyMath.random(0, this.size * .5);

        this.shapeX = Math.floor(MyMath.map(this.geneCode.shapeX, 0, 1, 32, 32));
        this.shapeY = Math.floor(MyMath.map(this.geneCode.shapeY, 0, 1, 1, 32));

        this.noiseShape = MyMath.map(this.geneCode.shape, 0, 1, 1, 30);

        this.mass = this.size + this.noiseSize;

        this.sizeMax = MyMath.map(this.geneCode.size, 0, 1, 1, 30);
        
        this.noiseSpeed = MyMath.map((this.geneCode.moveActivity + this.geneCode.metabolismActivity) * 0.5, 
                                      0, 1, 0.05, 0.15);

        this.attack = MyMath.map(this.geneCode.attack, 0, 1, 2, 10);
    }

    initWrap(){
        if (this.geneCode == null) return;

        this.wrapCenter = new THREE.Vector3(0,0,0);
        this.wrapTar = this;
        this.wrapSize = this.worldSize - (this.mass * 0.5);
    }

    initMetabolism(){
        if (this.geneCode == null) return;

        this.isDead = false;

        this.age = 0;
        this.lifespan = MyMath.map(this.geneCode.lifespan, 0, 1, 10, 100);

        this.eatCount = 0;
        this.digestionSpeed = MyMath.map(this.geneCode.metabolismActivity, 0, 1, 1., 5.);

        this.isGetEnergy == false;

        this.energy = MyMath.map(this.geneCode.startNutrients, 0, 1, 1, 100);
        this.moveEnergy = MyMath.map(this.geneCode.moveActivity, 0, 1, 0., 0.001);
        this.metaEnergyUse = MyMath.map(this.geneCode.metabolismActivity, 0, 1, 0., 0.001);

        this.metaEnergyGet = MyMath.map(this.geneCode.metabolismActivity, 0, 1, 0.1, 0.5);

        this.metaTerm = Math.floor(MyMath.map(this.geneCode.metabolismActivity, 0, 1, 50, 1));

        this.growAge = MyMath.map(this.geneCode.growAge, 0, 1, this.lifespan * 0.1, this.lifespan * .6);
        this.growValue = MyMath.map((this.geneCode.growValue + this.geneCode.size) * .5, 
                                     0, 1, 0.001, 0.5);
        this.noiseGrowValue = MyMath.map(this.geneCode.shape, 0, 1, -this.growValue * .5, this.growValue * .5);

        this.isReadyToDivision = false;
        
        this.division_energy = MyMath.map(this.geneCode.divisionEnergy, 0, 1, this.energy * 0.1, this.energy * 0.4);
        this.division_age = MyMath.map(this.geneCode.divisionAge, 0, 1, 0.1, this.lifespan * 0.2);
        this.division_term = MyMath.map(this.geneCode.divisionFreq, 0, 1, this.lifespan * 0.1, this.lifespan * 0.3);
        this.division_after = this.division_term * 0.1;
    }

    setMicroPlastic(){
        if (this.geneCode == null) return;

        super.setMicroPlastic();
    }

    // ===============================================================================
    // ===============================================================================

    setDisplay() {
        if (this.geneCode == null) return;

        super.setDisplay();
    }

    // ===============================================================================
    // ===============================================================================

    updateMetabolism(){
        if (this.clock.getElapsedTime() % this.metaTerm <= 0.05) { 
            this.growing();
            this.energy -= this.metaEnergyUse;
            
            if (this.geneCode.photosynthesis == 1) this.getEnergy(this.metaEnergyGet);
        }
    }

    getEnergy(energy){
        if (this.isGetEnergy == true){
            this.energy += energy;
        }
    }

    growing(){
        if (this.age <= this.growAge && this.size < this.sizeMax) { 
            this.size += this.growValue;
            this.lifeMesh.scale.set(this.size + (this.shapeX * 0.01), 
                                    this.size + (this.shapeY * 0.01), 
                                    this.size);
            if (this.noiseSize < this.size*.8) this.noiseSize += MyMath.random(0, this.noiseGrowValue * .5);

            this.mass = this.size + this.noiseSize;

            // console.log(`Life ${this.index} is Growing (${this.size})`);
        }
        // 자라면서 속력이 빨라짐
        if (this.velLimit < this.velLimitMax) {
            this.velLimit += 0.001;
        }
    }

    // ===============================================================================
    // ===============================================================================

    update(){
        super.update();
        this.updateMetabolism();
    }

    applyForce(force){
        super.applyForce(force);

        this.energy -= this.moveEnergy;
    }

    randomWalk() {
        this.applyForce(new THREE.Vector3(
            MyMath.random(-this.moveSpeed, this.moveSpeed),
            MyMath.random(-this.moveSpeed, this.moveSpeed),
            MyMath.random(-this.moveSpeed, this.moveSpeed)
        ));
        //console.log("life_" + this.index + " randomWalk");
    }

    lifeGo(callback){
        if (this.age < this.lifespan && this.clock.getElapsedTime() % this.metaTerm <= 0.1) {
            this.age += 0.5;
            if (this.age > this.lifespan * 0.7) this.velLimit -= 0.01;
        }

        if (this.division_after > 0) this.division_after -= 0.01;

        // if (this.clock.getElapsedTime() % this.division_term <= 0.01)
        //     console.log(`life ${this.index} 
        //     division timer = ${this.division_after} 
        //     age = ${this.age} (${this.division_age})
        //     energy = ${this.energy} (${this.division_energy})
        //     `)

        if (this.clock.getElapsedTime() % this.division_term <= 0.01 && 
            this.division_after < 0 &&
            this.age >= this.division_age && 
            this.energy > this.division_energy && 
            this.isReadyToDivision == false) {

                this.isReadyToDivision = true;
            }

        if (this.age >= this.lifespan - 0.1 || this.energy < 0){
            this.die(callback);
        }
    }

    stateMachine(otherLife){
        if (this.geneCode.photosynthesis != 1){
            super.stateMachine(otherLife);
        }
        else {
            this.randomWalk();
        }
    }

    division(lifes, lifeSystem){
        if (this.isReadyToDivision == true){
            if (this.velocity.length() >= 0.001) this.velocity.multiplyScalar(0.01);

            this.energy -= this.division_energy;
            
            let child = new Life_Genetic(lifeSystem.lifeNum, this.options, this.createGeneCode(), 
                                         new THREE.Vector3().copy(this.position));
            
            if (child == null) return;

            lifeSystem.lifeNum ++;
            lifes.push(child);

            console.log(`life${this.index} create child${lifeSystem.lifeNum} (size:${child.lifeMesh.scale.x})`)

            this.isReadyToDivision = false;
            this.division_after = this.division_term;

            // console.log("create life_" + child.index);
            // console.log(child.position)
        }
    }

    // ===============================================================================
    // ===============================================================================

    createGeneCode(){
        let geneCode;

        const diverseValue = MyMath.random(-.1, .1); // 약간의 변화
            geneCode = {
                photosynthesis : Math.round(this.geneCode.photosynthesis + diverseValue), // 광합성
                decomposer : Math.round(this.geneCode.decomposer + diverseValue), // 분해자(사체 분해)
    
                carnivore : Math.round(this.geneCode.carnivore + diverseValue), // 육식성
                herbivore : Math.round(this.geneCode.herbivore + diverseValue), // 초식성 , 둘 다 1일 경우 잡식성
    
                size : this.geneCode.size + diverseValue, // 크기
                shape : this.geneCode.shape + diverseValue, // 노이즈 모양
                shapeX: this.geneCode.shapeX + diverseValue, // 
                shapeY: this.geneCode.shapeY + diverseValue, // 
    
                growValue : this.geneCode.growValue + diverseValue, // 시간당 자라는 양
                growAge : this.geneCode.growAge + diverseValue, // 성장이 멈추는 나이
                
                moveActivity : this.geneCode.moveActivity + diverseValue, // 1일 경우 활동적임 (움직임 많음 = 속도 빠름)
                                                                  // 노이즈 애니메이팅 효과에도 영향
                                                                  // 높을 수록 에너지 소모량 높음
                metabolismActivity : this.geneCode.metabolismActivity + diverseValue, // 대사 활동. 에너지 소모와 동시에 획득
                                                                        // 동물의 경우 소화 속도, 식물의 경우 광합성시 에너지 획득량
                                                                        // 분열 속도에 영향
                lifespan : this.geneCode.lifespan + diverseValue,
    
                startNutrients : this.geneCode.startNutrients + diverseValue, // 태어날 때 가지고 있는 양분
    
                divisionFreq : this.geneCode.divisionFreq + diverseValue, // 번식(분열) 빈도
                divisionEnergy : this.geneCode.divisionEnergy + diverseValue, // 번식(분열)에 드는 에너지
                divisionAge : this.geneCode.divisionAge + diverseValue,
    
                attack : this.geneCode.attack + diverseValue, // 공격력
                defense : this.geneCode.defense + diverseValue, // 방어력
            };

        const mutation = MyMath.random(0, 100);

        if (mutation < 0.1){ // 돌연변이
            const mutationPart = Math.floor(MyMath.random(0, 19)); // 돌연변이가 일어날 부분
            switch (mutationPart) {
                case 0:
                    geneCode.photosynthesis = Math.round(MyMath.random(0, 1)); // 광합성
                    break;
                case 1:
                    geneCode.decomposer = Math.round(MyMath.random(0, 1)); // 분해자(사체 분해)
                    break;
                case 2:
                    geneCode.carnivore = Math.round(MyMath.random(0, 1)); // 육식성
                    break;
                case 3:
                    geneCode.herbivore = Math.round(MyMath.random(0, 1)); // 초식성 , 둘 다 1일 경우 잡식성
                    break;
                case 4:
                    geneCode.size = MyMath.random(0, 1); // 크기
                    break;
                case 5:
                    geneCode.shape = MyMath.random(0, 1); // 노이즈 모양
                    break;
                case 6:
                    geneCode.growValue = MyMath.random(0, 1); // 시간당 자라는 양
                    break;
                case 7:
                    geneCode.growAge = MyMath.random(0, 1); // 성장이 멈추는 나이
                    break;
                case 8:
                    geneCode.moveActivity = MyMath.random(0, 1); // 1일 경우 활동적임 (움직임 많음 = 속도 빠름)
                    break;
                case 9:
                    geneCode.metabolismActivity = MyMath.random(0, 1); // 대사 활동. 에너지 소모와 동시에 획득
                    break;
                case 10:
                    geneCode.lifespan = MyMath.random(0, 1);
                    break;
                case 11:
                    geneCode.startNutrients = MyMath.random(0, 1); // 태어날 때 가지고 있는 양분
                    break;
                case 12:
                    geneCode.divisionFreq = MyMath.random(0, 1); // 번식(분열) 빈도
                    break;
                case 13:
                    geneCode.divisionEnergy = MyMath.random(0, 1); // 번식(분열)에 드는 에너지
                    break;
                case 14:
                    geneCode.divisionAge = MyMath.random(0, 1);
                    break;
                case 15:
                    geneCode.attack = MyMath.random(0, 1); // 공격력
                    break;
                case 16:
                    geneCode.defense = MyMath.random(0, 1); // 방어력
                    break;
                case 17:
                    geneCode.shapeX = MyMath.random(0, 1); // 공격력
                    break;
                case 18:
                    geneCode.shapeY = MyMath.random(0, 1); // 방어력
                        break;
                default:
                    break;
            }
        }

        return geneCode;
    }

    setFoodChain(){
        let foodChainName = "Life";
        if (this.geneCode.photosynthesis == 1) {
            foodChainName = 'Producer';
        } 
        else if (this.geneCode.decomposer == 1) {
            foodChainName = 'Decomposer';
        }
        else if (this.geneCode.carnivore == 0 && this.geneCode.herbivore == 1){
            this.foodChainName = 'Primary Consumer';
        }
        else{
            if (this.eatCount > 0){
                foodChainName = 'Secondary Consumer';
            } 
            if (this.eatCount > 10 && this.isEaten == true) {
                foodChainName = 'Tertiary Consumer';
            }
            if (this.eatCount > 20 && this.isEaten == false) {
                foodChainName = 'final Consumer';
            }
        }

        return foodChainName;
    }

    setLifeType(){
        let type = "microbe";
        if (this.geneCode.size <= 0.1){
            if (this.geneCode.photosynthesis == 1){
                type = 'Algae'; // 조류
            } 
            else{
                type = 'Bacteria'; // 박테리아
            }
        }
        else {
            if (this.geneCode.photosynthesis == 1){
                type = 'Plant'; // 식물계
            } 
            else if (this.geneCode.decomposer == 1) {
                type = 'Fungi'; // 균계
            }
            else if (this.geneCode.herbivore == 1 && this.geneCode.carnivore == 0){
                type = 'Herbivores'; // 초식동물
            } 
            else if (this.geneCode.herbivore == 1 && this.geneCode.carnivore == 1){
                type = 'Omnivore'; // 잡식동물
            }
            else if (this.geneCode.herbivore == 1 && this.geneCode.carnivore == 1){
                type = 'Carnivore'; // 육식동물
            }
        } 

        return type;
    }

    setD3jsData(){
        let subLifeName = this.setLifeType();
        // user일 경우 종 뒤에 이름 추가 ex) 호모사피엔스/김아무개
        if (this.index == 0) subLifeName = `${this.setLifeType()}/${this.lifeName}`;

        const data = [
            this.setFoodChain(), // "category"
            subLifeName, // "subcategory"
            `#${this.index}` // "uniqueID"
        ];
        return data;
    }

    // ===============================================================================
    // ===============================================================================

    initTestText(){
        if (this.geneCode == null) return;

        super.initTestText();
    }
}

export {Life_Genetic}