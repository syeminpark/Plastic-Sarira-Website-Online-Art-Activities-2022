
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    OrbitControls
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"

export default class BasicThree {
    constructor(renderer, type, isDetail) {
        this.group = new THREE.Group()
        //scen
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
        this.camera.position.set(0, 0, 5)

        this.controls = new OrbitControls(this.camera, this.renderer.getDomElement())

        this.controls.enableDamping = true
        this.controls.maxDistance = 1000
        this.controls.enablePan = false;

        this.scene.add(this.group)
        this.groupNames = []

        window.addEventListener('resize', () => this.updateSize(), false)

    }
    addToGroupList(name) {
        this.groupNames.push(name)
    }

    setup(canvas) {
        this.canvas = canvas
        this.renderer.appendToCanvas(this.canvas)
        this.reset()
        this.controls.reset()
         this.groupNames=[]

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

    updateSize() {}
    animate() {}

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

    reset() {
        this.scene.traverse((child) => {
        
            if (child.type == 'Group') {

                for (let i = 0; i < child.children.length; i++) {
                    const mesh = child.children[i];
                    mesh.geometry.dispose()
                    mesh.material.dispose();
                    this.scene.remove(mesh)
                }
                child.clear()
            }

            for (let groupName of this.groupNames) {
                console.log('g',groupName)
                let selectedObject = this.scene.getObjectByName(groupName);
                this.scene.remove(selectedObject)
            }
        
        })
        this.renderer.clear();

    }
    //item=mesh 
    addToGroup(item) {
        this.group.add(item)
    }
    removeFromGroup(mesh) {
        let geometry = mesh.geometry;
        let material = mesh.material;
        this.group.remove(mesh);

        geometry.dispose();
        material.dispose();

        // console.log(this.renderer.renderer.info)
    }
    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z)
    }
}