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
    constructor(world, virtualKeyboard) {
        this.user = world.life_user;
        this.worldSize = world.worldSize;

        this.camDis = (this.user.mass) * 2.3;

        this.scene = threeSystemController.worldThreeSystem.scene;
        this.cam = threeSystemController.worldThreeSystem.camera;
        this.orbitControl = threeSystemController.worldThreeSystem.controls;

        this.keyboard = new KeyboardState();

        this.isLifeFocusOn = true;
        this.isInWorld = true;

        this.isDuringLerp = false;

        this.timer = 1;
        this.checkFirst = 0;

        //=================================================================================
        this.pointerLockControl = threeSystemController.worldThreeSystem.controls_pointerLock;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.prevTime = performance.now();
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.camera_focusOn_init();
        this.mouse_init();

        //=================================================================================
        this.virtualKeyboard = virtualKeyboard;

        //=================================================================================
        this.userText = new UserText(threeSystemController.worldThreeSystem, document.querySelector("#world"));
        this.userText.createLabel();

        this.healthbar = new HealthBar('health', threeSystemController.worldThreeSystem, document.querySelector("#world"));
        this.healthbar.createBar(this.user.lifespan);
    }

    update() {
        this.key_check();
        this.lerpLoad();

        if (this.isLifeFocusOn == true && this.user.isDead == false) {
            this.camera_focusOn_update();
                this.wrap();
                if (this.isDuringLerp == false) {
                    this.key_update();
                    this.mouse_update();
                }
        } else {
            if (this.user.isDead == true) {
                this.orbitControl.enabled = false;
                this.pointerLockControl.unlock();
                this.pointerLockControl.isLocked = false;
            }
            else this.orbitControl.target = new THREE.Vector3(0, 0, 0);
        }

        this.user.shaderCalculate( this.cam.position );

        this.healthbar.updatePosition(this.user.lifeMesh.position);
        this.healthbar.updateHealth(this.user.lifespan - this.user.age);
        this.userText.updateLabel(this.user.lifeMesh.position);
    }

    key_check() {
        this.keyboard.update();

        if (this.keyboard.down("Z") || this.virtualKeyboard.getKeyValue() == "Z") {
            this.virtualKeyboard.resetKeyValue()
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
        var moveDistance = 1000 * this.user.clock.getDelta();

        if (this.keyboard.pressed("W") || this.virtualKeyboard.getKeyValue() == "W") {
            this.cam.translateZ(-moveDistance);
        } else if (this.keyboard.pressed("S") || this.virtualKeyboard.getKeyValue() == "S") {
            this.cam.translateZ(moveDistance);
        } else if (this.keyboard.pressed("A") || this.virtualKeyboard.getKeyValue() == "A") {
            this.cam.translateX(-moveDistance);
        } else if (this.keyboard.pressed("D") || this.virtualKeyboard.getKeyValue() == "D") {
            this.cam.translateX(moveDistance);
        }

        // if ( this.keyboard.pressed("Q") ){
        //     this.user.lifeMesh.translateY( moveDistance );
        // }

        // if ( this.keyboard.pressed("E") ){
        //     this.user.lifeMesh.translateY( -moveDistance );
        // }
    }

    mouse_init(){
        document.getElementById('world').addEventListener('contextmenu', onContextMenu, false);
        document.getElementById('world').addEventListener('mousedown', onMouseDown, false);
        document.getElementById('world').addEventListener('mouseup', onMouseUp, false);
        document.getElementById('world').addEventListener('mousemove', onMouseMove, false);

        // document.getElementById('world').addEventListener('touchstart', onMouseDown, false);
        // document.getElementById('world').addEventListener('touchend', onMouseUp, false);
        // document.getElementById('world').addEventListener('touchmove', onMouseMove, false);
    }

    mouse_update(){
        switch(mouseHold) {
            case 1:
                if (this.user.isDead == false) this.pointerLockControl.lock();
                break;
            case -1:
                this.pointerLockControl.unlock();
                this.pointerLockControl.isLocked = false;
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
            this.cam.position.setLength(wrapLength);
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
                //this.pointerLockControl.unlock();
                this.pointerLockControl.isLocked = false;
                this.cam.lookAt(this.user.position.clone());
            } else {
                this.orbitControl.enabled = false;
            }

            //this.cam.position.lerp(this.camLerp, 0.05);
            this.orbitControl.object.position.lerp(this.camLerpPos, 0.05);
        } else {
            this.isDuringLerp = false;

            if (this.isLifeFocusOn == true) {
                //this.pointerLockControl.lock();
                this.pointerLockControl.isLocked = true;
            } else {
                this.orbitControl.enabled = true;
            }
        }
    }

    camera_focusOff_init() {
        //this.cam.position.set(50, 50, 200);
        this.cam.lookAt(0, 0, 0);
        this.camLerpPos = this.cam.position.clone().setLength(this.worldSize * 1.5);

        this.pointerLockControl.unlock();

        this.orbitControl.target = new THREE.Vector3(0, 0, 0);
        this.orbitControl.enablePan = true;
        this.orbitControl.enableZoom = true;
        this.orbitControl.enabled = true;
    }

    camera_focusOff_init2() {
        const camDir = this.pointerLockControl.getDirection(this.cam.position.clone()).multiplyScalar(this.camDis);
        const camDis = new THREE.Vector3().subVectors(this.user.position.clone(), this.cam.position.clone()).setLength(this.worldSize * 2);

        this.cam.lookAt(this.user.position.clone());
        this.camLerpPos = new THREE.Vector3().subVectors(this.user.position.clone(), camDis);
    }

    camera_focusOn_init() {
        const camDir = this.pointerLockControl.getDirection(this.cam.position.clone()).multiplyScalar(this.camDis);
        const camDis = new THREE.Vector3().subVectors(this.user.position.clone(), this.cam.position.clone()).setLength(this.camDis);

        this.cam.lookAt(this.user.position.clone());
        this.camLerpPos = new THREE.Vector3().subVectors(this.user.position.clone(), camDis);

        this.orbitControl.enabled = false;
    }

    camera_focusOn_update() {
        const camDir = this.pointerLockControl.getDirection(this.cam.position.clone()).multiplyScalar(this.camDis);
        const userPos = new THREE.Vector3().addVectors(this.cam.position.clone(), camDir);
        var lerpSpeed = 0.5;

        if (this.isDuringLerp == false) this.user.position.lerp(userPos, lerpSpeed);
    }
}

export {UserController}