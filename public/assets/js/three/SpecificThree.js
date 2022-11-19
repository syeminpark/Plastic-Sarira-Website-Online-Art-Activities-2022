import {
    PLYLoader
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js"
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    createConvexMaterial,
    createPointMaterial
} from './material.js';
import Convex from './Convex.js';
import BasicThree from "./basicThree.js"

export default class PointThree extends BasicThree {
    constructor(canvas,  renderer,type, isDetail) {
        super(canvas, renderer,type, isDetail)
        this.originalArray = []
        this.selectedArray = []
        window.addEventListener('resize', () => this.updateSize(), false);
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

    updateSize =()=> {
        this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
        this.camera.aspect = this.renderer.getDomElement().width / this.renderer.getDomElement().height;
        this.camera.updateProjectionMatrix();
    }
}

export class SariraThree extends BasicThree {
    constructor(canvas,  renderer,type, isDetail) {
        super(canvas, renderer, type, isDetail)
        this.convex

        let ambientLight = new THREE.AmbientLight(0xffffff, 1);
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff,5);
        this.scene.add(ambientLight,  hemiLight, );
    }

    import(data) {
        this.reset()
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
        this.geometry.computeBoundingBox()
        this.object = new THREE.Points(this.geometry, createPointMaterial());
        this.scene.add(this.object)
        if (data.length > 9) {
            let object = {
                scene: this.scene
            }
            this.convex = new Convex(object, createConvexMaterial())
            this.convex.updateVertices(this.geometry, data.length)
            this.convex.initializeMesh()
        }
        this.camera.position.set(0, 0, 10 + this.geometry.boundingBox.max.y * 5)

        this.updateSize()
        this.animate()
    }

    setElement(element) {
        this.element = element
    }
    setCanvas(canvas){
        this.canvas=canvas
    }
    updateSize(){
        this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
        this.camera.aspect = 1
        this.camera.updateProjectionMatrix();
    }

    animate = () => {
        this.animationRequest = requestAnimationFrame(this.animate);
        this.scene.rotation.y = Date.now() * 0.0001;
        if (document.getElementById("currentPage").innerHTML == this.type) {
            this.update();
        }
    }

    reset() {
        super.reset()
        cancelAnimationFrame(this.animationRequest)
        cancelAnimationFrame(this.renderRequest)
    }

  
    getObject() {
        return {
            scene: this.scene,
            element: this.element,
            camera: this.camera
        }
    }

}