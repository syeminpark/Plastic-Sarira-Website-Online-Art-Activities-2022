import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import KeyboardState from './KeyboardState.js';
import { Health12345 } from '/assets/js/health.js';
import { UserText } from '/assets/js/userText.js';

import { MyMath } from '/assets/js/three/MyMath.js';

class UserController {
    constructor(worldPage) {
        this.worldPage = worldPage;
        this.keyboard = new KeyboardState();
        this.isEnter = false;
    }

    setup(world) {
        this.isEnter = true;

        this.threeSystem = world.worldThree;
        this.worldSize = world.worldSize;

        this.scene = this.threeSystem.scene;
        this.camera = this.threeSystem.camera;
        this.control = this.threeSystem.controls;

        this.control.minDistance = 5;
        this.control.maxDistance = this.worldSize;

        //=================================================================================

        this.user = world.life_user;
        this.velocity = new THREE.Vector3();

        this.camDis = this.user.mass * 3;
        this.lerpSpeed = 0.1;

        this.isLifeFocusOn = true;
        this.isfocusOffLerpDone = false;

        this.isInWorld = true;

        //=================================================================================

        this.camera_focusOn_init();

        this.healthbar = new Health12345(this.threeSystem,
            this.worldPage.pagelayer.popup.querySelector('#world-health-container'),
            this.worldPage.pagelayer.popup.querySelector('#world-health-bar'));
        this.healthbar.updatePos(this.getUserScreenPosition());

        this.userName = new UserText(this.threeSystem,
            this.worldPage.pagelayer.popup.querySelector('#world-health-container'),
            this.worldPage.pagelayer.popup.querySelector('#world-user-name'));
    }

    //=====================================================================================
    //=====================================================================================

    // 유저 위치 elements에 보내서 스크린에 맞춰 프로젝션 할 수 있도록 함.
    getUserScreenPosition() {
        let tempV = new THREE.Vector3().copy(this.user.position);
        tempV.project(this.camera);

        const x = (tempV.x * .5 + .5);
        const y = (tempV.y * -.5 + .5);

        // zoom 정도에 따라 health bar 위치, 사이즈 변경되도록 함.
        const distance = this.camera.position.distanceTo(this.user.position);
        const dist = -(2600 / (distance + 5)) - 37;

        const yy = MyMath.map(dist, -300, -45, 0.25, 0.05);

        const w = MyMath.map(dist, -300, -45, 200, 120);
        const h = MyMath.map(dist, -300, -45, 15, 10);

        return { x: x, y: y, yy: yy, w: w, h: h };
    }

    //=====================================================================================
    //=====================================================================================

    start(userName) {
        this.healthbar.start();
        this.userName.setText(userName);
    }

    healthbarActive() {
        this.healthbar.set(1 - this.user.age / this.user.lifespan);
    }

    update() {
        if (this.isEnter == true) {
            this.key_ZCheck();

            // focus on 모드이면서, 유저가 살아있을 시 = 유저 조작 모드
            if (this.isLifeFocusOn == true && this.user.isDead == false) {

                // 카메라 유저 따라다니기
                this.camera_focusOn_update();
                this.camera.position.lerp(this.camLerpPos, this.lerpSpeed);

                // 유저가 world 밖으로 나가지 않도록 함
                this.wrap();

                // 유저 3인칭 컨트롤용 키보드 인풋을 받음
                this.key_update();
            }
            else if (this.isLifeFocusOn == false && this.isfocusOffLerpDone == false) {
                if (this.camera.position.length() > this.worldSize * .4 || this.focusOffTimer <= 0) {

                    this.focusOffTimer -= 0.01;

                    this.control.target = new THREE.Vector3(0, 0, 0);

                    this.isfocusOffLerpDone = true;
                }
                else {
                    this.camera.position.lerp(this.camLerpPos, 0.1);
                }
            }

            this.healthbar.updatePos(this.getUserScreenPosition());
            this.userName.updatePos();

            // console.log(this.user.position, this.camera.position)
        }
    }

    end() {
        this.healthbar.end();
        this.userName.end();
        this.isEnter = false;
    }

    //=====================================================================================
    //=====================================================================================

    key_ZCheck() {
        this.keyboard.update();

        // z 눌렸을 때 한번만 실행
        if (this.keyboard.down("Z")) {
            this.isLifeFocusOn = !this.isLifeFocusOn;

            if (this.isLifeFocusOn == true) {
                this.camera_focusOn_init();
            } else {
                this.camera_focusOff_init();
            }
        }
    }

    key_update() {
        // velocity 초기화
        if (this.keyboard.down("W") || this.keyboard.down("S") || this.keyboard.down("A") || this.keyboard.down("D") 
        ||  this.keyboard.up("W") || this.keyboard.up("S") || this.keyboard.up("A") || this.keyboard.up("D")){
            
            this.velocity.multiplyScalar(0);
        }

        if (this.keyboard.pressed("W") || this.keyboard.pressed("S")) {

            let fv = new THREE.Vector3();

            if (this.keyboard.pressed("W")) {
                fv.subVectors(
                    new THREE.Vector3().copy(this.user.position),
                    new THREE.Vector3().copy(this.camera.position));
            }
            if (this.keyboard.pressed("S")) {
                fv.subVectors(
                    new THREE.Vector3().copy(this.camera.position),
                    new THREE.Vector3().copy(this.user.position));
            }

            fv.normalize();
            fv.multiplyScalar(0.05);

            this.velocity.add(fv);
            if (this.velocity.length() > 0.25) this.velocity.setLength(0.25);

            this.user.position.add(this.velocity);
        }

        if (this.keyboard.pressed("A") || this.keyboard.pressed("D")){
            
            let fv = new THREE.Vector3().subVectors(
                new THREE.Vector3().copy(this.camera.position),
                new THREE.Vector3().copy(this.user.position));
            
            fv.cross(new THREE.Vector3(0,1,0));
                    
            if (this.keyboard.pressed("A")) {
                fv.multiplyScalar(1);
            }
            if (this.keyboard.pressed("D")) {
                fv.multiplyScalar(-1);
            }
            
            fv.normalize();
            fv.multiplyScalar(0.02);
            this.velocity.add(fv);
            if (this.velocity.length() > 0.25) this.velocity.setLength(0.25);

            this.user.position.add(this.velocity);
        }
    }

    //=====================================================================================
    //=====================================================================================

    camera_focusOff_init() {
        this.control.enablePan = true;
        this.control.enableZoom = true;

        this.isfocusOffLerpDone = false;
        this.focusOffTimer = 1;

        this.camLerpPos = new THREE.Vector3().subVectors(
            new THREE.Vector3().copy(this.camera.position),
            new THREE.Vector3().copy(this.user.position)
        ).setLength(this.worldSize * 0.5);
    }

    camera_focusOn_init() {
        this.control.enablePan = false;
        this.control.enableZoom = false;

        const userFollowCam_Pos = new THREE.Vector3().subVectors(
            new THREE.Vector3().copy(this.user.position),
            new THREE.Vector3().copy(this.camera.position))
            .setLength(this.camDis);

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
        const wrapLength = this.worldSize - (this.camDis * 2);

        if (distance > wrapLength) {
            this.isInWorld = false;
            this.camera.position.setLength(wrapLength);
        } else {
            this.isInWorld = true;
        }
    }
}

export { UserController }