import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => { console.log('loading started') }
loadingManager.onLoad = () => { console.log('loading finished') }
loadingManager.onProgress = () => { console.log('loading progressing') }
loadingManager.onError = () => { console.log('loading error') }

const textureLoader = new THREE.TextureLoader(loadingManager)

const minecraftTexture = textureLoader.load('/textures/minecraft.png')
minecraftTexture.generateMipmaps = false
minecraftTexture.minFilter = THREE.NearestFilter
minecraftTexture.magFilter = THREE.NearestFilter

const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const textureOptions = {
    'Color': colorTexture,
    'Alpha': alphaTexture,
    'Height': heightTexture,
    'Normal': normalTexture,
    'Ambient Occlusion': ambientOcclusionTexture,
    'Metalness': metalnessTexture,
    'Roughness': roughnessTexture,
    'Minecraft': minecraftTexture
}

const textureParams = {
    selectedTexture: 'Color'
}

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(2, 2, 2)
scene.add(directionalLight)

/**
 * Object
 */
const geometryOptions = {
    Box: () => new THREE.BoxGeometry(1, 1, 1),
    Sphere: () => new THREE.SphereGeometry(1, 32, 32),
    Cone: () => new THREE.ConeGeometry(1, 1, 32),
    Torus: () => new THREE.TorusGeometry(1, 0.35, 32, 100)
}

const geometryParams = {
    selectedGeometry: 'Box'
}

const parameters = {
    color: 0xff0000,
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
}

const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    alphaMap: alphaTexture,
    displacementMap: heightTexture,
    normalMap: normalTexture,
    aoMap: ambientOcclusionTexture,
    metalnessMap: metalnessTexture,
    roughnessMap: roughnessTexture,
    transparent: true,
    color: parameters.color
})

let mesh = new THREE.Mesh(geometryOptions[geometryParams.selectedGeometry](), material)
mesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2))
scene.add(mesh)

/**
 * GUI Controls
 */
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')
gui.addColor(parameters, 'color').onChange(() => {
    material.color.set(parameters.color)
})
gui.add(parameters, 'spin')

// Texture switcher
gui.add(textureParams, 'selectedTexture', Object.keys(textureOptions))
    .name('Texture')
    .onChange((value) => {
        material.map = textureOptions[value]
        material.needsUpdate = true
    })

// Geometry switcher
gui.add(geometryParams, 'selectedGeometry', Object.keys(geometryOptions))
    .name('Geometry')
    .onChange((value) => {
        const newGeometry = geometryOptions[value]()
        mesh.geometry.dispose()
        mesh.geometry = newGeometry
        mesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2))
    })

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) canvas.requestFullscreen()
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen()
    } else {
        if (document.exitFullscreen) document.exitFullscreen()
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    }
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
