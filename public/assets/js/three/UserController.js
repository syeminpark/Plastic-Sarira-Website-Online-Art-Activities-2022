import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import KeyboardState from './KeyboardState.js';
import {Health12345} from '/assets/js/health.js';

import {MyMath} from '/assets/js/three/MyMath.js';

var mouseHold = -1;
var isMouseMoving = false;

function onContextMenu(event) { // Prevent right click
    event.preventDefault();
}

function onMouseDown(event) {
    mouseHold = event.which;
}

function onMouseMove(event) {
    isMouseMoving = true;
}

function onMouseUp(event) {
    mouseHold = -1;
    isMouseMoving = false;
}

class UserController {
    constructor(worldPage) {
        this.worldPage = worldPage;
        this.keyboard = new KeyboardState();
    }

    setup(world){
        this.threeSystem = world.worldThree;
        this.worldSize = world.worldSize;
        
        this.scene = this.threeSystem.scene;
        this.camera = this.threeSystem.camera;
        this.orbitControl = this.threeSystem.controls;

        this.orbitControl.minDistance = 5;
        this.orbitControl.maxDistance = this.worldSize; 

        this.user = world.life_user;

        this.camDis = this.user.mass * 4;

        //=================================================================================

        this.isLifeFocusOn = true;
        this.isInWorld = true;

        this.isDuringLerp = false;

        this.timer = 1;
        this.checkFirst = 0;

        //=================================================================================
        // this.pointerLockControl = world.controls_pointerLock;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.prevTime = performance.now();
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        // this.camera_focusOn_init();
        // this.mouse_init();

        //=================================================================================
        //=================================================================================

        this.healthbar = new Health12345(this.threeSystem, 
            this.worldPage.pagelayer.popup.querySelector('#world-health-container'), 
            this.worldPage.pagelayer.popup.querySelector('#world-health-bar'));
        
        // this.userText = new UserText(threeSystemController.worldThreeSystem, document.querySelector("#world"));
        // this.userText.createLabel();
    }

    //=====================================================================================
    //=====================================================================================

    getUserScreenPosition(){
        let tempV = new THREE.Vector3().copy(this.user.position);
        let orbitV = new THREE.Vector3();
        orbitV = this.orbitControl.object.position;
        tempV.project(this.camera);

        const x = (tempV.x * .5 + .5);
        const y = (tempV.y * -.5 + .5);

        const distance = this.camera.position.distanceTo( this.orbitControl.target );
        const dist = MyMath.map(distance, this.orbitControl.minDistance, this.orbitControl.maxDistance, -200, -45)

        console.log(dist)

        return {x:x, y:y, h: dist};
    }

    getUserCamDistance(){
        const distance = this.camera.position.distanceTo( this.orbitControl.target );
        const maxDistance = this.orbitControl.maxDistance * 0.75;

        return {dis:distance, maxDis:maxDistance};
    }

    //=====================================================================================
    //=====================================================================================

    start(){
        this.healthbar.start();
    }

    healthbarActive(){
        this.healthbar.set(1 - this.user.age/this.user.lifespan);
    }

    update() {
        // this.key_check();
        // this.lerpLoad();

        // if (this.isLifeFocusOn == true && this.user.isDead == false) {
        //     this.camera_focusOn_update();
        //         this.wrap();
        //         if (this.isDuringLerp == false) {
        //             this.key_update();
        //             this.mouse_update();
        //         }
        // } else {
        //     if (this.user.isDead == true) {
        //         this.orbitControl.enabled = false;
        //     }
        //     else this.orbitControl.target = new THREE.Vector3(0, 0, 0);
        // }

        // this.user.shaderCalculate( this.camera.position );
        
        this.healthbar.updatePos(this.getUserScreenPosition());
        // this.userText.updateLabel(this.user.lifeMesh.position);
    }

    end(){
        this.healthbar.end();
    }

    key_check() {
        this.keyboard.update();

        if (this.keyboard.down("Z")) {
            this.isLifeFocusOn = !this.isLifeFocusOn;
            //console.log('focus mode : ' + this.isLifeFocusOn);
            this.timer = 1;

            if (this.isLifeFocusOn == true) {
                this.camera_focusOn_init();
            } else {
                this.camera_focusOff_init2();
                //console.log('orbit control on' + this.orbitControl.enabled);
            }
        }
    }

    key_update() {
        var moveDistance = 50 * this.user.clock.getDelta();

        if (this.keyboard.pressed("W")) {
            this.camera.translateZ(-moveDistance);
        } else if (this.keyboard.pressed("S")) {
            this.camera.translateZ(moveDistance);
        } else if (this.keyboard.pressed("A")) {
            this.camera.translateX(-moveDistance);
        } else if (this.keyboard.pressed("D")) {
            this.camera.translateX(moveDistance);
        }

        // if ( this.keyboard.pressed("Q") ){
        //     this.user.lifeMesh.translateY( moveDistance );
        // }

        // if ( this.keyboard.pressed("E") ){
        //     this.user.lifeMesh.translateY( -moveDistance );
        // }
    }

    mouse_init(){
        this.threeSystem.canvas.addEventListener('contextmenu', onContextMenu, false);
        this.threeSystem.canvas.addEventListener('mousedown', onMouseDown, false);
        this.threeSystem.canvas.addEventListener('mouseup', onMouseUp, false);
        this.threeSystem.canvas.addEventListener('mousemove', onMouseMove, false);

        // this.threeSystem.canvas.addEventListener('touchstart', onMouseDown, false);
        // this.threeSystem.canvas.addEventListener('touchend', onMouseUp, false);
        // this.threeSystem.canvas.addEventListener('touchmove', onMouseMove, false);
    }

    mouse_update(){
        switch(mouseHold) {
            case 1:
                if (this.user.isDead == false) {
                    // this.pointerLockControl.lock();
                }
                break;
            case -1:
                // this.pointerLockControl.unlock();
                // this.pointerLockControl.isLocked = false;
                break;
        }
    }

    wrap() {
        const distance = this.user.position.length();
        const wrapLength = this.worldSize - (this.camDis * 2);

        // var newParticlePos = [];
        // for (let i = 0; i < this.user.absorbedParticles.length; i++) {
        //     newParticlePos.push(this.user.absorbedParticles[i].position.clone());
        // }

        if (distance > wrapLength){
            this.isInWorld = false;
            this.camera.position.setLength(wrapLength);
        } else {
            this.isInWorld = true;
        }
    }

    lerpLoad() {
        if (this.timer > 0) {
            this.isDuringLerp = true;
            this.timer -= 0.01;

            if (this.checkFirst < 1) this.checkFirst += 0.01;

            if (this.isLifeFocusOn == true) {
                // this.pointerLockControl.unlock();
                // this.pointerLockControl.isLocked = false;
                this.camera.lookAt(this.user.position.clone());
            } else {
                this.orbitControl.enabled = false;
            }

            //this.camera.position.lerp(this.camLerp, 0.05);
            this.orbitControl.object.position.lerp(this.camLerpPos, 0.05);
        } else {
            this.isDuringLerp = false;

            if (this.isLifeFocusOn == true) {
                // this.pointerLockControl.lock();
                // this.pointerLockControl.isLocked = true;
            } else {
                this.orbitControl.enabled = true;
            }
        }
    }

    camera_focusOff_init() {
        //this.cam.position.set(50, 50, 200);
        this.camera.lookAt(0, 0, 0);
        this.camLerpPos = this.camera.position.clone().setLength(this.worldSize * .5);

        // this.pointerLockControl.unlock();

        this.orbitControl.target = new THREE.Vector3(0, 0, 0);
        this.orbitControl.enablePan = true;
        this.orbitControl.enableZoom = true;
        this.orbitControl.enabled = true;
    }

    camera_focusOff_init2() {
        // const camDir = this.pointerLockControl.getDirection(this.camera.position.clone()).multiplyScalar(this.camDis);
        const camDis = new THREE.Vector3().subVectors(this.user.position.clone(), this.camera.position.clone()).setLength(this.worldSize * 2);

        this.camera.lookAt(this.user.position.clone());
        this.camLerpPos = new THREE.Vector3().subVectors(this.user.position.clone(), camDis);
    }

    camera_focusOn_init() {
        // const camDir = this.pointerLockControl.getDirection(this.camera.position.clone()).multiplyScalar(this.camDis);
        const camDis = new THREE.Vector3().subVectors(this.user.position.clone(), this.camera.position.clone()).setLength(this.camDis);

        this.orbitControl.target = this.user.position;
        this.camera.lookAt(this.user.position.clone());
        this.camLerpPos = new THREE.Vector3().subVectors(this.user.position.clone(), camDis);

        // this.orbitControl.enabled = false;
    }

    camera_focusOn_update() {
        // const camDir = this.pointerLockControl.getDirection(this.camera.position.clone()).multiplyScalar(this.camDis);
        const userPos = new THREE.Vector3().addVectors(this.camera.position.clone(), camDir);
        var lerpSpeed = .5;

        if (this.isDuringLerp == false) {
            this.user.position.lerp(userPos, lerpSpeed);
            // this.user.position = userPos;
        }
    }
}

export {UserController}