# Three.js Implementation Patterns

## Scene Setup

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
camera.position.set(0, 2, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)) // cap at 2x
renderer.shadowMap.enabled = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
document.body.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.4))
const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(5, 10, 7.5)
dirLight.castShadow = true
scene.add(dirLight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})
```

## Awwwards-Grade Materials

```js
// Glass/crystal — awwwards staple
const glass = new THREE.MeshPhysicalMaterial({
  transmission: 0.95, ior: 1.5, thickness: 0.5,
  roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.1,
  envMapIntensity: 1.5,
})

// Iridescent — holographic feel
const iridescent = new THREE.MeshPhysicalMaterial({
  iridescence: 1, iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],
  metalness: 0.8, roughness: 0.2,
})

// Liquid metal
const liquidMetal = new THREE.MeshPhysicalMaterial({
  metalness: 1, roughness: 0.05,
  envMapIntensity: 2, clearcoat: 0.5,
  color: new THREE.Color('#0047FF'),
})
```

## Custom Shader Template

```js
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 4.0 + uTime) * 0.2;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec3 color = 0.5 + 0.5 * cos(uTime + vUv.xyx + vec3(0, 2, 4));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
})
// In animate(): material.uniforms.uTime.value = clock.getElapsedTime()
```

## Post-Processing Pipeline

```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(innerWidth, innerHeight),
  0.8,  // strength
  0.3,  // radius
  0.85  // threshold
))
// In animate(): composer.render() instead of renderer.render()
```

## Model Loading (glTF + Draco)

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/model.glb', (gltf) => {
  const model = gltf.scene
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  scene.add(model)
})
```

## Vue/Nuxt Integration (TresJS)

```vue
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
</script>

<template>
  <TresCanvas shadows alpha>
    <TresPerspectiveCamera :position="[0, 2, 5]" />
    <OrbitControls />
    <TresMesh :position="[0, 1, 0]" cast-shadow>
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="#0047FF" :metalness="0.8" :roughness="0.2" />
    </TresMesh>
    <TresDirectionalLight :position="[5, 10, 5]" :intensity="1" cast-shadow />
    <TresAmbientLight :intensity="0.4" />
  </TresCanvas>
</template>
```

## Performance Rules

1. **InstancedMesh** for 100+ identical objects
2. **setPixelRatio(Math.min(devicePixelRatio, 2))** — never 3x
3. **Dispose everything**: geometry, material, texture on cleanup
4. **Texture max**: 2048x2048, KTX2/Basis compression
5. **LOD** for complex scenes with distance-based detail
6. **requestAnimationFrame** — NEVER setInterval
7. **Stats.js** during development: `three/addons/libs/stats.module.js`

## Common Pitfalls

- No `.dispose()` = memory leak
- No pixel ratio cap = GPU overload on Retina
- `MeshBasicMaterial` with no lighting = flat/ugly
- Sync model loading = UI jank (always async)
- Missing `envMap` on metallic = looks plastic
