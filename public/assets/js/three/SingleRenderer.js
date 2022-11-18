import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
export default class SingleRenderer {
    constructor() {

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            premultipliedAlpha: false,
            antialias:true
        })
        this.renderer.outputEncoding = THREE.sRGBEncoding

    }


    appendToCanvas(canvas) {
        canvas.appendChild(this.renderer.domElement)
       
    }

    getRenderer() {
        return this.renderer
    }
    getDomElement() {
        return this.renderer.domElement
    }

    render = (scene, camera) => {
        this.renderer.render(scene, camera)
    }

    setSize = (width, height, boolean) => {
        this.renderer.setSize(width, height, boolean)
    }

    clear() {
        this.renderer.clear();
        this.renderer.setScissorTest(false);
      
    }
}