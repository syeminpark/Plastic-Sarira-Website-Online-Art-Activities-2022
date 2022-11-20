import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

// 렌더러를 공유할수 있도록 함
// 메뉴 바뀔 때 마다 비우고 다시 그림
export default class SingleRenderer {
    constructor() {

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            premultipliedAlpha: false,
            antialias: true
        })
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.currentCanvas;
    }


    appendToCanvas(canvas) {
        canvas.appendChild(this.renderer.domElement)
        this.currentCanvas = canvas
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
        this.renderer.dispose()

    }

    getCurrentCanvas() {
        return this.currentCanvas
    }
}