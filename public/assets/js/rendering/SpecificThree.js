import {
    PLYLoader
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js"
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import { OrbitControls } from '/assets/js/utils/OrbitControls.js';

import Convex from '../world_source/Sarira/Convex.js';
import BasicThree from "./basicThree.js"
import waste_plastic_dataset from "../utils/waste_plastic_dataset.js";


export default class PointThree extends BasicThree {
    constructor(renderer, type, isDetail) {
        super(renderer, type, isDetail)

        this.material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            // color:"#0000FF"
        })
    }
    setup(canvas) {
        super.setup(canvas);
        this.originalArray = []
        this.selectedArray = []
        this.object = undefined;
    }

    import = (path) => {
        new PLYLoader().load(
            path, (geometry) => {
                geometry.computeBoundingBox()

                this.originalArray = new Array(geometry.attributes.position.count)
                for (let i = 0; i < this.originalArray.length; i++) {
                    this.originalArray[i] = i;
                }
       
                this.object = new THREE.Points(geometry, this.material);
                this.group.add(this.object)
                this.camera.position.set(0, 0, 180 + geometry.boundingBox.max.y * 5)
                this.updateSize()
            })

    }
    animate = () => {
        requestAnimationFrame(this.animate);
        if (this.object != undefined) {
            if (document.getElementById("currentPage").innerHTML == this.type) {
                if (this.valid()) {
                    this.update()
                    if (this.type == "home") {
                        this.setObjectPosition()
                    }
                }
            }
        }
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

    updateSize() {
        if (this.canvas != undefined) {
            this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
            this.camera.aspect = this.renderer.getDomElement().width / this.renderer.getDomElement().height;
            this.camera.updateProjectionMatrix();
        }
    }
}

////////////////////////////////////////////
export class SariraThree extends BasicThree {

    constructor(renderer, type, isDetail) {
        super(renderer, type, isDetail)
        this.convex = undefined
        this.object = undefined
        this.loaded=false

        let ambientLight = new THREE.AmbientLight(0xffffff, 30);
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 10);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 10);
        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 10);
        directionalLight.position.set(-10, 0, 0);
        directionalLight2.position.set(0, 10, 0);
        directionalLight3.position.set(10, -10, 0);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight2.target.position.set(0, 0, 0);
        directionalLight3.target.position.set(0, 0, 0);
        this.scene.add(ambientLight, hemiLight, directionalLight, directionalLight2, directionalLight3);

    }

    setMaterial(pointMaterial, sariraMaterial) {
        this.pointMaterial = pointMaterial
        this.sariraMaterial = sariraMaterial
    }

    import(data) {
      
        const geometry = new THREE.BufferGeometry();
        let meshes = []
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
        geometry.computeBoundingBox()
        this.object = new THREE.Points(geometry, this.pointMaterial);
        this.group.add(this.object)

        if (data.length > 9 ) {
            
            this.convex = new Convex(this, this.sariraMaterial)
            this.convex.updateVertices(geometry, data.length)
            this.convex.initializeMesh()
        }

        this.camera.position.set(0, 0, 15 + geometry.boundingBox.max.y * 5)
        this.updateSize()
    }

    setElement(element) {
        this.element = element
    }

    resetControls(distance) {
        if (this.object != undefined) {
            this.camera.position.set(0, 0, distance + this.object.geometry.boundingBox.max.y * 5)
            this.camera.updateProjectionMatrix();
        }
    }

    updateSize() {
        if (this.valid()) {
            if (this.canvas != undefined) {
                this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
                if (!document.getElementById("currentPage").classList.contains('detail_inactive')) {
                    this.camera.aspect = this.renderer.getDomElement().width / this.renderer.getDomElement().height
                    this.camera.updateProjectionMatrix();
                    console.log(this.canvas, "change")
                }
            }
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if (this.object != undefined) {
            if (this.valid()) {
                this.scene.rotation.y = Date.now() * 0.0001;
                if (document.getElementById("currentPage").innerHTML == this.type) {
                    this.update();
                }
            }
        }

    }
    getObject() {
        return {
            scene: this.scene,
            element: this.element,
            camera: this.camera
        }
    }

}


/////////////////////////////////////////////////////
export class WorldThree extends BasicThree {
    constructor(renderer, type, isDetail) {
        super(renderer, type, isDetail);
        this.camera.fov = 75

        this.controls.dispose();
        this.controls = new OrbitControls(this.camera, this.renderer.getDomElement())

        this.controls.enableDamping = true
        this.controls.enablePan = false;

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
     
        this.scene.add(ambientLight, hemiLight, );
    }

    render = () => {
        if (this.valid()) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    updateSize() {
        if (this.canvas != undefined) {
            this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
            this.camera.aspect = this.renderer.getDomElement().width / this.renderer.getDomElement().height;
            this.camera.updateProjectionMatrix();
        }
    }

    import(randomSource, lambda1, addToSlider, reorganize) {
        new PLYLoader().load(
            randomSource.path,
            function (bufferGeometry) {
                //if the model has importe d 
                if (lambda1(randomSource.beach, randomSource.index, bufferGeometry)) {
                    //import 

                    let object = {
                        "img_src": waste_plastic_dataset.getImagePath(randomSource.beach, randomSource.index),
                        "id": waste_plastic_dataset.getID(randomSource.beach, randomSource.index)
                    }

                    addToSlider(object)
                    reorganize()
                }
                bufferGeometry.dispose()
            })
    }

    

}

export class miniSariraThree extends BasicThree {
    constructor(renderer, type, isDetail) {
        super(renderer, type, isDetail)

        this.camera.fov = 75

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight,);

        this.selectedCheckDOM = undefined;
    }

    setup(canvas, selectedCheckDOM) {
        super.setup(canvas)
        this.selectedCheckDOM = selectedCheckDOM;
        this.updateSize()
    }


    updateSize() {
        if (this.canvas != undefined) {
            this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
            this.camera.aspect = this.renderer.getDomElement().width / this.renderer.getDomElement().height;
            this.camera.updateProjectionMatrix();

        }
    }

    switchDom(canvas, selectedCheckDOM) {
        this.canvas = canvas
        this.renderer.appendToCanvas(this.canvas)
        this.updateSize()
        this.selectedCheckDOM = selectedCheckDOM
    }


    render = () => {
        requestAnimationFrame(this.render)
        if (this.valid()) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if (this.valid()) {
            this.update();
        }
    }

    valid() {
        if (this.selectedCheckDOM != undefined) {
            if (document.getElementById("currentPage").innerHTML == this.type) {
                if (!this.selectedCheckDOM.classList.contains('inactive')) {
                    return true;
                }
            }
        }
    }
    


}