import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import ConvexGeometry from './ConvexGeometry.js';
export default class Convex {

    constructor(threeSystem, material) {
        this.vertices = []
        this.meshObject = {}
        this.threeSystem = threeSystem
        this.materialBack = material
        
        this.meshGeometry;
        this.convexMeshBack;
        this.convexMeshFront;
        this.materialFront = this.materialBack.clone()
        this.group = new THREE.Object3D
        this.group.name =  Symbol('sari') 

        this.threeSystem.addToGroupList(this.group.name)


    }

    //must be at least three points. 
    initializeBuffer(bufferGeometry) {
        const positionAttribute = bufferGeometry.getAttribute('position');

        for (let i = 0; i < 4; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positionAttribute, i);
            this.vertices.push(vertex);
        }
        this.meshGeometry = new ConvexGeometry(this.vertices);

    }

    updateBuffer(plastic) {
        this.clearObject()
        this.vertices.push(plastic.positionVector3);
        this.meshGeometry = new ConvexGeometry(this.vertices);
        
    }



    updateVertices(bufferGeometry, sariraListlength) {
    
        this.vertices = []
        const positionAttribute = bufferGeometry.getAttribute('position');

        for (let i = 0; i < sariraListlength; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positionAttribute, i);
            this.vertices.push(vertex)
        }
        this.meshGeometry = new ConvexGeometry(this.vertices);
    }


    initializeMesh() {
        this.convexMeshBack = new THREE.Mesh(this.meshGeometry, this.materialBack);
        this.convexMeshBack.material.side = THREE.BackSide; // back faces
        this.convexMeshBack.renderOrder = 0;
        this.convexMeshFront = new THREE.Mesh(this.meshGeometry, this.materialFront);
        this.convexMeshFront.material.side = THREE.FrontSide; // front faces
        this.convexMeshFront.renderOrder = 1
        this.group.add(this.convexMeshBack)
        this.group.add(this.convexMeshFront)
        
      


        this.threeSystem.scene.add(this.group)

    }

    clearObject() {
        let selectedObject = this.threeSystem.scene.getObjectByName(this.groupName);
        this.threeSystem.scene.remove(selectedObject);
        this.meshGeometry.dispose()
        this.group.clear()
     
    }

}