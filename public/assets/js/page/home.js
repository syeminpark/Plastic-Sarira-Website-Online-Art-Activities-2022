import {
    Page12345
} from './page.js';

import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import {
    PLYLoader
} from 'three/examples/jsm/loaders/PLYLoader.js'

class Home12345 extends Page12345 {
    constructor(_pagelayer) {
        super();
        this.pagelayer = _pagelayer
        
        this.animationRequest;
        this.camera;
        this.scene;
        this.renderer;
    }

    setup() {
        this.scene = new THREE.Scene()
        // this.scene.add(new THREE.AxesHelper(5))

        const light = new THREE.SpotLight()
        const ambientLight = new THREE.AmbientLight(0x404040);
        ambientLight.intensity = 10;
        light.position.set(20, 20, 20)
        this.scene.add(light)
        this.scene.add(ambientLight)

        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.02,
            1300
        )
        this.camera.position.set(0, 0, 400)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.getElementById('home').appendChild(this.renderer.domElement)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true

        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            sizeAttenuation: true,
        });

        const loader = new PLYLoader()
        loader.load(
            './assets/3dmodel/Bangameori/1.ply',
            (geometry) => {
                console.log(geometry)
                geometry.computeVertexNormals()
                const object = new THREE.Points(geometry, material);
              
                this.scene.add(object)
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
        this.animationRequest= requestAnimationFrame(this.animate);
        console.log("animateion")
        this.controls.update()
        this.controls.maxDistance=1000
        this.renderer.render(this.scene, this.camera)
    }

    updateSize() {
        // Update camera aspect ratio with window aspect ratio
        this.camera.aspect =  this.renderer.domElement.width /  this.renderer.domElement.height;
    
        // Always call updateProjectionMatrix on camera change
        this.camera.updateProjectionMatrix();
      }

     reset_page = () => {
        super.reset_page()
        cancelAnimationFrame(this.animationRequest)
      }
}

export {
    Home12345
}