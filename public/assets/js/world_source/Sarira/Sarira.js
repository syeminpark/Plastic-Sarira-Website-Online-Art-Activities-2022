import {
    Core
} from './Core.js'

import Convex from '/assets/js/three/Convex.js'
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class Sarira {
    constructor(threeSystem, particleMaterial, convexMaterial, bufferGeometry) {
        this.plasticList = []
        this.threeSystem = threeSystem
        this.particleMaterial = particleMaterial
        this.convex;
        this.convexMaterial = convexMaterial
        this.bufferGeometry = bufferGeometry

        this.positionVector3 = new THREE.Vector3(0, 0, 0);
    }


    initializeCore() {
        this.plasticList.push(new Core(this.threeSystem,this.particleMaterial))
        this.plasticList[0].initialize(this.positionVector3)
        this.plasticList[0].updateBuffer(this.bufferGeometry, this.plasticList.length);
    }

    initializeConvex() {
        if (this.convex == undefined && this.plasticList.length > 3) {
            this.convex = new Convex(this.threeSystem,this.convexMaterial)
            this.convex.initializeBuffer(this.bufferGeometry)
            this.convex.initializeMesh()
        }
    }
    addPlastics(micro) {
        this.plasticList.push(micro)
    }

    setPosition() {
        for (let [index, plastic] of this.plasticList.entries()) {
            plastic.setPositionVector(this.bufferGeometry, index);
        }
    }


    getPlasticList() {
        return this.plasticList;
    }

    getPlasticListLength() {
        return this.plasticList.length;
    }


    updateConvexAll() {
        if (this.convex != undefined && this.plasticList.length > 3) {
            this.convex.clearObject()
            this.convex.updateVertices(this.bufferGeometry, this.plasticList.length)
            this.convex.initializeMesh()
        }
    }

    updateConvex(micro) {
        if (this.convex != undefined) {
            this.convex.updateBuffer(micro)
            this.convex.initializeMesh()
        }
    }

    updateVerticesFromLife(positionList) {
        for (let [index, plastic] of this.plasticList.entries()) {
            plastic.moveWithLife(positionList, this.bufferGeometry, index)
        }
    }
}

export {
    Sarira
}