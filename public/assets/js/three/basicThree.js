import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    OrbitControls
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"

export default class BasicThree {

    constructor(domElement, type) {
        BasicThree.renderer = new THREE.WebGLRenderer({
            alpha: true,
            premultipliedAlpha: false,
        })
        BasicThree.renderer.outputEncoding = THREE.sRGBEncoding

        this.type = type
        this.animationRequest;
        this.renderRequest

        this.object;
        this.geometry

        this.domElement = domElement;
        this.domElement.appendChild(BasicThree.renderer.domElement)

        //scene
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            25,
            window.innerWidth / window.innerHeight,
            0.02,
            1300
        )
        this.material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            // color:"#0000FF"
        });

        this.controls = new OrbitControls(this.camera, BasicThree.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.maxDistance = 1000
        window.addEventListener('resize', () => this.updateSize(), false);


    }

    update() {
        this.controls.update()
    }

    render = () => {
        this.renderRequest = requestAnimationFrame(this.render)
        if (document.getElementById("currentPage").innerHTML == this.type) {
            BasicThree.renderer.render(this.scene, this.camera)
        }
    }

    updateSize() {
        BasicThree.renderer.setSize(this.domElement.getBoundingClientRect().width, this.domElement.getBoundingClientRect().height)
        this.camera.aspect = BasicThree.renderer.domElement.width / BasicThree.renderer.domElement.height;
        this.camera.updateProjectionMatrix();
    }

    reset() {
        this.scene.remove(this.object)
        this.object = undefined
        BasicThree.renderer.clear();
    }

}