import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class Buffer {

    constructor(positionList, colorList, maxPoints = 10000, ) {
        this.maxPoints = maxPoints
        positionList != undefined ? this.positionList = positionList : this.positionList = new Float32Array(this.maxPoints * 3)
        //colorList != undefined ? this.colorList=colorList : this.colorList = new Float32Array(this.maxPoints * 3)

        this.bufferGeometry
      
    }


    getBoundingBox() {
        this.bufferGeometry.computeBoundingBox()
        const boundingbox = this.bufferGeometry.boundingBox
        return {
            width: boundingbox.max.x - boundingbox.min.x,
            depth: boundingbox.max.z - boundingbox.min.z,
            height: boundingbox.max.y - boundingbox.min.y
        }
    }




    initialize(material) {
        this.bufferGeometry = new THREE.BufferGeometry();
        this.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positionList, 3));
        //this.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colorList, 3));
        this.bufferGeometry.setDrawRange(0, 0);

        this.point = new THREE.Points(this.bufferGeometry, material);
        this.point.frustumCulled = false

    }

    render(threeSystem) {
        threeSystem.addToGroup(this.point)
    }

    getBufferGeometry() {
        return this.bufferGeometry;
    }
    dispose() {
        this.bufferGeometry.dispose()
    }

}

export {
    Buffer
}