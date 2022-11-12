import {
    setgroups
} from "process";

export default class BasicThree {
    constructor(domElementID,sourcePath) {

        this.animationRequest;
        this.camera;
        this.scene;
        this.renderer;
        this.object;
        this.animationRequest
        this.domElementID=domElementID;
        if(this.domElementID=="home"){
            this.sourcePath=this.getRandomSourcePath();
        }
        else{
            this.sourcePath=sourcePath
        }
    }

    setup() {
        //scene
        this.scene = new THREE.Scene()
        //lights
        const light = new THREE.SpotLight()
        const ambientLight = new THREE.AmbientLight(0x404040);
        ambientLight.intensity = 10;
        light.position.set(20, 20, 20)
        this.scene.add(light)
        this.scene.add(ambientLight)

        //camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.02,
            1300
        )
        this.camera.position.set(0, 0, 400)

        //renderer
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.getElementById(this.domElement).appendChild(this.renderer.domElement)

        //orbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.maxDistance = 1000

        //material
        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            sizeAttenuation: true,
        });

        const loader = new PLYLoader()
        loader.load(
            './assets/3dmodel/Bangameori/1.ply',
            (geometry) => {
                geometry.computeVertexNormals()
                this.object = new THREE.Points(geometry, material);
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
        console.log("animateion")
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    }

    updateSize() {
        this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera.updateProjectionMatrix();
    }

    reset_page = () => {
        super.reset_page()
        cancelAnimationFrame(this.animationRequest)
    }

    getRandomSourcePath(){
    
    }
}