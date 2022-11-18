import {
    PLYLoader
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js"
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

import BasicThree from "./basicThree.js"

export default class PointThree extends BasicThree {
    constructor(domElement, type) {
        super(domElement,type)
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
        if (document.getElementById("currentPage").innerHTML ==this.type) {
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
    constructor(domElement,type) {
        super(domElement,type)
        this.scenes = []
        this.virtualCanvas

    }

    import(data) {
       
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
        this.geometry.computeBoundingBox()

        this.object = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.object)
        this.scenes.push(this.scene)
        this.camera.position.set(0, 0, 100)

        this.updateSize()
        this.animate()


    }

    setVirtualCanvas(virtualCanvas) {
        this.virtualCanvas = virtualCanvas
    }

    render = () => {
        this.renderRequest = requestAnimationFrame(this.render)
     
        if (document.getElementById("currentPage").innerHTML ==this.type) {
        
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
            const virtualCanvasRect = this.virtualCanvas.getBoundingClientRect()
            if (virtualCanvasRect.bottom < 0 || virtualCanvasRect.top > BasicThree.renderer.domElement.clientHeight ||
                virtualCanvasRect.right < 0 || virtualCanvasRect.left > BasicThree.renderer.domElement.clientWidth) {
                return; // it's off screen
            }

            let width = virtualCanvasRect.right - virtualCanvasRect.left;
            let height = virtualCanvasRect.bottom - virtualCanvasRect.top;
            let left = virtualCanvasRect.left - this.domElement.getBoundingClientRect().left - document.getElementById("main-container").getBoundingClientRect().left
            let bottom = BasicThree.renderer.domElement.getBoundingClientRect().bottom - virtualCanvasRect.bottom


             BasicThree.renderer.setViewport(left, bottom, width, height);
            BasicThree.renderer.setScissor(left, bottom, width, height);
            BasicThree.renderer.render(this.scene, this.camera)

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

}