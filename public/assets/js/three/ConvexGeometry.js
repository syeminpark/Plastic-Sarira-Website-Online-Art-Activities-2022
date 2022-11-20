import ConvexHull from "./ConvexHull.js";
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

 class ConvexGeometry extends THREE.BufferGeometry {

    constructor(points, color) {

        super(); // buffers

        const vertices = [];
        const normals = [];


        const convexHull = new ConvexHull().setFromPoints(points); // generate vertices and normals

        const faces = convexHull.faces;

        for (let i = 0; i < faces.length; i++) {

            const face = faces[i];
            let edge = face.edge; // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)

            do {

                const point = edge.head().point;
                vertices.push(point.x, point.y, point.z);
                normals.push(face.normal.x, face.normal.y, face.normal.z);
                edge = edge.next;

            } while (edge !== face.edge);

        } // build geometry
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));

    }

}

export default ConvexGeometry;