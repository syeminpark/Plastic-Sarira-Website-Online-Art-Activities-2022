import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import {MyMath} from '/assets/js/three/MyMath.js';
import {createLifeNoiseMaterial} from '/assets/js/three/material.js';

class Life {
    constructor(index, world, setPos) {
        this.index = index;
        this.worldThree = world;
        this.worldSize = world.worldSize || 300;
                
        this.init();

        this.mass = this.size + this.noiseSize;

        const spaceLimited = this.worldSize - 50.;

        if (setPos != null) this.position = new THREE.Vector3(setPos.x, setPos.y, setPos.z);
        else this.position = new THREE.Vector3(
            MyMath.random(-spaceLimited, spaceLimited),
            MyMath.random(-spaceLimited, spaceLimited),
            MyMath.random(-spaceLimited, spaceLimited));        

        if (this.position.length() > spaceLimited) this.position.setLength(spaceLimited);

        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);

        this.angle = new THREE.Vector3(
            MyMath.random(0, Math.PI * 2),
            MyMath.random(0, Math.PI * 2),
            MyMath.random(0, Math.PI * 2));
        this.angleVelocity = new THREE.Vector3().copy(this.velocity);
        this.angleAcceleration = new THREE.Vector3().copy(this.acceleration);

        this.clock = new THREE.Clock();
        this.setDisplay();

        this.initWrap();
        this.initMetabolism();
        
        this.setTestText("");
        this.initTestText();
    }

    // ===============================================================================
    // ===============================================================================

    init(){ //상속할 때 다형화 용
        this.size = MyMath.random(5, 20);
        this.noiseSize = MyMath.random(5., 20.);
        this.noiseSpeed = MyMath.random(0.05, 0.15);

        this.moveTerm = this.mass * 500;

        this.lifeName = 'life' + String(this.index);
        
        this.velLimit = 0.1;
    }

    initWrap(){
        this.wrapCenter = new THREE.Vector3(0,0,0);
        this.wrapTar = this;
        this.wrapSize = this.worldSize - (this.mass * 0.5);
    }

    initMetabolism(){
        this.isDead = false;
        this.age = 0;
        this.lifespan = (this.size + this.noiseSize) * 10;

        this.isReadyToDivision = false;

        this.energy = MyMath.random(this.size/2, this.size*3);
        
        this.division_energy = this.size;
        this.division_age = this.lifespan/3;
        this.division_term = this.size*5;
    }

    // ===============================================================================
    // ===============================================================================

    setDisplay() {
        const noiseCount = MyMath.random(1., 100.);
        
        let geometry = new THREE.SphereGeometry(this.size, 32, 32);
        let material = createLifeNoiseMaterial(this.worldThree.camera, noiseCount, this.noiseSize);
        // let material = new THREE.MeshDepthMaterial({
        //     transparent: true,
        //     opacity: 0.5,
        // });
        material.transparent = true;

        this.lifeMesh = new THREE.Mesh(geometry, material);
        this.lifeMesh.position.set(this.position.x, this.position.y, this.position.z);

        this.worldThree.addToGroup(this.lifeMesh);
    }

    updateShaderMat(){
        this.updateGlow_3D();
        this.updateNoiseShader();
    }

    updateGlow_3D(){
        this.lifeMesh.material.uniforms.viewVector.value = 
			new THREE.Vector3().subVectors( this.worldThree.camera.position, this.position );
    }

    updateNoiseShader(){
        this.lifeMesh.material.uniforms.time.value = this.noiseSpeed * this.clock.getElapsedTime();
    }

    // ===============================================================================
    // ===============================================================================

    update() {
        ///this.randomWalk();

        this.updateShaderMat();
        this.wrapLife();
    }

    lifeGo(callback){
        if (this.age < this.lifespan) {
            this.age += 0.1;
            this.energy -= 0.001;
            if (this.division_term > 0) this.division_term -= 0.05;
        }

        if (this.age >= this.division_age && this.energy > this.division_energy && 
            this.division_term <= 0 && this.isReadyToDivision == false) this.isReadyToDivision = true;

        if (this.age > this.lifespan * 0.7) this.velLimit = this.mass * 0.5;

        if (this.age >= this.lifespan - 0.1){
            this.die(callback);
        }
    }

    applyForce(force){
        if (this.clock.getElapsedTime() % this.moveTerm){
            this.lifeMesh.position.set(this.position.x, this.position.y, this.position.z);
            this.position = this.lifeMesh.position;

            this.look(force);

            this.acceleration.add(force);
            this.velocity.add(this.acceleration);

            if (this.velocity > this.velLimit) this.velocity.multiplyScalar(0.1);
            //this.velocity.clampLength(0, this.velLimit * 1.2);

            this.position.add(this.velocity);

            this.velocity.multiplyScalar(0.1);
        }
    }

    look(dir){
        this.lifeMesh.lookAt(this.position.add(dir));
    }

    randomWalk() {
        const speed = MyMath.mapRange(this.mass, 0, 40, 0.0001, 0.001); 
        this.applyForce(new THREE.Vector3(
            MyMath.random(-speed, speed),
            MyMath.random(-speed, speed),
            MyMath.random(-speed, speed)
        ));
        //console.log("life_" + this.index + " randomWalk");
    }

    die(callback){
        if (this.lifeMesh.scale.x > 0.011){
            // this.velocity.add(new THREE.Vector3(
            //     MyMath.random(-0.2, 0.2),
            //     MyMath.random(-0.2, 0.2),
            //     MyMath.random(-0.2, 0.2)));
            this.velLimit = 0.01;
            this.velocity.multiplyScalar(0.1);

            this.lifeMesh.scale.x -= 0.015;
            this.lifeMesh.scale.y -= 0.015;
            this.lifeMesh.scale.z -= 0.015;

            if(this.lifeMesh.material.uniforms.noiseCount.value < 100.) 
                this.lifeMesh.material.uniforms.noiseCount.value += 1.;
        }

        if (this.lifeMesh.material.opacity > 0.01){
            this.lifeMesh.material.opacity -= 0.01;
        }
        
        if (this.isDead == false && this.lifeMesh.scale.x <= 0.010){
            for (let i = 0; i < this.absorbedParticles.length; i++) {
                this.absorbedParticles[i].data.setPassBy(this.lifeName);
                this.absorbedParticles[i].initWrap();
            }

            //console.log(this.lifeName + ' is die');
            this.isDead = true;

            this.contentsText = "";

            this.worldThree.removeFromGroup(this.lifeMesh);

            //make Dead alert if user 
            //callback!= undefined? callback() : null;
        }
    }

    division(lifes, lifeSystem) {
        if (this.isReadyToDivision == true){
            this.energy -= this.size;
            this.lifespan -= this.size/2;
            
            let child = new Life(lifes.length, this.worldSize, new THREE.Vector3().copy(this.position));
            
            if (child == null) return;
            lifeSystem.lifeNum++;
            lifes.push(child);
            this.division_term += this.size;
            this.isReadyToDivision = false;
        }
    }

    // ===============================================================================
    // ===============================================================================

    pushOtherLife(otherLife){
        // 자기 자신은 밀어내지 않음
        if (this.index == otherLife.index) return;

        let normal = new THREE.Vector3(); 
        const relativeVelocity = new THREE.Vector3();

        normal.copy(this.position).sub(otherLife.position);
        const distance = normal.length();

        if ( distance < (this.size + otherLife.size) * 0.5 ) {
            normal.multiplyScalar( 0.5 * distance - ((this.size + otherLife.size) * 0.4) );
            normal.multiplyScalar(0.01);

            this.position.sub( normal );
            //otherLife.position.add( normal );

            normal.normalize();

            relativeVelocity.copy( this.velocity ).sub( otherLife.velocity );
            normal = normal.multiplyScalar( relativeVelocity.dot( normal ) );
            this.applyForce( normal.multiplyScalar(-0.1) );
            //otherLife.applyForce( normal.multiplyScalar(0.1) );
            //console.log("life_" + this.index + " push life_" + otherLife.index);
        }
    }

    wrapLife() {
        let normal = new THREE.Vector3();  // 중심점
        const relativeVelocity = new THREE.Vector3(0, 0, 0);
        
        normal.copy(this.wrapTar.position).sub(this.wrapCenter); // sub other center
        const distance = normal.length();

        if (distance > this.wrapSize) {

            this.velocity.multiplyScalar(-0.1);

            normal.setLength( -0.01 );
            this.applyForce( normal );

            relativeVelocity.sub( this.velocity.multiplyScalar(0.1) );
            normal = normal.multiplyScalar( relativeVelocity.dot( normal ) );
            this.applyForce( normal );
        }

        // const distance = this.wrapCenter.distanceTo(this.position);
        // if (distance > this.wrapSize) {
        //     this.velocity.multiplyScalar(-0.9999);
        // }
    }

    stateMachine(){

    }

    // ===============================================================================
    // ===============================================================================

    setTestText(text){
        this.contentsText = text;
    }

    initTestText(){
        this.canvas = this.worldThree.canvas;

        this.text = document.createElement('text');
        //this.text.style.backgroundColor = "rgba(0,0,0,0)"
        this.text.style.color = "rgba(255,255,255,1)"

        this.text.style.textAlign = "center"
        this.text.size = 15

        this.text.style.border = "0px"
    
        this.text.style.position = 'fixed';
        document.body.appendChild(this.text);

        this.arrowHelper = new THREE.ArrowHelper( this.velocity, new THREE.Vector3( 0, 0, 0 ), this.size, 0xffff00 );
        this.lifeMesh.add( this.arrowHelper );
    }

    updateTestText(){
        this.text.innerHTML = this.contentsText;
    
        //let tempV = _.cloneDeep(this.position);
        let tempV = new THREE.Vector3().copy(this.position);
        let orbitV = new THREE.Vector3();
        orbitV = this.worldThree.controls.object.position;
        tempV.project(this.worldThree.camera);

        this.text.style.fontSize = MyMath.map(Math.abs(this.position.distanceTo(orbitV)), 0, 600, 2, 0) + "vh";
        const x = (tempV.x * .5 + .5) * this.canvas.clientWidth + this.canvas.getBoundingClientRect().left;
        const y = (tempV.y * -.5 + .5) * this.canvas.clientHeight + this.canvas.getBoundingClientRect().top;
        this.text.style.left = x+"px"//`translate(-50%, -50%) translate(${x}px,${y}px)`;
        this.text.style.top=y+"px";

        this.arrowHelper.setDirection(this.velocity);
    }

    getScreenPosition(){
        let tempV = new THREE.Vector3().copy(this.position);
        let orbitV = new THREE.Vector3();
        orbitV = this.worldThree.controls.object.position;
        tempV.project(this.worldThree.camera);

        const x = (tempV.x * .5 + .5) * this.canvas.clientWidth + this.canvas.getBoundingClientRect().left;
        const y = (tempV.y * -.5 + .5) * this.canvas.clientHeight + this.canvas.getBoundingClientRect().top;

        return {x:x, y:y};
    }
}

export {Life}