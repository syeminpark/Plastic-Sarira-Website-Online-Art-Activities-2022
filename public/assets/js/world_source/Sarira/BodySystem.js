import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { Buffer } from './Buffer.js';
import { Sarira } from './Sarira.js';
import { Microplastic } from './Microplastic.js';

class BodySystem {

    constructor(index = 0, worldThree) {
        index == 0 ? this.isUser = true : this.isUser = false;
        // isWorld == true ? this.threeSystem = threeSystemController.worldThreeSystem : this.threeSystem = threeSystemController.sariraThreeSystem;
        // this.threeSystem.element == document.querySelector("#sarira") ? this.isWindow = true : this.isWindow = false

        this.threeSystem = worldThree

        this.floatingPlasticsList = new Array(0);

        this.sarira;
        this.floatingBuffer;
        this.sariraBuffer;
        this.particleMaterial;
        this.convexMaterial;
        
        
    }

    setPosition(positionList) {
        this.sarira.updateVerticesFromLife(positionList) //microplastic.movewithlife
        this.sarira.updateConvexAll()
    }

    createBuffer(material) {
        this.floatingBuffer = new Buffer()
        this.particleMaterial = material;
        this.floatingBuffer.initialize(this.particleMaterial)
        this.floatingBuffer.render(this.threeSystem)

        this.sariraBuffer = new Buffer()
        this.sariraBuffer.initialize(this.particleMaterial)
        this.sariraBuffer.render(this.threeSystem)
    }

    createSarira(convexMaterial) {
        this.convexMaterial = convexMaterial
        this.sarira = new Sarira(this.threeSystem, this.particleMaterial, this.convexMaterial, this.sariraBuffer.getBufferGeometry(), )
        this.sarira.initializeCore()
    }

    update() {
        this.moveFloatingPlastics()
        this.updateSarira() //micro.getposition-microupdateBuffer-micro.switch
        this.sarira.setPosition()
    }

    addFloatingPlastics(positionList) {
        let tempMicro = new Microplastic(this.threeSystem)
        tempMicro.initialize(positionList)
       
        this.floatingPlasticsList.push(tempMicro)
        tempMicro.updateBuffer(this.floatingBuffer.getBufferGeometry(), this.floatingPlasticsList.length)
    }

    moveFloatingPlastics() {
        for (let [index, micro] of this.floatingPlasticsList.entries()) {
            let force = this.sarira.plasticList[0].attract(micro);
     
            micro.applyForce(force);
            micro.walk(this.floatingBuffer.getBufferGeometry(), index)
            micro.setPosition(this.floatingBuffer.getBufferGeometry(), index);
        }
    }

    updateSarira() {
        for (let [index, micro] of this.floatingPlasticsList.entries()) {
            if (micro.checkStuck(this.sarira.getPlasticList())) {
                console.log(micro.getPositionVector())
                this.sarira.addPlastics(micro)
                
                // micro.getPosition(this.floatingBuffer.bufferGeometry, index)
                micro.updateBuffer(this.sariraBuffer.getBufferGeometry(), this.sarira.getPlasticListLength())
                micro.switch(this.floatingBuffer.getBufferGeometry(), index, this.floatingPlasticsList)

                if (this.isUser) {
                    this.sarira.updateConvex(micro)
                    this.sarira.updateConvexAll()
                }
                this.sarira.initializeConvex()
            }
        }
    }
}

export {BodySystem}