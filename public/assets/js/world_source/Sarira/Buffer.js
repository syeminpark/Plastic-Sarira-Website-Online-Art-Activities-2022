import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class Buffer {

    constructor(positionList,colorList,maxPoints = 300,) {
        this.maxPoints = maxPoints
        positionList != undefined ? this.positionList=positionList : this.positionList = new Float32Array(this.maxPoints * 3)
        //colorList != undefined ? this.colorList=colorList : this.colorList = new Float32Array(this.maxPoints * 3)

        this.bufferGeometry
    }

    
    initializeMaterial() {
        let pointMaterial = new THREE.PointsMaterial({
            vertexColors: THREE.VertexColors,
            size: 5
        });
        return pointMaterial
    }

    initialize(material) {
        this.bufferGeometry = new THREE.BufferGeometry();
        this.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positionList, 3));
        //this.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colorList, 3));
        this.bufferGeometry.setDrawRange(0, 0);

        this.point = new THREE.Points(this.bufferGeometry, material);
    }

    render(threeSystem) {
        threeSystem.scene.add(this.point)
    }

    getBufferGeometry(){
        return this.bufferGeometry;
    }
}

export {Buffer}