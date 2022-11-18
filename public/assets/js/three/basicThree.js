import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    OrbitControls
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"

export default class BasicThree {

    constructor(canvas, type,renderer) {
        this.canvas = canvas
        this.type = type
        this.renderer=renderer

        this.animationRequest;
        this.renderRequest

        this.object;
        this.geometry


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

        this.renderer.appendToCanvas(this.canvas)
        this.controls = new OrbitControls(this.camera,this.renderer.getDomElement())
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
            this.renderer.render(this.scene, this.camera)
        }
    }

    updateSize() {
        this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
        this.camera.aspect = this.renderer.getDomElement().width / this.renderer.getDomElement().height;
        this.camera.updateProjectionMatrix();
    }

    reset() {
        this.scene.remove(this.object)
        this.object = undefined
        this.renderer.clear();
    }

}