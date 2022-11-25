import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';


class Microplastic {

    //later create size and color parameter
    constructor(threeSystem, d3Dataset) {
        this.velocity = new THREE.Vector3(0, 0, 0)
        this.acceleration = new THREE.Vector3(0, 0, 0)
        this.positionVector3 = new THREE.Vector3(0, 0, 0)
        // this.color = [1, 1, 1] // [Math.random(), Math.random(), Math.random()]
        //this.size = particleMaterial.size
        this.positionList;
        this.mass = 1
        // this.mass =  this.size *2

        this.size = 0.2

        this.threeSystem = threeSystem
        this.d3Dataset = d3Dataset
    }

    initialize(positionList) {
        this.positionList = [positionList.x, positionList.y, positionList.z]
        // this.mass =  this.size *2
        this.mass = 1
    }

    applyForce(force) {
        let f = force.clone()
        f.divideScalar(this.mass);
        this.acceleration.add(f);

    }

    walk(bufferGeometry, index) {
        this.velocity.add(this.acceleration)

        bufferGeometry.attributes.position.needsUpdate = true
        bufferGeometry.attributes.position.array[index * 3] += this.velocity.x
        bufferGeometry.attributes.position.array[(index * 3) + 1] += this.velocity.y
        bufferGeometry.attributes.position.array[(index * 3) + 2] += this.velocity.z

        this.acceleration.multiplyScalar(0)
    }

    setPosition(bufferGeometry, index) {
        bufferGeometry.attributes.position.needsUpdate = true
        //  bufferGeometry.attributes.color.needsUpdate = true

        for (let i = 0; i < 3; i++) {
            this.positionList[i] = bufferGeometry.attributes.position.array[(index * 3) + i]
        }
        this.positionVector3.set(this.positionList[0], this.positionList[1], this.positionList[2])
    }

    setPositionVector(bufferGeometry, index) {
        let temp=[]
        for (let i = 0; i < 3; i++) {
            temp[i] = bufferGeometry.attributes.position.array[(index * 3) + i]
        }
        this.positionVector3.set(temp[0], temp[1], temp[2])
    }

    updateBuffer(bufferGeometry, indexLength) {
        for (let i = 0; i < 3; i++) {
            bufferGeometry.attributes.position.array[((indexLength - 1) * 3) + i] = this.positionList[i]
            //  bufferGeometry.attributes.color.array[((indexLength - 1) * 3) + i] = this.color[i]
        }
        bufferGeometry.setDrawRange(0, indexLength);
    }
    // if (!this.any_world_btn_clicked)

    // updateBuffer(bufferGeometry, indexLength) {
    //     for (let i = 0; i < 3; i++) {
    //         bufferGeometry.attributes.position.array[((indexLength - 1) * 3) + i] = this.positionList[i]
    //         //  bufferGeometry.attributes.color.array[((indexLength - 1) * 3) + i] = this.color[i]
    //     }
    //     bufferGeometry.setDrawRange(0, indexLength);
    // }

    switch (bufferGeometry, index, list) {
        let lastIndex = list.length - 1
        for (let i = 0; i < 3; i++) {
            bufferGeometry.attributes.position.array[(index * 3) + i] = bufferGeometry.attributes.position.array[(lastIndex * 3) + i]
            // bufferGeometry.attributes.color.array[(index *  3) + i] = bufferGeometry.attributes.color.array[(lastIndex * 3) + i]
        }

        for (let i = 0; i < 3; i++) {
            bufferGeometry.attributes.position.array[(lastIndex * 3) + i] = 0
            //  bufferGeometry.attributes.color.array[(lastIndex * 3) + i] = 0
        }

        list[index] = list[lastIndex]
        list.splice(lastIndex, 1)

        bufferGeometry.setDrawRange(0, lastIndex);
    }

    // checkStuck(others) {

    //     for (let i = 0; i < others.length; i++) {

    //         let d2 = this.positionVector3.distanceTo(others[i].positionVector3)
    //         if (d2 < this.size + others[i].size+1){
    //             return true
    //         }
    //     }
    //     return false
    // }

    checkStuck(others) {

        for (let i = 0; i < others.length; i++) {

            let tempVector3 = new THREE.Vector3(0, 0, 0)
            tempVector3.addVectors(this.positionVector3, others[0].positionVector3)
            let d2 = tempVector3.distanceTo(others[i].positionVector3)
        

            if (d2 < this.size + others[i].size) {

                return true
            }
        }
        return false
    }

    moveWithLife(lifePositionList, bufferGeometry, index) {
        bufferGeometry.attributes.position.needsUpdate = true

        let newLifePositionList = [lifePositionList.x, lifePositionList.y, lifePositionList.z]

        for (let i = 0; i < 3; i++) {
            bufferGeometry.attributes.position.array[(index * 3) + i] = newLifePositionList[i] + this.positionList[i]
            bufferGeometry.attributes.position.needsUpdate = true
        }

    }
    getMass() {
        return this.mass;
    }

    getPositionVector() {
        return this.positionVector3;
    }

}

export {
    Microplastic
}