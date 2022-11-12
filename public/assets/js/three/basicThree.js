import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import {
    PLYLoader
} from 'three/examples/jsm/loaders/PLYLoader.js'
export default class BasicThree {
    constructor() {
        this.object;

         //scene
         this.scene = new THREE.Scene()
         // this.scene.add(new THREE.AxesHelper(5))
         //lights
         const light = new THREE.SpotLight()
         const ambientLight = new THREE.AmbientLight(0x404040);
         ambientLight.intensity = 10;
         light.position.set(20, 20, 20)
         const directionalLight = new THREE.DirectionalLight(0xf0f0f0,  0.4,);
         directionalLight.position.set(-75,280, 150);
        directionalLight.visible = true;

         this.scene.add(light)
         this.scene.add(ambientLight)
         this.scene.add(directionalLight)
 
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
         this.renderer.setSize(window.innerWidth, window.innerHeight)

           //orbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.maxDistance = 1000

        //material
        this.material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            sizeAttenuation: true,
        });
      
    }

    import(domElement, sourcePath) {
        domElement.appendChild(this.renderer.domElement)

        const loader = new PLYLoader()
        loader.load(
           sourcePath,
            (geometry) => {
                geometry.computeVertexNormals()
                this.object = new THREE.Points(geometry, this.material);
                this.scene.add(this.object)
                this.updateSize()
                this.animate()
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
        window.addEventListener('resize', () => this.updateSize(this.renderer), false);
    }
    animate = () => {
        this.animationRequest = requestAnimationFrame(this.animate);
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    }

    updateSize() {
        this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera.updateProjectionMatrix();
    }

    stopAnimation =()=>{
        cancelAnimationFrame(this.animationRequest)
    }
}