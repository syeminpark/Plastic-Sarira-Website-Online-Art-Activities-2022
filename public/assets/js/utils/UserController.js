import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import KeyboardState from '/assets/js/utils/KeyboardState.js';

import { UserText } from '/assets/js/userText.js';
import { Health12345 } from '/assets/js/health.js';
import HealthTime from '../HealthTime.js';
import { Joystick12345 } from '/assets/js/joystick.js';

import { MyMath } from '/assets/js/utils/MyMath.js';
import { IsMobile } from '/assets/js/util.js';

import config from './config.js';


class UserController {
    constructor(worldPage) {
        this.worldPage = worldPage;
        this.keyboard = new KeyboardState();
        this.isEnter = false;
        this.isMobile = IsMobile();
    }

    setup(world) {
        this.isEnter = true;

        this.threeSystem = world.worldThree;
        this.worldSize = world.worldSize;

        this.scene = this.threeSystem.scene;
        this.camera = this.threeSystem.camera;
        this.control = this.threeSystem.controls;

        // this.control.enableDamping = false;
        this.control.minDistance = 5;
        this.control.maxDistance = this.worldSize * 2;

        //=================================================================================

        this.user = world.life_user;
        this.velocity = new THREE.Vector3();

        this.camDis = this.user.mass * config.ZoomIn_Distance;

        this.isFirstLerp = true;
        this.lerpSpeed = config.lerpSpeed * 0.2;

        this.isLifeFocusOn = true;
        this.isfocusOffLerpDone = false;

        this.isInWorld = true;

        this.isKey_down = true;

        //=================================================================================

        this.fValue = 0;
        this.bValue = 0;
        this.rValue = 0;
        this.lValue = 0;
        this.moveVector = new THREE.Vector3();
        this.upVector = new THREE.Vector3(0, 1, 0);

        //=================================================================================

        this.healthbar = new Health12345(this.threeSystem,
            this.worldPage.pagelayer.popup.querySelector('#world-health-container'),
            this.worldPage.pagelayer.popup.querySelector('#world-health-bar'));
        this.healthbar.updatePos(this.getUserScreenPosition());

        this.healthTime= new HealthTime(config.lifespan,document.getElementById('health-text'));

        this.userName = new UserText(this.threeSystem,
            this.worldPage.pagelayer.popup.querySelector('#world-health-container'),
            this.worldPage.pagelayer.popup.querySelector('#world-user-name'));

        this.l_joystick = new Joystick12345(0, {
            container: this.worldPage.pagelayer.popup.querySelector('#world-joystick-left'),
            stick: this.worldPage.pagelayer.popup.querySelector('#world-joystick-left .joystick-thumb')

        });
        this.r_joystick = new Joystick12345(1, {
            container: this.worldPage.pagelayer.popup.querySelector('#world-joystick-right'),
            stick: this.worldPage.pagelayer.popup.querySelector('#world-joystick-right .joystick-thumb')
        });

        this.camera_focusOn_init();
    }

    //=====================================================================================
    //=====================================================================================

    resetKeyboardState() {
        KeyboardState.status = {}
    }

    start(userName) {
        this.healthbar.start();
        this.userName.setText(userName);
        this.healthTime.start()
    }

    healthbarActive() {
        this.healthbar.set(1 - this.user.age / this.user.lifespan);
    }

    update() {
        if (this.isEnter == true) {
            this.key_Check();

            // focus on ???????????????, ????????? ???????????? ??? = ?????? ?????? ??????
            if (this.isLifeFocusOn == true && this.user.isDead == false) {

                // ????????? / ??? ??????
                // ???
                if (this.isMobile == false) {
                    // ?????? ???????????? ????????? ????????? ??????

                    this.key_update();
                    this.updateUserPos();
                    // this.camera.lookAt(this.user.position);
                }
                // ?????????
                else {
                    if (this.control.enableRotate == true) this.control.enableRotate = false;
                    if (this.control.enableZoom == true) this.control.enableZoom = false;
                    if (this.control.enablePan == true) this.control.enablePan = false;

                    if (this.l_joystick.is_pressed == true) {

                        this.l_joystick.animate();
                        this.joystick_update(this.l_joystick);
                        this.updateUserPos();
                    }
                    if (this.l_joystick.checkAnimate()) {
                        this.l_joystick.animate();
                    }

                    if (this.r_joystick.is_pressed) {

                        this.r_joystick.animate();
                        this.joystick_update(this.r_joystick);
                        this.updateControlRotate();
                    }
                    if (this.r_joystick.checkAnimate()) {
                        this.r_joystick.animate();
                    }
                }

                // ????????? ?????? ???????????????
                this.camera_focusOn_update();
                
                this.camDis = this.user.mass * config.ZoomIn_Distance;
                this.camera.position.lerp(this.camLerpPos, this.lerpSpeed);

                // ??? ????????? zoom in
                if (this.isFirstLerp == true){
                    if (this.camera.position.distanceTo(this.user.position) <= this.camDis * 2){
                        this.isFirstLerp = false;
                    }
                }
                else if (this.isFirstLerp == false && this.lerpSpeed < config.lerpSpeed) {
                    this.lerpSpeed *= 1.05;
                    console.log("lerp done")
                }
            }
            // focus on ????????? ?????????, focus off ????????? ?????????????????? ????????? ????????? ??? 
            else if (this.isLifeFocusOn == false && this.isfocusOffLerpDone == false) {
                // ???????????? ?????? ????????? ???????????? ?????????????????? ?????????
                if (this.camera.position.length() > this.worldSize * config.ZoomOut_Distance * .995) {

                    // this.control.target = new THREE.Vector3(0, 0, 0);
                    this.isfocusOffLerpDone = true;

                    // ?????? ??????????????? ?????? ????????? ???
                    this.control.enabled = true;
                }
                else {
                    this.camera.position.lerp(this.camLerpPos, this.lerpSpeed);
                }
            }

            // ????????? world ????????? ????????? ????????? ???
            this.wrap();

            this.healthbar.updatePos(this.getUserScreenPosition());
            this.userName.updatePos();
        }
    }

    end() {
        this.healthbar.end();
        this.userName.end();
        this.isEnter = false;
    }


    //=====================================================================================
    //=====================================================================================

    // ?????? ?????? elements??? ????????? ???????????? ?????? ???????????? ??? ??? ????????? ???.
    getUserScreenPosition() {
        let tempV = new THREE.Vector3().copy(this.user.position);
        tempV.project(this.camera);

        const x = (tempV.x * .5 + .5);
        const y = (tempV.y * -.5 + .5);

        // zoom ????????? ?????? health bar ??????, ????????? ??????????????? ???.
        const distance = this.camera.position.distanceTo(this.user.position);
        const dist = -(2600 / (distance + 5)) - 37;

        const yy = MyMath.map(dist, -300, -45, 0.25, 0.05);

        const w = MyMath.map(dist, -300, -45, 200, 120);
        const h = MyMath.map(dist, -300, -45, 15, 10);

        return { x: x, y: y, yy: yy, w: w, h: h };
    }

    //=====================================================================================
    //=====================================================================================

    key_Check() {
        this.keyboard.update();

        // z ????????? ??? ????????? ??????
        if (this.keyboard.down("Z")) {
            this.isLifeFocusOn = !this.isLifeFocusOn;
            this.isKey_down = true;

            if (this.isLifeFocusOn == true) {
                this.camera_focusOn_init();
            } else {
                this.camera_focusOff_init();
            }
        }

        // ??? ???????????? ??????
        if (this.keyboard.down("W") || this.keyboard.down("S") || this.keyboard.down("A") || this.keyboard.down("D")) {
            this.isKey_down = true;
        }

        // velocity ?????????
        if (this.keyboard.up("W") || this.keyboard.up("S") || this.keyboard.up("A") || this.keyboard.up("D")) {

            this.isKey_down = false;
            this.velocity.set(0, 0, 0);
            this.fValue = 0;
            this.bValue = 0;
            this.lValue = 0;
            this.rValue = 0;
        }
        
        if (this.l_joystick.is_pressed == false && this.isMobile == true) {
            this.velocity.set(0, 0, 0);
            this.fValue = 0;
            this.bValue = 0;
            this.lValue = 0;
            this.rValue = 0;
        }
    }

    key_update() {
        if (this.keyboard.pressed("W")) {

            if (this.fValue < 0.15) this.fValue += 0.05;
        }
        if (this.keyboard.pressed("S")) {

            if (this.bValue < 0.15) this.bValue += 0.05;
        }
        if (this.keyboard.pressed("A")) {

            if (this.lValue < 0.15) this.lValue += 0.05;
        }
        if (this.keyboard.pressed("D")) {

            if (this.rValue < 0.15) this.rValue += 0.05;
        }
    }

    joystick_update(jstick) {
        const forward = jstick.pan_pos.y;
        const turn = jstick.pan_pos.x;

        if (forward > 5) {
            this.fValue = 0
            this.bValue = MyMath.map(Math.abs(forward), 0, 50, 0.04, 0.1);
        } else if (forward < -5) {
            this.fValue = MyMath.map(Math.abs(forward), 0, 50, 0.04, 0.1);
            this.bValue = 0
        }

        if (turn > 5) {
            this.lValue = 0
            this.rValue = MyMath.map(Math.abs(turn), 0, 50, 0.01, 0.05);
        } else if (turn < -5) {
            this.lValue = MyMath.map(Math.abs(turn), 0, 50, 0.01, 0.05);
            this.rValue = 0
        }
    }

    //=====================================================================================

    updateUserPos() {
        let fv = new THREE.Vector3();

        if (this.fValue > 0) {
            const temp = new THREE.Vector3().subVectors(
                new THREE.Vector3().copy(this.user.position),
                new THREE.Vector3().copy(this.camera.position));
            temp.setLength(this.fValue);
            fv.add(temp);

            // console.log(this.control.getPolarAngle());
        }

        if (this.bValue > 0) {
            const temp = new THREE.Vector3().subVectors(
                new THREE.Vector3().copy(this.camera.position),
                new THREE.Vector3().copy(this.user.position));
            temp.setLength(this.bValue);
            
            // ????????? ????????? ?????? ??????
            if (this.user.position.distanceTo(this.camera.position) <= this.camDis * .5) temp.multiplyScalar(0.01);
            
            fv.add(temp);
        }

        if (this.lValue > 0) {
            const temp = new THREE.Vector3().subVectors(
                new THREE.Vector3().copy(this.camera.position),
                new THREE.Vector3().copy(this.user.position));

            temp.cross(new THREE.Vector3(0, 1, 0));
            temp.multiplyScalar(0.5);
            temp.setLength(this.lValue);
            fv.add(temp);
        }

        if (this.rValue > 0) {
            const temp = new THREE.Vector3().subVectors(
                new THREE.Vector3().copy(this.camera.position),
                new THREE.Vector3().copy(this.user.position));

            temp.cross(new THREE.Vector3(0, 1, 0));
            temp.multiplyScalar(-0.5);
            temp.setLength(this.rValue);
            fv.add(temp);
        }

        this.velocity.add(fv);
        if (this.velocity.length() > 0.25) this.velocity.setLength(0.25);

        this.user.position.add(this.velocity);
        this.user.position.add(fv);
    }

    // control rotate custom 
    // ??????: https://stackoverflow.com/questions/50633960/three-js-orbitcontrols-how-update-rotation-camera
    updateControlRotate() {
        if (this.fValue > 0) {
            // this.camera.translateY(-0.3);
            this.control.rotateUp(-this.fValue*0.1);
        }

        if (this.bValue > 0) {
            // this.camera.translateY(0.3);
            this.control.rotateUp(this.bValue*0.1);
        }

        if (this.lValue > 0) {
            // this.camera.translateX(0.3);
            this.control.rotateLeft(-this.lValue*0.15);
        }

        if (this.rValue > 0) {
            // this.camera.translateX(-0.3);
            this.control.rotateLeft(this.rValue*0.15);
        }
    }

    //=====================================================================================
    //=====================================================================================

    camera_focusOff_init() {
        this.isfocusOffLerpDone = false;

        this.control.enablePan = true;
        this.control.enableZoom = true;

        this.control.enabled = false;

        this.maxPolarAngle = Math.PI;

        this.camLerpPos = new THREE.Vector3().subVectors(
            new THREE.Vector3().copy(this.camera.position),
            new THREE.Vector3().copy(this.user.position)
        ).setLength(this.worldSize * config.ZoomOut_Distance);
    }

    camera_focusOn_init() {
        this.control.enabled = true;
        this.control.enableRotate = true;

        this.control.enablePan = false;
        this.control.enableZoom = false;

        const camDir = new THREE.Vector3().subVectors(
            new THREE.Vector3().copy(this.user.position),
            new THREE.Vector3().copy(this.camera.position))
            .setLength(this.camDis);
        const userFollowCam_Pos = new THREE.Vector3().subVectors(
            new THREE.Vector3().copy(this.user.position),
            camDir);

        this.camLerpPos = userFollowCam_Pos;
    }

    camera_focusOn_update() {
        this.control.target.lerp(this.user.position, this.lerpSpeed);

        const camDir = new THREE.Vector3().subVectors(
            new THREE.Vector3().copy(this.user.position),
            new THREE.Vector3().copy(this.camera.position))
            .setLength(this.camDis);
        const userFollowCam_Pos = new THREE.Vector3().subVectors(
            new THREE.Vector3().copy(this.user.position),
            camDir);

        this.camLerpPos = userFollowCam_Pos;
    }

    //=====================================================================================
    //=====================================================================================

    wrap() {
        const distance = this.user.position.length();
        const wrapLength = this.worldSize - (this.user.size);

        if (distance > wrapLength) {
            this.isInWorld = false;
            this.user.position.setLength(wrapLength);
            console.log("wrap")
        } else {
            this.isInWorld = true;
        }
    }
}

export { UserController }