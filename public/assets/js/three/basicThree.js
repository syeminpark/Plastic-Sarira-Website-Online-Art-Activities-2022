import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    OrbitControls
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"
import {
    PLYLoader
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js"

export default class BasicThree {

    constructor(domElement, type) {

        BasicThree.renderer = new THREE.WebGLRenderer()
        BasicThree.renderer.outputEncoding = THREE.sRGBEncoding

        this.object;
        this.geometry
        this.originalArray = []
        this.selectedArray = []
        this.domElement = domElement;
        this.type = type

        //scene
        this.scene = new THREE.Scene()
        // this.scene.add(new THREE.AxesHelper(5))
        //camera
        this.camera = new THREE.PerspectiveCamera(
            25,
            window.innerWidth / window.innerHeight,
            0.02,
            1300
        )
        this.camera.position.set(0, 0, 400)

        this.material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
        });
        //orbitControls
        this.controls = new OrbitControls(this.camera, BasicThree.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.maxDistance = 1000
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    import = (data) => {

        this.reset()
        this.domElement.appendChild(BasicThree.renderer.domElement)
        BasicThree.renderer.setSize(this.domElement.getBoundingClientRect().width, this.domElement.getBoundingClientRect().height)

        switch (this.type) {
            case "PLASTIC_SARIRA_ARCHIVE":
                this.geometry = new THREE.BufferGeometry();
                this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
                this.geometry.computeBoundingBox()
                this.material.vertexColors=false;
                this.object = new THREE.Points(this.geometry, this.material);
                this.scene.add(this.object)
                this.camera.position.set(0, 0, 150 + this.geometry.boundingBox.max.y * 5)
                this.updateSize()
                this.animate()
                break;

            default:
               
                new PLYLoader().load(
                    data, (geometry) => {
                        geometry.computeBoundingBox()
                        this.geometry = geometry
                        this.originalArray = new Array(geometry.attributes.position.count)
                        for (let i = 0; i < this.originalArray.length; i++) {
                            this.originalArray[i] = i;
                        }
                        this.object = new THREE.Points(this.geometry, this.material);
                        this.scene.add(this.object)
                        this.camera.position.set(0, 0, 150 + this.geometry.boundingBox.max.y * 5)
                        this.updateSize()
                        this.animate()
                    })
                break;
        }
    }

    animate = () => {
        this.animationRequest = requestAnimationFrame(this.animate);
        this.controls.update()
        BasicThree.renderer.render(this.scene, this.camera)

        if (this.type == "HOME") {
            this.setObjectPosition()
        }
    }

    updateSize() {
        BasicThree.renderer.setSize(this.domElement.getBoundingClientRect().width, this.domElement.getBoundingClientRect().height)
        this.camera.aspect = BasicThree.renderer.domElement.width / BasicThree.renderer.domElement.height;
        this.camera.updateProjectionMatrix();

    }

    reset() {
        this.scene.remove(this.object)
        console.log("reset")
        this.object = undefined
        this.selectedArray = [];
        this.originalArray = [];
        cancelAnimationFrame(this.animationRequest)
    }

    setObjectPosition() {
        this.selectRandomPoints()

        const particleSpeed = 0.05;
        const position = this.object.geometry.getAttribute('position').array;
        const normal = this.object.geometry.getAttribute('normal').array

        for (let index = 0; index < this.selectedArray.length; index += 1) {

            position[this.selectedArray[index] * 3 + 0] = position[this.selectedArray[index] * 3 + 0] + normal[this.selectedArray[index] * 3] * particleSpeed
            position[this.selectedArray[index] * 3 + 1] = position[this.selectedArray[index] * 3 + 1] + normal[this.selectedArray[index] * 3 + 1] * particleSpeed
            position[this.selectedArray[index] * 3 + 2] = position[this.selectedArray[index] * 3 + 2] + normal[this.selectedArray[index] * 3 + 2] * particleSpeed
        }
        this.object.geometry.attributes.position.needsUpdate = true;
    }

    selectRandomPoints() {
        const randomSelectionspeed = 10
        if (this.originalArray.length > 0) {
            if (Math.floor(Math.random() * (randomSelectionspeed)) == randomSelectionspeed - 1) {
                const index = Math.floor(Math.random() * (this.originalArray.length))
                this.selectedArray.push(this.originalArray[index])
                this.originalArray.splice(index, 1)
            }
        }
    }
}