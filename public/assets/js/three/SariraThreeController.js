import {
    SariraThree
} from '../three/SpecificThree.js';

export default class SariraThreeController {
    constructor(renderer, type, isDetail) {
        this.isDetail = isDetail
        this.type = type
        this.sariraThreeList = []
        this.sariraObject =[]
        this.renderer = renderer
       
    }
    setCanvas(canvas) {
        this.canvas = canvas
    }
    create(load_index, range, data, element) {

        for (let i = load_index * range; i < (load_index + 1) * range; i++) {
            let sariraThree = new SariraThree(this.canvas, this.renderer, this.type, false)
            sariraThree.setElement(element[i])
            sariraThree.import(JSON.parse(data[i].message).vertices)
            this.sariraThreeList.push(sariraThree)
            this.sariraObject.push(sariraThree.getObject())
        }
    }

    render = () => {
        requestAnimationFrame(this.render)
        if (this.valid()) {
            this.checkCanvas()
            this.rendererResizeMobile();

            let renderer = this.renderer.getRenderer()
            renderer.setClearColor(0x000000, 0);
            renderer.setScissorTest(false);

            renderer.setClearColor(0x000000,1 );
            renderer.setScissorTest(true);

            let canvas = this.canvas

            this.sariraObject.forEach(function (scene) {
                if (scene.element == undefined) {
                    window.location.reload();
                }

                let rect = scene.element.getBoundingClientRect();

                if (rect.bottom < 0 || rect.top > +renderer.domElement.getBoundingClientRect().bottom ||
                    rect.right < 0 || rect.left > renderer.domElement.clientWidth) {
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

    rendererResizeMobile() {
        let renderer = this.renderer.getRenderer()
        let width = renderer.domElement.clientWidth;
        let height = renderer.domElement.clientHeight;

        if (this.canvas.getBoundingClientRect().width !== width || this.canvas.getBoundingClientRect().height != height) {
            renderer.setSize(renderer.domElement.clientWidth, this.canvas.getBoundingClientRect().height, false);
        }
    }
    checkCanvas() {
        if (this.renderer.getCurrentCanvas() != this.canvas) {
            this.renderer.appendToCanvas(this.canvas)
            this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
            for(let sariraThree of this.sariraThreeList){
                sariraThree.resetControls()
              console.log("reset")
            }
        }
    }

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
}