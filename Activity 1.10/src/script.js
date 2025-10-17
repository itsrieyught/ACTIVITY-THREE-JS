import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('/textures/matcaps/5.png')
const matcapTexture6 = textureLoader.load('/textures/matcaps/6.png')
const matcapTexture7 = textureLoader.load('/textures/matcaps/7.png')
const matcapTexture8 = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

const textureOptions = {
    'Color': doorColorTexture,
    'Alpha': doorAlphaTexture,
    'AO': doorAmbientOcclusionTexture,
    'Height': doorHeightTexture,
    'Normal': doorNormalTexture,
    'Metalness': doorMetalnessTexture,
    'Roughness': doorRoughnessTexture,
    'Matcap 1': matcapTexture1,
    'Matcap 2': matcapTexture2,
    'Matcap 3': matcapTexture3,
    'Matcap 4': matcapTexture4,
    'Matcap 5': matcapTexture5,
    'Matcap 6': matcapTexture6,
    'Matcap 7': matcapTexture7,
    'Matcap 8': matcapTexture8,
    'Gradient': gradientTexture
}

const textureParams = {
    selectedTexture: 'Color'
}

/**
 * Material
 */
// const material = new THREE.MeshBasicMaterial({
//     map: doorColorTexture,
//     color: new THREE.Color('#ff0000'),
//     wireframe: true
// })

// material.transparent = true
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
sphere.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// Add UV2 attributes for ambient occlusion
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Debug
 */
const gui = new dat.GUI()

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'wireframe').name('Wireframe')

// Add texture selector dropdown
gui.add(textureParams, 'selectedTexture', Object.keys(textureOptions))
    .name('Texture')
    .onChange((value) => {
        const selectedTex = textureOptions[value]
        
        // Update material based on texture type
        if (value.startsWith('Matcap')) {
            // Switch to MeshMatcapMaterial
            const newMaterial = new THREE.MeshMatcapMaterial({
                matcap: selectedTex,
                wireframe: material.wireframe
            })
            sphere.material = newMaterial
            plane.material = newMaterial
            torus.material = newMaterial
            material.dispose()
            Object.assign(material, newMaterial)
        } else if (value === 'Alpha') {
            // Use basic material with alpha
            const newMaterial = new THREE.MeshBasicMaterial({
                map: doorColorTexture,
                alphaMap: selectedTex,
                transparent: true,
                wireframe: material.wireframe
            })
            sphere.material = newMaterial
            plane.material = newMaterial
            torus.material = newMaterial
            material.dispose()
            Object.assign(material, newMaterial)
        } else {
            // Use basic material with selected texture
            const newMaterial = new THREE.MeshBasicMaterial({
                map: selectedTex,
                wireframe: material.wireframe
            })
            sphere.material = newMaterial
            plane.material = newMaterial
            torus.material = newMaterial
            material.dispose()
            Object.assign(material, newMaterial)
        }
    })

/**
 * Resize Handling
 */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()