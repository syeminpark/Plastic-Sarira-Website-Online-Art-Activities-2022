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
            sariraThree.setElement(element[i])

            sariraThree.import(JSON.parse(data[i].message).vertices)

            this.sariraThreeList.push(sariraThree.getObject())
        }

    }

    render = () => {
        this.renderRequest = requestAnimationFrame(this.render)
        
        if (document.getElementById("currentPage").innerHTML == this.type) {
            let renderer = this.renderer.getRenderer()
            let width = renderer.domElement.clientWidth;
            let height = renderer.domElement.clientHeight;

            if (this.canvas.getBoundingClientRect().width !== width || this.canvas.getBoundingClientRect().height != height) {
                renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height, false);
                console.log(this.canvas.getBoundingClientRect().width,this.canvas.getBoundingClientRect().height)
            }

            renderer.setClearColor(0x000000, 0);
            renderer.setScissorTest(false);
          
            renderer.setClearColor(0x000000,);
            renderer.setScissorTest(true);

            let canvas = this.canvas

            
            this.sariraThreeList.forEach(function (scene) {

                if(scene.element==undefined){
                    window.location.reload();
                }

                scene.scene.rotation.y = Date.now() * 0.0001;
                let element = scene.element;
                let rect = element.getBoundingClientRect();

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
}