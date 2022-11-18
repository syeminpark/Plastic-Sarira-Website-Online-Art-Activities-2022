import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
export default class SingleRenderer {
    constructor() {

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            premultipliedAlpha: false,
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
    }

    scissorRender(object) {
        console.log(object)
        let canvas = object.canvas
        let _element = object.element
        let scene = object.scene
        let camera = object.camera

        let width = canvas.clientWidth;
        let height = canvas.clientHeight;

        if (canvas.width !== width || canvas.height != height) {
            this.renderer.setSize(width, height, false);
        }

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setScissorTest(false);
        this.renderer.clear();
        this.renderer.setClearColor(0x0000FF);
        this.renderer.setScissorTest(true);

        let renderer = this.renderer

        // scenes.forEach(function (scene) {
        let element = _element;
        let rect = element.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
            rect.right < 0 || rect.left > renderer.domElement.clientWidth) {
            return; // it's off screen

        }
        let width1 = rect.right - rect.left;
        let height1 = rect.bottom - rect.top;
        let left = rect.left - canvas.getBoundingClientRect().left - document.getElementById("main-container").getBoundingClientRect().left
        let bottom = renderer.domElement.getBoundingClientRect().bottom - rect.bottom;


        renderer.setViewport(left, bottom, width1, height1);
        renderer.setScissor(left, bottom, width1, height1);
        renderer.render(scene, camera)
        // })

    }

}