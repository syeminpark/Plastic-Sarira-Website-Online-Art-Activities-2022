import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    OrbitControls
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"

export default class BasicThree {
    constructor(renderer, type, isDetail) {
        this.group= new THREE.Group()
        //scene

        this.type = type
        this.isDetail = isDetail
        this.renderer = renderer
    
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            25,
            0.8,
            0.02,
            1300
        )

        this.controls = new OrbitControls(this.camera, this.renderer.getDomElement())
        this.controls.enableDamping = true
        this.controls.maxDistance = 1000
        this.controls.enablePan = false;
        
        this.scene.add(this.group)
        window.addEventListener('resize', () => this.updateSize(), false)
    }

    setup(canvas) {
        this.canvas = canvas
        this.renderer.appendToCanvas(this.canvas)
        this.reset()
    }

    update() {
        this.controls.update()
    }

    render = () => {
        requestAnimationFrame(this.render)
        if (this.valid()) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    updateSize(){}
    animate(){}

    valid() {
        if (document.getElementById("currentPage").innerHTML == this.type) {
            if (this.isDetail) {
                if (!document.getElementById("currentPage").classList.contains('detail_inactive')) {
                    return true
                }
            } else {
              
                if (document.getElementById("currentPage").classList.contains('detail_inactive')) {
                  
                    return true;
                }
            }
        }
    }

    reset(){
            for (let i = 0; i < this.group.children.length; i++) {
                const child = this.group.children[i];
                child.geometry.dispose()    
                // child. material.dispose();
                console.log("dispose", child)     
            }

        this.group.clear()
        this.renderer.clear();
    }
    //item=mesh 
    addToGroup(item){
        this.group.add(item)
    }
    removeFromGroup(mesh){
        let geometry = mesh.geometry;
        let material = mesh.material;
        this.group.remove(mesh);

        geometry.dispose();
        material.dispose();
      
        
    }
}
