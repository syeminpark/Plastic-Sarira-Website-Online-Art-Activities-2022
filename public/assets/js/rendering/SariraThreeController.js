 import {
     SariraThree
 } from '../rendering/SpecificThree.js';
 import config from '../utils/config.js';

 export default class SariraThreeController {
     constructor(renderer, type, isDetail, total) {
         this.isDetail = isDetail
         this.type = type
         this.renderer = renderer
         this.sariraObject = []
         this.sariraThreeList = []

     }
     setMaterial(pointMaterial, sariraMaterial) {
         this.pointMaterial = pointMaterial
         this.sariraMaterial = sariraMaterial
     }

     setup(canvas, sariraTotalCount) {
         this.sariraObject = []

         this.renderer.clear()
         this.canvas = canvas

         for (let i = 0; i < sariraTotalCount; i++) {
             let sariraThree = new SariraThree(this.renderer, this.type, false)
             sariraThree.setup(this.canvas)
             sariraThree.animate()

             this.sariraThreeList.push(sariraThree)
         }

     }

     create(index, range, data, element) {

         for (let i = index * range; i < (index + 1) * range; i++) {
             if (this.sariraThreeList[i] && data[i]) {
                 this.sariraThreeList[i].setMaterial(this.pointMaterial, this.sariraMaterial)
                 this.sariraThreeList[i].setElement(element[i])
                 this.sariraThreeList[i].import(JSON.parse(data[i].message).vertices)
                 this.sariraObject.push(this.sariraThreeList[i].getObject())
             }
         }
     }

     render = () => {
         requestAnimationFrame(this.render)
         if (this.sariraObject.length != 0) {
             if (this.valid()) {
                 this.checkCanvas()
                 this.rendererResizeMobile();

                 let renderer = this.renderer.getRenderer()
                 renderer.setClearColor(0x000000, 0);
                 renderer.setScissorTest(false);

                 renderer.setClearColor(0x000000, 1);
                 renderer.setScissorTest(true);

                 let canvas = this.canvas

                 this.sariraObject.forEach(function (scene) {
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
     }

     rendererResizeMobile() {
         let renderer = this.renderer.getRenderer()
         let width = renderer.domElement.clientWidth;
         let height = renderer.domElement.clientHeight;

         if (this.canvas.offsetWidth != width || this.canvas.offsetHeight != height) {
             renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight)
         }
     }

     checkCanvas() {
         if (this.renderer.getCurrentCanvas() != this.canvas) {

             this.renderer.appendToCanvas(this.canvas)
             this.renderer.setSize(this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().height)
             for (let sariraThree of this.sariraThreeList) {
                 sariraThree.resetControls(15)
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