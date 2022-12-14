import SariraGenerationSound from '../../sound/SariraGenerationSound.js';
import {
    Buffer
} from './Buffer.js';
import {
    Sarira
} from './Sarira.js';
import {
    Microplastic
} from './Microplastic.js';



class BodySystem {

    constructor(index = 0, worldThree, window = false) {
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
        this.window = window
        this.tempPos = [0, 0, 0]

        if (this.window) {
            this.generationSound = new SariraGenerationSound()
            this.generationSound.setup();
        }

    }

    setPosition(positionList) {

        if (this.window == false) {
            this.sarira.updateVerticesFromLife(positionList) //microplastic.movewithlife
        }
        // else if (this.isUser){
        //     console.log(this.sarira.plasticList.length)
        // }
        this.sarira.updateConvexAll()
    }

    createBuffer(material) {
        this.floatingBuffer = new Buffer()
        this.particleMaterial = material;
        this.floatingBuffer.initialize(this.particleMaterial)
        //디버깅용으로 일단 켜두기 
        // this.floatingBuffer.render(this.threeSystem)

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

        if (this.window) {
            this.generationSound.play()
        }
    }


    addFloatingPlastics(positionList, d3Dataset) {
        this.floatingBuffer.dispose()
        this.floatingPlasticsList = []
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
                this.sarira.addPlastics(micro)

                if (this.window) {
                    //only does once


                    let sariraSize = this.sariraBuffer.getBoundingBox()
                    let microCount = this.sarira.getPlasticList().length;
                    // console.log(sariraSize)

                    this.generationSound.setFeedbackDelay(microCount)
                    this.generationSound.setFrequency_PitchShift(sariraSize.width, sariraSize.height)
                    this.generationSound.setFreeverb(sariraSize.depth)
                }

                micro.updateBuffer(this.sariraBuffer.getBufferGeometry(), this.sarira.getPlasticListLength())
                micro.switch(this.floatingBuffer.getBufferGeometry(), index, this.floatingPlasticsList)

                this.sarira.initializeConvex() //이미 초기화했으면 알아서 넘어감 

            }
        }
    }
    unload(){
        if(this.window){
            this.generationSound.dispose()
        }
    }
}

export {
    BodySystem
}