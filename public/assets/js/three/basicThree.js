import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    OrbitControls
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"
import {
    PLYLoader
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js"
export default class BasicThree {
    constructor() {
        this.object;
        this.originalArray
        this.selectedArray = []
        this.domElement;

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

        //renderer
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.outputEncoding = THREE.sRGBEncoding
        //orbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.maxDistance = 1000

        //material
        this.material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
        });

    }

    import = (domElement, sourcePath, isSpread) => {
      this.reset()
        this.spread= isSpread
        if(isSpread){
            //약간 멀미남
            // this.controls.autoRotate=true;
            // this.controls.autoRotateSpeed=0.1
        }
        this.domElement=domElement;

        let modelLength;
        this.domElement.appendChild(this.renderer.domElement)
        this.renderer.setSize(this.domElement.getBoundingClientRect().width,this.domElement.getBoundingClientRect().height)
        const loader = new PLYLoader()
        loader.load(
            sourcePath,
            (geometry) => {
                geometry.computeBoundingBox()
                modelLength = geometry.boundingBox.max.y
                this.originalArray = new Array(geometry.attributes.position.count)
                for (let i = 0; i < this.originalArray.length; i++) {
                    this.originalArray[i] = i;
                }
                
                this.object = new THREE.Points(geometry, this.material);
                this.scene.add(this.object)
                this.updateSize()
            
                this.animate()
                this.camera.position.set(0, 0, 150 + modelLength * 5)
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                // console.log(error)
            }
        )
        window.addEventListener('resize', () => this.updateSize(), false);
       // console.log(this.scene)
    }
    animate = () => {
      
        this.animationRequest = requestAnimationFrame(this.animate);
        this.controls.update()
        this.renderer.render(this.scene, this.camera)

        if (this.spread) {
            this.setObjectPosition()
            
        }
    }

    updateSize() {
        this.renderer.setSize(this.domElement.getBoundingClientRect().width,this.domElement.getBoundingClientRect().height)
        this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
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