import config from "./utils/config.js";
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { MyMath } from "./utils/MyMath.js";

export class Boundary {
    constructor(particleCount,material) {

        let boundaryParticlePositions = [];

        for (let i = 0; i < particleCount * 0.1; i++) {
            boundaryParticlePositions.push(new THREE.Vector3(
                MyMath.random(-config.worldSize, config.worldSize),
                MyMath.random(-config.worldSize, config.worldSize),
                MyMath.random(-config.worldSize, config.worldSize)).setLength(config.worldSize));
        }
        let geometry = new THREE.BufferGeometry().setFromPoints(boundaryParticlePositions);
        let worldBoundary = new THREE.Points(geometry, material);
        worldBoundary.position.set(0, 0, 0);
        return worldBoundary
    }
}