import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {
    OrbitControls
} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"

export default class BasicThree {

    constructor(canvas,renderer, type,isDetail) {
        this.canvas = canvas
        this.type = type
        this.isDetail=isDetail
        this.renderer=renderer

        this.animationRequest;
        this.renderRequest
        this.object;
        this.geometry

        //scene
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            25,
           1,
            0.02,
            1300
        )
        this.material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            // color:"#0000FF"
        });
       
        this.renderer.appendToCanvas(this.canvas)
       
        this.controls = new OrbitControls(this.camera,this.renderer.getDomElement())
        this.controls.enableDamping = true
        this.controls.maxDistance = 1000
    }

    update() {
        this.controls.update()
    }

    render = () => {
        this.renderRequest = requestAnimationFrame(this.render)
        if(this.valid()){

            this.renderer.render(this.scene, this.camera)
            
        }
    }

    reset() {
        this.scene.remove(this.object)
        this.object = undefined
        this.renderer.clear();
    }

    valid(){
        if (document.getElementById("currentPage").innerHTML == this.type) {
            if(this.isDetail){
                if(!document.getElementById("currentPage").classList.contains('detail_inactive')){
                    return true
                }
            }
            else{
                if(document.getElementById("currentPage").classList.contains('detail_inactive')){
                    return true;
                }
            }
        }
    }
}