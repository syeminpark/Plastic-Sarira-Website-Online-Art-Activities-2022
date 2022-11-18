import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    OrbitControls
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"
import {
    PLYLoader
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js"

export default class BasicThree {

    constructor(domElement, type) {

        BasicThree.renderer = new THREE.WebGLRenderer({alpha: true,premultipliedAlpha: false,})
        BasicThree.renderer.domElement.setAttribute('id','canvas'); 
        BasicThree.renderer.outputEncoding = THREE.sRGBEncoding
        this.object;
        this.geometry
        this.originalArray = []
        this.selectedArray = []
        this.domElement = domElement;
        this.type = type
        this.scenes = []
        this.window=document.getElementById('main-container')

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
            //vertexColors: true,
            color:"#0000FF"
        });
        //orbitControls
        this.controls = new OrbitControls(this.camera, BasicThree.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.maxDistance = 1000
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    import = (data, rect) => {
        this.reset()
       this.domElement.appendChild(BasicThree.renderer.domElement)
        console.log(this.domElement,document.body)
        //BasicThree.renderer.setSize(this.domElement.getBoundingClientRect().width, this.domElement.getBoundingClientRect().height)
        BasicThree.renderer.setClearColor("#FF0000");

        switch (this.type) {
            case "PLASTIC_SARIRA_ARCHIVE":
                this.geometry = new THREE.BufferGeometry();
                this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
                this.geometry.computeBoundingBox()
               
                this.object = new THREE.Points(this.geometry, this.material);
                this.scene.add(this.object)
                this.scenes.push(this.scene)
                this.camera.position.set(0, 0, 100)
                this.rect = rect
                this.updateSize()
                this.animate()
                this.render()
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
                        this.scenes.push(this.scene)
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
        //BasicThree.renderer.render(this.scene, this.camera)

        if (this.type == "HOME") {
            this.setObjectPosition()
        }
    }
    assignOffset(main){
        this.leftOffset= this.domElement.getBoundingClientRect().left - main.getBoundingClientRect().left
        this.topOffset= this.domElement.getBoundingClientRect().top-main.getBoundingClientRect().top
    }

    render = () => {
        requestAnimationFrame(this.render)

        let width1 = this.domElement.clientWidth;
        let height1 = this.domElement.clientHeight;

        if ( this.domElement.offsetWidth !== width1 || this.domElement.offsetHeight != height1) {
            BasicThree.renderer.setSize(width1, height1, false);
        }
        BasicThree.renderer.setClearColor(0x000000,0);
        BasicThree.renderer.setScissorTest(false);
        BasicThree.renderer.clear();
        BasicThree.renderer.setClearColor(0x0000FF);
        BasicThree.renderer.setScissorTest(true);


        //     //scene.rotation.y = Date.now() * 0.001;
        this.rect2=this.rect.getBoundingClientRect()
            if (this.rect2.bottom < 0 || this.rect2.top >  BasicThree.renderer.domElement.clientHeight ||
                this.rect2.right < 0 || this.rect2.left >   BasicThree.renderer.domElement.clientWidth) {
               console.log("bye")
                return; // it's off screen
            }

        let width = this.rect2.right - this.rect2.left;
        let height = this.rect2.bottom - this.rect2.top;
        let left = this.rect2.left- this.domElement.getBoundingClientRect().left - document.getElementById("main-container").getBoundingClientRect().left
      
        
        console.log()
        let bottom = BasicThree.renderer.domElement.getBoundingClientRect().bottom- this.rect2.bottom 


        BasicThree.renderer.setViewport(left, bottom, width, height);
        BasicThree.renderer.setScissor(left, bottom, width, height);
        BasicThree.renderer.render(this.scene, this.camera)

        // })

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