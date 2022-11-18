import {
    SariraThree
} from '../three/SpecificThree.js';

export default class SariraThreeController {
    constructor(canvas, type, renderer) {
        this.canvas = canvas
        this.type = type
        this.sariraThreeList = []
        this.renderer = renderer

    }
    create(num, data, element) {
        for (let i = 0; i < num; i++) {
            let sariraThree = new SariraThree(this.canvas, this.type, this.renderer)
            sariraThree.import(JSON.parse(data[i].message).vertices)
            sariraThree.setElement(element[i])
            this.sariraThreeList.push(sariraThree.getObject())
        }
    }

    render = () => {
        this.renderRequest = requestAnimationFrame(this.render)
        let renderer = this.renderer.getRenderer()
        if (document.getElementById("currentPage").innerHTML == this.type) {
            let width = this.canvas.clientWidth;
            let height = this.canvas.clientHeight;

            if (this.canvas.width !== width || this.canvas.height != height) {
                renderer.setSize(width, height, false);
            }
            renderer.setClearColor(0x000000, 0);
            renderer.setScissorTest(false);
            renderer.clear();
            renderer.setClearColor(0x0000FF);
            renderer.setScissorTest(true);

            let canvas = this.canvas

            this.sariraThreeList.forEach(function (scene) {
                let element = scene.element;
                let rect = element.getBoundingClientRect();

                if (rect.bottom < 0 || rect.top > +renderer.domElement.getBoundingClientRect().bottom ||
                    rect.right < 0 || rect.left > renderer.domElement.clientWidth) {
                      console.log(rect.bottom)
                    return; // it's off screen

                }
                let width1 = rect.right - rect.left;
                let height1 = rect.bottom - rect.top;
                let left = rect.left - canvas.getBoundingClientRect().left - document.getElementById("main-container").getBoundingClientRect().left
                let bottom = renderer.domElement.getBoundingClientRect().bottom - rect.bottom;

                renderer.setViewport(left, bottom, width1, height1);
                renderer.setScissor(left, bottom, width1, height1);
                renderer.render(scene.scene, scene.camera)
            })
        }
    }
}