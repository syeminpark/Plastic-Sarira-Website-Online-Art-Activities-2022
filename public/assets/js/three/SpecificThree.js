import {
    PLYLoader
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js"
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import BasicThree from "./basicThree.js"

export default class PointThree extends BasicThree {
    constructor(domElement, type) {
        super(domElement)
        this.originalArray = []
        this.selectedArray = []
        this.type = type
        
    }

    import =(path) =>{
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
    animate= ()=> {
        this.update()

        if (this.type == "HOME") {
            this.setObjectPosition()
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
    reset(){
        super.reset()
        this.selectedArray = [];
        this.originalArray = [];
        cancelAnimationFrame(this.animationRequest)
        cancelAnimationFrame(this.renderRequest)
    }
}



export class SariraThree extends BasicThree {
    constructor() {
        super()
        this.scenes = []
    }

    import(vritaulCanvas) {
        super.reset();
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
        this.geometry.computeBoundingBox()

        this.object = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.object)
        this.scenes.push(this.scene)
        this.camera.position.set(0, 0, 100)

        this.updateSize()
        this.animate()
        this.render()

    }
    render() {
        let width1 = this.domElement.clientWidth;
        let height1 = this.domElement.clientHeight;
        //    console.log(this.rect.children[0])

        if (this.domElement.offsetWidth !== width1 || this.domElement.offsetHeight != height1) {
            BasicThree.renderer.setSize(width1, height1, false);
        }
        BasicThree.renderer.setClearColor(0x000000, 0);
        BasicThree.renderer.setScissorTest(false);
        BasicThree.renderer.clear();
        BasicThree.renderer.setClearColor(0x0000FF);
        BasicThree.renderer.setScissorTest(true);


        //     //scene.rotation.y = Date.now() * 0.001;
        this.rect2 = this.rect.getBoundingClientRect()
        if (this.rect2.bottom < 0 || this.rect2.top > BasicThree.renderer.domElement.clientHeight ||
            this.rect2.right < 0 || this.rect2.left > BasicThree.renderer.domElement.clientWidth) {
            console.log("bye")
            return; // it's off screen
        }

        let width = this.rect2.right - this.rect2.left;
        let height = this.rect2.bottom - this.rect2.top;
        let left = this.rect2.left - this.domElement.getBoundingClientRect().left - document.getElementById("main-container").getBoundingClientRect().left


        console.log()
        let bottom = BasicThree.renderer.domElement.getBoundingClientRect().bottom - this.rect2.bottom


        BasicThree.renderer.setViewport(left, bottom, width, height);
        BasicThree.renderer.setScissor(left, bottom, width, height);
        BasicThree.renderer.render(this.scene, this.camera)
    }

    animate(){
        super.update();
        this.animationRequest = requestAnimationFrame(this.animate);
    }
    
    assignOffset(main){
        this.leftOffset= this.domElement.getBoundingClientRect().left - main.getBoundingClientRect().left
        this.topOffset= this.domElement.getBoundingClientRect().top-main.getBoundingClientRect().top
    }
    reset(){
        cancelAnimationFrame(this.animationRequest)
        cancelAnimationFrame(this.renderRequest)
    }

}