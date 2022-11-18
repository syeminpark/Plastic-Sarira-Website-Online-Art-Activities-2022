import {
    PLYLoader
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js"
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import BasicThree from "./basicThree.js"

export default class PointThree extends BasicThree {
    constructor(canvas, type, renderer) {
        super(canvas, type, renderer)
        this.originalArray = []
        this.selectedArray = []
    }

    import = (path) => {
        this.reset()

        new PLYLoader().load(
            path, (geometry) => {
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
                this.render()
            })
    }
    animate = () => {
        if (document.getElementById("currentPage").innerHTML == this.type) {
            this.update()
            if (this.type == "home") {
                this.setObjectPosition()
            }

        }
        this.animationRequest = requestAnimationFrame(this.animate);
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
    reset() {
        super.reset()
        this.selectedArray = [];
        this.originalArray = [];
        cancelAnimationFrame(this.animationRequest)
        cancelAnimationFrame(this.renderRequest)
    }
}

export class SariraThree extends BasicThree {
    constructor(domElement, type, renderer) {
        super(domElement, type, renderer)
        this.virtualCanvas
    }

    import(data) {
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
        this.geometry.computeBoundingBox()

        this.object = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.object)
        this.camera.position.set(0, 0, 100)

        this.updateSize()
        this.animate()
    }

    setElement(element) {
        this.element = element
    }

    render = () => {
        this.renderRequest = requestAnimationFrame(this.render)
        if (document.getElementById("currentPage").innerHTML == this.type) {
            this.renderer.scissorRender(scene)
        }
    }

    animate = () => {
        this.animationRequest = requestAnimationFrame(this.animate);
        if (document.getElementById("currentPage").innerHTML == this.type) {
            this.update();
        }
    }


    reset() {
        console.log("hey!reset")
        super.reset()
        cancelAnimationFrame(this.animationRequest)
        cancelAnimationFrame(this.renderRequest)

    }

    getObject() {
        return {
            scene: this.scene,
            element:this.element,
            camera: this. camera
        }
    }

}