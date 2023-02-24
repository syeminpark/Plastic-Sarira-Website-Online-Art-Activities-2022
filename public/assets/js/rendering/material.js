import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import {lifeShader, lifeShader_noise, lifeShader2} from './shader.js'
import config from '../utils/config.js';

export function createConvexMaterial() {
    return new THREE.MeshPhysicalMaterial({
        transmission: 0.99,
        thickness: 1,
        roughness: 0.2,
        clearcoat: 1,
        metalness: 0,
        clearcoatRoughness: 1,
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
export function createSariraParticleMaterial(){
    return new THREE.PointsMaterial({
        color: 'white',
        size: config.particleSize,
    });
}

export function createParticleMaterial(){
    return new THREE.PointsMaterial({
        color: 'white',
        size: config.particleSize,
        vertexColors:true
       
    });
}
export function createInvisibleMaterial() {
    return new THREE.PointsMaterial({
        color: 'white',
        transparent: true,
        size: config.particleSize,
        vertexColors: true,
    });
}


export function createStandardMaterial() {
    return new THREE.MeshStandardMaterial({
        color: 'white',
        // transparent: true,
        depthWrite:true,
        depthTest:true,
        opacity: 0.9,
        metalness: 0,
        roughness: 0,
        side: THREE.DoubleSide,
        emissive:'black',
        emissiveIntensity :10,
        // blending: THREE.AdditiveBlending,
        // flatShading:true,
    });
}


// 이전 방식
export function createLifeMaterial(camera){
    return new THREE.ShaderMaterial({
        uniforms:
        {
            "c": { type: "f", value: 1.0 },
            "p": { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new THREE.Color(0xffffff) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: lifeShader.vertexShader, 
        fragmentShader: lifeShader.fragmentShader, 
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending
    });
}

// 노이즈 쉐이더
export function createLifeNoiseMaterial(camera, count, gap){
    return new THREE.ShaderMaterial({
        uniforms: { 
            // float initialized to 0
            time: { type: "f", value: 0.0 },
            noiseCount:{type: "f", value: count},
            noiseGap:{type: "f", value: gap},

            "c": { type: "f", value: 1.0 },
            "p": { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new THREE.Color(0xffffff) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: lifeShader_noise.vertexShader, 
        fragmentShader: lifeShader_noise.fragmentShader,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending
    });
}

// 노이즈 쉐이더2
export function createLifeNoiseMaterial2(camera, noiseShape, noiseSpeed){
    return new THREE.ShaderMaterial({
        vertexShader: lifeShader2.vertexShader,
        fragmentShader: lifeShader2.fragmentShader,
        uniforms: {
            uTime: { type: 'f', value: 0.0 },
            uSpeed: { value: noiseSpeed },
            uNoiseDensity: { value: 1.2 },
            uNoiseStrength: { value: noiseShape },
            uFrequency: { value: .2 },
            uAmplitude: { value: .15 },
            uRed: { value: .3 },
            uBlue: { value: .3 },

            "c": { type: "f", value: 1.0 },
            "p": { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new THREE.Color(0xffffff) },
            viewVector: { type: "v3", value: camera.position }
        },
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending
    });
}