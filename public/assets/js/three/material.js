import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export function createConvexMaterial() {
    return new THREE.MeshPhysicalMaterial({
        transmission: 0.95,
        thickness: 1,
        roughness: 0.3,
        clearcoat: 1,
        metalness: 0,
        clearcoatRoughness: 0,
    })
}

export function createGlassMaterial() {
    return new THREE.MeshPhysicalMaterial({
        transmission: 0.99,
        thickness: 1,
        roughness: 0,
        clearcoat: 1,
        metalness: 0.4,
        clearcoatRoughness: 1,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,

    })
}

export function createPointMaterial() {
    return new THREE.PointsMaterial({
        color: 'white',
        size: 0.3,
        side: THREE.DoubleSide,

    });
}


export function createStandardMaterial() {
    return new THREE.MeshStandardMaterial({
        color: 'white',
        transparent: true,
        depthWrite:true,
        depthTest:true,
        opacity: 0.5,
        metalness: 0.3,
        roughness: 0.1,
        side: THREE.DoubleSide,
    });
}